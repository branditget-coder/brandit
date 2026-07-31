package com.brandit.service.email;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@Order(3)
@Slf4j
public class SmtpEmailProvider implements EmailProviderStrategy {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Override
    public String getProviderName() {
        return "JavaMailSender SMTP";
    }

    @Override
    public boolean isConfigured() {
        return mailSender != null;
    }

    @Override
    public boolean send(String to, String subject, String htmlBody, String fromEmail) {
        if (!isConfigured()) return false;
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail != null ? fromEmail : "brandit.get@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("HTML Email sent via SMTP to {}", to);
            return true;
        } catch (Exception e) {
            log.warn("SMTP email dispatch failed: {}", e.getMessage());
        }
        return false;
    }
}
