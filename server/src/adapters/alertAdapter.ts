import { RiverThresholdRecord, SOSIncident } from '../types.js';
import { smsAdapter } from './smsAdapter.js';
import { sosService } from '../services/sosService.js';

export class AlertAdapter {
  /**
   * Evaluates river threshold state changes and triggers automated danger indication & SMS alerts
   */
  public evaluateRiverBreach(
    river: RiverThresholdRecord,
    previousLevel: number
  ): {
    breached: boolean;
    severity: 'NONE' | 'WARNING' | 'DANGER' | 'EXTREME';
    smsLog?: any;
    autoIncident?: SOSIncident;
  } {
    const { currentLevelM, warningLevelM, dangerLevelM, extremeLevelM } = river;

    // Check if newly crossed threshold
    if (currentLevelM >= extremeLevelM && previousLevel < extremeLevelM) {
      // 1. Trigger SMS Alert Stub
      const smsMsg = `CRITICAL EXTREME FLOOD WARNING: ${river.name} water level reached ${currentLevelM.toFixed(1)}m (Extreme mark: ${extremeLevelM}m). Evacuate to high ground immediately!`;
      const smsLog = smsAdapter.sendFloodSMS(river.id, river.name, 10, smsMsg);

      // 2. Auto-create Incident in /rescue-console Priority Queue
      const autoIncident = sosService.createSOSIncident(
        {
          citizenName: `AUTOMATED SYSTEM ALERT (${river.name} Breach)`,
          phone: '+977 1155 (CWC Telemetry)',
          location: {
            lat: river.coordinates?.[0]?.[0] || 30.1,
            lng: river.coordinates?.[0]?.[1] || 78.6,
            addressDescription: `${river.name} Basin High Risk Zone (${river.basin})`,
          },
          headcount: 450, // Estimated catchment population at immediate risk
          medicalUrgency: 'CRITICAL',
          note: `AUTOMATED DANGER BREACH: ${river.name} gauge level (${currentLevelM.toFixed(1)}m) exceeded Extreme Danger Mark (${extremeLevelM}m). Automated taskforce dispatch required.`,
          mode: 'SATELLITE',
          district: river.states[0] || 'Ganga Basin',
        },
        0.95,
        2.1
      );
      autoIncident.isAutoBreachIncident = true;

      return { breached: true, severity: 'EXTREME', smsLog, autoIncident };
    } else if (currentLevelM >= dangerLevelM && previousLevel < dangerLevelM) {
      const smsMsg = `RED FLOOD ALERT: ${river.name} water level reached ${currentLevelM.toFixed(1)}m crossing Danger Mark (${dangerLevelM}m). Stay vigilant and prepare for evacuation.`;
      const smsLog = smsAdapter.sendFloodSMS(river.id, river.name, 5, smsMsg);

      return { breached: true, severity: 'DANGER', smsLog };
    } else if (currentLevelM >= warningLevelM && previousLevel < warningLevelM) {
      return { breached: true, severity: 'WARNING' };
    }

    return { breached: false, severity: 'NONE' };
  }
}

export const alertAdapter = new AlertAdapter();
