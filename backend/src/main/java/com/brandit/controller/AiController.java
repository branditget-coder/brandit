package com.brandit.controller;

import com.brandit.dto.CommonDtos.*;
import com.brandit.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/review-resume")
    public ResponseEntity<AIReviewResponse> reviewResume(@Valid @RequestBody AIReviewRequest request) {
        return ResponseEntity.ok(aiService.reviewResume(request));
    }

    @PostMapping("/review-resume-file")
    public ResponseEntity<AIReviewResponse> reviewResumeFile(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "targetRole", required = false) String targetRole) {
        return ResponseEntity.ok(aiService.reviewResumeFile(file, targetRole));
    }

    @PostMapping("/linkedin-headlines")
    public ResponseEntity<LinkedInHeadlineResponse> generateHeadlines(@Valid @RequestBody LinkedInHeadlineRequest request) {
        return ResponseEntity.ok(aiService.generateHeadlines(request));
    }
}
