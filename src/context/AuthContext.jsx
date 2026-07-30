"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, role: 'admin' | 'hr' | 'visitor' }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session
    try {
      const session = localStorage.getItem('vos_session');
      if (session) {
        const parsedUser = JSON.parse(session);
        // Session expires after 8 hours (8 * 60 * 60 * 1000 ms)
        if (parsedUser.loginTime && (Date.now() - parsedUser.loginTime > 8 * 60 * 60 * 1000)) {
          localStorage.removeItem('vos_session');
          setUser(null);
        } else {
          setUser(parsedUser);
          recordLoginSession(parsedUser);
        }
      }
    } catch (e) {
      localStorage.removeItem('vos_session');
    }
    setLoading(false);
  }, []);

  const recordLoginSession = (userData) => {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('vos_login_history') || '[]');
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : '';
      let browserName = 'Chrome';
      if (userAgent.includes('Firefox')) browserName = 'Firefox';
      else if (userAgent.includes('Edg')) browserName = 'Edge';
      else if (userAgent.includes('Safari')) browserName = 'Safari';

      const newLog = {
        id: `SESS-${Date.now()}`,
        user: userData.email,
        name: userData.name || userData.email,
        device: `${browserName} / Windows (127.0.0.1)`,
        location: userData.branch && userData.branch !== 'all' ? `${userData.branch} Branch` : 'Admin Portal / HQ',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Online'
      };

      const updatedLogs = [newLog, ...existingLogs.filter(l => l.user !== userData.email)].slice(0, 20);
      localStorage.setItem('vos_login_history', JSON.stringify(updatedLogs));
    } catch (e) {}
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      let data = {};
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        }
      } catch (e) {}

      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password');
      }
      
      const userData = { ...data, loginTime: Date.now() };
      setUser(userData);
      localStorage.setItem('vos_session', JSON.stringify(userData));
      recordLoginSession(userData);
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vos_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
