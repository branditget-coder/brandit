package com.brandit.service;

import com.brandit.service.email.EmailProviderStrategy;
import com.brandit.service.email.EmailTemplateBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final EmailTemplateBuilder templateBuilder;
    private final List<EmailProviderStrategy> providerStrategies;

    @Value("${app.mail.from:onboarding@resend.dev}")
    private String fromEmail;

    @Value("${app.frontend.url:https://brandit-eta.vercel.app}")
    private String frontendUrl;

    /**
     * 1. Send Welcome Email on Account Registration
     */
    @Async
    public void sendWelcomeEmail(String toEmail, String clientName, String role) {
        String subject = "Welcome to BrandIt — Elevate Your Personal Brand!";
        String htmlBody = templateBuilder.buildWelcomeTemplate(clientName, toEmail, role, frontendUrl);
        dispatchEmail(toEmail, subject, htmlBody);
    }

    /**
     * 2. Send Booking & Payment Confirmation Email
     */
    @Async
    public void sendBookingConfirmation(String toEmail, String clientName, String serviceName, String bookingDate,
                                         String bookingTime, String price, String paymentId) {
        String subject = "Booking Confirmed: " + serviceName + " — BrandIt";
        String htmlBody = templateBuilder.buildBookingTemplate(clientName, serviceName, bookingDate, bookingTime, price, paymentId, frontendUrl);
        dispatchEmail(toEmail, subject, htmlBody);
    }

    /**
     * 3. Send Password Reset Email
     */
    @Async
    public void sendPasswordResetEmail(String toEmail, String clientName, String resetToken) {
        String subject = "Reset Your BrandIt Account Password";
        String htmlBody = templateBuilder.buildPasswordResetTemplate(clientName, toEmail, resetToken, frontendUrl);
        dispatchEmail(toEmail, subject, htmlBody);
    }

    /**
     * 4. Send Contact Form Submission Notification to BrandIt Team
     */
    @Async
    public void sendContactNotification(String senderName, String senderEmail, String phone, String serviceInterested,
                                         String messageText) {
        String subject = "New Contact Inquiry from " + senderName + " — BrandIt";
        String adminEmail = "brandit.get@gmail.com";
        String htmlBody = templateBuilder.buildContactNotificationTemplate(senderName, senderEmail, phone, serviceInterested, messageText, frontendUrl);
        dispatchEmail(adminEmail, subject, htmlBody);
    }

    /**
     * Core Dispatcher using Strategy Chain Pattern
     */
    private void dispatchEmail(String to, String subject, String htmlBody) {
        log.info("================ EMAIL DISPATCH LOG ================");
        log.info("To: {}", to);
        log.info("Subject: {}", subject);
        log.info("Available Email Strategies: {}", providerStrategies.size());
        log.info("====================================================");

        for (EmailProviderStrategy provider : providerStrategies) {
            if (provider.isConfigured()) {
                log.info("Attempting dispatch via strategy: {}", provider.getProviderName());
                boolean sent = provider.send(to, subject, htmlBody, fromEmail);
                if (sent) {
                    log.info("✅ Email successfully sent via {}", provider.getProviderName());
                    return;
                }
                log.warn("⚠️ Strategy {} failed to send email. Falling back to next strategy...", provider.getProviderName());
            }
        }
        log.error("❌ All email providers failed to send email to {}", to);
    }
}
