import React from 'react';
import { Phone, Shield, Radio, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 py-8 text-xs mt-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
            <Shield className="w-4 h-4 text-red-600" />
            <span>FloodGuard National Division</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            Multi-Source Flash Flood Prediction, CWC River Registry & Satellite Emergency Rescue System for Hilly and River Catchment regions.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">Emergency Contacts</h4>
          <ul className="space-y-1 text-slate-700">
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <span>National Disaster Helpline: <strong>1155</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Police Emergency Ops: <strong>100</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>Armed Rescue Force: <strong>1114</strong></span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">Data Feeds Connected</h4>
          <ul className="space-y-1 text-slate-600">
            <li className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-sky-600" />
              <span>CWC Gauges & IoT River Radar (28 Rivers)</span>
            </li>
            <li className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              <span>OpenWeatherMap / IMD Rain Radar</span>
            </li>
            <li>NASA SMAP / Sentinel-1 Soil Moisture</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">Satellite Gateway</h4>
          <p className="text-slate-500 text-xs leading-relaxed mb-2">
            Equipped with low-bandwidth compressed binary packet SOS relay (Iridium / Skylo satellite compatible).
          </p>
          <div className="text-[11px] text-slate-400">
            © 2026 FloodGuard Platform. Life Safety System.
          </div>
        </div>
      </div>
    </footer>
  );
};
