import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DistrictAlert, MonitoringStation, RescueTeam, RiskZone, SOSIncident } from '../types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  stations: MonitoringStation[];
  zones: RiskZone[];
  incidents: SOSIncident[];
  rescueTeams: RescueTeam[];
  alerts: DistrictAlert[];
  fetchInitialData: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [stations, setStations] = useState<MonitoringStation[]>([]);
  const [zones, setZones] = useState<RiskZone[]>([]);
  const [incidents, setIncidents] = useState<SOSIncident[]>([]);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>([]);
  const [alerts, setAlerts] = useState<DistrictAlert[]>([]);

  const fetchInitialData = async () => {
    try {
      const [stRes, znRes, incRes, tmRes, altRes] = await Promise.all([
        fetch('/api/stations'),
        fetch('/api/zones'),
        fetch('/api/incidents'),
        fetch('/api/rescue-teams'),
        fetch('/api/alerts'),
      ]);

      if (stRes.ok) setStations(await stRes.json());
      if (znRes.ok) setZones(await znRes.json());
      if (incRes.ok) setIncidents(await incRes.json());
      if (tmRes.ok) setRescueTeams(await tmRes.json());
      if (altRes.ok) setAlerts(await altRes.json());
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  };

  useEffect(() => {
    fetchInitialData();

    const s = io(window.location.origin, {
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    s.on('connect', () => {
      setIsConnected(true);
    });

    s.on('disconnect', () => {
      setIsConnected(false);
    });

    s.on('telemetry_tick', (data: { stations: MonitoringStation[]; zones: RiskZone[] }) => {
      if (data.stations) setStations(data.stations);
      if (data.zones) setZones(data.zones);
    });

    s.on('sos_incident_created', (newIncident: SOSIncident) => {
      setIncidents((prev) => [newIncident, ...prev.filter((i) => i.id !== newIncident.id)]);
    });

    s.on('sos_incident_updated', (updatedIncident: SOSIncident) => {
      setIncidents((prev) =>
        prev.map((i) => (i.id === updatedIncident.id ? updatedIncident : i))
      );
    });

    s.on('rescue_team_updated', (updatedTeam: RescueTeam) => {
      setRescueTeams((prev) =>
        prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t))
      );
    });

    s.on('broadcast_alert', (newAlert: DistrictAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        stations,
        zones,
        incidents,
        rescueTeams,
        alerts,
        fetchInitialData,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within SocketProvider');
  return ctx;
};
