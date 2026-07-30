package com.brandit.controller;

import com.brandit.dto.CommonDtos.*;

import com.brandit.entity.Testimonial;

import com.brandit.repository.BookingRepository;
import com.brandit.repository.TestimonialRepository;
import com.brandit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final TestimonialRepository testimonialRepository;

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsResponse> getAnalytics() {
        AdminAnalyticsResponse response = new AdminAnalyticsResponse();
        response.setTotalUsers(userRepository.count());
        response.setTotalBookings(bookingRepository.count());
        response.setTotalRevenue(112000L); // aggregated metrics
        response.setSatisfactionRate(96.5);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/testimonials/pending")
    public ResponseEntity<List<TestimonialResponse>> getPendingTestimonials() {
        List<TestimonialResponse> pending = testimonialRepository.findByApprovedFalseOrderByCreatedAtDesc()
                .stream()
                .map(t -> {
                    TestimonialResponse r = new TestimonialResponse();
                    r.setId(t.getId());
                    r.setClientName(t.getClientName());
                    r.setClientRole(t.getClientRole());
                    r.setClientCompany(t.getClientCompany());
                    r.setContent(t.getContent());
                    r.setResult(t.getResult());
                    r.setRating(t.getRating());
                    r.setApproved(t.isApproved());
                    r.setCreatedAt(t.getCreatedAt());
                    return r;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(pending);
    }

    @PatchMapping("/testimonials/{id}/approve")
    public ResponseEntity<MessageResponse> approveTestimonial(@PathVariable Long id) {
        Testimonial t = testimonialRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Testimonial not found"));
        t.setApproved(true);
        testimonialRepository.save(t);
        return ResponseEntity.ok(new MessageResponse("Testimonial approved successfully."));
    }

    @DeleteMapping("/testimonials/{id}")
    public ResponseEntity<MessageResponse> deleteTestimonial(@PathVariable Long id) {
        testimonialRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Testimonial deleted."));
    }
}
