package com.brandit;

import com.brandit.user.dto.AuthDtos.*;
import com.brandit.user.entity.User;
import com.brandit.user.repository.UserRepository;
import com.brandit.user.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.lang.reflect.Field;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class BranditAuthTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("End-to-End Registration Flow: OTP Dispatch -> Verification -> User Creation")
    void testRegistrationFlow() {
        String email = "testuser" + System.currentTimeMillis() + "@example.com";

        // 1. Request OTP
        SendOtpRequest otpReq = new SendOtpRequest();
        otpReq.setEmail(email);
        otpReq.setFirstName("Alice");
        authService.sendRegistrationOtp(otpReq);

        String otp = authService.getStoredOtpForTesting(email);
        assertNotNull(otp, "OTP should be generated and stored");
        assertEquals(6, otp.length(), "OTP must be 6 digits");

        // 2. Register with correct OTP
        RegisterRequest regReq = new RegisterRequest();
        regReq.setFirstName("Alice");
        regReq.setLastName("Wonderland");
        regReq.setEmail(email);
        regReq.setPassword("SecurePassword123!");
        regReq.setBirthDay(15);
        regReq.setBirthMonth(6);
        regReq.setBirthYear(1995);
        regReq.setRole(User.Role.USER);
        regReq.setOtp(otp);

        AuthResponse regResp = authService.register(regReq);
        assertNotNull(regResp);
        assertNotNull(regResp.getAccessToken(), "Access token should be issued upon registration");
        assertNotNull(regResp.getRefreshToken(), "Refresh token should be issued");
        assertEquals(email, regResp.getUser().getEmail());

        // 3. Login with credentials
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail(email);
        loginReq.setPassword("SecurePassword123!");
        AuthResponse loginResp = authService.login(loginReq);

        assertNotNull(loginResp);
        assertNotNull(loginResp.getAccessToken(), "Login should issue access token");
        assertEquals("Alice", loginResp.getUser().getFirstName());

        // 4. Login with bad credentials should fail
        LoginRequest badLogin = new LoginRequest();
        badLogin.setEmail(email);
        badLogin.setPassword("WrongPassword!");
        assertThrows(Exception.class, () -> authService.login(badLogin));
    }

    @Test
    @DisplayName("OTP Security: 5 failed attempts invalidates the OTP code")
    void testOtpFailedAttemptsLockout() throws Exception {
        String email = "lockout" + System.currentTimeMillis() + "@example.com";

        SendOtpRequest otpReq = new SendOtpRequest();
        otpReq.setEmail(email);
        otpReq.setFirstName("Bob");
        authService.sendRegistrationOtp(otpReq);

        RegisterRequest regReq = new RegisterRequest();
        regReq.setFirstName("Bob");
        regReq.setLastName("Builder");
        regReq.setEmail(email);
        regReq.setPassword("SecurePassword123!");
        regReq.setBirthDay(1);
        regReq.setBirthMonth(1);
        regReq.setBirthYear(1990);
        regReq.setRole(User.Role.USER);
        regReq.setOtp("000000"); // Wrong OTP

        // Attempt 1 to 4 should report remaining attempts
        for (int i = 1; i <= 4; i++) {
            IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.register(regReq));
            assertTrue(ex.getMessage().contains("attempt(s) remaining"));
        }

        // 5th attempt should invalidate OTP
        IllegalArgumentException lockoutEx = assertThrows(IllegalArgumentException.class, () -> authService.register(regReq));
        assertTrue(lockoutEx.getMessage().contains("invalidated for security"));

        // Subsequent attempt shows expired/invalid
        IllegalArgumentException expiredEx = assertThrows(IllegalArgumentException.class, () -> authService.register(regReq));
        assertTrue(expiredEx.getMessage().contains("expired or is invalid"));
    }

    @Test
    @DisplayName("Social Login Flow: Creates new user safely and generates JWT tokens")
    void testSocialLoginFlow() {
        String email = "social" + System.currentTimeMillis() + "@example.com";

        AuthResponse resp = authService.loginWithSocial(
                email,
                "Charlie",
                "Brown",
                User.AuthProvider.LOCAL,
                "social-id-12345"
        );

        assertNotNull(resp);
        assertNotNull(resp.getAccessToken());
        assertEquals(email, resp.getUser().getEmail());
        assertTrue(userRepository.existsByEmailIgnoreCase(email));
    }
}
