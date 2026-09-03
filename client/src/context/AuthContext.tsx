import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User;
  token: string | null;
  login: (role: UserRole, username?: string, password?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loginError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('floodguard_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      id: 'USR-PUBLIC',
      name: 'Public Citizen',
      email: 'citizen@floodguard.org',
      role: 'CITIZEN',
      district: 'All Districts',
    };
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('floodguard_token'));
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('floodguard_user', JSON.stringify(user));
    if (token) localStorage.setItem('floodguard_token', token);
    else localStorage.removeItem('floodguard_token');
  }, [user, token]);

  const login = async (role: UserRole, username?: string, password?: string) => {
    try {
      setLoginError(null);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
      } else if (res.status === 401) {
        setLoginError('Access Denied. Invalid username or password.');
      } else {
        setLoginError('An error occurred during login.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback local state setting if server offline
      setUser({
        id: `USR-${Date.now()}`,
        name: username || `${role} User`,
        email: `${role.toLowerCase()}@floodguard.org`,
        role,
        district: 'All Districts',
      });
    }
  };

  const logout = () => {
    setUser({
      id: 'USR-PUBLIC',
      name: 'Public Citizen',
      email: 'citizen@floodguard.org',
      role: 'CITIZEN',
      district: 'All Districts',
    });
    setToken(null);
    setLoginError(null);
    localStorage.removeItem('floodguard_user');
    localStorage.removeItem('floodguard_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: user.role !== 'CITIZEN',
        loginError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
