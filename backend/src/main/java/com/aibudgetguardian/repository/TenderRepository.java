package com.aibudgetguardian.repository;

import com.aibudgetguardian.entity.Tender;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TenderRepository extends JpaRepository<Tender, UUID> {
    Optional<Tender> findByTenderNumber(String tenderNumber);
    Page<Tender> findByDepartmentId(UUID departmentId, Pageable pageable);
    Page<Tender> findByStatus(String status, Pageable pageable);
}
