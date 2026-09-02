import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useLanguage } from '../context/LanguageContext';
import { MapView } from '../components/MapView';
import { StationChart } from '../components/StationChart';
import { RiskBadge } from '../components/RiskBadge';
import { MonitoringStation, RiverThresholdRecord } from '../types';
import { Activity, Clock, Filter, Waves, CloudRain, Shield, AlertTriangle, Layers, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { stations, zones, incidents, socket } = useSocket();
  const { t, liteMode } = useLanguage();
  const { token } = useAuth();

  const [rivers, setRivers] = useState<RiverThresholdRecord[]>([]);
  const [selectedRiver, setSelectedRiver] = useState<RiverThresholdRecord | null>(null);
  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(stations[0] || null);
  const [filterDistrict, setFilterDistrict] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [predictiveHours, setPredictiveHours] = useState<number>(0);

  const fetchRivers = async () => {
    try {
      const res = await fetch('/api/rivers');
      if (res.ok) {
        const data = await res.json();
        setRivers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRivers();

    if (socket) {
      socket.on('telemetry_tick', (data: any) => {
        if (data.rivers) setRivers(data.rivers);
      });
      socket.on('river_danger_breach', (data: any) => {
        if (data.river) {
          setRivers((prev) => prev.map((r) => (r.id === data.river.id ? data.river : r)));
        }
      });
    }
  }, [socket]);

  const handleAdvanceSOSStatus = async (incidentId: string, nextStatus: string) => {
    try {
      await fetch(`/api/incidents/${incidentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.error('Failed to advance SOS status:', err);
    }
  };

  const breachedRivers = rivers.filter((r) => r.isBreached);

  const filteredStations = stations.filter((s) => {
    if (filterDistrict !== 'ALL' && s.district.toLowerCase() !== filterDistrict.toLowerCase()) return false;
    if (filterRisk !== 'ALL' && s.riskLevel !== filterRisk) return false;
    return true;
  });

  const activeStation = selectedStation || filteredStations[0] || stations[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Active River Breach Emergency Flashing Red Banner */}
      {breachedRivers.length > 0 && (
        <div className="bg-gradient-to-r from-red-700 via-rose-600 to-red-800 border-2 border-red-400 p-4 rounded-2xl shadow-2xl text-white space-y-2 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 font-extrabold text-base">
              <AlertTriangle className="w-6 h-6 text-yellow-300 animate-bounce" />
              <span>FLOOD RISK BREACH — {breachedRivers.map((r) => r.name).join(', ')}</span>
            </div>
            <span className="bg-black/40 px-3 py-1 rounded-full text-xs font-mono text-yellow-300 font-bold border border-yellow-400/30">
              CWC DANGER BREACH
            </span>
          </div>
          <p className="text-xs text-red-100">
            {breachedRivers.length} river channel(s) crossed official CWC Danger / Extreme thresholds ({breachedRivers[0].name}: {breachedRivers[0].currentLevelM.toFixed(1)}m). Simulated SMS alerts sent to residents.
          </p>
        </div>
      )}

      {/* Header & Predictive Forecast Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            Live River-Linked Risk Map & GIS Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time IoT water gauge telemetry, CWC threshold registry, cloudburst radar, and actionable SOS markers.
          </p>
        </div>

        {/* Predictive Forecast Slider */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 w-full md:w-80">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Clock className="w-4 h-4 animate-spin" />
              {t('predictiveOverlay')}:
            </span>
            <strong className="text-amber-300 font-mono">+{predictiveHours} Hours</strong>
          </div>
          <input
            type="range"
            min={0}
            max={24}
            step={3}
            value={predictiveHours}
            onChange={(e) => setPredictiveHours(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Now</span>
            <span>+3h</span>
            <span>+6h</span>
            <span>+12h</span>
            <span>+24h</span>
          </div>
        </div>
      </div>

      {/* Main Grid: GIS Map + Station Inspector */}
      {liteMode ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="p-3 bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs rounded-lg font-mono">
            ⚡ LITE MODE ACTIVE: Low bandwidth text representation of river thresholds
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rivers.map((r) => (
              <div key={r.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold text-white">
                  <span>{r.name} River</span>
                  <span className={r.isBreached ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {r.currentLevelM.toFixed(1)}m / Danger: {r.dangerLevelM}m
                  </span>
                </div>
                <p className="text-slate-400">Basin: {r.basin} | Shape: {r.channelShape}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <MapView
              stations={filteredStations}
              zones={zones}
              rivers={rivers}
              incidents={incidents}
              selectedRiverId={selectedRiver?.id}
              onSelectRiver={(riv) => setSelectedRiver(riv)}
              selectedStationId={activeStation?.id}
              onSelectStation={(st) => setSelectedStation(st)}
              predictiveHours={predictiveHours}
              onAdvanceSOSStatus={handleAdvanceSOSStatus}
            />

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <Filter className="w-4 h-4 text-cyan-400" /> Filter Stations:
              </div>

              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="bg-slate-950 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-lg focus:outline-none"
              >
                <option value="ALL">All Catchment Districts</option>
                <option value="Sindhupalchok">Sindhupalchok</option>
                <option value="Nuwakot">Nuwakot</option>
                <option value="Kathmandu">Kathmandu</option>
                <option value="Lamjung">Lamjung</option>
                <option value="Kaski">Kaski</option>
                <option value="Mustang">Mustang</option>
              </select>

              <div className="ml-auto text-slate-400 font-mono text-[11px]">
                Showing {filteredStations.length} stations & {rivers.length} rivers
              </div>
            </div>
          </div>

          {/* Right Inspector */}
          <div className="space-y-4">
            {activeStation && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="font-extrabold text-white text-base">{activeStation.name}</h2>
                    <p className="text-xs text-slate-400">
                      ID: {activeStation.id} | River: {activeStation.riverName || 'N/A'}
                    </p>
                  </div>
                  <RiskBadge level={activeStation.riskLevel} score={activeStation.riskScore} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Waves className="w-3.5 h-3.5 text-cyan-400" /> Water Level
                    </span>
                    <p className="text-lg font-black text-cyan-400 font-mono mt-1">
                      {activeStation.waterLevel.toFixed(2)} m
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Danger: {activeStation.dangerLevel}m</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Rainfall
                    </span>
                    <p className="text-lg font-black text-blue-400 font-mono mt-1">
                      {activeStation.rainfall.toFixed(1)} mm/h
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Humidity: {activeStation.humidity}%</p>
                  </div>
                </div>
              </div>
            )}

            {/* River Registry Quick Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 max-h-80 overflow-y-auto">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">CWC River Registry</h3>
              <div className="space-y-2">
                {rivers.slice(0, 10).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRiver(r)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex items-center justify-between ${
                      selectedRiver?.id === r.id
                        ? 'bg-slate-800 border-cyan-500/50 text-white font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div>{r.name} ({r.basin})</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Level: {r.currentLevelM.toFixed(1)}m | Danger: {r.dangerLevelM}m
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.isBreached ? 'bg-red-950 text-red-400 animate-pulse' : 'bg-emerald-950 text-emerald-400'}`}>
                      {r.isBreached ? r.breachSeverity : 'NORMAL'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Series Chart */}
      {activeStation && (
        <section className="mt-6">
          <StationChart station={activeStation} />
        </section>
      )}
    </div>
  );
};
