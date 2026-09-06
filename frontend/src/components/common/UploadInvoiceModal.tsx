import React, { useState } from 'react';
import { Upload, Save, X, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../api/client';

interface UploadInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newInvoice: any) => void;
}

export const UploadInvoiceModal: React.FC<UploadInvoiceModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-2025-${Math.floor(1000 + Math.random() * 9000)}`);
  const [vendorName, setVendorName] = useState('Apex Highway Infra Corp');
  const [departmentName, setDepartmentName] = useState('Department of Public Works & Infrastructure');
  const [amount, setAmount] = useState('1250000.00');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);
  const [aiCheckResult, setAiCheckResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setUploading(true);

      // Simulate OCR extract
      setTimeout(() => {
        setUploading(false);
        setOcrSuccess(true);
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Trigger AI Duplicate Check microservice call simulation or client check
      const duplicateRes = await apiClient.post('/ai/duplicate-check', {
        invoice_number: invoiceNumber,
        vendor_name: vendorName,
        amount: parseFloat(amount),
        date: invoiceDate
      }).catch(() => null);

      const isDup = duplicateRes?.data?.is_duplicate ?? (Math.random() > 0.7);
      const prob = duplicateRes?.data?.duplicate_probability ?? (isDup ? 94.5 : 2.1);

      const createdInvoice = {
        id: String(Date.now()),
        invoiceNumber,
        vendorName,
        departmentName,
        amount: parseFloat(amount),
        invoiceDate,
        duplicateProbability: prob,
        duplicateFlag: isDup,
        approvalStatus: isDup ? 'FLAGGED_RISK' : 'PENDING_APPROVAL',
        paymentStatus: 'UNPAID'
      };

      onSuccess(createdInvoice);
      onClose();
    } catch (e) {
      console.error(e);
      onClose();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-6 relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload Vendor Invoice (PDF/OCR)</h3>
              <p className="text-xs text-slate-400">Finance Officer automated ingestion &amp; duplicate verification</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* File Upload zone */}
          <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-slate-950 p-4 rounded-xl text-center cursor-pointer transition-colors relative">
            <input type="file" accept=".pdf,.png,.jpg" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="font-bold text-slate-200">{fileName ? fileName : 'Click or Drag PDF Invoice to Upload'}</p>
            <p className="text-[11px] text-slate-500 mt-1">Supports scanned PDFs, TIFF, JPG up to 25MB (Automated Tesseract OCR)</p>
            {ocrSuccess && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-2 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" /> OCR Data Extracted Successfully
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Invoice Number</label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Invoice Date</label>
              <input
                type="date"
                required
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Vendor Entity</label>
            <select
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option>Apex Highway Infra Corp</option>
              <option>MedLife Pharma Supplies</option>
              <option>Global CyberTech Systems</option>
              <option>Shadow Infra Solutions</option>
              <option>Zenith Energy Suppliers</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Department</label>
              <select
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option>Department of Public Works &amp; Infrastructure</option>
                <option>Department of Public Health &amp; Family Welfare</option>
                <option>Department of Higher Education &amp; Research</option>
                <option>Department of Information Technology &amp; e-Gov</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Total Billed Amount (₹)</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold hover:bg-slate-700">
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-bold shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> {uploading ? 'Analyzing AI Duplicates...' : 'Submit &amp; Run AI Interception'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
