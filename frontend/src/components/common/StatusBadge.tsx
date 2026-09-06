import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalized = status.toUpperCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (['ACTIVE', 'APPROVED', 'PAID', 'HEALTHY', 'RESOLVED', 'CLOSED_RESOLVED'].includes(normalized)) {
    colorClasses = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80';
  } else if (['PENDING', 'UNDER_REVIEW', 'EVIDENCE_REVIEW', 'NEW', 'WARNING'].includes(normalized)) {
    colorClasses = 'bg-amber-950/60 text-amber-400 border-amber-800/80';
  } else if (['REJECTED', 'FLAGGED', 'EXCEEDED', 'CRITICAL', 'CLOSED_DISMISSED'].includes(normalized)) {
    colorClasses = 'bg-rose-950/60 text-rose-400 border-rose-800/80';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border ${colorClasses}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
