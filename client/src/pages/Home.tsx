import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Radio,
  Shield,
  Activity,
  ArrowRight,
  Waves,
  CloudRain,
  MapPin,
  Flame,
  Zap,
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useLanguage } from '../context/LanguageContext';
import { RiskBadge } from '../components/RiskBadge';

export const Home: React.FC = () => {
  const { stations, zones, incidents } = useSocket();
  const { t, liteMode } = useLanguage();

  const severeZones = zones.filter((z) => z.riskLevel === 'SEVERE');
  const activeSOS = incidents.filter((i) => i.status !== 'RESCUED');

  return (
    <div className="space-y-8 pb-12">
      {/* First Aid CTA Card - Added for Phase 3 */}
      <section className="bg-white border-2 border-red-500 rounded-2xl p-5 shadow-lg shadow-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Need Emergency First Aid?</h2>
            <p className="text-sm text-slate-600 font-medium">
              Request first-aid assistance from the nearest configured rescue center.
            </p>
          </div>
        </div>
        <Link
          to="/first-aid-sos"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shrink-0"
        >
          <Zap className="w-5 h-5" />
          <span>REQUEST FIRST AID KIT</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-red-50/50 border border-slate-200 p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-red-600 animate-pulse" />
            CWC & Himalayan Early Warning Portal
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Flash Flood Prediction & Satellite Emergency Rescue
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            Integrating IoT river sensors, CWC river thresholds, rainfall radar, NASA soil moisture satellites, and terrain models to predict mountain flash floods in real time — and connect at-risk citizens via satellite SOS.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/sos"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-2 shadow-xl shadow-red-200 border border-red-400/40 animate-pulse"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>{t('reportEmergency')}</span>
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm sm:text-base flex items-center gap-2 border border-slate-300 shadow-md"
            >
              <Activity className="w-5 h-5 text-sky-600" />
              <span>View Live Risk Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Snapshot Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">River Stations Online</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stations.filter((s) => s.status === 'ONLINE').length} / {stations.length}
            </h3>
            <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> Live Telemetry
            </p>
          </div>
          <div className="p-3 bg-sky-50 border border-sky-200 text-sky-700 rounded-xl">
            <Waves className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Severe Risk Corridors</p>
            <h3 className="text-2xl font-black text-red-600 mt-1">{severeZones.length} Corridors</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {severeZones[0]?.name || 'Sindhupalchok'}
            </p>
          </div>
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Active SOS Signals</p>
            <h3 className="text-2xl font-black text-amber-700 mt-1">{activeSOS.length} Emergency</h3>
            <p className="text-[11px] text-slate-500 mt-1">Satellite & Cellular</p>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl">
            <Radio className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Low Bandwidth Mode</p>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{liteMode ? 'Active' : 'Standard'}</h3>
            <p className="text-[11px] text-slate-500 mt-1">2G / Satellite Friendly</p>
          </div>
          <div className="p-3 bg-slate-100 border border-slate-300 text-slate-700 rounded-xl">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Severe Zone Highlight Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Current Hilly Region Risk Zones
          </h2>
          <Link to="/dashboard" className="text-xs text-sky-700 hover:underline font-bold flex items-center gap-1">
            Explore Full Map <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{zone.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> District: {zone.district}
                  </p>
                </div>
                <RiskBadge level={zone.riskLevel} score={zone.riskScore} />
              </div>

              <div className="text-xs space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-slate-800 font-bold mb-1">Primary Risk Drivers:</div>
                {zone.primaryRiskFactors.map((factor, idx) => (
                  <div key={idx} className="text-slate-600 flex items-center gap-1.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 text-slate-600">
                <span>At-risk Population: <strong className="text-slate-900">{zone.totalPopulation.toLocaleString()}</strong></span>
                <span>Safe High-Ground: <strong className="text-sky-700 font-bold">{zone.safeEvacuationPoint.name}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Telemetry Table */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Waves className="w-5 h-5 text-sky-600" />
          Live River Gauge & Met Sensor Readings
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-mono tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3">Station Name</th>
                <th className="p-3">River / District</th>
                <th className="p-3">Water Level</th>
                <th className="p-3">Rise Rate</th>
                <th className="p-3">Rainfall</th>
                <th className="p-3">Soil Moisture</th>
                <th className="p-3">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {stations.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{st.name}</td>
                  <td className="p-3 text-slate-600">{st.riverName || '-'} ({st.district})</td>
                  <td className="p-3 font-mono font-bold text-sky-700">{st.waterLevel.toFixed(2)} m</td>
                  <td className="p-3 font-mono font-bold text-amber-700">+{st.riseRate.toFixed(2)} m/h</td>
                  <td className="p-3 font-mono text-blue-700 font-bold">{st.rainfall.toFixed(1)} mm/h</td>
                  <td className="p-3 font-mono font-bold">{st.soilMoisture}%</td>
                  <td className="p-3">
                    <RiskBadge level={st.riskLevel} score={st.riskScore} size="sm" showPulse={false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
