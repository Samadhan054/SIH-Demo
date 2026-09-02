import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  LogOut,
  LogIn,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../utils/i18n';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, setLanguage, liteMode, setLiteMode } = useLanguage();
  const { isConnected } = useSocket();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Navigation Items based on User Role permissions
  const navItems = [
    { path: '/', label: t('navHome'), allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/dashboard', label: t('navDashboard'), allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/sos', label: t('navSOS'), highlight: true, allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/rescue-console', label: t('navRescueConsole'), allowedRoles: ['RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/admin', label: t('navAdmin'), allowedRoles: ['GOVERNMENT', 'ADMIN'] },
    { path: '/alerts', label: t('navAlerts'), allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/data-methodology', label: 'Data Methodology', allowedRoles: ['GOVERNMENT', 'ADMIN'] },
    { path: '/about', label: t('navAbout'), allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
  ].filter((item) => item.allowedRoles.includes(user.role));

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
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
                  v2.8 CWC India
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

          {/* Right Controls Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Socket Status */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono ${
                isConnected
                  ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-950/60 border-rose-500/30 text-rose-400'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isConnected ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>{isConnected ? 'LIVE' : 'OFFLINE'}</span>
            </div>

            {/* Authenticated User Role Badge & Auth Action */}
            <div className="flex items-center gap-2">
              <span className="hidden xl:inline-block px-2.5 py-1 bg-slate-800 text-cyan-300 font-mono text-xs font-bold rounded-lg border border-slate-700">
                {user.role}
              </span>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}
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
            </button>

            {/* Emergency SOS Button */}
            <Link
              to="/sos"
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs tracking-wider flex items-center gap-1 shadow-lg border border-red-400/40"
            >
              <AlertCircle className="w-4 h-4 animate-bounce" />
              <span>SOS</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === item.path ? 'bg-slate-800 text-white' : 'text-slate-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
