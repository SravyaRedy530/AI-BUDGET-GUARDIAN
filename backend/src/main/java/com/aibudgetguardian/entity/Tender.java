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
@Table(name = "tenders")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tender {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tender_number", unique = true, nullable = false, length = 100)
    private String tenderNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "estimated_cost", nullable = false, precision = 15, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "winning_bid_amount", precision = 15, scale = 2)
    private BigDecimal winningBidAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winning_vendor_id")
    private Vendor winningVendor;

    @Column(name = "number_of_bidders")
    @Builder.Default
    private Integer numberOfBidders = 0;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "DRAFT"; // DRAFT, PUBLISHED, EVALUATION, AWARDED, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(name = "tender_risk_score", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal tenderRiskScore = BigDecimal.ZERO;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
