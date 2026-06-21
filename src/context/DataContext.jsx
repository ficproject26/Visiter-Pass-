"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [visitors, setVisitors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveDatas = async () => {
    try {
      setLoading(true);
      const [visRes, empRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/visitors`),
        fetch(`${API_BASE_URL}/api/employees`)
      ]);
      
      const visData = await visRes.json();
      const empData = await empRes.json();
      
      if (Array.isArray(visData)) setVisitors(visData);
      if (Array.isArray(empData)) setEmployees(empData);
    } catch (err) {
      console.error("Failed to fetch live datas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveDatas();
  }, []);

  return (
    <DataContext.Provider value={{ visitors, employees, loading, refreshData: fetchLiveDatas }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
