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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Order(1)
@Slf4j
public class BrevoEmailProvider implements EmailProviderStrategy {

    @Value("${brevo.api.key:}")
    private String brevoApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    @Override
    public String getProviderName() {
        return "Brevo REST API";
    }

    @Override
    public boolean isConfigured() {
        return brevoApiKey != null && !brevoApiKey.isBlank() && !brevoApiKey.contains("placeholder");
    }

    @Override
    public boolean send(String to, String subject, String htmlBody, String fromEmail) {
        if (!isConfigured()) return false;
        try {
            // Clean sender email for Brevo (Brevo requires real domain or brandit.get@gmail.com)
            String senderEmail = (fromEmail != null && fromEmail.contains("@") && !fromEmail.contains("resend.dev"))
                    ? fromEmail
                    : "brandit.get@gmail.com";

            Map<String, Object> senderMap = Map.of("name", "BrandIt Consulting", "email", senderEmail);
            Map<String, Object> recipientMap = Map.of("email", to);

            Map<String, Object> payload = new HashMap<>();
            payload.put("sender", senderMap);
            payload.put("to", List.of(recipientMap));
            payload.put("subject", subject);
            payload.put("htmlContent", htmlBody);

            String jsonPayload = objectMapper.writeValueAsString(payload);
            log.info("Attempting email dispatch via Brevo API to: {} (Sender: {})", to, senderEmail);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("api-key", brevoApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("✅ Successfully sent email via Brevo REST API (HTTP {}) to {}", response.statusCode(), to);
                return true;
            } else {
                log.warn("⚠️ Brevo REST API returned status {}: {}. Falling back to next provider...", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.warn("❌ Brevo REST API exception: {}", e.getMessage());
        }
        return false;
    }
}
