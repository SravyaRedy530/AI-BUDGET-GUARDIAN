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
@Table(name = "tenants")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tenant_code", unique = true, nullable = false, length = 50)
    private String tenantCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "tenant_type", nullable = false, length = 50)
    private String tenantType; // STATE_GOVERNMENT, CENTRAL_MINISTRY, MUNICIPAL_CORP, ENTERPRISE_COMPANY

    @Column(length = 100)
    private String stateOrRegion;

    @Column(name = "annual_budget", precision = 18, scale = 2)
    @Builder.Default
    private BigDecimal annualBudget = BigDecimal.ZERO;

    @Column(name = "active_departments_count")
    @Builder.Default
    private Integer activeDepartmentsCount = 0;

    @Column(name = "risk_level", length = 30)
    @Builder.Default
    private String riskLevel = "LOW";

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "ACTIVE";

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
