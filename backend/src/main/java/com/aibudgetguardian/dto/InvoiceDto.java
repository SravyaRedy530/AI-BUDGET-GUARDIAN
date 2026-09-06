package com.aibudgetguardian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceDto {
    private UUID id;
    private String invoiceNumber;
    private UUID vendorId;
    private String vendorName;
    private UUID departmentId;
    private String departmentName;
    private UUID poId;
    private String poNumber;
    private BigDecimal amount;
    private BigDecimal gstAmount;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private String documentUrl;
    private BigDecimal duplicateProbability;
    private Boolean duplicateFlag;
    private String approvalStatus;
    private String paymentStatus;
    private LocalDateTime createdAt;
}
