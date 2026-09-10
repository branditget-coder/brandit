package com.brandit.dto;

import com.brandit.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDtos {

    @Data
    public static class SendOtpRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        private String firstName;

        public void setEmail(String email) {
            this.email = email != null ? email.trim().toLowerCase() : null;
        }
    }

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "First name is required")
        private String firstName;

        @NotBlank(message = "Last name is required")
        private String lastName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;

        private String phone;
        private User.Role role;
        private String otp;

        @jakarta.validation.constraints.NotNull(message = "Birth date (day) is required")
        @jakarta.validation.constraints.Min(value = 1, message = "Day must be between 1 and 31")
        @jakarta.validation.constraints.Max(value = 31, message = "Day must be between 1 and 31")
        private Integer birthDay;

        @jakarta.validation.constraints.NotNull(message = "Birth month is required")
        @jakarta.validation.constraints.Min(value = 1, message = "Month must be between 1 and 12")
        @jakarta.validation.constraints.Max(value = 12, message = "Month must be between 1 and 12")
        private Integer birthMonth;

        @jakarta.validation.constraints.NotNull(message = "Birth year is required")
        @jakarta.validation.constraints.Min(value = 1920, message = "Please enter a valid birth year")
        @jakarta.validation.constraints.Max(value = 2026, message = "Please enter a valid birth year")
        private Integer birthYear;

        public void setEmail(String email) {
            this.email = email != null ? email.trim().toLowerCase() : null;
        }
    }

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public void setEmail(String email) {
            this.email = email != null ? email.trim().toLowerCase() : null;
        }
    }

    @Data
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private UserDto user;
    }

    @Data
    public static class RefreshTokenRequest {
        @NotBlank
        private String refreshToken;
    }

    @Data
    public static class SocialLoginRequest {
        @NotBlank(message = "Token or credential is required")
        private String token;
        private String email;
        private String firstName;
        private String lastName;

        public void setEmail(String email) {
            this.email = email != null ? email.trim().toLowerCase() : null;
        }
    }

    @Data
    public static class ForgotPasswordRequest {
        @NotBlank @Email
        private String email;

        public void setEmail(String email) {
            this.email = email != null ? email.trim().toLowerCase() : null;
        }
    }

    @Data
    public static class ResetPasswordRequest {
        @NotBlank
        private String token;

        @NotBlank
        @Size(min = 8)
        private String newPassword;
    }

    @Data
    public static class UserDto {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String linkedinUrl;
        private String currentRole;
        private String bio;
        private User.Role role;
        private boolean emailVerified;
        private String avatarUrl;
        private Integer birthDay;
        private Integer birthMonth;
        private Integer birthYear;
        private java.time.LocalDate dateOfBirth;
    }

    @Data
    public static class UpdateProfileRequest {
        private String firstName;
        private String lastName;
        private String phone;
        private String linkedinUrl;
        private String currentRole;
        private String bio;
        private String avatarUrl;
        private Integer birthDay;
        private Integer birthMonth;
        private Integer birthYear;
    }

    @Data
    public static class ChangePasswordRequest {
        @NotBlank(message = "Current password is required")
        private String currentPassword;

        @NotBlank(message = "New password is required")
        @Size(min = 6, message = "New password must be at least 6 characters")
        private String newPassword;
    }
}
