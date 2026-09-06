import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, FolderPlus } from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';
import { useTenant } from '../context/TenantContext';

export const DuplicateDetectionPage: React.FC = () => {
  const { currentTenant } = useTenant();
  const [duplicateMatches, setDuplicateMatches] = useState<any[]>([]);

  useEffect(() => {
    if (currentTenant.tenantCode === 'GOV-KA') {
      setDuplicateMatches([
        {
          targetInvoice: 'INV-MED-8899-DUP',
          matchingInvoice: 'INV-MED-8899',
          vendor: 'MedLife Pharma Supplies',
          amount: 2500000.00,
          similarityScore: 96.5,
          submissionGapDays: 3,
          confidence: 0.98,
          status: 'FLAGGED_BLOCKED',
          reasons: [
            'Invoice number string matches INV-MED-8899 by 92% Levenshtein ratio.',
            'Exact match on transaction monetary value (₹2,500,000.00).',
            'Submitted within 3 days of original payment authorization.'
          ]
        }
      ]);
    } else {
      const saved = localStorage.getItem(`duplicates_${currentTenant.tenantCode}`);
      setDuplicateMatches(saved ? JSON.parse(saved) : []);
    }
  }, [currentTenant]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Search className="w-7 h-7 text-blue-500" /> {currentTenant.name} — AI Duplicate Invoice Interception Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">Rule-based matching, fuzzy text distance comparison, and duplicate billing prevention telemetry</p>
      </div>

      <div className="space-y-6">
        {duplicateMatches.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3 shadow-xl">
            <FolderPlus className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-xs text-slate-400">
              No duplicate invoice anomalies intercepted yet for <strong>{currentTenant.name}</strong>. Real-time AI scanning actively monitors all submitted invoices.
            </div>
          </div>
        ) : (
          duplicateMatches.map((match, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-400 rounded-xl">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Duplicate Match Identified: {match.targetInvoice}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Matched Target Entity: <strong className="text-blue-400">{match.matchingInvoice}</strong></p>
                  </div>
                </div>
                <RiskBadge level="CRITICAL" score={match.similarityScore} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Vendor Entity</span>
                  <span className="font-bold text-slate-200 mt-1 block">{match.vendor}</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Transaction Value</span>
                  <span className="font-bold text-emerald-400 mt-1 block">₹{Number(match.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px]">Submission Interval</span>
                  <span className="font-bold text-amber-400 mt-1 block">{match.submissionGapDays} days apart</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Matched Fingerprint Factors</h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  {match.reasons?.map((r: string, rIdx: number) => (
                    <li key={rIdx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
