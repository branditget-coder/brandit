package com.brandit.payment.controller;

import com.brandit.common.dto.CommonDtos.*;
import com.brandit.payment.service.CashfreeService;
import com.brandit.payment.service.CashfreeService.CashfreeOrderDetails;
import com.brandit.payment.service.CashfreeService.CashfreeOrderRequest;
import com.brandit.payment.service.CashfreeService.CashfreeOrderResponse;
import com.brandit.payment.service.PaymentService;
import com.brandit.payment.service.StripeService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final StripeService stripeService;
    private final CashfreeService cashfreeService;
    private final PaymentService paymentService;
    private final com.brandit.booking.service.BookingService bookingService;

    private static final Map<String, BigDecimal> BRANDIT_PRICING_CATALOG = Map.ofEntries(
            Map.entry("SETUP", new BigDecimal("129.00")),
            Map.entry("PROFILE", new BigDecimal("129.00")),
            Map.entry("BRANDINGBASIC", new BigDecimal("349.00")),
            Map.entry("PERSONALBRANDING", new BigDecimal("349.00")),
            Map.entry("GROWTH", new BigDecimal("349.00")),
            Map.entry("BRANDINGNETWORK", new BigDecimal("499.00")),
            Map.entry("GROWTHENGINE", new BigDecimal("499.00")),
            Map.entry("OUTREACH", new BigDecimal("499.00")),
            Map.entry("NETWORK", new BigDecimal("499.00")),
            Map.entry("SCALE", new BigDecimal("499.00")),
            Map.entry("LINKEDINCONSULTING", new BigDecimal("249.00")),
            Map.entry("CONSULTING", new BigDecimal("249.00"))
    );

    private BigDecimal resolveSecurePrice(String serviceName, BigDecimal requestedAmount) {
        if (serviceName != null && !serviceName.isBlank()) {
            String normalized = serviceName.toUpperCase().replaceAll("[^A-Z]", "");
            for (Map.Entry<String, BigDecimal> entry : BRANDIT_PRICING_CATALOG.entrySet()) {
                if (normalized.contains(entry.getKey())) {
                    return entry.getValue();
                }
            }
        }
        // Custom amounts (plan upgrades, top-ups) must be strictly positive
        if (requestedAmount != null && requestedAmount.compareTo(BigDecimal.ONE) >= 0) {
            return requestedAmount;
        }
        return new BigDecimal("129.00");
    }

    // ==========================================
    // Cashfree Payment Gateway Endpoints (Primary)
    // ==========================================

    @PostMapping("/cashfree/create-order")
    public ResponseEntity<CashfreeOrderResponse> createCashfreeOrder(
            @RequestBody CashfreeOrderRequest request,
            @RequestHeader(value = "Origin", required = false) String origin) {
        // Enforce server-side authoritative pricing to prevent client-side price manipulation
        BigDecimal securePrice = resolveSecurePrice(request.getServiceName(), request.getAmount());
        request.setAmount(securePrice);

        log.info("Creating Cashfree Order for: {} | Verified Price: ₹{} | Client: {}",
                request.getServiceName(), securePrice, request.getClientEmail());
        CashfreeOrderResponse response = cashfreeService.createOrder(request, origin);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cashfree/verify-order")
    public ResponseEntity<CashfreeVerificationResponse> verifyCashfreeOrder(@RequestBody Map<String, String> body) {
        String orderId = body != null ? body.get("orderId") : null;
        if (orderId == null || orderId.isBlank()) {
            return ResponseEntity.badRequest().body(CashfreeVerificationResponse.builder()
                    .paid(false)
                    .message("orderId parameter is required")
                    .build());
        }

        log.info("Verifying Cashfree order status: {}", orderId);
        CashfreeOrderDetails details = cashfreeService.verifyOrder(orderId.trim());

        if (details.isPaid()) {
            String clientEmail = body != null ? body.get("clientEmail") : null;
            String clientName = body != null ? body.get("clientName") : null;
            String clientPhone = body != null ? body.get("clientPhone") : null;
            String serviceName = body != null ? body.getOrDefault("serviceName", "BrandIt Package") : "BrandIt Package";
            String bookingDate = body != null ? body.get("bookingDate") : null;
            String bookingTime = body != null ? body.get("bookingTime") : null;
            String notes = body != null ? body.get("notes") : null;

            // 1. Auto-generate official tax invoice for user dashboard
            if (clientEmail != null && !clientEmail.isBlank()) {
                try {
                    paymentService.createInvoice(
                            clientEmail,
                            details.getAmount() != null ? details.getAmount().longValue() : 129L,
                            details.getCurrency(),
                            serviceName,
                            "CASHFREE",
                            details.getOrderId()
                    );
                } catch (Exception ex) {
                    log.warn("Auto-invoice generation note: {}", ex.getMessage());
                }
            }

            // 2. Automatically generate the booking record for the Admin Panel
            try {
                bookingService.createCashfreeBookingAutomatically(
                        details.getOrderId(),
                        clientEmail,
                        clientName,
                        clientPhone,
                        serviceName,
                        bookingDate,
                        bookingTime,
                        details.getAmount(),
                        notes
                );
            } catch (Exception ex) {
                log.warn("Auto-booking generation note: {}", ex.getMessage());
            }
        }

        CashfreeVerificationResponse response = CashfreeVerificationResponse.builder()
                .orderId(details.getOrderId())
                .cfOrderId(details.getCfOrderId())
                .orderStatus(details.getOrderStatus())
                .paid(details.isPaid())
                .amount(details.getAmount())
                .currency(details.getCurrency())
                .message(details.isPaid() ? "Payment successfully verified" : "Payment not completed yet")
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/cashfree/order/{orderId}")
    public ResponseEntity<CashfreeOrderDetails> getCashfreeOrder(@PathVariable String orderId) {
        return ResponseEntity.ok(cashfreeService.verifyOrder(orderId));
    }

    @RequestMapping(value = "/cashfree/webhook", method = {RequestMethod.POST, RequestMethod.GET})
    public ResponseEntity<MessageResponse> handleCashfreeWebhook(
            @RequestBody(required = false) String payload,
            @RequestHeader(value = "x-webhook-signature", required = false) String signature) {
        log.info("Received Cashfree Webhook callback notification");
        if (payload != null && !payload.isBlank()) {
            try {
                com.fasterxml.jackson.databind.JsonNode node = new com.fasterxml.jackson.databind.ObjectMapper().readTree(payload);
                String orderId = null;
                if (node.has("data") && node.get("data").has("order") && node.get("data").get("order").has("order_id")) {
                    orderId = node.get("data").get("order").get("order_id").asText();
                } else if (node.has("orderId")) {
                    orderId = node.get("orderId").asText();
                } else if (node.has("order_id")) {
                    orderId = node.get("order_id").asText();
                }

                if (orderId != null && !orderId.isBlank()) {
                    CashfreeOrderDetails cfDetails = cashfreeService.verifyOrder(orderId.trim());
                    if (cfDetails.isPaid()) {
                        bookingService.createCashfreeBookingAutomatically(
                                cfDetails.getOrderId(),
                                null,
                                null,
                                null,
                                "BrandIt Package",
                                null,
                                null,
                                cfDetails.getAmount(),
                                "Confirmed via Cashfree Server Webhook"
                        );
                    }
                }
            } catch (Exception ex) {
                log.warn("Webhook auto-booking note: {}", ex.getMessage());
            }
        }
        return ResponseEntity.ok(new MessageResponse("Cashfree webhook received"));
    }

    // ==========================================
    // Legacy / Fallback Stripe Endpoints
    // ==========================================

    @PostMapping("/create-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody StripeCheckoutRequest request,
                                                                   @RequestHeader(value = "Origin", required = false) String origin) {
        log.info("Creating Stripe Payment Gateway session for plan: {}", request.getPlanName());
        BigDecimal amount = resolveSecurePrice(request.getPlanId() != null ? request.getPlanId() : request.getPlanName(), request.getAmount());
        Map<String, String> response = stripeService.createCheckoutSession(
                request.getPlanName() != null ? request.getPlanName() : "BrandIt Package",
                amount,
                request.getClientEmail(),
                origin
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/webhook")
    public ResponseEntity<MessageResponse> handlePaymentWebhook(@RequestBody String payload,
                                                               @RequestHeader(value = "Stripe-Signature", required = false) String stripeSignature) {
        log.info("Received payment webhook notification");
        return ResponseEntity.ok(new MessageResponse("Webhook processed successfully"));
    }

    @Data
    public static class StripeCheckoutRequest {
        private String planId;
        private String planName;
        private BigDecimal amount;
        private String clientEmail;
        private String clientName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CashfreeVerificationResponse {
        private String orderId;
        private String cfOrderId;
        private String orderStatus;
        private boolean paid;
        private BigDecimal amount;
        private String currency;
        private String message;
    }
}
