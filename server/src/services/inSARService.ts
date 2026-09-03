import { InSARReading } from '../types.js';

// SIMULATED DATA — Connect real InSAR satellite feed by implementing connectRealInSARFeed()

export async function connectRealInSARFeed(apiUrl: string, apiKey: string): Promise<InSARReading[]> {
  // TODO: Implement actual API call
  return [];
}

export function getDemoInSARReadings(regions: any[]): InSARReading[] {
  return regions.map(r => {
    const displacement = Math.random() * 20;
    const previous = displacement - Math.random() * 5;
    let trend: 'STABLE' | 'MINOR' | 'MODERATE' | 'RAPID' | 'CRITICAL' = 'STABLE';
    if (displacement - previous > 10) trend = 'CRITICAL';
    else if (displacement - previous > 5) trend = 'RAPID';
    else if (displacement - previous > 2) trend = 'MODERATE';
    else if (displacement - previous > 0) trend = 'MINOR';
    
    return {
      id: `INSAR-${r.id}`,
      regionId: r.id,
      regionName: r.name,
      lat: r.lat,
      lng: r.lng,
      displacementMm: displacement,
      previousDisplacementMm: previous,
      displacementTrend: trend,
      observationPeriodDays: 30,
      slopeMovementStatus: trend === 'STABLE' ? 'Stable' : 'Movement Detected',
      riskClassification: trend === 'CRITICAL' ? 'CRITICAL' : trend === 'RAPID' ? 'HIGH' : trend === 'MODERATE' ? 'MODERATE' : 'LOW',
      lastUpdated: new Date().toISOString(),
      dataStatus: 'DEMO'
    };
  });
}
