import React, { useState } from 'react';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { ExportReportModal } from '../common/ExportReportModal';
import { CreateTenantModal } from '../common/CreateTenantModal';
import { CreateUserModal } from '../common/CreateUserModal';
import { TreasuryLifecycleTracker } from '../common/TreasuryLifecycleTracker';
import { useTenant } from '../../context/TenantContext';
import { useRealTimeTelemetry } from '../../context/RealTimeTelemetryContext';
import { Building, Crown, DollarSign, Globe, Plus, ShieldAlert, Users, Zap, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const SuperAdminDashboard: React.FC = () => {
  const { tenants, addTenant } = useTenant();
  const { liveStats, simulateLiveFraudEvent } = useRealTimeTelemetry();
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const totalSaaSBudget = tenants.reduce((sum, t) => sum + t.annualBudget, 0);

  const tenantChartData = tenants.map((t) => ({
    name: t.tenantCode,
    Budget: t.annualBudget / 10000000,
    Departments: t.activeDepartmentsCount
  }));

  return (
    <div className="space-y-8">
      {/* Modals */}
      <CreateTenantModal isOpen={isTenantModalOpen} onClose={() => setIsTenantModalOpen(false)} onSuccess={(t) => addTenant(t)} />
      <CreateUserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSuccess={() => {}} />
      <ExportReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            👑 Platform Super Admin Governance Dashboard
            <span className="text-xs font-mono font-bold bg-amber-950/80 border border-amber-800 text-amber-400 px-2.5 py-0.5 rounded-full">
              GLOBAL AUDIT OVERVIEW
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Cross-tenant state government &amp; enterprise company monitoring, SaaS health, and global AI risk telemetry</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={simulateLiveFraudEvent}
            className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4" /> Trigger Fraud Attack Simulation
          </button>
          <button
            onClick={() => setIsTenantModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Onboard New Tenant / Govt Entity
          </button>
        </div>
      </div>

      {/* Real-Time Treasury Funds Lifecycle Pipeline */}
      <TreasuryLifecycleTracker />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Monitored SaaS Budget"
          value={`₹${(totalSaaSBudget / 10000000).toFixed(2)} Cr`}
          subtitle="Cross-Tenant Treasury Grants"
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Onboarded Workspaces"
          value={tenants.length}
          subtitle="State Govts &amp; Enterprise SaaS"
          icon={Globe}
          color="emerald"
        />
        <MetricCard
          title="Active Fraud Interceptions"
          value={liveStats.interceptedFraudCount}
          subtitle="Cross-Tenant Critical Risk Alerts"
          icon={ShieldAlert}
          color="rose"
        />
        <MetricCard
          title="System Microservices"
          value="4 / 4 ONLINE"
          subtitle="Spring Boot, FastAPI, MinIO, Postgres"
          icon={Crown}
          color="purple"
        />
      </div>

      {/* Cross-Tenant Chart & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-400" /> Monitored Budget Grant by Tenant Organization (₹ Crores)
          </h3>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenantChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tenant Leaderboard */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" /> Active Tenant Workspaces
          </h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {tenants.map((t) => (
              <div key={t.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-blue-400">{t.tenantCode}</span>
                  <StatusBadge status={t.status} />
                </div>
                <h4 className="text-xs font-bold text-slate-200 truncate">{t.name}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{t.activeDepartmentsCount} Depts</span>
                  <span className="font-bold text-emerald-400">₹{(t.annualBudget / 10000000).toFixed(1)} Cr</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
