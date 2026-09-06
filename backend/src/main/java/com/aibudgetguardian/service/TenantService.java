package com.aibudgetguardian.service;

import com.aibudgetguardian.dto.TenantDto;
import com.aibudgetguardian.entity.Tenant;
import com.aibudgetguardian.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;

    @Transactional(readOnly = true)
    public List<TenantDto> getAllTenants() {
        List<Tenant> tenants = tenantRepository.findAll();
        if (tenants.isEmpty()) {
            return getSeedTenants();
        }
        return tenants.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public TenantDto createTenant(TenantDto dto) {
        Tenant tenant = Tenant.builder()
                .tenantCode(dto.getTenantCode() != null ? dto.getTenantCode() : "TENANT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .name(dto.getName())
                .tenantType(dto.getTenantType() != null ? dto.getTenantType() : "STATE_GOVERNMENT")
                .stateOrRegion(dto.getStateOrRegion() != null ? dto.getStateOrRegion() : "National")
                .annualBudget(dto.getAnnualBudget() != null ? dto.getAnnualBudget() : BigDecimal.valueOf(500000000))
                .activeDepartmentsCount(dto.getActiveDepartmentsCount() != null ? dto.getActiveDepartmentsCount() : 5)
                .riskLevel("LOW")
                .status("ACTIVE")
                .build();

        Tenant saved = tenantRepository.save(tenant);
        return mapToDto(saved);
    }

    private TenantDto mapToDto(Tenant t) {
        return TenantDto.builder()
                .id(t.getId())
                .tenantCode(t.getTenantCode())
                .name(t.getName())
                .tenantType(t.getTenantType())
                .stateOrRegion(t.getStateOrRegion())
                .annualBudget(t.getAnnualBudget())
                .activeDepartmentsCount(t.getActiveDepartmentsCount())
                .riskLevel(t.getRiskLevel())
                .status(t.getStatus())
                .createdAt(t.getCreatedAt())
                .build();
    }

    public List<TenantDto> getSeedTenants() {
        return Arrays.asList(
            TenantDto.builder()
                .id(UUID.fromString("11111111-1111-1111-1111-111111111111"))
                .tenantCode("GOV-KA")
                .name("Karnataka State Treasury & Financial Department")
                .tenantType("STATE_GOVERNMENT")
                .stateOrRegion("Karnataka, IN")
                .annualBudget(new BigDecimal("1850000000.00"))
                .activeDepartmentsCount(8)
                .riskLevel("LOW")
                .status("ACTIVE")
                .build(),
            TenantDto.builder()
                .id(UUID.fromString("22222222-2222-2222-2222-222222222222"))
                .tenantCode("GOV-MH")
                .name("Maharashtra Public Works & Finance Ministry")
                .tenantType("STATE_GOVERNMENT")
                .stateOrRegion("Maharashtra, IN")
                .annualBudget(new BigDecimal("2400000000.00"))
                .activeDepartmentsCount(12)
                .riskLevel("MEDIUM")
                .status("ACTIVE")
                .build(),
            TenantDto.builder()
                .id(UUID.fromString("33333333-3333-3333-3333-333333333333"))
                .tenantCode("CENTRAL-MOF")
                .name("Ministry of Finance & Department of Expenditure")
                .tenantType("CENTRAL_MINISTRY")
                .stateOrRegion("New Delhi, Central")
                .annualBudget(new BigDecimal("5000000000.00"))
                .activeDepartmentsCount(24)
                .riskLevel("LOW")
                .status("ACTIVE")
                .build(),
            TenantDto.builder()
                .id(UUID.fromString("44444444-4444-4444-4444-444444444444"))
                .tenantCode("ENTERPRISE-TATA")
                .name("Tata Infrastructure Enterprise SaaS Portal")
                .tenantType("ENTERPRISE_COMPANY")
                .stateOrRegion("Global Corporate")
                .annualBudget(new BigDecimal("950000000.00"))
                .activeDepartmentsCount(6)
                .riskLevel("LOW")
                .status("ACTIVE")
                .build()
        );
    }
}
