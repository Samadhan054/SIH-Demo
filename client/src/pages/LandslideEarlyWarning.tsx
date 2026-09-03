import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { RiskMeter } from '../components/RiskMeter';
import { Brain, Mountain, Droplets, AlertTriangle } from 'lucide-react';

export const LandslideEarlyWarning: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('landslideTitle')}</h1>
          <p className="text-slate-500 text-sm">AI-Based Landslide Early Warning Engine</p>
        </div>
        <div className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2">
          <Brain className="w-4 h-4" /> RULE-BASED DEMO ESTIMATE — NOT A TRAINED AI MODEL
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-black text-xl text-slate-900">Melamchi Corridor</h2>
              <p className="text-sm text-slate-500">Zone L-42</p>
            </div>
            <DataSourceBadge status="RULE_BASED" confidence="75%" />
          </div>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-red-50 border-2 border-red-200 flex flex-col items-center justify-center shrink-0">
              <span className="text-3xl font-black text-red-600">94</span>
              <span className="text-[10px] font-bold text-red-800 uppercase">Risk Score</span>
            </div>
            <div className="flex-1 space-y-3">
              <RiskMeter level="CRITICAL" />
              <div className="text-xs bg-red-50 text-red-800 p-2 rounded-lg border border-red-200 font-bold">
                Model Type: Rule-Based Demo Engine
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">Contributing Factors</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-500" /> Antecedent Rainfall (Last 7 days): 142mm</li>
              <li className="flex items-center gap-2"><Mountain className="w-4 h-4 text-amber-500" /> Slope Angle: 38°</li>
              <li className="flex items-center gap-2 text-red-600 font-bold"><AlertTriangle className="w-4 h-4 text-red-500" /> Soil Saturation: 92%</li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-sm font-bold text-slate-800 mb-1">Recommendation (Advisory)</p>
            <p className="text-sm text-slate-600">Immediate evacuation of low-lying settlements below slope zone L-42. High probability of debris flow in the next 12 hours.</p>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400 text-center pt-8">
        This module uses a configurable rule-based demo engine. Connect a real ML inference API for validated predictions.
      </div>
    </div>
  );
};
