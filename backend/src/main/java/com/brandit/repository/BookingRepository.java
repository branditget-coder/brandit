package com.brandit.repository;

import com.brandit.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Booking> findAllByOrderByCreatedAtDesc();
    List<Booking> findByStatusNot(Booking.Status status);
    boolean existsByBookingDateAndBookingTimeAndStatusNot(LocalDate date, LocalTime time, Booking.Status status);
    long countByStatus(Booking.Status status);
}
