import React, { useState } from 'react';
import { Sliders, CheckCircle, Save, X } from 'lucide-react';

interface AIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIConfigModal: React.FC<AIConfigModalProps> = ({ isOpen, onClose }) => {
  const [duplicateThreshold, setDuplicateThreshold] = useState('85');
  const [vendorRiskThreshold, setVendorRiskThreshold] = useState('75');
  const [anomalySensitivity, setAnomalySensitivity] = useState('0.15');
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Configure AI Risk Engine Thresholds</h3>
              <p className="text-xs text-slate-400">Super Admin machine learning model sensitivity &amp; escalation rules</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> AI Engine Configuration Updated Successfully
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Duplicate Invoice Probability Threshold (%)</label>
            <input
              type="number"
              value={duplicateThreshold}
              onChange={(e) => setDuplicateThreshold(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-500">Invoices scoring above this probability trigger CRITICAL duplicate alerts.</p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Fake Vendor Risk Score Threshold (0–100)</label>
            <input
              type="number"
              value={vendorRiskThreshold}
              onChange={(e) => setVendorRiskThreshold(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-500">Vendors with identity overlap scores above this threshold are placed under review.</p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Isolation Forest Anomaly Contamination Ratio</label>
            <input
              type="text"
              value={anomalySensitivity}
              onChange={(e) => setAnomalySensitivity(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div>
              <span className="font-semibold text-slate-200 block">Auto-Escalate Critical Alerts to Auditor Queue</span>
              <span className="text-[11px] text-slate-500">Automatically open investigation cases for critical alerts</span>
            </div>
            <input
              type="checkbox"
              checked={autoEscalate}
              onChange={(e) => setAutoEscalate(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold hover:bg-slate-700">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Save AI Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
