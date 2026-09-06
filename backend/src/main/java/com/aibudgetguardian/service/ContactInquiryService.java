package com.aibudgetguardian.service;

import com.aibudgetguardian.dto.ContactInquiryDto;
import com.aibudgetguardian.entity.ContactInquiry;
import com.aibudgetguardian.exception.ResourceNotFoundException;
import com.aibudgetguardian.repository.ContactInquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactInquiryService {

    private final ContactInquiryRepository contactInquiryRepository;

    @Transactional
    public ContactInquiryDto submitInquiry(ContactInquiryDto dto) {
        ContactInquiry inquiry = ContactInquiry.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .organization(dto.getOrganization() != null ? dto.getOrganization() : "Public / Independent")
                .subject(dto.getSubject())
                .message(dto.getMessage())
                .status("NEW")
                .build();

        ContactInquiry saved = contactInquiryRepository.save(inquiry);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ContactInquiryDto> getAllInquiries() {
        List<ContactInquiry> list = contactInquiryRepository.findAllByOrderByCreatedAtDesc();
        if (list.isEmpty()) {
            return getSeedInquiries();
        }
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public ContactInquiryDto updateStatus(UUID id, String status) {
        ContactInquiry inquiry = contactInquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact inquiry not found with ID: " + id));
        inquiry.setStatus(status);
        ContactInquiry updated = contactInquiryRepository.save(inquiry);
        return mapToDto(updated);
    }

    private ContactInquiryDto mapToDto(ContactInquiry entity) {
        return ContactInquiryDto.builder()
                .id(entity.getId())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .organization(entity.getOrganization())
                .subject(entity.getSubject())
                .message(entity.getMessage())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private List<ContactInquiryDto> getSeedInquiries() {
        return Arrays.asList(
            ContactInquiryDto.builder()
                .id(UUID.fromString("11111111-1111-1111-1111-111111111111"))
                .fullName("Sunil Deshmukh")
                .email("sunil.deshmukh@infrastructure.org")
                .organization("National Highway Builders Association")
                .subject("Enterprise SaaS Onboarding Query")
                .message("We would like to integrate AI Budget Guardian for our state highway procurement monitoring across 5 regional circles.")
                .status("NEW")
                .createdAt(java.time.LocalDateTime.now().minusHours(2))
                .build(),
            ContactInquiryDto.builder()
                .id(UUID.fromString("22222222-2222-2222-2222-222222222222"))
                .fullName("Anita Roy")
                .email("anita.roy@auditcouncil.gov.in")
                .organization("State Financial Audit Directorate")
                .subject("Fraud Tip-off / Whistleblower Alert")
                .message("Suspected duplicate billing pattern identified on PO-INFRA-2025-009 involving shared bank accounts between shell contractors.")
                .status("IN_REVIEW")
                .createdAt(java.time.LocalDateTime.now().minusDays(1))
                .build()
        );
    }
}
