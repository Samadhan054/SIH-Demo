import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useLanguage } from '../context/LanguageContext';
import { SOSIncident, SOSMode, UrgencyLevel } from '../types';
import {
  AlertTriangle,
  Radio,
  MapPin,
  Users,
  HeartPulse,
  Send,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
  Mic,
} from 'lucide-react';

export const SOS: React.FC = () => {
  const { socket } = useSocket();
  const { t } = useLanguage();

  const [mode, setMode] = useState<SOSMode>('SATELLITE');
  const [citizenName, setCitizenName] = useState('');
  const [phone, setPhone] = useState('');
  const [lat, setLat] = useState<number>(27.882);
  const [lng, setLng] = useState<number>(85.885);
  const [address, setAddress] = useState('Near Tatopani river bridge settlement');
  const [headcount, setHeadcount] = useState<number>(4);
  const [medicalUrgency, setMedicalUrgency] = useState<UrgencyLevel>('HIGH');
  const [note, setNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceNote, setHasVoiceNote] = useState(false);

  const [activeSOS, setActiveSOS] = useState<SOSIncident | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(Number(pos.coords.latitude.toFixed(4)));
          setLng(Number(pos.coords.longitude.toFixed(4)));
        },
        () => {
          alert('GPS geolocation request timed out. Using default mountain coordinates.');
        }
      );
    }
  };

  const handleTriggerSOS = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenName: citizenName || 'Anonymous Himalayan Resident',
          phone: phone || '+977 9800000000',
          location: {
            lat,
            lng,
            addressDescription: address,
          },
          headcount,
          medicalUrgency,
          note: note || 'Flash flood rising quickly. Urgent evacuation needed.',
          mode,
          hasVoiceNote,
          district: 'Sindhupalchok',
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setActiveSOS(created);
      }
    } catch (err) {
      console.error('Failed to trigger SOS:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compressed binary packet size calculation preview for Satellite SOS
  const estimatedBytes = 12 + new TextEncoder().encode(note || '').length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Warning Banner */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-red-950 border border-red-500/50 p-5 rounded-2xl shadow-2xl text-white space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600 rounded-xl shadow-lg animate-pulse">
            <AlertTriangle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{t('reportEmergency')}</h1>
            <p className="text-xs text-red-200">
              Low-bandwidth satellite emergency gateway for flash flood survival & rescue dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* Active Triggered SOS Tracking Status Card */}
      {activeSOS ? (
        <div className="bg-slate-900 border-2 border-red-500 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
                Emergency Signal Broadcasted
              </span>
              <h2 className="text-2xl font-black text-white">Incident Ticket: {activeSOS.id}</h2>
            </div>
            <div className="px-3 py-1 bg-red-950 text-red-400 border border-red-500/40 rounded-full font-bold text-xs animate-pulse">
              LIVE TRACKING ACTIVE
            </div>
          </div>

          {/* Satellite Handshake Protocol Progress Visualizer */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-spin" />
              Satellite Transmission Handshake Timeline
            </h3>

            <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 pl-6 py-2">
              {/* Step 1 */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-black font-bold">
                  ✓
                </span>
                <h4 className="font-bold text-sm text-emerald-400">1. Handset Transmitted</h4>
                <p className="text-xs text-slate-400">
                  Compressed binary packet ({activeSOS.packetSizeCompressedBytes || 132} Bytes) sent via S-band uplink.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <span
                  className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    ['SATELLITE_RELAY', 'RECEIVED', 'DISPATCHED', 'RESCUED'].includes(activeSOS.status)
                      ? 'bg-emerald-500 text-black'
                      : 'bg-amber-500 animate-ping text-black'
                  }`}
                >
                  2
                </span>
                <h4
                  className={`font-bold text-sm ${
                    ['SATELLITE_RELAY', 'RECEIVED', 'DISPATCHED', 'RESCUED'].includes(activeSOS.status)
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  2. Satellite Relay Acknowledged
                </h4>
                <p className="text-xs text-slate-400">
                  Orbital Transponder #412 acknowledged payload. Re-broadcasting to ground command station.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <span
                  className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    ['RECEIVED', 'DISPATCHED', 'RESCUED'].includes(activeSOS.status)
                      ? 'bg-emerald-500 text-black'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  3
                </span>
                <h4
                  className={`font-bold text-sm ${
                    ['RECEIVED', 'DISPATCHED', 'RESCUED'].includes(activeSOS.status)
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  3. Decoded at Command Operations Center
                </h4>
                <p className="text-xs text-slate-400">
                  Incident prioritized. Dispatcher evaluating nearest helicopter / boat taskforce.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <span
                  className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    ['DISPATCHED', 'RESCUED'].includes(activeSOS.status)
                      ? 'bg-emerald-500 text-black'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  4
                </span>
                <h4
                  className={`font-bold text-sm ${
                    ['DISPATCHED', 'RESCUED'].includes(activeSOS.status)
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  4. Rescue Team Dispatched
                </h4>
                <p className="text-xs text-slate-400">
                  {activeSOS.assignedTeamName
                    ? `Assigned Taskforce: ${activeSOS.assignedTeamName}`
                    : 'Dispatch pending unit assignment.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-200">Incident Comms & Updates Log:</div>
            {activeSOS.commsLog.map((c) => (
              <div key={c.id} className="text-slate-400 flex items-start gap-2 pt-1 border-t border-slate-900">
                <span className="font-semibold text-cyan-400">{c.sender}:</span>
                <span className="flex-1">{c.message}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveSOS(null)}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors"
          >
            Submit Another Emergency Signal
          </button>
        </div>
      ) : (
        /* Form to Trigger SOS */
        <form
          onSubmit={handleTriggerSOS}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          {/* Mode Selector Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Communication Protocol Mode:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('SATELLITE')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  mode === 'SATELLITE'
                    ? 'bg-red-950/80 border-red-500 text-white font-bold shadow-lg shadow-red-950/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                  <span>{t('satelliteMode')}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Low-bandwidth 128B compressed payload. Works without cellular towers.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('STANDARD')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  mode === 'STANDARD'
                    ? 'bg-cyan-950/80 border-cyan-500 text-white font-bold shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>{t('standardMode')}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Full internet payload with precise location & details.
                </p>
              </button>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Your Full Name:</label>
              <input
                type="text"
                required
                placeholder="e.g. Pema Sherpa"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Contact Number:</label>
              <input
                type="text"
                required
                placeholder="+977 9800000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Headcount & Medical Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" /> Headcount (Number of People Trapped):
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-red-400" /> Medical Urgency Level:
              </label>
              <select
                value={medicalUrgency}
                onChange={(e) => setMedicalUrgency(e.target.value as UrgencyLevel)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-red-500 focus:outline-none"
              >
                <option value="CRITICAL">{t('urgencyCritical')}</option>
                <option value="HIGH">{t('urgencyHigh')}</option>
                <option value="MEDIUM">{t('urgencyMedium')}</option>
                <option value="LOW">{t('urgencyLow')}</option>
              </select>
            </div>
          </div>

          {/* GPS Coordinates Picker */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500" /> GPS Rescue Coordinates:
              </span>
              <button
                type="button"
                onClick={handleGetLocation}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-semibold transition-colors"
              >
                Auto-Detect GPS
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <span className="text-slate-500">Latitude:</span>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-bold"
                />
              </div>
              <div>
                <span className="text-slate-500">Longitude:</span>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-bold"
                />
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400">Landmark / Location Detail:</span>
              <input
                type="text"
                placeholder="e.g. Near school ground 200m above river bank"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 mt-1"
              />
            </div>
          </div>

          {/* Emergency Note & Voice Note Simulation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Emergency Text Note:</label>
              {mode === 'SATELLITE' && (
                <span className="text-amber-400 font-mono text-[11px]">
                  Satellite Payload: ~{estimatedBytes} Bytes
                </span>
              )}
            </div>
            <textarea
              rows={3}
              placeholder="Describe situation (e.g. River water entering ground floor, 2 elderly people trapped)."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Submit Big Red Tap Target */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl shadow-red-950/80 border border-red-400/50"
          >
            <Send className="w-5 h-5" />
            <span>{isSubmitting ? 'TRANSMITTING SATELLITE PACKET...' : t('sendSOS')}</span>
          </button>
        </form>
      )}
    </div>
  );
};
