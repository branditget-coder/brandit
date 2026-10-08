package com.brandit.booking.service;


import com.brandit.notification.service.EmailService;
import com.brandit.booking.dto.BookingDtos.*;
import com.brandit.booking.entity.Booking;
import com.brandit.user.entity.User;
import com.brandit.admin.entity.UserActivityLog;
import com.brandit.booking.repository.BookingRepository;
import com.brandit.admin.repository.UserActivityLogRepository;
import com.brandit.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final UserActivityLogRepository activityLogRepository;
    private final EmailService emailService;
    private final com.brandit.payment.service.CashfreeService cashfreeService;

    @Transactional
    public BookingResponse createBooking(String userEmail, CreateBookingRequest request) {
        // Prevent double-booking for the exact same date & time slot
        if (request.getBookingDate() != null && request.getBookingTime() != null) {
            boolean alreadyBooked = bookingRepository.existsByBookingDateAndBookingTimeAndStatusNot(
                    request.getBookingDate(), request.getBookingTime(), Booking.Status.CANCELLED
            );
            if (alreadyBooked) {
                throw new com.brandit.common.exception.DuplicateResourceException("This date and time slot (" + request.getBookingDate() + " at " + request.getBookingTime() + ") is already booked by another client. Please select a different slot.");
            }
        }

        // Validate & verify Cashfree payment gateway transactions
        if ("CASHFREE".equalsIgnoreCase(request.getPaymentMethod())) {
            String paymentId = request.getPaymentId();
            if (paymentId == null || paymentId.isBlank()) {
                throw new IllegalArgumentException("Cashfree payment reference ID is required.");
            }

            // 1. Idempotency & Replay prevention: check if this order was already registered
            java.util.Optional<Booking> existing = bookingRepository.findFirstByPaymentIdOrderByCreatedAtDesc(paymentId.trim());
            if (existing.isPresent() && existing.get().getStatus() != Booking.Status.CANCELLED) {
                return mapToResponse(existing.get());
            }

            // 2. Server-to-server verification with Cashfree API
            var cfDetails = cashfreeService.verifyOrder(paymentId.trim());
            if (!cfDetails.isPaid()) {
                throw new IllegalArgumentException("Payment verification failed: Cashfree order " + paymentId + " has status '" + cfDetails.getOrderStatus() + "' and is not completed.");
            }

            // 3. Amount verification to prevent price tampering
            if (request.getAmount() != null && cfDetails.getAmount() != null) {
                if (cfDetails.getAmount().compareTo(request.getAmount()) < 0) {
                    throw new IllegalArgumentException("Payment amount mismatch: Verified paid amount ₹" + cfDetails.getAmount() + " is less than package required amount ₹" + request.getAmount());
                }
            }
        }

        if (userEmail == null || userEmail.isBlank()) {
            throw new IllegalArgumentException("Authentication required. Please log in to complete your booking.");
        }

        User user = userRepository.findByEmailIgnoreCase(userEmail.trim())
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user account not found. Please log in again."));

        Booking booking = Booking.builder()
                .user(user)
                .serviceName(request.getServiceName())
                .bookingDate(request.getBookingDate())
                .bookingTime(request.getBookingTime())
                .notes(request.getNotes())
                .amount(request.getAmount())
                .paymentId(request.getPaymentId() != null ? request.getPaymentId() : "PAY_" + System.currentTimeMillis())
                .paymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "MANUAL_GPAY_UPI")
                .paymentScreenshot(request.getPaymentScreenshot())
                .status(Booking.Status.CONFIRMED)
                .distributed(Boolean.TRUE.equals(request.getDistributed()))
                .build();

        Booking saved = bookingRepository.save(booking);

        boolean hasScreenshot = request.getPaymentScreenshot() != null && !request.getPaymentScreenshot().isBlank();
        activityLogRepository.save(UserActivityLog.builder()
                .user(user)
                .action("BOOKING_CREATED_AND_PAID")
                .metadataJson("Paid ₹" + saved.getAmount() + " for " + saved.getServiceName() + " | Ref: " + saved.getPaymentId() + " | Slot: " + saved.getBookingDate() + " at " + saved.getBookingTime() + " | Screenshot: " + (hasScreenshot ? "ATTACHED" : "NONE"))
                .build());

        // Ensure recipientEmail correctly uses request.getClientEmail() first if provided
        String recipientEmail = (request.getClientEmail() != null && !request.getClientEmail().isBlank()) 
                ? request.getClientEmail().trim().toLowerCase() 
                : (user != null ? user.getEmail() : null);
        String recipientName = (request.getClientName() != null && !request.getClientName().isBlank()) 
                ? request.getClientName().trim() 
                : (user != null ? user.getFullName() : "Valued Client");
        String priceStr = request.getAmount() != null ? "₹" + request.getAmount() : "Confirmed Package";

        if (recipientEmail != null && !recipientEmail.isBlank()) {
            emailService.sendBookingConfirmation(
                    recipientEmail,
                    recipientName,
                    saved.getServiceName(),
                    saved.getBookingDate().toString(),
                    saved.getBookingTime().toString(),
                    priceStr,
                    saved.getPaymentId()
            );
        }

        // Only trigger manual verification alert if a payment screenshot was provided
        if (request.getPaymentScreenshot() != null && !request.getPaymentScreenshot().isBlank()) {
            String clientPhone = (request.getClientPhone() != null && !request.getClientPhone().isBlank()) 
                    ? request.getClientPhone() 
                    : (user != null ? user.getPhone() : null);
            emailService.sendPaymentVerificationAdminNotification(
                    recipientName,
                    recipientEmail,
                    clientPhone,
                    saved.getServiceName(),
                    saved.getBookingDate().toString(),
                    saved.getBookingTime().toString(),
                    priceStr,
                    saved.getPaymentId(),
                    request.getPaymentScreenshot(),
                    saved.getId()
            );
        }

        return mapToResponse(saved);
    }

    @Transactional
    public BookingResponse createCashfreeBookingAutomatically(
            String orderId,
            String clientEmail,
            String clientName,
            String clientPhone,
            String serviceName,
            String bookingDateStr,
            String bookingTimeStr,
            BigDecimal amount,
            String notes
    ) {
        if (orderId == null || orderId.isBlank()) return null;

        // Check if already created
        java.util.Optional<Booking> existing = bookingRepository.findFirstByPaymentIdOrderByCreatedAtDesc(orderId.trim());
        if (existing.isPresent() && existing.get().getStatus() != Booking.Status.CANCELLED) {
            return mapToResponse(existing.get());
        }

        // Resolve user or fallback to system admin
        String emailToUse = (clientEmail != null && !clientEmail.isBlank())
                ? clientEmail.trim().toLowerCase()
                : "client@go-brandit.com";

        User user = userRepository.findByEmailIgnoreCase(emailToUse)
                .orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));

        if (user == null) {
            return null;
        }

        LocalDate dateToUse = LocalDate.now().plusDays(1);
        if (bookingDateStr != null && !bookingDateStr.isBlank()) {
            try {
                dateToUse = LocalDate.parse(bookingDateStr.trim());
            } catch (Exception ignored) {}
        }

        LocalTime timeToUse = LocalTime.of(10, 0);
        if (bookingTimeStr != null && !bookingTimeStr.isBlank()) {
            try {
                String cleanTime = bookingTimeStr.trim();
                if (cleanTime.length() == 5) cleanTime += ":00";
                timeToUse = LocalTime.parse(cleanTime);
            } catch (Exception ignored) {}
        }

        BigDecimal amountToUse = (amount != null && amount.compareTo(BigDecimal.ZERO) > 0)
                ? amount
                : new BigDecimal("129.00");

        Booking booking = Booking.builder()
                .user(user)
                .serviceName(serviceName != null && !serviceName.isBlank() ? serviceName : "BrandIt Consultation Package")
                .bookingDate(dateToUse)
                .bookingTime(timeToUse)
                .notes(notes != null ? notes : "Auto-generated from verified Cashfree transaction")
                .amount(amountToUse)
                .paymentId(orderId.trim())
                .paymentMethod("CASHFREE")
                .status(Booking.Status.CONFIRMED)
                .distributed(false)
                .build();

        Booking saved = bookingRepository.save(booking);

        activityLogRepository.save(UserActivityLog.builder()
                .user(user)
                .action("BOOKING_AUTO_CREATED_CASHFREE")
                .metadataJson("Auto-confirmed booking for order " + orderId + " | Amount: ₹" + saved.getAmount())
                .build());

        try {
            String recipientName = (clientName != null && !clientName.isBlank()) ? clientName : user.getFullName();
            String priceStr = "₹" + saved.getAmount();

            emailService.sendBookingConfirmation(
                    emailToUse,
                    recipientName,
                    saved.getServiceName(),
                    saved.getBookingDate().toString(),
                    saved.getBookingTime().toString(),
                    priceStr,
                    saved.getPaymentId()
            );
        } catch (Exception ignored) {}

        return mapToResponse(saved);
    }

    public String resendLatestBookingEmails() {
        List<Booking> bookings = bookingRepository.findAllByOrderByCreatedAtDesc();
        if (bookings.isEmpty()) {
            return "No bookings found in database.";
        }
        Booking latest = bookings.get(0);

        User user = latest.getUser();
        String recipientEmail = (user != null && user.getEmail() != null) ? user.getEmail() : "client@brandit.com";
        String recipientName = (user != null && user.getFullName() != null) ? user.getFullName() : "Valued Client";
        String clientPhone = (user != null && user.getPhone() != null) ? user.getPhone() : "N/A";
        String priceStr = latest.getAmount() != null ? "₹" + latest.getAmount() : "Confirmed Package";

        emailService.sendBookingConfirmation(
                recipientEmail,
                recipientName,
                latest.getServiceName(),
                latest.getBookingDate() != null ? latest.getBookingDate().toString() : "TBD",
                latest.getBookingTime() != null ? latest.getBookingTime().toString() : "TBD",
                priceStr,
                latest.getPaymentId()
        );

        if (latest.getPaymentScreenshot() != null && !latest.getPaymentScreenshot().isBlank()) {
            emailService.sendPaymentVerificationAdminNotification(
                    recipientName,
                    recipientEmail,
                    clientPhone,
                    latest.getServiceName(),
                    latest.getBookingDate() != null ? latest.getBookingDate().toString() : "TBD",
                    latest.getBookingTime() != null ? latest.getBookingTime().toString() : "TBD",
                    priceStr,
                    latest.getPaymentId(),
                    latest.getPaymentScreenshot(),
                    latest.getId()
            );
        }

        return "Successfully re-dispatched confirmation & payment alert emails for Booking #" + latest.getId() + " (" + latest.getServiceName() + ")";
    }

    public String resendBookingEmailsById(Long bookingId, String customToEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking with ID #" + bookingId + " not found"));

        User user = booking.getUser();
        String recipientEmail = (customToEmail != null && !customToEmail.isBlank())
                ? customToEmail
                : (user != null && user.getEmail() != null) ? user.getEmail() : "client@brandit.com";

        String recipientName = (user != null && user.getFullName() != null) ? user.getFullName() : "Valued Client";
        String clientPhone = (user != null && user.getPhone() != null) ? user.getPhone() : "N/A";
        String priceStr = booking.getAmount() != null ? "₹" + booking.getAmount() : "Confirmed Package";

        emailService.sendBookingConfirmation(
                recipientEmail,
                recipientName,
                booking.getServiceName(),
                booking.getBookingDate() != null ? booking.getBookingDate().toString() : "TBD",
                booking.getBookingTime() != null ? booking.getBookingTime().toString() : "TBD",
                priceStr,
                booking.getPaymentId()
        );

        if (booking.getPaymentScreenshot() != null && !booking.getPaymentScreenshot().isBlank()) {
            emailService.sendPaymentVerificationAdminNotification(
                    recipientName,
                    recipientEmail,
                    clientPhone,
                    booking.getServiceName(),
                    booking.getBookingDate() != null ? booking.getBookingDate().toString() : "TBD",
                    booking.getBookingTime() != null ? booking.getBookingTime().toString() : "TBD",
                    priceStr,
                    booking.getPaymentId(),
                    booking.getPaymentScreenshot(),
                    booking.getId()
            );
        }

        return "Successfully re-dispatched confirmation & payment alert emails for Booking #" + booking.getId() + " (" + booking.getServiceName() + ") to " + recipientEmail;
    }

    @Transactional
    public BookingResponse recordAndNotifyClientPayment(String clientName, String clientEmail, String clientPhone,
                                                        String serviceName, String priceStr, String upiRef,
                                                        LocalDate bookingDate, LocalTime bookingTime) {
        String emailToUse = (clientEmail != null && !clientEmail.isBlank())
                ? clientEmail.trim().toLowerCase()
                : "ujwal.tripathi@guest.com";

        User user = userRepository.findByEmailIgnoreCase(emailToUse).orElse(null);
        if (user == null) {
            String name = (clientName != null && !clientName.isBlank()) ? clientName : "Ujwal Tripathi";
            String[] parts = name.split(" ", 2);
            String firstName = parts[0];
            String lastName = parts.length > 1 ? parts[1] : "";

            user = User.builder()
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(emailToUse)
                    .phone(clientPhone != null ? clientPhone : "N/A")
                    .role(User.Role.USER)
                    .provider(User.AuthProvider.LOCAL)
                    .build();
            user = userRepository.save(user);
        }

        BigDecimal amount = null;
        if (priceStr != null) {
            try {
                String cleanPrice = priceStr.replaceAll("[^0-9.]", "");
                if (!cleanPrice.isBlank()) {
                    amount = new BigDecimal(cleanPrice);
                }
            } catch (Exception ignored) {}
        }

        Booking booking = Booking.builder()
                .user(user)
                .serviceName(serviceName != null ? serviceName : "Personal Branding & Career Consulting")
                .bookingDate(bookingDate != null ? bookingDate : LocalDate.now())
                .bookingTime(bookingTime != null ? bookingTime : LocalTime.of(11, 0))
                .amount(amount)
                .paymentId(upiRef != null && !upiRef.isBlank() ? upiRef : "UTR_" + System.currentTimeMillis())
                .status(Booking.Status.CONFIRMED)
                .build();

        Booking saved = bookingRepository.save(booking);

        emailService.sendBookingConfirmation(
                emailToUse,
                user.getFullName(),
                saved.getServiceName(),
                saved.getBookingDate().toString(),
                saved.getBookingTime().toString(),
                priceStr != null ? priceStr : "₹1,499",
                saved.getPaymentId()
        );

        emailService.sendPaymentVerificationAdminNotification(
                user.getFullName(),
                emailToUse,
                user.getPhone() != null ? user.getPhone() : "N/A",
                saved.getServiceName(),
                saved.getBookingDate().toString(),
                saved.getBookingTime().toString(),
                priceStr != null ? priceStr : "₹1,499",
                saved.getPaymentId(),
                saved.getPaymentScreenshot(),
                saved.getId()
        );

        return mapToResponse(saved);
    }

    public List<BookedSlotDto> getBookedSlots() {
        return bookingRepository.findByStatusNot(Booking.Status.CANCELLED)
                .stream()
                .filter(b -> b.getBookingDate() != null && b.getBookingTime() != null)
                .map(b -> new BookedSlotDto(b.getBookingDate(), b.getBookingTime()))
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, UpdateBookingStatusRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        booking.setStatus(Booking.Status.valueOf(request.getStatus().toUpperCase()));
        if (request.getMeetingLink() != null) {
            booking.setMeetingLink(request.getMeetingLink());
        }

        Booking saved = bookingRepository.save(booking);

        if (saved.getUser() != null) {
            activityLogRepository.save(UserActivityLog.builder()
                    .user(saved.getUser())
                    .action("BOOKING_STATUS_UPDATED")
                    .metadataJson("Booking #" + saved.getId() + " status changed to " + saved.getStatus())
                    .build());
        }

        return mapToResponse(saved);
    }

    @Transactional
    public BookingResponse scheduleGoogleMeet(Long bookingId, ScheduleMeetRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking with ID #" + bookingId + " not found"));

        booking.setBookingDate(request.getBookingDate());
        booking.setBookingTime(request.getBookingTime());
        booking.setMeetingLink(request.getMeetingLink());
        booking.setStatus(Booking.Status.CONFIRMED);
        if (request.getCustomNotes() != null && !request.getCustomNotes().isBlank()) {
            booking.setNotes(request.getCustomNotes());
        }

        Booking saved = bookingRepository.save(booking);

        User clientUser = saved.getUser();
        String clientName = (clientUser != null && clientUser.getFullName() != null) ? clientUser.getFullName() : "Valued Client";
        String clientEmail = (clientUser != null && clientUser.getEmail() != null) ? clientUser.getEmail() : null;

        String consultantName = (request.getConsultantName() != null && !request.getConsultantName().isBlank())
                ? request.getConsultantName().trim()
                : "Hritika Seth";
        String consultantEmail = (request.getConsultantEmail() != null && !request.getConsultantEmail().isBlank())
                ? request.getConsultantEmail().trim()
                : "sethhritika@gmail.com";

        // Dispatch Google Meet invitation email to client, consultant (Hritika Seth), and HR team
        emailService.sendGoogleMeetInvite(
                clientEmail,
                clientName,
                saved.getServiceName(),
                saved.getBookingDate().toString(),
                saved.getBookingTime().toString(),
                saved.getMeetingLink(),
                consultantName,
                consultantEmail,
                request.getCustomNotes()
        );

        if (clientUser != null) {
            activityLogRepository.save(UserActivityLog.builder()
                    .user(clientUser)
                    .action("GOOGLE_MEET_SCHEDULED")
                    .metadataJson("Scheduled Google Meet with " + consultantName + " on " + saved.getBookingDate() + " at " + saved.getBookingTime() + " | Meet: " + saved.getMeetingLink())
                    .build());
        }

        BookingResponse res = mapToResponse(saved);
        res.setConsultantName(consultantName);
        return res;
    }

    @Transactional
    public BookingResponse adminCreateBooking(AdminCreateBookingRequest request) {
        String email = request.getClientEmail().trim().toLowerCase();
        User user = userRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
            String fullName = request.getClientName() != null ? request.getClientName().trim() : "Valued Client";
            String[] parts = fullName.split(" ", 2);
            String fName = parts[0];
            String lName = parts.length > 1 ? parts[1] : "";
            User newUser = User.builder()
                    .firstName(fName)
                    .lastName(lName)
                    .email(email)
                    .phone(request.getClientPhone() != null ? request.getClientPhone() : "N/A")
                    .role(User.Role.USER)
                    .provider(User.AuthProvider.LOCAL)
                    .emailVerified(true)
                    .build();
            return userRepository.save(newUser);
        });

        Booking.Status status = Booking.Status.CONFIRMED;
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            try {
                status = Booking.Status.valueOf(request.getStatus().toUpperCase());
            } catch (Exception ignored) {}
        }

        String pMethod = request.getPaymentMethod() != null && !request.getPaymentMethod().isBlank()
                ? request.getPaymentMethod().trim()
                : "OFFLINE_CASH";

        String paymentId = request.getPaymentId();
        if (paymentId == null || paymentId.isBlank()) {
            boolean isOffline = pMethod.toUpperCase().contains("CASH") || pMethod.toUpperCase().contains("OFFLINE");
            String prefix = isOffline ? "CASH_" : "WEB_";
            paymentId = prefix + System.currentTimeMillis();
        }

        Booking booking = Booking.builder()
                .user(user)
                .serviceName(request.getServiceName())
                .bookingDate(request.getBookingDate())
                .bookingTime(request.getBookingTime())
                .amount(request.getAmount())
                .paymentMethod(pMethod)
                .paymentId(paymentId)
                .status(status)
                .meetingLink(request.getMeetingLink())
                .notes(request.getNotes())
                .distributed(Boolean.TRUE.equals(request.getDistributed()))
                .build();

        Booking saved = bookingRepository.save(booking);

        activityLogRepository.save(UserActivityLog.builder()
                .user(user)
                .action("ADMIN_CREATED_BOOKING")
                .metadataJson("Admin created " + saved.getPaymentMethod() + " booking #" + saved.getId() + " (" + saved.getServiceName() + ") for ₹" + saved.getAmount())
                .build());

        return mapToResponse(saved);
    }

    @Transactional
    public BookingResponse adminUpdateBooking(Long id, AdminUpdateBookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));

        if (request.getServiceName() != null && !request.getServiceName().isBlank()) {
            booking.setServiceName(request.getServiceName());
        }
        if (request.getBookingDate() != null) {
            booking.setBookingDate(request.getBookingDate());
        }
        if (request.getBookingTime() != null) {
            booking.setBookingTime(request.getBookingTime());
        }
        if (request.getAmount() != null) {
            booking.setAmount(request.getAmount());
        }
        if (request.getPaymentMethod() != null && !request.getPaymentMethod().isBlank()) {
            booking.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getPaymentId() != null && !request.getPaymentId().isBlank()) {
            booking.setPaymentId(request.getPaymentId());
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            try {
                booking.setStatus(Booking.Status.valueOf(request.getStatus().toUpperCase()));
            } catch (Exception ignored) {}
        }
        if (request.getMeetingLink() != null) {
            booking.setMeetingLink(request.getMeetingLink());
        }
        if (request.getNotes() != null) {
            booking.setNotes(request.getNotes());
        }
        if (request.getDistributed() != null) {
            booking.setDistributed(request.getDistributed());
        }

        // Also update client name/phone if changed
        if (booking.getUser() != null) {
            User user = booking.getUser();
            boolean userChanged = false;
            if (request.getClientName() != null && !request.getClientName().isBlank()) {
                String[] parts = request.getClientName().trim().split(" ", 2);
                user.setFirstName(parts[0]);
                if (parts.length > 1) user.setLastName(parts[1]);
                userChanged = true;
            }
            if (request.getClientPhone() != null && !request.getClientPhone().isBlank()) {
                user.setPhone(request.getClientPhone());
                userChanged = true;
            }
            if (userChanged) {
                userRepository.save(user);
            }
        }

        Booking saved = bookingRepository.save(booking);

        if (saved.getUser() != null) {
            activityLogRepository.save(UserActivityLog.builder()
                    .user(saved.getUser())
                    .action("ADMIN_UPDATED_BOOKING")
                    .metadataJson("Admin updated booking #" + saved.getId() + " (" + saved.getServiceName() + ")")
                    .build());
        }

        return mapToResponse(saved);
    }

    @Transactional
    public BookingResponse updateDistributedStatus(Long id, Boolean distributed) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));
        booking.setDistributed(Boolean.TRUE.equals(distributed));
        Booking saved = bookingRepository.save(booking);
        if (saved.getUser() != null) {
            activityLogRepository.save(UserActivityLog.builder()
                    .user(saved.getUser())
                    .action("BOOKING_DISTRIBUTION_UPDATED")
                    .metadataJson("Booking #" + saved.getId() + " revenue distribution set to " + (saved.getDistributed() ? "YES" : "NO"))
                    .build());
        }
        return mapToResponse(saved);
    }

    @Transactional
    public void adminDeleteBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with id: " + id));

        bookingRepository.delete(booking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse res = new BookingResponse();
        res.setId(booking.getId());
        res.setServiceName(booking.getServiceName());
        res.setBookingDate(booking.getBookingDate());
        res.setBookingTime(booking.getBookingTime());
        res.setMeetingLink(booking.getMeetingLink());
        res.setNotes(booking.getNotes());
        res.setStatus(booking.getStatus().name());
        res.setAmount(booking.getAmount());
        res.setPaymentId(booking.getPaymentId());
        res.setPaymentMethod(booking.getPaymentMethod());
        res.setPaymentScreenshot(booking.getPaymentScreenshot());
        res.setCreatedAt(booking.getCreatedAt());
        res.setDistributed(Boolean.TRUE.equals(booking.getDistributed()));
        if (booking.getUser() != null) {
            res.setClientName(booking.getUser().getFullName());
            res.setClientEmail(booking.getUser().getEmail());
            res.setClientPhone(booking.getUser().getPhone());
        }
        res.setConsultantName("Hritika Seth");
        return res;
    }
}
