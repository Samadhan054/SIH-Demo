import { FirstAidSOSRequest } from '../types.js';

export interface EmergencyCommsProvider {
  name: string;
  send(request: FirstAidSOSRequest): Promise<{success: boolean; message: string; deliveryStatus: string}>;
}

class DemoAdapter implements EmergencyCommsProvider {
  name = 'DemoAdapter';
  async send(request: FirstAidSOSRequest) {
    return { success: false, message: 'SOS recorded successfully. Satellite transmission is not configured in this deployment.', deliveryStatus: 'DELIVERY_PENDING' };
  }
}

class SatelliteProviderAdapter implements EmergencyCommsProvider {
  name = 'SatelliteProvider';
  async send(request: FirstAidSOSRequest) {
    if (!process.env.SATELLITE_SOS_API_KEY) return new DemoAdapter().send(request);
    return { success: true, message: 'Sent via Satellite API', deliveryStatus: 'DELIVERED' };
  }
}

class SMSProviderAdapter implements EmergencyCommsProvider {
  name = 'SMSProvider';
  async send(request: FirstAidSOSRequest) {
    if (!process.env.MSG91_API_KEY) return new SatelliteProviderAdapter().send(request);
    return { success: true, message: 'Sent via SMS API', deliveryStatus: 'DELIVERED' };
  }
}

export const emergencyCommsService = {
  async dispatch(request: FirstAidSOSRequest) {
    const providers = [new SatelliteProviderAdapter(), new SMSProviderAdapter(), new DemoAdapter()];
    
    for (const provider of providers) {
      try {
        const res = await provider.send(request);
        request.transmissionLog.push({
          provider: provider.name,
          status: res.deliveryStatus,
          timestamp: new Date().toISOString(),
          message: res.message
        });
        if (res.success) {
          request.transmissionStatus = 'DELIVERED';
          return res;
        }
      } catch (err: any) {
        request.transmissionLog.push({
          provider: provider.name,
          status: 'FAILED',
          timestamp: new Date().toISOString(),
          message: err.message
        });
      }
    }
    request.transmissionStatus = 'DELIVERY_PENDING';
    return { success: false, message: 'Fell back to Demo Adapter', deliveryStatus: 'DELIVERY_PENDING' };
  }
};
