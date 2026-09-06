import React, { useState, useEffect } from 'react';
import { DollarSign, Save, X } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useTenant } from '../../context/TenantContext';
import { Department } from '../../types';

interface AllocateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newAllocation: any) => void;
  departments?: Department[];
}

export const AllocateBudgetModal: React.FC<AllocateBudgetModalProps> = ({ isOpen, onClose, onSuccess, departments = [] }) => {
  const { currentTenant } = useTenant();
  const [fiscalYear, setFiscalYear] = useState('2024-2025');
  const [departmentName, setDepartmentName] = useState('');
  const [customDeptName, setCustomDeptName] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('5000000.00');
  const [saving, setSaving] = useState(false);
  const [tenantDepts, setTenantDepts] = useState<Department[]>([]);

  useEffect(() => {
    if (departments.length > 0) {
      setTenantDepts(departments);
      setDepartmentName(departments[0].name);
    } else {
      if (currentTenant.tenantCode === 'GOV-KA') {
        const defaults = [
          'Department of Public Works & Infrastructure',
          'Department of Public Health & Family Welfare',
          'Department of Higher Education & Research',
          'Department of Information Technology & e-Gov'
        ];
        setTenantDepts(defaults.map((name, idx) => ({ id: String(idx), code: `DEPT-${idx}`, name, description: '', annualBudget: 0, usedBudget: 0, remainingBudget: 0, utilizationPercentage: 0, status: 'ACTIVE' })));
        setDepartmentName(defaults[0]);
      } else {
        const saved = localStorage.getItem(`depts_${currentTenant.tenantCode}`);
        const parsed: Department[] = saved ? JSON.parse(saved) : [];
        setTenantDepts(parsed);
        if (parsed.length > 0) {
          setDepartmentName(parsed[0].name);
        } else {
          setDepartmentName('OTHER');
        }
      }
    }
  }, [isOpen, currentTenant, departments]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const targetDeptName = departmentName === 'OTHER' ? customDeptName || 'General Operations' : departmentName;

    try {
      const res = await apiClient.post('/budgets/allocate', {
        fiscalYear,
        departmentName: targetDeptName,
        allocatedAmount: parseFloat(allocatedAmount)
      }).catch(() => null);

      const allocation = res?.data?.data || {
        id: String(Date.now()),
        fiscalYear,
        departmentName: targetDeptName,
        allocatedAmount: parseFloat(allocatedAmount),
        spentAmount: 0,
        remainingAmount: parseFloat(allocatedAmount),
        utilizationPercentage: 0,
        forecastStatus: 'STABLE'
      };

      onSuccess(allocation);
      onClose();
    } catch (err) {
      console.error(err);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Allocate Department Budget</h3>
              <p className="text-xs text-slate-400">Fiscal budget distribution &amp; grant release for {currentTenant.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Target Fiscal Year</label>
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="2024-2025">FY 2024 - 2025</option>
              <option value="2025-2026">FY 2025 - 2026 (Upcoming)</option>
              <option value="2023-2024">FY 2023 - 2024 (Prior)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Department Beneficiary</label>
            <select
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            >
              {tenantDepts.map((d) => (
                <option key={d.id || d.name} value={d.name}>
                  {d.name} ({d.code})
                </option>
              ))}
              <option value="OTHER">+ Add / Allocate New Custom Department</option>
            </select>
          </div>

          {departmentName === 'OTHER' && (
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">New Department Official Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Research &amp; Operations"
                value={customDeptName}
                onChange={(e) => setCustomDeptName(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Allocated Budget Grant (₹)</label>
            <input
              type="number"
              required
              value={allocatedAmount}
              onChange={(e) => setAllocatedAmount(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 space-y-1">
            <div className="flex justify-between font-semibold text-slate-300">
              <span>Automatic Burn Rate Target:</span>
              <span className="font-mono text-emerald-400">8.33% / month</span>
            </div>
            <p className="text-[11px] text-slate-500">AI microservice will continuously monitor expenditure spikes against this baseline.</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold hover:bg-slate-700">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> {saving ? 'Allocating...' : 'Authorize Budget Grant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
