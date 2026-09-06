package com.aibudgetguardian.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private UUID id;
    private String email;
    private String fullName;
    private String phone;
    private UUID departmentId;
    private String departmentName;
    private String status;
    private LocalDateTime lastLoginAt;
    private Set<RoleDto> roles;
    private Set<String> permissions;
    private LocalDateTime createdAt;
}
