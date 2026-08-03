package com.brandit.repository;

import com.brandit.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByUserIdOrderByIssuedAtDesc(Long userId);
    List<Invoice> findAllByOrderByIssuedAtDesc();
    void deleteByUserId(Long userId);
}
