import React from 'react';

export interface RiskMeterProps {
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH' | 'CRITICAL';
  score?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ level, score, label = level, size = 'md' }) => {
  const getStyles = () => {
    switch (level) {
      case 'LOW': return 'bg-emerald-50 border-emerald-300 text-emerald-800';
      case 'MODERATE': return 'bg-amber-50 border-amber-300 text-amber-800';
      case 'HIGH': return 'bg-orange-50 border-orange-300 text-orange-800';
      case 'VERY HIGH': return 'bg-red-50 border-red-400 text-red-700';
      case 'CRITICAL': return 'bg-red-700 border-red-800 text-white animate-pulse';
      default: return 'bg-slate-50 border-slate-300 text-slate-800';
    }
  };

  const getDotColor = () => {
    switch (level) {
      case 'LOW': return 'bg-emerald-500';
      case 'MODERATE': return 'bg-amber-500';
      case 'HIGH': return 'bg-orange-500';
      case 'VERY HIGH': return 'bg-red-500';
      case 'CRITICAL': return 'bg-white';
      default: return 'bg-slate-500';
    }
  };

  const levels = ['LOW', 'MODERATE', 'HIGH', 'VERY HIGH', 'CRITICAL'];
  const activeIndex = levels.indexOf(level);

  const padding = size === 'sm' ? 'px-2 py-1 text-xs' : size === 'lg' ? 'px-4 py-2 text-base' : 'px-3 py-1.5 text-sm';

  return (
    <div className={`inline-flex flex-col gap-1.5 ${size === 'lg' ? 'min-w-[200px]' : 'min-w-[120px]'}`}>
      <div className={`flex items-center justify-between gap-3 border rounded-xl font-bold uppercase tracking-wider ${padding} ${getStyles()}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${getDotColor()} ${level === 'CRITICAL' ? 'animate-ping' : ''}`} />
          <span>{label}</span>
        </div>
        {score !== undefined && (
          <span className="font-mono">{score.toFixed(1)}</span>
        )}
      </div>
      
      {/* Progress Bar Segments */}
      <div className="flex gap-1 h-1.5">
        {levels.map((_, idx) => (
          <div
            key={idx}
            className={`flex-1 rounded-full ${
              idx <= activeIndex 
                ? (level === 'CRITICAL' ? 'bg-red-600' : level === 'VERY HIGH' ? 'bg-red-400' : level === 'HIGH' ? 'bg-orange-400' : level === 'MODERATE' ? 'bg-amber-400' : 'bg-emerald-400')
                : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
