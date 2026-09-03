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

  const allNavItems = [
    { path: '/', label: t('navHome'), allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/dashboard', label: t('navDashboard'), allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/sos', label: t('navSOS'), highlight: true, allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/hill-dashboard', label: t('navHillDashboard'), allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/hazard-map', label: t('navHazardMap'), allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/first-aid-sos', label: t('navFirstAidSOS'), allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/sos-tracker', label: 'SOS Tracker', allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/training', label: t('navTraining'), allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/first-aid-management', label: 'First Aid Admin', allowedRoles: ['RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/government-dashboard', label: t('navGovernment'), allowedRoles: ['GOVERNMENT', 'ADMIN'] },
    { path: '/training-admin', label: 'Training Admin', allowedRoles: ['GOVERNMENT', 'ADMIN'] },
    { path: '/integration-status', label: t('navIntegration'), allowedRoles: ['ADMIN'] },
    { path: '/rescue-console', label: t('navRescueConsole'), allowedRoles: ['RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/admin', label: t('navAdmin'), allowedRoles: ['GOVERNMENT', 'ADMIN'] },
    { path: '/alerts', label: t('navAlerts'), allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
    { path: '/data-methodology', label: 'Data Methodology', allowedRoles: ['GOVERNMENT', 'ADMIN'] },
    { path: '/about', label: t('navAbout'), allowedRoles: ['CITIZEN', 'RESCUE_TEAM', 'GOVERNMENT', 'ADMIN'] },
  ];

  const navItems = allNavItems.filter((item) => item.allowedRoles.includes(user.role));
  const primaryNavItems = navItems.slice(0, 4);
  const moreNavItems = navItems.slice(4);

  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-red-500 p-0.5 shadow-md shadow-red-200 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-red-600 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-mono">
                  {t('systemTitle')}
                </span>
                <span className="bg-red-50 border border-red-200 text-red-700 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold uppercase">
                  v2.8 CWC India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {t('subtitle')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 relative">
            {primaryNavItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    item.highlight
                      ? 'bg-red-600 text-white hover:bg-red-500 font-bold shadow-md shadow-red-200 animate-pulse'
                      : active
                      ? 'bg-slate-100 text-slate-900 font-bold border border-slate-300 shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            {moreNavItems.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all text-slate-700 hover:bg-slate-100 hover:text-slate-900 flex items-center gap-1"
                >
                  More
                </button>
                {moreDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                    {moreNavItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`block px-4 py-2 text-sm ${location.pathname === item.path ? 'bg-slate-50 text-slate-900 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Controls Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Socket Status */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono font-semibold ${
                isConnected
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-rose-50 border-rose-300 text-rose-700'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isConnected ? 'animate-pulse text-emerald-600' : ''}`} />
              <span>{isConnected ? 'LIVE' : 'OFFLINE'}</span>
            </div>

            {/* Authenticated User Role Badge & Auth Action */}
            <div className="flex items-center gap-2">
              <span className="hidden xl:inline-block px-2.5 py-1 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-lg border border-slate-300">
                {user.role}
              </span>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-300 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Staff Login</span>
                </Link>
              )}
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-300 text-xs font-medium text-slate-800">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-slate-800 font-semibold cursor-pointer focus:outline-none"
              >
                <option value="en" className="bg-white">EN</option>
                <option value="ne" className="bg-white">नेपाल (NE)</option>
                <option value="hi" className="bg-white">हिंदी (HI)</option>
              </select>
            </div>

            {/* Lite Mode Toggle */}
            <button
              onClick={() => setLiteMode(!liteMode)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                liteMode
                  ? 'bg-amber-100 border-amber-400 text-amber-800 font-bold'
                  : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
              }`}
              title="Toggle Low Bandwidth Lite Mode"
            >
              <Zap className="w-3.5 h-3.5" />
            </button>

            {/* Emergency SOS Button */}
            <Link
              to="/sos"
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-xs tracking-wider flex items-center gap-1 shadow-md shadow-red-200 border border-red-400/40"
            >
              <AlertCircle className="w-4 h-4 animate-bounce" />
              <span>SOS</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === item.path ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-700'
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
