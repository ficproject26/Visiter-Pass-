"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [visitors, setVisitors] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('visitoros_saved_visitors') || '[]');
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [employees, setEmployees] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('visitoros_saved_employees') || '[]');
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [branches, setBranches] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('visitoros_saved_branches') || '[]');
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(true);

  const fetchLiveDatas = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const ts = Date.now();
      const [visRes, empRes, branchRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/visitors?t=${ts}`, { cache: 'no-store' }).catch(() => null),
        fetch(`${API_BASE_URL}/api/employees?t=${ts}`, { cache: 'no-store' }).catch(() => null),
        fetch(`${API_BASE_URL}/api/branches?t=${ts}`, { cache: 'no-store' }).catch(() => null)
      ]);
      
      const parseJson = async (res) => {
        if (!res || !res.ok) return [];
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            return await res.json();
          } catch (e) {
            return [];
          }
        }
        return [];
      };

      const visData = await parseJson(visRes);
      const empData = await parseJson(empRes);
      const branchData = await parseJson(branchRes);
      
      if (Array.isArray(visData) && visData.length > 0) {
        setVisitors(visData);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('visitoros_saved_visitors', JSON.stringify(visData));
          } catch (e) {}
        }
      }
      if (Array.isArray(empData) && empData.length > 0) {
        setEmployees(empData);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('visitoros_saved_employees', JSON.stringify(empData));
          } catch (e) {}
        }
      }
      if (Array.isArray(branchData) && branchData.length > 0) {
        setBranches(branchData);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('visitoros_saved_branches', JSON.stringify(branchData));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error("Failed to fetch live datas:", err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveDatas(false);

    // Fast polling every 2 seconds for real-time live sync on admin approval queue
    const interval = setInterval(() => {
      fetchLiveDatas(true);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DataContext.Provider value={{ visitors, employees, branches, loading, refreshData: () => fetchLiveDatas(false) }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
