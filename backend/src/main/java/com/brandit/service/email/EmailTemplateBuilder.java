package com.brandit.service.email;

import org.springframework.stereotype.Component;
import java.time.Year;

@Component
public class EmailTemplateBuilder {

    private String cleanUrl(String rawUrl) {
        if (rawUrl == null || rawUrl.isBlank()) {
            return "https://brandit-frontend.vercel.app";
        }
        String clean = rawUrl.trim();
        if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
            clean = "https://" + clean;
        }
        while (clean.endsWith("/")) {
            clean = clean.substring(0, clean.length() - 1);
        }
        return clean;
    }

    public String wrapHtmlTemplate(String title, String bodyHtml, String frontendUrl) {
        String baseUrl = cleanUrl(frontendUrl);
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<meta charset='UTF-8'>" +
                "<meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                "<style>" +
                "  body { margin:0; padding:0; background-color:#F3F4F6; font-family:'Plus Jakarta Sans', 'Inter', Helvetica, Arial, sans-serif; color:#1F2937; -webkit-text-size-adjust:100%; }" +
                "  .container { max-width:600px; margin:20px auto; background-color:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08); width:100%; box-sizing:border-box; }" +
                "  .header { background: linear-gradient(135deg, #0A66C2 0%, #004182 100%); padding:28px 20px; text-align:center; color:#FFFFFF; }" +
                "  .logo-badge { display:inline-block; background-color:#FFFFFF; color:#0A66C2; font-weight:900; font-size:24px; padding:6px 16px; border-radius:10px; margin-bottom:10px; font-family:sans-serif; }" +
                "  .logo-badge span { color:#60A5FA; }" +
                "  .title { margin:0; font-size:22px; font-weight:800; letter-spacing:-0.02em; color:#FFFFFF; }" +
                "  .tagline { margin:6px 0 0 0; font-size:13px; opacity:0.85; font-weight:500; letter-spacing:0.02em; }" +
                "  .content { padding:24px 20px; line-height:1.65; color:#374151; font-size:15px; box-sizing:border-box; word-break:break-word; overflow-wrap:break-word; }" +
                "  .card { background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:18px 20px; margin:20px 0; box-sizing:border-box; word-break:break-word; overflow-wrap:break-word; }" +
                "  .footer { background-color:#111827; padding:24px 20px; text-align:center; color:#9CA3AF; font-size:12px; line-height:1.6; box-sizing:border-box; }" +
                "  .footer a { color:#60A5FA; text-decoration:none; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container' style='max-width:600px; margin:20px auto; background-color:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08); width:100%; box-sizing:border-box;'>" +
                "  <div class='header' style='background:linear-gradient(135deg, #0A66C2 0%, #004182 100%); padding:28px 20px; text-align:center; color:#FFFFFF;'>" +
                "    <div class='logo-badge' style='display:inline-block; background-color:#FFFFFF; color:#0A66C2; font-weight:900; font-size:24px; padding:6px 16px; border-radius:10px; margin-bottom:10px; font-family:sans-serif;'>B<span style='color:#60A5FA;'>i</span></div>" +
                "    <h1 class='title' style='margin:0; font-size:22px; font-weight:800; letter-spacing:-0.02em; color:#FFFFFF;'>BrandIt Consulting</h1>" +
                "    <p class='tagline' style='margin:6px 0 0 0; font-size:13px; opacity:0.85; font-weight:500; letter-spacing:0.02em;'>Your Profile, Your Brand, Your Opportunity</p>" +
                "  </div>" +
                "  <div class='content' style='padding:24px 20px; line-height:1.65; color:#374151; font-size:15px; box-sizing:border-box; word-break:break-word; overflow-wrap:break-word;'>" +
                bodyHtml +
                "  </div>" +
                "  <div class='footer' style='background-color:#111827; padding:24px 20px; text-align:center; color:#9CA3AF; font-size:12px; line-height:1.6; box-sizing:border-box;'>" +
                "    <p style='margin:0 0 8px 0;'><strong>BrandIt Consulting & Personal Branding</strong></p>" +
                "    <p style='margin:0 0 12px 0;'>Hritika Seth (Consultant) • Kritika Dhawan (Operations)</p>" +
                "    <p style='margin:0;'>Email: <a href='mailto:brandit.get@gmail.com' style='color:#60A5FA; text-decoration:none;'>brandit.get@gmail.com</a> | Visit: <a href='" + baseUrl + "' target='_blank' rel='noopener noreferrer' style='color:#60A5FA; text-decoration:none;'>BrandIt Portal</a></p>" +
                "    <p style='margin:12px 0 0 0; color:#6B7280;'>© " + Year.now().getValue() + " BrandIt. All rights reserved.</p>" +
                "  </div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    public String buildWelcomeTemplate(String clientName, String toEmail, String role, String frontendUrl) {
        String portalLink = cleanUrl(frontendUrl) + "/login";
        return wrapHtmlTemplate("Welcome to BrandIt",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>Welcome aboard, " + clientName + "! 🎉</h2>" +
                "<p>Thank you for creating your account with <strong>BrandIt</strong>. We are thrilled to partner with you on your career and personal branding journey.</p>" +
                "<div class='card' style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:18px 20px; margin:20px 0; box-sizing:border-box; word-break:break-word;'>" +
                "  <p style='margin:0 0 8px 0; color:#0A66C2; font-weight:700;'>Account Details:</p>" +
                "  <p style='margin:4px 0; word-break:break-all;'>📧 Registered Email: <strong>" + toEmail + "</strong></p>" +
                "  <p style='margin:4px 0;'>🔒 Account Role: <strong>" + role + " Portal Access</strong></p>" +
                "</div>" +
                "<p>Through your portal, you can view booked consultation slots, access invoices, track personal branding milestones, and change password & security settings anytime.</p>" +
                "<div style='text-align:center; margin-top:24px;'>" +
                "  <a href='" + portalLink + "' target='_blank' rel='noopener noreferrer' style='display:inline-block; background-color:#0A66C2; color:#FFFFFF !important; text-decoration:none !important; padding:14px 28px; border-radius:10px; font-weight:700; font-size:15px; text-align:center; font-family:sans-serif;'>Access Your Portal &rarr;</a>" +
                "</div>", frontendUrl);
    }

    public String buildBookingTemplate(String clientName, String serviceName, String bookingDate, String bookingTime, String price, String paymentId, String frontendUrl) {
        String dashboardLink = cleanUrl(frontendUrl) + "/dashboard";
        String txnRef = (paymentId != null && !paymentId.isBlank()) ? paymentId : "CONFIRMED";

        return wrapHtmlTemplate("Booking Confirmation",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>Booking Confirmed, " + clientName + "! ✅</h2>" +
                "<p>Your consultation booking with BrandIt has been successfully processed. Here is your official booking summary:</p>" +

                "<div class='card' style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:18px 20px; margin:20px 0; box-sizing:border-box; word-break:break-word;'>" +
                "  <h3 style='margin:0 0 16px 0; color:#0A66C2; font-size:16px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;'>📋 Booking Summary</h3>" +

                "  <div style='margin-bottom:12px;'>" +
                "    <div style='font-size:12px; color:#6B7280; text-transform:uppercase; font-weight:700; letter-spacing:0.04em;'>Service Package</div>" +
                "    <div style='font-size:15px; font-weight:700; color:#111827; margin-top:2px; word-break:break-word;'>" + serviceName + "</div>" +
                "  </div>" +

                "  <div style='margin-bottom:12px;'>" +
                "    <div style='font-size:12px; color:#6B7280; text-transform:uppercase; font-weight:700; letter-spacing:0.04em;'>Amount Paid</div>" +
                "    <div style='font-size:15px; font-weight:700; color:#16A34A; margin-top:2px;'>" + price + "</div>" +
                "  </div>" +

                "  <div style='margin-bottom:12px;'>" +
                "    <div style='font-size:12px; color:#6B7280; text-transform:uppercase; font-weight:700; letter-spacing:0.04em;'>Scheduled Slot</div>" +
                "    <div style='font-size:15px; font-weight:700; color:#111827; margin-top:2px;'>" + bookingDate + " • " + bookingTime + " IST</div>" +
                "  </div>" +

                "  <div>" +
                "    <div style='font-size:12px; color:#6B7280; text-transform:uppercase; font-weight:700; letter-spacing:0.04em;'>Transaction Ref</div>" +
                "    <div style='font-size:13px; font-weight:600; font-family:monospace; color:#374151; margin-top:2px; word-break:break-all;'>" + txnRef + "</div>" +
                "  </div>" +
                "</div>" +

                "<h3 style='color:#111827; font-size:16px; margin-top:24px;'>📞 What Happens Next?</h3>" +
                "<p>Our lead consultants <strong>Hritika Seth</strong> and <strong>Kritika Dhawan</strong> will reach out via WhatsApp/Phone shortly before your scheduled slot with your video call link.</p>" +

                "<div class='card' style='background-color:#F0F9FF; border:1px solid #BAE6FD; border-radius:12px; padding:18px 20px; margin:20px 0; box-sizing:border-box; word-break:break-word;'>" +
                "  <p style='margin:0; color:#0369A1; font-weight:700;'>Consultant Contacts:</p>" +
                "  <p style='margin:6px 0 0 0;'>• Hritika Seth (Consultant): <a href='tel:+918708231539' style='color:#0A66C2; font-weight:600;'>+91 8708231539</a></p>" +
                "  <p style='margin:4px 0 0 0;'>• Kritika Dhawan (Operations): <a href='tel:+916284318951' style='color:#0A66C2; font-weight:600;'>+91 6284318951</a></p>" +
                "</div>" +

                "<div style='text-align:center; margin-top:24px;'>" +
                "  <a href='" + dashboardLink + "' target='_blank' rel='noopener noreferrer' style='display:inline-block; background-color:#0A66C2; color:#FFFFFF !important; text-decoration:none !important; padding:14px 28px; border-radius:10px; font-weight:700; font-size:15px; text-align:center; font-family:sans-serif;'>View My Bookings &rarr;</a>" +
                "</div>", frontendUrl);
    }

    public String buildPasswordResetTemplate(String clientName, String toEmail, String resetToken, String frontendUrl) {
        String resetLink = cleanUrl(frontendUrl) + "/reset-password?token=" + resetToken;
        return wrapHtmlTemplate("Password Reset Request",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>Hello " + clientName + ",</h2>" +
                "<p>We received a request to reset your password for your <strong>BrandIt</strong> account (" + toEmail + ").</p>" +
                "<p>Click the button below to choose a new password. This link is valid for <strong>1 hour</strong>:</p>" +
                "<div style='text-align:center; margin:28px 0;'>" +
                "  <a href='" + resetLink + "' target='_blank' rel='noopener noreferrer' style='display:inline-block; background-color:#DC2626; color:#FFFFFF !important; text-decoration:none !important; padding:14px 28px; border-radius:10px; font-weight:700; font-size:15px; text-align:center; font-family:sans-serif;'>Reset Password &rarr;</a>" +
                "</div>" +
                "<div class='card' style='background-color:#FEF2F2; border:1px solid #FCA5A5; border-radius:12px; padding:16px 18px; color:#991B1B; font-size:13px; box-sizing:border-box; word-break:break-word;'>" +
                "  <p style='margin:0;'>⚠️ If you did not initiate this request, you can safely ignore this email. Your password will remain unchanged.</p>" +
                "</div>", frontendUrl);
    }

    public String buildContactNotificationTemplate(String senderName, String senderEmail, String phone, String serviceInterested, String messageText, String frontendUrl) {
        return wrapHtmlTemplate("New Inquiry Received",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>New Website Inquiry 📩</h2>" +
                "<div class='card' style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:18px 20px; margin:20px 0; box-sizing:border-box; word-break:break-word;'>" +
                "  <p style='margin:4px 0; word-break:break-all;'><strong>From:</strong> " + senderName + " (" + senderEmail + ")</p>" +
                "  <p style='margin:4px 0;'><strong>Phone:</strong> " + (phone != null && !phone.isBlank() ? phone : "N/A") + "</p>" +
                "  <p style='margin:4px 0;'><strong>Interested In:</strong> " + (serviceInterested != null && !serviceInterested.isBlank() ? serviceInterested : "General Inquiry") + "</p>" +
                "</div>" +
                "<h3 style='color:#111827; font-size:15px;'>Message Details:</h3>" +
                "<div class='card' style='background-color:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:18px 20px; box-sizing:border-box; word-break:break-word;'>" +
                "  <p style='margin:0; white-space:pre-wrap; word-break:break-word;'>" + messageText + "</p>" +
                "</div>", frontendUrl);
    }

    public String buildContactUserReceiptTemplate(String senderName, String serviceInterested, String frontendUrl) {
        String baseUrl = cleanUrl(frontendUrl);
        return wrapHtmlTemplate("Inquiry Received — BrandIt",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>We Received Your Inquiry, " + senderName + "! 📩</h2>" +
                "<p>Thank you for reaching out to <strong>BrandIt Consulting</strong>. Our team has received your message regarding <strong>" + (serviceInterested != null && !serviceInterested.isBlank() ? serviceInterested : "Personal Branding Services") + "</strong>.</p>" +
                "<div class='card' style='background-color:#F0F9FF; border:1px solid #BAE6FD; border-radius:12px; padding:18px 20px; margin:20px 0; box-sizing:border-box; word-break:break-word;'>" +
                "  <p style='margin:0; color:#0369A1; font-weight:700;'>Next Steps:</p>" +
                "  <p style='margin:6px 0 0 0;'>One of our branding consultants will review your request and contact you within <strong>24 hours</strong>.</p>" +
                "</div>" +
                "<div style='text-align:center; margin-top:24px;'>" +
                "  <a href='" + baseUrl + "' target='_blank' rel='noopener noreferrer' style='display:inline-block; background-color:#0A66C2; color:#FFFFFF !important; text-decoration:none !important; padding:14px 28px; border-radius:10px; font-weight:700; font-size:15px; text-align:center; font-family:sans-serif;'>Visit BrandIt Portal &rarr;</a>" +
                "</div>", frontendUrl);
    }

    public String buildNewsletterWelcomeTemplate(String subscriberEmail, String frontendUrl) {
        String baseUrl = cleanUrl(frontendUrl);
        return wrapHtmlTemplate("Subscribed to Weekly Career Insights",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>Welcome to BrandIt Career Insights! 🚀</h2>" +
                "<p>You are now subscribed to receive <strong>BrandIt Weekly Career Insights</strong>. Expect proven personal branding tactics, executive resume frameworks, and LinkedIn algorithm strategies right in your inbox.</p>" +
                "<div class='card' style='background-color:#F0FDF4; border:1px solid #BBF7D0; border-radius:12px; padding:18px 20px; margin:20px 0; color:#166534; box-sizing:border-box; word-break:break-word;'>" +
                "  <p style='margin:0; word-break:break-all;'><strong>Subscription Email:</strong> " + subscriberEmail + "</p>" +
                "  <p style='margin:6px 0 0 0; font-size:13px;'>Frequency: Weekly curated career & branding insights</p>" +
                "</div>" +
                "<div style='text-align:center; margin-top:24px;'>" +
                "  <a href='" + baseUrl + "' target='_blank' rel='noopener noreferrer' style='display:inline-block; background-color:#0A66C2; color:#FFFFFF !important; text-decoration:none !important; padding:14px 28px; border-radius:10px; font-weight:700; font-size:15px; text-align:center; font-family:sans-serif;'>Explore BrandIt Website &rarr;</a>" +
                "</div>", frontendUrl);
    }
}
