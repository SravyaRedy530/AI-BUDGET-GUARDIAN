import React from 'react';
import { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score }) => {
  const badgeMap = {
    LOW: 'bg-emerald-950/80 text-emerald-400 border-emerald-800',
    MEDIUM: 'bg-amber-950/80 text-amber-400 border-amber-800',
    HIGH: 'bg-orange-950/80 text-orange-400 border-orange-800',
    CRITICAL: 'bg-rose-950/80 text-rose-400 border-rose-800 font-extrabold animate-pulse',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${badgeMap[level]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${level === 'CRITICAL' ? 'bg-rose-500' : level === 'HIGH' ? 'bg-orange-500' : level === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
      {level} {score !== undefined && `(${score.toFixed(1)})`}
    </span>
  );
};
