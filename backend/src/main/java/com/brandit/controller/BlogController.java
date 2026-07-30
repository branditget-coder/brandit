package com.brandit.controller;

import com.brandit.dto.CommonDtos.*;
import com.brandit.service.BlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @GetMapping
    public ResponseEntity<List<BlogPostResponse>> getPublishedPosts(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(blogService.getPublishedPosts(category));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogPostDetailResponse> getPostBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getPostBySlug(slug));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogPostResponse> createPost(@Valid @RequestBody CreateBlogRequest request) {
        return ResponseEntity.ok(blogService.createPost(request));
    }
}
