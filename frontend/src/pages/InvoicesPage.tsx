import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { Invoice } from '../types';
import { useTenant } from '../context/TenantContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { UploadInvoiceModal } from '../components/common/UploadInvoiceModal';
import { FileText, Plus, Search, Filter, AlertTriangle, CheckCircle, Upload, FolderPlus } from 'lucide-react';

export const InvoicesPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (currentTenant.tenantCode === 'GOV-KA') {
        try {
          const res = await apiClient.get('/invoices');
          if (res.data.success) {
            setInvoices(res.data.data.content || []);
          }
        } catch (e) {
          console.error("Failed to load invoices", e);
        }
      } else {
        const saved = localStorage.getItem(`invoices_${currentTenant.tenantCode}`);
        setInvoices(saved ? JSON.parse(saved) : []);
      }
      setLoading(false);
    };
    fetchInvoices();
  }, [currentTenant]);

  const handleInvoiceSuccess = (newInvoice: any) => {
    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    if (currentTenant.tenantCode !== 'GOV-KA') {
      localStorage.setItem(`invoices_${currentTenant.tenantCode}`, JSON.stringify(updated));
    }
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Upload Modal */}
      <UploadInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleInvoiceSuccess}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-500" /> {currentTenant.name} — Invoices &amp; OCR
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage vendor invoices, submit document uploads, and review automated AI duplicate checks</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" /> Upload &amp; Scan Invoice (AI OCR)
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {filteredInvoices.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FolderPlus className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-xs text-slate-400">
                No invoices submitted yet for <strong>{currentTenant.name}</strong>. Click "Upload &amp; Scan Invoice" to process your first bill.
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Invoice No.</th>
                  <th className="p-4">Vendor Entity</th>
                  <th className="p-4">PO Link</th>
                  <th className="p-4">Billing Amount (₹)</th>
                  <th className="p-4">AI Risk Score</th>
                  <th className="p-4">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-400">{inv.invoiceNumber}</td>
                    <td className="p-4 text-white">{inv.vendorName}</td>
                    <td className="p-4 font-mono text-slate-400">{inv.poNumber || 'N/A'}</td>
                    <td className="p-4 font-bold text-emerald-400">₹{inv.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4"><RiskBadge level={inv.riskLevel} score={inv.riskScore} /></td>
                    <td className="p-4"><StatusBadge status={inv.status} /></td>
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
