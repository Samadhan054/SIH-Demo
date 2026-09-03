import { AvalancheReading, ExtendedRiskLevel } from '../types.js';

// Demo / Awaiting Live Radar Integration

export function getDemoAvalancheReadings(regions: any[]): AvalancheReading[] {
  return regions.filter(r => r.elevation > 2500).map(r => {
    const snowDepthCm = Math.random() * 200;
    const temp = -10 + Math.random() * 15;
    const wind = Math.random() * 100;
    
    let riskScore = 0;
    if (snowDepthCm > 100) riskScore += 30;
    if (temp > 0) riskScore += 20;
    if (wind > 50) riskScore += 20;
    
    let riskLevel: ExtendedRiskLevel = 'LOW';
    if (riskScore > 60) riskLevel = 'HIGH';
    else if (riskScore > 30) riskLevel = 'MODERATE';
    
    return {
      id: `AVA-${r.id}`,
      regionId: r.id,
      regionName: r.name,
      riskLevel,
      snowDepthCm,
      temperatureC: temp,
      windSpeedKmh: wind,
      windDirection: 'NE',
      recentSnowfallCm: Math.random() * 30,
      slopeAngleDeg: 30 + Math.random() * 20,
      radarStatus: 'DEMO',
      lastUpdated: new Date().toISOString(),
      dataStatus: 'DEMO'
    };
  });
}
