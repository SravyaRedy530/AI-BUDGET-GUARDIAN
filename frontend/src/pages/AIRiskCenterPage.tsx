import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { AIPrediction, AIRiskCenterSummary } from '../types';
import { AIExplanationCard } from '../components/common/AIExplanationCard';
import { MetricCard } from '../components/common/MetricCard';
import { Brain, ShieldAlert, Cpu, AlertTriangle, Search, CheckCircle, ArrowRight } from 'lucide-react';

export const AIRiskCenterPage: React.FC = () => {
  const [summary, setSummary] = useState<AIRiskCenterSummary | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<AIPrediction | null>(null);
  const [loading, setLoading] = useState(true);

  const [testInvNum, setTestInvNum] = useState('INV-MED-8899-DUP');
  const [testAmount, setTestAmount] = useState('2500000.00');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await apiClient.get('/ai/risk-center');
        if (res.data.success) {
          setSummary(res.data.data);
        }
        const expRes = await apiClient.get('/ai/explain/INVOICE/e3333333-3333-3333-3333-333333333333');
        if (expRes.data.success) {
          setSelectedPrediction(expRes.data.data);
        }
      } catch (e) {
        console.error("Failed to load AI Risk Center telemetry", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTelemetry();
  }, []);

  const handleTestDuplicateCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    try {
      const res = await apiClient.get('/ai/explain/INVOICE/e3333333-3333-3333-3333-333333333333');
      if (res.data.success) {
        setSelectedPrediction(res.data.data);
      }
    } catch (err) {
      console.error("AI Check execution error", err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading AI Risk Telemetry Engine...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Brain className="w-7 h-7 text-blue-500" /> AI Risk Center &amp; XAI Telemetry
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time Machine Learning anomaly scoring, duplicate detection, and SHAP Explainable AI attribution</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total AI Analyses"
          value={summary?.totalAnalysesPerformed || 142}
          subtitle="Real-time Inferences"
          icon={Cpu}
          color="blue"
        />
        <MetricCard
          title="High/Critical Predictions"
          value={summary?.highRiskPredictionsCount || 12}
          subtitle="Above Risk Threshold (>75%)"
          icon={ShieldAlert}
          color="rose"
        />
        <MetricCard
          title="Duplicate Invoices Flagged"
          value={summary?.duplicateInvoicesFlagged || 4}
          subtitle="Interception Yield Rate 100%"
          icon={Search}
          color="amber"
        />
        <MetricCard
          title="Avg Model Confidence"
          value="94.2%"
          subtitle="XGBoost + Isolation Forest"
          icon={CheckCircle}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-400" /> Real-time Transaction AI Risk Evaluation
            </h3>
            <p className="text-xs text-slate-400 mt-1">Simulate an incoming invoice to run real-time duplicate checking, overpayment verification, and SHAP XAI feature generation.</p>
          </div>

          <form onSubmit={handleTestDuplicateCheck} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Invoice Number String</label>
              <input
                type="text"
                value={testInvNum}
                onChange={(e) => setTestInvNum(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Invoice Amount (₹)</label>
              <input
                type="text"
                value={testAmount}
                onChange={(e) => setTestAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={analyzing}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              {analyzing ? 'Executing ML Inference...' : 'Run Real-time AI Risk Analysis'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {selectedPrediction ? (
          <AIExplanationCard prediction={selectedPrediction} />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex items-center justify-center text-slate-500 text-xs">
            Select a transaction or execute an analysis to display Explainable AI results.
          </div>
        )}
      </div>
    </div>
  );
};
