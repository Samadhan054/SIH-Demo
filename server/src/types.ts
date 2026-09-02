export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

export type SensorStatus = 'ONLINE' | 'WARNING' | 'OFFLINE';

export type SensorType = 'RIVER_GAUGE' | 'WEATHER_STATION' | 'SATELLITE_FEED';

export interface TelemetryPoint {
  timestamp: string;
  waterLevel: number; // in meters
  rainfall: number;   // mm/h
  soilMoisture: number; // %
}

export interface MonitoringStation {
  id: string;
  name: string;
  type: SensorType;
  riverName?: string;
  district: string;
  location: {
    lat: number;
    lng: number;
    elevation: number; // meters above sea level
  };
  waterLevel: number;       // meters
  dangerLevel: number;      // meters threshold for flash flood
  warningLevel: number;     // meters threshold
  riseRate: number;         // meters per hour
  rainfall: number;         // mm/h
  temperature: number;      // °C
  humidity: number;         // %
  windSpeed: number;        // km/h
  soilMoisture: number;     // %
  slopeGradient: number;    // degrees/slope %
  valleyNarrowness: number; // multiplier factor (1.0 to 2.5)
  riskScore: number;        // 0.0 to 1.0
  riskLevel: RiskLevel;
  status: SensorStatus;
  lastUpdated: string;
  telemetryHistory: TelemetryPoint[];
}

export interface RiskZone {
  id: string;
  name: string;
  district: string;
  coordinates: [number, number][]; // Polygon coordinates
  elevationAvg: number;
  slopeGradientAvg: number;
  populationDensity: number; // people per sq km
  totalPopulation: number;
  riskScore: number;
  riskLevel: RiskLevel;
  primaryRiskFactors: string[];
  safeEvacuationPoint: {
    name: string;
    lat: number;
    lng: number;
    capacity: number;
  };
}

export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SOSMode = 'SATELLITE' | 'STANDARD';

export type SOSStatus =
  | 'SENT'
  | 'SATELLITE_RELAY'
  | 'RECEIVED'
  | 'DISPATCHED'
  | 'RESCUED';

export interface CommsMessage {
  id: string;
  sender: string;
  role: 'CITIZEN' | 'RESCUE_TEAM' | 'COMMAND_CENTER';
  message: string;
  timestamp: string;
}

export interface SOSIncident {
  id: string;
  citizenName: string;
  phone: string;
  location: {
    lat: number;
    lng: number;
    addressDescription: string;
  };
  headcount: number;
  medicalUrgency: UrgencyLevel;
  note: string;
  hasVoiceNote?: boolean;
  voiceNoteUrl?: string;
  mode: SOSMode;
  packetSizeCompressedBytes?: number; // low bandwidth footprint
  status: SOSStatus;
  timestamp: string;
  zoneId: string;
  zoneName: string;
  district: string;
  assignedTeamId?: string;
  assignedTeamName?: string;
  priorityScore: number; // Auto-calculated based on urgency, zone risk, rise rate & headcount
  commsLog: CommsMessage[];
}

export type RescueTeamStatus =
  | 'AVAILABLE'
  | 'EN_ROUTE'
  | 'ON_SITE'
  | 'EVACUATING'
  | 'COMPLETED';

export interface RescueTeam {
  id: string;
  name: string;
  unitLeader: string;
  contactNumber: string;
  status: RescueTeamStatus;
  currentLocation: {
    lat: number;
    lng: number;
  };
  assignedIncidentId?: string;
  capacity: number;
  vehicleType: 'HELICOPTER' | 'BOAT' | 'ALL_TERRAIN_TRUCK' | 'FOOT_PATROL';
}

export interface DistrictAlert {
  id: string;
  district: string;
  severity: RiskLevel;
  title: string;
  message: string;
  recommendedAction: string;
  issuedAt: string;
  expiresAt: string;
  active: boolean;
  isManualOverride: boolean;
  issuedBy: string;
}

export type UserRole = 'CITIZEN' | 'RESCUE_TEAM' | 'ADMIN' | 'GOVERNMENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  district: string;
  teamId?: string;
}
