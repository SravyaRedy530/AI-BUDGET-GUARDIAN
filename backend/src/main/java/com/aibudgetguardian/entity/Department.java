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
@Table(name = "departments")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "annual_budget", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal annualBudget = BigDecimal.ZERO;

    @Column(name = "quarterly_budget", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal quarterlyBudget = BigDecimal.ZERO;

    @Column(name = "monthly_budget", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal monthlyBudget = BigDecimal.ZERO;

    @Column(name = "used_budget", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal usedBudget = BigDecimal.ZERO;

    @Column(name = "remaining_budget", nullable = false, precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal remainingBudget = BigDecimal.ZERO;

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
