import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { RiverThresholdRecord, SimulatedSMSLog } from '../types';
import {
  ShieldAlert,
  Activity,
  Radio,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Send,
  Wifi,
  WifiOff,
  MessageSquare,
  Edit3,
  Save,
  Waves,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const Admin: React.FC = () => {
  const { stations } = useSocket();
  const { t } = useLanguage();
  const { user, token } = useAuth();

  const [analytics, setAnalytics] = useState<any>(null);
  const [rivers, setRivers] = useState<RiverThresholdRecord[]>([]);
  const [editingRiverId, setEditingRiverId] = useState<string | null>(null);
  const [warningM, setWarningM] = useState<number>(0);
  const [dangerM, setDangerM] = useState<number>(0);
  const [extremeM, setExtremeM] = useState<number>(0);

  // Manual broadcast form state
  const [district, setDistrict] = useState('Sindhupalchok');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [action, setAction] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) setAnalytics(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRivers = async () => {
    try {
      const res = await fetch('/api/rivers');
      if (res.ok) setRivers(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchRivers();
  }, []);

  const handleSaveThresholds = async (riverId: string) => {
    if (user.role !== 'ADMIN') return;

    try {
      const res = await fetch(`/api/rivers/${riverId}/thresholds`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          warningLevelM: warningM,
          dangerLevelM: dangerM,
          extremeLevelM: extremeM,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setRivers((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        setEditingRiverId(null);
      }
    } catch (err) {
      console.error('Failed to update river threshold:', err);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!['ADMIN', 'GOVERNMENT'].includes(user.role)) return;

    setIsBroadcasting(true);
    try {
      const res = await fetch('/api/alerts/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          district,
          severity: 'SEVERE',
          title: title || 'EMERGENCY RED ALERT BROADCAST',
          message: message || 'Cloudburst anomaly recorded upstream. Move to high ground immediately.',
          recommendedAction: action || 'Evacuate to designated high-ground shelters.',
        }),
      });

      if (res.ok) {
        setBroadcastSuccess(true);
        setTitle('');
        setMessage('');
        setAction('');
        setTimeout(() => setBroadcastSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-950 border border-red-500/40 text-red-400 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
              {user.role} Authorization
            </span>
            <span className="text-xs text-slate-400 font-mono">User: {user.name}</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            Admin & Government Operations Control Panel
          </h1>
        </div>
      </div>

      {/* Manual Emergency Broadcast Override Form */}
      {['ADMIN', 'GOVERNMENT'].includes(user.role) && (
        <section className="bg-gradient-to-br from-red-950/90 via-slate-900 to-slate-950 border-2 border-red-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-red-400 font-extrabold text-lg">
            <Radio className="w-5 h-5 animate-pulse" />
            <span>Manual Emergency Broadcast Override (District Alert)</span>
          </div>

          {broadcastSuccess && (
            <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Emergency Broadcast Transmitted Successfully!
            </div>
          )}

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Target District:</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5"
                >
                  <option value="Sindhupalchok">Sindhupalchok</option>
                  <option value="Nuwakot">Nuwakot</option>
                  <option value="Kathmandu">Kathmandu Valley</option>
                  <option value="Lamjung">Lamjung</option>
                  <option value="Kaski">Kaski</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-200">Broadcast Title:</label>
                <input
                  type="text"
                  placeholder="e.g. URGENT FLASH FLOOD EVACUATION WARNING"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-200">Emergency Message:</label>
              <textarea
                rows={2}
                placeholder="Cloudburst anomaly recorded upstream. Water level rising fast..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5"
              />
            </div>

            <button
              type="submit"
              disabled={isBroadcasting}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>{isBroadcasting ? 'Broadcasting...' : 'PUSH DISTRICT EMERGENCY BROADCAST'}</span>
            </button>
          </form>
        </section>
      )}

      {/* Per-River CWC Threshold Management Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-400" />
            CWC Per-River Threshold Management Registry
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {user.role === 'ADMIN' ? 'Editable (Admin)' : 'Read-Only (Government)'}
          </span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {rivers.map((r) => {
            const isEditing = editingRiverId === r.id;
            return (
              <div key={r.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white text-sm">{r.name} ({r.basin})</h3>
                    <p className="text-[10px] text-slate-500 font-mono">ID: {r.id} | Shape: {r.channelShape}</p>
                  </div>
                  {user.role === 'ADMIN' && !isEditing && (
                    <button
                      onClick={() => {
                        setEditingRiverId(r.id);
                        setWarningM(r.warningLevelM);
                        setDangerM(r.dangerLevelM);
                        setExtremeM(r.extremeLevelM);
                      }}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded font-semibold text-xs flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Thresholds
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div>
                      <span className="text-[10px] text-slate-400">Warning (m):</span>
                      <input
                        type="number"
                        step="0.1"
                        value={warningM}
                        onChange={(e) => setWarningM(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Danger (m):</span>
                      <input
                        type="number"
                        step="0.1"
                        value={dangerM}
                        onChange={(e) => setDangerM(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Extreme (m):</span>
                      <input
                        type="number"
                        step="0.1"
                        value={extremeM}
                        onChange={(e) => setExtremeM(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-white font-mono"
                      />
                    </div>
                    <div className="col-span-3 flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setEditingRiverId(null)}
                        className="px-3 py-1 bg-slate-800 text-slate-400 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveThresholds(r.id)}
                        className="px-3 py-1 bg-emerald-600 text-white font-bold rounded flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 font-mono text-[11px] text-slate-300 pt-1 border-t border-slate-900">
                    <span>Current: <strong className="text-cyan-400">{r.currentLevelM.toFixed(1)}m</strong></span>
                    <span>Warning: <strong className="text-amber-400">{r.warningLevelM}m</strong></span>
                    <span>Danger: <strong className="text-orange-400">{r.dangerLevelM}m</strong></span>
                    <span>Extreme: <strong className="text-red-400">{r.extremeLevelM}m</strong></span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Surface Simulated SMS Dispatch Logs */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          Simulated SMS Emergency Dispatch Logs (MSG91 / NDMA Stub)
        </h2>

        <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
          {analytics?.smsLogs && analytics.smsLogs.length > 0 ? (
            analytics.smsLogs.map((log: SimulatedSMSLog) => (
              <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span className="font-bold text-amber-400">{log.providerStub}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-200 text-xs">"{log.message}"</p>
                <div className="text-[10px] text-slate-500">
                  Target: <strong>{log.recipientCount} citizens</strong> within {log.radiusKm}km radius of {log.riverName}
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-500 italic p-4 text-center">
              No simulated SMS alerts dispatched yet. (Triggers automatically when river water levels cross danger thresholds).
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
