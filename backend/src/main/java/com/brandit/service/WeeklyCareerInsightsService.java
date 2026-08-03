package com.brandit.service;

import com.brandit.dto.CommonDtos.BroadcastInsightsResponse;
import com.brandit.entity.Newsletter;
import com.brandit.repository.NewsletterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeeklyCareerInsightsService {

    private final NewsletterRepository newsletterRepository;
    private final EmailService emailService;

    private static final String DEFAULT_WEEKLY_SUBJECT = "🚀 BrandIt Weekly Insights: 5 LinkedIn Personal Branding Strategies for 2026";
    private static final String DEFAULT_WEEKLY_CONTENT = 
        "<h3 style='color:#0A66C2; margin-top:0;'>This Week's Executive Career Blueprint</h3>" +
        "<p>Building an authoritative personal brand is no longer optional—it is the single highest-ROI asset for senior professionals and founders.</p>" +
        "<ul>" +
        "  <li><strong>1. Optimize your Headline for Search:</strong> Use Target Role + Core Expertise + Tangible Metric (e.g. <em>VP of Product | Scaling SaaS Platforms to $50M ARR</em>).</li>" +
        "  <li><strong>2. Leverage the Featured Section:</strong> Pin your top-performing posts, press mentions, and case studies to convert profile visits into inbound opportunities.</li>" +
        "  <li><strong>3. Write High-Hook Posts:</strong> Start your LinkedIn posts with strong problem statements. Avoid fluff.</li>" +
        "  <li><strong>4. Engage with Industry Leaders:</strong> Leave thoughtful, value-add comments on top voice posts in your niche.</li>" +
        "  <li><strong>5. Quantify Your Experience on Resume:</strong> Use the Google X-Y-Z formula: <em>Accomplished [X], as measured by [Y], by doing [Z]</em>.</li>" +
        "</ul>" +
        "<p style='margin-top:16px;'>Want a tailored 1-on-1 audit of your LinkedIn profile and executive resume? Reply directly to this email or book a strategy session with our lead team!</p>";

    /**
     * Automated Weekly Scheduler: Runs every Monday at 9:00 AM IST by default (0 0 9 * * MON).
     */
    @Scheduled(cron = "${app.insights.cron:0 0 9 * * MON}")
    public void scheduleWeeklyCareerInsights() {
        log.info("⏰ Triggering Automated Weekly Career Insights Scheduled Task...");
        List<Newsletter> subscribers = newsletterRepository.findByActiveTrue();
        if (subscribers.isEmpty()) {
            log.info("No active subscribers found for Weekly Career Insights.");
            return;
        }

        log.info("Sending Automated Weekly Career Insights to {} active subscribed accounts.", subscribers.size());
        for (Newsletter subscriber : subscribers) {
            try {
                emailService.sendWeeklyCareerInsightDigest(subscriber.getEmail(), DEFAULT_WEEKLY_SUBJECT, DEFAULT_WEEKLY_CONTENT);
            } catch (Exception e) {
                log.error("Failed to send scheduled weekly insight to {}: {}", subscriber.getEmail(), e.getMessage());
            }
        }
        log.info("✅ Automated Weekly Career Insights broadcast complete.");
    }

    /**
     * On-Demand Broadcast Triggered by Admin
     */
    public BroadcastInsightsResponse broadcastCustomInsights(String subject, String contentHtml) {
        List<Newsletter> activeSubscribers = newsletterRepository.findByActiveTrue();
        int totalSubscribers = activeSubscribers.size();
        int sentCount = 0;

        String finalSubject = (subject != null && !subject.isBlank()) ? subject : DEFAULT_WEEKLY_SUBJECT;
        String finalContent = (contentHtml != null && !contentHtml.isBlank()) ? contentHtml : DEFAULT_WEEKLY_CONTENT;

        log.info("Admin initiated Career Weekly Insights broadcast to {} active subscribers.", totalSubscribers);

        for (Newsletter subscriber : activeSubscribers) {
            try {
                emailService.sendWeeklyCareerInsightDigest(subscriber.getEmail(), finalSubject, finalContent);
                sentCount++;
            } catch (Exception e) {
                log.error("Failed to dispatch weekly insight to {}: {}", subscriber.getEmail(), e.getMessage());
            }
        }

        BroadcastInsightsResponse response = new BroadcastInsightsResponse();
        response.setTotalSubscribers(totalSubscribers);
        response.setSentCount(sentCount);
        response.setStatusMessage(sentCount > 0 
                ? "Weekly Career Insights broadcasted successfully to " + sentCount + " account(s)." 
                : "No active subscribers found to receive broadcast.");
        response.setDispatchedAt(LocalDateTime.now());
        return response;
    }
}
