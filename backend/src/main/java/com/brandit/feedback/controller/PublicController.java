package com.brandit.feedback.controller;

import com.brandit.common.dto.CommonDtos.*;
import com.brandit.booking.entity.Booking;
import com.brandit.feedback.entity.Contact;
import com.brandit.newsletter.entity.Newsletter;
import com.brandit.feedback.entity.Testimonial;
import com.brandit.booking.repository.BookingRepository;
import com.brandit.feedback.repository.ContactRepository;
import com.brandit.newsletter.repository.NewsletterRepository;
import com.brandit.feedback.repository.TestimonialRepository;
import com.brandit.user.repository.UserRepository;
import com.brandit.notification.service.EmailService;
import com.brandit.notification.service.provider.EmailTemplateBuilder;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
            health.put("status", "UP");
        } catch (Exception e) {
            health.put("status", "DOWN");
        }
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
    public ResponseEntity<byte[]> getPaymentProofImage(@PathVariable Long id,
                                                       @RequestParam(required = false) String token,
                                                       @AuthenticationPrincipal UserDetails userDetails) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Booking booking = bookingOpt.get();

        // Access Control: Must provide cryptographic token from official notification email,
        // OR be an authenticated Admin / Team member or booking owner.
        boolean authorized = false;
        if (token != null && !token.isBlank()) {
            String expected = EmailTemplateBuilder.generateProofToken(id, booking.getPaymentId());
            if (expected.equalsIgnoreCase(token.trim())) {
                authorized = true;
            }
        }
        if (!authorized && userDetails != null) {
            String currentUserEmail = userDetails.getUsername();
            boolean isStaff = userDetails.getAuthorities().stream().anyMatch(a ->
                    a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_TEAM"));
            boolean isOwner = booking.getUser() != null &&
                    booking.getUser().getEmail() != null &&
                    booking.getUser().getEmail().equalsIgnoreCase(currentUserEmail);
            if (isStaff || isOwner) {
                authorized = true;
            }
        }

        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String screenshot = booking.getPaymentScreenshot();
        if (screenshot == null || screenshot.isBlank()) {
            return ResponseEntity.notFound().build();
        }
        return buildImageResponse(screenshot);
    }

    @GetMapping({"/public/bookings/payment-proof-by-ref", "/bookings/public/payment-proof-by-ref"})
    public ResponseEntity<byte[]> getPaymentProofImageByRef(@RequestParam String ref,
                                                            @RequestParam(required = false) String token,
                                                            @AuthenticationPrincipal UserDetails userDetails) {
        if (ref == null || ref.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Booking> bookingOpt = bookingRepository.findFirstByPaymentIdOrderByCreatedAtDesc(ref.trim());
        if (bookingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Booking booking = bookingOpt.get();

        boolean authorized = false;
        if (token != null && !token.isBlank()) {
            String expected = EmailTemplateBuilder.generateProofToken(booking.getId(), booking.getPaymentId());
            if (expected.equalsIgnoreCase(token.trim())) {
                authorized = true;
            }
        }
        if (!authorized && userDetails != null) {
            String currentUserEmail = userDetails.getUsername();
            boolean isStaff = userDetails.getAuthorities().stream().anyMatch(a ->
                    a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_TEAM"));
            boolean isOwner = booking.getUser() != null &&
                    booking.getUser().getEmail() != null &&
                    booking.getUser().getEmail().equalsIgnoreCase(currentUserEmail);
            if (isStaff || isOwner) {
                authorized = true;
            }
        }

        if (!authorized) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String screenshot = booking.getPaymentScreenshot();
        if (screenshot == null || screenshot.isBlank()) {
            return ResponseEntity.notFound().build();
        }
        return buildImageResponse(screenshot);
    }

    private ResponseEntity<byte[]> buildImageResponse(String screenshotData) {
        try {
            if (screenshotData.startsWith("http://") || screenshotData.startsWith("https://")) {
                URI uri = URI.create(screenshotData);
                String host = uri.getHost() != null ? uri.getHost().toLowerCase() : "";
                // Validate host against trusted cloud storage / platform domains to prevent open redirects
                boolean isTrustedHost = host.endsWith("amazonaws.com") ||
                        host.endsWith("railway.app") ||
                        host.endsWith("vercel.app") ||
                        host.endsWith("go-brandit.com");

                if (!isTrustedHost) {
                    log.warn("Blocked redirect to untrusted external host: {}", host);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
                }

                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(uri)
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
