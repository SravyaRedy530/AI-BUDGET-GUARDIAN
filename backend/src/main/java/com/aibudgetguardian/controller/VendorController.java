package com.aibudgetguardian.controller;

import com.aibudgetguardian.dto.ApiResponse;
import com.aibudgetguardian.dto.VendorDto;
import com.aibudgetguardian.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @GetMapping
    @PreAuthorize("hasAuthority('vendor:manage') or hasAuthority('ROLE_SUPER_ADMIN') or hasAuthority('ROLE_AUDITOR')")
    public ResponseEntity<ApiResponse<Page<VendorDto>>> getAllVendors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "riskScore") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<VendorDto> vendors = vendorService.getAllVendors(pageable);
        return ResponseEntity.ok(ApiResponse.success(vendors, "Vendors retrieved successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('vendor:manage') or hasAuthority('ROLE_SUPER_ADMIN') or hasAuthority('ROLE_AUDITOR')")
    public ResponseEntity<ApiResponse<VendorDto>> getVendorById(@PathVariable UUID id) {
        VendorDto vendor = vendorService.getVendorById(id);
        return ResponseEntity.ok(ApiResponse.success(vendor, "Vendor retrieved successfully"));
    }
}
