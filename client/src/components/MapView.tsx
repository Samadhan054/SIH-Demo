import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MonitoringStation, RiskZone, SOSIncident } from '../types';
import { RiskBadge } from './RiskBadge';
import { Shield, Navigation, AlertCircle, Waves, CloudRain } from 'lucide-react';

interface MapViewProps {
  stations: MonitoringStation[];
  zones: RiskZone[];
  incidents?: SOSIncident[];
  selectedStationId?: string | null;
  onSelectStation?: (station: MonitoringStation) => void;
  predictiveHours?: number; // 0, 3, 6, 12, 24
}

// Fix default Leaflet icon paths in Vite bundle
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle map pan/zoom when station selected
const MapController: React.FC<{ selectedStation?: MonitoringStation | null }> = ({ selectedStation }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedStation) {
      map.flyTo([selectedStation.location.lat, selectedStation.location.lng], 12, {
        duration: 1.5,
      });
    }
  }, [selectedStation, map]);
  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  stations,
  zones,
  incidents = [],
  selectedStationId,
  onSelectStation,
  predictiveHours = 0,
}) => {
  const defaultCenter: [number, number] = [27.88, 85.50]; // Himalayan Region (Sindhupalchok/Nuwakot/Ktm)

  const getZoneColor = (level: string, score: number) => {
    // Escalate risk display based on predictive slider
    let effectiveScore = score + (predictiveHours * 0.015);
    if (effectiveScore >= 0.75) return { color: '#ef4444', fill: '#ef4444', opacity: 0.45 };
    if (effectiveScore >= 0.55) return { color: '#f97316', fill: '#f97316', opacity: 0.40 };
    if (effectiveScore >= 0.32) return { color: '#f59e0b', fill: '#f59e0b', opacity: 0.35 };
    return { color: '#10b981', fill: '#10b981', opacity: 0.25 };
  };

  const getStationColor = (level: string) => {
    switch (level) {
      case 'SEVERE': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MODERATE': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const selectedStation = stations.find((s) => s.id === selectedStationId);

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Header Controls Overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-xs shadow-lg max-w-xs">
        <div className="flex items-center justify-between gap-2 font-bold text-slate-200 mb-1">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-red-500" />
            <span>Himalayan Risk GIS Layer</span>
          </div>
          {predictiveHours > 0 && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-mono text-[10px]">
              +{predictiveHours}h Forecast
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 mt-1">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Severe
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Low
          </span>
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={9}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        {/* Dark Satellite Hybrid Carto Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> Data'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapController selectedStation={selectedStation} />

        {/* 1. Risk Zone Polygons */}
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
                <Popup className="custom-popup">
                  <div className="p-1 text-slate-900">
                    <div className="font-bold text-sm">{zone.name}</div>
                    <div className="text-xs text-slate-600 mb-2">District: {zone.district}</div>
                    <div className="mb-2">
                      <RiskBadge level={zone.riskLevel} score={zone.riskScore} />
                    </div>
                    <div className="text-xs space-y-1 bg-slate-100 p-2 rounded">
                      <div><strong>Population at Risk:</strong> {zone.totalPopulation.toLocaleString()}</div>
                      <div><strong>Avg Terrain Slope:</strong> {zone.slopeGradientAvg}°</div>
                      <div><strong>Safe Shelter:</strong> {zone.safeEvacuationPoint.name}</div>
                    </div>
                  </div>
                </Popup>
              </Polygon>

              {/* Safe Evacuation Marker */}
              <CircleMarker
                center={[zone.safeEvacuationPoint.lat, zone.safeEvacuationPoint.lng]}
                radius={8}
                pathOptions={{ color: '#0284c7', fillColor: '#38bdf8', fillOpacity: 0.9, weight: 2 }}
              >
                <Popup>
                  <div className="p-1 text-slate-900 text-xs">
                    <div className="font-bold text-sky-700 flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" />
                      {zone.safeEvacuationPoint.name}
                    </div>
                    <div>Safe Evacuation High Ground</div>
                    <div>Capacity: <strong>{zone.safeEvacuationPoint.capacity} people</strong></div>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {/* 2. Monitoring Stations Markers */}
        {stations.map((st) => {
          const color = getStationColor(st.riskLevel);
          return (
            <CircleMarker
              key={st.id}
              center={[st.location.lat, st.location.lng]}
              radius={10}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.85,
                weight: 3,
              }}
              eventHandlers={{
                click: () => onSelectStation && onSelectStation(st),
              }}
            >
              <Popup>
                <div className="p-1 text-slate-900 min-w-[200px]">
                  <div className="flex items-center justify-between font-bold text-sm border-b pb-1 mb-1">
                    <span>{st.name}</span>
                    <span className="text-[10px] font-mono bg-slate-200 px-1 rounded">{st.id}</span>
                  </div>

                  <div className="my-1">
                    <RiskBadge level={st.riskLevel} score={st.riskScore} size="sm" />
                  </div>

                  <div className="text-xs space-y-1 mt-2 bg-slate-50 p-2 rounded border">
                    {st.riverName && (
                      <div className="flex items-center justify-between text-cyan-800 font-semibold">
                        <span className="flex items-center gap-1"><Waves className="w-3 h-3" /> Water Level:</span>
                        <span>{st.waterLevel.toFixed(2)} m</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-blue-800">
                      <span className="flex items-center gap-1"><CloudRain className="w-3 h-3" /> Rainfall:</span>
                      <span>{st.rainfall.toFixed(1)} mm/h</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span>Rate of Rise:</span>
                      <strong className={st.riseRate > 0.8 ? 'text-red-600' : 'text-slate-800'}>
                        +{st.riseRate.toFixed(2)} m/h
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 text-[11px] pt-1 border-t">
                      <span>Soil Moisture:</span>
                      <span>{st.soilMoisture}%</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* 3. SOS Incident Markers */}
        {incidents
          .filter((i) => i.status !== 'RESCUED')
          .map((inc) => (
            <CircleMarker
              key={inc.id}
              center={[inc.location.lat, inc.location.lng]}
              radius={12}
              pathOptions={{
                color: '#ffffff',
                fillColor: inc.mode === 'SATELLITE' ? '#dc2626' : '#ea580c',
                fillOpacity: 0.95,
                weight: 3,
              }}
            >
              <Popup>
                <div className="p-1 text-slate-900 max-w-[220px]">
                  <div className="font-bold text-red-600 flex items-center gap-1 border-b pb-1">
                    <AlertCircle className="w-4 h-4 text-red-600 animate-bounce" />
                    <span>EMERGENCY SOS ({inc.mode})</span>
                  </div>
                  <div className="text-xs font-medium mt-1">{inc.citizenName} ({inc.headcount} People)</div>
                  <div className="text-[11px] text-slate-600 my-1 bg-red-50 p-1.5 rounded border border-red-200">
                    "{inc.note}"
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Urgency: <strong>{inc.medicalUrgency}</strong> | Status: <strong>{inc.status}</strong>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
};
