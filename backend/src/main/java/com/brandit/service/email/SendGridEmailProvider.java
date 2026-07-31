package com.brandit.service.email;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
@Order(3)
@Slf4j
public class SendGridEmailProvider implements EmailProviderStrategy {

    @Value("${sendgrid.api.key:}")
    private String sendgridApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    @Override
    public String getProviderName() {
        return "SendGrid HTTPS REST API";
    }

    @Override
    public boolean isConfigured() {
        return sendgridApiKey != null && !sendgridApiKey.isBlank() && sendgridApiKey.startsWith("SG.");
    }

    @Override
    public boolean send(String to, String subject, String htmlBody, String fromEmail) {
        if (!isConfigured()) return false;
        try {
            String senderEmail = (fromEmail != null && fromEmail.contains("@") && !fromEmail.contains("resend.dev"))
                    ? fromEmail
                    : "brandit.get@gmail.com";

            Map<String, Object> payload = Map.of(
                    "personalizations", List.of(Map.of("to", List.of(Map.of("email", to)))),
                    "from", Map.of("email", senderEmail, "name", "BrandIt Consulting"),
                    "subject", subject,
                    "content", List.of(Map.of("type", "text/html", "value", htmlBody))
            );

            String jsonPayload = objectMapper.writeValueAsString(payload);
            log.info("Attempting email dispatch via SendGrid HTTPS REST API to: {}", to);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.sendgrid.com/v3/mail/send"))
                    .header("Authorization", "Bearer " + sendgridApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("✅ Successfully sent email via SendGrid HTTPS API (HTTP {}) to {}", response.statusCode(), to);
                return true;
            } else {
                log.warn("⚠️ SendGrid HTTPS API returned status {}: {}", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.warn("❌ SendGrid HTTPS API exception: {}", e.getMessage());
        }
        return false;
    }
}
