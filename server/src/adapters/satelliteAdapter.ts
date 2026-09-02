/**
 * Swappable Satellite Data Adapter
 * Interface for NASA SMAP, Copernicus Sentinel-1, or ISRO satellite soil moisture & cloudburst anomaly feeds.
 */

export interface SatelliteObservation {
  soilMoistureSaturationPercent: number;
  cloudburstAnomalyDetected: boolean;
  radarReflectivityDbz: number;
  lastSatellitePass: string;
}

export class SatelliteDataAdapter {
  private apiEndpoint: string | null = null;

  constructor() {
    this.apiEndpoint = process.env.SATELLITE_API_ENDPOINT || null;
  }

  async fetchSatelliteSoilMoisture(lat: number, lng: number): Promise<SatelliteObservation> {
    if (this.apiEndpoint) {
      // Plug in real NASA Sentinel-1 / SMAP REST API endpoint here
    }

    // Default mock data generator representing satellite pass observation
    const baseMoisture = 70 + Math.random() * 28;
    return {
      soilMoistureSaturationPercent: Number(baseMoisture.toFixed(1)),
      cloudburstAnomalyDetected: baseMoisture > 92,
      radarReflectivityDbz: Number((35 + Math.random() * 25).toFixed(1)),
      lastSatellitePass: new Date(Date.now() - 15 * 60000).toISOString(),
    };
  }
}

export const satelliteAdapter = new SatelliteDataAdapter();
