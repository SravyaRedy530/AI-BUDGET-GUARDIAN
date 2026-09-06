package com.aibudgetguardian.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ai_predictions")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType; // INVOICE, VENDOR, BUDGET, CONTRACTOR, TENDER, TRANSACTION

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    @Column(name = "model_version", nullable = false, length = 30)
    private String modelVersion;

    @Column(name = "risk_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal riskScore;

    @Column(name = "risk_level", nullable = false, length = 30)
    private String riskLevel; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(nullable = false, precision = 4, scale = 3)
    private BigDecimal confidence;

    @Column(nullable = false, length = 255)
    private String prediction;

    @Column(name = "explanation_json", columnDefinition = "TEXT")
    private String explanationJson;

    @Column(name = "recommended_action", columnDefinition = "TEXT")
    private String recommendedAction;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
