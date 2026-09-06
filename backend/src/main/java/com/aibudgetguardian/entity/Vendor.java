package com.aibudgetguardian.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "vendors")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "vendor_name", nullable = false, length = 200)
    private String vendorName;

    @Column(name = "gst_number", length = 50)
    private String gstNumber;

    @Column(name = "pan_number", length = 50)
    private String panNumber;

    @Column(name = "bank_account_no", length = 50)
    private String bankAccountNo;

    @Column(name = "ifsc_code", length = 30)
    private String ifscCode;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "contact_email", length = 150)
    private String contactEmail;

    @Column(name = "contact_phone", length = 30)
    private String contactPhone;

    @Column(length = 100)
    private String category;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, BLACKLISTED, UNDER_REVIEW

    @Column(name = "blacklist_reason", columnDefinition = "TEXT")
    private String blacklistReason;

    @Column(name = "risk_score", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal riskScore = BigDecimal.ZERO;

    @Column(name = "risk_level", length = 30)
    @Builder.Default
    private String riskLevel = "LOW"; // LOW, MEDIUM, HIGH, CRITICAL

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
