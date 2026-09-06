import React, { useEffect, useState } from 'react';
import { Department } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { AllocateBudgetModal } from '../components/common/AllocateBudgetModal';
import { PieChart as PieIcon, Building2, TrendingUp, DollarSign, Plus, DollarSign as DollarIcon, CheckCircle2, Eye, ShieldAlert, FolderPlus } from 'lucide-react';

const SEED_DEPARTMENTS: Department[] = [
  { id: 'd1', code: 'DEPT_INFRA', name: 'Department of Public Works & Infrastructure', description: 'State roads, bridges, highway corridors, and civic building construction', annualBudget: 500000000.00, usedBudget: 342000000.00, remainingBudget: 158000000.00, utilizationPercentage: 68.4, status: 'ACTIVE' },
  { id: 'd2', code: 'DEPT_HEALTH', name: 'Department of Public Health & Family Welfare', description: 'District hospital construction, medical procurement, and rural clinics', annualBudget: 350000000.00, usedBudget: 289000000.00, remainingBudget: 61000000.00, utilizationPercentage: 82.6, status: 'ACTIVE' },
  { id: 'd3', code: 'DEPT_EDU', name: 'Department of Higher Education & Research', description: 'University research labs, polytechnic grants, and student digital tabs', annualBudget: 250000000.00, usedBudget: 145000000.00, remainingBudget: 105000000.00, utilizationPercentage: 58.0, status: 'ACTIVE' },
  { id: 'd4', code: 'DEPT_IT', name: 'Department of Information Technology & e-Gov', description: 'State datacenter infrastructure, cloud migration, and AI budget surveillance', annualBudget: 180000000.00, usedBudget: 161000000.00, remainingBudget: 19000000.00, utilizationPercentage: 89.4, status: 'ACTIVE' }
];

export const BudgetsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const { currentTenant } = useTenant();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isSuperAdminOnly = hasRole('SUPER_ADMIN') && !hasRole('COMPANY_ADMIN');
  const canAllocateBudget = hasRole('COMPANY_ADMIN');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (currentTenant.tenantCode === 'GOV-KA') {
      setDepartments(SEED_DEPARTMENTS);
    } else {
      const storedKey = `depts_${currentTenant.tenantCode}`;
      const saved = localStorage.getItem(storedKey);
      setDepartments(saved ? JSON.parse(saved) : []);
    }
  }, [currentTenant]);

  const handleBudgetSuccess = (newAlloc: any) => {
    let found = false;
    const updated = departments.map(d => {
      if (d.name === newAlloc.departmentName || d.code === newAlloc.departmentCode) {
        found = true;
        const newAnnual = Number(newAlloc.allocatedAmount);
        return {
          ...d,
          annualBudget: newAnnual,
          remainingBudget: newAnnual - (d.usedBudget || 0),
          utilizationPercentage: ((d.usedBudget || 0) / (newAnnual || 1)) * 100
        };
      }
      return d;
    });

    let finalList = updated;
    if (!found) {
      const newDept: Department = {
        id: String(Date.now()),
        code: `DEPT-${Math.floor(100 + Math.random() * 900)}`,
        name: newAlloc.departmentName,
        description: 'Allocated Department Budget',
        annualBudget: Number(newAlloc.allocatedAmount),
        usedBudget: 0,
        remainingBudget: Number(newAlloc.allocatedAmount),
        utilizationPercentage: 0,
        status: 'ACTIVE'
      };
      finalList = [newDept, ...departments];
    }

    setDepartments(finalList);

    if (currentTenant.tenantCode !== 'GOV-KA') {
      localStorage.setItem(`depts_${currentTenant.tenantCode}`, JSON.stringify(finalList));
    }

    showToast(`Budget allocation of ₹${(Number(newAlloc.allocatedAmount) / 10000000).toFixed(2)} Cr authorized!`);
  };

  const openAllocateModal = () => {
    if (!canAllocateBudget) return;
    setIsModalOpen(true);
  };

  const totalAllocated = departments.reduce((acc, d) => acc + (d.annualBudget || 0), 0);
  const totalUsed = departments.reduce((acc, d) => acc + (d.usedBudget || 0), 0);
  const totalRemaining = departments.reduce((acc, d) => acc + (d.remainingBudget || 0), 0);

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border border-blue-500 text-white rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Allocate Budget Modal */}
      <AllocateBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleBudgetSuccess}
        departments={departments}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <PieIcon className="w-7 h-7 text-blue-500" /> {currentTenant.name} — Budgets &amp; Utilization
          </h1>
          <p className="text-xs text-slate-400 mt-1">Annual allocations, quarterly breakdowns, monthly burn rates, and remaining fiscal balances</p>
        </div>

        {isSuperAdminOnly ? (
          <div className="px-3.5 py-2 bg-purple-950/80 border border-purple-800 text-purple-300 rounded-xl text-xs font-bold font-mono flex items-center gap-2 shadow-lg">
            <Eye className="w-4 h-4 text-purple-400" /> PLATFORM GOVERNANCE VIEW (OBSERVATION ONLY)
          </div>
        ) : (
          <button
            onClick={openAllocateModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Authorize / Allocate Budget
          </button>
        )}
      </div>

      {isSuperAdminOnly && (
        <div className="p-3.5 bg-slate-900 border border-purple-800/60 rounded-xl flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Platform Super Admin is in <strong>Global Audit Mode</strong>. Budget allocation is managed directly by Company/State Treasury Admins.</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          title="Total Allocated Budget"
          value={`₹${(totalAllocated / 10000000).toFixed(2)} Cr`}
          subtitle={`FY Grant: ${currentTenant.tenantCode}`}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Total Disbursed / Used"
          value={`₹${(totalUsed / 10000000).toFixed(2)} Cr`}
          subtitle={`Utilization: ${((totalUsed / maxOne(totalAllocated)) * 100).toFixed(1)}%`}
          icon={TrendingUp}
          color="emerald"
        />
        <MetricCard
          title="Remaining Unspent Buffer"
          value={`₹${(totalRemaining / 10000000).toFixed(2)} Cr`}
          subtitle="Available Unspent Treasury Funds"
          icon={Building2}
          color="purple"
        />
      </div>

      {/* Budget Utilization Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-xs text-white uppercase tracking-wider">
          Departmental Fiscal Breakdown
        </div>
        <div className="overflow-x-auto">
          {departments.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FolderPlus className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-xs text-slate-400">
                No budget allocations added yet for <strong>{currentTenant.name}</strong>. Click "Authorize / Allocate Budget" or create departments in <strong>Department Admin</strong>.
              </div>
              <button
                onClick={openAllocateModal}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/30 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Authorize First Allocation
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Dept Code</th>
                  <th className="p-4">Department Name</th>
                  <th className="p-4">Annual Budget (₹)</th>
                  <th className="p-4">Used Budget (₹)</th>
                  <th className="p-4">Remaining (₹)</th>
                  <th className="p-4">Utilization %</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {departments.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-400">{d.code}</td>
                    <td className="p-4 font-bold text-white">{d.name}</td>
                    <td className="p-4">₹{Number(d.annualBudget || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-emerald-400">₹{Number(d.usedBudget || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 text-slate-300">₹{Number(d.remainingBudget || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className={`h-2 rounded-full ${d.utilizationPercentage > 85 ? 'bg-rose-500' : d.utilizationPercentage > 65 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(d.utilizationPercentage, 100)}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-200">{d.utilizationPercentage.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="p-4"><StatusBadge status={d.utilizationPercentage > 85 ? 'WARNING' : 'HEALTHY'} /></td>
                    <td className="p-4 text-right">
                      {isSuperAdminOnly ? (
                        <span className="text-[11px] text-slate-500 font-mono">Observation Mode</span>
                      ) : (
                        <button
                          onClick={openAllocateModal}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1 shadow"
                        >
                          <DollarIcon className="w-3.5 h-3.5" /> Adjust Budget
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

function maxOne(val: number): number {
  return val > 0 ? val : 1;
}
