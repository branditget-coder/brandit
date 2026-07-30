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
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final UserActivityLogRepository activityLogRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(User.Role.USER)
                .provider(User.AuthProvider.LOCAL)
                .verificationToken(UUID.randomUUID().toString())
                .build();

        User savedUser = userRepository.save(user);

        activityLogRepository.save(UserActivityLog.builder()
                .user(savedUser)
                .action("USER_REGISTER")
                .metadataJson("Registered via local email: " + savedUser.getEmail())
                .build());

        String accessToken = tokenProvider.generateAccessToken(savedUser.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getEmail());

        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUser(mapToUserDto(savedUser));
        return response;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

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
    public AuthResponse loginWithSocial(String email, String firstName, String lastName, User.AuthProvider provider, String providerId) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
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
        String email = tokenProvider.getEmailFromToken(request.getRefreshToken());
        User user = userRepository.findByEmail(email)
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
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            user.setResetPasswordToken(UUID.randomUUID().toString());
            user.setResetPasswordTokenExpiry(LocalDateTime.now().plusHours(1));
            userRepository.save(user);

            activityLogRepository.save(UserActivityLog.builder()
                    .user(user)
                    .action("FORGOT_PASSWORD_REQUEST")
                    .metadataJson("Password reset token generated")
                    .build());
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

    public UserDto getCurrentUserDto(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return mapToUserDto(user);
    }

    @Transactional
    public UserDto updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
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
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
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
