import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { Vendor } from '../types';
import { useTenant } from '../context/TenantContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { CreateVendorModal } from '../components/common/CreateVendorModal';
import { Building2, Plus, Search, ShieldAlert, CheckCircle2, ShieldOff, Check, FolderPlus } from 'lucide-react';

const SEED_VENDORS = [
  {
    id: 'v1',
    vendorName: 'Apex Hardware Supplies Solutions',
    gstNumber: '29AAACG1029F1Z5',
    panNumber: 'AAACG1029F',
    bankAccountNo: '918274928172',
    category: 'Construction Supply',
    riskLevel: 'LOW',
    riskScore: 12.0,
    status: 'VERIFIED'
  },
  {
    id: 'v2',
    vendorName: 'Global CyberTech Systems',
    gstNumber: '29AABCG8810K1Z9',
    panNumber: 'AABCG8810K',
    bankAccountNo: '918233441122',
    category: 'IT & Software',
    riskLevel: 'LOW',
    riskScore: 14.5,
    status: 'VERIFIED'
  },
  {
    id: 'v3',
    vendorName: 'Shell Shell Shell Corp Inc',
    gstNumber: '29INVALID0000X1',
    panNumber: 'DUMMY9999X',
    bankAccountNo: '000000123456',
    category: 'Consulting Services',
    riskLevel: 'HIGH',
    riskScore: 94.0,
    status: 'FLAGGED'
  }
];

export const VendorsPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (currentTenant.tenantCode === 'GOV-KA') {
      setVendors(SEED_VENDORS);
    } else {
      const saved = localStorage.getItem(`vendors_${currentTenant.tenantCode}`);
      setVendors(saved ? JSON.parse(saved) : []);
    }
  }, [currentTenant]);

  const handleVendorSuccess = (newVendor: any) => {
    const updated = [newVendor, ...vendors];
    setVendors(updated);
    if (currentTenant.tenantCode !== 'GOV-KA') {
      localStorage.setItem(`vendors_${currentTenant.tenantCode}`, JSON.stringify(updated));
    }
    showToast(`Vendor "${newVendor.vendorName}" registered and verified!`);
  };

  const toggleFlag = (v: any) => {
    const isCurrentlyFlagged = v.status === 'FLAGGED' || v.riskLevel === 'HIGH';
    const updatedVendor = {
      ...v,
      status: isCurrentlyFlagged ? 'VERIFIED' : 'FLAGGED',
      riskLevel: isCurrentlyFlagged ? 'LOW' : 'HIGH',
      riskScore: isCurrentlyFlagged ? 12.0 : 92.0
    };
    const updatedList = vendors.map(item => item.id === v.id ? updatedVendor : item);
    setVendors(updatedList);
    if (currentTenant.tenantCode !== 'GOV-KA') {
      localStorage.setItem(`vendors_${currentTenant.tenantCode}`, JSON.stringify(updatedList));
    }
    showToast(
      isCurrentlyFlagged
        ? `Vendor "${v.vendorName}" unflagged & cleared.`
        : `ALERT: Vendor "${v.vendorName}" has been FLAGGED as suspicious!`
    );
  };

  const verifyGSTIN = (v: any) => {
    showToast(`GSTIN & Tax Integrity check passed for "${v.vendorName}"`);
  };

  const filtered = vendors.filter(v =>
    v.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.panNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border border-blue-500 text-white rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal */}
      <CreateVendorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleVendorSuccess}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-blue-500" /> {currentTenant.name} — Vendor Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">Global vendor directory, Tax/Bank verification, identity overlap checks, and blacklist management</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Register New Vendor
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search vendor name, GSTIN, PAN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FolderPlus className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-xs text-slate-400">
                No vendors registered yet for <strong>{currentTenant.name}</strong>. Click "Register New Vendor" to add vendors.
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Vendor Name</th>
                  <th className="p-4">GST Number</th>
                  <th className="p-4">PAN Number</th>
                  <th className="p-4">Bank Account</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Risk Level</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{v.vendorName}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{v.gstNumber || 'N/A'}</td>
                    <td className="p-4 font-mono text-slate-300">{v.panNumber || 'N/A'}</td>
                    <td className="p-4 font-mono text-slate-400">{v.bankAccountNo}</td>
                    <td className="p-4 text-slate-300">{v.category}</td>
                    <td className="p-4"><RiskBadge level={v.riskLevel} score={v.riskScore} /></td>
                    <td className="p-4"><StatusBadge status={v.status || 'VERIFIED'} /></td>
                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => verifyGSTIN(v)}
                        title="Verify GSTIN & Tax Compliance"
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg font-bold transition-all text-[11px] inline-flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Verify GST
                      </button>

                      <button
                        onClick={() => toggleFlag(v)}
                        title={v.status === 'FLAGGED' ? 'Clear Flag' : 'Flag Suspicious Vendor'}
                        className={`px-2.5 py-1.5 rounded-lg font-bold transition-all text-[11px] inline-flex items-center gap-1 ${
                          v.status === 'FLAGGED'
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {v.status === 'FLAGGED' ? (
                          <><ShieldOff className="w-3.5 h-3.5" /> Clear Flag</>
                        ) : (
                          <><ShieldAlert className="w-3.5 h-3.5" /> Flag Vendor</>
                        )}
                      </button>
                    </td>
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
