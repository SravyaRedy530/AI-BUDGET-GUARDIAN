import React, { useState } from 'react';
import { X, DollarSign, Star, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ContractorPenaltyModalProps {
  contractor: any | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedContractor: any) => void;
}

export const ContractorPenaltyModal: React.FC<ContractorPenaltyModalProps> = ({ contractor, isOpen, onClose, onSuccess }) => {
  const [penaltyAmount, setPenaltyAmount] = useState(50000);
  const [newRating, setNewRating] = useState(contractor?.rating || 3.5);
  const [reason, setReason] = useState('Delay in project milestone completion');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !contractor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const addedPenalty = Number(penaltyAmount) || 0;
      const updatedPenalties = (contractor.penalties || 0) + addedPenalty;
      const updatedRating = Number(newRating);
      const isHighRisk = updatedRating < 3.0 || updatedPenalties > 500000;

      const updated = {
        ...contractor,
        penalties: updatedPenalties,
        rating: updatedRating,
        delayed: addedPenalty > 0 ? (contractor.delayed || 0) + 1 : contractor.delayed,
        riskLevel: isHighRisk ? 'HIGH' : updatedRating < 4.2 ? 'MEDIUM' : 'LOW',
        riskScore: isHighRisk ? 85.0 : updatedRating < 4.2 ? 38.0 : 14.0
      };

      setLoading(false);
      onSuccess(updated);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Assess Penalty &amp; Rate Contractor</h2>
              <p className="text-xs text-slate-400">{contractor.company}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Penalty Assessment Amount (₹)</label>
            <input
              type="number"
              step="10000"
              value={penaltyAmount}
              onChange={(e) => setPenaltyAmount(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-500">Current Accumulated Penalty: ₹{(contractor.penalties || 0).toLocaleString('en-IN')}</p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Updated Performance Rating (1.0 - 5.0)</label>
            <input
              type="number"
              step="0.1"
              min="1.0"
              max="5.0"
              value={newRating}
              onChange={(e) => setNewRating(parseFloat(e.target.value) || 3.5)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Reason / Milestone Observation</label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
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
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-600/30 flex items-center gap-2"
            >
              {loading ? 'Updating...' : 'Save Penalty & Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
