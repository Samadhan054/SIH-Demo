import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useLanguage } from '../context/LanguageContext';
import { MapView } from '../components/MapView';
import { StationChart } from '../components/StationChart';
import { RiskBadge } from '../components/RiskBadge';
import { MonitoringStation, RiskLevel } from '../types';
import { Activity, Clock, Filter, Waves, CloudRain, Shield, AlertTriangle, Layers } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { stations, zones, incidents } = useSocket();
  const { t, liteMode } = useLanguage();

  const [selectedStation, setSelectedStation] = useState<MonitoringStation | null>(stations[0] || null);
  const [filterDistrict, setFilterDistrict] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [predictiveHours, setPredictiveHours] = useState<number>(0); // 0, 3, 6, 12, 24

  const filteredStations = stations.filter((s) => {
    if (filterDistrict !== 'ALL' && s.district.toLowerCase() !== filterDistrict.toLowerCase()) return false;
    if (filterRisk !== 'ALL' && s.riskLevel !== filterRisk) return false;
    return true;
  });

  const activeStation = selectedStation || filteredStations[0] || stations[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Predictive Risk Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-cyan-400" />
            Live Hilly Risk Dashboard & GIS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time IoT water gauge telemetry, cloudburst radar, and predictive risk escalation for Himalayan catchments.
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
        /* Lite Mode: Text-only lightweight dashboard */
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="p-3 bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs rounded-lg font-mono">
            ⚡ LITE MODE ACTIVE: Low bandwidth text representation of risk map
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map((z) => (
              <div key={z.id} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-white">{z.name}</h3>
                  <RiskBadge level={z.riskLevel} score={z.riskScore} />
                </div>
                <p className="text-xs text-slate-400">District: {z.district} | Population: {z.totalPopulation}</p>
                <div className="text-xs text-slate-300">
                  <strong>Safe Zone:</strong> {z.safeEvacuationPoint.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Standard Mode: Interactive Map */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <MapView
              stations={filteredStations}
              zones={zones}
              incidents={incidents}
              selectedStationId={activeStation?.id}
              onSelectStation={(st) => setSelectedStation(st)}
              predictiveHours={predictiveHours}
            />

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                <Filter className="w-4 h-4 text-cyan-400" /> Filter Stations:
              </div>

              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="bg-slate-950 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-lg focus:outline-none"
              >
                <option value="ALL">All Districts</option>
                <option value="Sindhupalchok">Sindhupalchok</option>
                <option value="Nuwakot">Nuwakot</option>
                <option value="Kathmandu">Kathmandu</option>
                <option value="Lamjung">Lamjung</option>
                <option value="Kaski">Kaski</option>
                <option value="Mustang">Mustang</option>
              </select>

              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="bg-slate-950 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-lg focus:outline-none"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="SEVERE">SEVERE Only</option>
                <option value="HIGH">HIGH Only</option>
                <option value="MODERATE">MODERATE Only</option>
                <option value="LOW">LOW Only</option>
              </select>

              <div className="ml-auto text-slate-400 font-mono text-[11px]">
                Showing {filteredStations.length} of {stations.length} stations
              </div>
            </div>
          </div>

          {/* Right Sidebar: Selected Station Inspector */}
          <div className="space-y-4">
            {activeStation && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h2 className="font-extrabold text-white text-base">{activeStation.name}</h2>
                    <p className="text-xs text-slate-400">
                      ID: {activeStation.id} | {activeStation.district}
                    </p>
                  </div>
                  <RiskBadge level={activeStation.riskLevel} score={activeStation.riskScore} />
                </div>

                {/* Telemetry Metrics Cards */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Waves className="w-3.5 h-3.5 text-cyan-400" /> Water Level
                    </span>
                    <p className="text-lg font-black text-cyan-400 font-mono mt-1">
                      {activeStation.waterLevel.toFixed(2)} m
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Danger Mark: {activeStation.dangerLevel}m</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 flex items-center gap-1">
                      <CloudRain className="w-3.5 h-3.5 text-blue-400" /> Rainfall
                    </span>
                    <p className="text-lg font-black text-blue-400 font-mono mt-1">
                      {activeStation.rainfall.toFixed(1)} mm/h
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Humidity: {activeStation.humidity}%</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400">Rise Rate</span>
                    <p className={`text-base font-extrabold font-mono mt-1 ${activeStation.riseRate > 0.8 ? 'text-red-400' : 'text-amber-400'}`}>
                      +{activeStation.riseRate.toFixed(2)} m/h
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400">Soil Saturation</span>
                    <p className="text-base font-extrabold text-slate-200 font-mono mt-1">
                      {activeStation.soilMoisture}%
                    </p>
                  </div>
                </div>

                {/* DEM Terrain Factors */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div className="text-slate-400 font-semibold flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-400" /> Terrain DEM Analysis:
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Slope Gradient:</span>
                    <strong>{activeStation.slopeGradient}°</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Valley Narrowness Factor:</span>
                    <strong>{activeStation.valleyNarrowness}x surge</strong>
                  </div>
                </div>
              </div>
            )}

            {/* List of Stations for fast click selection */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 max-h-80 overflow-y-auto">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Station Directory</h3>
              <div className="space-y-2">
                {filteredStations.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStation(st)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex items-center justify-between ${
                      activeStation?.id === st.id
                        ? 'bg-slate-800 border-cyan-500/50 text-white font-bold'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div>{st.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{st.waterLevel.toFixed(2)}m | +{st.riseRate.toFixed(2)}m/h</div>
                    </div>
                    <RiskBadge level={st.riskLevel} size="sm" showPulse={false} />
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
