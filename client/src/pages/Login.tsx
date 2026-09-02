import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { Shield, UserCheck, ShieldAlert, Navigation, Lock, ArrowRight, Flame } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('demo123');

  const roleDescriptions = {
    CITIZEN: {
      title: 'Public Citizen',
      icon: <UserCheck className="w-6 h-6 text-emerald-400" />,
      color: 'emerald',
      access: 'Read-only Live Risk Map (/dashboard), Satellite SOS Trigger (/sos), Citizen Alerts (/alerts).',
      targetPath: '/dashboard',
    },
    RESCUE_TEAM: {
      title: 'Rescue Taskforce Unit',
      icon: <Navigation className="w-6 h-6 text-rose-400" />,
      color: 'rose',
      access: 'Actionable Emergency Rescue Console (/rescue-console), Taskforce Dispatch, SOS status progression, Comms Log. Gated from /admin.',
      targetPath: '/rescue-console',
    },
    GOVERNMENT: {
      title: 'Government Authority (CWC / NDMA)',
      icon: <Shield className="w-6 h-6 text-cyan-400" />,
      color: 'cyan',
      access: 'Read-only access to /rescue-console, /admin analytics, and /data-methodology documentation portal. Cannot edit sensor configs.',
      targetPath: '/admin',
    },
    ADMIN: {
      title: 'System Operations Admin',
      icon: <ShieldAlert className="w-6 h-6 text-amber-400" />,
      color: 'amber',
      access: 'Full system authorization: CWC river threshold editing, sensor configs, manual emergency override broadcast, and editing /data-methodology content.',
      targetPath: '/admin',
    },
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(selectedRole, username);
    navigate(roleDescriptions[selectedRole].targetPath);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pt-4 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider">
          <Flame className="w-4 h-4 animate-pulse" />
          Himalayan FloodGuard Auth Portal
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Role-Based Access Control</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Authenticate with your role credentials to access role-gated rescue operations, CWC river threshold management, and government methodology.
        </p>
      </div>

      {/* Role Selection Card */}
      <form onSubmit={handleLoginSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-cyan-400" /> Select Authentication Role:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(roleDescriptions) as UserRole[]).map((roleKey) => {
              const r = roleDescriptions[roleKey];
              const isSelected = selectedRole === roleKey;
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => setSelectedRole(roleKey)}
                  className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/80 ring-1 ring-cyan-500/30 shadow-lg'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {r.icon}
                    <span className="text-[10px] font-mono font-bold bg-slate-900 px-2 py-0.5 rounded text-slate-300">
                      {roleKey}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm">{r.title}</h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Role Description Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
          <span className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px]">
            {roleDescriptions[selectedRole].title} Authorization Scope:
          </span>
          <p className="text-slate-300 leading-relaxed">{roleDescriptions[selectedRole].access}</p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-300">Username / Officer ID:</label>
            <input
              type="text"
              placeholder={`e.g. ${selectedRole}_officer`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-300">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-xl tracking-wide flex items-center justify-center gap-2 shadow-xl"
        >
          <span>AUTHENTICATE AS {selectedRole}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
