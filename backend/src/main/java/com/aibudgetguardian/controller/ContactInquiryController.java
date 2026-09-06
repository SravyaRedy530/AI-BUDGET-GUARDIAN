package com.aibudgetguardian.controller;

import com.aibudgetguardian.dto.ApiResponse;
import com.aibudgetguardian.dto.ContactInquiryDto;
import com.aibudgetguardian.service.ContactInquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/contact-inquiries")
@RequiredArgsConstructor
public class ContactInquiryController {

    private final ContactInquiryService contactInquiryService;

    @PostMapping
    public ResponseEntity<ApiResponse<ContactInquiryDto>> submitInquiry(@Valid @RequestBody ContactInquiryDto dto) {
        ContactInquiryDto created = contactInquiryService.submitInquiry(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Thank you! Your inquiry has been submitted to the Platform Governance Admin team."));
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN') or hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<ContactInquiryDto>>> getAllInquiries() {
        List<ContactInquiryDto> inquiries = contactInquiryService.getAllInquiries();
        return ResponseEntity.ok(ApiResponse.success(inquiries, "Contact inquiries retrieved successfully"));
    }

    @PatchMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN') or hasAuthority('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<ContactInquiryDto>> updateStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "IN_REVIEW");
        ContactInquiryDto updated = contactInquiryService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(updated, "Inquiry status updated successfully"));
    }
}
