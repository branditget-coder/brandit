package com.brandit.repository;

import com.brandit.entity.Newsletter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsletterRepository extends JpaRepository<Newsletter, Long> {
    Optional<Newsletter> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Newsletter> findByActiveTrue();
    List<Newsletter> findAllByOrderBySubscribedAtDesc();
    long countByActiveTrue();
}
