package com.aibudgetguardian.repository;

import com.aibudgetguardian.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Optional<Payment> findByPaymentReference(String paymentReference);
    Page<Payment> findByDepartmentId(UUID departmentId, Pageable pageable);
    Page<Payment> findByVendorId(UUID vendorId, Pageable pageable);
    Page<Payment> findByStatus(String status, Pageable pageable);
}
