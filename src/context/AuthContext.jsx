"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { email, role: 'admin' | 'hr' | 'visitor' }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session
    const session = localStorage.getItem('vos_session');
    if (session) {
      setUser(JSON.parse(session));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid email or password');
      }
      
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('vos_session', JSON.stringify(userData));
      return userData;
    } catch (err) {
      // Intentionally not logging to console to avoid Next.js dev overlay
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
