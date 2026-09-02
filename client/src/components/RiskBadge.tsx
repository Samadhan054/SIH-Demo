import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  size = 'md',
  showPulse = true,
}) => {
  const config = {
    LOW: {
      bg: 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold',
      dot: 'bg-emerald-500',
      label: 'LOW RISK',
    },
    MODERATE: {
      bg: 'bg-amber-50 border-amber-300 text-amber-900 font-bold',
      dot: 'bg-amber-500',
      label: 'MODERATE RISK',
    },
    HIGH: {
      bg: 'bg-orange-50 border-orange-300 text-orange-900 font-bold',
      dot: 'bg-orange-500',
      label: 'HIGH RISK',
    },
    SEVERE: {
      bg: 'bg-red-600 border-red-700 text-white font-extrabold shadow-sm shadow-red-200',
      dot: 'bg-white animate-ping',
      label: 'SEVERE FLOOD ALERT',
    },
  }[level];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm font-semibold',
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <span className="relative flex h-2 w-2">
        {showPulse && level === 'SEVERE' && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dot.replace('animate-ping', '')}`} />
      </span>
      <span>{config.label}</span>
      {score !== undefined && (
        <span className={`ml-1 rounded px-1.5 py-0.5 text-[10px] font-mono ${level === 'SEVERE' ? 'bg-black/30 text-white' : 'bg-black/10 text-slate-900'}`}>
          {(score * 100).toFixed(0)}%
        </span>
      )}
    </div>
  );
};
