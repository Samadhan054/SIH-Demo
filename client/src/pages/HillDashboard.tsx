import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { RiskMeter } from '../components/RiskMeter';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { MapPin, Activity, AlertTriangle, CloudRain, Droplets, Wind, Waves } from 'lucide-react';

export const HillDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState('Sindhupalchok');

  const riskData = [
    { title: 'Flash Flood Risk', level: 'HIGH', score: 85, badge: 'SENSOR', icon: <Waves className="w-5 h-5 text-blue-500" /> },
    { title: 'Landslide Risk', level: 'VERY HIGH', score: 92, badge: 'AI_ESTIMATE', icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> },
    { title: 'Avalanche Risk', level: 'MODERATE', score: 45, badge: 'DEMO', icon: <Wind className="w-5 h-5 text-slate-500" /> },
    { title: 'Rainfall Risk', level: 'CRITICAL', score: 98, badge: 'OFFICIAL', icon: <CloudRain className="w-5 h-5 text-indigo-500" /> },
    { title: 'Soil Saturation', level: 'VERY HIGH', score: 88, badge: 'SATELLITE', icon: <Droplets className="w-5 h-5 text-emerald-500" /> },
    { title: 'Weather Risk', level: 'HIGH', score: 78, badge: 'LIVE', icon: <Activity className="w-5 h-5 text-cyan-500" /> },
    { title: 'River/Stream Risk', level: 'HIGH', score: 81, badge: 'SENSOR', icon: <Waves className="w-5 h-5 text-blue-400" /> },
    { title: 'Overall Regional Risk', level: 'VERY HIGH', score: 89, badge: 'RULE_BASED', icon: <AlertTriangle className="w-5 h-5 text-red-500" /> },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('navHillDashboard')}</h1>
          <p className="text-slate-500 text-sm">Hill Area Disaster Risk & Flash Flood Monitoring</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-xl shadow-sm">
          <MapPin className="w-4 h-4 text-slate-400" />
          <select 
            className="bg-transparent border-none focus:outline-none text-sm font-bold text-slate-700"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="Sindhupalchok">Sindhupalchok</option>
            <option value="Kathmandu">Kathmandu</option>
            <option value="Pokhara">Pokhara</option>
            <option value="Manang">Manang</option>
          </select>
        </div>
      </div>

      {/* Critical Banners based on data */}
      <div className="bg-red-50 border-2 border-red-400 rounded-2xl p-4 flex items-start gap-3 shadow-md">
        <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5 animate-pulse" />
        <div>
          <h3 className="font-bold text-red-800">CRITICAL SOIL SATURATION ALERT</h3>
          <p className="text-sm text-red-700 mt-1">Soil saturation is approaching a dangerous level (88%). Landslide and slope failure probability may increase. Follow official evacuation guidance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {riskData.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 space-y-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {item.icon}
                <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
              </div>
              <DataSourceBadge status={item.badge as any} lastUpdated="Just now" />
            </div>
            
            <RiskMeter level={item.level as any} score={item.score} size="md" />
          </div>
        ))}
      </div>
    </div>
  );
};
