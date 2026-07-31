package com.brandit.controller;

import com.brandit.dto.CommonDtos.*;
import com.brandit.entity.Contact;
import com.brandit.entity.Newsletter;
import com.brandit.entity.Testimonial;
import com.brandit.repository.ContactRepository;
import com.brandit.repository.NewsletterRepository;
import com.brandit.repository.TestimonialRepository;
import com.brandit.repository.UserRepository;
import com.brandit.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        if (newsletterRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.ok(new MessageResponse("You are already subscribed to our newsletter."));
        }
        Newsletter newsletter = Newsletter.builder()
                .email(request.getEmail())
                .active(true)
                .build();
        newsletterRepository.save(newsletter);

        // Dispatch Welcome email for Newsletter / Weekly Career Insights
        emailService.sendNewsletterWelcomeEmail(request.getEmail());

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
}
