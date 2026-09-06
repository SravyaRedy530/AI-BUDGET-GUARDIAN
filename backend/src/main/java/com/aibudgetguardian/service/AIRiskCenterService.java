package com.aibudgetguardian.service;

import com.aibudgetguardian.dto.AIRiskCenterSummaryDto;
import com.aibudgetguardian.dto.FraudAlertDto;
import com.aibudgetguardian.entity.AIPrediction;
import com.aibudgetguardian.entity.FraudAlert;
import com.aibudgetguardian.exception.ResourceNotFoundException;
import com.aibudgetguardian.repository.AIPredictionRepository;
import com.aibudgetguardian.repository.FraudAlertRepository;
import com.aibudgetguardian.repository.InvoiceRepository;
import com.aibudgetguardian.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIRiskCenterService {

    private final AIPredictionRepository aiPredictionRepository;
    private final FraudAlertRepository fraudAlertRepository;
    private final InvoiceRepository invoiceRepository;
    private final VendorRepository vendorRepository;

    @Transactional(readOnly = true)
    public AIRiskCenterSummaryDto getRiskCenterSummary() {
        long totalAnalyses = aiPredictionRepository.count();
        long highRiskCount = aiPredictionRepository.findByRiskLevel("HIGH", PageRequest.of(0, 1)).getTotalElements()
                + aiPredictionRepository.findByRiskLevel("CRITICAL", PageRequest.of(0, 1)).getTotalElements();
        long criticalAlerts = fraudAlertRepository.findBySeverity("CRITICAL", PageRequest.of(0, 1)).getTotalElements();
        long duplicateInvoices = invoiceRepository.findByDuplicateFlag(true, PageRequest.of(0, 1)).getTotalElements();
        long highRiskVendors = vendorRepository.findByRiskLevel("HIGH", PageRequest.of(0, 1)).getTotalElements()
                + vendorRepository.findByRiskLevel("CRITICAL", PageRequest.of(0, 1)).getTotalElements();

        List<AIPrediction> allPredictions = aiPredictionRepository.findAll();
        BigDecimal avgRisk = BigDecimal.ZERO;
        if (!allPredictions.isEmpty()) {
            BigDecimal sum = allPredictions.stream()
                    .map(AIPrediction::getRiskScore)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            avgRisk = sum.divide(BigDecimal.valueOf(allPredictions.size()), 2, RoundingMode.HALF_UP);
        }

        List<FraudAlertDto> recentAlerts = fraudAlertRepository.findAll(PageRequest.of(0, 5, Sort.by("createdAt").descending()))
                .getContent().stream()
                .map(this::mapAlertToDto)
                .collect(Collectors.toList());

        return AIRiskCenterSummaryDto.builder()
                .totalAnalysesPerformed(totalAnalyses)
                .highRiskPredictionsCount(highRiskCount)
                .criticalAlertsCount(criticalAlerts)
                .duplicateInvoicesFlagged(duplicateInvoices)
                .highRiskVendorsCount(highRiskVendors)
                .averageRiskScore(avgRisk)
                .recentAlerts(recentAlerts)
                .build();
    }

    @Transactional(readOnly = true)
    public AIPrediction getExplanation(String entityType, UUID entityId) {
        return aiPredictionRepository.findByEntityTypeAndEntityId(entityType, entityId)
                .orElseGet(() -> aiPredictionRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("AI prediction explanation not found for " + entityType + " ID: " + entityId)));
    }

    public FraudAlertDto mapAlertToDto(FraudAlert alert) {
        return FraudAlertDto.builder()
                .id(alert.getId())
                .alertCode(alert.getAlertCode())
                .severity(alert.getSeverity())
                .entityType(alert.getEntityType())
                .entityId(alert.getEntityId())
                .vendorId(alert.getVendor() != null ? alert.getVendor().getId() : null)
                .vendorName(alert.getVendor() != null ? alert.getVendor().getVendorName() : null)
                .departmentId(alert.getDepartment() != null ? alert.getDepartment().getId() : null)
                .departmentName(alert.getDepartment() != null ? alert.getDepartment().getName() : null)
                .title(alert.getTitle())
                .description(alert.getDescription())
                .status(alert.getStatus())
                .createdAt(alert.getCreatedAt())
                .build();
    }
}
