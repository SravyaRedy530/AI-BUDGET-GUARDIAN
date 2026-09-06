import React, { useState } from 'react';
import { Crown, Building2, Briefcase, CreditCard, Cpu, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { AllocateBudgetModal } from './AllocateBudgetModal';
import { CreatePOModal } from './CreatePOModal';
import { UploadInvoiceModal } from './UploadInvoiceModal';

export const TreasuryLifecycleTracker: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);
  const [isPOOpen, setIsPOOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Live Simulation Flow Data
  const [flowState, setFlowState] = useState({
    stateAdmin: 'Telangana CM / Treasury Owner',
    department: 'Department of Public Works & Infrastructure',
    allocatedAmount: '500000000.00', // 50 Cr
    contractor: 'Apex Highway Infra Corp',
    poNumber: 'PO-TS-2025-9921',
    invoiceNumber: 'INV-APEX-8821',
    invoiceAmount: '12500000.00', // 1.25 Cr
    aiStatus: 'CLEARED',
    aiScore: 12.5,
    duplicateFound: false,
    moneyLeakage: false,
    auditorVerified: true
  });

  const steps = [
    {
      step: 1,
      title: 'Company Admin Release',
      role: '👑 Company Admin (CM / Treasury)',
      desc: 'Releases annual treasury funds to specific department',
      icon: Crown,
      color: 'blue',
      status: 'Funds Released: ₹50.00 Cr'
    },
    {
      step: 2,
      title: 'Dept Manager Allocation',
      role: '📊 Department Manager',
      desc: 'Assigns project budget & issues PO to Contractor',
      icon: Building2,
      color: 'emerald',
      status: `PO Issued: ${flowState.poNumber}`
    },
    {
      step: 3,
      title: 'Contractor & Finance',
      role: '💳 Finance Officer',
      desc: 'Receives contractor invoice & verifies processing',
      icon: CreditCard,
      color: 'purple',
      status: `Invoice: ${flowState.invoiceNumber}`
    },
    {
      step: 4,
      title: 'AI Engine Real-Time Scan',
      role: '🤖 AI Inspection Engine',
      desc: 'Checks duplicate bills, fake GST, & money leakage',
      icon: Cpu,
      color: 'amber',
      status: `AI Risk Score: ${flowState.aiScore} (Low Risk)`
    },
    {
      step: 5,
      title: 'Auditor Verification',
      role: '🕵️ Lead Auditor',
      desc: 'Monitors entire transparent trace & certifies audit',
      icon: ShieldCheck,
      color: 'rose',
      status: 'Audit Certified'
    }
  ];

  const handleStep1Complete = (alloc: any) => {
    setFlowState(prev => ({
      ...prev,
      department: alloc.departmentName || prev.department,
      allocatedAmount: alloc.allocatedAmount || prev.allocatedAmount
    }));
    setCurrentStep(2);
  };

  const handleStep2Complete = (po: any) => {
    setFlowState(prev => ({
      ...prev,
      poNumber: po.poNumber || prev.poNumber,
      contractor: po.vendor || prev.contractor
    }));
    setCurrentStep(3);
  };

  const handleStep3Complete = (inv: any) => {
    setFlowState(prev => ({
      ...prev,
      invoiceNumber: inv.invoiceNumber || prev.invoiceNumber,
      invoiceAmount: inv.amount || prev.invoiceAmount
    }));
    setCurrentStep(4);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Modals for Interactive Step Execution */}
      <AllocateBudgetModal
        isOpen={isAllocateOpen}
        onClose={() => setIsAllocateOpen(false)}
        onSuccess={handleStep1Complete}
      />

      <CreatePOModal
        isOpen={isPOOpen}
        onClose={() => setIsPOOpen(false)}
        onSuccess={handleStep2Complete}
      />

      <UploadInvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        onSuccess={handleStep3Complete}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800 px-2.5 py-1 rounded-full">
            REAL-TIME TREASURY FINANCIAL LIFECYCLE
          </span>
          <h2 className="text-lg font-black text-white mt-1.5 flex items-center gap-2">
            End-to-End Money Flow &amp; AI Audit Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Trace funds from <strong>Company Admin (CM Release)</strong> ➔ <strong>Dept Manager</strong> ➔ <strong>Contractor</strong> ➔ <strong>Finance Officer Processing</strong> ➔ <strong>AI Real-Time Inspection</strong> ➔ <strong>Auditor Governance</strong>
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentStep(1);
            setIsAllocateOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" /> Simulate Fund Release Flow
        </button>
      </div>

      {/* Visual Pipeline Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {steps.map((s, idx) => {
          const IconComponent = s.icon;
          const isActive = currentStep === s.step;
          const isDone = currentStep > s.step;

          return (
            <div
              key={s.step}
              className={`p-4 rounded-xl border transition-all space-y-3 relative flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/50 shadow-xl'
                  : isDone
                  ? 'bg-slate-950 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-950/60 border-slate-800 opacity-75'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg border ${
                    isDone ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    isActive ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                    'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    isDone ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    isActive ? 'bg-blue-950 text-blue-300 border border-blue-800 animate-pulse' :
                    'bg-slate-900 text-slate-500 border border-slate-800'
                  }`}>
                    STEP 0{s.step}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white">{s.title}</h4>
                  <span className="text-[10px] font-semibold text-slate-400 block">{s.role}</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">{s.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                  <span className="truncate">{s.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Financial Trace Log Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
          <span className="font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" /> REAL-TIME FINANCIAL AUDIT TRAIL LOG
          </span>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> LIVE TELEMETRY SYNCED
          </span>
        </div>

        <div className="space-y-2 text-[11px]">
          <div className="flex items-center gap-2 text-blue-400">
            <Crown className="w-3.5 h-3.5 shrink-0" />
            <span>[1. CM Fund Release]:</span>
            <span className="text-white font-bold">Telangana CM / Company Admin</span>
            <span className="text-slate-400">released</span>
            <span className="text-emerald-400 font-bold">₹50.00 Cr</span>
            <span className="text-slate-400">to</span>
            <span className="text-blue-300 font-bold">{flowState.department}</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-400">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>[2. Dept Manager]:</span>
            <span className="text-white font-bold">Dept Manager (Infrastructure)</span>
            <span className="text-slate-400">issued PO</span>
            <span className="text-blue-300 font-bold">{flowState.poNumber}</span>
            <span className="text-slate-400">to Contractor</span>
            <span className="text-purple-300 font-bold">{flowState.contractor}</span>
          </div>

          <div className="flex items-center gap-2 text-purple-400">
            <CreditCard className="w-3.5 h-3.5 shrink-0" />
            <span>[3. Finance Officer]:</span>
            <span className="text-white font-bold">Finance Officer</span>
            <span className="text-slate-400">scanned invoice</span>
            <span className="text-purple-300 font-bold">{flowState.invoiceNumber}</span>
            <span className="text-slate-400">amounting</span>
            <span className="text-emerald-400 font-bold">₹1.25 Cr</span>
          </div>

          <div className="flex items-center gap-2 text-amber-400">
            <Cpu className="w-3.5 h-3.5 shrink-0" />
            <span>[4. AI Inspection Engine]:</span>
            <span className="text-emerald-400 font-bold">DUPLICATE CHECK: PASSED</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-400 font-bold">FAKE VENDOR GST: VERIFIED</span>
            <span className="text-slate-400">|</span>
            <span className="text-blue-400 font-bold">SHAP RISK SCORE: 12.5 (LOW)</span>
          </div>

          <div className="flex items-center gap-2 text-rose-400">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>[5. Lead Auditor]:</span>
            <span className="text-white font-bold">Lead Auditor</span>
            <span className="text-slate-400">reviewed transparent money chain &amp; approved disbursement into certified audit ledger.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
