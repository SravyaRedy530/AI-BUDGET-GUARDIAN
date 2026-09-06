package com.aibudgetguardian.repository;

import com.aibudgetguardian.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    List<Invoice> findByVendorIdAndAmount(UUID vendorId, BigDecimal amount);
    Page<Invoice> findByDepartmentId(UUID departmentId, Pageable pageable);
    Page<Invoice> findByVendorId(UUID vendorId, Pageable pageable);
    Page<Invoice> findByDuplicateFlag(Boolean duplicateFlag, Pageable pageable);
    Page<Invoice> findByApprovalStatus(String approvalStatus, Pageable pageable);
}
