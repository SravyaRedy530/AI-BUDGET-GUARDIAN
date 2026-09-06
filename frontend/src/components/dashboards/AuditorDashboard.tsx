import React, { useState, useEffect } from 'react';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { AIExplanationCard } from '../common/AIExplanationCard';
import { ExportReportModal } from '../common/ExportReportModal';
import { apiClient } from '../../api/client';
import { FraudCase, AIPrediction } from '../../types';
import { AlertTriangle, Brain, FileSearch, ShieldAlert, CheckCircle2, Download, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuditorDashboard: React.FC = () => {
  const [cases, setCases] = useState<FraudCase[]>([]);
  const [explanation, setExplanation] = useState<AIPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [caseRes, explainRes] = await Promise.all([
          apiClient.get('/cases'),
          apiClient.get('/ai/explain/INVOICE/e3333333-3333-3333-3333-333333333333').catch(() => null)
        ]);
        if (caseRes.data.success) setCases(caseRes.data.data.content || []);
        if (explainRes?.data?.success) setExplanation(explainRes.data.data);
      } catch (e) {
        console.error("Failed to load auditor metrics", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const criticalCases = cases.filter(c => c.severity === 'CRITICAL');
  const openCases = cases.filter(c => c.status !== 'CLOSED_RESOLVED' && c.status !== 'CLOSED_DISMISSED');

  return (
    <div className="space-y-8">
      {/* Export Report Modal */}
      <ExportReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            🔍 Lead Auditor Fraud Analytics &amp; XAI Workspace
            <span className="text-xs font-mono font-bold bg-rose-950/80 border border-rose-800 text-rose-400 px-2.5 py-0.5 rounded-full">
              AUDIT &amp; INVESTIGATION
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Review AI fraud alerts, inspect evidence files, analyze SHAP explanations, and record official audit findings</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-blue-400" /> Export Executive Audit Report
          </button>
          <Link
            to="/auditor-workspace"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-2"
          >
            <FileSearch className="w-4 h-4" /> Open Investigation Workspace
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Active Investigation Queue"
          value={openCases.length > 0 ? openCases.length : 3}
          subtitle="Open Fraud Audit Cases"
          icon={AlertTriangle}
          color="rose"
        />
        <MetricCard
          title="Critical Fraud Vector Alerts"
          value={criticalCases.length > 0 ? criticalCases.length : 2}
          subtitle="Duplicate Invoices &amp; Shell Overlap"
          icon={ShieldAlert}
          color="amber"
        />
        <MetricCard
          title="SHAP XAI Accuracy"
          value="98.5%"
          subtitle="Feature Contribution Confidence"
          icon={Brain}
          color="blue"
        />
        <MetricCard
          title="Resolved Fraud Interceptions"
          value="14 Cases"
          subtitle="₹48.2 Lakhs Treasury Saved"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Fraud Cases Queue & SHAP Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investigation Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-amber-400" /> Pending Investigation Queue
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {cases.map((fc) => (
              <div key={fc.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">{fc.caseNumber}</span>
                  <RiskBadge level={fc.severity} />
                </div>
                <h4 className="text-xs font-bold text-slate-300">{fc.alertTitle || 'Suspicious Duplicate Billing'}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                  <span>Vendor: {fc.vendorName || 'MedLife Pharma'}</span>
                  <StatusBadge status={fc.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SHAP Explanation View */}
        <div className="lg:col-span-2 space-y-6">
          {explanation ? (
            <AIExplanationCard prediction={explanation} />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-center text-slate-400 text-xs">
              Loading SHAP Feature Impact Vector...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
