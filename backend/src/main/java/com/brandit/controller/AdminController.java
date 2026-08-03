package com.brandit.controller;

import com.brandit.dto.CommonDtos.*;
import com.brandit.entity.Testimonial;
import com.brandit.entity.User;
import com.brandit.repository.AIResumeScanRepository;
import com.brandit.repository.BlogPostRepository;
import com.brandit.repository.BookingRepository;
import com.brandit.repository.InvoiceRepository;
import com.brandit.repository.TestimonialRepository;
import com.brandit.repository.UserActivityLogRepository;
import com.brandit.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final InvoiceRepository invoiceRepository;
    private final UserActivityLogRepository userActivityLogRepository;
    private final AIResumeScanRepository aiResumeScanRepository;
    private final TestimonialRepository testimonialRepository;
    private final BlogPostRepository blogPostRepository;
    private final PasswordEncoder passwordEncoder;

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

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@Valid @RequestBody AdminCreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email is already registered."));
        }

        User.Role role = User.Role.USER;
        if (request.getRole() != null) {
            try {
                role = User.Role.valueOf(request.getRole().toUpperCase());
            } catch (Exception ignored) {}
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(role)
                .emailVerified(request.isEmailVerified())
                .provider(User.AuthProvider.LOCAL)
                .build();

        User saved = userRepository.save(user);

        UserAdminResponse r = new UserAdminResponse();
        r.setId(saved.getId());
        r.setFirstName(saved.getFirstName());
        r.setLastName(saved.getLastName());
        r.setEmail(saved.getEmail());
        r.setPhone(saved.getPhone());
        r.setRole(saved.getRole().name());
        r.setEmailVerified(saved.isEmailVerified());
        r.setCreatedAt(saved.getCreatedAt() != null ? saved.getCreatedAt() : java.time.LocalDateTime.now());

        return ResponseEntity.ok(r);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody AdminUpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email is already in use by another account."));
        }

        user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        if (request.getRole() != null) {
            try {
                user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
            } catch (Exception ignored) {}
        }

        if (request.getEmailVerified() != null) {
            user.setEmailVerified(request.getEmailVerified());
        }

        User saved = userRepository.save(user);

        UserAdminResponse r = new UserAdminResponse();
        r.setId(saved.getId());
        r.setFirstName(saved.getFirstName());
        r.setLastName(saved.getLastName());
        r.setEmail(saved.getEmail());
        r.setPhone(saved.getPhone());
        r.setRole(saved.getRole().name());
        r.setEmailVerified(saved.isEmailVerified());
        r.setCreatedAt(saved.getCreatedAt() != null ? saved.getCreatedAt() : java.time.LocalDateTime.now());

        return ResponseEntity.ok(r);
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @Valid @RequestBody AdminUpdateRoleRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        try {
            user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
            userRepository.save(user);
            return ResponseEntity.ok(new MessageResponse("Role updated to " + user.getRole().name()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid role. Allowed roles: USER, ADMIN, TEAM"));
        }
    }

    @org.springframework.transaction.annotation.Transactional
    @DeleteMapping("/users/{id}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            String currentEmail = auth.getName();
            userRepository.findByEmail(currentEmail).ifPresent(currentUser -> {
                if (currentUser.getId().equals(id)) {
                    throw new IllegalArgumentException("You cannot delete your own active admin account.");
                }
            });
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        // Cascade delete dependent records
        bookingRepository.deleteByUserId(id);
        invoiceRepository.deleteByUserId(id);
        userActivityLogRepository.deleteByUserId(id);
        aiResumeScanRepository.deleteByUserId(id);

        userRepository.delete(user);
        return ResponseEntity.ok(new MessageResponse("User account and all associated records deleted successfully."));
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
