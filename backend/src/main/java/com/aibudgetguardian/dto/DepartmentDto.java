package com.aibudgetguardian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentDto {
    private UUID id;
    private String code;
    private String name;
    private String description;
    private BigDecimal annualBudget;
    private BigDecimal quarterlyBudget;
    private BigDecimal monthlyBudget;
    private BigDecimal usedBudget;
    private BigDecimal remainingBudget;
    private double utilizationPercentage;
    private String status;
    private LocalDateTime createdAt;
}
