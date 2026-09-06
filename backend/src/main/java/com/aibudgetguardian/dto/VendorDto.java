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
public class VendorDto {
    private UUID id;
    private String vendorName;
    private String gstNumber;
    private String panNumber;
    private String bankAccountNo;
    private String ifscCode;
    private String address;
    private String contactEmail;
    private String contactPhone;
    private String category;
    private String status;
    private String blacklistReason;
    private BigDecimal riskScore;
    private String riskLevel;
    private LocalDateTime createdAt;
}
