import React from 'react';
import { X, Briefcase, Star, AlertTriangle, ShieldCheck, CheckCircle2, DollarSign, Activity } from 'lucide-react';
import { RiskBadge } from './RiskBadge';

interface ContractorDetailsModalProps {
  contractor: any | null;
  onClose: () => void;
}

export const ContractorDetailsModal: React.FC<ContractorDetailsModalProps> = ({ contractor, onClose }) => {
  if (!contractor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {contractor.company}
              </h2>
              <p className="text-xs text-slate-400 font-mono">GSTIN: {contractor.gstin || '29AAACG9921Z5'} | Domain: {contractor.category || 'Infrastructure'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium">Total Projects</span>
            <div className="text-lg font-mono font-bold text-white">{contractor.totalProjects}</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium">Completed</span>
            <div className="text-lg font-mono font-bold text-emerald-400">{contractor.completed}</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium">Delayed / Cancelled</span>
            <div className="text-lg font-mono font-bold text-amber-400">{contractor.delayed} / {contractor.cancelled}</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium">Penalties (₹)</span>
            <div className="text-lg font-mono font-bold text-rose-400">
              ₹{(contractor.penalties || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Rating and AI Risk Score */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-amber-400 text-base font-bold bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{contractor.rating?.toFixed(1) || '4.5'} / 5.0 Rating</span>
            </div>
            <span className="text-xs text-slate-400">Verified by Audit Rating Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">AI Risk Level:</span>
            <RiskBadge level={contractor.riskLevel || 'LOW'} score={contractor.riskScore || 15.0} />
          </div>
        </div>

        {/* Ongoing Projects & Audit Records */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" /> Infrastructure Projects &amp; Milestones
          </h3>
          <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800 text-xs">
            {(contractor.projectsList || [
              { name: 'State Highway Expansion Phase-II', budget: '₹12.50 Cr', status: 'Completed', progress: 100 },
              { name: 'District Hospital Wing Construction', budget: '₹4.80 Cr', status: 'Delayed', progress: 75 },
              { name: 'Smart City Solar Streetlight Installation', budget: '₹2.10 Cr', status: 'In Progress', progress: 60 },
            ]).map((proj: any, idx: number) => (
              <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-900/50">
                <div>
                  <h4 className="font-bold text-white">{proj.name}</h4>
                  <span className="text-slate-400 font-mono">Budget: {proj.budget}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg font-bold font-mono ${
                    proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    proj.status === 'Delayed' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {proj.status} ({proj.progress}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
