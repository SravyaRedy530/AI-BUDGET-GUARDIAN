package com.aibudgetguardian.service;

import com.aibudgetguardian.dto.CreateUserRequest;
import com.aibudgetguardian.dto.UserDto;
import com.aibudgetguardian.entity.Department;
import com.aibudgetguardian.entity.Role;
import com.aibudgetguardian.entity.User;
import com.aibudgetguardian.exception.BadRequestException;
import com.aibudgetguardian.exception.ResourceNotFoundException;
import com.aibudgetguardian.repository.DepartmentRepository;
import com.aibudgetguardian.repository.RoleRepository;
import com.aibudgetguardian.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(authService::mapToUserDto);
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return authService.mapToUserDto(user);
    }

    @Transactional
    public UserDto createUser(CreateUserRequest request, UUID actorId, String actorEmail) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User with email " + request.getEmail() + " already exists");
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));
        }

        Set<Role> roles = new HashSet<>();
        for (String roleCode : request.getRoleCodes()) {
            Role role = roleRepository.findByCode(roleCode)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with code: " + roleCode));
            roles.add(role);
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .department(department)
                .status("ACTIVE")
                .roles(roles)
                .build();

        User savedUser = userRepository.save(user);

        auditLogService.log(actorId, actorEmail, "CREATE_USER", "USER", savedUser.getId().toString(), null, null, "User created: " + savedUser.getEmail());

        return authService.mapToUserDto(savedUser);
    }

    @Transactional
    public UserDto updateUserStatus(UUID userId, String status, UUID actorId, String actorEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        String oldStatus = user.getStatus();
        user.setStatus(status);
        if ("ACTIVE".equalsIgnoreCase(status)) {
            user.setFailedAttempts(0);
        }
        User updated = userRepository.save(user);

        auditLogService.log(actorId, actorEmail, "UPDATE_USER_STATUS", "USER", userId.toString(), null, "Status: " + oldStatus, "Status: " + status);

        return authService.mapToUserDto(updated);
    }
}
