package com.brandit.repository;

import com.brandit.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findAllByOrderByCreatedAtDesc();
    List<Booking> findByStatusNot(Booking.Status status);
    boolean existsByBookingDateAndBookingTimeAndStatusNot(LocalDate date, LocalTime time, Booking.Status status);
    Optional<Booking> findFirstByPaymentIdOrderByCreatedAtDesc(String paymentId);
    long countByStatus(Booking.Status status);
    void deleteByUserId(Long userId);
}
