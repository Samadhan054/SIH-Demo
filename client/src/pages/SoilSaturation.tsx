import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { RiskMeter } from '../components/RiskMeter';
import { Droplets, Info } from 'lucide-react';

export const SoilSaturation: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900">{t('soilSaturationTitle')}</h1>
        <p className="text-slate-500 text-sm">Real-time soil moisture and retention monitoring</p>
      </div>

      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-amber-800">Threshold Configuration</h3>
          <p className="text-sm text-amber-700 mt-1">These thresholds are configurable by region, soil type, and government guidelines. Bands shown: 0-30% LOW, 31-50% MODERATE, 51-70% HIGH, 71-85% VERY HIGH, 86-100% CRITICAL</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center space-y-6">
          <h3 className="font-bold text-slate-800 self-start w-full border-b pb-2">Sindhupalchok Zone 1</h3>
          
          <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-100 flex items-center justify-center">
            {/* Simple visual representation of gauge */}
            <div className="absolute inset-0 rounded-full border-[16px] border-red-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 88%)' }} />
            <div className="text-center z-10 bg-white w-full h-full rounded-full flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900">88%</span>
              <span className="text-xs font-bold text-red-600 uppercase">Critical</span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-bold">Recent Rain</p>
              <p className="text-lg font-black text-blue-600">45 mm</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-bold">Landslide Correl.</p>
              <p className="text-lg font-black text-amber-600">92%</p>
            </div>
          </div>
          
          <div className="w-full flex justify-between items-center border-t pt-4">
            <RiskMeter level="CRITICAL" score={88} size="sm" />
            <DataSourceBadge status="SATELLITE" lastUpdated="10 mins ago" />
          </div>
        </div>
      </div>
    </div>
  );
};
