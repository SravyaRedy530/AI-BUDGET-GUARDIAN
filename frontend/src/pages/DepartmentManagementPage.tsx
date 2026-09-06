import React, { useEffect, useState } from 'react';
import { Department } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { CreateDepartmentModal } from '../components/common/CreateDepartmentModal';
import { AllocateBudgetModal } from '../components/common/AllocateBudgetModal';
import { Building2, Plus, DollarSign, CheckCircle2, Eye, ShieldAlert, FolderPlus } from 'lucide-react';

const SEED_DEPARTMENTS: Department[] = [
  { id: 'd1', code: 'DEPT_INFRA', name: 'Department of Public Works & Infrastructure', description: 'State roads, bridges, highway corridors, and civic building construction', annualBudget: 500000000.00, usedBudget: 342000000.00, remainingBudget: 158000000.00, utilizationPercentage: 68.4, status: 'ACTIVE' },
  { id: 'd2', code: 'DEPT_HEALTH', name: 'Department of Public Health & Family Welfare', description: 'District hospital construction, medical procurement, and rural clinics', annualBudget: 350000000.00, usedBudget: 289000000.00, remainingBudget: 61000000.00, utilizationPercentage: 82.6, status: 'ACTIVE' },
  { id: 'd3', code: 'DEPT_EDU', name: 'Department of Higher Education & Research', description: 'University research labs, polytechnic grants, and student digital tabs', annualBudget: 250000000.00, usedBudget: 145000000.00, remainingBudget: 105000000.00, utilizationPercentage: 58.0, status: 'ACTIVE' },
  { id: 'd4', code: 'DEPT_IT', name: 'Department of Information Technology & e-Gov', description: 'State datacenter infrastructure, cloud migration, and AI budget surveillance', annualBudget: 180000000.00, usedBudget: 161000000.00, remainingBudget: 19000000.00, utilizationPercentage: 89.4, status: 'ACTIVE' }
];

export const DepartmentManagementPage: React.FC = () => {
  const { hasRole } = useAuth();
  const { currentTenant } = useTenant();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isSuperAdminOnly = hasRole('SUPER_ADMIN') && !hasRole('COMPANY_ADMIN');

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

  const handleDeptCreated = (newDept: any) => {
    const formatted: Department = {
      id: String(Date.now()),
      code: newDept.code || `DEPT-${Math.floor(100 + Math.random() * 900)}`,
      name: newDept.name,
      description: newDept.description || 'Company Department',
      annualBudget: Number(newDept.annualBudget || newDept.allocatedBudget || 0),
      usedBudget: 0,
      remainingBudget: Number(newDept.annualBudget || newDept.allocatedBudget || 0),
      utilizationPercentage: 0,
      status: 'ACTIVE'
    };
    const updated = [formatted, ...departments];
    setDepartments(updated);

    if (currentTenant.tenantCode !== 'GOV-KA') {
      localStorage.setItem(`depts_${currentTenant.tenantCode}`, JSON.stringify(updated));
    }

    showToast(`Department "${newDept.name}" created for ${currentTenant.name}!`);
  };

  const handleBudgetAllocated = (newAlloc: any) => {
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

    showToast(`Budget allocation updated for "${newAlloc.departmentName}"!`);
  };

  const toggleDeptStatus = (d: Department) => {
    const isCurrentlyActive = d.status === 'ACTIVE';
    const updated = departments.map(item => item.id === d.id ? { ...item, status: isCurrentlyActive ? ('INACTIVE' as any) : ('ACTIVE' as any) } : item);
    setDepartments(updated);

    if (currentTenant.tenantCode !== 'GOV-KA') {
      localStorage.setItem(`depts_${currentTenant.tenantCode}`, JSON.stringify(updated));
    }

    showToast(
      isCurrentlyActive
        ? `Department "${d.name}" marked as Inactive.`
        : `Department "${d.name}" activated.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border border-blue-500 text-white rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <CreateDepartmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleDeptCreated}
      />

      <AllocateBudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSuccess={handleBudgetAllocated}
        departments={departments}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-500" /> {currentTenant.name} — Department Administration
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage company departments, codes, descriptions, and annual treasury allocations</p>
        </div>

        {isSuperAdminOnly ? (
          <div className="px-3.5 py-2 bg-purple-950/80 border border-purple-800 text-purple-300 rounded-xl text-xs font-bold font-mono flex items-center gap-2 shadow-lg">
            <Eye className="w-4 h-4 text-purple-400" /> PLATFORM GOVERNANCE VIEW (OBSERVATION ONLY)
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4 text-emerald-400" /> Allocate Budget
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Department
            </button>
          </div>
        )}
      </div>

      {isSuperAdminOnly && (
        <div className="p-3.5 bg-slate-900 border border-purple-800/60 rounded-xl flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Platform Super Admin observes department structures across tenant companies. Department creation is managed by Company Workspace Admins.</span>
          </div>
        </div>
      )}

      {/* Department List vs Zero State */}
      {departments.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-blue-950/60 border border-blue-800 text-blue-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <FolderPlus className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">Fresh Company Workspace — No Departments Created Yet</h3>
            <p className="text-xs text-slate-400">
              Welcome to <strong>{currentTenant.name}</strong>! Click below to create your company's first department and set budget allocations.
            </p>
          </div>
          {!isSuperAdminOnly && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create First Department
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((d) => (
            <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-400">{d.code}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{d.name}</h3>
                </div>
                <StatusBadge status={d.status} />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{d.description}</p>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                <span className="text-slate-400">Annual Budget Allocation</span>
                <span className="font-bold text-emerald-400 text-sm">₹{Number(d.annualBudget || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>

              {!isSuperAdminOnly && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => toggleDeptStatus(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      d.status === 'ACTIVE'
                        ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    {d.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
