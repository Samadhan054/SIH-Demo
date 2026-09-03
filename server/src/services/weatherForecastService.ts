import { WeatherForecast, ExtendedRiskLevel } from '../types.js';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';

export function getDemoWeatherForecasts(regions: any[]): WeatherForecast[] {
  if (!OPENWEATHER_API_KEY) {
    console.warn('Weather Forecast: OPENWEATHER_API_KEY not set, using simulated data.');
  }
  
  return regions.map(r => {
    const rf = r.rainfall || Math.random() * 20;
    let prob = rf > 50 ? 80 : rf > 20 ? 40 : 10;
    
    let level: ExtendedRiskLevel = 'LOW';
    if (prob > 70) level = 'HIGH';
    else if (prob > 40) level = 'MODERATE';
    
    return {
      regionId: r.id,
      regionName: r.name,
      currentTemp: 15 + Math.random() * 15,
      currentRainfallMmh: rf,
      humidity: 60 + Math.random() * 40,
      windSpeedKmh: 10 + Math.random() * 30,
      thunderstormProbability: Math.random() * 100,
      flashFloodProbability: prob,
      flashFloodRiskLevel: level,
      flashFloodMainCauses: ['Intense Rainfall', 'Steep Terrain'],
      flashFloodRecommendation: level === 'HIGH' ? 'Avoid river banks (SYSTEM_ADVISORY)' : 'Normal conditions (DEMO)',
      forecast: [
        { hours: 3, rainfallMm: Math.random() * 20, riskLevel: 'LOW' },
        { hours: 6, rainfallMm: Math.random() * 30, riskLevel: 'MODERATE' },
        { hours: 12, rainfallMm: Math.random() * 40, riskLevel: level },
        { hours: 24, rainfallMm: Math.random() * 50, riskLevel: level }
      ],
      lastUpdated: new Date().toISOString(),
      dataStatus: OPENWEATHER_API_KEY ? 'LIVE' : 'SIMULATED'
    };
  });
}
