package com.aibudgetguardian.repository;

import com.aibudgetguardian.entity.ContactInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContactInquiryRepository extends JpaRepository<ContactInquiry, UUID> {
    List<ContactInquiry> findAllByOrderByCreatedAtDesc();
}
