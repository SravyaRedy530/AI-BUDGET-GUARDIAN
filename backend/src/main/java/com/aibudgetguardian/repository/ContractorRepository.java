package com.aibudgetguardian.repository;

import com.aibudgetguardian.entity.Contractor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContractorRepository extends JpaRepository<Contractor, UUID> {
    Optional<Contractor> findByVendorId(UUID vendorId);
}
