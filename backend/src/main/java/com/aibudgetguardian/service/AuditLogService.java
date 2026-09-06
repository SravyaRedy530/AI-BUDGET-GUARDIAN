package com.aibudgetguardian.service;

import com.aibudgetguardian.entity.AuditLog;
import com.aibudgetguardian.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void log(UUID userId, String userEmail, String action, String entityType, String entityId, String ipAddress, String beforeState, String afterState) {
        AuditLog auditLog = AuditLog.builder()
                .userId(userId)
                .userEmail(userEmail)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .ipAddress(ipAddress)
                .beforeState(beforeState)
                .afterState(afterState)
                .build();
        auditLogRepository.save(auditLog);
    }
}
