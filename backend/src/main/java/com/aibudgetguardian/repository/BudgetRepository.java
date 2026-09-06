package com.aibudgetguardian.repository;

import com.aibudgetguardian.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, UUID> {
    Optional<Budget> findByDepartmentIdAndFinancialYear(UUID departmentId, String financialYear);
    List<Budget> findByDepartmentId(UUID departmentId);
}
