import React, { useEffect, useState } from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import { CreatePOModal } from '../components/common/CreatePOModal';
import { useTenant } from '../context/TenantContext';
import { FileCheck, Plus, Search, FolderPlus, CheckCircle2 } from 'lucide-react';

const SEED_POS = [
  { id: '1', poNumber: 'PO-INFRA-2025-001', department: 'Department of Public Works & Infrastructure', vendor: 'Apex Highway Infra Corp', amount: 12000000.00, date: '2025-04-10', status: 'APPROVED' },
  { id: '2', poNumber: 'PO-HEALTH-2025-004', department: 'Department of Public Health & Family Welfare', vendor: 'MedLife Pharma Supplies', amount: 8500000.00, date: '2025-05-15', status: 'APPROVED' },
  { id: '3', poNumber: 'PO-INFRA-2025-009', department: 'Department of Public Works & Infrastructure', vendor: 'Shadow Infra Solutions', amount: 4500000.00, date: '2025-06-20', status: 'FLAGGED' },
];

export const PurchaseOrdersPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const [pos, setPos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (currentTenant.tenantCode === 'GOV-KA') {
      setPos(SEED_POS);
    } else {
      const saved = localStorage.getItem(`pos_${currentTenant.tenantCode}`);
      setPos(saved ? JSON.parse(saved) : []);
    }
    setLoading(false);
  }, [currentTenant]);

  const handlePOCreated = (newPo: any) => {
    const updated = [newPo, ...pos];
    setPos(updated);
    if (currentTenant.tenantCode !== 'GOV-KA') {
      localStorage.setItem(`pos_${currentTenant.tenantCode}`, JSON.stringify(updated));
    }
    showToast(`Purchase Order "${newPo.poNumber}" created for ${currentTenant.name}!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border border-blue-500 text-white rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Create PO Modal */}
      <CreatePOModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePOCreated}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileCheck className="w-7 h-7 text-blue-500" /> {currentTenant.name} — Purchase Orders (PO)
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track purchase order issuances, department authorizations, and procurement allocations</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Issue New Purchase Order
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {pos.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FolderPlus className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-xs text-slate-400">
                No purchase orders issued yet for <strong>{currentTenant.name}</strong>. Click "Issue New Purchase Order" to create a PO.
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">PO Number</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Total Amount (₹)</th>
                  <th className="p-4">PO Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {pos.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-400">{po.poNumber}</td>
                    <td className="p-4 text-white">{po.department}</td>
                    <td className="p-4 text-slate-300">{po.vendor}</td>
                    <td className="p-4 font-bold text-slate-100">₹{po.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 font-mono text-slate-400">{po.date}</td>
                    <td className="p-4"><StatusBadge status={po.status || 'APPROVED'} /></td>
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
