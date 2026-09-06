package com.aibudgetguardian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIRiskCenterSummaryDto {
    private long totalAnalysesPerformed;
    private long highRiskPredictionsCount;
    private long criticalAlertsCount;
    private long duplicateInvoicesFlagged;
    private long highRiskVendorsCount;
    private BigDecimal averageRiskScore;
    private List<FraudAlertDto> recentAlerts;
}
