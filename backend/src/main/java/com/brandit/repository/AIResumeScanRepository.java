package com.brandit.repository;

import com.brandit.entity.AIResumeScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIResumeScanRepository extends JpaRepository<AIResumeScan, Long> {
    List<AIResumeScan> findByUserIdOrderByCreatedAtDesc(Long userId);
    void deleteByUserId(Long userId);
}
