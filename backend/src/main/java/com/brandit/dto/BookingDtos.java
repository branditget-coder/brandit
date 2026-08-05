package com.brandit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

public class BookingDtos {

    @Data
    public static class CreateBookingRequest {
        @NotBlank(message = "Service name is required")
        private String serviceName;

        @NotNull(message = "Booking date is required")
        private LocalDate bookingDate;

        @NotNull(message = "Booking time is required")
        private LocalTime bookingTime;

        private String notes;
        private BigDecimal amount;
        private String paymentId;
        private String paymentMethod;
        private String clientName;
        private String clientEmail;
        private String clientPhone;
        private String paymentScreenshot;
    }

    @Data
    public static class BookingResponse {
        private Long id;
        private String serviceName;
        private LocalDate bookingDate;
        private LocalTime bookingTime;
        private String meetingLink;
        private String notes;
        private String status;
        private BigDecimal amount;
        private String paymentId;
        private String paymentMethod;
        private String paymentScreenshot;
        private LocalDateTime createdAt;
        private String clientName;
        private String clientEmail;
        private String clientPhone;
        private String consultantName;
    }

    @Data
    public static class ScheduleMeetRequest {
        @NotNull(message = "Booking date is required")
        private LocalDate bookingDate;

        @NotNull(message = "Booking time is required")
        private LocalTime bookingTime;

        @NotBlank(message = "Google Meet link is required")
        private String meetingLink;

        private String consultantName = "Hritika Seth";
        private String consultantEmail = "sethhritika@gmail.com";
        private String customNotes;
    }

    @Data
    public static class UpdateBookingStatusRequest {
        @NotBlank
        private String status;
        private String meetingLink;
    }

    @Data
    public static class BookedSlotDto {
        private LocalDate bookingDate;
        private LocalTime bookingTime;

        public BookedSlotDto(LocalDate bookingDate, LocalTime bookingTime) {
            this.bookingDate = bookingDate;
            this.bookingTime = bookingTime;
        }
    }
}
