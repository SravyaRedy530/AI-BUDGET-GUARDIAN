package com.aibudgetguardian.repository;

import com.aibudgetguardian.entity.PurchaseOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, UUID> {
    Optional<PurchaseOrder> findByPoNumber(String poNumber);
    Page<PurchaseOrder> findByDepartmentId(UUID departmentId, Pageable pageable);
    Page<PurchaseOrder> findByVendorId(UUID vendorId, Pageable pageable);
}
