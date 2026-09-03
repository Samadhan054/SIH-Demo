import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DataSourceBadge } from '../components/DataSourceBadge';
import { RiskMeter } from '../components/RiskMeter';
import { CloudRain, Wind, Droplets, Thermometer, CloudLightning } from 'lucide-react';

export const WeatherForecast: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('weatherTitle')}</h1>
          <p className="text-slate-500 text-sm">AI Weather & Flash Flood Forecast</p>
        </div>
        <DataSourceBadge status="SIMULATED" />
      </div>

      {/* Flash Flood Risk Block */}
      <div className="bg-white border-2 border-red-200 rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="flex flex-col items-center justify-center shrink-0 w-32">
          <div className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider text-center">Flash Flood<br/>Risk Score</div>
          <div className="text-5xl font-black text-red-600 mb-3">82</div>
          <RiskMeter level="VERY HIGH" size="sm" />
        </div>
        
        <div className="flex-1 space-y-4 border-l border-slate-100 pl-8">
          <div>
            <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider mb-2 border border-slate-200">SYSTEM-GENERATED ADVISORY</span>
            <h3 className="font-bold text-slate-800 text-lg">High Probability of localized flash flooding in the next 12 hours.</h3>
          </div>
          
          <div className="space-y-1 text-sm text-slate-600">
            <p className="font-bold text-slate-700">Main causes:</p>
            <ul className="list-disc pl-5">
              <li>Intense localized rainfall expected (60mm in 3h)</li>
              <li>High pre-existing soil saturation in the catchment area</li>
              <li>Steep terrain accelerating runoff</li>
            </ul>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
            <p className="text-sm font-bold text-red-800">Recommended Action:</p>
            <p className="text-sm text-red-700">Stay away from river banks and low-lying areas. Follow official IMD/CWC bulletins.</p>
          </div>
        </div>
      </div>

      {/* Current Conditions */}
      <h2 className="text-lg font-black text-slate-900 pt-4">Current Conditions</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
          <Thermometer className="w-6 h-6 text-orange-500" />
          <span className="text-2xl font-black text-slate-800">24°C</span>
          <span className="text-xs font-bold text-slate-500 uppercase">Temperature</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
          <CloudRain className="w-6 h-6 text-blue-500" />
          <span className="text-2xl font-black text-slate-800">12.5 mm</span>
          <span className="text-xs font-bold text-slate-500 uppercase">Rainfall / hr</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
          <Droplets className="w-6 h-6 text-cyan-500" />
          <span className="text-2xl font-black text-slate-800">88%</span>
          <span className="text-xs font-bold text-slate-500 uppercase">Humidity</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
          <Wind className="w-6 h-6 text-slate-500" />
          <span className="text-2xl font-black text-slate-800">18 km/h</span>
          <span className="text-xs font-bold text-slate-500 uppercase">Wind</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center gap-2">
          <CloudLightning className="w-6 h-6 text-amber-500" />
          <span className="text-2xl font-black text-slate-800">75%</span>
          <span className="text-xs font-bold text-slate-500 uppercase">T-Storm Prob.</span>
        </div>
      </div>

      {/* Forecast Timeline */}
      <h2 className="text-lg font-black text-slate-900 pt-4">Forecast Timeline</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { time: '+3 Hours', rain: '45 mm', level: 'HIGH' },
          { time: '+6 Hours', rain: '60 mm', level: 'VERY HIGH' },
          { time: '+12 Hours', rain: '20 mm', level: 'MODERATE' },
          { time: '+24 Hours', rain: '5 mm', level: 'LOW' }
        ].map((f, i) => (
          <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center gap-3">
            <span className="font-bold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-200 text-sm shadow-sm">{f.time}</span>
            <div className="space-y-1">
              <CloudRain className={`w-8 h-8 mx-auto ${f.level === 'VERY HIGH' ? 'text-red-500' : f.level === 'HIGH' ? 'text-orange-500' : 'text-blue-500'}`} />
              <div className="font-black text-xl text-slate-900">{f.rain}</div>
            </div>
            <RiskMeter level={f.level as any} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
};
