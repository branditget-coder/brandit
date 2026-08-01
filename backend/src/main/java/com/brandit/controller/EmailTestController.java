package com.brandit.controller;

import com.brandit.entity.Booking;
import com.brandit.repository.BookingRepository;
import com.brandit.service.BookingService;
import com.brandit.service.EmailService;
import com.brandit.service.EmailService.EmailDispatchResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class EmailTestController {

    private final EmailService emailService;
    private final BookingService bookingService;
    private final BookingRepository bookingRepository;

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

    @GetMapping({"/api/list-bookings", "/api/admin/bookings/list-all"})
    public ResponseEntity<List<Map<String, Object>>> listAllBookingsForDiagnostics() {
        List<Booking> bookings = bookingRepository.findAllByOrderByCreatedAtDesc();
        List<Map<String, Object>> result = bookings.stream().map(b -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("bookingId", b.getId());
            map.put("serviceName", b.getServiceName());
            map.put("clientName", b.getUser() != null ? b.getUser().getFullName() : "Guest Client");
            map.put("clientEmail", b.getUser() != null ? b.getUser().getEmail() : "N/A");
            map.put("clientPhone", b.getUser() != null ? b.getUser().getPhone() : "N/A");
            map.put("amount", b.getAmount());
            map.put("paymentId", b.getPaymentId());
            map.put("bookingDate", b.getBookingDate());
            map.put("bookingTime", b.getBookingTime());
            map.put("createdAt", b.getCreatedAt());
            map.put("resendUrl", "https://brandit-production-61bf.up.railway.app/api/resend-booking-email?id=" + b.getId());
            return map;
        }).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping({"/api/resend-booking-email", "/api/resend-latest-booking-email"})
    public ResponseEntity<String> resendBookingEmail(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String customEmail) {
        if (id == null) {
            return ResponseEntity.ok(bookingService.resendLatestBookingEmails());
        }
        return ResponseEntity.ok(bookingService.resendBookingEmailsById(id, customEmail));
    }

    @GetMapping("/api/send-manual-payment-email")
    public ResponseEntity<String> sendManualPaymentEmail(
            @RequestParam(defaultValue = "Valued Client") String clientName,
            @RequestParam(defaultValue = "client@brandit.com") String clientEmail,
            @RequestParam(defaultValue = "Career Consulting Session") String serviceName,
            @RequestParam(defaultValue = "₹1,499") String price,
            @RequestParam(defaultValue = "UPI-TRANSACTION-REF") String upiRef,
            @RequestParam(defaultValue = "TBD") String bookingDate,
            @RequestParam(defaultValue = "TBD") String bookingTime) {

        emailService.sendBookingConfirmation(clientEmail, clientName, serviceName, bookingDate, bookingTime, price, upiRef);
        emailService.sendPaymentVerificationAdminNotification(clientName, clientEmail, "N/A", serviceName, bookingDate, bookingTime, price, upiRef, null);

        return ResponseEntity.ok("Successfully dispatched manual booking confirmation & payment verification emails for " + clientName + " (" + clientEmail + ")");
    }
}
