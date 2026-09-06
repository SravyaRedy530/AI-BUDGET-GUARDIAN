import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  ShieldAlert,
  Building2,
  PieChart,
  FileCheck,
  CreditCard,
  Users,
  Search,
  FileText,
  Briefcase,
  AlertTriangle,
  Brain,
  History,
  ShieldCheck,
  Mail,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, hasRole } = useAuth();

  const navigation = [
    {
      group: 'Overview',
      items: [
        { name: 'Global Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_OFFICER', 'DEPARTMENT_MANAGER', 'AUDITOR'] },
      ]
    },
    {
      group: 'Financial Management',
      items: [
        { name: 'Budgets & Utilization', href: '/budgets', icon: PieChart, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_OFFICER', 'DEPARTMENT_MANAGER', 'AUDITOR'] },
        { name: 'Purchase Orders', href: '/purchase-orders', icon: FileCheck, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_OFFICER'] },
        { name: 'Invoices & OCR', href: '/invoices', icon: FileText, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_OFFICER', 'AUDITOR'] },
        { name: 'Payment Processing', href: '/payments', icon: CreditCard, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_OFFICER'] },
      ]
    },
    {
      group: 'Procurement',
      items: [
        { name: 'Vendor Registry', href: '/vendors', icon: Building2, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_OFFICER', 'AUDITOR'] },
        { name: 'Contractors', href: '/contractors', icon: Briefcase, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'DEPARTMENT_MANAGER', 'AUDITOR'] },
      ]
    },
    {
      group: 'AI Intelligence Center',
      items: [
        { name: 'AI Risk Telemetry', href: '/ai-risk-center', icon: Brain, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_OFFICER', 'DEPARTMENT_MANAGER', 'AUDITOR'] },
        { name: 'Duplicate Invoice Check', href: '/duplicate-detection', icon: Search, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_OFFICER', 'AUDITOR'] },
        { name: 'Vendor Identity Risk', href: '/vendor-risk', icon: ShieldAlert, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'FINANCE_OFFICER', 'AUDITOR'] },
      ]
    },
    {
      group: 'Audit & Investigation',
      items: [
        { name: 'Auditor Workspace', href: '/auditor-workspace', icon: AlertTriangle, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'AUDITOR'] },
        { name: 'System Audit Logs', href: '/audit-logs', icon: History, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'AUDITOR'] },
      ]
    },
    {
      group: 'Administration',
      items: [
        { name: 'Tenant & SaaS Governance', href: '/organizations', icon: Building2, roles: ['SUPER_ADMIN'] },
        { name: 'Public Contact Inquiries', href: '/contact-inquiries', icon: Mail, roles: ['SUPER_ADMIN'] },
        { name: 'User Management', href: '/users', icon: Users, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
        { name: 'Departments', href: '/departments', icon: Building2, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN'] },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-600/30">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base tracking-tight leading-none">AI Budget Guardian</h1>
          <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">Govt Financial Monitoring</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigation.map((group, gIdx) => {
          const filteredItems = group.items.filter(item => item.roles.some(r => hasRole(r)));
          if (filteredItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1.5">
              <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.group}</h3>
              {filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer Role Indicator */}
      {user && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-400">
              {user.fullName ? user.fullName.charAt(0) : 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-200 truncate">{user.fullName || user.email}</p>
              <span className="text-[10px] text-blue-400 font-mono font-semibold">
                {Array.isArray(user.roles) ? user.roles.map((r: any) => typeof r === 'string' ? r : r?.name || r?.code).join(', ') : ''}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
