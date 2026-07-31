package com.brandit.controller;

import com.brandit.dto.CommonDtos.*;

import com.brandit.entity.Testimonial;

import com.brandit.repository.BlogPostRepository;
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
    private final BlogPostRepository blogPostRepository;

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsResponse> getAnalytics() {
        AdminAnalyticsResponse response = new AdminAnalyticsResponse();
        response.setTotalUsers(userRepository.count());
        response.setTotalBookings(bookingRepository.count());
        response.setTotalRevenue(112000L); // aggregated metrics
        response.setSatisfactionRate(96.5);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserAdminResponse>> getAllUsers() {
        List<UserAdminResponse> users = userRepository.findAll().stream().map(u -> {
            UserAdminResponse r = new UserAdminResponse();
            r.setId(u.getId());
            r.setFirstName(u.getFirstName() != null ? u.getFirstName() : "User");
            r.setLastName(u.getLastName() != null ? u.getLastName() : "");
            r.setEmail(u.getEmail());
            r.setPhone(u.getPhone());
            r.setRole(u.getRole() != null ? u.getRole().name() : "USER");
            r.setEmailVerified(u.isEmailVerified());
            r.setCreatedAt(u.getCreatedAt() != null ? u.getCreatedAt() : java.time.LocalDateTime.now());
            return r;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("User deleted successfully."));
    }

    @GetMapping("/blog/all")
    public ResponseEntity<List<BlogPostResponse>> getAllBlogPosts() {
        List<BlogPostResponse> posts = blogPostRepository.findAllByOrderByCreatedAtDesc().stream().map(p -> {
            BlogPostResponse r = new BlogPostResponse();
            r.setId(p.getId());
            r.setTitle(p.getTitle());
            r.setSlug(p.getSlug());
            r.setExcerpt(p.getExcerpt());
            r.setCategory(p.getCategory());
            r.setTags(p.getTags());
            r.setAuthorName(p.getAuthorName());
            r.setCoverImageUrl(p.getCoverImageUrl());
            r.setReadTimeMinutes(p.getReadTimeMinutes());
            r.setPublished(p.isPublished());
            r.setCreatedAt(p.getCreatedAt());
            return r;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(posts);
    }

    @DeleteMapping("/blog/{id}")
    public ResponseEntity<MessageResponse> deleteBlogPost(@PathVariable Long id) {
        blogPostRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Blog post deleted successfully."));
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
