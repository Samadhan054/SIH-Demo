import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BroadcastBanner } from './components/BroadcastBanner';
import { SafetyDisclaimer } from './components/SafetyDisclaimer';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { SOS } from './pages/SOS';
import { RescueConsole } from './pages/RescueConsole';
import { Admin } from './pages/Admin';
import { Alerts } from './pages/Alerts';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { DataMethodology } from './pages/DataMethodology';
import { HillDashboard } from './pages/HillDashboard';
import { SoilSaturation } from './pages/SoilSaturation';
import { InSARMonitoring } from './pages/InSARMonitoring';
import { LandslideEarlyWarning } from './pages/LandslideEarlyWarning';
import { AvalancheMonitoring } from './pages/AvalancheMonitoring';
import { WeatherForecast } from './pages/WeatherForecast';
import { HazardMap } from './pages/HazardMap';
import { FirstAidSOS } from './pages/FirstAidSOS';
import { SOSTracker } from './pages/SOSTracker';
import { FirstAidManagement } from './pages/FirstAidManagement';
import { DisasterTraining } from './pages/DisasterTraining';
import { TrainingAdmin } from './pages/TrainingAdmin';
import { GovernmentDashboard } from './pages/GovernmentDashboard';
import { IntegrationStatus } from './pages/IntegrationStatus';
import { UserRole } from './types';

// Protected Route Guard Component
const ProtectedRoute: React.FC<{ allowedRoles: UserRole[]; children: React.ReactNode }> = ({
  allowedRoles,
  children,
}) => {
  const { user } = useAuth();
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <Router>
      <div className="relative min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
        {/* Elegant White & Pastel Ambient Background Orbs & Grid Layer */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-400/10 rounded-full blur-[140px] transform -translate-y-1/2" />
          <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-sky-400/12 rounded-full blur-[130px]" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-mesh-pattern opacity-60" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          <SafetyDisclaimer />
          <BroadcastBanner />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sos" element={<SOS />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/about" element={<About />} />
              
              {/* New Phase 3 Public Routes */}
              <Route path="/hill-dashboard" element={<HillDashboard />} />
              <Route path="/soil-saturation" element={<SoilSaturation />} />
              <Route path="/insar" element={<InSARMonitoring />} />
              <Route path="/landslide" element={<LandslideEarlyWarning />} />
              <Route path="/avalanche" element={<AvalancheMonitoring />} />
              <Route path="/weather" element={<WeatherForecast />} />
              <Route path="/hazard-map" element={<HazardMap />} />
              <Route path="/first-aid-sos" element={<FirstAidSOS />} />
              <Route path="/sos-tracker" element={<SOSTracker />} />
              <Route path="/training" element={<DisasterTraining />} />

              {/* Protected Role-Gated Routes */}
              <Route
                path="/rescue-console"
                element={
                  <ProtectedRoute allowedRoles={['RESCUE_TEAM', 'GOVERNMENT', 'ADMIN']}>
                    <RescueConsole />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['GOVERNMENT', 'ADMIN']}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/data-methodology"
                element={
                  <ProtectedRoute allowedRoles={['GOVERNMENT', 'ADMIN']}>
                    <DataMethodology />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/first-aid-management"
                element={
                  <ProtectedRoute allowedRoles={['RESCUE_TEAM', 'GOVERNMENT', 'ADMIN']}>
                    <FirstAidManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/training-admin"
                element={
                  <ProtectedRoute allowedRoles={['GOVERNMENT', 'ADMIN']}>
                    <TrainingAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/government-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['GOVERNMENT', 'ADMIN']}>
                    <GovernmentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/integration-status"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <IntegrationStatus />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
