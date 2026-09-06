package com.aibudgetguardian.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "budgets")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "financial_year", nullable = false, length = 20)
    private String financialYear; // e.g. FY2025-26

    @Column(name = "allocated_amount", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal allocatedAmount = BigDecimal.ZERO;

    @Column(name = "used_amount", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal usedAmount = BigDecimal.ZERO;

    @Column(name = "remaining_amount", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal remainingAmount = BigDecimal.ZERO;

    @Column(name = "burn_rate_monthly", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal burnRateMonthly = BigDecimal.ZERO;

    @Column(name = "projected_exhaustion_date")
    private LocalDate projectedExhaustionDate;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "HEALTHY"; // HEALTHY, WARNING, CRITICAL, EXCEEDED

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
