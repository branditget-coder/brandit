package com.brandit.service.email;

public interface EmailProviderStrategy {
    String getProviderName();
    boolean isConfigured();
    boolean send(String to, String subject, String htmlBody, String fromEmail);
}
