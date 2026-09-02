import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useLanguage } from '../context/LanguageContext';
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
  const { stations, alerts } = useSocket();
  const { t } = useLanguage();

  const [analytics, setAnalytics] = useState<any>(null);
  const [district, setDistrict] = useState('Sindhupalchok');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [action, setAction] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);

    try {
      const res = await fetch('/api/alerts/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district,
          severity: 'SEVERE',
          title: title || 'EMERGENCY RED ALERT BROADCAST',
          message: message || 'Cloudburst burst detected upstream. Evacuate immediately.',
          recommendedAction: action || 'Move above 800m elevation mark to high-ground shelters.',
          issuedBy: 'Government Operations Center (Manual Override)',
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

  const offlineStations = stations.filter((s) => s.status === 'OFFLINE' || s.status === 'WARNING');
  const onlineCount = stations.filter((s) => s.status === 'ONLINE').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            Admin & Government Operations Control Panel
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sensor telemetry health monitoring, historical flood correlation analytics, and district emergency overrides.
          </p>
        </div>

        <div className="flex gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-500 block">Total Sensors</span>
            <strong className="text-white text-lg">{stations.length}</strong>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-slate-500 block">Online Gauges</span>
            <strong className="text-emerald-400 text-lg">{onlineCount}</strong>
          </div>
        </div>
      </div>

      {/* Manual Emergency Broadcast Override Form */}
      <section className="bg-gradient-to-br from-red-950/90 via-slate-900 to-slate-950 border-2 border-red-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-red-400 font-extrabold text-lg">
          <Radio className="w-5 h-5 animate-pulse" />
          <span>Manual Emergency Broadcast Override (District Alert)</span>
        </div>
        <p className="text-xs text-slate-300">
          This manual override pushes a red alert banner instantly to all citizen screens and mobile devices in the selected district.
        </p>

        {broadcastSuccess && (
          <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            Emergency Broadcast Transmitted Successfully across WebSocket Channels!
          </div>
        )}

        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-200">Target District:</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5 focus:outline-none"
              >
                <option value="Sindhupalchok">Sindhupalchok</option>
                <option value="Nuwakot">Nuwakot</option>
                <option value="Kathmandu">Kathmandu Valley</option>
                <option value="Lamjung">Lamjung</option>
                <option value="Kaski">Kaski</option>
                <option value="Mustang">Mustang</option>
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-200">Broadcast Title:</label>
              <input
                type="text"
                placeholder="e.g. URGENT FLASH FLOOD EVACUATION WARNING"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-200">Emergency Alert Message:</label>
            <textarea
              rows={2}
              placeholder="Extreme cloudburst recorded. Bhotekoshi water level rising 2m/h..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5 focus:outline-none"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-200">Recommended Action:</label>
            <input
              type="text"
              placeholder="e.g. Evacuate immediately to Chautara Ridge High-Ground Shelter."
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-800 rounded-xl p-2.5 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isBroadcasting}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>{isBroadcasting ? 'Broadcasting Alert...' : 'PUSH DISTRICT EMERGENCY BROADCAST'}</span>
          </button>
        </form>
      </section>

      {/* Grid: Sensor Health + Historical Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensor Health Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              IoT Sensor Network Health Monitor
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {onlineCount} / {stations.length} Online
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {stations.map((st) => (
              <div
                key={st.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  {st.status === 'ONLINE' ? (
                    <Wifi className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-amber-400" />
                  )}
                  <div>
                    <h4 className="font-bold text-slate-200">{st.name}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {st.id} | Elev: {st.location.elevation}m
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      st.status === 'ONLINE' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                    }`}
                  >
                    {st.status}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {new Date(st.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Flood Analytics Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Historical Flood Event Analytics
          </h2>

          {analytics?.historicalFloods && (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.historicalFloods} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="year" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="rainfallPeak" name="Peak Rainfall (mm/h)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="casualtiesAvoided" name="Lives Saved / Evacuated" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
