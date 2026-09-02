import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useLanguage } from '../context/LanguageContext';
import { SOSIncident, RescueTeam } from '../types';
import {
  Shield,
  Radio,
  Users,
  AlertTriangle,
  Send,
  MapPin,
  CheckCircle2,
  Phone,
  Navigation,
  Flame,
} from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';

export const RescueConsole: React.FC = () => {
  const { incidents, rescueTeams, socket } = useSocket();
  const { t } = useLanguage();

  const [selectedIncident, setSelectedIncident] = useState<SOSIncident | null>(incidents[0] || null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const activeIncident = selectedIncident || incidents[0];

  const handleAssignTeam = async (teamId: string) => {
    if (!activeIncident) return;

    try {
      const res = await fetch(`/api/incidents/${activeIncident.id}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId }),
      });

      if (res.ok) {
        setAssignModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to assign team:', err);
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!activeIncident) return;

    try {
      await fetch(`/api/incidents/${activeIncident.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSendComms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeIncident) return;

    try {
      await fetch(`/api/incidents/${activeIncident.id}/comms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'Command Operations Officer',
          role: 'COMMAND_CENTER',
          message: chatInput.trim(),
        }),
      });
      setChatInput('');
    } catch (err) {
      console.error('Failed to send comms message:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-500" />
            Emergency & Rescue Operations Command Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time priority incident dispatch, satellite relay feed, and rescue taskforce coordination.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/40 px-3 py-1.5 rounded-xl text-xs font-mono text-red-300 font-bold">
          <Radio className="w-4 h-4 text-red-400 animate-pulse" />
          <span>Active Operations: {incidents.filter((i) => i.status !== 'RESCUED').length} Incidents</span>
        </div>
      </div>

      {/* Main Grid: Priority Incident Feed + Operations Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Priority-Sorted Incident Cards Queue */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Priority Emergency Incidents</span>
            <span className="text-[10px] text-slate-500">Auto-Sorted by Priority Score</span>
          </h2>

          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {incidents.map((inc) => {
              const isSelected = activeIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-slate-900 border-red-500/80 shadow-lg ring-1 ring-red-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm">{inc.citizenName}</span>
                        <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                          {inc.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" /> {inc.district} ({inc.zoneName})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="bg-red-950 text-red-400 border border-red-500/40 text-[11px] font-mono px-2 py-0.5 rounded font-bold">
                        Score {inc.priorityScore}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{inc.headcount} Trapped</span>
                    </div>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300 font-semibold uppercase">
                      {inc.mode} SOS
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        inc.status === 'RESCUED'
                          ? 'bg-emerald-950 text-emerald-400'
                          : inc.status === 'DISPATCHED'
                          ? 'bg-cyan-950 text-cyan-400'
                          : 'bg-red-950 text-red-400 animate-pulse'
                      }`}
                    >
                      {inc.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Incident Command Workspace */}
        {activeIncident ? (
          <div className="lg:col-span-2 space-y-4">
            {/* Active Incident Details Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      {activeIncident.mode} SOS INCIDENT
                    </span>
                    <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">
                      ID: {activeIncident.id}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white mt-1">
                    {activeIncident.citizenName} — {activeIncident.headcount} Stranded Citizens
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Location: {activeIncident.location.addressDescription} (GPS: {activeIncident.location.lat.toFixed(4)}, {activeIncident.location.lng.toFixed(4)})
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs text-slate-400">Medical Urgency:</div>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      activeIncident.medicalUrgency === 'CRITICAL'
                        ? 'bg-red-950 border border-red-500 text-red-400 animate-pulse'
                        : 'bg-amber-950 border border-amber-500 text-amber-400'
                    }`}
                  >
                    {activeIncident.medicalUrgency}
                  </span>
                </div>
              </div>

              {/* Citizen Note */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 font-semibold">Citizen Distress Message:</span>
                <p className="text-slate-200 italic text-sm">"{activeIncident.note}"</p>
              </div>

              {/* Dispatch Action Panel */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Taskforce Dispatch Status
                  </span>
                  <button
                    onClick={() => setAssignModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    {activeIncident.assignedTeamName ? 'Re-Assign Team' : 'Assign Rescue Taskforce'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-500">Assigned Team:</span>
                    <p className="text-slate-200 font-bold mt-0.5">
                      {activeIncident.assignedTeamName || 'Unassigned (Awaiting Dispatch)'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-500">Incident Lifecycle Stage:</span>
                    <select
                      value={activeIncident.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="w-full bg-slate-950 text-cyan-400 font-bold border border-slate-800 rounded px-2 py-1 mt-1 text-xs focus:outline-none"
                    >
                      <option value="SENT">SENT (Handset)</option>
                      <option value="SATELLITE_RELAY">SATELLITE RELAY</option>
                      <option value="RECEIVED">RECEIVED (Command)</option>
                      <option value="DISPATCHED">DISPATCHED (En Route)</option>
                      <option value="RESCUED">RESCUED (Evacuation Complete)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Real-time Incident Chat / Comms Log */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Live Operation Comms Log
                </h3>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-52 overflow-y-auto space-y-2 text-xs">
                  {activeIncident.commsLog.map((c) => (
                    <div key={c.id} className="p-2 rounded bg-slate-900/80 border border-slate-800/80 space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-cyan-400">{c.sender} ({c.role})</span>
                        <span className="text-slate-500 font-mono">
                          {new Date(c.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-200">{c.message}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendComms} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Broadcast message to team & citizen..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Taskforce Assignment Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-red-500" />
              Dispatch Rescue Unit to {activeIncident?.citizenName}
            </h3>

            <div className="space-y-3">
              {rescueTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{team.name}</h4>
                    <p className="text-slate-400 mt-0.5">
                      Leader: {team.unitLeader} | Vehicle: <strong>{team.vehicleType}</strong>
                    </p>
                    <span className="text-emerald-400 font-mono text-[10px]">Status: {team.status}</span>
                  </div>

                  <button
                    onClick={() => handleAssignTeam(team.id)}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs"
                  >
                    Dispatch Now
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setAssignModalOpen(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
