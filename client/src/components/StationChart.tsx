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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-bold text-slate-100 text-sm">{station.name} — 24 Hour Trend</h3>
          <p className="text-xs text-slate-400">
            River: {station.riverName || 'N/A'} | District: {station.district}
          </p>
        </div>
        <div className="flex gap-4 text-xs">
          <div>
            <span className="text-slate-400">Water Level: </span>
            <strong className="text-cyan-400">{station.waterLevel.toFixed(2)} m</strong>
          </div>
          <div>
            <span className="text-slate-400">Rainfall: </span>
            <strong className="text-blue-400">{station.rainfall.toFixed(1)} mm/h</strong>
          </div>
          <div>
            <span className="text-slate-400">Rise Rate: </span>
            <strong className={station.riseRate > 0.8 ? 'text-red-400' : 'text-amber-400'}>
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
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} domain={[0, 'auto']} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

            {station.dangerLevel > 0 && (
              <ReferenceLine
                y={station.dangerLevel}
                label={{ value: `DANGER (${station.dangerLevel}m)`, fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }}
                stroke="#ef4444"
                strokeDasharray="4 4"
              />
            )}

            {station.warningLevel > 0 && (
              <ReferenceLine
                y={station.warningLevel}
                label={{ value: `WARNING (${station.warningLevel}m)`, fill: '#f59e0b', fontSize: 10, position: 'insideTopLeft' }}
                stroke="#f59e0b"
                strokeDasharray="3 3"
              />
            )}

            <Area
              type="monotone"
              dataKey="waterLevel"
              name="Water Level (m)"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#waterGrad)"
            />
            <Area
              type="monotone"
              dataKey="rainfall"
              name="Rainfall Intensity (mm/h)"
              stroke="#3b82f6"
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
