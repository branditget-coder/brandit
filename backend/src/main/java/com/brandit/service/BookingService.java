package com.brandit.service;

import com.brandit.dto.BookingDtos.*;
import com.brandit.entity.Booking;
import com.brandit.entity.User;
import com.brandit.entity.UserActivityLog;
import com.brandit.repository.BookingRepository;
import com.brandit.repository.UserActivityLogRepository;
import com.brandit.repository.UserRepository;
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

    @Transactional
    public BookingResponse createBooking(String userEmail, CreateBookingRequest request) {
        // Prevent double-booking for the exact same date & time slot
        if (request.getBookingDate() != null && request.getBookingTime() != null) {
            boolean alreadyBooked = bookingRepository.existsByBookingDateAndBookingTimeAndStatusNot(
                    request.getBookingDate(), request.getBookingTime(), Booking.Status.CANCELLED
            );
            if (alreadyBooked) {
                throw new com.brandit.exception.DuplicateResourceException("This date and time slot (" + request.getBookingDate() + " at " + request.getBookingTime() + ") is already booked by another client. Please select a different slot.");
            }
        }

        User user = null;
        String rawEmail = (userEmail != null && !userEmail.isBlank()) ? userEmail : request.getClientEmail();
        String emailToUse = rawEmail != null ? rawEmail.trim().toLowerCase() : null;
        
        if (emailToUse != null && !emailToUse.isBlank()) {
            user = userRepository.findByEmailIgnoreCase(emailToUse).orElse(null);
            if (user == null) {
                // Register a guest client user automatically so they have a database account!
                String name = request.getClientName() != null ? request.getClientName() : "Valued Client";
                String[] parts = name.split(" ", 2);
                String firstName = parts[0];
                String lastName = parts.length > 1 ? parts[1] : "";

                user = User.builder()
                        .firstName(firstName)
                        .lastName(lastName)
                        .email(emailToUse)
                        .phone(request.getClientPhone())
                        .role(User.Role.USER)
                        .build();
                user = userRepository.save(user);
            }
        }

        Booking booking = Booking.builder()
                .user(user)
                .serviceName(request.getServiceName())
                .bookingDate(request.getBookingDate())
                .bookingTime(request.getBookingTime())
                .notes(request.getNotes())
                .amount(request.getAmount())
                .paymentId(request.getPaymentId() != null ? request.getPaymentId() : "PAY_" + System.currentTimeMillis())
                .status(Booking.Status.CONFIRMED)
                .build();

        Booking saved = bookingRepository.save(booking);

        if (user != null) {
            activityLogRepository.save(UserActivityLog.builder()
                    .user(user)
                    .action("BOOKING_CREATED_AND_PAID")
                    .metadataJson("Paid: " + saved.getAmount() + " for " + saved.getServiceName() + " (Ref: " + saved.getPaymentId() + ")")
                    .build());
        }

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

        // Trigger payment verification alert email to official BrandIt team and client
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
                request.getPaymentScreenshot()
        );

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

        emailService.sendPaymentVerificationAdminNotification(
                recipientName,
                recipientEmail,
                clientPhone,
                latest.getServiceName(),
                latest.getBookingDate() != null ? latest.getBookingDate().toString() : "TBD",
                latest.getBookingTime() != null ? latest.getBookingTime().toString() : "TBD",
                priceStr,
                latest.getPaymentId(),
                null
        );

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

        emailService.sendPaymentVerificationAdminNotification(
                recipientName,
                recipientEmail,
                clientPhone,
                booking.getServiceName(),
                booking.getBookingDate() != null ? booking.getBookingDate().toString() : "TBD",
                booking.getBookingTime() != null ? booking.getBookingTime().toString() : "TBD",
                priceStr,
                booking.getPaymentId(),
                null
        );

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
                null
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
        res.setCreatedAt(booking.getCreatedAt());
        if (booking.getUser() != null) {
            res.setClientName(booking.getUser().getFullName());
            res.setClientEmail(booking.getUser().getEmail());
        }
        return res;
    }
}
