import React, { useState } from 'react';
import { Download, FileText, CheckCircle, X, ShieldAlert, BarChart3, Clock } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState('INTELLIGENCE_AUDIT');
  const [format, setFormat] = useState('PDF');
  const [dateRange, setDateRange] = useState('FY2024-25');
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setDownloading(true);
    setDownloadComplete(false);

    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);

      // Create dummy file download blob
      const content = `AI BUDGET GUARDIAN - EXECUTIVE AUDIT REPORT\nGenerated: ${new Date().toLocaleString()}\nReport Type: ${reportType}\nFiscal Year: ${dateRange}\nFormat: ${format}\n\nSummary:\n- Total Invoices Screened: 1,482\n- Duplicate Fraud Intercepted: 14 Cases (₹48,20,000 Saved)\n- High-Risk Vendor Shell Overlaps: 3 Flagged\n- SHAP Feature Attribution Model Accuracy: 98.4%\n- Compliance Verdict: PASSED WITH REMEDIATION REQUIRED`;
      const blob = new Blob([content], { type: format === 'PDF' ? 'application/pdf' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_Budget_Guardian_${reportType}_${dateRange}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Generate Executive &amp; Audit Report</h3>
              <p className="text-xs text-slate-400">Export official government risk intelligence and compliance artifacts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Report Category</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="INTELLIGENCE_AUDIT">Full AI Forensic Audit &amp; Risk Interception Summary</option>
              <option value="DUPLICATE_FRAUD">Duplicate Invoice &amp; Phantom Billing Breakdown</option>
              <option value="VENDOR_SHELL_GRAPH">Vendor Shell Network &amp; Identity Risk Ledger</option>
              <option value="BUDGET_FORECAST">Department Budget Misuse &amp; Burn Rate Forecast</option>
              <option value="SHAP_XAI_EXPLANATION">SHAP Explainable AI (XAI) Model Decision Traces</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Fiscal Period</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="FY2024-25">FY 2024 - 2025 (Current)</option>
                <option value="Q3_2024">Q3 FY 2024 (Oct - Dec)</option>
                <option value="Q2_2024">Q2 FY 2024 (Jul - Sep)</option>
                <option value="ALL_TIME">All Historical Records</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Export Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              >
                <option value="PDF">PDF Audit Report (Encrypted)</option>
                <option value="CSV">CSV Data Export (Raw Analytics)</option>
                <option value="XLSX">Excel Spreadsheet (Pivot-Ready)</option>
                <option value="JSON">JSON Schema Payload</option>
              </select>
            </div>
          </div>

          {downloadComplete && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Report compiled successfully! Download file automatically triggered.</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold hover:bg-slate-700">
              Close
            </button>
            <button
              type="button"
              disabled={downloading}
              onClick={handleGenerate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> {downloading ? 'Compiling Report Data...' : 'Compile &amp; Download Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
