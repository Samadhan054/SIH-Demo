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
      bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400',
      dot: 'bg-emerald-400',
      label: 'LOW RISK',
    },
    MODERATE: {
      bg: 'bg-amber-950/80 border-amber-500/40 text-amber-400',
      dot: 'bg-amber-400',
      label: 'MODERATE RISK',
    },
    HIGH: {
      bg: 'bg-orange-950/80 border-orange-500/40 text-orange-400',
      dot: 'bg-orange-400',
      label: 'HIGH RISK',
    },
    SEVERE: {
      bg: 'bg-red-950/90 border-red-500/60 text-red-400 font-bold',
      dot: 'bg-red-500 animate-ping',
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
      className={`inline-flex items-center gap-2 rounded-full border backdrop-blur-md ${config.bg} ${sizeClasses}`}
    >
      <span className="relative flex h-2 w-2">
        {showPulse && level === 'SEVERE' && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dot.replace('animate-ping', '')}`} />
      </span>
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="ml-1 rounded bg-black/40 px-1.5 py-0.5 text-[10px] opacity-90">
          {(score * 100).toFixed(0)}%
        </span>
      )}
    </div>
  );
};
