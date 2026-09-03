// Hill Area Multi-Disaster Risk Service
// DEMO RULE-BASED ENGINE — Not scientifically validated for operational use

import { ExtendedRiskLevel, HillRegion } from '../types.js';

// Configurable risk weights (can be updated from admin config)
export const RISK_WEIGHTS = {
  rainfall: 0.25,
  soilSaturation: 0.25,
  groundDisplacement: 0.20,
  weatherForecast: 0.15,
  terrainVulnerability: 0.15,
};

export function scoreToLevel(score: number): ExtendedRiskLevel {
  if (score >= 80) return 'CRITICAL';
  if (score >= 65) return 'VERY HIGH';
  if (score >= 50) return 'HIGH';
  if (score >= 30) return 'MODERATE';
  return 'LOW';
}

export function calculateHillRisk(params: {
  rainfallMmh: number;
  soilSaturationPct: number;
  groundDisplacementMm: number;
  forecastRainfallMm: number;
  slopeAngle: number;
  historicalVulnerability: number; // 0-1
}): { score: number; level: ExtendedRiskLevel; factors: string[] } {
  const rainFactor = Math.min(100, (params.rainfallMmh / 70) * 100);
  const soilFactor = params.soilSaturationPct;
  const displaceFactor = Math.min(100, (params.groundDisplacementMm / 50) * 100);
  const forecastFactor = Math.min(100, (params.forecastRainfallMm / 100) * 100);
  const terrainFactor = Math.min(100, ((params.slopeAngle / 45) + params.historicalVulnerability) * 50);

  const score = Math.round(
    RISK_WEIGHTS.rainfall * rainFactor +
    RISK_WEIGHTS.soilSaturation * soilFactor +
    RISK_WEIGHTS.groundDisplacement * displaceFactor +
    RISK_WEIGHTS.weatherForecast * forecastFactor +
    RISK_WEIGHTS.terrainVulnerability * terrainFactor
  );

  const factors: string[] = [];
  if (params.rainfallMmh > 40) factors.push(`High rainfall intensity (${params.rainfallMmh.toFixed(1)} mm/h)`);
  if (params.soilSaturationPct > 70) factors.push(`Critical soil saturation (${params.soilSaturationPct.toFixed(0)}%)`);
  if (params.groundDisplacementMm > 10) factors.push(`Ground displacement detected (${params.groundDisplacementMm.toFixed(1)} mm)`);
  if (params.forecastRainfallMm > 50) factors.push(`Heavy rainfall forecast`);
  if (params.slopeAngle > 30) factors.push(`Steep terrain slope (${params.slopeAngle}°)`);

  return { score: Math.min(100, Math.max(0, score)), level: scoreToLevel(score), factors };
}
