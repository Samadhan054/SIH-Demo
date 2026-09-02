import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { initialAlerts, initialIncidents, initialRescueTeams, initialStations, initialZones } from './seedData.js';
import { DistrictAlert, MonitoringStation, RescueTeam, RiskZone, SOSIncident } from './types.js';
import { calculateStationRisk, calculateZoneRisk } from './services/riskEngine.js';
import { sosService } from './services/sosService.js';
import { riverGaugeAdapter } from './adapters/riverGaugeAdapter.js';

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

// In-Memory Data Store (PostGIS schema ready)
let stations: MonitoringStation[] = [...initialStations];
let zones: RiskZone[] = [...initialZones];
let incidents: SOSIncident[] = [...initialIncidents];
let rescueTeams: RescueTeam[] = [...initialRescueTeams];
let alerts: DistrictAlert[] = [...initialAlerts];

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// 1. Monitoring Stations Feed
app.get('/api/stations', (req, res) => {
  res.json(stations);
});

app.get('/api/stations/:id', (req, res) => {
  const station = stations.find((s) => s.id === req.params.id);
  if (!station) return res.status(404).json({ error: 'Station not found' });
  res.json(station);
});

// 2. Risk Zones Feed
app.get('/api/zones', (req, res) => {
  // Recalculate zone risks dynamically based on live station telemetry
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

// 3. Emergency SOS Incidents
app.get('/api/incidents', (req, res) => {
  // Sorted by auto-calculated priority score descending
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

  // Broadcast to all connected clients & rescue team consoles
  io.emit('sos_incident_created', newIncident);

  // If Satellite mode, trigger low-latency simulated satellite handshake progression
  if (mode === 'SATELLITE') {
    simulateSatelliteHandshake(newIncident.id);
  }

  res.status(201).json(newIncident);
});

// 4. Rescue Team Assignment & Dispatch Workflow
app.get('/api/rescue-teams', (req, res) => {
  res.json(rescueTeams);
});

app.patch('/api/incidents/:id/assign', (req, res) => {
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
    sender: 'Command Dispatch',
    role: 'COMMAND_CENTER',
    message: `Assigned rescue team: ${team.name} (${team.vehicleType}). Unit Status set to EN_ROUTE.`,
    timestamp: new Date().toISOString(),
  });

  io.emit('sos_incident_updated', incident);
  io.emit('rescue_team_updated', team);

  res.json({ incident, team });
});

app.patch('/api/incidents/:id/status', (req, res) => {
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
    sender: 'Rescue Operation System',
    role: 'COMMAND_CENTER',
    message: `Incident status updated to: ${status}`,
    timestamp: new Date().toISOString(),
  });

  io.emit('sos_incident_updated', incident);
  res.json(incident);
});

app.post('/api/incidents/:id/comms', (req, res) => {
  const { sender, role, message } = req.body;
  const incident = incidents.find((i) => i.id === req.params.id);
  if (!incident) return res.status(404).json({ error: 'Incident not found' });

  const newMsg = {
    id: `msg-${Date.now()}`,
    sender: sender || 'User',
    role: role || 'CITIZEN',
    message,
    timestamp: new Date().toISOString(),
  };

  incident.commsLog.push(newMsg);
  io.emit('sos_incident_updated', incident);
  res.json(newMsg);
});

// 5. Emergency Alerts & Government Manual Override
app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

app.post('/api/alerts/broadcast', (req, res) => {
  const { district, severity, title, message, recommendedAction, issuedBy } = req.body;

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
    issuedBy: issuedBy || 'Government Emergency Operations Center',
  };

  alerts.unshift(newAlert);
  io.emit('broadcast_alert', newAlert);
  res.status(201).json(newAlert);
});

// 6. Admin Analytics & Historical Log
app.get('/api/analytics', (req, res) => {
  res.json({
    totalStations: stations.length,
    onlineStations: stations.filter((s) => s.status === 'ONLINE').length,
    activeIncidents: incidents.filter((i) => i.status !== 'RESCUED').length,
    totalRescuedPeople: incidents
      .filter((i) => i.status === 'RESCUED')
      .reduce((acc, i) => acc + i.headcount, 0),
    historicalFloods: [
      { year: '2024 (Jul)', district: 'Sindhupalchok', rainfallPeak: 142, waterRiseMax: 3.2, casualtiesAvoided: 450 },
      { year: '2024 (Sep)', district: 'Kathmandu Valley', rainfallPeak: 110, waterRiseMax: 2.8, casualtiesAvoided: 1200 },
      { year: '2025 (Aug)', district: 'Nuwakot Trishuli', rainfallPeak: 98, waterRiseMax: 2.4, casualtiesAvoided: 310 },
      { year: '2026 (Live)', district: 'Himalayan Foothills', rainfallPeak: 82, waterRiseMax: 1.85, casualtiesAvoided: 68 },
    ],
  });
});

// ----------------------------------------------------
// SIMULATION ENGINE & REAL-TIME WEBSOCKET TICK
// ----------------------------------------------------

function simulateSatelliteHandshake(incidentId: string) {
  // Step 1: Sent -> Satellite Relay Acknowledged (after 3 seconds)
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

  // Step 2: Satellite Relay -> Command Center Received (after 6 seconds)
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

// Telemetry simulation tick every 6 seconds to trigger dynamic risk score updates
setInterval(() => {
  stations = stations.map((st) => {
    if (st.status === 'OFFLINE') return st;

    const { waterLevelMeters, rateOfRiseMetersPerHour } = riverGaugeAdapter.generateSimulatedTelemetry(
      st.waterLevel,
      st.dangerLevel
    );

    // Slight rain fluctuation
    const rainDelta = (Math.random() - 0.48) * 1.5;
    const newRainfall = Math.max(0, Number((st.rainfall + rainDelta).toFixed(1)));

    const updatedSt = {
      ...st,
      waterLevel: waterLevelMeters,
      riseRate: rateOfRiseMetersPerHour,
      rainfall: newRainfall,
      lastUpdated: new Date().toISOString(),
    };

    // Calculate new Risk Score via Risk Engine
    const { riskScore, riskLevel } = calculateStationRisk(updatedSt);
    updatedSt.riskScore = riskScore;
    updatedSt.riskLevel = riskLevel;

    // Append to telemetry history
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

  // Broadcast live telemetry update
  io.emit('telemetry_tick', { stations, zones });
}, 6000);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`⚡ FloodGuard Server running on http://localhost:${PORT}`);
});
