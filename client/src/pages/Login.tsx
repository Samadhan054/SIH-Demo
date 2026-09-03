import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { Shield, ShieldAlert, Navigation, Lock, ArrowRight, Flame, UserCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginError, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('demo123');
  const [localError, setLocalError] = useState<string | null>(null);

  const roleDescriptions: Record<Exclude<UserRole, 'CITIZEN'>, {
    title: string;
    icon: React.ReactNode;
    access: string;
    targetPath: string;
  }> = {
    RESCUE_TEAM: {
      title: 'Rescue Taskforce Unit',
      icon: <Navigation className="w-6 h-6 text-rose-400" />,
      access: 'Actionable Emergency Rescue Console (/rescue-console), Taskforce Dispatch, SOS status progression, Comms Log. Gated from /admin.',
      targetPath: '/rescue-console',
    },
    GOVERNMENT: {
      title: 'Government Authority (CWC / NDMA)',
      icon: <Shield className="w-6 h-6 text-cyan-400" />,
      access: 'Read-only access to /rescue-console, /admin analytics, and /data-methodology documentation portal. Cannot edit sensor configs.',
      targetPath: '/admin',
    },
    ADMIN: {
      title: 'System Operations Admin',
      icon: <ShieldAlert className="w-6 h-6 text-amber-400" />,
      access: 'Full system authorization: CWC river threshold editing, sensor configs, manual emergency override broadcast, and editing /data-methodology content.',
      targetPath: '/admin',
    },
  };

  React.useEffect(() => {
    if (isAuthenticated) {
       navigate(roleDescriptions[selectedRole as keyof typeof roleDescriptions].targetPath);
    }
  }, [isAuthenticated, navigate, selectedRole, roleDescriptions]);

  React.useEffect(() => {
    if (loginError) {
      setLocalError(loginError);
    }
  }, [loginError]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    await login(selectedRole, username, password);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pt-4 pb-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider">
          <Flame className="w-4 h-4 animate-pulse" />
          Official Operations Login Portal
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Official Staff Login</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Login portal for <strong>Admin</strong>, <strong>Rescue Teams</strong>, and <strong>Government Authorities</strong>. Public citizens do not require authentication to view risk maps or submit SOS signals.
        </p>
      </div>

      {/* Role Selection Card */}
      <form onSubmit={handleLoginSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-cyan-400" /> Select Official Role:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.keys(roleDescriptions) as (keyof typeof roleDescriptions)[]).map((roleKey) => {
              const r = roleDescriptions[roleKey];
              const isSelected = selectedRole === roleKey;
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => setSelectedRole(roleKey as UserRole)}
                  className={`p-3.5 rounded-xl border text-left transition-all space-y-2 ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500/80 ring-1 ring-cyan-500/30 shadow-lg'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {r.icon}
                  </div>
                  <h3 className="font-bold text-slate-100 text-xs">{r.title}</h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Role Description Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
          <span className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px]">
            {roleDescriptions[selectedRole as keyof typeof roleDescriptions].title} Authorization Scope:
          </span>
          <p className="text-slate-300 leading-relaxed">
            {roleDescriptions[selectedRole as keyof typeof roleDescriptions].access}
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-300">Username / Officer ID:</label>
            <input
              type="text"
              placeholder={`e.g. ${selectedRole.toLowerCase()}_officer`}
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
          <span>LOGIN AS OFFICIAL {selectedRole}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {localError && (
          <div className="p-3 bg-red-950/50 border border-red-500/50 text-red-400 text-xs font-bold rounded-xl text-center">
            {localError}
          </div>
        )}

        {/* Public Citizen Bypass Link */}
        <div className="pt-2 text-center border-t border-slate-800/80">
          <Link
            to="/dashboard"
            className="text-xs text-slate-400 hover:text-cyan-400 font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Public Citizen? Click here to view Live Risk Dashboard (No Login Needed)</span>
          </Link>
        </div>
      </form>
    </div>
  );
};
