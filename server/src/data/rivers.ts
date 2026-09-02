import { ChannelShape, RiverThresholdRecord } from '../types.js';

/**
 * Derives illustrative gauge thresholds (Normal, Warning, Danger, Extreme)
 * based on river channel shape, average depth, width, and catchment size.
 *
 * NOTE / DISCLAIMER:
 * All threshold values derived below are ILLUSTRATIVE / DEMO VALUES modeled on
 * Central Water Commission (CWC) classification concepts for prototype testing.
 * They MUST be replaced with official live CWC gauge telemetry before any production deployment.
 */
export function deriveRiverThresholds(
  avgDepthM: number,
  avgWidthM: number,
  channelShape: ChannelShape,
  catchmentAreaKm2: number
): {
  normalLevelM: number;
  warningLevelM: number;
  dangerLevelM: number;
  extremeLevelM: number;
  derivationNote: string;
} {
  let shapeMultiplier = 1.2; // default
  if (channelShape === 'gorge/confined') {
    shapeMultiplier = 1.35; // Canyon funneling compresses margin
  } else if (channelShape === 'braided') {
    shapeMultiplier = 1.5;
  } else if (channelShape === 'deltaic') {
    shapeMultiplier = 1.65;
  }

  const normalLevelM = Number(avgDepthM.toFixed(1));
  const warningLevelM = Number((avgDepthM * (shapeMultiplier + 0.2)).toFixed(1));
  const dangerLevelM = Number((avgDepthM * (shapeMultiplier + 0.55)).toFixed(1));
  const extremeLevelM = Number((avgDepthM * (shapeMultiplier + 0.95)).toFixed(1));

  const note = `[ILLUSTRATIVE CWC DEMO MODEL] Derived for ${channelShape} channel (Avg Width: ${avgWidthM}m, Catchment: ${catchmentAreaKm2.toLocaleString()} km²). Replace with official CWC station datum.`;

  return {
    normalLevelM,
    warningLevelM,
    dangerLevelM,
    extremeLevelM,
    derivationNote: note,
  };
}

// 28 Real Indian Rivers + Tributary Catchment Stations
export const initialRiversData: Omit<RiverThresholdRecord, 'normalLevelM' | 'warningLevelM' | 'dangerLevelM' | 'extremeLevelM' | 'derivationNote'>[] = [
  {
    id: 'RIV-GANGA',
    name: 'Ganga',
    basin: 'Ganga Basin',
    states: ['Uttarakhand', 'Uttar Pradesh', 'Bihar', 'West Bengal'],
    lengthKm: 2525,
    catchmentAreaKm2: 861404,
    avgWidthMeters: 1400,
    avgDepthMeters: 8.5,
    channelShape: 'meandering',
    currentLevelM: 11.2,
    lastUpdated: new Date().toISOString(),
    coordinates: [[30.1, 78.6], [29.9, 78.1], [26.8, 80.9], [25.5, 85.1], [22.5, 88.3]],
  },
  {
    id: 'RIV-YAMUNA',
    name: 'Yamuna',
    basin: 'Ganga Basin',
    states: ['Uttarakhand', 'Himachal Pradesh', 'Haryana', 'Delhi', 'Uttar Pradesh'],
    lengthKm: 1376,
    catchmentAreaKm2: 366223,
    avgWidthMeters: 650,
    avgDepthMeters: 6.2,
    channelShape: 'meandering',
    currentLevelM: 8.4,
    lastUpdated: new Date().toISOString(),
    coordinates: [[31.0, 78.4], [28.6, 77.2], [27.1, 78.0], [25.4, 81.8]],
  },
  {
    id: 'RIV-BRAHMAPUTRA',
    name: 'Brahmaputra',
    basin: 'Brahmaputra Basin',
    states: ['Arunachal Pradesh', 'Assam'],
    lengthKm: 2900,
    catchmentAreaKm2: 580000,
    avgWidthMeters: 2200,
    avgDepthMeters: 12.0,
    channelShape: 'braided',
    currentLevelM: 18.5,
    lastUpdated: new Date().toISOString(),
    coordinates: [[28.1, 95.3], [26.2, 91.7], [25.8, 89.8]],
  },
  {
    id: 'RIV-GODAVARI',
    name: 'Godavari',
    basin: 'Godavari Basin',
    states: ['Maharashtra', 'Telangana', 'Andhra Pradesh', 'Chhattisgarh', 'Odisha'],
    lengthKm: 1465,
    catchmentAreaKm2: 312812,
    avgWidthMeters: 1100,
    avgDepthMeters: 7.8,
    channelShape: 'meandering',
    currentLevelM: 10.1,
    lastUpdated: new Date().toISOString(),
    coordinates: [[19.9, 73.5], [18.8, 79.1], [16.9, 81.7]],
  },
  {
    id: 'RIV-KRISHNA',
    name: 'Krishna',
    basin: 'Krishna Basin',
    states: ['Maharashtra', 'Karnataka', 'Telangana', 'Andhra Pradesh'],
    lengthKm: 1400,
    catchmentAreaKm2: 258948,
    avgWidthMeters: 950,
    avgDepthMeters: 7.0,
    channelShape: 'meandering',
    currentLevelM: 8.8,
    lastUpdated: new Date().toISOString(),
    coordinates: [[17.9, 73.6], [16.2, 77.3], [16.5, 80.6]],
  },
  {
    id: 'RIV-KAVERI',
    name: 'Kaveri (Cauvery)',
    basin: 'Kaveri Basin',
    states: ['Karnataka', 'Tamil Nadu', 'Kerala'],
    lengthKm: 805,
    catchmentAreaKm2: 81155,
    avgWidthMeters: 480,
    avgDepthMeters: 5.5,
    channelShape: 'deltaic',
    currentLevelM: 7.2,
    lastUpdated: new Date().toISOString(),
    coordinates: [[12.4, 75.7], [12.2, 76.6], [10.8, 79.8]],
  },
  {
    id: 'RIV-NARMADA',
    name: 'Narmada',
    basin: 'Narmada Basin',
    states: ['Madhya Pradesh', 'Maharashtra', 'Gujarat'],
    lengthKm: 1312,
    catchmentAreaKm2: 98796,
    avgWidthMeters: 750,
    avgDepthMeters: 8.0,
    channelShape: 'gorge/confined',
    currentLevelM: 10.6,
    lastUpdated: new Date().toISOString(),
    coordinates: [[22.7, 81.7], [23.1, 79.9], [21.7, 72.9]],
  },
  {
    id: 'RIV-TAPI',
    name: 'Tapi',
    basin: 'Tapi Basin',
    states: ['Madhya Pradesh', 'Maharashtra', 'Gujarat'],
    lengthKm: 724,
    catchmentAreaKm2: 65145,
    avgWidthMeters: 420,
    avgDepthMeters: 5.8,
    channelShape: 'meandering',
    currentLevelM: 7.0,
    lastUpdated: new Date().toISOString(),
    coordinates: [[21.7, 78.2], [21.0, 75.3], [21.1, 72.7]],
  },
  {
    id: 'RIV-MAHANADI',
    name: 'Mahanadi',
    basin: 'Mahanadi Basin',
    states: ['Chhattisgarh', 'Odisha'],
    lengthKm: 858,
    catchmentAreaKm2: 141600,
    avgWidthMeters: 1300,
    avgDepthMeters: 7.2,
    channelShape: 'braided',
    currentLevelM: 9.8,
    lastUpdated: new Date().toISOString(),
    coordinates: [[20.2, 81.9], [21.4, 83.9], [20.4, 86.7]],
  },
  {
    id: 'RIV-INDUS',
    name: 'Indus (Indian Stretch)',
    basin: 'Indus Basin',
    states: ['Ladakh', 'Jammu & Kashmir'],
    lengthKm: 1114,
    catchmentAreaKm2: 321289,
    avgWidthMeters: 380,
    avgDepthMeters: 6.0,
    channelShape: 'gorge/confined',
    currentLevelM: 7.5,
    lastUpdated: new Date().toISOString(),
    coordinates: [[33.2, 78.9], [34.1, 77.5], [34.7, 76.1]],
  },
  {
    id: 'RIV-SUTLEJ',
    name: 'Sutlej',
    basin: 'Indus Basin',
    states: ['Himachal Pradesh', 'Punjab'],
    lengthKm: 1450,
    catchmentAreaKm2: 50140,
    avgWidthMeters: 350,
    avgDepthMeters: 5.2,
    channelShape: 'gorge/confined',
    currentLevelM: 6.8,
    lastUpdated: new Date().toISOString(),
    coordinates: [[31.8, 78.6], [31.4, 76.4], [31.1, 75.0]],
  },
  {
    id: 'RIV-BEAS',
    name: 'Beas',
    basin: 'Indus Basin',
    states: ['Himachal Pradesh', 'Punjab'],
    lengthKm: 470,
    catchmentAreaKm2: 20303,
    avgWidthMeters: 280,
    avgDepthMeters: 4.8,
    channelShape: 'gorge/confined',
    currentLevelM: 6.2,
    lastUpdated: new Date().toISOString(),
    coordinates: [[32.3, 77.1], [31.8, 76.2], [31.1, 74.9]],
  },
  {
    id: 'RIV-RAVI',
    name: 'Ravi',
    basin: 'Indus Basin',
    states: ['Himachal Pradesh', 'Jammu & Kashmir', 'Punjab'],
    lengthKm: 720,
    catchmentAreaKm2: 14442,
    avgWidthMeters: 260,
    avgDepthMeters: 4.5,
    channelShape: 'gorge/confined',
    currentLevelM: 5.6,
    lastUpdated: new Date().toISOString(),
    coordinates: [[32.5, 76.6], [32.4, 75.8], [31.6, 74.8]],
  },
  {
    id: 'RIV-CHENAB',
    name: 'Chenab',
    basin: 'Indus Basin',
    states: ['Himachal Pradesh', 'Jammu & Kashmir'],
    lengthKm: 960,
    catchmentAreaKm2: 61000,
    avgWidthMeters: 410,
    avgDepthMeters: 5.8,
    channelShape: 'gorge/confined',
    currentLevelM: 7.9,
    lastUpdated: new Date().toISOString(),
    coordinates: [[32.7, 76.8], [33.1, 75.3], [32.9, 74.7]],
  },
  {
    id: 'RIV-JHELUM',
    name: 'Jhelum',
    basin: 'Indus Basin',
    states: ['Jammu & Kashmir'],
    lengthKm: 725,
    catchmentAreaKm2: 34775,
    avgWidthMeters: 320,
    avgDepthMeters: 5.0,
    channelShape: 'meandering',
    currentLevelM: 6.9,
    lastUpdated: new Date().toISOString(),
    coordinates: [[33.5, 75.2], [34.1, 74.8], [34.2, 74.1]],
  },
  {
    id: 'RIV-SABARMATI',
    name: 'Sabarmati',
    basin: 'Sabarmati Basin',
    states: ['Rajasthan', 'Gujarat'],
    lengthKm: 371,
    catchmentAreaKm2: 21674,
    avgWidthMeters: 290,
    avgDepthMeters: 4.2,
    channelShape: 'meandering',
    currentLevelM: 5.1,
    lastUpdated: new Date().toISOString(),
    coordinates: [[24.4, 73.3], [23.0, 72.5], [22.3, 72.3]],
  },
  {
    id: 'RIV-PERIYAR',
    name: 'Periyar',
    basin: 'Periyar Basin',
    states: ['Kerala', 'Tamil Nadu'],
    lengthKm: 244,
    catchmentAreaKm2: 5398,
    avgWidthMeters: 210,
    avgDepthMeters: 4.0,
    channelShape: 'gorge/confined',
    currentLevelM: 5.4,
    lastUpdated: new Date().toISOString(),
    coordinates: [[9.6, 77.2], [9.9, 76.8], [10.1, 76.2]],
  },
  {
    id: 'RIV-TUNGA',
    name: 'Tungabhadra',
    basin: 'Krishna Basin',
    states: ['Karnataka', 'Telangana', 'Andhra Pradesh'],
    lengthKm: 531,
    catchmentAreaKm2: 71417,
    avgWidthMeters: 450,
    avgDepthMeters: 5.2,
    channelShape: 'meandering',
    currentLevelM: 6.5,
    lastUpdated: new Date().toISOString(),
    coordinates: [[14.0, 75.6], [15.3, 76.5], [15.8, 78.1]],
  },
  {
    id: 'RIV-DAMODAR',
    name: 'Damodar',
    basin: 'Ganga Basin',
    states: ['Jharkhand', 'West Bengal'],
    lengthKm: 592,
    catchmentAreaKm2: 25820,
    avgWidthMeters: 380,
    avgDepthMeters: 4.6,
    channelShape: 'meandering',
    currentLevelM: 6.1,
    lastUpdated: new Date().toISOString(),
    coordinates: [[23.6, 84.7], [23.6, 86.9], [22.5, 88.0]],
  },
  {
    id: 'RIV-KOSI',
    name: 'Kosi',
    basin: 'Ganga Basin',
    states: ['Bihar'],
    lengthKm: 729,
    catchmentAreaKm2: 74500,
    avgWidthMeters: 1200,
    avgDepthMeters: 6.5,
    channelShape: 'braided',
    currentLevelM: 9.4,
    lastUpdated: new Date().toISOString(),
    coordinates: [[26.9, 87.1], [26.0, 86.8], [25.4, 87.2]],
  },
  {
    id: 'RIV-GANDAK',
    name: 'Gandak',
    basin: 'Ganga Basin',
    states: ['Bihar', 'Uttar Pradesh'],
    lengthKm: 630,
    catchmentAreaKm2: 46300,
    avgWidthMeters: 850,
    avgDepthMeters: 5.8,
    channelShape: 'braided',
    currentLevelM: 8.1,
    lastUpdated: new Date().toISOString(),
    coordinates: [[27.4, 83.9], [26.5, 84.8], [25.6, 85.2]],
  },
  {
    id: 'RIV-GHAGHARA',
    name: 'Ghaghara',
    basin: 'Ganga Basin',
    states: ['Uttar Pradesh', 'Bihar'],
    lengthKm: 1080,
    catchmentAreaKm2: 127950,
    avgWidthMeters: 920,
    avgDepthMeters: 6.4,
    channelShape: 'braided',
    currentLevelM: 8.9,
    lastUpdated: new Date().toISOString(),
    coordinates: [[28.5, 81.3], [26.8, 82.2], [25.7, 84.6]],
  },
  {
    id: 'RIV-SON',
    name: 'Son',
    basin: 'Ganga Basin',
    states: ['Chhattisgarh', 'Madhya Pradesh', 'Uttar Pradesh', 'Bihar'],
    lengthKm: 784,
    catchmentAreaKm2: 71259,
    avgWidthMeters: 750,
    avgDepthMeters: 5.2,
    channelShape: 'braided',
    currentLevelM: 7.1,
    lastUpdated: new Date().toISOString(),
    coordinates: [[22.7, 81.8], [24.4, 82.5], [25.6, 84.8]],
  },
  {
    id: 'RIV-CHAMBAL',
    name: 'Chambal',
    basin: 'Ganga Basin',
    states: ['Madhya Pradesh', 'Rajasthan', 'Uttar Pradesh'],
    lengthKm: 1024,
    catchmentAreaKm2: 143219,
    avgWidthMeters: 450,
    avgDepthMeters: 6.0,
    channelShape: 'gorge/confined',
    currentLevelM: 8.2,
    lastUpdated: new Date().toISOString(),
    coordinates: [[22.5, 75.7], [25.4, 76.5], [26.8, 79.2]],
  },
  {
    id: 'RIV-BETWA',
    name: 'Betwa',
    basin: 'Ganga Basin',
    states: ['Madhya Pradesh', 'Uttar Pradesh'],
    lengthKm: 590,
    catchmentAreaKm2: 46580,
    avgWidthMeters: 380,
    avgDepthMeters: 4.8,
    channelShape: 'meandering',
    currentLevelM: 6.2,
    lastUpdated: new Date().toISOString(),
    coordinates: [[23.0, 77.6], [24.8, 78.4], [25.9, 80.2]],
  },
  {
    id: 'RIV-ALAKNANDA',
    name: 'Alaknanda',
    basin: 'Ganga Basin (Himalayan Headwaters)',
    states: ['Uttarakhand'],
    lengthKm: 190,
    catchmentAreaKm2: 10882,
    avgWidthMeters: 180,
    avgDepthMeters: 4.2,
    channelShape: 'gorge/confined',
    currentLevelM: 6.1, // Near danger level!
    lastUpdated: new Date().toISOString(),
    coordinates: [[30.7, 79.5], [30.5, 79.3], [30.1, 78.6]],
  },
  {
    id: 'RIV-BHAGIRATHI',
    name: 'Bhagirathi',
    basin: 'Ganga Basin (Himalayan Headwaters)',
    states: ['Uttarakhand'],
    lengthKm: 205,
    catchmentAreaKm2: 6921,
    avgWidthMeters: 160,
    avgDepthMeters: 3.8,
    channelShape: 'gorge/confined',
    currentLevelM: 5.2,
    lastUpdated: new Date().toISOString(),
    coordinates: [[30.9, 79.0], [30.4, 78.4], [30.1, 78.6]],
  },
  {
    id: 'RIV-TEESTA',
    name: 'Teesta',
    basin: 'Brahmaputra Basin',
    states: ['Sikkim', 'West Bengal'],
    lengthKm: 414,
    catchmentAreaKm2: 12540,
    avgWidthMeters: 240,
    avgDepthMeters: 4.5,
    channelShape: 'gorge/confined',
    currentLevelM: 6.8, // High surge!
    lastUpdated: new Date().toISOString(),
    coordinates: [[27.7, 88.6], [27.0, 88.4], [26.2, 88.9]],
  },
];

// Helper to construct fully derived RiverThresholdRecords
export function getInitialRiversRegistry(): RiverThresholdRecord[] {
  return initialRiversData.map((r) => {
    const threshold = deriveRiverThresholds(r.avgDepthMeters, r.avgWidthMeters, r.channelShape, r.catchmentAreaKm2);

    let isBreached = false;
    let breachSeverity: 'NONE' | 'WARNING' | 'DANGER' | 'EXTREME' = 'NONE';

    if (r.currentLevelM >= threshold.extremeLevelM) {
      isBreached = true;
      breachSeverity = 'EXTREME';
    } else if (r.currentLevelM >= threshold.dangerLevelM) {
      isBreached = true;
      breachSeverity = 'DANGER';
    } else if (r.currentLevelM >= threshold.warningLevelM) {
      isBreached = true;
      breachSeverity = 'WARNING';
    }

    return {
      ...r,
      normalLevelM: threshold.normalLevelM,
      warningLevelM: threshold.warningLevelM,
      dangerLevelM: threshold.dangerLevelM,
      extremeLevelM: threshold.extremeLevelM,
      derivationNote: threshold.derivationNote,
      isBreached,
      breachSeverity,
    };
  });
}
