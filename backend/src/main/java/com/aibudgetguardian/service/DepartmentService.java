package com.aibudgetguardian.service;

import com.aibudgetguardian.dto.DepartmentDto;
import com.aibudgetguardian.entity.Department;
import com.aibudgetguardian.exception.ResourceNotFoundException;
import com.aibudgetguardian.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentDto getDepartmentById(UUID id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return mapToDto(dept);
    }

    public DepartmentDto mapToDto(Department dept) {
        double utilPct = 0.0;
        if (dept.getAnnualBudget() != null && dept.getAnnualBudget().compareTo(BigDecimal.ZERO) > 0) {
            utilPct = dept.getUsedBudget()
                    .multiply(BigDecimal.valueOf(100))
                    .divide(dept.getAnnualBudget(), 2, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        return DepartmentDto.builder()
                .id(dept.getId())
                .code(dept.getCode())
                .name(dept.getName())
                .description(dept.getDescription())
                .annualBudget(dept.getAnnualBudget())
                .quarterlyBudget(dept.getQuarterlyBudget())
                .monthlyBudget(dept.getMonthlyBudget())
                .usedBudget(dept.getUsedBudget())
                .remainingBudget(dept.getRemainingBudget())
                .utilizationPercentage(utilPct)
                .status(dept.getStatus())
                .createdAt(dept.getCreatedAt())
                .build();
    }
}
