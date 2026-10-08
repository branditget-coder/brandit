package com.brandit.payment.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class CashfreeService {

    @Value("${cashfree.app.id:}")
    private String appId;

    @Value("${cashfree.secret.key:}")
    private String secretKey;

    @Value("${cashfree.env:PRODUCTION}")
    private String environment;

    @Value("${cashfree.api.version:2025-01-01}")
    private String apiVersion;

    @Value("${app.frontend.url:https://go-brandit.vercel.app}")
    private String configuredFrontendUrl;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    private String getBaseUrl() {
        if ("SANDBOX".equalsIgnoreCase(environment)) {
            return "https://sandbox.cashfree.com/pg";
        }
        return "https://api.cashfree.com/pg";
    }

    private String getValidatedDomain(String originUrl) {
        if (originUrl != null && !originUrl.isBlank()) {
            try {
                URI uri = URI.create(originUrl.trim());
                String host = uri.getHost() != null ? uri.getHost().toLowerCase() : "";
                if (host.equals("localhost") || host.equals("127.0.0.1") ||
                    host.equals("go-brandit.vercel.app") || host.equals("go-brandit.com") ||
                    host.endsWith(".vercel.app") || host.endsWith(".go-brandit.com")) {
                    int port = uri.getPort();
                    return uri.getScheme() + "://" + host + (port != -1 ? ":" + port : "");
                }
            } catch (Exception ignored) {}
        }
        return (configuredFrontendUrl != null && !configuredFrontendUrl.isBlank())
                ? configuredFrontendUrl
                : "https://go-brandit.vercel.app";
    }

    private String sanitizePhone(String phone) {
        if (phone == null || phone.isBlank()) {
            return "9876543210";
        }
        String digits = phone.replaceAll("[^0-9]", "");
        if (digits.length() > 10) {
            digits = digits.substring(digits.length() - 10);
        }
        if (digits.length() == 10 && digits.matches("^[6-9]\\d{9}$")) {
            return digits;
        }
        return "9876543210";
    }

    private String sanitizeCustomerId(String email, String phone) {
        if (email != null && !email.isBlank()) {
            String sanitized = email.replaceAll("[^a-zA-Z0-9_-]", "_");
            if (sanitized.length() < 3) sanitized = "CUST_" + sanitized;
            if (sanitized.length() > 40) sanitized = sanitized.substring(0, 40);
            return sanitized;
        }
        if (phone != null && !phone.isBlank()) {
            return "CUST_" + sanitizePhone(phone);
        }
        return "CUST_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    /**
     * Create Cashfree PG Order (Step 1 of Hosted Web Checkout)
     */
    public CashfreeOrderResponse createOrder(CashfreeOrderRequest request, String originUrl) {
        if (appId == null || appId.isBlank() || secretKey == null || secretKey.isBlank()) {
            log.error("Cashfree credentials missing: CASHFREE_APP_ID or CASHFREE_SECRET_KEY not set in environment");
            return CashfreeOrderResponse.builder()
                    .success(false)
                    .message("Payment gateway is temporarily unavailable. Please use the backup QR transfer.")
                    .build();
        }

        String baseUrl = getBaseUrl();
        String domain = getValidatedDomain(originUrl);

        String generatedOrderId = "order_cf_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().replace("-", "").substring(0, 6);
        BigDecimal amount = request.getAmount() != null && request.getAmount().compareTo(BigDecimal.ZERO) > 0
                ? request.getAmount().setScale(2, RoundingMode.HALF_UP)
                : new BigDecimal("129.00");

        String customerId = sanitizeCustomerId(request.getClientEmail(), request.getClientPhone());
        String customerPhone = sanitizePhone(request.getClientPhone());
        String customerEmail = (request.getClientEmail() != null && !request.getClientEmail().isBlank())
                ? request.getClientEmail().trim()
                : "client@go-brandit.com";
        String rawName = (request.getClientName() != null && !request.getClientName().isBlank())
                ? request.getClientName().trim().replaceAll("[^a-zA-Z0-9 ._-]", "")
                : "BrandIt Client";
        if (rawName.isBlank()) rawName = "BrandIt Client";
        String customerName = rawName.length() > 50 ? rawName.substring(0, 50) : rawName;

        String serviceName = request.getServiceName() != null ? request.getServiceName() : "BrandIt Package";
        String returnUrl = domain + "/book?cf_order_id={order_id}&status=processing";

        Map<String, Object> payload = new HashMap<>();
        payload.put("order_id", generatedOrderId);
        payload.put("order_amount", amount.doubleValue());
        payload.put("order_currency", "INR");

        Map<String, Object> customerDetails = new HashMap<>();
        customerDetails.put("customer_id", customerId);
        customerDetails.put("customer_name", customerName);
        customerDetails.put("customer_email", customerEmail);
        customerDetails.put("customer_phone", customerPhone);
        payload.put("customer_details", customerDetails);

        Map<String, Object> orderMeta = new HashMap<>();
        orderMeta.put("return_url", returnUrl);
        orderMeta.put("notify_url", "https://brandit-backend.onrender.com/api/payments/cashfree/webhook");
        payload.put("order_meta", orderMeta);

        String cleanServiceName = serviceName.replaceAll("[^a-zA-Z0-9 ]", " ").replaceAll(" +", " ").trim();
        if (cleanServiceName.isBlank()) cleanServiceName = "BrandIt Package";
        if (cleanServiceName.length() > 40) cleanServiceName = cleanServiceName.substring(0, 40);
        String orderNote = "BrandIt - " + cleanServiceName;
        payload.put("order_note", orderNote);

        try {
            String jsonBody = objectMapper.writeValueAsString(payload);
            log.info("Sending Cashfree order creation request to {} with Order ID: {}", baseUrl + "/orders", generatedOrderId);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/orders"))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .header("x-api-version", apiVersion)
                    .header("x-client-id", appId)
                    .header("x-client-secret", secretKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode root = objectMapper.readTree(response.body());
                String returnedOrderId = root.has("order_id") ? root.get("order_id").asText() : generatedOrderId;
                String paymentSessionId = root.has("payment_session_id") ? root.get("payment_session_id").asText() : null;
                String orderStatus = root.has("order_status") ? root.get("order_status").asText() : "ACTIVE";

                log.info("Cashfree Order created successfully. ID: {}, PaymentSessionId: {}", returnedOrderId, paymentSessionId);

                return CashfreeOrderResponse.builder()
                        .success(true)
                        .orderId(returnedOrderId)
                        .paymentSessionId(paymentSessionId)
                        .orderStatus(orderStatus)
                        .environment(environment.toUpperCase())
                        .amount(amount)
                        .currency("INR")
                        .message("Order created successfully")
                        .build();
            } else {
                log.error("Cashfree order creation failed. Status: {}, Response: {}", response.statusCode(), response.body());
                return CashfreeOrderResponse.builder()
                        .success(false)
                        .orderId(generatedOrderId)
                        .environment(environment.toUpperCase())
                        .message("Cashfree PG error (" + response.statusCode() + "): " + response.body())
                        .build();
            }
        } catch (Exception e) {
            log.error("Exception during Cashfree order creation: {}", e.getMessage(), e);
            return CashfreeOrderResponse.builder()
                    .success(false)
                    .orderId(generatedOrderId)
                    .environment(environment.toUpperCase())
                    .message("Failed to communicate with Cashfree PG: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Verify Cashfree Order Status (Step 3: GET /pg/orders/{order_id})
     */
    public CashfreeOrderDetails verifyOrder(String orderId) {
        if (orderId == null || orderId.isBlank()) {
            throw new IllegalArgumentException("Order ID cannot be empty");
        }

        if (appId == null || appId.isBlank() || secretKey == null || secretKey.isBlank()) {
            log.error("Cashfree credentials missing for verifyOrder");
            return CashfreeOrderDetails.builder()
                    .orderId(orderId)
                    .orderStatus("CONFIG_ERROR")
                    .isPaid(false)
                    .rawResponse("Missing API credentials")
                    .build();
        }

        String baseUrl = getBaseUrl();
        try {
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/orders/" + orderId.trim()))
                    .header("Accept", "application/json")
                    .header("x-api-version", apiVersion)
                    .header("x-client-id", appId)
                    .header("x-client-secret", secretKey)
                    .GET()
                    .timeout(Duration.ofSeconds(15))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode root = objectMapper.readTree(response.body());
                String returnedOrderId = root.has("order_id") ? root.get("order_id").asText() : orderId;
                String orderStatus = root.has("order_status") ? root.get("order_status").asText() : "UNKNOWN";
                double amount = root.has("order_amount") ? root.get("order_amount").asDouble() : 0.0;
                String currency = root.has("order_currency") ? root.get("order_currency").asText() : "INR";
                String cfOrderId = root.has("cf_order_id") ? root.get("cf_order_id").asText() : null;

                boolean isPaid = "PAID".equalsIgnoreCase(orderStatus);

                String customerName = null;
                String customerEmail = null;
                String customerPhone = null;
                String orderNote = root.has("order_note") ? root.get("order_note").asText() : "BrandIt Package";

                if (root.has("customer_details")) {
                    JsonNode cd = root.get("customer_details");
                    if (cd.has("customer_name")) customerName = cd.get("customer_name").asText();
                    if (cd.has("customer_email")) customerEmail = cd.get("customer_email").asText();
                    if (cd.has("customer_phone")) customerPhone = cd.get("customer_phone").asText();
                }

                log.info("Cashfree Order {} verified. Status: {}, Paid: {}", returnedOrderId, orderStatus, isPaid);

                return CashfreeOrderDetails.builder()
                        .orderId(returnedOrderId)
                        .cfOrderId(cfOrderId)
                        .orderStatus(orderStatus)
                        .isPaid(isPaid)
                        .amount(BigDecimal.valueOf(amount))
                        .currency(currency)
                        .customerName(customerName)
                        .customerEmail(customerEmail)
                        .customerPhone(customerPhone)
                        .orderNote(orderNote)
                        .rawResponse(response.body())
                        .build();
            } else {
                log.warn("Cashfree order verification status code: {}, body: {}", response.statusCode(), response.body());
                return CashfreeOrderDetails.builder()
                        .orderId(orderId)
                        .orderStatus("NOT_FOUND")
                        .isPaid(false)
                        .rawResponse(response.body())
                        .build();
            }
        } catch (Exception e) {
            log.error("Exception verifying Cashfree order {}: {}", orderId, e.getMessage(), e);
            return CashfreeOrderDetails.builder()
                    .orderId(orderId)
                    .orderStatus("ERROR")
                    .isPaid(false)
                    .rawResponse(e.getMessage())
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CashfreeOrderRequest {
        private String serviceName;
        private BigDecimal amount;
        private String clientName;
        private String clientEmail;
        private String clientPhone;
        private String notes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CashfreeOrderResponse {
        private boolean success;
        private String orderId;
        private String paymentSessionId;
        private String orderStatus;
        private String environment;
        private BigDecimal amount;
        private String currency;
        private String message;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CashfreeOrderDetails {
        private String orderId;
        private String cfOrderId;
        private String orderStatus;
        private boolean isPaid;
        private BigDecimal amount;
        private String currency;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private String orderNote;
        private String rawResponse;
    }
}
