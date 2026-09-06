import React, { useState, useEffect } from 'react';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { CreateUserModal } from '../common/CreateUserModal';
import { AllocateBudgetModal } from '../common/AllocateBudgetModal';
import { CreateDepartmentModal } from '../common/CreateDepartmentModal';
import { TreasuryLifecycleTracker } from '../common/TreasuryLifecycleTracker';
import { useTenant } from '../../context/TenantContext';
import { apiClient } from '../../api/client';
import { Department, User } from '../../types';
import { Building, Building2, DollarSign, Plus, Users, PieChart, ShieldAlert, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const CompanyAdminDashboard: React.FC = () => {
  const { currentTenant } = useTenant();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, userRes] = await Promise.all([
          apiClient.get('/departments'),
          apiClient.get('/users')
        ]);
        if (deptRes.data.success) setDepartments(deptRes.data.data || []);
        if (userRes.data.success) setUsers(userRes.data.data.content || []);
      } catch (e) {
        console.error("Failed to load company metrics", e);
      }
    };
    fetchData();
  }, []);

  const totalAllocated = currentTenant.annualBudget || departments.reduce((acc, d) => acc + (d.annualBudget || 0), 0);
  const totalUsed = departments.reduce((acc, d) => acc + (d.usedBudget || 0), 0);
  const totalRemaining = totalAllocated - totalUsed;

  const deptChartData = departments.map(d => ({
    name: d.code.replace('DEPT_', ''),
    Allocated: d.annualBudget / 1000000,
    Spent: d.usedBudget / 1000000
  }));

  return (
    <div className="space-y-8">
      {/* Modals */}
      <CreateUserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSuccess={(u) => setUsers([u, ...users])} />
      <AllocateBudgetModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} onSuccess={() => {}} />
      <CreateDepartmentModal isOpen={isDeptModalOpen} onClose={() => setIsDeptModalOpen(false)} onSuccess={(d) => setDepartments([d, ...departments])} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            🏢 {currentTenant.name} Admin Portal
            <span className="text-xs font-mono font-bold bg-blue-950/80 border border-blue-800 text-blue-400 px-2.5 py-0.5 rounded-full">
              COMPANY ADMIN WORKSPACE
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage sub-account team roles, company department grants, procurement authorizations, and budget tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDeptModalOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 text-blue-400" /> Create Department
          </button>
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Provision Sub-Account User
          </button>
        </div>
      </div>

      {/* Real-Time Treasury Funds Lifecycle Pipeline */}
      <TreasuryLifecycleTracker />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Company Monitored Budget"
          value={`₹${(totalAllocated / 10000000).toFixed(2)} Cr`}
          subtitle={`FY Grant: ${currentTenant.tenantCode}`}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Disbursed Expenditures"
          value={`₹${(totalUsed / 10000000).toFixed(2)} Cr`}
          subtitle={`Remaining Buffer: ₹${(totalRemaining / 10000000).toFixed(2)} Cr`}
          icon={PieChart}
          color="emerald"
        />
        <MetricCard
          title="Provisioned Team Users"
          value={users.length > 0 ? users.length : 5}
          subtitle="Auditors, Finance &amp; Managers"
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Active Company Departments"
          value={departments.length > 0 ? departments.length : 4}
          subtitle="Public Works, Health, Edu, IT"
          icon={Building2}
          color="amber"
        />
      </div>

      {/* Department Breakdown & Sub-Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" /> Department Allocation vs Utilization (₹ Millions)
            </h3>
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Adjust Budget Grant
            </button>
          </div>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="Allocated" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sub-Accounts List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" /> Provisioned Team Sub-Accounts
          </h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {users.map((u, idx) => (
              <div key={u.id || idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{u.fullName}</span>
                  <StatusBadge status={u.status} />
                </div>
                <p className="text-[11px] font-mono text-slate-400">{u.email}</p>
                <div className="flex items-center justify-between text-[10px] text-blue-400 font-mono pt-1">
                  <span>Role: {u.roles?.map(r => r.name).join(', ') || 'FINANCE_OFFICER'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
