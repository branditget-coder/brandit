package com.brandit.controller;

import com.brandit.dto.BookingDtos.*;
import com.brandit.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@AuthenticationPrincipal UserDetails userDetails,
                                                         @Valid @RequestBody CreateBookingRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(bookingService.createBooking(userDetails.getUsername(), request));
    }

    @GetMapping("/public-slots")
    public ResponseEntity<List<BookedSlotDto>> getBookedSlots() {
        return ResponseEntity.ok(bookingService.getBookedSlots());
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getUserBookings(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(bookingService.getUserBookings(userDetails.getUsername()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM')")
    public ResponseEntity<BookingResponse> updateBookingStatus(@PathVariable Long id,
                                                                @Valid @RequestBody UpdateBookingStatusRequest request) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, request));
    }

    @PostMapping("/{id}/schedule-meet")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEAM')")
    public ResponseEntity<BookingResponse> scheduleGoogleMeet(@PathVariable Long id,
                                                               @Valid @RequestBody ScheduleMeetRequest request) {
        return ResponseEntity.ok(bookingService.scheduleGoogleMeet(id, request));
    }
}
