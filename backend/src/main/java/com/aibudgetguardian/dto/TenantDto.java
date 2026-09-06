package com.aibudgetguardian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantDto {
    private UUID id;
    private String tenantCode;
    private String name;
    private String tenantType;
    private String stateOrRegion;
    private BigDecimal annualBudget;
    private Integer activeDepartmentsCount;
    private String riskLevel;
    private String status;
    private LocalDateTime createdAt;
}
