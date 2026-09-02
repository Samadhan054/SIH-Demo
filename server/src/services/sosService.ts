import { SOSIncident, SOSMode, SOSStatus, UrgencyLevel } from '../types.js';
import { calculateSOSPriority } from './riskEngine.js';

export class SOSService {
  /**
   * Generates low-bandwidth compressed binary packet footprint simulation for Satellite SOS
   */
  public calculateSatellitePacketBytes(payload: {
    lat: number;
    lng: number;
    headcount: number;
    medicalUrgency: UrgencyLevel;
    note: string;
  }): number {
    // 8 bytes (GPS lat/lng float64) + 1 byte (headcount + urgency flags) + text bytes
    const baseBytes = 12;
    const textBytes = Math.min(128, Buffer.byteLength(payload.note || '', 'utf8'));
    return baseBytes + textBytes;
  }

  /**
   * Create new SOS incident
   */
  public createSOSIncident(
    data: {
      citizenName: string;
      phone: string;
      location: { lat: number; lng: number; addressDescription: string };
      headcount: number;
      medicalUrgency: UrgencyLevel;
      note: string;
      mode: SOSMode;
      hasVoiceNote?: boolean;
      voiceNoteUrl?: string;
      zoneId?: string;
      zoneName?: string;
      district?: string;
    },
    zoneRiskScore = 0.85,
    riverRiseRate = 1.2
  ): SOSIncident {
    const id = `SOS-${Math.floor(100 + Math.random() * 900)}`;
    const packetBytes = data.mode === 'SATELLITE' 
      ? this.calculateSatellitePacketBytes({
          lat: data.location.lat,
          lng: data.location.lng,
          headcount: data.headcount,
          medicalUrgency: data.medicalUrgency,
          note: data.note,
        }) 
      : Buffer.byteLength(JSON.stringify(data), 'utf8');

    const priorityScore = calculateSOSPriority(
      data.medicalUrgency,
      data.headcount,
      zoneRiskScore,
      riverRiseRate
    );

    const initialStatus: SOSStatus = data.mode === 'SATELLITE' ? 'SENT' : 'RECEIVED';

    const incident: SOSIncident = {
      id,
      citizenName: data.citizenName || 'Anonymous Citizen',
      phone: data.phone || 'N/A',
      location: data.location,
      headcount: data.headcount || 1,
      medicalUrgency: data.medicalUrgency || 'MEDIUM',
      note: data.note || 'No additional note provided.',
      hasVoiceNote: data.hasVoiceNote,
      voiceNoteUrl: data.voiceNoteUrl,
      mode: data.mode,
      packetSizeCompressedBytes: packetBytes,
      status: initialStatus,
      timestamp: new Date().toISOString(),
      zoneId: data.zoneId || 'ZONE-SIN',
      zoneName: data.zoneName || 'Sindhupalchok Flash Zone',
      district: data.district || 'Sindhupalchok',
      priorityScore,
      commsLog: [
        {
          id: `msg-${Date.now()}`,
          sender: data.citizenName || 'Citizen',
          role: 'CITIZEN',
          message: data.mode === 'SATELLITE' 
            ? `[Satellite Packet ${packetBytes}B] SOS broadcasted from GPS ${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)}`
            : `Emergency SOS triggered: ${data.note}`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    return incident;
  }
}

export const sosService = new SOSService();
