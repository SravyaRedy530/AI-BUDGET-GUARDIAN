package com.aibudgetguardian.controller;

import com.aibudgetguardian.dto.AIRiskCenterSummaryDto;
import com.aibudgetguardian.dto.ApiResponse;
import com.aibudgetguardian.entity.AIPrediction;
import com.aibudgetguardian.service.AIRiskCenterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AIRiskCenterController {

    private final AIRiskCenterService aiRiskCenterService;

    @GetMapping("/risk-center")
    @PreAuthorize("hasAuthority('fraud:view') or hasAuthority('ROLE_SUPER_ADMIN') or hasAuthority('ROLE_AUDITOR')")
    public ResponseEntity<ApiResponse<AIRiskCenterSummaryDto>> getRiskCenterSummary() {
        AIRiskCenterSummaryDto summary = aiRiskCenterService.getRiskCenterSummary();
        return ResponseEntity.ok(ApiResponse.success(summary, "AI Risk Center telemetry retrieved successfully"));
    }

    @GetMapping("/explain/{entityType}/{entityId}")
    @PreAuthorize("hasAuthority('fraud:view') or hasAuthority('ROLE_SUPER_ADMIN') or hasAuthority('ROLE_AUDITOR')")
    public ResponseEntity<ApiResponse<AIPrediction>> getExplanation(
            @PathVariable String entityType,
            @PathVariable UUID entityId) {
        AIPrediction prediction = aiRiskCenterService.getExplanation(entityType.toUpperCase(), entityId);
        return ResponseEntity.ok(ApiResponse.success(prediction, "AI Explanation retrieved successfully"));
    }
}
