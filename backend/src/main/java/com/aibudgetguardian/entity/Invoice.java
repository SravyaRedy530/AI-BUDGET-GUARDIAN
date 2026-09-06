package com.aibudgetguardian.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "invoice_number", nullable = false, length = 100)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "po_id")
    private PurchaseOrder purchaseOrder;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "gst_amount", precision = 15, scale = 2)
    @Builder.Default
    private BigDecimal gstAmount = BigDecimal.ZERO;

    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "document_url", length = 500)
    private String documentUrl;

    @Column(name = "duplicate_probability", precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal duplicateProbability = BigDecimal.ZERO;

    @Column(name = "duplicate_flag")
    @Builder.Default
    private Boolean duplicateFlag = false;

    @Column(name = "approval_status", nullable = false, length = 30)
    @Builder.Default
    private String approvalStatus = "PENDING"; // PENDING, APPROVED, REJECTED, FLAGGED

    @Column(name = "payment_status", nullable = false, length = 30)
    @Builder.Default
    private String paymentStatus = "UNPAID"; // UNPAID, PARTIAL, PAID

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
