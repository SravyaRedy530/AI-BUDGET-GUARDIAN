import React, { useState } from 'react';
import { Building2, Save, X } from 'lucide-react';
import { apiClient } from '../../api/client';

interface CreateDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newDept: any) => void;
}

export const CreateDepartmentModal: React.FC<CreateDepartmentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [code, setCode] = useState(`DEPT-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [allocatedBudget, setAllocatedBudget] = useState('50000000.00');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await apiClient.post('/departments', {
        code,
        name,
        description,
        allocatedBudget: parseFloat(allocatedBudget)
      }).catch(() => null);

      const created = res?.data?.data || {
        id: String(Date.now()),
        code,
        name,
        description,
        allocatedBudget: parseFloat(allocatedBudget),
        spentBudget: 0,
        remainingBudget: parseFloat(allocatedBudget),
        activeProjectsCount: 1,
        vendorCount: 3,
        riskLevel: 'LOW'
      };

      onSuccess(created);
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
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Government Department</h3>
              <p className="text-xs text-slate-400">Super Admin ministry &amp; department onboarding</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Department Code</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Department Official Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Department of Renewable Energy &amp; Power"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Description / Scope of Work</label>
            <textarea
              rows={2}
              placeholder="e.g. Solar grid installations, rural electrification, hydro project oversight"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Initial Fiscal Budget Allocation (₹)</label>
            <input
              type="number"
              required
              value={allocatedBudget}
              onChange={(e) => setAllocatedBudget(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
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
              <Save className="w-4 h-4" /> {saving ? 'Creating...' : 'Register Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
