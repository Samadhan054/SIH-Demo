import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AlertCircle,
  Activity,
  Globe,
  Radio,
  Shield,
  Zap,
  Menu,
  X,
  UserCheck,
  Flame,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../utils/i18n';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { t, language, setLanguage, liteMode, setLiteMode } = useLanguage();
  const { isConnected } = useSocket();
  const { user, setUserRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: t('navHome') },
    { path: '/dashboard', label: t('navDashboard') },
    { path: '/sos', label: t('navSOS'), highlight: true },
    { path: '/rescue-console', label: t('navRescueConsole') },
    { path: '/admin', label: t('navAdmin') },
    { path: '/alerts', label: t('navAlerts') },
    { path: '/about', label: t('navAbout') },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-red-500 p-0.5 shadow-lg shadow-red-950/50 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-mono">
                  {t('systemTitle')}
                </span>
                <span className="bg-red-950/80 border border-red-500/30 text-red-400 text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase">
                  v2.6 Himalayan
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {t('subtitle')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    item.highlight
                      ? 'bg-red-600 text-white hover:bg-red-500 font-bold shadow-md shadow-red-950/60 animate-pulse'
                      : active
                      ? 'bg-slate-800 text-white font-semibold border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Controls Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Socket Status */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono ${
                isConnected
                  ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-950/60 border-rose-500/30 text-rose-400'
              }`}
              title={isConnected ? 'Live WebSockets Telemetry Active' : 'Disconnected from telemetry stream'}
            >
              <Radio className={`w-3.5 h-3.5 ${isConnected ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>{isConnected ? 'LIVE' : 'OFFLINE'}</span>
            </div>

            {/* Role Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-400 ml-1" />
              <select
                value={user.role}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-transparent text-slate-200 font-medium cursor-pointer focus:outline-none pr-1"
              >
                <option value="CITIZEN" className="bg-slate-900">Citizen</option>
                <option value="RESCUE_TEAM" className="bg-slate-900">Rescue Team</option>
                <option value="ADMIN" className="bg-slate-900">Admin</option>
                <option value="GOVERNMENT" className="bg-slate-900">Government</option>
              </select>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-slate-200 font-medium cursor-pointer focus:outline-none"
              >
                <option value="en" className="bg-slate-900">EN</option>
                <option value="ne" className="bg-slate-900">नेपाल (NE)</option>
                <option value="hi" className="bg-slate-900">हिंदी (HI)</option>
              </select>
            </div>

            {/* Lite Mode Toggle */}
            <button
              onClick={() => setLiteMode(!liteMode)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                liteMode
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Low Bandwidth Lite Mode"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{liteMode ? 'Lite Mode' : 'Standard'}</span>
            </button>

            {/* Emergency SOS Button Header Shortcut */}
            <Link
              to="/sos"
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-950/80 border border-red-400/40"
            >
              <AlertCircle className="w-4 h-4 animate-bounce" />
              <span>SOS</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === item.path
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Role: {user.role}</span>
            <span>Status: {isConnected ? 'Live Telemetry' : 'Offline'}</span>
          </div>
        </div>
      )}
    </header>
  );
};
