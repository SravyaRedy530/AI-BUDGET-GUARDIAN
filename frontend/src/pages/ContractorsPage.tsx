import React, { useEffect, useState } from 'react';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { CreateContractorModal } from '../components/common/CreateContractorModal';
import { ContractorDetailsModal } from '../components/common/ContractorDetailsModal';
import { ContractorPenaltyModal } from '../components/common/ContractorPenaltyModal';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { Briefcase, Star, Plus, Eye, ShieldAlert, DollarSign, Search, CheckCircle2, ShieldOff, FolderPlus } from 'lucide-react';

const SEED_CONTRACTORS = [
  {
    id: '1',
    company: 'Apex Highway Infra Corp',
    gstin: '29AAACG1029F1Z5',
    category: 'Civil Infrastructure',
    totalProjects: 14,
    completed: 12,
    delayed: 2,
    cancelled: 0,
    penalties: 150000.00,
    rating: 4.8,
    riskLevel: 'LOW',
    riskScore: 12.5,
    status: 'ACTIVE',
    projectsList: [
      { name: 'State Highway Expansion Phase-II', budget: '₹12.50 Cr', status: 'Completed', progress: 100 },
      { name: 'District Flyover Overpass', budget: '₹6.80 Cr', status: 'Completed', progress: 100 },
      { name: 'National Bypass Ringroad Link', budget: '₹18.40 Cr', status: 'Delayed', progress: 80 }
    ]
  },
  {
    id: '2',
    company: 'Global CyberTech Systems',
    gstin: '29AABCG8810K1Z9',
    category: 'IT & Cyber Infrastructure',
    totalProjects: 8,
    completed: 7,
    delayed: 1,
    cancelled: 0,
    penalties: 0.00,
    rating: 4.9,
    riskLevel: 'LOW',
    riskScore: 15.0,
    status: 'ACTIVE',
    projectsList: [
      { name: 'Treasury ERP Cloud Migration', budget: '₹3.20 Cr', status: 'Completed', progress: 100 },
      { name: 'Govt Portal Security Hardening', budget: '₹1.50 Cr', status: 'In Progress', progress: 90 }
    ]
  },
  {
    id: '3',
    company: 'Shadow Infra Solutions',
    gstin: '29AACCS4490P1Z2',
    category: 'Urban Transport & Grid',
    totalProjects: 3,
    completed: 1,
    delayed: 1,
    cancelled: 1,
    penalties: 850000.00,
    rating: 2.1,
    riskLevel: 'HIGH',
    riskScore: 88.5,
    status: 'BLACKLISTED',
    projectsList: [
      { name: 'Metro Corridor Substation', budget: '₹9.40 Cr', status: 'Cancelled', progress: 25 },
      { name: 'Feeder Bus Station Terminal', budget: '₹2.10 Cr', status: 'Delayed', progress: 40 }
    ]
  }
];

export const ContractorsPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const { currentTenant } = useTenant();

  const [contractors, setContractors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'RISK'>('ALL');
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<any | null>(null);
  const [penaltyTarget, setPenaltyTarget] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    if (currentTenant.tenantCode === 'GOV-KA') {
      setContractors(SEED_CONTRACTORS);
    } else {
      const saved = localStorage.getItem(`contractors_${currentTenant.tenantCode}`);
      setContractors(saved ? JSON.parse(saved) : []);
    }
  }, [currentTenant]);

  const handleCreateSuccess = (newContractor: any) => {
    const updated = [newContractor, ...contractors];
    setContractors(updated);
    if (currentTenant.tenantCode !== 'GOV-KA') {
      localStorage.setItem(`contractors_${currentTenant.tenantCode}`, JSON.stringify(updated));
    }
    showToast(`Contractor "${newContractor.company}" registered for ${currentTenant.name}!`);
  };

  const handlePenaltySuccess = (updatedContractor: any) => {
    const updated = contractors.map(c => c.id === updatedContractor.id ? updatedContractor : c);
    setContractors(updated);
    if (currentTenant.tenantCode !== 'GOV-KA') {
      localStorage.setItem(`contractors_${currentTenant.tenantCode}`, JSON.stringify(updated));
    }
    showToast(`Updated performance ratings & penalties for "${updatedContractor.company}"`);
  };

  const toggleBlacklist = (c: any) => {
    const isCurrentlyBlacklisted = c.status === 'BLACKLISTED' || c.riskLevel === 'HIGH';
    const updatedContractor = {
      ...c,
      status: isCurrentlyBlacklisted ? 'ACTIVE' : 'BLACKLISTED',
      riskLevel: isCurrentlyBlacklisted ? 'LOW' : 'HIGH',
      riskScore: isCurrentlyBlacklisted ? 18.0 : 92.5
    };
    const updatedList = contractors.map(item => item.id === c.id ? updatedContractor : item);
    setContractors(updatedList);
    if (currentTenant.tenantCode !== 'GOV-KA') {
      localStorage.setItem(`contractors_${currentTenant.tenantCode}`, JSON.stringify(updatedList));
    }
    showToast(
      isCurrentlyBlacklisted 
        ? `Contractor "${c.company}" reinstated to Active status.` 
        : `ALERT: Contractor "${c.company}" has been BLACKLISTED and flagged across system.`
    );
  };

  const filtered = contractors.filter(c => {
    const matchesSearch = c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.category?.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'ACTIVE') return matchesSearch && c.status === 'ACTIVE';
    if (activeTab === 'RISK') return matchesSearch && (c.riskLevel === 'HIGH' || c.status === 'BLACKLISTED');
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border border-blue-500 text-white rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <CreateContractorModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <ContractorDetailsModal
        contractor={selectedDetails}
        onClose={() => setSelectedDetails(null)}
      />

      <ContractorPenaltyModal
        contractor={penaltyTarget}
        isOpen={!!penaltyTarget}
        onClose={() => setPenaltyTarget(null)}
        onSuccess={handlePenaltySuccess}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-blue-500" /> {currentTenant.name} — Contractor Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track project success rates, delay histories, financial penalties, rating assessments, and AI risk scoring</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Register New Contractor
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search contractor company or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            All ({contractors.length})
          </button>
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'ACTIVE' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Active ({contractors.filter(c => c.status === 'ACTIVE').length})
          </button>
          <button
            onClick={() => setActiveTab('RISK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'RISK' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            High Risk / Blacklisted ({contractors.filter(c => c.riskLevel === 'HIGH' || c.status === 'BLACKLISTED').length})
          </button>
        </div>
      </div>

      {/* Contractors Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <FolderPlus className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-xs text-slate-400">
                No contractors registered yet for <strong>{currentTenant.name}</strong>. Click "Register New Contractor" to add contractors.
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Contractor Company</th>
                  <th className="p-4">Total Projects</th>
                  <th className="p-4">Completed</th>
                  <th className="p-4">Delayed / Cancelled</th>
                  <th className="p-4">Penalties (₹)</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">AI Risk Score</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <div>{c.company}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{c.category}</div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-200">{c.totalProjects}</td>
                    <td className="p-4 font-mono text-emerald-400">{c.completed}</td>
                    <td className="p-4 font-mono text-amber-400">{c.delayed} / {c.cancelled}</td>
                    <td className="p-4 font-mono text-rose-400">₹{c.penalties.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{c.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-4"><RiskBadge level={c.riskLevel as any} score={c.riskScore} /></td>
                    <td className="p-4"><StatusBadge status={c.status || 'ACTIVE'} /></td>
                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedDetails(c)}
                        title="View Projects & Audit Details"
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg font-bold transition-all text-[11px] inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>

                      <button
                        onClick={() => setPenaltyTarget(c)}
                        title="Assess Penalty & Update Rating"
                        className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg font-bold transition-all text-[11px] inline-flex items-center gap-1"
                      >
                        <DollarSign className="w-3.5 h-3.5" /> Penalty
                      </button>

                      <button
                        onClick={() => toggleBlacklist(c)}
                        title={c.status === 'BLACKLISTED' ? 'Reinstate Contractor' : 'Blacklist Contractor'}
                        className={`px-2.5 py-1.5 rounded-lg font-bold transition-all text-[11px] inline-flex items-center gap-1 ${
                          c.status === 'BLACKLISTED'
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {c.status === 'BLACKLISTED' ? (
                          <><ShieldOff className="w-3.5 h-3.5" /> Reinstate</>
                        ) : (
                          <><ShieldAlert className="w-3.5 h-3.5" /> Blacklist</>
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
