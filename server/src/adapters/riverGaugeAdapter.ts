/**
 * Swappable IoT River-Gauge Sensor Adapter
 * Designed for ultrasonic/radar water level sensors streaming via MQTT or HTTP POST.
 */

export interface RiverGaugePayload {
  stationId: string;
  waterLevelMeters: number;
  rateOfRiseMetersPerHour: number;
  batteryPercent: number;
  signalStrengthDbm: number;
  timestamp: string;
}

export class RiverGaugeAdapter {
  /**
   * Process raw MQTT telemetry packet from IoT gateway
   */
  parseIoTMqttMessage(payload: string): RiverGaugePayload | null {
    try {
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  /**
   * Simulate continuous ultrasonic sensor gauge telemetry for testing
   */
  generateSimulatedTelemetry(currentWaterLevel: number, dangerLevel: number): {
    waterLevelMeters: number;
    rateOfRiseMetersPerHour: number;
  } {
    // Simulate natural surge with random noise
    const deltaRate = (Math.random() - 0.35) * 0.4; // Slightly biased towards surge
    const newRate = Number(deltaRate.toFixed(2));
    const newLevel = Math.max(0.8, Number((currentWaterLevel + newRate * (5 / 3600)).toFixed(2))); // 5s tick simulation

    return {
      waterLevelMeters: newLevel,
      rateOfRiseMetersPerHour: newRate,
    };
  }
}

export const riverGaugeAdapter = new RiverGaugeAdapter();
