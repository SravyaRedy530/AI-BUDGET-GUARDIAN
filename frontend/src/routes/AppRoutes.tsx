import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/layout/MainLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { GlobalDashboard } from '../pages/GlobalDashboard';
import { BudgetsPage } from '../pages/BudgetsPage';
import { PurchaseOrdersPage } from '../pages/PurchaseOrdersPage';
import { InvoicesPage } from '../pages/InvoicesPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { VendorsPage } from '../pages/VendorsPage';
import { ContractorsPage } from '../pages/ContractorsPage';
import { AIRiskCenterPage } from '../pages/AIRiskCenterPage';
import { DuplicateDetectionPage } from '../pages/DuplicateDetectionPage';
import { VendorRiskPage } from '../pages/VendorRiskPage';
import { AuditorWorkspacePage } from '../pages/AuditorWorkspacePage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { UserManagementPage } from '../pages/UserManagementPage';
import { DepartmentManagementPage } from '../pages/DepartmentManagementPage';
import { OrganizationManagementPage } from '../pages/OrganizationManagementPage';
import { ContactInquiriesPage } from '../pages/ContactInquiriesPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-semibold">
        Authenticating user session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Page & Auth Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Dashboard & Module Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><GlobalDashboard /></ProtectedRoute>} />
      <Route path="/budgets" element={<ProtectedRoute><BudgetsPage /></ProtectedRoute>} />
      <Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrdersPage /></ProtectedRoute>} />
      <Route path="/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
      <Route path="/vendors" element={<ProtectedRoute><VendorsPage /></ProtectedRoute>} />
      <Route path="/contractors" element={<ProtectedRoute><ContractorsPage /></ProtectedRoute>} />
      <Route path="/ai-risk-center" element={<ProtectedRoute><AIRiskCenterPage /></ProtectedRoute>} />
      <Route path="/duplicate-detection" element={<ProtectedRoute><DuplicateDetectionPage /></ProtectedRoute>} />
      <Route path="/vendor-risk" element={<ProtectedRoute><VendorRiskPage /></ProtectedRoute>} />
      <Route path="/auditor-workspace" element={<ProtectedRoute><AuditorWorkspacePage /></ProtectedRoute>} />
      <Route path="/audit-logs" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute><DepartmentManagementPage /></ProtectedRoute>} />
      <Route path="/organizations" element={<ProtectedRoute><OrganizationManagementPage /></ProtectedRoute>} />
      <Route path="/contact-inquiries" element={<ProtectedRoute><ContactInquiriesPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
