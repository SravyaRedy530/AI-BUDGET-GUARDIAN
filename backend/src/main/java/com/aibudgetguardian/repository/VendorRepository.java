package com.aibudgetguardian.repository;

import com.aibudgetguardian.entity.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, UUID> {
    Optional<Vendor> findByGstNumber(String gstNumber);
    Optional<Vendor> findByPanNumber(String panNumber);
    List<Vendor> findByBankAccountNo(String bankAccountNo);
    Page<Vendor> findByStatus(String status, Pageable pageable);
    Page<Vendor> findByRiskLevel(String riskLevel, Pageable pageable);
}
