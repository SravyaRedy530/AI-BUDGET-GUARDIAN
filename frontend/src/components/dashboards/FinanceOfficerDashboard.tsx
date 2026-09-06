import React, { useState, useEffect } from 'react';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { UploadInvoiceModal } from '../common/UploadInvoiceModal';
import { CreatePOModal } from '../common/CreatePOModal';
import { apiClient } from '../../api/client';
import { Invoice } from '../../types';
import { CreditCard, FileCheck, FileText, Plus, Upload, CheckCircle, AlertTriangle } from 'lucide-react';

export const FinanceOfficerDashboard: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await apiClient.get('/invoices');
        if (res.data.success) {
          setInvoices(res.data.data.content || []);
        }
      } catch (e) {
        console.error("Failed to load invoices", e);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const pendingInvoices = invoices.filter(i => i.paymentStatus === 'UNPAID');
  const paidInvoices = invoices.filter(i => i.paymentStatus === 'PAID');
  const totalBilled = invoices.reduce((acc, i) => acc + (i.amount || 0), 0);
  const totalPaid = paidInvoices.reduce((acc, i) => acc + (i.amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Modals */}
      <UploadInvoiceModal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} onSuccess={(inv) => setInvoices([inv, ...invoices])} />
      <CreatePOModal isOpen={isPOModalOpen} onClose={() => setIsPOModalOpen(false)} onSuccess={() => {}} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            💳 Finance Officer Operational Console
            <span className="text-xs font-mono font-bold bg-emerald-950/80 border border-emerald-800 text-emerald-400 px-2.5 py-0.5 rounded-full">
              FINANCE &amp; PROCUREMENT
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Invoice OCR ingestion, automated duplicate checks, PO creation, and payment disbursement authorization</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPOModalOpen(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <FileCheck className="w-4 h-4 text-blue-400" /> Issue Purchase Order
          </button>
          <button
            onClick={() => setIsInvoiceModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload PDF / Submit Invoice
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Invoices Billed"
          value={`₹${(totalBilled / 100000).toFixed(2)} Lakhs`}
          subtitle={`Total Volume: ${invoices.length}`}
          icon={FileText}
          color="blue"
        />
        <MetricCard
          title="Disbursed / Paid Amount"
          value={`₹${(totalPaid / 100000).toFixed(2)} Lakhs`}
          subtitle={`Completed Disbursements: ${paidInvoices.length}`}
          icon={CreditCard}
          color="emerald"
        />
        <MetricCard
          title="Pending Approval Queue"
          value={pendingInvoices.length}
          subtitle="Awaiting Verification"
          icon={AlertTriangle}
          color="amber"
        />
        <MetricCard
          title="AI Interception Rate"
          value="98.4%"
          subtitle="Duplicate &amp; Overpay Filter"
          icon={CheckCircle}
          color="purple"
        />
      </div>

      {/* Recent Invoices Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-xs text-white uppercase tracking-wider flex items-center justify-between">
          <span>Recent Vendor Invoices Pending Finance Action</span>
          <span className="text-slate-400 font-mono">Showing {invoices.length} Invoices</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Vendor</th>
                <th className="p-4">Department</th>
                <th className="p-4">Amount (₹)</th>
                <th className="p-4">AI Duplicate Prob %</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-500">Loading invoices...</td></tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="p-4 text-slate-200">{inv.vendorName}</td>
                    <td className="p-4 text-slate-400">{inv.departmentName}</td>
                    <td className="p-4 font-bold text-slate-100">₹{inv.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4">
                      {inv.duplicateFlag ? (
                        <RiskBadge level="CRITICAL" score={inv.duplicateProbability} />
                      ) : (
                        <span className="text-emerald-400 font-semibold">{inv.duplicateProbability?.toFixed(1)}%</span>
                      )}
                    </td>
                    <td className="p-4"><StatusBadge status={inv.approvalStatus} /></td>
                    <td className="p-4"><StatusBadge status={inv.paymentStatus} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
