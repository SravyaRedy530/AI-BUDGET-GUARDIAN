import React, { useState, useEffect } from 'react';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { AllocateBudgetModal } from '../common/AllocateBudgetModal';
import { apiClient } from '../../api/client';
import { Contractor, Department } from '../../types';
import { Building2, PieChart, Briefcase, TrendingUp, AlertTriangle, Plus, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DeptManagerDashboard: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, contractorRes] = await Promise.all([
          apiClient.get('/departments'),
          apiClient.get('/contractors')
        ]);
        if (deptRes.data.success) setDepartments(deptRes.data.data || []);
        if (contractorRes.data.success) setContractors(contractorRes.data.data.content || []);
      } catch (e) {
        console.error("Failed to load department metrics", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalAllocated = departments.reduce((acc, d) => acc + (d.annualBudget || 0), 0);
  const totalUsed = departments.reduce((acc, d) => acc + (d.usedBudget || 0), 0);
  const totalRemaining = totalAllocated - totalUsed;

  const burnRateData = [
    { month: 'Apr', Target: 8.33, Actual: 7.8 },
    { month: 'May', Target: 16.66, Actual: 15.2 },
    { month: 'Jun', Target: 24.99, Actual: 27.1 },
    { month: 'Jul', Target: 33.32, Actual: 32.8 },
    { month: 'Aug', Target: 41.65, Actual: 40.5 }
  ];

  return (
    <div className="space-y-8">
      {/* Modals */}
      <AllocateBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => {}} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            🏢 Department Manager Spending &amp; Burn Rate Monitor
            <span className="text-xs font-mono font-bold bg-purple-950/80 border border-purple-800 text-purple-400 px-2.5 py-0.5 rounded-full">
              DEPARTMENT EXECUTION
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Department spending tracking, burn-rate time series analytics, remaining buffer, and contractor performance scores</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Request Budget Adjustment
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Allocated Annual Grant"
          value={`₹${(totalAllocated / 10000000).toFixed(2)} Cr`}
          subtitle="Department Fiscal Allocation"
          icon={Building2}
          color="blue"
        />
        <MetricCard
          title="Spent to Date"
          value={`₹${(totalUsed / 10000000).toFixed(2)} Cr`}
          subtitle={`Remaining: ₹${(totalRemaining / 10000000).toFixed(2)} Cr`}
          icon={TrendingUp}
          color="emerald"
        />
        <MetricCard
          title="Monthly Burn Rate"
          value="8.1% / mo"
          subtitle="Target Baseline: 8.33% / mo (STABLE)"
          icon={PieChart}
          color="purple"
        />
        <MetricCard
          title="Active Contractor Projects"
          value={contractors.length > 0 ? contractors.length : 3}
          subtitle="High Performance Score"
          icon={Briefcase}
          color="amber"
        />
      </div>

      {/* Burn Rate Chart & Contractor List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" /> Fiscal Burn Rate Target vs Actual Spend (%)
          </h3>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={burnRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                <Bar dataKey="Target" fill="#334155" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contractors List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-400" /> Overseen Contractors
          </h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {contractors.map((c) => (
              <div key={c.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{c.companyName}</span>
                  <RiskBadge level={c.riskLevel} />
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Lic: {c.licenseNumber}</p>
                <div className="flex items-center justify-between text-[10px] text-emerald-400 font-semibold pt-1">
                  <span>Rating: {c.performanceRating} / 5.0</span>
                  <span>Projects: {c.activeProjectsCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
