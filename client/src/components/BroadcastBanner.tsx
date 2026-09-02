import React from 'react';
import { AlertTriangle, Radio, ShieldAlert } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const BroadcastBanner: React.FC = () => {
  const { alerts } = useSocket();
  const activeSevereAlert = alerts.find((a) => a.active && (a.severity === 'SEVERE' || a.isManualOverride));

  if (!activeSevereAlert) return null;

  return (
    <div className="relative bg-gradient-to-r from-red-700 via-rose-600 to-red-800 text-white shadow-lg border-b border-red-400/30">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3 font-semibold">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-yellow-300 animate-bounce" />
            <span className="bg-red-950/60 px-2 py-0.5 rounded text-xs tracking-wider uppercase font-bold text-yellow-300 border border-yellow-400/30">
              {activeSevereAlert.district} District
            </span>
            <span>{activeSevereAlert.title}:</span>
          </div>
        </div>

        <p className="flex-1 min-w-[280px] text-xs sm:text-sm text-red-50 font-medium">
          {activeSevereAlert.message}{' '}
          <strong className="text-yellow-200 underline font-bold">
            {activeSevereAlert.recommendedAction}
          </strong>
        </p>

        <div className="flex items-center gap-2 text-xs bg-black/30 px-2.5 py-1 rounded border border-white/20">
          <Radio className="w-3.5 h-3.5 text-red-300 animate-pulse" />
          <span>Issued by: {activeSevereAlert.issuedBy}</span>
        </div>
      </div>
    </div>
  );
};
