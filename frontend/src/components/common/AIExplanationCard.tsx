import React from 'react';
import { AIPrediction, FeatureImpact } from '../../types';
import { RiskBadge } from './RiskBadge';
import { Brain, AlertTriangle, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';

interface AIExplanationCardProps {
  prediction: AIPrediction;
}

export const AIExplanationCard: React.FC<AIExplanationCardProps> = ({ prediction }) => {
  let parsedFeatures: FeatureImpact[] = [];
  let parsedReasons: string[] = [];

  try {
    if (prediction.explanationJson) {
      const parsed = JSON.parse(prediction.explanationJson);
      parsedFeatures = parsed.features || [];
      parsedReasons = parsed.reasons || [];
    }
  } catch (e) {
    console.error("Failed to parse explanation JSON", e);
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      {/* Header telemetry */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-950/60 border border-blue-800 text-blue-400 rounded-xl">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">{prediction.modelName}</h3>
              <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded font-mono">{prediction.modelVersion}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Automated Explainable AI (XAI) Telemetry Diagnosis</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <RiskBadge level={prediction.riskLevel} score={prediction.riskScore} />
          <span className="text-xs text-slate-400 font-medium">
            Confidence: <strong className="text-slate-200">{(prediction.confidence * 100).toFixed(0)}%</strong>
          </span>
        </div>
      </div>

      {/* Model Verdict */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Model Verdict &amp; Diagnosis</span>
        <p className="text-sm font-semibold text-slate-200 leading-relaxed">{prediction.prediction}</p>
      </div>

      {/* Influencing Reasons */}
      {parsedReasons.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Key Influencing Factors
          </h4>
          <ul className="space-y-2">
            {parsedReasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/50 p-2.5 rounded border border-slate-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SHAP Feature Contribution Breakdown */}
      {parsedFeatures.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-blue-400" /> SHAP Feature Impact Breakdown
          </h4>
          <div className="space-y-3">
            {parsedFeatures.map((feature, idx) => {
              const impactPct = Math.min(Math.abs(feature.impact) * 100, 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 font-semibold">{feature.name} ({feature.value})</span>
                    <span className="text-blue-400 font-bold">+{(feature.impact * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${impactPct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 italic">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Action */}
      <div className="p-4 bg-slate-950/90 border border-blue-900/50 rounded-lg flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">Recommended Operational Action</span>
          <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{prediction.recommendedAction}</p>
        </div>
      </div>
    </div>
  );
};
