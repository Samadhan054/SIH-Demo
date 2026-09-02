import { MonitoringStation, RiskLevel, RiskZone, RiverThresholdRecord } from '../types.js';

/**
 * Calculates the Flash Flood Risk Score (0.0 to 1.0) and assigns a RiskLevel
 * based on multi-source parameters: rainfall, rise rate, river threshold breaches, soil moisture, and DEM terrain.
 */
export function calculateStationRisk(
  station: Omit<MonitoringStation, 'riskScore' | 'riskLevel'>,
  riverRecord?: RiverThresholdRecord
): {
  riskScore: number;
  riskLevel: RiskLevel;
} {
  // 1. Rainfall intensity factor (0 to 1.0). Cloudburst > 70mm/h is extreme.
  const rainFactor = Math.min(1.0, station.rainfall / 70.0);

  // 2. River water rise rate factor (0 to 1.0). > 2.0 m/h is rapid surge.
  const riseFactor = Math.min(1.0, Math.max(0, station.riseRate) / 2.0);

  // 3. Current water level ratio relative to station danger threshold.
  const levelRatio = station.dangerLevel > 0 ? station.waterLevel / station.dangerLevel : 0;
  const levelFactor = Math.min(1.0, levelRatio);

  // 4. Per-River CWC Threshold Breach Factor (F_threshold)
  let thresholdFactor = 0.0;
  if (riverRecord) {
    if (riverRecord.currentLevelM >= riverRecord.extremeLevelM) {
      thresholdFactor = 1.0;
    } else if (riverRecord.currentLevelM >= riverRecord.dangerLevelM) {
      const margin = riverRecord.extremeLevelM - riverRecord.dangerLevelM;
      thresholdFactor = 0.75 + (margin > 0 ? 0.25 * ((riverRecord.currentLevelM - riverRecord.dangerLevelM) / margin) : 0.25);
    } else if (riverRecord.currentLevelM >= riverRecord.warningLevelM) {
      const margin = riverRecord.dangerLevelM - riverRecord.warningLevelM;
      thresholdFactor = 0.40 + (margin > 0 ? 0.35 * ((riverRecord.currentLevelM - riverRecord.warningLevelM) / margin) : 0.35);
    } else {
      thresholdFactor = Math.min(0.40, riverRecord.currentLevelM / Math.max(1, riverRecord.warningLevelM));
    }
  } else {
    thresholdFactor = Math.min(1.0, levelRatio * 0.8);
  }

  // 5. Soil moisture saturation factor (0 to 1.0).
  const soilFactor = Math.min(1.0, Math.max(0, station.soilMoisture / 100.0));

  // 6. DEM Terrain slope & valley funneling factor.
  const terrainBase = (station.slopeGradient / 45.0) * (station.valleyNarrowness || 1.0);
  const terrainFactor = Math.min(1.0, terrainBase);

  // Updated Weighted Calculation (Weights sum to 1.0)
  const score =
    0.30 * rainFactor +
    0.25 * riseFactor +
    0.15 * levelFactor +
    0.15 * thresholdFactor +
    0.08 * soilFactor +
    0.07 * terrainFactor;

  const roundedScore = Math.min(1.0, Math.max(0.0, Number(score.toFixed(3))));

  let riskLevel: RiskLevel = 'LOW';
  if (roundedScore >= 0.75 || levelRatio >= 1.0 || (riverRecord && riverRecord.currentLevelM >= riverRecord.extremeLevelM)) {
    riskLevel = 'SEVERE';
  } else if (roundedScore >= 0.55 || levelRatio >= 0.85 || (riverRecord && riverRecord.currentLevelM >= riverRecord.dangerLevelM)) {
    riskLevel = 'HIGH';
  } else if (roundedScore >= 0.32 || levelRatio >= 0.7 || (riverRecord && riverRecord.currentLevelM >= riverRecord.warningLevelM)) {
    riskLevel = 'MODERATE';
  } else {
    riskLevel = 'LOW';
  }

  return { riskScore: roundedScore, riskLevel };
}

/**
 * Calculates Risk Level for a geographic zone based on monitoring stations located within/near it.
 */
export function calculateZoneRisk(zone: RiskZone, stations: MonitoringStation[]): {
  riskScore: number;
  riskLevel: RiskLevel;
  primaryRiskFactors: string[];
} {
  const zoneStations = stations.filter(s => s.district.toLowerCase() === zone.district.toLowerCase());
  const relevantStations = zoneStations.length > 0 ? zoneStations : stations;
  const avgStationScore = relevantStations.reduce((acc, s) => acc + s.riskScore, 0) / relevantStations.length;
  const maxStationScore = Math.max(...relevantStations.map(s => s.riskScore));

  const zoneScore = Number((0.6 * maxStationScore + 0.4 * avgStationScore).toFixed(3));

  const factors: string[] = [];
  const maxStation = relevantStations.reduce((prev, curr) => curr.riskScore > prev.riskScore ? curr : prev, relevantStations[0]);

  if (maxStation) {
    if (maxStation.rainfall > 35) factors.push(`Heavy rainfall (${maxStation.rainfall} mm/h)`);
    if (maxStation.riseRate > 0.8) factors.push(`Rapid river rise (+${maxStation.riseRate} m/h)`);
    if (maxStation.soilMoisture > 80) factors.push(`High soil saturation (${maxStation.soilMoisture}%)`);
    if (zone.slopeGradientAvg > 25) factors.push(`Steep mountain terrain slope (${zone.slopeGradientAvg}°)`);
  }

  if (factors.length === 0) {
    factors.push('Normal seasonal water runoff');
  }

  let riskLevel: RiskLevel = 'LOW';
  if (zoneScore >= 0.75) riskLevel = 'SEVERE';
  else if (zoneScore >= 0.55) riskLevel = 'HIGH';
  else if (zoneScore >= 0.32) riskLevel = 'MODERATE';

  return {
    riskScore: zoneScore,
    riskLevel,
    primaryRiskFactors: factors,
  };
}

/**
 * Calculates priority score for sorting emergency SOS requests in Rescue Console.
 */
export function calculateSOSPriority(
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  headcount: number,
  zoneRiskScore: number,
  riverRiseRate: number
): number {
  const urgencyWeight = {
    CRITICAL: 100,
    HIGH: 75,
    MEDIUM: 50,
    LOW: 25,
  }[urgency];

  const headcountScore = Math.min(50, headcount * 5);
  const riskBonus = zoneRiskScore * 50;
  const surgeBonus = Math.min(30, riverRiseRate * 15);

  return Math.round(urgencyWeight + headcountScore + riskBonus + surgeBonus);
}
