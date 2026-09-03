import React from 'react';
import { Activity, CheckCircle, Wifi, Satellite, Brain, Code, Beaker, AlertCircle } from 'lucide-react';

export interface DataSourceBadgeProps {
  status: 'LIVE' | 'OFFICIAL' | 'SENSOR' | 'SATELLITE' | 'AI_ESTIMATE' | 'RULE_BASED' | 'SIMULATED' | 'DEMO';
  lastUpdated?: string;
  confidence?: string;
}

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({ status, lastUpdated, confidence }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'LIVE':
        return { icon: <Activity className="w-3.5 h-3.5" />, color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500 animate-pulse', label: 'LIVE' };
      case 'OFFICIAL':
        return { icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', label: 'OFFICIAL' };
      case 'SENSOR':
        return { icon: <Wifi className="w-3.5 h-3.5" />, color: 'bg-cyan-50 text-cyan-700 border-cyan-200', dot: 'bg-cyan-500', label: 'SENSOR' };
      case 'SATELLITE':
        return { icon: <Satellite className="w-3.5 h-3.5" />, color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', label: 'SATELLITE' };
      case 'AI_ESTIMATE':
        return { icon: <Brain className="w-3.5 h-3.5" />, color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'AI ESTIMATE' };
      case 'RULE_BASED':
        return { icon: <Code className="w-3.5 h-3.5" />, color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'RULE BASED' };
      case 'SIMULATED':
        return { icon: <Beaker className="w-3.5 h-3.5" />, color: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-500', label: 'SIMULATED' };
      case 'DEMO':
        return { icon: <Beaker className="w-3.5 h-3.5" />, color: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500', label: 'DEMO DATA' };
      default:
        return { icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-500', label: status };
    }
  };

  const config = getBadgeConfig();

  return (
    <div className="flex flex-col items-end gap-1">
      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${config.color}`}>
        {config.icon}
        <span>{config.label}</span>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      </div>
      {(lastUpdated || confidence) && (
        <div className="text-[9px] text-slate-400 font-mono">
          {confidence && `Conf: ${confidence}`}
          {confidence && lastUpdated && ' | '}
          {lastUpdated && `Upd: ${lastUpdated}`}
        </div>
      )}
    </div>
  );
};
