package com.brandit.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.from:brandit.get@gmail.com}")
    private String fromEmail;

    @Value("${app.frontend.url:https://brandit-frontend.vercel.app}")
    private String frontendUrl;

    /**
     * Common HTML Header layout wrapper
     */
    private String wrapHtmlTemplate(String title, String bodyHtml) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<style>" +
                "  body { margin:0; padding:0; background-color:#F3F4F6; font-family:'Plus Jakarta Sans', 'Inter', Helvetica, Arial, sans-serif; color:#1F2937; }" +
                "  .container { max-width:600px; margin:30px auto; background-color:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08); }" +
                "  .header { background: linear-gradient(135deg, #0A66C2 0%, #004182 100%); padding:32px 24px; text-align:center; color:#FFFFFF; }" +
                "  .logo-badge { display:inline-block; background-color:#FFFFFF; color:#0A66C2; font-weight:900; font-size:24px; padding:6px 16px; border-radius:10px; margin-bottom:12px; font-family:sans-serif; }" +
                "  .logo-badge span { color:#60A5FA; }" +
                "  .title { margin:0; font-size:22px; font-weight:800; letter-spacing:-0.02em; color:#FFFFFF; }" +
                "  .tagline { margin:6px 0 0 0; font-size:13px; opacity:0.85; font-weight:500; letter-spacing:0.02em; }" +
                "  .content { padding:32px 28px; line-height:1.65; color:#374151; font-size:15px; }" +
                "  .card { background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:20px; margin:20px 0; }" +
                "  .btn { display:inline-block; background-color:#0A66C2; color:#FFFFFF !important; text-decoration:none; padding:14px 28px; border-radius:10px; font-weight:700; font-size:15px; margin-top:16px; text-align:center; box-shadow:0 4px 14px rgba(10,102,194,0.3); }" +
                "  .footer { background-color:#111827; padding:24px; text-align:center; color:#9CA3AF; font-size:12px; line-height:1.6; }" +
                "  .footer a { color:#60A5FA; text-decoration:none; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "  <div class='header'>" +
                "    <div class='logo-badge'>B<span>i</span></div>" +
                "    <h1 class='title'>BrandIt Consulting</h1>" +
                "    <p class='tagline'>Your Profile, Your Brand, Your Opportunity</p>" +
                "  </div>" +
                "  <div class='content'>" +
                "    " + bodyHtml +
                "  </div>" +
                "  <div class='footer'>" +
                "    <p style='margin:0 0 8px 0;'><strong>BrandIt Consulting & Personal Branding</strong></p>" +
                "    <p style='margin:0 0 12px 0;'>Hritika Seth (Consultant) • Kritika Dhawan (Operations)</p>" +
                "    <p style='margin:0;'>Email: <a href='mailto:brandit.get@gmail.com'>brandit.get@gmail.com</a> | Visit: <a href='" + frontendUrl + "'>BrandIt Portal</a></p>" +
                "    <p style='margin:12px 0 0 0; color:#6B7280;'>© " + java.time.Year.now().getValue() + " BrandIt. All rights reserved.</p>" +
                "  </div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    /**
     * 1. Send Welcome Email on Account Registration
     */
    @Async
    public void sendWelcomeEmail(String toEmail, String clientName, String role) {
        String subject = "Welcome to BrandIt — Elevate Your Personal Brand!";
        String portalLink = frontendUrl + "/login";

        String htmlBody = wrapHtmlTemplate("Welcome to BrandIt",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>Welcome aboard, " + clientName + "! 🎉</h2>" +
                "<p>Thank you for creating your account with <strong>BrandIt</strong>. We are thrilled to partner with you on your career and personal branding journey.</p>" +
                "<div class='card'>" +
                "  <p style='margin:0 0 8px 0;'><strong>Account Summary:</strong></p>" +
                "  <p style='margin:4px 0;'>📧 Registered Email: <strong>" + toEmail + "</strong></p>" +
                "  <p style='margin:4px 0;'>🔒 Account Role: <strong>" + role + " Portal Access</strong></p>" +
                "</div>" +
                "<p>Through your portal, you can view booked consultation slots, access invoices, track personal branding milestones, and change password & security settings anytime.</p>" +
                "<div style='text-align:center;'>" +
                "  <a href='" + portalLink + "' class='btn'>Access Your Portal &rarr;</a>" +
                "</div>"
        );

        dispatchEmail(toEmail, subject, htmlBody);
    }

    /**
     * 2. Send Booking & Payment Confirmation Email
     */
    @Async
    public void sendBookingConfirmation(String toEmail, String clientName, String serviceName, String bookingDate, String bookingTime, String price, String paymentId) {
        String subject = "Booking Confirmed: " + serviceName + " — BrandIt";
        String dashboardLink = frontendUrl + "/dashboard";

        String htmlBody = wrapHtmlTemplate("Booking Confirmation",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>Booking Confirmed, " + clientName + "! ✅</h2>" +
                "<p>Your consultation booking with BrandIt has been successfully processed. Here is your official booking summary:</p>" +
                "<div class='card'>" +
                "  <h3 style='margin:0 0 12px 0; color:#0A66C2; font-size:16px;'>📋 Booking Summary</h3>" +
                "  <table style='width:100%; border-collapse:collapse; font-size:14px; color:#374151;'>" +
                "    <tr><td style='padding:6px 0; color:#6B7280;'>Service Package:</td><td style='padding:6px 0; font-weight:700; text-align:right;'>" + serviceName + "</td></tr>" +
                "    <tr><td style='padding:6px 0; color:#6B7280;'>Amount Paid:</td><td style='padding:6px 0; font-weight:700; text-align:right; color:#16A34A;'>" + price + "</td></tr>" +
                "    <tr><td style='padding:6px 0; color:#6B7280;'>Scheduled Date:</td><td style='padding:6px 0; font-weight:700; text-align:right;'>" + bookingDate + "</td></tr>" +
                "    <tr><td style='padding:6px 0; color:#6B7280;'>Time Slot:</td><td style='padding:6px 0; font-weight:700; text-align:right;'>" + bookingTime + " IST</td></tr>" +
                "    <tr><td style='padding:6px 0; color:#6B7280;'>Transaction Ref:</td><td style='padding:6px 0; font-family:monospace; text-align:right;'>" + (paymentId != null ? paymentId : "CONFIRMED") + "</td></tr>" +
                "  </table>" +
                "</div>" +
                "<h3 style='color:#111827; font-size:16px; margin-top:24px;'>📞 What Happens Next?</h3>" +
                "<p>Our lead consultants <strong>Hritika Seth</strong> and <strong>Kritika Dhawan</strong> will reach out via WhatsApp/Phone shortly before your scheduled slot with your video call link.</p>" +
                "<div class='card' style='background-color:#F0F9FF; border-color:#BAE6FD;'>" +
                "  <p style='margin:0;'><strong>Consultant Contacts:</strong></p>" +
                "  <p style='margin:4px 0 0 0;'>• Hritika Seth (Consultant): <a href='tel:+918708231539' style='color:#0A66C2;'>+91 8708231539</a></p>" +
                "  <p style='margin:4px 0 0 0;'>• Kritika Dhawan (Operations): <a href='tel:+916284318951' style='color:#0A66C2;'>+91 6284318951</a></p>" +
                "</div>" +
                "<div style='text-align:center;'>" +
                "  <a href='" + dashboardLink + "' class='btn'>View My Bookings &rarr;</a>" +
                "</div>"
        );

        dispatchEmail(toEmail, subject, htmlBody);
    }

    /**
     * 3. Send Password Reset Email
     */
    @Async
    public void sendPasswordResetEmail(String toEmail, String clientName, String resetToken) {
        String subject = "Reset Your BrandIt Account Password";
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

        String htmlBody = wrapHtmlTemplate("Password Reset Request",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>Hello " + clientName + ",</h2>" +
                "<p>We received a request to reset your password for your <strong>BrandIt</strong> account (" + toEmail + ").</p>" +
                "<p>Click the button below to choose a new password. This link is valid for <strong>1 hour</strong>:</p>" +
                "<div style='text-align:center; margin:28px 0;'>" +
                "  <a href='" + resetLink + "' class='btn' style='background-color:#DC2626;'>Reset Password &rarr;</a>" +
                "</div>" +
                "<div class='card' style='background-color:#FEF2F2; border-color:#FCA5A5; color:#991B1B; font-size:13px;'>" +
                "  <p style='margin:0;'>⚠️ If you did not initiate this request, you can safely ignore this email. Your password will remain unchanged.</p>" +
                "</div>"
        );

        dispatchEmail(toEmail, subject, htmlBody);
    }

    /**
     * 4. Send Contact Form Submission Notification to BrandIt Team
     */
    @Async
    public void sendContactNotification(String senderName, String senderEmail, String phone, String serviceInterested, String messageText) {
        String subject = "New Contact Inquiry from " + senderName + " — BrandIt";
        String adminEmail = "brandit.get@gmail.com";

        String htmlBody = wrapHtmlTemplate("New Inquiry Received",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>New Website Inquiry 📩</h2>" +
                "<div class='card'>" +
                "  <p style='margin:4px 0;'><strong>From:</strong> " + senderName + " (" + senderEmail + ")</p>" +
                "  <p style='margin:4px 0;'><strong>Phone:</strong> " + (phone != null ? phone : "N/A") + "</p>" +
                "  <p style='margin:4px 0;'><strong>Interested In:</strong> " + (serviceInterested != null ? serviceInterested : "General Inquiry") + "</p>" +
                "</div>" +
                "<h3 style='color:#111827; font-size:15px;'>Message Details:</h3>" +
                "<div class='card' style='background-color:#FFFFFF;'>" +
                "  <p style='margin:0; white-space:pre-wrap;'>" + messageText + "</p>" +
                "</div>"
        );

        dispatchEmail(adminEmail, subject, htmlBody);
    }

    /**
     * Core Dispatcher using MimeMessage (HTML) with SimpleMailMessage fallback
     */
    private void dispatchEmail(String to, String subject, String htmlBody) {
        log.info("================ EMAIL DISPATCH LOG ================");
        log.info("To: {}", to);
        log.info("Subject: {}", subject);
        log.info("====================================================");

        if (mailSender == null) {
            log.warn("JavaMailSender is not initialized. Email log printed above.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML format

            mailSender.send(message);
            log.info("HTML Email successfully dispatched to {}", to);
        } catch (Exception e) {
            log.warn("MimeMessage HTML dispatch failed ({}), attempting plain-text fallback...", e.getMessage());
            try {
                SimpleMailMessage plainMsg = new SimpleMailMessage();
                plainMsg.setFrom(fromEmail);
                plainMsg.setTo(to);
                plainMsg.setSubject(subject);
                plainMsg.setText(htmlBody.replaceAll("<[^>]*>", "")); // Strip tags for plain text
                mailSender.send(plainMsg);
                log.info("Fallback plain text email sent to {}", to);
            } catch (Exception fallbackErr) {
                log.error("Failed to send fallback plain text email to {}: {}", to, fallbackErr.getMessage());
            }
        }
    }
}
