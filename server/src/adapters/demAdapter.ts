/**
 * Swappable Digital Elevation Model (DEM) & Terrain Analysis Adapter
 * Evaluates slope gradient (%) and narrow valley funneling multiplier for high-risk hilly zones.
 */

export interface DEMTerrainMetrics {
  elevationMeters: number;
  slopeGradientDegrees: number;
  valleyNarrownessFactor: number;
  catchmentRunoffVelocity: number; // m/s
}

export class DEMAdapter {
  /**
   * Analyze terrain metrics for coordinates in mountain/foothill zones
   */
  getTerrainMetrics(lat: number, lng: number): DEMTerrainMetrics {
    // In production: Query GeoTIFF / AWS DEM S3 bucket / PostGIS ST_Slope(ST_Value(dem, geom))
    // Here we compute terrain profiles typical of Himalayan steep valley river channels:
    const elevation = 1200 + Math.abs(Math.sin(lat * 10)) * 1800;
    const slope = 20 + Math.abs(Math.cos(lng * 10)) * 25; // 20 to 45 degrees slope
    const valleyNarrowness = 1.2 + (slope / 45.0) * 0.8; // Canyons compress flash flood surges

    return {
      elevationMeters: Number(elevation.toFixed(0)),
      slopeGradientDegrees: Number(slope.toFixed(1)),
      valleyNarrownessFactor: Number(valleyNarrowness.toFixed(2)),
      catchmentRunoffVelocity: Number((2.5 + (slope / 10.0)).toFixed(1)),
    };
  }
}

export const demAdapter = new DEMAdapter();
