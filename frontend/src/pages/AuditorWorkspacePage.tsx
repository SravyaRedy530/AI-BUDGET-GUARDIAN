import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { FraudCase, AIPrediction } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { AIExplanationCard } from '../components/common/AIExplanationCard';
import { ExportReportModal } from '../components/common/ExportReportModal';
import { AlertTriangle, FileSearch, CheckCircle2, Download } from 'lucide-react';

export const AuditorWorkspacePage: React.FC = () => {
  const [cases, setCases] = useState<FraudCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<FraudCase | null>(null);
  const [explanation, setExplanation] = useState<AIPrediction | null>(null);
  const [findingsText, setFindingsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await apiClient.get('/cases');
        if (res.data.success) {
          const list = res.data.data.content || [];
          setCases(list);
          if (list.length > 0) {
            setSelectedCase(list[0]);
            setFindingsText(list[0].findings || '');
            loadExplanationForCase(list[0]);
          }
        }
      } catch (e) {
        console.error("Failed to load fraud cases", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const loadExplanationForCase = async (fc: FraudCase) => {
    try {
      const res = await apiClient.get('/ai/explain/INVOICE/e3333333-3333-3333-3333-333333333333');
      if (res.data.success) {
        setExplanation(res.data.data);
      }
    } catch (e) {
      console.error("Failed to load explanation for case", e);
    }
  };

  const handleSelectCase = (fc: FraudCase) => {
    setSelectedCase(fc);
    setFindingsText(fc.findings || '');
    loadExplanationForCase(fc);
  };

  return (
    <div className="space-y-6">
      {/* Export Audit Report Modal */}
      <ExportReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-amber-500" /> Auditor Investigation Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review AI fraud alerts, inspect evidence files, analyze SHAP explanations, and record official audit findings</p>
        </div>
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Case Audit Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-blue-400" /> Investigation Queue ({cases.length})
          </h3>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {cases.map((fc) => (
              <div
                key={fc.id}
                onClick={() => handleSelectCase(fc)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCase?.id === fc.id
                    ? 'bg-blue-950/50 border-blue-600 shadow-md shadow-blue-600/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">{fc.caseNumber}</span>
                  <RiskBadge level={fc.severity} />
                </div>
                <h4 className="text-xs font-bold text-slate-300 mt-2">{fc.alertTitle || 'Suspicious Financial Transaction'}</h4>
                <div className="flex items-center justify-between mt-3 text-[11px]">
                  <span className="text-slate-400">{fc.vendorName || 'MedLife Pharma'}</span>
                  <StatusBadge status={fc.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedCase && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-400">{selectedCase.caseNumber}</span>
                  <h2 className="text-lg font-extrabold text-white mt-1">{selectedCase.alertTitle || 'Investigating Potential Duplicate Billing'}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Assigned Auditor: <strong className="text-slate-200">{selectedCase.assignedAuditorName || 'Lead Auditor'}</strong></p>
                </div>
                <StatusBadge status={selectedCase.status} />
              </div>

              {explanation && <AIExplanationCard prediction={explanation} />}

              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Official Auditor Findings &amp; Evidence Remarks</label>
                <textarea
                  rows={4}
                  value={findingsText}
                  onChange={(e) => setFindingsText(e.target.value)}
                  placeholder="Record formal investigation notes, verified invoice records, and evidence findings..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all">
                    Save Draft Findings
                  </button>
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Close Case &amp; Submit Audit Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
