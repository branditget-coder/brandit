package com.brandit.controller;

import com.brandit.dto.CommonDtos.*;
import com.brandit.service.StripeService;
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

    @PostMapping("/create-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody StripeCheckoutRequest request,
                                                                   @RequestHeader(value = "Origin", required = false) String origin) {
        log.info("Creating Stripe Payment Gateway session for plan: {}", request.getPlanName());
        BigDecimal amount = request.getAmount() != null ? request.getAmount() : new BigDecimal(99);
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
