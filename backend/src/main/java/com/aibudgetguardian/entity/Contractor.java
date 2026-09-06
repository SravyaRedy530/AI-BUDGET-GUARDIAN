package com.aibudgetguardian.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "contractors")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contractor {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "company_name", nullable = false, length = 200)
    private String companyName;

    @Column(name = "total_projects")
    @Builder.Default
    private Integer totalProjects = 0;

    @Column(name = "completed_projects")
    @Builder.Default
    private Integer completedProjects = 0;

    @Column(name = "delayed_projects")
    @Builder.Default
    private Integer delayedProjects = 0;

    @Column(name = "cancelled_projects")
    @Builder.Default
    private Integer cancelledProjects = 0;

    @Column(name = "complaints_count")
    @Builder.Default
    private Integer complaintsCount = 0;

    @Column(name = "penalties_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal penaltiesAmount = BigDecimal.ZERO;

    @Column(name = "performance_rating", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal performanceRating = new BigDecimal("5.00");

    @Column(name = "risk_score", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal riskScore = BigDecimal.ZERO;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
