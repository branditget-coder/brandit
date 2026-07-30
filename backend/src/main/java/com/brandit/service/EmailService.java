package com.brandit.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Async
    public void sendBookingConfirmation(String toEmail, String clientName, String serviceName, String bookingDate, String bookingTime, String price, String paymentId) {
        String subject = "BrandIt Booking Confirmation — " + serviceName;
        String content = String.format(
                "Dear %s,\n\n" +
                "Thank you for choosing BrandIt! Your booking has been successfully confirmed.\n\n" +
                "--- BOOKING DETAILS ---\n" +
                "Service Package: %s\n" +
                "Amount Paid: %s\n" +
                "Scheduled Date: %s\n" +
                "Time Slot: %s IST\n" +
                "Transaction Reference: %s\n\n" +
                "--- NEXT STEPS ---\n" +
                "Our team consultant (Hritika Seth / Kritika Dhawan) will reach out to you via WhatsApp / Phone shortly before your scheduled slot.\n\n" +
                "Contact Email: brandit.get@gmail.com\n" +
                "Hritika Seth (Consultant): +91 8708231539\n" +
                "Kritika Dhawan (Operations): +91 6284318951\n\n" +
                "Best regards,\n" +
                "Team BrandIt\n" +
                "Your Profile, Your Brand, Your Opportunity",
                clientName, serviceName, price, bookingDate, bookingTime, paymentId != null ? paymentId : "CONFIRMED"
        );

        log.info("================ EMAIL CONFIRMATION LOG ================");
        log.info("To: {}", toEmail);
        log.info("Subject: {}", subject);
        log.info("Content:\n{}", content);
        log.info("========================================================");

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setCc("brandit.get@gmail.com");
                message.setSubject(subject);
                message.setText(content);
                mailSender.send(message);
                log.info("Successfully sent booking confirmation email to {}", toEmail);
            } catch (Exception e) {
                log.warn("Could not dispatch SMTP email (SMTP credentials not configured): {}", e.getMessage());
            }
        }
    }
}
