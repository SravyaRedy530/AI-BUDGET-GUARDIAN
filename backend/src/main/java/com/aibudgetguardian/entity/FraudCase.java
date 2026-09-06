package com.aibudgetguardian.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fraud_cases")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudCase {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "case_number", unique = true, nullable = false, length = 100)
    private String caseNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alert_id")
    private FraudAlert alert;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_auditor_id")
    private User assignedAuditor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(nullable = false, length = 30)
    private String severity; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "OPEN"; // OPEN, UNDER_INVESTIGATION, EVIDENCE_REVIEW, FINDINGS_SUBMITTED, CLOSED_RESOLVED, CLOSED_DISMISSED

    @Column(columnDefinition = "TEXT")
    private String findings;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "evidence_files_json", columnDefinition = "TEXT")
    private String evidenceFilesJson;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;
}
