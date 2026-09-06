import React from 'react';
import { useAuth } from '../context/AuthContext';
import { SuperAdminDashboard } from '../components/dashboards/SuperAdminDashboard';
import { CompanyAdminDashboard } from '../components/dashboards/CompanyAdminDashboard';
import { FinanceOfficerDashboard } from '../components/dashboards/FinanceOfficerDashboard';
import { DeptManagerDashboard } from '../components/dashboards/DeptManagerDashboard';
import { AuditorDashboard } from '../components/dashboards/AuditorDashboard';

export const GlobalDashboard: React.FC = () => {
  const { hasRole } = useAuth();

  // Dynamic Role-Specific Dashboard Router
  if (hasRole('SUPER_ADMIN') && !hasRole('COMPANY_ADMIN')) {
    return <SuperAdminDashboard />;
  }

  if (hasRole('COMPANY_ADMIN')) {
    return <CompanyAdminDashboard />;
  }

  if (hasRole('FINANCE_OFFICER')) {
    return <FinanceOfficerDashboard />;
  }

  if (hasRole('DEPARTMENT_MANAGER')) {
    return <DeptManagerDashboard />;
  }

  if (hasRole('AUDITOR')) {
    return <AuditorDashboard />;
  }

  // Fallback for platform governance
  return <SuperAdminDashboard />;
};
