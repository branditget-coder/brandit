package com.brandit.notification.service.provider;

import org.springframework.stereotype.Component;
import org.springframework.web.util.HtmlUtils;
import java.time.Year;

@Component
public class EmailTemplateBuilder {

    private String escape(String input) {
        if (input == null) return "";
        return HtmlUtils.htmlEscape(input.trim());
    }

    private String cleanUrl(String rawUrl) {
        if (rawUrl == null || rawUrl.isBlank()) {
            return "https://go-brandit.vercel.app";
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

    public static String generateProofToken(Long bookingId, String upiRef) {
        try {
            String raw = (bookingId != null ? bookingId.toString() : "0") + ":" + (upiRef != null ? upiRef.trim() : "brandit");
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(raw.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.substring(0, 16);
        } catch (Exception e) {
            return "proof_valid";
        }
    }

    public String buildWelcomeTemplate(String clientName, String toEmail, String role, String frontendUrl) {
        String portalLink = cleanUrl(frontendUrl) + "/login";
        return wrapHtmlTemplate("Welcome to BrandIt",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>Welcome aboard, " + escape(clientName) + "! 🎉</h2>" +
                "<p>Thank you for creating your account with <strong>BrandIt</strong>. We are thrilled to partner with you on your career and personal branding journey.</p>" +
                "<div class='card' style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:18px 20px; margin:20px 0; box-sizing:border-box; word-break:break-word;'>" +
                "  <p style='margin:0 0 8px 0; color:#0A66C2; font-weight:700;'>Account Details:</p>" +
                "  <p style='margin:4px 0; word-break:break-all;'>📧 Registered Email: <strong>" + escape(toEmail) + "</strong></p>" +
                "  <p style='margin:4px 0;'>🔒 Account Role: <strong>" + escape(role) + " Portal Access</strong></p>" +
                "</div>" +
                "<p>Through your portal, you can view booked consultation slots, access invoices, track personal branding milestones, and change password & security settings anytime.</p>" +
                "<div style='text-align:center; margin-top:24px;'>" +
                "  <a href='" + portalLink + "' target='_blank' rel='noopener noreferrer' style='display:inline-block; background-color:#0A66C2; color:#FFFFFF !important; text-decoration:none !important; padding:14px 28px; border-radius:10px; font-weight:700; font-size:15px; text-align:center; font-family:sans-serif;'>Access Your Portal &rarr;</a>" +
                "</div>", frontendUrl);
    }

    public String buildRegistrationOtpTemplate(String firstName, String recipientEmail, String otp, String frontendUrl) {
        String name = (firstName != null && !firstName.isBlank()) ? escape(firstName.trim()) : "Valued Member";
        return wrapHtmlTemplate("Verify Your BrandIt Account",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>Welcome to BrandIt, " + name + "! 👋</h2>" +
                "<p style='color:#374151; font-size:15px; line-height:1.6;'>Thank you for starting your account registration. Please use the 6-digit verification code below to verify your email address and complete your registration:</p>" +

                "<div style='text-align:center; margin:28px 0; padding:24px; background-color:#F0F9FF; border:2px dashed #0A66C2; border-radius:16px; box-sizing:border-box;'>" +
                "  <p style='margin:0 0 8px 0; color:#0369A1; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;'>Your 6-Digit Verification Code</p>" +
                "  <div style='font-size:42px; font-weight:900; letter-spacing:12px; color:#0A66C2; font-family:monospace; padding-left:12px; margin:10px 0;'>" + escape(otp) + "</div>" +
                "  <p style='margin:8px 0 0 0; color:#64748B; font-size:12px;'>⏱️ This code will expire in <strong>10 minutes</strong>. Do not share it with anyone.</p>" +
                "</div>" +

                "<div class='card' style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px 18px; margin:20px 0; box-sizing:border-box; word-break:break-word;'>" +
                "  <p style='margin:0; font-size:13px; color:#64748B;'>If you did not request account creation on BrandIt, you can safely ignore this email.</p>" +
                "</div>", frontendUrl);
    }

    public String buildBookingTemplate(String clientName, String serviceName, String bookingDate, String bookingTime, String price, String paymentId, String frontendUrl) {
        String dashboardLink = cleanUrl(frontendUrl) + "/dashboard";
        String txnRef = (paymentId != null && !paymentId.isBlank()) ? escape(paymentId) : "CONFIRMED";
        boolean isCashfree = paymentId != null && paymentId.startsWith("order_cf_");

        return wrapHtmlTemplate("Booking Confirmation",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>Booking Confirmed, " + escape(clientName) + "! ✅</h2>" +
                "<p>Your consultation booking with BrandIt has been successfully processed and confirmed. Here is your official booking summary:</p>" +

                "<div class='card' style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:18px 20px; margin:20px 0; box-sizing:border-box; word-break:break-word;'>" +
                "  <h3 style='margin:0 0 16px 0; color:#0A66C2; font-size:16px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;'>📋 Booking Summary</h3>" +

                "  <div style='margin-bottom:12px;'>" +
                "    <div style='font-size:12px; color:#6B7280; text-transform:uppercase; font-weight:700; letter-spacing:0.04em;'>Service Package</div>" +
                "    <div style='font-size:15px; font-weight:700; color:#111827; margin-top:2px; word-break:break-word;'>" + escape(serviceName) + "</div>" +
                "  </div>" +

                "  <div style='margin-bottom:12px;'>" +
                "    <div style='font-size:12px; color:#6B7280; text-transform:uppercase; font-weight:700; letter-spacing:0.04em;'>Amount Paid</div>" +
                "    <div style='font-size:15px; font-weight:700; color:#16A34A; margin-top:2px;'>" + escape(price) + (isCashfree ? " <span style='font-size:12px; color:#059669; font-weight:600;'>(Paid Online)</span>" : "") + "</div>" +
                "  </div>" +

                "  <div style='margin-bottom:12px;'>" +
                "    <div style='font-size:12px; color:#6B7280; text-transform:uppercase; font-weight:700; letter-spacing:0.04em;'>Scheduled Slot</div>" +
                "    <div style='font-size:15px; font-weight:700; color:#111827; margin-top:2px;'>" + escape(bookingDate) + " • " + escape(bookingTime) + " IST</div>" +
                "  </div>" +

                "  <div style='margin-bottom:12px;'>" +
                "    <div style='font-size:12px; color:#6B7280; text-transform:uppercase; font-weight:700; letter-spacing:0.04em;'>Payment Status</div>" +
                "    <div style='font-size:14px; font-weight:700; color:#10B981; margin-top:2px;'>✓ Paid &amp; Confirmed</div>" +
                "  </div>" +

                "  <div>" +
                "    <div style='font-size:12px; color:#6B7280; text-transform:uppercase; font-weight:700; letter-spacing:0.04em;'>" + (isCashfree ? "Payment Order ID" : "Transaction Ref") + "</div>" +
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
        String resetLink = cleanUrl(frontendUrl) + "/reset-password?token=" + escape(resetToken);
        return wrapHtmlTemplate("Password Reset Request",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>Hello " + escape(clientName) + ",</h2>" +
                "<p>We received a request to reset your password for your <strong>BrandIt</strong> account (" + escape(toEmail) + ").</p>" +
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
                "  <p style='margin:4px 0; word-break:break-all;'><strong>From:</strong> " + escape(senderName) + " (" + escape(senderEmail) + ")</p>" +
                "  <p style='margin:4px 0;'><strong>Phone:</strong> " + (phone != null && !phone.isBlank() ? escape(phone) : "N/A") + "</p>" +
                "  <p style='margin:4px 0;'><strong>Interested In:</strong> " + (serviceInterested != null && !serviceInterested.isBlank() ? escape(serviceInterested) : "General Inquiry") + "</p>" +
                "</div>" +
                "<h3 style='color:#111827; font-size:15px;'>Message Details:</h3>" +
                "<div class='card' style='background-color:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:18px 20px; box-sizing:border-box; word-break:break-word;'>" +
                "  <p style='margin:0; white-space:pre-wrap; word-break:break-word;'>" + escape(messageText) + "</p>" +
                "</div>", frontendUrl);
    }

    public String buildContactUserReceiptTemplate(String senderName, String serviceInterested, String frontendUrl) {
        String baseUrl = cleanUrl(frontendUrl);
        return wrapHtmlTemplate("Inquiry Received — BrandIt",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>We Received Your Inquiry, " + escape(senderName) + "! 📩</h2>" +
                "<p>Thank you for reaching out to <strong>BrandIt Consulting</strong>. Our team has received your message regarding <strong>" + (serviceInterested != null && !serviceInterested.isBlank() ? escape(serviceInterested) : "Personal Branding Services") + "</strong>.</p>" +
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
                "  <p style='margin:0; word-break:break-all;'><strong>Subscription Email:</strong> " + escape(subscriberEmail) + "</p>" +
                "  <p style='margin:6px 0 0 0; font-size:13px;'>Frequency: Weekly curated career & branding insights</p>" +
                "</div>" +
                "<div style='text-align:center; margin-top:24px;'>" +
                "  <a href='" + baseUrl + "' target='_blank' rel='noopener noreferrer' style='display:inline-block; background-color:#0A66C2; color:#FFFFFF !important; text-decoration:none !important; padding:14px 28px; border-radius:10px; font-weight:700; font-size:15px; text-align:center; font-family:sans-serif;'>Explore BrandIt Website &rarr;</a>" +
                "</div>", frontendUrl);
    }

    public String buildPaymentVerificationAdminTemplate(String clientName, String clientEmail, String clientPhone,
                                                         String serviceName, String bookingDate, String bookingTime,
                                                         String price, String upiRef, String screenshotBase64, String frontendUrl) {
        return buildPaymentVerificationAdminTemplate(clientName, clientEmail, clientPhone, serviceName, bookingDate, bookingTime, price, upiRef, screenshotBase64, null, frontendUrl);
    }

    public String buildPaymentVerificationAdminTemplate(String clientName, String clientEmail, String clientPhone,
                                                         String serviceName, String bookingDate, String bookingTime,
                                                         String price, String upiRef, String screenshotBase64,
                                                         Long bookingId, String frontendUrl) {
        String baseUrl = cleanUrl(frontendUrl);
        boolean isCashfree = (upiRef != null && upiRef.startsWith("order_cf_")) || (screenshotBase64 == null || screenshotBase64.isBlank());

        if (isCashfree) {
            String orderIdStr = (upiRef != null && !upiRef.isBlank()) ? escape(upiRef) : "CASHFREE_VERIFIED";
            return wrapHtmlTemplate("New Booking Confirmed (Online Payment)",
                    "<h2 style='color:#111827; margin-top:0; font-size:20px;'>🎉 New Booking Confirmed — Online Payment</h2>" +
                    "<p>A client has completed payment online via secure payment gateway. The booking has been automatically confirmed:</p>" +

                    "<div class='card' style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:18px 20px; margin:20px 0; box-sizing:border-box; word-break:break-word;'>" +
                    "  <h3 style='margin:0 0 12px 0; color:#0A66C2; font-size:16px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;'>👤 Client Details</h3>" +
                    "  <p style='margin:4px 0;'><strong>Client Name:</strong> " + escape(clientName) + "</p>" +
                    "  <p style='margin:4px 0; word-break:break-all;'><strong>Client Email:</strong> " + escape(clientEmail) + "</p>" +
                    "  <p style='margin:4px 0;'><strong>Client Phone:</strong> " + (clientPhone != null ? escape(clientPhone) : "N/A") + "</p>" +
                    "</div>" +

                    "<div class='card' style='background-color:#ECFDF5; border:1px solid #A7F3D0; border-radius:12px; padding:18px 20px; margin:20px 0; color:#065F46; box-sizing:border-box; word-break:break-word;'>" +
                    "  <h3 style='margin:0 0 12px 0; color:#065F46; font-size:16px; border-bottom:1px solid #A7F3D0; padding-bottom:8px;'>📌 Payment & Booking Info</h3>" +
                    "  <p style='margin:4px 0;'><strong>Service Package:</strong> " + escape(serviceName) + "</p>" +
                    "  <p style='margin:4px 0;'><strong>Amount Paid:</strong> " + escape(price) + "</p>" +
                    "  <p style='margin:4px 0;'><strong>Scheduled Slot:</strong> " + escape(bookingDate) + " @ " + escape(bookingTime) + " IST</p>" +
                    "  <p style='margin:4px 0;'><strong>Payment Status:</strong> <span style='background:#10B981; color:#fff; font-weight:700; padding:2px 8px; border-radius:6px; font-size:12px;'>✓ PAID &amp; CONFIRMED</span></p>" +
                    "  <p style='margin:8px 0 0 0; font-size:15px;'><strong>Payment Order ID:</strong> <span style='font-family:monospace; background-color:#FFFFFF; padding:4px 10px; border-radius:6px; border:1px solid #10B981; font-weight:800; color:#065F46; word-break:break-all;'>" + orderIdStr + "</span></p>" +
                    "</div>" +

                    "<div style='text-align:center; margin-top:20px;'>" +
                    "  <a href='" + baseUrl + "/admin/bookings' target='_blank' rel='noopener noreferrer' style='display:inline-block; background-color:#0A66C2; color:#FFFFFF !important; text-decoration:none !important; padding:12px 24px; border-radius:8px; font-weight:700; font-size:14px; text-align:center; font-family:sans-serif;'>View in Admin Panel &rarr;</a>" +
                    "</div>", frontendUrl);
        }

        String imageUrl = null;
        if (screenshotBase64 != null && (screenshotBase64.startsWith("http://") || screenshotBase64.startsWith("https://"))) {
            imageUrl = screenshotBase64;
        } else if (bookingId != null) {
            String token = generateProofToken(bookingId, upiRef);
            imageUrl = baseUrl + "/api/public/bookings/" + bookingId + "/payment-proof?token=" + token;
        } else if (upiRef != null && !upiRef.isBlank()) {
            try {
                imageUrl = baseUrl + "/api/public/bookings/payment-proof-by-ref?ref=" + java.net.URLEncoder.encode(upiRef.trim(), java.nio.charset.StandardCharsets.UTF_8.name());
            } catch (Exception e) {
                imageUrl = baseUrl + "/api/public/bookings/payment-proof-by-ref?ref=" + upiRef.trim();
            }
        }

        String imageHtml = "";
        if (imageUrl != null) {
            imageHtml = "<div style='margin-top:20px; text-align:center; background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px; box-sizing:border-box;'>" +
                        "  <p style='font-weight:700; color:#111827; margin:0 0 12px 0; font-size:15px;'>📷 Uploaded Payment Proof Screenshot:</p>" +
                        "  <a href='" + imageUrl + "' target='_blank' rel='noopener noreferrer' style='display:inline-block; max-width:100%; text-decoration:none;'>" +
                        "    <img src='" + imageUrl + "' alt='Payment Screenshot Proof' style='max-width:100%; height:auto; max-height:450px; border-radius:10px; border:2px solid #0A66C2; box-shadow:0 4px 14px rgba(0,0,0,0.12); display:block; margin:0 auto;' />" +
                        "  </a>" +
                        "  <div style='margin-top:12px; text-align:center;'>" +
                        "    <a href='" + imageUrl + "' target='_blank' rel='noopener noreferrer' style='display:inline-block; background-color:#0A66C2; color:#FFFFFF !important; text-decoration:none !important; padding:8px 16px; border-radius:6px; font-weight:600; font-size:13px; font-family:sans-serif;'>🔍 Click to View / Download Full Screenshot</a>" +
                        "  </div>" +
                        "</div>";
        }

        return wrapHtmlTemplate("New Payment Submitted for Verification",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>💳 New Payment Submitted — Verification Required</h2>" +
                "<p>A client has submitted GPay / UPI payment details for booking verification:</p>" +

                "<div class='card' style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:18px 20px; margin:20px 0; box-sizing:border-box; word-break:break-word;'>" +
                "  <h3 style='margin:0 0 12px 0; color:#0A66C2; font-size:16px; border-bottom:1px solid #E2E8F0; padding-bottom:8px;'>👤 Client Details</h3>" +
                "  <p style='margin:4px 0;'><strong>Client Name:</strong> " + escape(clientName) + "</p>" +
                "  <p style='margin:4px 0; word-break:break-all;'><strong>Client Email:</strong> " + escape(clientEmail) + "</p>" +
                "  <p style='margin:4px 0;'><strong>Client Phone:</strong> " + (clientPhone != null ? escape(clientPhone) : "N/A") + "</p>" +
                "</div>" +

                "<div class='card' style='background-color:#FEF3C7; border:1px solid #FCD34D; border-radius:12px; padding:18px 20px; margin:20px 0; color:#92400E; box-sizing:border-box; word-break:break-word;'>" +
                "  <h3 style='margin:0 0 12px 0; color:#92400E; font-size:16px; border-bottom:1px solid #FDE68A; padding-bottom:8px;'>📌 Payment & Booking Info</h3>" +
                "  <p style='margin:4px 0;'><strong>Service Package:</strong> " + escape(serviceName) + "</p>" +
                "  <p style='margin:4px 0;'><strong>Amount Paid:</strong> " + escape(price) + "</p>" +
                "  <p style='margin:4px 0;'><strong>Scheduled Slot:</strong> " + escape(bookingDate) + " @ " + escape(bookingTime) + " IST</p>" +
                "  <p style='margin:8px 0 0 0; font-size:16px;'><strong>Transaction Ref / UTR ID:</strong> <span style='font-family:monospace; background-color:#FFFFFF; padding:4px 10px; border-radius:6px; border:1px solid #D97706; font-weight:800; color:#B45309; word-break:break-all;'>" + escape(upiRef) + "</span></p>" +
                "</div>" +

                imageHtml, frontendUrl);
    }

    public String buildWeeklyCareerInsightsTemplate(String subject, String contentHtml, String recipientEmail, String frontendUrl) {
        String baseUrl = cleanUrl(frontendUrl);
        return wrapHtmlTemplate(subject,
                "<div style='text-align:center; margin-bottom:16px;'>" +
                "  <p style='margin:0; font-size:12px; font-weight:700; color:#0A66C2; text-transform:uppercase; letter-spacing:0.08em;'>✨ BrandIt Monday Spark • Weekly Digest</p>" +
                "  <p style='margin:4px 0 0 0; color:#64748B; font-size:13px;'>A fresh, easy 60-second read curated for <strong>" + escape(recipientEmail) + "</strong></p>" +
                "</div>" +
                "<div class='card' style='background-color:#FFFFFF; border:1px solid #E2E8F0; border-radius:14px; padding:22px; margin:16px 0; box-sizing:border-box; word-break:break-word; font-size:15px; line-height:1.7; box-shadow:0 4px 16px rgba(0,0,0,0.03);'>" +
                contentHtml +
                "</div>" +
                "<div style='background:linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); border:1px solid #BAE6FD; border-radius:14px; padding:20px; text-align:center; margin-top:24px;'>" +
                "  <p style='margin:0 0 4px 0; font-weight:800; color:#0369A1; font-size:16px;'>Want to accelerate your career even faster?</p>" +
                "  <p style='margin:0 0 14px 0; color:#0284C7; font-size:13px;'>Get a 1-on-1 personalized review of your resume and LinkedIn profile.</p>" +
                "  <a href='" + baseUrl + "/book' target='_blank' rel='noopener noreferrer' style='display:inline-block; background-color:#0A66C2; color:#FFFFFF !important; text-decoration:none !important; padding:12px 26px; border-radius:10px; font-weight:700; font-size:14px; text-align:center; font-family:sans-serif; box-shadow:0 4px 10px rgba(10,102,194,0.3);'>Book 1-on-1 Consultation &rarr;</a>" +
                "</div>", frontendUrl);
    }

    public String buildGoogleMeetInviteTemplate(String clientName, String serviceName, String bookingDate, String bookingTime,
                                                String meetingLink, String consultantName, String customNotes, String frontendUrl) {
        String meetUrl = (meetingLink != null && !meetingLink.isBlank()) ? meetingLink : "https://meet.google.com";
        String notesBlock = (customNotes != null && !customNotes.isBlank())
                ? "<div class='card' style='background-color:#FFFBEB; border:1px solid #FCD34D; border-radius:12px; padding:16px 18px; margin:20px 0; box-sizing:border-box; word-break:break-word;'>" +
                  "  <p style='margin:0 0 6px 0; color:#B45309; font-weight:700; font-size:13px; text-transform:uppercase;'>📝 Preparation & Notes from HR Team:</p>" +
                  "  <p style='margin:0; color:#78350F; font-size:14px; white-space:pre-wrap;'>" + escape(customNotes) + "</p>" +
                  "</div>"
                : "";

        return wrapHtmlTemplate("Google Meet Consultation Invitation",
                "<h2 style='color:#111827; margin-top:0; font-size:20px;'>📹 Your Google Meet Consultation is Scheduled!</h2>" +
                "<p style='color:#374151; font-size:15px; line-height:1.6;'>Hello <strong>" + escape(clientName) + "</strong>,</p>" +
                "<p style='color:#374151; font-size:15px; line-height:1.6;'>Your personal branding consultation has been scheduled with our Main Consultant, <strong>" + escape(consultantName) + "</strong>. Please find your meeting invitation details below:</p>" +

                "<div class='card' style='background-color:#F0F9FF; border:1px solid #BAE6FD; border-radius:14px; padding:20px; margin:20px 0; box-sizing:border-box; word-break:break-word;'>" +
                "  <h3 style='margin:0 0 14px 0; color:#0369A1; font-size:16px; border-bottom:1px solid #7DD3FC; padding-bottom:8px;'>📅 Meeting Details</h3>" +
                "  <p style='margin:6px 0;'><strong>Service Package:</strong> " + escape(serviceName) + "</p>" +
                "  <p style='margin:6px 0;'><strong>Consultant:</strong> " + escape(consultantName) + " (BrandIt Lead Consultant)</p>" +
                "  <p style='margin:6px 0;'><strong>Date & Time:</strong> <span style='color:#0A66C2; font-weight:800;'>" + escape(bookingDate) + " at " + escape(bookingTime) + " IST</span></p>" +
                "  <p style='margin:6px 0; word-break:break-all;'><strong>Google Meet Link:</strong> <a href='" + meetUrl + "' target='_blank' style='color:#0A66C2; font-weight:700;'>" + meetUrl + "</a></p>" +
                "</div>" +

                notesBlock +

                "<div style='text-align:center; margin:30px 0;'>" +
                "  <a href='" + meetUrl + "' target='_blank' rel='noopener noreferrer' style='display:inline-block; background:linear-gradient(135deg, #1A73E8 0%, #0D52BF 100%); color:#FFFFFF !important; text-decoration:none !important; padding:16px 32px; border-radius:12px; font-weight:800; font-size:16px; text-align:center; font-family:sans-serif; box-shadow:0 4px 14px rgba(26,115,232,0.35);'>🎥 Join Google Meet Session &rarr;</a>" +
                "</div>" +

                "<div class='card' style='background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:16px; margin-top:20px; font-size:13px; color:#64748B;'>" +
                "  <p style='margin:0 0 4px 0; font-weight:700; color:#334155;'>💡 Preparation Tips for your session:</p>" +
                "  <p style='margin:2px 0;'>• Please join 2–3 minutes early using a desktop/laptop for best presentation experience.</p>" +
                "  <p style='margin:2px 0;'>• Have your updated CV, LinkedIn URL, and any specific targets ready to share.</p>" +
                "</div>", frontendUrl);
    }
}
