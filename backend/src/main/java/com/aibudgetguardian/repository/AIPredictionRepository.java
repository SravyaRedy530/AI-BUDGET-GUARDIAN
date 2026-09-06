package com.aibudgetguardian.repository;

import com.aibudgetguardian.entity.AIPrediction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AIPredictionRepository extends JpaRepository<AIPrediction, UUID> {
    Optional<AIPrediction> findByEntityTypeAndEntityId(String entityType, UUID entityId);
    List<AIPrediction> findByEntityType(String entityType);
    Page<AIPrediction> findByRiskLevel(String riskLevel, Pageable pageable);
}
