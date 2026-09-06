package com.aibudgetguardian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudCaseDto {
    private UUID id;
    private String caseNumber;
    private UUID alertId;
    private String alertTitle;
    private UUID assignedAuditorId;
    private String assignedAuditorName;
    private UUID vendorId;
    private String vendorName;
    private UUID departmentId;
    private String departmentName;
    private String severity;
    private String status;
    private String findings;
    private String resolutionNotes;
    private String evidenceFilesJson;
    private LocalDateTime createdAt;
    private LocalDateTime closedAt;
}
