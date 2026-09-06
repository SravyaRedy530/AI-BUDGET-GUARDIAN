import React from 'react';
import { useRealTimeTelemetry } from '../../context/RealTimeTelemetryContext';
import { ShieldAlert, X, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiveNotificationToast: React.FC = () => {
  const { latestNotification, dismissNotification } = useRealTimeTelemetry();

  if (!latestNotification) return null;

  return (
    <div className="fixed top-20 right-6 z-50 max-w-md w-full bg-slate-900/95 border-2 border-rose-600 rounded-2xl p-5 shadow-2xl backdrop-blur-lg animate-bounce space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-950 border border-rose-700 text-rose-400 rounded-xl animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">REAL-TIME AI FRAUD INTERCEPTION</span>
            <h4 className="text-xs font-extrabold text-white">{latestNotification.title}</h4>
          </div>
        </div>
        <button
          onClick={dismissNotification}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 border border-slate-800 rounded-xl font-mono">
        {latestNotification.description}
      </p>

      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-[11px] text-slate-400 font-mono">Time: {latestNotification.timestamp}</span>
        <Link
          to="/auditor-workspace"
          onClick={dismissNotification}
          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all"
        >
          Investigate in Workspace <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
