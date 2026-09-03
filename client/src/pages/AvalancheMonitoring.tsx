import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { RiskMeter } from '../components/RiskMeter';
import { Snowflake, Wind, Thermometer, Radar } from 'lucide-react';

export const AvalancheMonitoring: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-100 border border-slate-300 rounded-2xl p-4 flex items-center justify-center gap-3 shadow-sm">
        <Radar className="w-5 h-5 text-slate-500" />
        <h2 className="font-bold text-slate-700">Demo / Awaiting Live Radar Integration</h2>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-900">{t('avalancheTitle')}</h1>
        <p className="text-slate-500 text-sm">Snowpack and slope stability monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-black text-lg text-slate-900">Manang Region</h2>
              <p className="text-xs text-slate-500">Altitude: 3,519 m</p>
            </div>
            <DataSourceBadge status="DEMO" lastUpdated="2 hrs ago" />
          </div>

          <RiskMeter level="HIGH" size="md" label="HIGH RISK" />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold mb-1"><Snowflake className="w-3.5 h-3.5 text-sky-500" /> Accumulation</span>
              <span className="font-black text-slate-800">120 cm</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold mb-1"><Thermometer className="w-3.5 h-3.5 text-red-400" /> Temperature</span>
              <span className="font-black text-slate-800">-4 °C</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold mb-1"><Wind className="w-3.5 h-3.5 text-slate-400" /> Wind</span>
              <span className="font-black text-slate-800">45 km/h NW</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="flex items-center gap-1.5 text-slate-500 text-xs font-bold mb-1"><Snowflake className="w-3.5 h-3.5 text-sky-300" /> Recent Snow</span>
              <span className="font-black text-slate-800">25 cm (24h)</span>
            </div>
          </div>
          
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600">Slope Status:</span>
            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded font-bold border border-amber-200">UNSTABLE</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400 text-center pt-8">
        Future integration with avalanche radar, snow depth sensors, and snowpack analysis is planned.
      </div>
    </div>
  );
};
