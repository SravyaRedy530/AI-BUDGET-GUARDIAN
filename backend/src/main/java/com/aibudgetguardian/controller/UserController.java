package com.aibudgetguardian.controller;

import com.aibudgetguardian.dto.ApiResponse;
import com.aibudgetguardian.dto.CreateUserRequest;
import com.aibudgetguardian.dto.UserDto;
import com.aibudgetguardian.security.CustomUserDetails;
import com.aibudgetguardian.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN') or hasAuthority('users:manage')")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<UserDto> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(ApiResponse.success(users, "Users retrieved successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN') or hasAuthority('users:manage')")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable UUID id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user, "User retrieved successfully"));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN') or hasAuthority('users:manage')")
    public ResponseEntity<ApiResponse<UserDto>> createUser(
            @Valid @RequestBody CreateUserRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        UserDto user = userService.createUser(request, currentUser.getId(), currentUser.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(user, "User created successfully"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN') or hasAuthority('users:manage')")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        String status = body.getOrDefault("status", "ACTIVE");
        UserDto user = userService.updateUserStatus(id, status, currentUser.getId(), currentUser.getEmail());
        return ResponseEntity.ok(ApiResponse.success(user, "User status updated successfully"));
    }
}
