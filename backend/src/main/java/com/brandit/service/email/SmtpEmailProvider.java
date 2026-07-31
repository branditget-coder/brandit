package com.brandit.service.email;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@Order(4)
@Slf4j
public class SmtpEmailProvider implements EmailProviderStrategy {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${spring.mail.username:brandit.get@gmail.com}")
    private String mailUsername;

    @Override
    public String getProviderName() {
        return "JavaMailSender SMTP";
    }

    @Override
    public boolean isConfigured() {
        // Only return true if JavaMailSender is injected AND a real password is set
        return mailSender != null
                && mailPassword != null
                && !mailPassword.isBlank()
                && !mailPassword.equalsIgnoreCase("placeholder_password");
    }

    @Override
    public boolean send(String to, String subject, String htmlBody, String fromEmail) {
        if (!isConfigured()) {
            log.info("Skipping SMTP Provider: Password not configured or contains placeholder.");
            return false;
        }
        try {
            String sender = (fromEmail != null && fromEmail.contains("@") && !fromEmail.contains("resend.dev"))
                    ? fromEmail
                    : mailUsername;

            log.info("Attempting email dispatch via JavaMailSender SMTP to: {} (Sender: {})", to, sender);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(sender);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("✅ Email successfully sent via SMTP to {}", to);
            return true;
        } catch (Exception e) {
            log.warn("❌ SMTP email dispatch failed: {}", e.getMessage());
        }
        return false;
    }
}
