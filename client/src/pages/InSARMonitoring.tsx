import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { Satellite, AlertTriangle, Info } from 'lucide-react';

export const InSARMonitoring: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-orange-50 border-2 border-orange-400 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-md">
        <AlertTriangle className="w-6 h-6 text-orange-600 animate-pulse" />
        <h2 className="font-black text-orange-800 tracking-wider">DEMO DATA — NOT FOR OPERATIONAL EMERGENCY USE</h2>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-900">{t('inSARTitle')}</h1>
        <p className="text-slate-500 text-sm">Interferometric Synthetic Aperture Radar ground displacement tracking</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 h-96 flex items-center justify-center relative overflow-hidden">
        {/* Placeholder for map */}
        <div className="absolute inset-0 bg-slate-100 opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNjYmQ1ZTEiLz48L3N2Zz4=')]"></div>
        <div className="z-10 flex flex-col items-center gap-4 bg-white/90 p-6 rounded-2xl border border-slate-300 shadow-xl backdrop-blur">
          <Satellite className="w-12 h-12 text-slate-400" />
          <p className="text-slate-600 font-medium text-center max-w-sm">
            Map projection requires Leaflet CircleMarkers integration. Demo tabular data shown below.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">Connect real InSAR satellite datasets by implementing the InSAR API adapter via OpenTopography or ESA Sentinel-1.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Region</th>
              <th className="p-4">Coordinates</th>
              <th className="p-4">Displacement (mm/yr)</th>
              <th className="p-4">Trend</th>
              <th className="p-4">Risk Level</th>
              <th className="p-4">Data Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-slate-50">
              <td className="p-4 font-bold text-slate-900">Jure Landslide Zone</td>
              <td className="p-4 font-mono text-xs">27.769, 85.864</td>
              <td className="p-4 font-black text-red-600">+45.2</td>
              <td className="p-4"><span className="text-red-600 font-bold">RAPID</span></td>
              <td className="p-4">CRITICAL</td>
              <td className="p-4"><DataSourceBadge status="DEMO" /></td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="p-4 font-bold text-slate-900">Mugling Highway</td>
              <td className="p-4 font-mono text-xs">27.846, 84.563</td>
              <td className="p-4 font-black text-amber-600">+12.4</td>
              <td className="p-4"><span className="text-amber-600 font-bold">MODERATE</span></td>
              <td className="p-4">HIGH</td>
              <td className="p-4"><DataSourceBadge status="DEMO" /></td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="p-4 font-bold text-slate-900">Pokhara Valley</td>
              <td className="p-4 font-mono text-xs">28.209, 83.985</td>
              <td className="p-4 font-black text-emerald-600">+1.2</td>
              <td className="p-4"><span className="text-emerald-600 font-bold">STABLE</span></td>
              <td className="p-4">LOW</td>
              <td className="p-4"><DataSourceBadge status="DEMO" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
