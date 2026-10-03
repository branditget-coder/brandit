package com.brandit.newsletter.job;

import com.brandit.common.dto.CommonDtos.BroadcastInsightsResponse;
import com.brandit.common.dto.CommonDtos.WeeklyInsightEdition;
import com.brandit.newsletter.entity.Newsletter;
import com.brandit.admin.entity.UserActivityLog;
import com.brandit.newsletter.repository.NewsletterRepository;
import com.brandit.admin.repository.UserActivityLogRepository;
import com.brandit.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeeklyCareerInsightsService {

    private final NewsletterRepository newsletterRepository;
    private final UserActivityLogRepository userActivityLogRepository;
    private final EmailService emailService;

    /**
     * Curated Library of Fresh, Catchy, Easy-to-Read Weekly Editions with Images.
     * Rotates automatically every Monday so every week delivers a new and fresh email!
     */
    private static final List<WeeklyInsightEdition> FRESH_WEEKLY_EDITIONS;

    static {
        List<WeeklyInsightEdition> list = new ArrayList<>();

        // Edition 1: The 3-Second LinkedIn Hook
        list.add(WeeklyInsightEdition.builder()
                .id("linkedin_hook_trick")
                .title("The 3-Second LinkedIn Hook (10x Profile Views)")
                .subject("🔥 Steal This 3-Second Trick to 10x Your Profile Views")
                .badge("LinkedIn Growth")
                .imageUrl("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80")
                .imageAlt("Creative modern digital gradient background")
                .summary("How to turn your LinkedIn headline into an inbound opportunity magnet.")
                .contentHtml(
                        "<div style='margin-bottom:18px; text-align:center;'>" +
                        "  <img src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' alt='LinkedIn Growth' style='width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);' />" +
                        "</div>" +
                        "<div style='margin-bottom:12px;'>" +
                        "  <span style='display:inline-block; background-color:#EEF2FF; color:#4F46E5; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;'>✨ MONDAY QUICK WIN</span>" +
                        "</div>" +
                        "<h3 style='color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;'>The 3-Second LinkedIn Hook That Attracts Recruiters</h3>" +
                        "<p style='font-size:15px; color:#334155; line-height:1.6; margin-top:0;'>Happy Monday! 👋 Ever feel like your profile gets lost in the crowd? Most LinkedIn headlines are totally invisible because they only list a dry job title. Here are 3 quick tweaks you can make in 2 minutes:</p>" +
                        "<div style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;'>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>🎯 <strong>Use the 3-Part Hook:</strong> [Role] + [Who You Help] + [Tangible Win].<br><span style='color:#64748B;'>Example: <em>Lead Designer | Helping SaaS teams turn clicks into happy paying users</em></span></p>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>📸 <strong>Friendly Smiling Photo:</strong> Profiles with a warm smile and clean background get <strong>14x more views</strong>.</p>" +
                        "  <p style='margin:0; color:#1E293B; font-size:14px; line-height:1.6;'>⚡ <strong>Pin Your Proof:</strong> Put your proudest case study or recommendation right in your Featured section.</p>" +
                        "</div>" +
                        "<div style='background-color:#F0FDF4; border:1px solid #BBF7D0; border-left:4px solid #16A34A; border-radius:10px; padding:12px 16px; margin:16px 0;'>" +
                        "  <p style='margin:0; font-weight:700; color:#15803D; font-size:14px;'>⚡ 2-Minute Monday Challenge:</p>" +
                        "  <p style='margin:4px 0 0 0; color:#166534; font-size:13px;'>Open your LinkedIn profile right now and update your headline before your coffee gets cold!</p>" +
                        "</div>" +
                        "<p style='font-size:14px; color:#64748B; margin:16px 0 0 0;'>Go crush this week! 🚀<br><strong>— The BrandIt Team</strong></p>"
                )
                .build());

        // Edition 2: The 6-Second Resume Scanner Secret
        list.add(WeeklyInsightEdition.builder()
                .id("resume_scanner_secret")
                .title("Why 90% of Resumes Get Skipped (And How to Win)")
                .subject("📄 Why 90% of Resumes Get Skipped in 6 Seconds")
                .badge("Resume Secret")
                .imageUrl("https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80")
                .imageAlt("Clean modern workspace with notebook and pen")
                .summary("Recruiters only scan for 6 seconds. Here is how to make every second count.")
                .contentHtml(
                        "<div style='margin-bottom:18px; text-align:center;'>" +
                        "  <img src='https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80' alt='Resume Hack' style='width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);' />" +
                        "</div>" +
                        "<div style='margin-bottom:12px;'>" +
                        "  <span style='display:inline-block; background-color:#FEF3C7; color:#B45309; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;'>📄 RESUME MAKEOVER</span>" +
                        "</div>" +
                        "<h3 style='color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;'>Pass the 6-Second Recruiter Glance</h3>" +
                        "<p style='font-size:15px; color:#334155; line-height:1.6; margin-top:0;'>Happy Monday! 👋 Recruiters review hundreds of resumes every single week. If your CV is a dense block of text, it gets skipped. Here's how to stand out instantly:</p>" +
                        "<div style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;'>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>💥 <strong>Ditch Fuzzy Buzzwords:</strong> Replace 'hard worker' and 'responsible for' with action verbs like <em>spearheaded</em>, <em>accelerated</em>, and <em>built</em>.</p>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>📊 <strong>The Number Rule:</strong> Add a metric to your bullet points. <em>'Trained staff'</em> ➔ <em>'Trained 8 team members and boosted team productivity by 25%'</em>.</p>" +
                        "  <p style='margin:0; color:#1E293B; font-size:14px; line-height:1.6;'>✂️ <strong>Keep It Tight (1–2 Pages):</strong> Clean, scannable layouts get 3x more interview callbacks than cluttered 4-page documents.</p>" +
                        "</div>" +
                        "<div style='background-color:#EFF6FF; border:1px solid #BFDBFE; border-left:4px solid #2563EB; border-radius:10px; padding:12px 16px; margin:16px 0;'>" +
                        "  <p style='margin:0; font-weight:700; color:#1D4ED8; font-size:14px;'>⚡ 2-Minute Monday Challenge:</p>" +
                        "  <p style='margin:4px 0 0 0; color:#1E40AF; font-size:13px;'>Pick one bullet point on your resume today and add a percentage or number to it!</p>" +
                        "</div>" +
                        "<p style='font-size:14px; color:#64748B; margin:16px 0 0 0;'>You've got this! 🚀<br><strong>— The BrandIt Team</strong></p>"
                )
                .build());

        // Edition 3: The 1-Message Networking Hack
        list.add(WeeklyInsightEdition.builder()
                .id("networking_cheat_code")
                .title("The 1-Message Networking Hack (92% Reply Rate)")
                .subject("🚀 The 1-Message Networking Hack (92% Reply Rate)")
                .badge("Smart Networking")
                .imageUrl("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80")
                .imageAlt("Collaborative creative team sharing ideas")
                .summary("Why cold messages fail and how to write DMs people love replying to.")
                .contentHtml(
                        "<div style='margin-bottom:18px; text-align:center;'>" +
                        "  <img src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80' alt='Smart Networking' style='width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);' />" +
                        "</div>" +
                        "<div style='margin-bottom:12px;'>" +
                        "  <span style='display:inline-block; background-color:#ECFDF5; color:#047857; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;'>🚀 NETWORKING MAGIC</span>" +
                        "</div>" +
                        "<h3 style='color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;'>How to Message Anyone and Actually Get a Reply</h3>" +
                        "<p style='font-size:15px; color:#334155; line-height:1.6; margin-top:0;'>Happy Monday! 👋 Cold outreach fails when you ask for favors immediately (*'Can you refer me to your boss?'*). It succeeds when you lead with genuine appreciation:</p>" +
                        "<div style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;'>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>🎁 <strong>Give Before You Ask:</strong> Start by complimenting a specific post, article, or project they shipped recently.</p>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>⏱️ <strong>The 4-Sentence Rule:</strong> Keep it bite-sized. Busy professionals answer short, thoughtful notes 10x faster than long paragraphs.</p>" +
                        "  <p style='margin:0; color:#1E293B; font-size:14px; line-height:1.6;'>🕊️ <strong>The Zero-Pressure Ending:</strong> Close with: <em>'No need to reply, just wanted to say thank you for sharing that insight!'</em> (Ironically, this generates the highest reply rate).</p>" +
                        "</div>" +
                        "<div style='background-color:#FDF2F8; border:1px solid #FBCFE8; border-left:4px solid #DB2777; border-radius:10px; padding:12px 16px; margin:16px 0;'>" +
                        "  <p style='margin:0; font-weight:700; color:#BE185D; font-size:14px;'>⚡ 2-Minute Monday Challenge:</p>" +
                        "  <p style='margin:4px 0 0 0; color:#9D174D; font-size:13px;'>Send 1 sincere, no-strings-attached compliment to someone you admire in your industry today!</p>" +
                        "</div>" +
                        "<p style='font-size:14px; color:#64748B; margin:16px 0 0 0;'>Build meaningful connections! ✨<br><strong>— The BrandIt Team</strong></p>"
                )
                .build());

        // Edition 4: Never Say 'I Don't Know' in an Interview
        list.add(WeeklyInsightEdition.builder()
                .id("interview_bridge_technique")
                .title("Never Say 'I Don't Know' in an Interview (Say This Instead)")
                .subject("💡 Never Say 'I Don't Know' in an Interview (Say This Instead)")
                .badge("Interview Mastery")
                .imageUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80")
                .imageAlt("Confident smiling professional in a modern office")
                .summary("How to handle unexpected interview questions with poise and confidence.")
                .contentHtml(
                        "<div style='margin-bottom:18px; text-align:center;'>" +
                        "  <img src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' alt='Interview Confidence' style='width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);' />" +
                        "</div>" +
                        "<div style='margin-bottom:12px;'>" +
                        "  <span style='display:inline-block; background-color:#FEF3C7; color:#D97706; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;'>💡 INTERVIEW SECRET</span>" +
                        "</div>" +
                        "<h3 style='color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;'>Turn Tough Questions into Big Wins</h3>" +
                        "<p style='font-size:15px; color:#334155; line-height:1.6; margin-top:0;'>Happy Monday! 👋 Getting hit with a curveball question can make your heart race. But great interviewers don't expect you to have every answer memorized—they want to see how you solve problems under pressure.</p>" +
                        "<div style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;'>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>🌉 <strong>The Bridge Phrase:</strong> Instead of saying 'I don't know', say: <em>'I haven't tackled that exact scenario yet, but here is how I would break down the problem...'</em></p>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>🗣️ <strong>Think Out Loud:</strong> Walk them through your thought process. Companies hire collaborative problem-solvers, not walking encyclopedias.</p>" +
                        "  <p style='margin:0; color:#1E293B; font-size:14px; line-height:1.6;'>⏱️ <strong>Embrace the 3-Second Pause:</strong> Don't rush to speak immediately. A short pause makes you appear calm, thoughtful, and executive.</p>" +
                        "</div>" +
                        "<div style='background-color:#F0FDF4; border:1px solid #BBF7D0; border-left:4px solid #16A34A; border-radius:10px; padding:12px 16px; margin:16px 0;'>" +
                        "  <p style='margin:0; font-weight:700; color:#15803D; font-size:14px;'>⚡ 2-Minute Monday Challenge:</p>" +
                        "  <p style='margin:4px 0 0 0; color:#166534; font-size:13px;'>Practice pausing 3 seconds before answering your next phone or video call today!</p>" +
                        "</div>" +
                        "<p style='font-size:14px; color:#64748B; margin:16px 0 0 0;'>Confidence looks great on you! 🚀<br><strong>— The BrandIt Team</strong></p>"
                )
                .build());

        // Edition 5: The 15-Minute Weekly Brand Routine
        list.add(WeeklyInsightEdition.builder()
                .id("fifteen_minute_brand_routine")
                .title("The 15-Minute Brand Routine That Brings Inbound Offers")
                .subject("✨ The 15-Minute Weekly Routine for Inbound Job Offers")
                .badge("Personal Branding")
                .imageUrl("https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80")
                .imageAlt("Minimalist desk with laptop and fresh green plant")
                .summary("Build career gravity without spending hours on social media every day.")
                .contentHtml(
                        "<div style='margin-bottom:18px; text-align:center;'>" +
                        "  <img src='https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80' alt='Personal Brand Routine' style='width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);' />" +
                        "</div>" +
                        "<div style='margin-bottom:12px;'>" +
                        "  <span style='display:inline-block; background-color:#F5F3FF; color:#7C3AED; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;'>✨ BRAND ON AUTOPILOT</span>" +
                        "</div>" +
                        "<h3 style='color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;'>15 Minutes a Week is All It Takes</h3>" +
                        "<p style='font-size:15px; color:#334155; line-height:1.6; margin-top:0;'>Happy Monday! 👋 Think personal branding means posting three times a day? Absolutely not. You can build incredible career leverage in just 15 minutes across the week:</p>" +
                        "<div style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;'>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>📅 <strong>Monday (5 Mins):</strong> Share 1 real lesson from your workday last week. Real stories beat generic advice 100% of the time.</p>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>💬 <strong>Wednesday (5 Mins):</strong> Leave 2 thoughtful, value-add comments on top industry posts. Their audience becomes your audience.</p>" +
                        "  <p style='margin:0; color:#1E293B; font-size:14px; line-height:1.6;'>🤝 <strong>Friday (5 Mins):</strong> Send 3 warm connection requests to peers working at companies you respect.</p>" +
                        "</div>" +
                        "<div style='background-color:#FDF4FF; border:1px solid #F0ABFC; border-left:4px solid #C026D3; border-radius:10px; padding:12px 16px; margin:16px 0;'>" +
                        "  <p style='margin:0; font-weight:700; color:#A21CAF; font-size:14px;'>⚡ 2-Minute Monday Challenge:</p>" +
                        "  <p style='margin:4px 0 0 0; color:#86198F; font-size:13px;'>Find one inspiring post in your feed right now and write a 2-sentence thoughtful comment!</p>" +
                        "</div>" +
                        "<p style='font-size:14px; color:#64748B; margin:16px 0 0 0;'>Make yourself visible! 🌟<br><strong>— The BrandIt Team</strong></p>"
                )
                .build());

        // Edition 6: The Magic Salary Negotiation Sentence
        list.add(WeeklyInsightEdition.builder()
                .id("magic_salary_phrase")
                .title("The Magic Sentence That Adds 15% to Any Job Offer")
                .subject("💰 The Magic Sentence That Adds 15% to Any Job Offer")
                .badge("Salary Boost")
                .imageUrl("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80")
                .imageAlt("Modern glass corporate architecture reaching into the sky")
                .summary("How to negotiate your compensation with total ease and professionalism.")
                .contentHtml(
                        "<div style='margin-bottom:18px; text-align:center;'>" +
                        "  <img src='https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80' alt='Salary Negotiation' style='width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);' />" +
                        "</div>" +
                        "<div style='margin-bottom:12px;'>" +
                        "  <span style='display:inline-block; background-color:#FEF3C7; color:#B45309; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;'>💰 CAREER LEVERAGE</span>" +
                        "</div>" +
                        "<h3 style='color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;'>Never Leave Money on the Table</h3>" +
                        "<p style='font-size:15px; color:#334155; line-height:1.6; margin-top:0;'>Happy Monday! 👋 Over 60% of professionals accept their first job offer without negotiating simply because asking feels awkward. Here is how to negotiate without friction:</p>" +
                        "<div style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;'>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>🛑 <strong>Never Say 'Yes' Immediately:</strong> Always say: <em>'Thank you so much! I am thrilled. May I have 24 hours to review the full offer package?'</em></p>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>🎯 <strong>The Magic Phrase:</strong> <em>'Based on my track record delivering [Key Win] and current market benchmarks, is there room to adjust base compensation to [Target]?'</em></p>" +
                        "  <p style='margin:0; color:#1E293B; font-size:14px; line-height:1.6;'>🤫 <strong>The Power of Silence:</strong> Once you ask your question, stop talking. Wait for them to respond first.</p>" +
                        "</div>" +
                        "<div style='background-color:#EFF6FF; border:1px solid #BFDBFE; border-left:4px solid #2563EB; border-radius:10px; padding:12px 16px; margin:16px 0;'>" +
                        "  <p style='margin:0; font-weight:700; color:#1D4ED8; font-size:14px;'>⚡ 2-Minute Monday Challenge:</p>" +
                        "  <p style='margin:4px 0 0 0; color:#1E40AF; font-size:13px;'>Check the average market salary benchmark for your role on Levels.fyi or Glassdoor today!</p>" +
                        "</div>" +
                        "<p style='font-size:14px; color:#64748B; margin:16px 0 0 0;'>Know your true worth! 💼<br><strong>— The BrandIt Team</strong></p>"
                )
                .build());

        // Edition 7: Beat Imposter Syndrome in 60 Seconds
        list.add(WeeklyInsightEdition.builder()
                .id("beat_imposter_syndrome")
                .title("Beat Imposter Syndrome in 60 Seconds (The Brag Sheet)")
                .subject("⚡ Beat Imposter Syndrome in 60 Seconds (The Brag Sheet)")
                .badge("Confidence Booster")
                .imageUrl("https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80")
                .imageAlt("Ambitious professional walking forward with purpose")
                .summary("Why high achievers doubt themselves and the 1 folder that cures it.")
                .contentHtml(
                        "<div style='margin-bottom:18px; text-align:center;'>" +
                        "  <img src='https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80' alt='Beat Imposter Syndrome' style='width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);' />" +
                        "</div>" +
                        "<div style='margin-bottom:12px;'>" +
                        "  <span style='display:inline-block; background-color:#EFF6FF; color:#2563EB; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;'>⚡ MINDSET RESET</span>" +
                        "</div>" +
                        "<h3 style='color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;'>You Are More Qualified Than You Think</h3>" +
                        "<p style='font-size:15px; color:#334155; line-height:1.6; margin-top:0;'>Happy Monday! 👋 Ever feel like you just got lucky and someday someone will 'figure it out'? That's imposter syndrome talking, and it affects over 75% of high performers. Here's your antidote:</p>" +
                        "<div style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;'>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>📁 <strong>The 'Brag Sheet' Folder:</strong> Create a folder on your phone or drive. Save screenshots of nice client messages, compliments, and project wins.</p>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>🌱 <strong>Reframe the Doubt:</strong> Feeling slightly out of your comfort zone doesn't mean you're fake—it means you are expanding into a bigger role.</p>" +
                        "  <p style='margin:0; color:#1E293B; font-size:14px; line-height:1.6;'>🤝 <strong>Shift Focus Outward:</strong> Whenever self-doubt creeps in, ask: <em>'How can I help a teammate win today?'</em> Action cures anxiety every time.</p>" +
                        "</div>" +
                        "<div style='background-color:#F0FDF4; border:1px solid #BBF7D0; border-left:4px solid #16A34A; border-radius:10px; padding:12px 16px; margin:16px 0;'>" +
                        "  <p style='margin:0; font-weight:700; color:#15803D; font-size:14px;'>⚡ 2-Minute Monday Challenge:</p>" +
                        "  <p style='margin:4px 0 0 0; color:#166534; font-size:13px;'>Write down 2 accomplishments you pulled off last month and acknowledge your hard work!</p>" +
                        "</div>" +
                        "<p style='font-size:14px; color:#64748B; margin:16px 0 0 0;'>Keep moving forward with pride! 💪<br><strong>— The BrandIt Team</strong></p>"
                )
                .build());

        // Edition 8: 3 Video Call Habits That Make You Unforgettable
        list.add(WeeklyInsightEdition.builder()
                .id("virtual_presence_habits")
                .title("3 Video Call Habits That Make You Unforgettable")
                .subject("🎯 3 Video Call Habits That Make You Unforgettable on Zoom")
                .badge("Executive Presence")
                .imageUrl("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80")
                .imageAlt("Bright modern video conferencing room with natural lighting")
                .summary("Small non-verbal adjustments that command respect in remote meetings.")
                .contentHtml(
                        "<div style='margin-bottom:18px; text-align:center;'>" +
                        "  <img src='https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80' alt='Executive Presence' style='width:100%; max-width:540px; height:200px; object-fit:cover; border-radius:12px; display:block; margin:0 auto; box-shadow:0 4px 14px rgba(0,0,0,0.08);' />" +
                        "</div>" +
                        "<div style='margin-bottom:12px;'>" +
                        "  <span style='display:inline-block; background-color:#ECFDF5; color:#047857; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; letter-spacing:0.05em; text-transform:uppercase;'>🎯 EXECUTIVE PRESENCE</span>" +
                        "</div>" +
                        "<h3 style='color:#0F172A; font-size:20px; font-weight:800; margin:6px 0 14px 0; line-height:1.3;'>Level Up Your Virtual Presence in 60 Seconds</h3>" +
                        "<p style='font-size:15px; color:#334155; line-height:1.6; margin-top:0;'>Happy Monday! 👋 Over 70% of human trust is established through non-verbal cues. On Zoom and Meet calls, these 3 quick adjustments instantly make you look senior and credible:</p>" +
                        "<div style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:16px 0;'>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>👁️ <strong>Camera at Eye Level:</strong> Prop your laptop on books or a stand. Looking straight into the camera conveys authority, while looking down makes you appear disengaged.</p>" +
                        "  <p style='margin:0 0 10px 0; color:#1E293B; font-size:14px; line-height:1.6;'>💡 <strong>Front Lighting Only:</strong> Always ensure your primary light source is in front of your face, never behind your back where you turn into a shadow.</p>" +
                        "  <p style='margin:0; color:#1E293B; font-size:14px; line-height:1.6;'>🎯 <strong>Look at the Lens When Delivering Points:</strong> When stating your main proposal, look straight into the camera lens dot. To the viewer, it feels like direct eye contact.</p>" +
                        "</div>" +
                        "<div style='background-color:#FEF3C7; border:1px solid #FCD34D; border-left:4px solid #D97706; border-radius:10px; padding:12px 16px; margin:16px 0;'>" +
                        "  <p style='margin:0; font-weight:700; color:#B45309; font-size:14px;'>⚡ 2-Minute Monday Challenge:</p>" +
                        "  <p style='margin:4px 0 0 0; color:#92400E; font-size:13px;'>Raise your laptop screen by 2–3 inches right now before your next video meeting!</p>" +
                        "</div>" +
                        "<p style='font-size:14px; color:#64748B; margin:16px 0 0 0;'>Command the virtual room! 🎙️<br><strong>— The BrandIt Team</strong></p>"
                )
                .build());

        FRESH_WEEKLY_EDITIONS = Collections.unmodifiableList(list);
    }

    /**
     * Determines the current week's fresh edition using the ISO week number.
     * Since ISO week changes every Monday, this GUARANTEES a new and fresh email every Monday!
     */
    public WeeklyInsightEdition getEditionForCurrentWeek() {
        int weekNumber = LocalDate.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int index = Math.floorMod(weekNumber, FRESH_WEEKLY_EDITIONS.size());
        WeeklyInsightEdition template = FRESH_WEEKLY_EDITIONS.get(index);
        return WeeklyInsightEdition.builder()
                .id(template.getId())
                .title(template.getTitle())
                .subject(template.getSubject())
                .badge(template.getBadge())
                .imageUrl(template.getImageUrl())
                .imageAlt(template.getImageAlt())
                .summary(template.getSummary())
                .contentHtml(template.getContentHtml())
                .weekNumber(weekNumber)
                .build();
    }

    /**
     * Automated Weekly Scheduler: Runs every Monday at 9:00 AM IST (0 0 9 * * MON).
     * Automatically picks this Monday's fresh, catchy, image-rich email and dispatches it.
     */
    @Scheduled(cron = "${app.insights.cron:0 0 9 * * MON}")
    public void scheduleWeeklyCareerInsights() {
        WeeklyInsightEdition edition = getEditionForCurrentWeek();
        log.info("⏰ Triggering Automated Monday Weekly Insights broadcast for edition: [{}] (Week #{})", edition.getTitle(), edition.getWeekNumber());

        List<Newsletter> subscribers = newsletterRepository.findByActiveTrue();
        if (subscribers.isEmpty()) {
            log.info("No active subscribers found for Weekly Career Insights.");
            return;
        }

        log.info("Sending Fresh Monday Insight [{}] to {} active subscribed accounts.", edition.getTitle(), subscribers.size());
        int sentCount = 0;
        for (Newsletter subscriber : subscribers) {
            try {
                emailService.sendWeeklyCareerInsightDigest(subscriber.getEmail(), edition.getSubject(), edition.getContentHtml());
                sentCount++;
            } catch (Exception e) {
                log.error("Failed to send scheduled weekly insight to {}: {}", subscriber.getEmail(), e.getMessage());
            }
        }

        log.info("✅ Automated Monday Career Insights broadcast complete. Successfully dispatched to {}/{} accounts.", sentCount, subscribers.size());
        try {
            userActivityLogRepository.save(UserActivityLog.builder()
                    .action("AUTOMATED_WEEKLY_INSIGHTS_BROADCAST")
                    .metadataJson("{\"subscribersCount\":" + subscribers.size() +
                            ",\"sentCount\":" + sentCount +
                            ",\"editionId\":\"" + edition.getId() + "\"" +
                            ",\"editionTitle\":\"" + edition.getTitle().replace("\"", "\\\"") + "\"" +
                            ",\"weekNumber\":" + edition.getWeekNumber() +
                            ",\"subject\":\"" + edition.getSubject().replace("\"", "\\\"") + "\"}")
                    .build());
        } catch (Exception ignored) {}
    }

    /**
     * On-Demand Broadcast Triggered by Admin (can broadcast any custom or selected fresh edition)
     */
    public BroadcastInsightsResponse broadcastCustomInsights(String subject, String contentHtml) {
        List<Newsletter> activeSubscribers = newsletterRepository.findByActiveTrue();
        int totalSubscribers = activeSubscribers.size();
        int sentCount = 0;

        WeeklyInsightEdition currentWeekEdition = getEditionForCurrentWeek();
        String finalSubject = (subject != null && !subject.isBlank()) ? subject : currentWeekEdition.getSubject();
        String finalContent = (contentHtml != null && !contentHtml.isBlank()) ? contentHtml : currentWeekEdition.getContentHtml();

        log.info("Admin initiated Career Weekly Insights broadcast to {} active subscribers.", totalSubscribers);

        for (Newsletter subscriber : activeSubscribers) {
            try {
                emailService.sendWeeklyCareerInsightDigest(subscriber.getEmail(), finalSubject, finalContent);
                sentCount++;
            } catch (Exception e) {
                log.error("Failed to dispatch weekly insight to {}: {}", subscriber.getEmail(), e.getMessage());
            }
        }

        try {
            userActivityLogRepository.save(UserActivityLog.builder()
                    .action("ADMIN_WEEKLY_INSIGHTS_BROADCAST")
                    .metadataJson("{\"sentCount\":" + sentCount +
                            ",\"totalSubscribers\":" + totalSubscribers +
                            ",\"subject\":\"" + finalSubject.replace("\"", "\\\"") + "\"}")
                    .build());
        } catch (Exception ignored) {}

        BroadcastInsightsResponse response = new BroadcastInsightsResponse();
        response.setTotalSubscribers(totalSubscribers);
        response.setSentCount(sentCount);
        response.setStatusMessage(sentCount > 0 
                ? "Weekly Career Insights broadcasted successfully to " + sentCount + " account(s)." 
                : "No active subscribers found to receive broadcast.");
        response.setDispatchedAt(LocalDateTime.now());
        return response;
    }

    /**
     * Returns all fresh predefined editions.
     */
    public List<WeeklyInsightEdition> getAllEditions() {
        return FRESH_WEEKLY_EDITIONS;
    }
}
