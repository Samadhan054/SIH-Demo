import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BroadcastBanner } from './components/BroadcastBanner';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { SOS } from './pages/SOS';
import { RescueConsole } from './pages/RescueConsole';
import { Admin } from './pages/Admin';
import { Alerts } from './pages/Alerts';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { DataMethodology } from './pages/DataMethodology';
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
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
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
          </Routes>
        </main>
        <Footer />
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
