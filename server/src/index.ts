import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import { authenticateToken, authorizeRoles, AuthenticatedRequest } from './middleware/authMiddleware.js';
import { initialAlerts, initialIncidents, initialRescueTeams, initialStations, initialZones } from './seedData.js';
import { DataMethodologyDoc, DistrictAlert, MonitoringStation, RescueTeam, RiskZone, RiverThresholdRecord, SOSIncident } from './types.js';
import { calculateStationRisk, calculateZoneRisk } from './services/riskEngine.js';
import { sosService } from './services/sosService.js';
import { riverGaugeAdapter } from './adapters/riverGaugeAdapter.js';
import { getInitialRiversRegistry } from './data/rivers.js';
import { alertAdapter } from './adapters/alertAdapter.js';
import { smsAdapter } from './adapters/smsAdapter.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// Auth Route
app.use('/api/auth', authRoutes);

// In-Memory Data Store (CWC PostGIS Ready Schema)
let stations: MonitoringStation[] = [...initialStations];
let zones: RiskZone[] = [...initialZones];
let incidents: SOSIncident[] = [...initialIncidents];
let rescueTeams: RescueTeam[] = [...initialRescueTeams];
let alerts: DistrictAlert[] = [...initialAlerts];
let rivers: RiverThresholdRecord[] = getInitialRiversRegistry();

// Default Data Methodology Portal Document
let methodologyDoc: DataMethodologyDoc = {
  formulaTitle: 'FloodGuard Himalayan & River Catchment Flash Flood Risk Score',
  formulaDescription: 'Multi-parameter weighted algorithm combining Rainfall Intensity (30%), Water Rise Rate (25%), Water Level Ratio (15%), CWC Per-River Threshold Breaches (15%), Soil Saturation (8%), and DEM Slope/Valley Funneling (7%).',
  riverThresholdModelNote: 'Per-River Threshold Registry models CWC (Central Water Commission) Warning, Danger, and Extreme Flood Levels based on channel depth, width, and catchment geometry. NOTE: Values in this prototype are illustrative demo values.',
  adapterProvenanceNotes: {
    weatherAdapter: 'Swappable OpenWeatherMap / IMD / NASA POWER Radar Telemetry Adapter',
    riverGaugeAdapter: 'IoT Ultrasonic & Radar Water Level Sensor Telemetry Stream',
    satelliteAdapter: 'NASA SMAP / Sentinel-1 Synthetic Aperture Radar Soil Saturation Adapter',
    demAdapter: 'Digital Elevation Model (DEM) 30m Slope Gradient & Canyon Narrowness Analyzer',
    smsAdapter: 'MSG91 / NDMA Emergency SMS Gateway Adapter (Simulated Stub)',
  },
  lastEditedBy: 'Dr. Ramesh Sharma (Admin)',
  lastEditedAt: new Date().toISOString(),
};

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// 1. Per-River Threshold Registry
app.get('/api/rivers', (req, res) => {
  res.json(rivers);
});

app.get('/api/rivers/:id', (req, res) => {
  const river = rivers.find((r) => r.id === req.params.id);
  if (!river) return res.status(404).json({ error: 'River record not found' });
  res.json(river);
});

// Admin-only River Threshold editing
app.patch('/api/rivers/:id/thresholds', authenticateToken, authorizeRoles('ADMIN'), (req, res) => {
  const { warningLevelM, dangerLevelM, extremeLevelM } = req.body;
  const river = rivers.find((r) => r.id === req.params.id);
  if (!river) return res.status(404).json({ error: 'River record not found' });

  if (warningLevelM !== undefined) river.warningLevelM = Number(warningLevelM);
  if (dangerLevelM !== undefined) river.dangerLevelM = Number(dangerLevelM);
  if (extremeLevelM !== undefined) river.extremeLevelM = Number(extremeLevelM);

  river.lastUpdated = new Date().toISOString();
  io.emit('river_threshold_updated', river);
  res.json(river);
});

// 2. Monitoring Stations
app.get('/api/stations', (req, res) => {
  res.json(stations);
});

// 3. Risk Zones
app.get('/api/zones', (req, res) => {
  const updatedZones = zones.map((z) => {
    const risk = calculateZoneRisk(z, stations);
    return {
      ...z,
      riskScore: risk.riskScore,
      riskLevel: risk.riskLevel,
      primaryRiskFactors: risk.primaryRiskFactors,
    };
  });
  zones = updatedZones;
  res.json(zones);
});

// 4. Emergency SOS Incidents & Operations
app.get('/api/incidents', (req, res) => {
  const sorted = [...incidents].sort((a, b) => b.priorityScore - a.priorityScore);
  res.json(sorted);
});

app.post('/api/sos', (req, res) => {
  const { citizenName, phone, location, headcount, medicalUrgency, note, mode, hasVoiceNote, voiceNoteUrl, zoneId, district } = req.body;

  const zone = zones.find((z) => z.id === zoneId) || zones[0];
  const stationInZone = stations.find((s) => s.district.toLowerCase() === (district || zone.district).toLowerCase()) || stations[0];

  const newIncident = sosService.createSOSIncident(
    {
      citizenName,
      phone,
      location,
      headcount,
      medicalUrgency,
      note,
      mode,
      hasVoiceNote,
      voiceNoteUrl,
      zoneId: zone.id,
      zoneName: zone.name,
      district: district || zone.district,
    },
    zone.riskScore,
    stationInZone.riseRate
  );

  incidents.unshift(newIncident);
  io.emit('sos_incident_created', newIncident);

  if (mode === 'SATELLITE') {
    simulateSatelliteHandshake(newIncident.id);
  }

  res.status(201).json(newIncident);
});

// Rescue Console Write Endpoints: Gated for ADMIN & RESCUE_TEAM
app.patch('/api/incidents/:id/assign', authenticateToken, authorizeRoles('ADMIN', 'RESCUE_TEAM'), (req: AuthenticatedRequest, res) => {
  const { teamId } = req.body;
  const incident = incidents.find((i) => i.id === req.params.id);
  const team = rescueTeams.find((t) => t.id === teamId);

  if (!incident || !team) {
    return res.status(404).json({ error: 'Incident or Rescue Team not found' });
  }

  incident.assignedTeamId = team.id;
  incident.assignedTeamName = team.name;
  incident.status = 'DISPATCHED';
  team.status = 'EN_ROUTE';
  team.assignedIncidentId = incident.id;

  incident.commsLog.push({
    id: `msg-${Date.now()}`,
    sender: req.user?.name || 'Command Dispatch',
    role: req.user?.role === 'RESCUE_TEAM' ? 'RESCUE_TEAM' : 'COMMAND_CENTER',
    message: `Assigned rescue team: ${team.name} (${team.vehicleType}). Unit Status set to EN_ROUTE.`,
    timestamp: new Date().toISOString(),
  });

  io.emit('sos_incident_updated', incident);
  io.emit('rescue_team_updated', team);

  res.json({ incident, team });
});

app.patch('/api/incidents/:id/status', authenticateToken, authorizeRoles('ADMIN', 'RESCUE_TEAM'), (req: AuthenticatedRequest, res) => {
  const { status } = req.body;
  const incident = incidents.find((i) => i.id === req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });

  incident.status = status;
  if (status === 'RESCUED') {
    if (incident.assignedTeamId) {
      const team = rescueTeams.find((t) => t.id === incident.assignedTeamId);
      if (team) {
        team.status = 'AVAILABLE';
        team.assignedIncidentId = undefined;
        io.emit('rescue_team_updated', team);
      }
    }
  }

  incident.commsLog.push({
    id: `msg-${Date.now()}`,
    sender: req.user?.name || 'Rescue System',
    role: req.user?.role === 'RESCUE_TEAM' ? 'RESCUE_TEAM' : 'COMMAND_CENTER',
    message: `Incident status updated to: ${status}`,
    timestamp: new Date().toISOString(),
  });

  io.emit('sos_incident_updated', incident);
  res.json(incident);
});

app.post('/api/incidents/:id/comms', authenticateToken, authorizeRoles('ADMIN', 'RESCUE_TEAM', 'GOVERNMENT'), (req: AuthenticatedRequest, res) => {
  const { message } = req.body;
  const incident = incidents.find((i) => i.id === req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });

  const newMsg = {
    id: `msg-${Date.now()}`,
    sender: req.user?.name || 'Dispatcher',
    role: (req.user?.role as any) || 'COMMAND_CENTER',
    message,
    timestamp: new Date().toISOString(),
  };

  incident.commsLog.push(newMsg);
  io.emit('sos_incident_updated', incident);
  res.json(newMsg);
});

app.get('/api/rescue-teams', (req, res) => {
  res.json(rescueTeams);
});

// 5. Emergency Alerts & Government Manual Overrides
app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

app.post('/api/alerts/broadcast', authenticateToken, authorizeRoles('ADMIN', 'GOVERNMENT'), (req: AuthenticatedRequest, res) => {
  const { district, severity, title, message, recommendedAction } = req.body;

  const newAlert: DistrictAlert = {
    id: `ALERT-${Math.floor(800 + Math.random() * 100)}`,
    district: district || 'All Districts',
    severity: severity || 'SEVERE',
    title: title || 'EMERGENCY FLASH FLOOD BROADCAST',
    message,
    recommendedAction: recommendedAction || 'Move to higher ground immediately.',
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 3600000).toISOString(),
    active: true,
    isManualOverride: true,
    issuedBy: req.user?.name ? `${req.user.name} (${req.user.role})` : 'Government Emergency Operations Center',
  };

  alerts.unshift(newAlert);
  io.emit('broadcast_alert', newAlert);
  res.status(201).json(newAlert);
});

// 6. Admin Analytics & Simulated SMS Logs
app.get('/api/analytics', (req, res) => {
  res.json({
    totalStations: stations.length,
    onlineStations: stations.filter((s) => s.status === 'ONLINE').length,
    activeIncidents: incidents.filter((i) => i.status !== 'RESCUED').length,
    totalRescuedPeople: incidents
      .filter((i) => i.status === 'RESCUED')
      .reduce((acc, i) => acc + i.headcount, 0),
    smsLogs: smsAdapter.getSMSLogs(),
    historicalFloods: [
      { year: '2024 (Jul)', district: 'Sindhupalchok', rainfallPeak: 142, waterRiseMax: 3.2, casualtiesAvoided: 450 },
      { year: '2024 (Sep)', district: 'Kathmandu Valley', rainfallPeak: 110, waterRiseMax: 2.8, casualtiesAvoided: 1200 },
      { year: '2025 (Aug)', district: 'Nuwakot Trishuli', rainfallPeak: 98, waterRiseMax: 2.4, casualtiesAvoided: 310 },
      { year: '2026 (Live)', district: 'Himalayan Catchments', rainfallPeak: 82, waterRiseMax: 1.85, casualtiesAvoided: 68 },
    ],
  });
});

// 7. Government Data Methodology Portal
app.get('/api/data-methodology', (req, res) => {
  res.json(methodologyDoc);
});

app.put('/api/data-methodology', authenticateToken, authorizeRoles('ADMIN'), (req: AuthenticatedRequest, res) => {
  const { formulaTitle, formulaDescription, riverThresholdModelNote, adapterProvenanceNotes } = req.body;
  if (formulaTitle) methodologyDoc.formulaTitle = formulaTitle;
  if (formulaDescription) methodologyDoc.formulaDescription = formulaDescription;
  if (riverThresholdModelNote) methodologyDoc.riverThresholdModelNote = riverThresholdModelNote;
  if (adapterProvenanceNotes) methodologyDoc.adapterProvenanceNotes = adapterProvenanceNotes;

  methodologyDoc.lastEditedBy = req.user?.name || 'Admin';
  methodologyDoc.lastEditedAt = new Date().toISOString();

  io.emit('methodology_updated', methodologyDoc);
  res.json(methodologyDoc);
});

// ----------------------------------------------------
// SIMULATION ENGINE & REAL-TIME WEBSOCKET TICK
// ----------------------------------------------------

function simulateSatelliteHandshake(incidentId: string) {
  setTimeout(() => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (inc && inc.status === 'SENT') {
      inc.status = 'SATELLITE_RELAY';
      inc.commsLog.push({
        id: `msg-${Date.now()}`,
        sender: 'Orbital Transponder #412',
        role: 'COMMAND_CENTER',
        message: 'Satellite Relay Acknowledged packet payload. Forwarding to Himalayan Ground Station.',
        timestamp: new Date().toISOString(),
      });
      io.emit('sos_incident_updated', inc);
    }
  }, 3000);

  setTimeout(() => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (inc && inc.status === 'SATELLITE_RELAY') {
      inc.status = 'RECEIVED';
      inc.commsLog.push({
        id: `msg-${Date.now()}`,
        sender: 'Himalayan Ground Station',
        role: 'COMMAND_CENTER',
        message: 'Packet decoded at Command Operations. Incident added to priority queue.',
        timestamp: new Date().toISOString(),
      });
      io.emit('sos_incident_updated', inc);
    }
  }, 6500);
}

// Telemetry simulation tick every 6 seconds: updates rivers & stations, checks threshold breaches
setInterval(() => {
  // Update River Levels & Check Breaches
  rivers = rivers.map((river) => {
    const previousLevel = river.currentLevelM;
    const delta = (Math.random() - 0.45) * 0.15;
    const newLevel = Math.max(1.0, Number((river.currentLevelM + delta).toFixed(2)));
    const updatedRiver = { ...river, currentLevelM: newLevel, lastUpdated: new Date().toISOString() };

    // Evaluate Breach via AlertAdapter
    const result = alertAdapter.evaluateRiverBreach(updatedRiver, previousLevel);
    if (result.breached) {
      updatedRiver.isBreached = true;
      updatedRiver.breachSeverity = result.severity;

      if (result.autoIncident) {
        incidents.unshift(result.autoIncident);
        io.emit('sos_incident_created', result.autoIncident);
      }

      io.emit('river_danger_breach', {
        river: updatedRiver,
        severity: result.severity,
        smsLog: result.smsLog,
      });
    } else if (newLevel < river.warningLevelM) {
      updatedRiver.isBreached = false;
      updatedRiver.breachSeverity = 'NONE';
    }

    return updatedRiver;
  });

  // Update Stations & Risk Engine
  stations = stations.map((st) => {
    if (st.status === 'OFFLINE') return st;

    const { waterLevelMeters, rateOfRiseMetersPerHour } = riverGaugeAdapter.generateSimulatedTelemetry(
      st.waterLevel,
      st.dangerLevel
    );

    const rainDelta = (Math.random() - 0.48) * 1.5;
    const newRainfall = Math.max(0, Number((st.rainfall + rainDelta).toFixed(1)));

    const matchingRiver = rivers.find((r) => r.name.toLowerCase() === st.riverName?.toLowerCase());

    const updatedSt = {
      ...st,
      waterLevel: waterLevelMeters,
      riseRate: rateOfRiseMetersPerHour,
      rainfall: newRainfall,
      lastUpdated: new Date().toISOString(),
    };

    const { riskScore, riskLevel } = calculateStationRisk(updatedSt, matchingRiver);
    updatedSt.riskScore = riskScore;
    updatedSt.riskLevel = riskLevel;

    const history = [...st.telemetryHistory];
    if (history.length > 24) history.shift();
    history.push({
      timestamp: new Date().toISOString(),
      waterLevel: updatedSt.waterLevel,
      rainfall: updatedSt.rainfall,
      soilMoisture: updatedSt.soilMoisture,
    });
    updatedSt.telemetryHistory = history;

    return updatedSt;
  });

  io.emit('telemetry_tick', { stations, zones, rivers });
}, 6000);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`⚡ FloodGuard Server running on http://localhost:${PORT}`);
});
