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

        // Trigger confirmation email dispatch
        String recipientEmail = (user != null) ? user.getEmail() : request.getClientEmail();
        String recipientName = (user != null) ? user.getFullName() : (request.getClientName() != null ? request.getClientName() : "Client");
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

        return mapToResponse(saved);
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
