import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useLanguage } from '../context/LanguageContext';
import { RiskBadge } from '../components/RiskBadge';
import {
  Bell,
  Shield,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Flame,
} from 'lucide-react';

export const Alerts: React.FC = () => {
  const { alerts, zones } = useSocket();
  const { t } = useLanguage();

  const [subscribedDistrict, setSubscribedDistrict] = useState('Sindhupalchok');
  const [subscribed, setSubscribed] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" />
            Citizen Emergency Alerts & Safe Zones
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time push notifications, evacuation routes, and high-ground shelter directory for mountain communities.
          </p>
        </div>

        {/* Subscription Control */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Your District Subscription:</span>
            <select
              value={subscribedDistrict}
              onChange={(e) => setSubscribedDistrict(e.target.value)}
              className="bg-transparent text-white font-bold cursor-pointer focus:outline-none"
            >
              <option value="Sindhupalchok" className="bg-slate-900">Sindhupalchok</option>
              <option value="Nuwakot" className="bg-slate-900">Nuwakot</option>
              <option value="Kathmandu" className="bg-slate-900">Kathmandu</option>
              <option value="Lamjung" className="bg-slate-900">Lamjung</option>
              <option value="Kaski" className="bg-slate-900">Kaski</option>
            </select>
          </div>

          <button
            onClick={() => setSubscribed(!subscribed)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              subscribed
                ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {subscribed ? 'Subscribed ✓' : 'Subscribe'}
          </button>
        </div>
      </div>

      {/* Active District Evacuation Routes & High Ground Shelters */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Navigation className="w-5 h-5 text-sky-400" />
          Recommended Evacuation Routes & High Ground Safe Zones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{zone.name}</h3>
                  <p className="text-xs text-slate-400">District: {zone.district}</p>
                </div>
                <RiskBadge level={zone.riskLevel} score={zone.riskScore} />
              </div>

              <div className="bg-sky-950/60 border border-sky-500/30 p-3 rounded-xl text-xs space-y-1 text-sky-200">
                <div className="font-bold text-sky-300 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-sky-400" />
                  Designated High-Ground Shelter:
                </div>
                <div className="text-sm font-black text-white">{zone.safeEvacuationPoint.name}</div>
                <div className="text-[11px] text-sky-300">
                  Capacity: {zone.safeEvacuationPoint.capacity} people | GPS: {zone.safeEvacuationPoint.lat.toFixed(3)}, {zone.safeEvacuationPoint.lng.toFixed(3)}
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="font-semibold text-slate-400">Evacuation Guidance:</span>
                <p className="text-slate-300 leading-relaxed">
                  Move perpendicularly up the valley slope away from the river bank. Avoid low-lying suspension bridges.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Broadcast Alert Log */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-red-500" />
          Active District Emergency Warnings Log
        </h2>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border shadow-lg space-y-2.5 ${
                alert.severity === 'SEVERE'
                  ? 'bg-gradient-to-r from-red-950/90 via-slate-900 to-slate-950 border-red-500/50'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-red-950 border border-red-500/40 text-red-400 text-xs font-mono font-bold px-2 py-0.5 rounded">
                    {alert.district} District
                  </span>
                  <span className="text-xs text-slate-400 font-mono">ID: {alert.id}</span>
                </div>
                <span className="text-xs text-slate-400">
                  Issued: {new Date(alert.issuedAt).toLocaleTimeString()}
                </span>
              </div>

              <h3 className="font-black text-white text-base">{alert.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>

              <div className="p-3 bg-red-950/60 border border-red-500/30 rounded-xl text-xs text-red-200 font-medium">
                <strong>Recommended Action:</strong> {alert.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
