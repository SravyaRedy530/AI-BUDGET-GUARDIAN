package com.aibudgetguardian.repository;

import com.aibudgetguardian.entity.FraudAlert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FraudAlertRepository extends JpaRepository<FraudAlert, UUID> {
    Page<FraudAlert> findByStatus(String status, Pageable pageable);
    Page<FraudAlert> findBySeverity(String severity, Pageable pageable);
    Page<FraudAlert> findByDepartmentId(UUID departmentId, Pageable pageable);
}
