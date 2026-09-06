import React, { useState } from 'react';
import { X, Briefcase, Star, AlertCircle, ShieldAlert, DollarSign } from 'lucide-react';

interface CreateContractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newContractor: any) => void;
}

export const CreateContractorModal: React.FC<CreateContractorModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [company, setCompany] = useState('');
  const [gstin, setGstin] = useState('');
  const [category, setCategory] = useState('Civil Infrastructure');
  const [totalProjects, setTotalProjects] = useState(1);
  const [rating, setRating] = useState(4.5);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) {
      setError('Contractor company name is required');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const created = {
        id: 'cnt-' + Date.now(),
        company,
        gstin: gstin || '29AAACG' + Math.floor(1000 + Math.random() * 9000) + '1Z5',
        category,
        totalProjects: Number(totalProjects),
        completed: Number(totalProjects),
        delayed: 0,
        cancelled: 0,
        penalties: 0,
        rating: Number(rating),
        riskLevel: rating < 3.0 ? 'HIGH' : rating < 4.2 ? 'MEDIUM' : 'LOW',
        riskScore: rating < 3.0 ? 78.5 : rating < 4.2 ? 35.0 : 12.0,
        status: 'ACTIVE',
        projectsList: [
          { name: 'Initial Infrastructure Contract', budget: '₹1.50 Cr', status: 'In Progress', progress: 40 }
        ]
      };
      setLoading(false);
      onSuccess(created);
      onClose();
      setCompany('');
      setGstin('');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Register New Contractor</h2>
              <p className="text-xs text-slate-400">Add contractor company for infrastructure and procurement monitoring</p>
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
            <label className="font-semibold text-slate-300">Contractor Company Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Infra & Power Solutions"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">GSTIN / Business Reg No.</label>
              <input
                type="text"
                placeholder="29ABCDE1234F1Z5"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Industry / Domain</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="Civil Infrastructure">Civil Infrastructure</option>
                <option value="IT & Cyber Solutions">IT &amp; Cyber Solutions</option>
                <option value="Energy & Power Grid">Energy &amp; Power Grid</option>
                <option value="Urban Mobility & Transport">Urban Mobility &amp; Transport</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Initial Project Count</label>
              <input
                type="number"
                min="1"
                value={totalProjects}
                onChange={(e) => setTotalProjects(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Initial Rating (1.0 - 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value) || 4.5)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
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
              {loading ? 'Registering...' : 'Confirm Contractor Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
