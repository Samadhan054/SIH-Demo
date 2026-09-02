import React from 'react';
import { Phone, Shield, Radio, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm mb-2">
            <Shield className="w-4 h-4 text-red-500" />
            <span>FloodGuard Himalayan Division</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Multi-Source Flash Flood Prediction & Satellite Emergency Rescue System for Hilly and Mountainous regions.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-2">Emergency Contacts</h4>
          <ul className="space-y-1 text-slate-300">
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-red-400" />
              <span>National Disaster Helpline: <strong>1155</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Police Emergency Ops: <strong>100</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Armed Police Force Rescue: <strong>1114</strong></span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-2">Data Feeds Connected</h4>
          <ul className="space-y-1 text-slate-400">
            <li className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>IoT River Ultrasonic Gauges (15 Active)</span>
            </li>
            <li className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-yellow-400" />
              <span>OpenWeatherMap / IMD Rain Radar</span>
            </li>
            <li>NASA SMAP / Sentinel-1 Satellite Soil Moisture</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-2">Satellite Gateway</h4>
          <p className="text-slate-400 text-xs leading-relaxed mb-2">
            Equipped with low-bandwidth compressed binary packet SOS relay (Iridium / Skylo satellite compatible).
          </p>
          <div className="text-[11px] text-slate-500">
            © 2026 FloodGuard Platform. Life Safety System.
          </div>
        </div>
      </div>
    </footer>
  );
};
