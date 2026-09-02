export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

export type SensorStatus = 'ONLINE' | 'WARNING' | 'OFFLINE';

export type SensorType = 'RIVER_GAUGE' | 'WEATHER_STATION' | 'SATELLITE_FEED';

export type ChannelShape = 'braided' | 'meandering' | 'gorge/confined' | 'deltaic';

export interface RiverThresholdRecord {
  id: string;
  name: string;
  basin: string;
  states: string[];
  lengthKm: number;
  catchmentAreaKm2: number;
  avgWidthMeters: number;
  avgDepthMeters: number;
  channelShape: ChannelShape;
  normalLevelM: number;
  warningLevelM: number;
  dangerLevelM: number;
  extremeLevelM: number;
  currentLevelM: number;
  isBreached?: boolean;
  breachSeverity?: 'NONE' | 'WARNING' | 'DANGER' | 'EXTREME';
  lastUpdated: string;
  coordinates?: [number, number][]; // Line path representation
  gaugesCount?: number;
  derivationNote?: string;
}

export interface SimulatedSMSLog {
  id: string;
  riverId: string;
  riverName: string;
  radiusKm: number;
  recipientCount: number;
  message: string;
  providerStub: string;
  timestamp: string;
}

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
  riverId?: string;
  riverName?: string;
  district: string;
  location: {
    lat: number;
    lng: number;
    elevation: number;
  };
  waterLevel: number;
  dangerLevel: number;
  warningLevel: number;
  extremeLevel?: number;
  riseRate: number;
  rainfall: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  soilMoisture: number;
  slopeGradient: number;
  valleyNarrowness: number;
  riskScore: number;
  riskLevel: RiskLevel;
  status: SensorStatus;
  lastUpdated: string;
  telemetryHistory: TelemetryPoint[];
}

export interface RiskZone {
  id: string;
  name: string;
  district: string;
  coordinates: [number, number][];
  elevationAvg: number;
  slopeGradientAvg: number;
  populationDensity: number;
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
  packetSizeCompressedBytes?: number;
  status: SOSStatus;
  timestamp: string;
  zoneId: string;
  zoneName: string;
  district: string;
  assignedTeamId?: string;
  assignedTeamName?: string;
  priorityScore: number;
  commsLog: CommsMessage[];
  riverId?: string;
  riverName?: string;
  isAutoBreachIncident?: boolean;
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
  riverId?: string;
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

export interface DataMethodologyDoc {
  formulaTitle: string;
  formulaDescription: string;
  riverThresholdModelNote: string;
  adapterProvenanceNotes: {
    weatherAdapter: string;
    riverGaugeAdapter: string;
    satelliteAdapter: string;
    demAdapter: string;
    smsAdapter: string;
  };
  lastEditedBy: string;
  lastEditedAt: string;
}
