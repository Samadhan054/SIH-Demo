import { SimulatedSMSLog } from '../types.js';

/**
 * Swappable STUB SMS Gateway Adapter
 * Designed for MSG91, Twilio, or NDMA (National Disaster Management Authority) SMS alert gateway.
 *
 * NOTE: This is a SIMULATED STUB implementation for prototype demonstration.
 * No real SMS API keys are hardcoded. Simulated dispatch logs are surfaced in /admin.
 */
export class SMSAdapter {
  private smsLogs: SimulatedSMSLog[] = [];
  private providerStubName = 'MSG91 / NDMA Emergency SMS Gateway (Stub)';

  /**
   * Simulated SMS Dispatch trigger
   */
  public sendFloodSMS(
    riverId: string,
    riverName: string,
    radiusKm: number,
    message: string
  ): SimulatedSMSLog {
    // Generate realistic simulated recipient count based on radius
    const recipientCount = Math.floor(150 + radiusKm * 42 + Math.random() * 80);

    const log: SimulatedSMSLog = {
      id: `SMS-${Math.floor(1000 + Math.random() * 9000)}`,
      riverId,
      riverName,
      radiusKm,
      recipientCount,
      message,
      providerStub: this.providerStubName,
      timestamp: new Date().toISOString(),
    };

    this.smsLogs.unshift(log);

    // Keep log buffer to last 100 entries
    if (this.smsLogs.length > 100) this.smsLogs.pop();

    console.log(
      `[SIMULATED SMS BROADCAST STUB] ${log.providerStub}: Sent to ${log.recipientCount} registered citizens within ${radiusKm}km of ${riverName} (${riverId}). Message: "${message}"`
    );

    return log;
  }

  public getSMSLogs(): SimulatedSMSLog[] {
    return this.smsLogs;
  }
}

export const smsAdapter = new SMSAdapter();
