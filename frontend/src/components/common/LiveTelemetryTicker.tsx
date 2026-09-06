import React, { useState } from 'react';
import { useRealTimeTelemetry } from '../../context/RealTimeTelemetryContext';
import { Activity, ShieldAlert, Zap, ChevronUp, ChevronDown, Terminal, RefreshCw } from 'lucide-react';

export const LiveTelemetryTicker: React.FC = () => {
  const {
    isLiveStreaming,
    setIsLiveStreaming,
    telemetryLogs,
    simulateLiveFraudEvent,
    liveStats
  } = useRealTimeTelemetry();

  const [expanded, setExpanded] = useState(false);
  const latestLog = telemetryLogs[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-md text-xs shadow-2xl transition-all">
      {/* Ticker Main Bar */}
      <div className="px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Live Status Pulse */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold transition-all ${
              isLiveStreaming
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span>{isLiveStreaming ? 'LIVE TELEMETRY STREAMING' : 'TELEMETRY PAUSED'}</span>
          </button>

          <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>Latency: <strong className="text-emerald-400">{liveStats.latencyMs}ms</strong></span>
            <span>Total Monitored: <strong className="text-blue-400">₹{(liveStats.totalMonitoredAmount / 10000000).toFixed(2)} Cr</strong></span>
            <span>Fraud Intercepted: <strong className="text-amber-400">{liveStats.interceptedFraudCount}</strong></span>
          </div>
        </div>

        {/* Center: Live Scrolling Log */}
        <div className="flex-1 overflow-hidden font-mono text-[11px] flex items-center gap-2 bg-slate-900/80 border border-slate-800/60 px-3 py-1 rounded-lg">
          <Terminal className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          {latestLog ? (
            <div className="truncate flex items-center gap-2">
              <span className="text-slate-500">[{latestLog.timestamp}]</span>
              <span className={`font-bold ${
                latestLog.severity === 'CRITICAL' ? 'text-rose-400 animate-pulse' :
                latestLog.severity === 'WARNING' ? 'text-amber-400' : 'text-blue-300'
              }`}>
                {latestLog.service}:
              </span>
              <span className="text-slate-300 truncate">{latestLog.message}</span>
            </div>
          ) : (
            <span className="text-slate-500">Listening to live microservice bus...</span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={simulateLiveFraudEvent}
            className="px-3 py-1 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-lg font-bold text-[11px] shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all transform hover:scale-105"
          >
            <Zap className="w-3.5 h-3.5" /> Simulate Live Fraud Event
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Logs Panel */}
      {expanded && (
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 max-h-48 overflow-y-auto space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between text-slate-400 font-bold border-b border-slate-800 pb-2 mb-2">
            <span>LIVE MICROSERVICE EVENT BUS LOGS</span>
            <span>Showing last {telemetryLogs.length} events</span>
          </div>
          {telemetryLogs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 hover:bg-slate-900/60 p-1 rounded transition-colors">
              <span className="text-slate-500">{log.timestamp}</span>
              <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                log.service === 'AI_ENGINE' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                log.service === 'FRAUD_INTERCEPTOR' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                log.service === 'SHAP_EXPLAINER' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}>
                {log.service}
              </span>
              <span className={log.severity === 'CRITICAL' ? 'text-rose-300 font-bold' : 'text-slate-300'}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
