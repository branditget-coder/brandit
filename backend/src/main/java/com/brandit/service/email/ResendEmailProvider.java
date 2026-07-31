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
public class ResendEmailProvider implements EmailProviderStrategy {

    @Value("${resend.api.key:}")
    private String resendApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    @Override
    public String getProviderName() {
        return "Resend REST API";
    }

    @Override
    public boolean isConfigured() {
        return resendApiKey != null && !resendApiKey.isBlank() && resendApiKey.startsWith("re_");
    }

    @Override
    public boolean send(String to, String subject, String htmlBody, String fromEmail) {
        if (!isConfigured()) return false;
        try {
            // If fromEmail is valid and not resend.dev, use it; otherwise fallback to onboarding@resend.dev
            String sender = (fromEmail != null && fromEmail.contains("@") && !fromEmail.contains("resend.dev"))
                    ? "BrandIt Consulting <" + fromEmail + ">"
                    : "BrandIt Consulting <onboarding@resend.dev>";

            Map<String, Object> payload = new HashMap<>();
            payload.put("from", sender);
            payload.put("to", List.of(to));
            payload.put("subject", subject);
            payload.put("html", htmlBody);

            String jsonPayload = objectMapper.writeValueAsString(payload);
            log.info("Attempting email dispatch via Resend API to: {} (Sender: {})", to, sender);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("✅ Successfully sent email via Resend API (HTTP {}) to {}", response.statusCode(), to);
                return true;
            } else {
                log.warn("⚠️ Resend API returned status {}: {}. Falling back to next provider...", response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.warn("❌ Resend API exception: {}", e.getMessage());
        }
        return false;
    }
}
