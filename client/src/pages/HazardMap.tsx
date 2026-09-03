import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { Layers, MapPin, AlertTriangle, ShieldPlus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export const HazardMap: React.FC = () => {
  const { t } = useLanguage();
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    'Flash Flood Risk': true,
    'Landslide Risk': true,
    'Soil Saturation': false,
    'Rescue Centers': true,
  });

  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const layersList = [
    'Flash Flood Risk', 'Landslide Risk', 'Soil Saturation', 'InSAR Ground Movement',
    'Avalanche Risk', 'Rainfall', 'Rivers/Streams', 'Rescue Centers',
    'Shelters', 'Safe Zones', 'Evacuation Routes'
  ];

  return (
    <div className="space-y-6 pb-12 flex flex-col h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('navHazardMap')}</h1>
          <p className="text-slate-500 text-sm">Hazard Map — Hilly Region Risk Layers</p>
        </div>
        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded font-bold text-xs border border-orange-200">
          DEMO MAP DATA
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Layer Controls Sidebar */}
        <div className="w-full lg:w-64 bg-white border border-slate-200 rounded-2xl shadow-md p-4 flex flex-col overflow-y-auto shrink-0">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4" /> Map Layers
          </h3>
          <div className="space-y-2">
            {layersList.map(layer => (
              <label key={layer} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 p-1.5 rounded">
                <input 
                  type="checkbox" 
                  checked={!!activeLayers[layer]}
                  onChange={() => toggleLayer(layer)}
                  className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer w-4 h-4 border-slate-300"
                />
                <span className={activeLayers[layer] ? 'font-bold' : ''}>{layer}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 bg-slate-200 rounded-2xl overflow-hidden shadow-inner border border-slate-300 relative min-h-[400px]">
          <MapContainer 
            center={[27.7, 85.3]} 
            zoom={8} 
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />
            
            {/* Mock Marker for interaction */}
            {activeLayers['Rescue Centers'] && (
              <Marker position={[27.7172, 85.3240]} eventHandlers={{ click: () => setSelectedFeature({ type: 'rescue', name: 'Kathmandu HQ' }) }}>
                <Popup>Rescue Center</Popup>
              </Marker>
            )}
            
            {activeLayers['Flash Flood Risk'] && (
              <Marker position={[27.9, 85.5]} eventHandlers={{ click: () => setSelectedFeature({ type: 'risk', name: 'Sindhupalchok Zone' }) }}>
                <Popup>High Risk Zone</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Details Panel */}
        {selectedFeature && (
          <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-2xl shadow-md p-5 flex flex-col shrink-0 animate-in slide-in-from-right">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-lg text-slate-900">{selectedFeature.name}</h3>
              <button onClick={() => setSelectedFeature(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            
            {selectedFeature.type === 'risk' ? (
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800">
                  <div className="font-bold flex items-center gap-1"><AlertTriangle className="w-4 h-4"/> Flash Flood Risk: VERY HIGH</div>
                </div>
                <div><strong>Landslide Risk:</strong> HIGH</div>
                <div><strong>Avalanche Risk:</strong> LOW</div>
                <div><strong>Soil Saturation:</strong> 88%</div>
                <div><strong>Recommended Action:</strong> Evacuate low-lying areas.</div>
                <div className="text-xs text-slate-400 pt-4 border-t">Last Updated: Just now</div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800">
                  <div className="font-bold flex items-center gap-1"><ShieldPlus className="w-4 h-4"/> Active Rescue Center</div>
                </div>
                <div><strong>Teams Deployed:</strong> 3</div>
                <div><strong>Helicopters:</strong> 1 Available</div>
                <div><strong>Status:</strong> ON ALERT</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
