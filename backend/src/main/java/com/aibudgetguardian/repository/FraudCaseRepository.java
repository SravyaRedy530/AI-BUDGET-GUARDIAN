package com.aibudgetguardian.repository;

import com.aibudgetguardian.entity.FraudCase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FraudCaseRepository extends JpaRepository<FraudCase, UUID> {
    Optional<FraudCase> findByCaseNumber(String caseNumber);
    Page<FraudCase> findByStatus(String status, Pageable pageable);
    Page<FraudCase> findByAssignedAuditorId(UUID auditorId, Pageable pageable);
}
