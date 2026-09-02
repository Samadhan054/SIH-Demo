import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { MonitoringStation } from '../types';

interface StationChartProps {
  station: MonitoringStation;
}

export const StationChart: React.FC<StationChartProps> = ({ station }) => {
  const chartData = station.telemetryHistory.map((pt) => {
    const d = new Date(pt.timestamp);
    const timeStr = `${d.getHours().toString().padStart(2, '0')}:00`;
    return {
      time: timeStr,
      waterLevel: pt.waterLevel,
      rainfall: pt.rainfall,
      soilMoisture: pt.soilMoisture,
    };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">{station.name} — 24 Hour Trend Readout</h3>
          <p className="text-xs text-slate-500">
            River: {station.riverName || 'N/A'} | District: {station.district}
          </p>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500">Water Level: </span>
            <strong className="text-sky-700 font-bold">{station.waterLevel.toFixed(2)} m</strong>
          </div>
          <div>
            <span className="text-slate-500">Rainfall: </span>
            <strong className="text-blue-700 font-bold">{station.rainfall.toFixed(1)} mm/h</strong>
          </div>
          <div>
            <span className="text-slate-500">Rise Rate: </span>
            <strong className={station.riseRate > 0.8 ? 'text-red-600 font-bold' : 'text-amber-700 font-bold'}>
              +{station.riseRate.toFixed(2)} m/h
            </strong>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} domain={[0, 'auto']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '10px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#0f172a' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

            {station.dangerLevel > 0 && (
              <ReferenceLine
                y={station.dangerLevel}
                label={{ value: `DANGER (${station.dangerLevel}m)`, fill: '#dc2626', fontSize: 10, position: 'insideTopRight' }}
                stroke="#dc2626"
                strokeDasharray="4 4"
              />
            )}

            {station.warningLevel > 0 && (
              <ReferenceLine
                y={station.warningLevel}
                label={{ value: `WARNING (${station.warningLevel}m)`, fill: '#d97706', fontSize: 10, position: 'insideTopLeft' }}
                stroke="#d97706"
                strokeDasharray="3 3"
              />
            )}

            <Area
              type="monotone"
              dataKey="waterLevel"
              name="Water Level (m)"
              stroke="#0284c7"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#waterGrad)"
            />
            <Area
              type="monotone"
              dataKey="rainfall"
              name="Rainfall Intensity (mm/h)"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#rainGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
