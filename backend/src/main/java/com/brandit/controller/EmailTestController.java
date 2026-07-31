package com.brandit.controller;

import com.brandit.service.EmailService;
import com.brandit.service.EmailService.EmailDispatchResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class EmailTestController {

    private final EmailService emailService;

    @GetMapping({"/api/test-email", "/api/admin/email/test"})
    public ResponseEntity<EmailDispatchResult> testEmailDispatch(
            @RequestParam(defaultValue = "brandit.get@gmail.com") String to) {

        String testSubject = "BrandIt Email Service Verification Test";
        String testBody = """
                <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <h2 style="color: #0A66C2; margin-bottom: 12px;">BrandIt Email Service Operational Test</h2>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">This is a live test email sent to verify that transactional emails (User Onboarding & Payment Confirmations) are functioning properly.</p>
                    <p style="color: #64748B; font-size: 13px; margin-top: 20px;">Time sent: %s</p>
                </div>
                """.formatted(java.time.LocalDateTime.now());

        EmailDispatchResult result = emailService.sendEmailSync(to, testSubject, testBody);
        return ResponseEntity.ok(result);
    }
}
