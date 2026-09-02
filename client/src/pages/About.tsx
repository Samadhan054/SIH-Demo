import React, { useState } from 'react';
import { RiskBadge } from '../components/RiskBadge';

import {
  Code2,
  Sliders,
  Shield,
  Activity,
  Layers,
  CloudRain,
  Waves,
  Globe,
  Radio,
  FileCode,
} from 'lucide-react';

export const About: React.FC = () => {
  // Calculator Sandbox State
  const [rainfall, setRainfall] = useState(65);
  const [riseRate, setRiseRate] = useState(1.4);
  const [waterLevel, setWaterLevel] = useState(5.2);
  const [dangerLevel, setDangerLevel] = useState(6.0);
  const [soilMoisture, setSoilMoisture] = useState(88);
  const [slopeGradient, setSlopeGradient] = useState(35);
  const [valleyNarrowness, setValleyNarrowness] = useState(1.8);

  // Risk Score Calculation Formula
  const rainFactor = Math.min(1.0, rainfall / 70.0);
  const riseFactor = Math.min(1.0, Math.max(0, riseRate) / 2.0);
  const levelFactor = Math.min(1.0, waterLevel / dangerLevel);
  const soilFactor = Math.min(1.0, soilMoisture / 100.0);
  const terrainFactor = Math.min(1.0, (slopeGradient / 45.0) * valleyNarrowness);

  const calcScore = Number(
    (
      0.35 * rainFactor +
      0.30 * riseFactor +
      0.15 * levelFactor +
      0.10 * soilFactor +
      0.10 * terrainFactor
    ).toFixed(3)
  );

  let calcLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' = 'LOW';
  if (calcScore >= 0.75 || waterLevel / dangerLevel >= 1.0) calcLevel = 'SEVERE';
  else if (calcScore >= 0.55 || waterLevel / dangerLevel >= 0.85) calcLevel = 'HIGH';
  else if (calcScore >= 0.32 || waterLevel / dangerLevel >= 0.70) calcLevel = 'MODERATE';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-2">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Code2 className="w-6 h-6 text-cyan-400" />
          System Methodology & Risk Algorithm Sandbox
        </h1>
        <p className="text-xs text-slate-400">
          Learn how FloodGuard calculates flash flood risk scores and explore developer guides for plugging in live weather, IoT, and satellite APIs.
        </p>
      </div>

      {/* Interactive Risk Formula Sandbox */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Interactive Risk Score Sandbox</h2>
          </div>
          <RiskBadge level={calcLevel} score={calcScore} size="lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Sliders */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Rainfall Intensity (R):</span>
                <strong className="text-blue-400 font-mono">{rainfall} mm/h</strong>
              </div>
              <input
                type="range"
                min={0}
                max={120}
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>River Rise Rate (W_rate):</span>
                <strong className="text-amber-400 font-mono">+{riseRate.toFixed(2)} m/h</strong>
              </div>
              <input
                type="range"
                min={0}
                max={3.5}
                step={0.1}
                value={riseRate}
                onChange={(e) => setRiseRate(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Water Level / Danger Threshold:</span>
                <strong className="text-cyan-400 font-mono">
                  {waterLevel}m / {dangerLevel}m
                </strong>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={0.1}
                value={waterLevel}
                onChange={(e) => setWaterLevel(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Soil Saturation (S):</span>
                <strong className="text-emerald-400 font-mono">{soilMoisture}%</strong>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Slope Gradient (G):</span>
                <strong className="text-rose-400 font-mono">{slopeGradient}°</strong>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={slopeGradient}
                onChange={(e) => setSlopeGradient(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300 font-semibold">
                <span>Valley Narrowness Funnel Factor:</span>
                <strong className="text-purple-400 font-mono">{valleyNarrowness}x</strong>
              </div>
              <input
                type="range"
                min={1.0}
                max={2.5}
                step={0.1}
                value={valleyNarrowness}
                onChange={(e) => setValleyNarrowness(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>
          </div>

          {/* Mathematical Weights & Breakdown */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-mono text-xs text-slate-400 uppercase tracking-wider">Formula Weights Breakdown</h3>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between p-2 rounded bg-slate-900">
                <span>35% Rain Factor (F_rain):</span>
                <span className="text-blue-400 font-bold">{(0.35 * rainFactor).toFixed(3)}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900">
                <span>30% Rise Rate Factor (F_rise):</span>
                <span className="text-amber-400 font-bold">{(0.30 * riseFactor).toFixed(3)}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900">
                <span>15% Level Proximity (F_level):</span>
                <span className="text-cyan-400 font-bold">{(0.15 * levelFactor).toFixed(3)}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900">
                <span>10% Soil Saturation (F_soil):</span>
                <span className="text-emerald-400 font-bold">{(0.10 * soilFactor).toFixed(3)}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900">
                <span>10% DEM Terrain Slope (F_dem):</span>
                <span className="text-rose-400 font-bold">{(0.10 * terrainFactor).toFixed(3)}</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
                <span className="text-white">Total Risk Index:</span>
                <span className="text-red-400">{(calcScore * 100).toFixed(1)}% ({calcScore})</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Swappable Data Adapters Documentation */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-cyan-400" />
          Swappable Architecture & API Plug-In Guide
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed">
          FloodGuard is designed with swappable data adapters located in <code className="text-cyan-400 bg-slate-950 px-1 py-0.5 rounded">server/src/adapters/</code>. Live production keys for OpenWeatherMap, IMD, NASA SMAP, or Sentinel-1 can be plugged into the adapter classes without breaking existing code.
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs font-mono">
          <div className="text-slate-400">// How to plug in real APIs in server/src/adapters/weatherAdapter.ts</div>
          <pre className="text-slate-300 overflow-x-auto p-3 bg-slate-900 rounded border border-slate-800/80">
{`// 1. OpenWeatherMap Adapter
const res = await fetch(
  \`https://api.openweathermap.org/data/2.5/weather?lat=\${lat}&lon=\${lng}&appid=\${process.env.OPENWEATHER_KEY}&units=metric\`
);

// 2. NASA POWER Agroclimatology Satellite Soil Moisture API
const nasaRes = await fetch(
  \`https://power.larc.nasa.gov/api/temporal/daily/point?parameters=GWETTOP&community=AG&longitude=\${lng}&latitude=\${lat}&format=JSON\`
);`}
          </pre>
        </div>
      </section>
    </div>
  );
};
