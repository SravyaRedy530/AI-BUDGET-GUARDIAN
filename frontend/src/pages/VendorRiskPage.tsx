import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertOctagon, FolderPlus } from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import { useTenant } from '../context/TenantContext';

export const VendorRiskPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const [shellClusters, setShellClusters] = useState<any[]>([]);

  useEffect(() => {
    if (currentTenant.tenantCode === 'GOV-KA') {
      setShellClusters([
        {
          primaryVendor: 'Shadow Infra Solutions (Shell Vendor 1)',
          linkedVendor: 'Phantom Traders (Shell Vendor 2)',
          riskLevel: 'CRITICAL',
          riskScore: 94.0,
          sharedBank: '999000111222 (State Bank of India)',
          sharedAddress: 'Suite 101, Fake Commercial Complex, Mumbai',
          impact: 'High-risk synthetic vendor cluster with identical bank account and registered office address.'
        }
      ]);
    } else {
      const saved = localStorage.getItem(`vendor_risks_${currentTenant.tenantCode}`);
      setShellClusters(saved ? JSON.parse(saved) : []);
    }
  }, [currentTenant]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-rose-500" /> {currentTenant.name} — Vendor Identity Overlap &amp; Shell Company Detection
        </h1>
        <p className="text-xs text-slate-400 mt-1">Graph identity analysis detecting shared bank accounts, addresses, duplicate GSTs, and blacklisted entities</p>
      </div>

      <div className="space-y-6">
        {shellClusters.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3 shadow-xl">
            <FolderPlus className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-xs text-slate-400">
              No shell company clusters or identity overlaps detected for <strong>{currentTenant.name}</strong>. All registered vendors match verified corporate credentials.
            </div>
          </div>
        ) : (
          shellClusters.map((cluster, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-400 rounded-xl">
                    <AlertOctagon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Fake Vendor Cluster Detected</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{cluster.impact}</p>
                  </div>
                </div>
                <RiskBadge level="CRITICAL" score={cluster.riskScore} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">Entity A</span>
                  <p className="font-bold text-white text-sm">{cluster.primaryVendor}</p>
                  <span className="text-slate-400 block font-mono">Bank: {cluster.sharedBank}</span>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">Entity B (Identical Credentials)</span>
                  <p className="font-bold text-white text-sm">{cluster.linkedVendor}</p>
                  <span className="text-slate-400 block font-mono">Address: {cluster.sharedAddress}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
