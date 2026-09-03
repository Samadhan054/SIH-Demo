import { ExtendedRiskLevel, LandslideRiskResult } from '../types.js';

// THIS IS A DEMO RULE-BASED ENGINE. NOT A TRAINED/VALIDATED AI MODEL.
export function calculateLandslideRisk(params: {
  regionId: string;
  regionName: string;
  soilSaturation: number;
  rainfallIntensity: number;
  cumulativeRainfall: number;
  previousRainfall: number;
  groundDisplacement: number;
  slopeAngle: number;
  elevation: number;
  temperature: number;
  soilType: string;
}): LandslideRiskResult {
  let score = 0;
  
  if (params.soilSaturation > 80) score += 30;
  else if (params.soilSaturation > 60) score += 15;
  
  if (params.rainfallIntensity > 50) score += 20;
  else if (params.rainfallIntensity > 20) score += 10;
  
  if (params.cumulativeRainfall > 100) score += 20;
  
  if (params.groundDisplacement > 10) score += 20;
  else if (params.groundDisplacement > 5) score += 10;
  
  if (params.slopeAngle > 40) score += 10;
  
  score = Math.min(100, score);
  
  let riskLevel: ExtendedRiskLevel = 'LOW';
  if (score >= 80) riskLevel = 'CRITICAL';
  else if (score >= 65) riskLevel = 'VERY HIGH';
  else if (score >= 50) riskLevel = 'HIGH';
  else if (score >= 30) riskLevel = 'MODERATE';
  
  let recommendation = "No immediate action required. Stay informed through official channels.";
  if (score >= 75) {
    recommendation = "Residents in officially designated vulnerable areas should remain prepared for evacuation and follow instructions from local disaster-management authorities.";
  } else if (score >= 50) {
    recommendation = "Monitor local authority advisories. Avoid unstable slopes and riverbanks.";
  }
  
  const factors: string[] = [];
  if (params.soilSaturation > 60) factors.push('High soil saturation');
  if (params.rainfallIntensity > 20) factors.push('Intense rainfall');
  if (params.groundDisplacement > 5) factors.push('Ground displacement');
  
  return {
    regionId: params.regionId,
    regionName: params.regionName,
    riskScore: score,
    riskLevel,
    contributingFactors: factors,
    recommendation,
    confidence: 'MEDIUM',
    modelType: 'RULE_BASED_DEMO',
    lastUpdated: new Date().toISOString(),
    dataStatus: 'RULE_BASED'
  };
}
