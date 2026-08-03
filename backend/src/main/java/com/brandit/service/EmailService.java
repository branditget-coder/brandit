package com.brandit.service;

import com.brandit.service.email.EmailProviderStrategy;
import com.brandit.service.email.EmailTemplateBuilder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final EmailTemplateBuilder templateBuilder;
    private final List<EmailProviderStrategy> providerStrategies;

    @Value("${app.mail.from:onboarding@resend.dev}")
    private String fromEmail;

    @Value("${app.frontend.url:https://go-brandit.vercel.app}")
    private String frontendUrl;

    public static final List<String> TEAM_NOTIFICATION_EMAILS = List.of(
            "brandit.get@gmail.com",
            "raghavdhir1510@gmail.com",    // Admin Personal Email
            "sethhritika@gmail.com",       // Hritika Seth (Customer Acquisition)
            "dhawankritika866@gmail.com",   // Kritika Dhawan (Customer Acquisition)
            "bhardwajstuti101@gmail.com",   // Stuti Sharma (HR)
            "yashjainnn13@gmail.com"       // Yash Jain (Finance & Accounting)
    );

    @Data
    @AllArgsConstructor
    public static class EmailDispatchResult {
        private boolean success;
        private String providerUsed;
        private List<String> logs;
    }

    /**
     * Synchronous Dispatch for Diagnostics / Admin Testing
     */
    public EmailDispatchResult sendEmailSync(String to, String subject, String htmlBody) {
        List<String> auditLogs = new ArrayList<>();
        auditLogs.add("Starting dispatch to: " + to);
        auditLogs.add("Subject: " + subject);
        auditLogs.add("Total registered strategies: " + providerStrategies.size());

        for (EmailProviderStrategy provider : providerStrategies) {
            String name = provider.getProviderName();
            boolean configured = provider.isConfigured();
            auditLogs.add("Strategy '" + name + "' configured check: " + configured);

            if (configured) {
                auditLogs.add("Attempting send via strategy: " + name);
                boolean sent = provider.send(to, subject, htmlBody, fromEmail);
                if (sent) {
                    auditLogs.add("SUCCESS: Email sent via " + name);
                    return new EmailDispatchResult(true, name, auditLogs);
                }
                auditLogs.add("FAILED: Strategy " + name + " failed to send email. Trying next fallback...");
            }
        }

        auditLogs.add("CRITICAL: All available email strategies failed or were not configured.");
        return new EmailDispatchResult(false, "NONE", auditLogs);
    }

    /**
     * 1. Send Welcome Email on Account Registration
     */
    @Async
    public void sendWelcomeEmail(String toEmail, String clientName, String role) {
        String subject = "Welcome to BrandIt — Elevate Your Personal Brand!";
        String htmlBody = templateBuilder.buildWelcomeTemplate(clientName, toEmail, role, frontendUrl);
        sendEmailSync(toEmail, subject, htmlBody);
    }

    /**
     * 2. Send Booking & Payment Confirmation Email
     */
    @Async
    public void sendBookingConfirmation(String toEmail, String clientName, String serviceName, String bookingDate,
                                         String bookingTime, String price, String paymentId) {
        String subject = "Booking Confirmed: " + serviceName + " — BrandIt";
        String htmlBody = templateBuilder.buildBookingTemplate(clientName, serviceName, bookingDate, bookingTime, price, paymentId, frontendUrl);
        
        // 1. Send confirmation to the client who pays
        if (toEmail != null && !toEmail.isBlank()) {
            sendEmailSync(toEmail, subject, htmlBody);
        }

        // 2. Dispatch to Team (Customer Acquisition, HR, Admin)
        for (String teamEmail : TEAM_NOTIFICATION_EMAILS) {
            if (!teamEmail.equalsIgnoreCase(toEmail)) {
                sendEmailSync(teamEmail, "[NEW BOOKING] " + subject, htmlBody);
            }
        }
    }

    /**
     * 3. Send Password Reset Email
     */
    @Async
    public void sendPasswordResetEmail(String toEmail, String clientName, String resetToken) {
        String subject = "Reset Your BrandIt Account Password";
        String htmlBody = templateBuilder.buildPasswordResetTemplate(clientName, toEmail, resetToken, frontendUrl);
        sendEmailSync(toEmail, subject, htmlBody);
    }

    /**
     * 4. Send Contact Form Submission Notification to BrandIt Team & User Auto-Reply
     */
    @Async
    public void sendContactNotification(String senderName, String senderEmail, String phone, String serviceInterested,
                                         String messageText) {
        // Send instant receipt confirmation directly to user/visitor FIRST
        if (senderEmail != null && senderEmail.contains("@")) {
            String userSubject = "We Received Your Message — BrandIt Consulting";
            String userHtmlBody = templateBuilder.buildContactUserReceiptTemplate(senderName, serviceInterested, frontendUrl);
            sendEmailSync(senderEmail, userSubject, userHtmlBody);
        }

        // Send alert to Customer Acquisition, HR & Admin Team
        String adminSubject = "New Contact Inquiry from " + senderName + " — BrandIt";
        String adminHtmlBody = templateBuilder.buildContactNotificationTemplate(senderName, senderEmail, phone, serviceInterested, messageText, frontendUrl);
        for (String teamEmail : TEAM_NOTIFICATION_EMAILS) {
            sendEmailSync(teamEmail, adminSubject, adminHtmlBody);
        }
    }

    /**
     * 5. Send Weekly Career Insights / Newsletter Welcome Email
     */
    @Async
    public void sendNewsletterWelcomeEmail(String toEmail) {
        String subject = "Welcome to BrandIt Career Insights! 🚀";
        String htmlBody = templateBuilder.buildNewsletterWelcomeTemplate(toEmail, frontendUrl);
        sendEmailSync(toEmail, subject, htmlBody);
    }

    /**
     * 6. Send Payment Proof & UTR Reference Notification to BrandIt Team and Paying Client
     */
    @Async
    public void sendPaymentVerificationAdminNotification(String clientName, String clientEmail, String clientPhone,
                                                          String serviceName, String bookingDate, String bookingTime,
                                                          String price, String upiRef, String screenshotBase64) {
        String subject = "💳 Payment Submitted: " + clientName + " (" + price + ") — Ref: " + upiRef;
        String htmlBody = templateBuilder.buildPaymentVerificationAdminTemplate(
                clientName, clientEmail, clientPhone, serviceName, bookingDate, bookingTime, price, upiRef, screenshotBase64, frontendUrl
        );

        // 1. Send to Customer Acquisition, HR, and Admin Team
        for (String teamEmail : TEAM_NOTIFICATION_EMAILS) {
            sendEmailSync(teamEmail, subject, htmlBody);
        }

        // 2. Send copy to the client who pays as instant receipt
        if (clientEmail != null && !clientEmail.isBlank() && TEAM_NOTIFICATION_EMAILS.stream().noneMatch(e -> e.equalsIgnoreCase(clientEmail))) {
            sendEmailSync(clientEmail, "Payment Submission Receipt — BrandIt (" + serviceName + ")", htmlBody);
        }
    }

    /**
     * 7. Send Weekly Career Insights Email to Subscribed Account
     */
    @Async
    public void sendWeeklyCareerInsightDigest(String toEmail, String subject, String contentHtml) {
        String htmlBody = templateBuilder.buildWeeklyCareerInsightsTemplate(subject, contentHtml, toEmail, frontendUrl);
        sendEmailSync(toEmail, subject, htmlBody);
    }
}
