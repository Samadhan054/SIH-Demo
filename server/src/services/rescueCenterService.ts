import { RescueCenter } from '../types.js';

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function findNearestCenters(lat: number, lng: number, centers: RescueCenter[], maxCount: number = 3): (RescueCenter & { distanceKm: number })[] {
  const withDistance = centers.map(c => ({
    ...c,
    distanceKm: haversineDistance(lat, lng, c.lat, c.lng)
  }));
  
  return withDistance.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, maxCount);
}
