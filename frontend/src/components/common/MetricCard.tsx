import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
}) => {
  const colorMap = {
    blue: 'bg-blue-950/40 text-blue-400 border-blue-800/50',
    emerald: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50',
    amber: 'bg-amber-950/40 text-amber-400 border-amber-800/50',
    rose: 'bg-rose-950/40 text-rose-400 border-rose-800/50',
    purple: 'bg-purple-950/40 text-purple-400 border-purple-800/50',
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-sm hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-lg border ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend.isPositive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1.5 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
