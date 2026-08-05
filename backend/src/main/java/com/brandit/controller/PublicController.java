package com.brandit.controller;

import com.brandit.dto.CommonDtos.*;
import com.brandit.entity.Booking;
import com.brandit.entity.Contact;
import com.brandit.entity.Newsletter;
import com.brandit.entity.Testimonial;
import com.brandit.repository.BookingRepository;
import com.brandit.repository.ContactRepository;
import com.brandit.repository.NewsletterRepository;
import com.brandit.repository.TestimonialRepository;
import com.brandit.repository.UserRepository;
import com.brandit.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.net.URI;
import java.sql.Connection;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class PublicController {

    private final ContactRepository contactRepository;
    private final NewsletterRepository newsletterRepository;
    private final TestimonialRepository testimonialRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    private final DataSource dataSource;

    @Value("${resend.api.key:}")
    private String resendApiKey;

    @Value("${app.mail.from:NOT_SET}")
    private String fromEmail;

    @PostMapping("/contact")
    public ResponseEntity<MessageResponse> submitContact(@Valid @RequestBody ContactRequest request) {
        Contact contact = Contact.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .serviceInterested(request.getServiceInterested())
                .message(request.getMessage())
                .status(Contact.Status.NEW)
                .build();
        contactRepository.save(contact);

        // Dispatch notification email to BrandIt Team
        String senderName = (request.getFirstName() != null ? request.getFirstName() : "") + " "
                + (request.getLastName() != null ? request.getLastName() : "");
        emailService.sendContactNotification(senderName.trim(), request.getEmail(), request.getPhone(),
                request.getServiceInterested(), request.getMessage());

        return ResponseEntity.ok(
                new MessageResponse("Thank you! Your message has been received. We will contact you within 24 hours."));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new HashMap<>();
        try (Connection conn = dataSource.getConnection()) {
            String dbUrl = conn.getMetaData().getURL();
            String dbType = dbUrl.contains("postgresql") ? "PostgreSQL" : dbUrl.contains("h2") ? "H2" : "Unknown";
            health.put("database", dbType);
            health.put("databaseUrl", dbUrl.replaceAll("password=[^&]*", "password=***"));
            health.put("userCount", userRepository.count());
            health.put("status", "UP");
        } catch (Exception e) {
            health.put("status", "DB_ERROR");
            health.put("error", e.getMessage());
        }
        health.put("resendConfigured",
                resendApiKey != null && !resendApiKey.isBlank() && resendApiKey.startsWith("re_"));
        health.put("mailFrom", fromEmail);
        return ResponseEntity.ok(health);
    }

    @PostMapping("/newsletter")
    public ResponseEntity<MessageResponse> subscribeNewsletter(@Valid @RequestBody NewsletterRequest request) {
        // Always dispatch Welcome email so user gets confirmation regardless of duplicate submission
        emailService.sendNewsletterWelcomeEmail(request.getEmail());

        if (newsletterRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.ok(new MessageResponse("Welcome back! Your newsletter confirmation email has been sent."));
        }

        Newsletter newsletter = Newsletter.builder()
                .email(request.getEmail())
                .active(true)
                .build();
        newsletterRepository.save(newsletter);

        return ResponseEntity.ok(new MessageResponse("Successfully subscribed to the BrandIt newsletter!"));
    }

    @GetMapping("/testimonials")
    public ResponseEntity<List<TestimonialResponse>> getApprovedTestimonials() {
        List<TestimonialResponse> list = testimonialRepository.findByApprovedTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToTestimonialResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    private TestimonialResponse mapToTestimonialResponse(Testimonial t) {
        TestimonialResponse res = new TestimonialResponse();
        res.setId(t.getId());
        res.setClientName(t.getClientName());
        res.setClientRole(t.getClientRole());
        res.setClientCompany(t.getClientCompany());
        res.setClientAvatarUrl(t.getClientAvatarUrl());
        res.setContent(t.getContent());
        res.setResult(t.getResult());
        res.setRating(t.getRating());
        res.setApproved(t.isApproved());
        res.setCreatedAt(t.getCreatedAt());
        return res;
    }

    @GetMapping({"/public/bookings/{id}/payment-proof", "/bookings/public/{id}/payment-proof"})
    public ResponseEntity<byte[]> getPaymentProofImage(@PathVariable Long id) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String screenshot = bookingOpt.get().getPaymentScreenshot();
        if (screenshot == null || screenshot.isBlank()) {
            return ResponseEntity.notFound().build();
        }
        return buildImageResponse(screenshot);
    }

    @GetMapping({"/public/bookings/payment-proof-by-ref", "/bookings/public/payment-proof-by-ref"})
    public ResponseEntity<byte[]> getPaymentProofImageByRef(@RequestParam String ref) {
        if (ref == null || ref.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Booking> bookingOpt = bookingRepository.findFirstByPaymentIdOrderByCreatedAtDesc(ref.trim());
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        String screenshot = bookingOpt.get().getPaymentScreenshot();
        if (screenshot == null || screenshot.isBlank()) {
            return ResponseEntity.notFound().build();
        }
        return buildImageResponse(screenshot);
    }

    private ResponseEntity<byte[]> buildImageResponse(String screenshotData) {
        try {
            if (screenshotData.startsWith("http://") || screenshotData.startsWith("https://")) {
                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create(screenshotData))
                        .build();
            }

            String base64Data = screenshotData;
            MediaType contentType = MediaType.IMAGE_JPEG;

            if (screenshotData.contains(",")) {
                String[] parts = screenshotData.split(",", 2);
                String header = parts[0].toLowerCase();
                base64Data = parts[1];
                if (header.contains("image/png")) {
                    contentType = MediaType.IMAGE_PNG;
                } else if (header.contains("image/webp")) {
                    contentType = MediaType.parseMediaType("image/webp");
                } else if (header.contains("image/gif")) {
                    contentType = MediaType.IMAGE_GIF;
                }
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64Data.trim());
            return ResponseEntity.ok()
                    .contentType(contentType)
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                    .body(imageBytes);
        } catch (Exception e) {
            log.error("Failed to decode payment screenshot image bytes", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/public/live-visitors")
    public ResponseEntity<Map<String, Object>> getLiveVisitors() {
        // Calculate organic dynamic visitor count based on current time & active registered count
        long totalUsers = userRepository.count();
        long currentMin = System.currentTimeMillis() / 60000;
        int dynamicFluctuation = (int) (currentMin % 12);
        int activeCount = (int) Math.max(16, Math.min(42, 18 + (totalUsers % 5) + dynamicFluctuation));

        Map<String, Object> res = new HashMap<>();
        res.put("activeVisitors", activeCount);
        res.put("activeCoaches", 5);
        res.put("status", "ONLINE");
        return ResponseEntity.ok(res);
    }
}
