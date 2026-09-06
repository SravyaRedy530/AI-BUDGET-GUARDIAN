import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../components/common/StatusBadge';
import { useTenant } from '../context/TenantContext';
import { CreatePaymentModal } from '../components/common/CreatePaymentModal';
import { CreditCard, Plus, FolderPlus, Search } from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const [payments, setPayments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentTenant.tenantCode === 'GOV-KA') {
      setPayments([
        { id: '1', ref: 'PAY-2025-88901', invoice: 'INV-2025-001', vendor: 'Apex Highway Infra Corp', dept: 'Public Works & Infrastructure', amount: 4000000.00, mode: 'NEFT', date: '2025-04-26', status: 'PAID' },
        { id: '2', ref: 'PAY-2025-88902', invoice: 'INV-MED-8899', vendor: 'MedLife Pharma Supplies', dept: 'Public Health & Family Welfare', amount: 2500000.00, mode: 'RTGS', date: '2025-05-31', status: 'PAID' },
        { id: '3', ref: 'PAY-2025-88903', invoice: 'INV-MED-8899-DUP', vendor: 'MedLife Pharma Supplies', dept: 'Public Health & Family Welfare', amount: 2500000.00, mode: 'RTGS', date: '2025-06-02', status: 'FLAGGED' },
        { id: '4', ref: 'PAY-2025-88904', invoice: 'INV-SHADOW-001', vendor: 'Shadow Infra Solutions', dept: 'Public Works & Infrastructure', amount: 6800000.00, mode: 'DIRECT_TRANSFER', date: '2025-06-26', status: 'UNDER_REVIEW' },
      ]);
    } else {
      const saved = localStorage.getItem(`payments_${currentTenant.tenantCode}`);
      setPayments(saved ? JSON.parse(saved) : []);
    }
  }, [currentTenant]);

  const handlePaymentSuccess = (newPayment: any) => {
    const updated = [newPayment, ...payments];
    setPayments(updated);
    if (currentTenant.tenantCode !== 'GOV-KA') {
      localStorage.setItem(`payments_${currentTenant.tenantCode}`, JSON.stringify(updated));
    }
  };

  const filteredPayments = payments.filter(p =>
    p.ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.invoice?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dept?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Modal */}
      <CreatePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-blue-500" /> {currentTenant.name} — Payment Disbursement Processing
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review payment authorizations, treasury disbursements, and AI payment integrity checks</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Process Disbursement
        </button>
      </div>

      {/* Search Bar & Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden space-y-4">
        {payments.length > 0 && (
          <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Payment Ref, Invoice, Vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="text-xs text-slate-400">
              Total Payments: <strong className="text-white">{filteredPayments.length}</strong>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {filteredPayments.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FolderPlus className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-xs text-slate-400">
                No payment disbursements recorded yet for <strong>{currentTenant.name}</strong>. Click "Process Disbursement" to record your company's first payment settlement.
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/30 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Process First Disbursement
              </button>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Payment Ref #</th>
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Vendor Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Amount (₹)</th>
                  <th className="p-4">Mode</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-400">{p.ref}</td>
                    <td className="p-4 font-mono text-slate-200">{p.invoice}</td>
                    <td className="p-4 font-bold text-white">{p.vendor}</td>
                    <td className="p-4 text-slate-400">{p.dept}</td>
                    <td className="p-4 font-bold text-slate-100">₹{Number(p.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 font-mono text-slate-400">{p.mode}</td>
                    <td className="p-4 font-mono text-slate-400">{p.date}</td>
                    <td className="p-4"><StatusBadge status={p.status} /></td>
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
