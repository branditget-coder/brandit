package com.brandit.service;

import com.brandit.dto.AuthDtos.*;
import com.brandit.entity.User;
import com.brandit.entity.UserActivityLog;
import com.brandit.repository.UserActivityLogRepository;
import com.brandit.repository.UserRepository;
import com.brandit.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final UserActivityLogRepository activityLogRepository;
    private final EmailService emailService;

    public static final java.util.List<String> ALLOWED_TEAM_EMAILS = java.util.List.of(
            "raghavdhir1510@gmail.com",    // Raghav Dhir (Lead Admin)
            "raghavdhir.work@gmail.com",   // Raghav Dhir Work Email (Admin)
            "dhawankritika866@gmail.com",   // Kritika Dhawan (Operations & HR)
            "sethhritika@gmail.com",       // Hritika Seth (Lead Consultant)
            "bhardwajstuti101@gmail.com",   // Stuti Sharma (HR)
            "yashjainnn13@gmail.com",      // Yash Jain (Finance & Accounting)
            "yashjain13@gmail.com"         // Yash Jain Alias
    );

    private final Map<String, OtpData> registrationOtpStore = new java.util.concurrent.ConcurrentHashMap<>();

    @lombok.Data
    @lombok.AllArgsConstructor
    public static class OtpData {
        private String code;
        private LocalDateTime expiryTime;
    }

    private String cleanEmail(String email) {
        return email != null ? email.trim().toLowerCase() : "";
    }

    public com.brandit.dto.CommonDtos.MessageResponse sendRegistrationOtp(SendOtpRequest request) {
        String email = cleanEmail(request.getEmail());
        if (email.isBlank()) {
            throw new IllegalArgumentException("Email address is required.");
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email is already registered. Please sign in instead.");
        }

        // Generate 4-digit numeric OTP
        String otp = String.format("%04d", new java.security.SecureRandom().nextInt(10000));
        registrationOtpStore.put(email, new OtpData(otp, LocalDateTime.now().plusMinutes(10)));

        EmailService.EmailDispatchResult result = emailService.sendRegistrationOtpEmail(email, request.getFirstName(), otp);

        if (!result.isSuccess()) {
            org.slf4j.LoggerFactory.getLogger(AuthService.class).warn("⚠️ Registration OTP [{}] for {} could not be dispatched via remote mail API. Code cached for registration.", otp, email);
        }

        return new com.brandit.dto.CommonDtos.MessageResponse("A 4-digit verification code has been sent to your registered email address (" + email + ").");
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = cleanEmail(request.getEmail());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("Email is already registered. Please sign in instead.");
        }

        // 4-Digit OTP Verification for first-time registering users
        String userOtp = request.getOtp() != null ? request.getOtp().trim() : "";
        if (userOtp.isBlank()) {
            SendOtpRequest sendOtpReq = new SendOtpRequest();
            sendOtpReq.setEmail(email);
            sendOtpReq.setFirstName(request.getFirstName());
            sendRegistrationOtp(sendOtpReq);
            throw new IllegalArgumentException("A 4-digit verification code has been sent to " + email + ". Please enter the code below to complete registration.");
        }

        OtpData otpData = registrationOtpStore.get(email);
        if (otpData == null || otpData.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification code has expired or is invalid. Please click 'Resend Code'.");
        }

        if (!otpData.getCode().equalsIgnoreCase(userOtp)) {
            throw new IllegalArgumentException("Incorrect 4-digit verification code. Please check your email and try again.");
        }

        // OTP verified successfully -> remove from temporary store
        registrationOtpStore.remove(email);

        boolean isAuthorizedTeamEmail = ALLOWED_TEAM_EMAILS.stream().anyMatch(e -> e.equalsIgnoreCase(email));

        User.Role assignedRole = request.getRole() != null ? request.getRole() : User.Role.USER;
        
        boolean isRaghavAdmin = email.equalsIgnoreCase("raghavdhir1510@gmail.com") || email.equalsIgnoreCase("raghavdhir.work@gmail.com");

        // Strict Security Rule: ONLY pre-authorized team members can register or get TEAM/ADMIN roles!
        if (assignedRole == User.Role.TEAM || assignedRole == User.Role.ADMIN) {
            if (!isAuthorizedTeamEmail) {
                assignedRole = User.Role.USER; // Automatically force all unauthorized registrants to Client (USER) role!
            } else if (isRaghavAdmin) {
                assignedRole = User.Role.ADMIN;
            }
        } else if (isAuthorizedTeamEmail) {
            // Auto-grant TEAM/ADMIN role if an authorized team member registers
            assignedRole = isRaghavAdmin ? User.Role.ADMIN : User.Role.TEAM;
        }

        User user = User.builder()
                .firstName(request.getFirstName() != null ? request.getFirstName().trim() : "")
                .lastName(request.getLastName() != null ? request.getLastName().trim() : "")
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(assignedRole)
                .provider(User.AuthProvider.LOCAL)
                .emailVerified(true)
                .verificationToken(UUID.randomUUID().toString())
                .build();

        User savedUser = userRepository.save(user);

        activityLogRepository.save(UserActivityLog.builder()
                .user(savedUser)
                .action("USER_REGISTER")
                .metadataJson("Registered via local email: " + savedUser.getEmail())
                .build());

        // Dispatch HTML Welcome Email
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole().name());

        String accessToken = tokenProvider.generateAccessToken(savedUser.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getEmail());

        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUser(mapToUserDto(savedUser));
        return response;
    }

    public AuthResponse login(LoginRequest request) {
        String email = cleanEmail(request.getEmail());
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (user.getPassword() == null) {
            throw new IllegalArgumentException("This account was created via social sign-in. Please use social sign-in or reset your password.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        activityLogRepository.save(UserActivityLog.builder()
                .user(user)
                .action("USER_LOGIN")
                .metadataJson("Logged in via email/password")
                .build());

        String accessToken = tokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUser(mapToUserDto(user));
        return response;
    }

    @Transactional
    public AuthResponse loginWithSocial(String rawEmail, String firstName, String lastName, User.AuthProvider provider, String providerId) {
        String email = cleanEmail(rawEmail);
        User user = userRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
            User newUser = User.builder()
                    .firstName(firstName != null ? firstName : "User")
                    .lastName(lastName != null ? lastName : "")
                    .email(email)
                    .role(User.Role.USER)
                    .provider(provider)
                    .providerId(providerId)
                    .emailVerified(true)
                    .build();
            return userRepository.save(newUser);
        });

        activityLogRepository.save(UserActivityLog.builder()
                .user(user)
                .action("SOCIAL_LOGIN")
                .metadataJson("Logged in via " + provider)
                .build());

        String accessToken = tokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUser(mapToUserDto(user));
        return response;
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        String email = cleanEmail(tokenProvider.getEmailFromToken(request.getRefreshToken()));
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String newAccessToken = tokenProvider.generateAccessToken(email);
        AuthResponse response = new AuthResponse();
        response.setAccessToken(newAccessToken);
        response.setRefreshToken(request.getRefreshToken());
        response.setUser(mapToUserDto(user));
        return response;
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = cleanEmail(request.getEmail());
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            user.setResetPasswordToken(UUID.randomUUID().toString());
            user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1));
            userRepository.save(user);

            activityLogRepository.save(UserActivityLog.builder()
                    .user(user)
                    .action("FORGOT_PASSWORD_REQUEST")
                    .metadataJson("Password reset token generated")
                    .build());

            // Dispatch HTML Password Reset Email
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), user.getResetPasswordToken());
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));

        if (user.getResetPasswordTokenExpiry() != null && user.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiry(null);
        userRepository.save(user);

        activityLogRepository.save(UserActivityLog.builder()
                .user(user)
                .action("PASSWORD_RESET_SUCCESS")
                .metadataJson("Password changed successfully")
                .build());
    }

    public UserDto getCurrentUserDto(String rawEmail) {
        String email = cleanEmail(rawEmail);
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return mapToUserDto(user);
    }

    @Transactional
    public UserDto updateProfile(String rawEmail, UpdateProfileRequest request) {
        String email = cleanEmail(rawEmail);
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getLinkedinUrl() != null) user.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getCurrentRole() != null) user.setCurrentRole(request.getCurrentRole());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        User updatedUser = userRepository.save(user);

        activityLogRepository.save(UserActivityLog.builder()
                .user(updatedUser)
                .action("PROFILE_UPDATED")
                .metadataJson("User profile details updated")
                .build());

        return mapToUserDto(updatedUser);
    }

    @Transactional
    public void changePassword(String rawEmail, ChangePasswordRequest request) {
        String email = cleanEmail(rawEmail);
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getPassword() != null && !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        activityLogRepository.save(UserActivityLog.builder()
                .user(user)
                .action("CHANGE_PASSWORD_SUCCESS")
                .metadataJson("Password updated from profile security settings")
                .build());
    }

    public UserDto mapToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setLinkedinUrl(user.getLinkedinUrl());
        dto.setCurrentRole(user.getCurrentRole());
        dto.setBio(user.getBio());
        dto.setRole(user.getRole());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setAvatarUrl(user.getAvatarUrl());
        return dto;
    }
}
