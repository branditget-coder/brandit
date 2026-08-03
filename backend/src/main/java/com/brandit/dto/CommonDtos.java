package com.brandit.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

public class CommonDtos {

    // Contact
    @Data
    public static class ContactRequest {
        @NotBlank private String firstName;
        @NotBlank private String lastName;
        @NotBlank @Email private String email;
        private String phone;
        private String serviceInterested;
        @NotBlank private String message;
    }

    // Newsletter
    @Data
    public static class NewsletterRequest {
        @NotBlank @Email private String email;
    }

    // Blog
    @Data
    public static class BlogPostResponse {
        private Long id;
        private String title;
        private String slug;
        private String excerpt;
        private String category;
        private List<String> tags;
        private String authorName;
        private String coverImageUrl;
        private int readTimeMinutes;
        private boolean published;
        private LocalDateTime createdAt;
    }

    @Data
    public static class BlogPostDetailResponse extends BlogPostResponse {
        private String content;
        private String metaTitle;
        private String metaDescription;
    }

    @Data
    public static class CreateBlogRequest {
        @NotBlank private String title;
        @NotBlank private String content;
        private String excerpt;
        private String category;
        private List<String> tags;
        private String coverImageUrl;
        private String metaTitle;
        private String metaDescription;
        private int readTimeMinutes;
        private boolean published;
    }

    // Testimonial
    @Data
    public static class TestimonialRequest {
        @NotBlank private String clientName;
        private String clientRole;
        private String clientCompany;
        @NotBlank private String content;
        private String result;
        @Min(1) @Max(5) private int rating;
    }

    @Data
    public static class TestimonialResponse {
        private Long id;
        private String clientName;
        private String clientRole;
        private String clientCompany;
        private String clientAvatarUrl;
        private String content;
        private String result;
        private int rating;
        private boolean approved;
        private LocalDateTime createdAt;
    }

    // AI
    @Data
    public static class AIReviewRequest {
        @NotBlank private String resumeText;
        private String targetRole;
    }

    @Data
    public static class AIReviewResponse {
        private String overallScore;
        private List<String> strengths;
        private List<String> improvements;
        private String rewrittenSummary;
    }

    @Data
    public static class LinkedInHeadlineRequest {
        @NotBlank private String currentTitle;
        private String skills;
        private String targetRole;
        private String industry;
    }

    @Data
    public static class LinkedInHeadlineResponse {
        private List<String> headlines;
    }

    // Payments
    @Data
    public static class PaymentSessionRequest {
        @NotBlank private String planId;
        private String billingType; // monthly | onetime
    }

    @Data
    public static class PaymentSessionResponse {
        private String sessionId;
        private String url;
        private String razorpayOrderId;
    }

    // Generic
    @Data
    public static class MessageResponse {
        private String message;
        public MessageResponse(String message) { this.message = message; }
    }

    // Admin Analytics
    @Data
    public static class AdminAnalyticsResponse {
        private long totalUsers;
        private long totalBookings;
        private long totalRevenue;
        private double satisfactionRate;
    }

    // Admin User Summary
    @Data
    public static class UserAdminResponse {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String role;
        private boolean emailVerified;
        private LocalDateTime createdAt;
    }

    @Data
    public static class AdminCreateUserRequest {
        @NotBlank private String firstName;
        @NotBlank private String lastName;
        @NotBlank @Email private String email;
        @NotBlank private String password;
        private String phone;
        private String role; // USER, ADMIN, TEAM
        private boolean emailVerified = true;
    }

    @Data
    public static class AdminUpdateUserRequest {
        @NotBlank private String firstName;
        private String lastName;
        @NotBlank @Email private String email;
        private String phone;
        private String role;
        private Boolean emailVerified;
    }

    @Data
    public static class AdminUpdateRoleRequest {
        @NotBlank private String role;
    }
}
