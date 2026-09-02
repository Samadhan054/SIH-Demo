import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { SocketProvider } from './context/SocketContext';
import { AuthProvider } from './context/AuthContext';
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

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
              <BroadcastBanner />
              <Navbar />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/sos" element={<SOS />} />
                  <Route path="/rescue-console" element={<RescueConsole />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </SocketProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
