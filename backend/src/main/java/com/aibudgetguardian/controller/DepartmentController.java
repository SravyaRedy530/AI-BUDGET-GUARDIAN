package com.aibudgetguardian.controller;

import com.aibudgetguardian.dto.ApiResponse;
import com.aibudgetguardian.dto.DepartmentDto;
import com.aibudgetguardian.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    @PreAuthorize("hasAuthority('budget:view') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<DepartmentDto>>> getAllDepartments() {
        List<DepartmentDto> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(ApiResponse.success(departments, "Departments retrieved successfully"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('budget:view') or hasAuthority('ROLE_SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentDto>> getDepartmentById(@PathVariable UUID id) {
        DepartmentDto department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(ApiResponse.success(department, "Department retrieved successfully"));
    }
}
