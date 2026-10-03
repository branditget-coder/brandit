package com.brandit.payment.controller;

import com.brandit.common.dto.CommonDtos.*;
import com.brandit.payment.service.StripeService;
import lombok.Data;
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

    private static final Map<String, BigDecimal> PLAN_PRICING_CATALOG = Map.of(
            "STARTER", new BigDecimal(1499),
            "GROWTH", new BigDecimal(2499),
            "EXECUTIVE", new BigDecimal(4999),
            "CONSULTING", new BigDecimal(1499)
    );

    private BigDecimal resolvePlanPrice(String planId, String planName, BigDecimal requestedAmount) {
        String key = (planId != null ? planId : (planName != null ? planName : "")).toUpperCase().replaceAll("[^A-Z]", "");
        for (Map.Entry<String, BigDecimal> entry : PLAN_PRICING_CATALOG.entrySet()) {
            if (key.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        if (requestedAmount != null && requestedAmount.compareTo(new BigDecimal(99)) >= 0) {
            return requestedAmount;
        }
        return new BigDecimal(1499);
    }

    @PostMapping("/create-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody StripeCheckoutRequest request,
                                                                   @RequestHeader(value = "Origin", required = false) String origin) {
        log.info("Creating Stripe Payment Gateway session for plan: {}", request.getPlanName());
        BigDecimal amount = resolvePlanPrice(request.getPlanId(), request.getPlanName(), request.getAmount());
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
}
