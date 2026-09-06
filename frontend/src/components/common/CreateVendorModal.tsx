import React, { useState } from 'react';
import { X, Building2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CreateVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newVendor: any) => void;
}

export const CreateVendorModal: React.FC<CreateVendorModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [vendorName, setVendorName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [category, setCategory] = useState('IT & Software Equipment');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName.trim()) {
      setError('Vendor name is required');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newVendor = {
        id: 'vnd-' + Date.now(),
        vendorName,
        gstNumber: gstNumber || '29AAAAA' + Math.floor(1000 + Math.random() * 9000) + '1Z1',
        panNumber: panNumber || 'AAAAA' + Math.floor(1000 + Math.random() * 9000) + 'A',
        bankAccountNo: bankAccountNo || '9182' + Math.floor(10000000 + Math.random() * 90000000),
        ifscCode: ifscCode || 'SBIN0001824',
        category,
        riskLevel: 'LOW',
        riskScore: 10.0,
        status: 'VERIFIED'
      };
      setLoading(false);
      onSuccess(newVendor);
      onClose();
      setVendorName('');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Register New Vendor</h2>
              <p className="text-xs text-slate-400">Verify Tax, GSTIN, and Banking Information</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Vendor Enterprise Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Tech Solutions Pvt Ltd"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">GSTIN Number</label>
              <input
                type="text"
                placeholder="29AAAAA1234A1Z1"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">PAN Card Number</label>
              <input
                type="text"
                placeholder="ABCDE1234F"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Bank Account Number</label>
              <input
                type="text"
                placeholder="918237492817"
                value={bankAccountNo}
                onChange={(e) => setBankAccountNo(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">IFSC Code</label>
              <input
                type="text"
                placeholder="SBIN0001824"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Procurement Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="IT & Software Equipment">IT &amp; Software Equipment</option>
              <option value="Construction & Building Supply">Construction &amp; Building Supply</option>
              <option value="Office Equipment & Hardware">Office Equipment &amp; Hardware</option>
              <option value="Consulting & Audit Services">Consulting &amp; Audit Services</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              {loading ? 'Registering...' : 'Register Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
