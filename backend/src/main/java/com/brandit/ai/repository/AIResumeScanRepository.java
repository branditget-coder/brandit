package com.brandit.ai.repository;

import com.brandit.ai.entity.AIResumeScan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIResumeScanRepository extends JpaRepository<AIResumeScan, Long> {
    List<AIResumeScan> findByUserIdOrderByCreatedAtDesc(Long userId);
    void deleteByUserId(Long userId);
}
