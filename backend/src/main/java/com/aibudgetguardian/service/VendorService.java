package com.aibudgetguardian.service;

import com.aibudgetguardian.dto.VendorDto;
import com.aibudgetguardian.entity.Vendor;
import com.aibudgetguardian.exception.ResourceNotFoundException;
import com.aibudgetguardian.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    @Transactional(readOnly = true)
    public Page<VendorDto> getAllVendors(Pageable pageable) {
        return vendorRepository.findAll(pageable).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public VendorDto getVendorById(UUID id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with ID: " + id));
        return mapToDto(vendor);
    }

    public VendorDto mapToDto(Vendor v) {
        return VendorDto.builder()
                .id(v.getId())
                .vendorName(v.getVendorName())
                .gstNumber(v.getGstNumber())
                .panNumber(v.getPanNumber())
                .bankAccountNo(v.getBankAccountNo())
                .ifscCode(v.getIfscCode())
                .address(v.getAddress())
                .contactEmail(v.getContactEmail())
                .contactPhone(v.getContactPhone())
                .category(v.getCategory())
                .status(v.getStatus())
                .blacklistReason(v.getBlacklistReason())
                .riskScore(v.getRiskScore())
                .riskLevel(v.getRiskLevel())
                .createdAt(v.getCreatedAt())
                .build();
    }
}
