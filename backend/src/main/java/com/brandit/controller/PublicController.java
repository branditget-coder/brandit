package com.brandit.controller;

import com.brandit.dto.CommonDtos.*;
import com.brandit.entity.Contact;
import com.brandit.entity.Newsletter;
import com.brandit.entity.Testimonial;
import com.brandit.repository.ContactRepository;
import com.brandit.repository.NewsletterRepository;
import com.brandit.repository.TestimonialRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PublicController {

    private final ContactRepository contactRepository;
    private final NewsletterRepository newsletterRepository;
    private final TestimonialRepository testimonialRepository;
    private final com.brandit.service.EmailService emailService;

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
        String senderName = (request.getFirstName() != null ? request.getFirstName() : "") + " " + (request.getLastName() != null ? request.getLastName() : "");
        emailService.sendContactNotification(senderName.trim(), request.getEmail(), request.getPhone(), request.getServiceInterested(), request.getMessage());

        return ResponseEntity.ok(new MessageResponse("Thank you! Your message has been received. We will contact you within 24 hours."));
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
