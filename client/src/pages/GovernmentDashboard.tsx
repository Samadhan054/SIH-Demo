import React from 'react';
import { Shield, Activity, Users, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const GovernmentDashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Government Operations Dashboard</h1>
          <p className="text-slate-500 text-sm">Central command overview for high-level officials</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" /> CWC / NDMA Official
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 border-t-4 border-t-red-500">
          <div className="text-slate-500 text-sm font-bold uppercase mb-1">Active SOS</div>
          <div className="text-3xl font-black text-slate-900">142</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 border-t-4 border-t-orange-500">
          <div className="text-slate-500 text-sm font-bold uppercase mb-1">Critical Regions</div>
          <div className="text-3xl font-black text-slate-900">12</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 border-t-4 border-t-blue-500">
          <div className="text-slate-500 text-sm font-bold uppercase mb-1">Teams Deployed</div>
          <div className="text-3xl font-black text-slate-900">48</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 border-t-4 border-t-emerald-500">
          <div className="text-slate-500 text-sm font-bold uppercase mb-1">First Aid Dispatched</div>
          <div className="text-3xl font-black text-slate-900">1,204</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" /> District Risk Overview
        </h3>
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-3">District</th>
              <th className="p-3">Flash Flood Risk</th>
              <th className="p-3">Landslide Risk</th>
              <th className="p-3">Active SOS</th>
              <th className="p-3">Teams</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="p-3 font-bold">Sindhupalchok</td>
              <td className="p-3"><span className="text-red-600 font-bold">CRITICAL</span></td>
              <td className="p-3"><span className="text-red-600 font-bold">VERY HIGH</span></td>
              <td className="p-3 font-mono">42</td>
              <td className="p-3 font-mono">15</td>
            </tr>
            <tr>
              <td className="p-3 font-bold">Manang</td>
              <td className="p-3"><span className="text-amber-600 font-bold">MODERATE</span></td>
              <td className="p-3"><span className="text-emerald-600 font-bold">LOW</span></td>
              <td className="p-3 font-mono">2</td>
              <td className="p-3 font-mono">1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
