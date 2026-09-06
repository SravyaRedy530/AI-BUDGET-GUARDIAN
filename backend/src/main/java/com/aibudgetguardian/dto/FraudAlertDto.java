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
public class FraudAlertDto {
    private UUID id;
    private String alertCode;
    private String severity;
    private String entityType;
    private UUID entityId;
    private UUID vendorId;
    private String vendorName;
    private UUID departmentId;
    private String departmentName;
    private String title;
    private String description;
    private String status;
    private LocalDateTime createdAt;
}
