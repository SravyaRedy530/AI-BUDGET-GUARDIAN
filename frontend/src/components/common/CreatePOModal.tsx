import React, { useState } from 'react';
import { FileCheck, Save, X, CheckCircle } from 'lucide-react';

interface CreatePOModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (po: any) => void;
}

export const CreatePOModal: React.FC<CreatePOModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [poNumber, setPoNumber] = useState(`PO-INFRA-2025-0${Math.floor(10 + Math.random() * 90)}`);
  const [department, setDepartment] = useState('Department of Public Works & Infrastructure');
  const [vendor, setVendor] = useState('Apex Highway Infra Corp');
  const [amount, setAmount] = useState('5000000.00');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPo = {
      id: String(Date.now()),
      poNumber,
      department,
      vendor,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      status: 'APPROVED'
    };
    onSuccess(newPo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-xl">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Purchase Order (PO)</h3>
              <p className="text-xs text-slate-400">Finance Officer procurement authorization workflow</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Purchase Order Number</label>
            <input
              type="text"
              required
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Target Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option>Department of Public Works &amp; Infrastructure</option>
              <option>Department of Public Health &amp; Family Welfare</option>
              <option>Department of Higher Education &amp; Research</option>
              <option>Department of Information Technology &amp; e-Gov</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Contractor / Vendor Entity</label>
            <select
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option>Apex Highway Infra Corp</option>
              <option>MedLife Pharma Supplies</option>
              <option>Global CyberTech Systems</option>
              <option>Shadow Infra Solutions</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Total Approved Contract Amount (₹)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold hover:bg-slate-700">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Issue Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
