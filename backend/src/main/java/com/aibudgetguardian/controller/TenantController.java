package com.aibudgetguardian.controller;

import com.aibudgetguardian.dto.ApiResponse;
import com.aibudgetguardian.dto.TenantDto;
import com.aibudgetguardian.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TenantDto>>> getAllTenants() {
        List<TenantDto> tenants = tenantService.getAllTenants();
        return ResponseEntity.ok(ApiResponse.success(tenants, "Tenants retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TenantDto>> createTenant(@RequestBody TenantDto dto) {
        TenantDto created = tenantService.createTenant(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created, "Tenant onboarded successfully"));
    }
}
