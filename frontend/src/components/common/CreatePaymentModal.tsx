import React, { useState } from 'react';
import { CreditCard, Save, X } from 'lucide-react';

interface CreatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPayment: any) => void;
}

export const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [ref, setRef] = useState(`PAY-2025-${Math.floor(10000 + Math.random() * 90000)}`);
  const [invoice, setInvoice] = useState('');
  const [vendor, setVendor] = useState('');
  const [dept, setDept] = useState('');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('NEFT');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('PAID');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayment = {
      id: String(Date.now()),
      ref,
      invoice: invoice || 'INV-2025-001',
      vendor: vendor || 'Vendor Partner',
      dept: dept || 'General Operations',
      amount: parseFloat(amount) || 0,
      mode,
      date,
      status
    };
    onSuccess(newPayment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Process Payment Disbursement</h3>
              <p className="text-xs text-slate-400">Record company treasury payment &amp; settlement</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Payment Ref #</label>
              <input
                type="text"
                required
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Invoice Ref #</label>
              <input
                type="text"
                required
                placeholder="e.g. INV-2025-001"
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Vendor / Payee Entity</label>
            <input
              type="text"
              required
              placeholder="e.g. Apex Infra Ltd"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Department / Division</label>
            <input
              type="text"
              required
              placeholder="e.g. Public Works &amp; Infrastructure"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Disbursement Amount (₹)</label>
              <input
                type="number"
                required
                placeholder="e.g. 500000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Payment Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                <option value="IMPS">IMPS</option>
                <option value="DIRECT_TRANSFER">DIRECT_TRANSFER</option>
                <option value="CHEQUE">CHEQUE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Disbursement Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                <option value="FLAGGED">FLAGGED</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold hover:bg-slate-700">
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
