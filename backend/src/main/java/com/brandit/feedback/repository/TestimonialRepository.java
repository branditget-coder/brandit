package com.brandit.feedback.repository;

import com.brandit.feedback.entity.Testimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    List<Testimonial> findByApprovedTrueOrderByCreatedAtDesc();
    List<Testimonial> findByApprovedFalseOrderByCreatedAtDesc();
}
