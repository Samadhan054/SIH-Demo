import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MonitoringStation, RiskZone, RiverThresholdRecord, SOSIncident } from '../types';
import { RiskBadge } from './RiskBadge';
import { Shield, Navigation, AlertCircle, Waves, CloudRain, HeartPulse, Clock, Radio, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface MapViewProps {
  stations: MonitoringStation[];
  zones: RiskZone[];
  rivers?: RiverThresholdRecord[];
  incidents?: SOSIncident[];
  selectedRiverId?: string | null;
  onSelectRiver?: (river: RiverThresholdRecord) => void;
  selectedStationId?: string | null;
  onSelectStation?: (station: MonitoringStation) => void;
  predictiveHours?: number;
  onAdvanceSOSStatus?: (incidentId: string, nextStatus: string) => void;
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapController: React.FC<{
  selectedRiver?: RiverThresholdRecord | null;
  selectedStation?: MonitoringStation | null;
}> = ({ selectedRiver, selectedStation }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedRiver && selectedRiver.coordinates && selectedRiver.coordinates.length > 0) {
      const center = selectedRiver.coordinates[Math.floor(selectedRiver.coordinates.length / 2)];
      map.flyTo(center, 7, { duration: 1.5 });
    } else if (selectedStation) {
      map.flyTo([selectedStation.location.lat, selectedStation.location.lng], 11, { duration: 1.5 });
    }
  }, [selectedRiver, selectedStation, map]);
  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  stations,
  zones,
  rivers = [],
  incidents = [],
  selectedRiverId,
  onSelectRiver,
  selectedStationId,
  onSelectStation,
  predictiveHours = 0,
  onAdvanceSOSStatus,
}) => {
  const { user } = useAuth();
  const defaultCenter: [number, number] = [25.5, 82.0]; // Overview of Indian Rivers / Himalayan Basins

  const selectedRiver = rivers.find((r) => r.id === selectedRiverId);
  const selectedStation = stations.find((s) => s.id === selectedStationId);

  const getZoneColor = (level: string, score: number) => {
    let effectiveScore = score + predictiveHours * 0.015;
    if (effectiveScore >= 0.75) return { color: '#ef4444', fill: '#ef4444', opacity: 0.45 };
    if (effectiveScore >= 0.55) return { color: '#f97316', fill: '#f97316', opacity: 0.40 };
    if (effectiveScore >= 0.32) return { color: '#f59e0b', fill: '#f59e0b', opacity: 0.35 };
    return { color: '#10b981', fill: '#10b981', opacity: 0.25 };
  };

  const getNextSOSStatus = (current: string) => {
    switch (current) {
      case 'SENT': return 'SATELLITE_RELAY';
      case 'SATELLITE_RELAY': return 'RECEIVED';
      case 'RECEIVED': return 'DISPATCHED';
      case 'DISPATCHED': return 'RESCUED';
      default: return 'RESCUED';
    }
  };

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Control Header */}
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs shadow-xl max-w-xs space-y-2">
        <div className="flex items-center justify-between gap-2 font-bold text-slate-100">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-red-500" />
            <span>CWC GIS Live River Layer</span>
          </div>
          {predictiveHours > 0 && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-mono text-[10px]">
              +{predictiveHours}h Forecast
            </span>
          )}
        </div>

        {/* River Selector Dropdown */}
        {rivers.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-mono">Select River Basin:</span>
            <select
              value={selectedRiverId || 'ALL'}
              onChange={(e) => {
                const riv = rivers.find((r) => r.id === e.target.value);
                if (riv && onSelectRiver) onSelectRiver(riv);
              }}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded px-2 py-1 text-xs focus:outline-none"
            >
              <option value="ALL">All Indian Rivers ({rivers.length})</option>
              {rivers.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.currentLevelM.toFixed(1)}m) {r.isBreached ? '⚠️ BREACH' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-ping" /> SOS Signal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Gauge
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" /> Safe Shelter
          </span>
        </div>
      </div>

      <MapContainer center={defaultCenter} zoom={6} scrollWheelZoom={true} className="w-full h-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapController selectedRiver={selectedRiver} selectedStation={selectedStation} />

        {/* 1. Render River Course Lines */}
        {rivers.map((river) => {
          if (!river.coordinates) return null;
          const isSelected = selectedRiverId === river.id;
          const isBreached = river.isBreached;

          return (
            <Polyline
              key={river.id}
              positions={river.coordinates}
              pathOptions={{
                color: isBreached ? '#ef4444' : isSelected ? '#38bdf8' : '#0284c7',
                weight: isSelected || isBreached ? 6 : 3,
                opacity: isSelected ? 0.95 : 0.7,
              }}
              eventHandlers={{
                click: () => onSelectRiver && onSelectRiver(river),
              }}
            >
              <Popup>
                <div className="p-1 text-slate-900 min-w-[260px]">
                  <div className="flex items-center justify-between font-bold text-sm border-b pb-1">
                    <span>{river.name} River</span>
                    <span className="text-[10px] font-mono bg-slate-200 px-1 rounded">{river.basin}</span>
                  </div>

                  {river.isBreached && (
                    <div className="mt-1.5 p-1.5 bg-red-100 border border-red-300 text-red-800 font-bold text-xs rounded flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 text-red-600 animate-bounce" />
                      FLOOD RISK BREACH: {river.breachSeverity} LEVEL
                    </div>
                  )}

                  {/* Recharts CWC Gauge Levels Readout */}
                  <div className="mt-2 text-xs space-y-1">
                    <div className="font-bold text-slate-700">CWC Threshold Gauge Readout:</div>
                    <div className="h-32 w-full mt-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            { level: 'Normal', value: river.normalLevelM },
                            { level: 'Warning', value: river.warningLevelM },
                            { level: 'Danger', value: river.dangerLevelM },
                            { level: 'Current', value: river.currentLevelM },
                          ]}
                          margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                        >
                          <XAxis dataKey="level" fontSize={9} />
                          <YAxis fontSize={9} />
                          <Tooltip />
                          <ReferenceLine y={river.dangerLevelM} stroke="#ef4444" strokeDasharray="3 3" />
                          <Area type="monotone" dataKey="value" stroke="#0284c7" fill="#38bdf8" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 mt-2 bg-slate-100 p-2 rounded border space-y-0.5">
                    <div>Current: <strong>{river.currentLevelM.toFixed(1)}m</strong> | Danger: <strong>{river.dangerLevelM}m</strong></div>
                    <div>Channel Shape: <strong>{river.channelShape}</strong></div>
                    <div className="text-[10px] text-slate-500 italic mt-1">{river.derivationNote}</div>
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* 2. Risk Zone Polygons */}
        {zones.map((zone) => {
          const style = getZoneColor(zone.riskLevel, zone.riskScore);
          return (
            <React.Fragment key={zone.id}>
              <Polygon
                positions={zone.coordinates}
                pathOptions={{
                  color: style.color,
                  fillColor: style.fill,
                  fillOpacity: style.opacity,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="p-1 text-slate-900">
                    <div className="font-bold text-sm">{zone.name}</div>
                    <div className="text-xs text-slate-600 mb-2">District: {zone.district}</div>
                    <RiskBadge level={zone.riskLevel} score={zone.riskScore} />
                  </div>
                </Popup>
              </Polygon>

              <CircleMarker
                center={[zone.safeEvacuationPoint.lat, zone.safeEvacuationPoint.lng]}
                radius={8}
                pathOptions={{ color: '#0284c7', fillColor: '#38bdf8', fillOpacity: 0.9, weight: 2 }}
              >
                <Popup>
                  <div className="p-1 text-slate-900 text-xs font-bold">
                    <Navigation className="w-3.5 h-3.5 inline text-sky-600 mr-1" />
                    {zone.safeEvacuationPoint.name} (Cap: {zone.safeEvacuationPoint.capacity})
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* 3. Monitoring Stations */}
        {stations.map((st) => (
          <CircleMarker
            key={st.id}
            center={[st.location.lat, st.location.lng]}
            radius={9}
            pathOptions={{ color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.85, weight: 2 }}
          >
            <Popup>
              <div className="p-1 text-slate-900 text-xs">
                <div className="font-bold text-sm">{st.name}</div>
                <div>Water: <strong>{st.waterLevel.toFixed(2)}m</strong> | Rise: <strong>+{st.riseRate.toFixed(2)}m/h</strong></div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* 4. Actionable SOS "People-in-Danger" Red Dot Markers */}
        {incidents
          .filter((i) => i.status !== 'RESCUED')
          .map((inc) => {
            const timeAgoMins = Math.floor((Date.now() - new Date(inc.timestamp).getTime()) / 60000);

            return (
              <CircleMarker
                key={inc.id}
                center={[inc.location.lat, inc.location.lng]}
                radius={12}
                pathOptions={{
                  color: '#ffffff',
                  fillColor: '#ef4444',
                  fillOpacity: 0.95,
                  weight: 3,
                }}
              >
                <Popup>
                  <div className="p-1 text-slate-900 max-w-[240px] space-y-2">
                    <div className="flex items-center justify-between font-bold text-red-600 border-b pb-1">
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-red-600 animate-bounce" />
                        PEOPLE IN DANGER ({inc.headcount})
                      </span>
                      <span className="text-[10px] font-mono bg-red-100 text-red-800 px-1 rounded">
                        {inc.mode}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="font-bold">{inc.citizenName} ({inc.phone})</div>
                      <div className="text-slate-600">{inc.location.addressDescription}</div>
                      <div className="italic text-slate-700 bg-red-50 p-1.5 rounded border border-red-200 text-[11px]">
                        "{inc.note}"
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 pt-1 border-t flex items-center justify-between">
                      <span>Signal: <strong>{timeAgoMins} mins ago</strong></span>
                      <span className="font-bold text-red-700">{inc.medicalUrgency}</span>
                    </div>

                    {/* Orbital Handshake Progression Status Badge */}
                    <div className="p-1.5 bg-slate-900 text-white rounded text-[11px] font-mono flex items-center justify-between">
                      <span>Handshake:</span>
                      <strong className="text-cyan-400">{inc.status}</strong>
                    </div>

                    {/* Actionable Advance Status Button (Rescue Team & Admin Roles) */}
                    {['RESCUE_TEAM', 'ADMIN'].includes(user.role) && (
                      <button
                        onClick={() => {
                          const next = getNextSOSStatus(inc.status);
                          if (onAdvanceSOSStatus) onAdvanceSOSStatus(inc.id, next);
                        }}
                        className="w-full py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-1 shadow"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Advance Status → {getNextSOSStatus(inc.status)}</span>
                      </button>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
};
