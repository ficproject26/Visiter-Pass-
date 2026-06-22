"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { Users, Briefcase, UserCheck, CalendarOff, Plus, Download } from 'lucide-react';
import EmployeesList from './EmployeesList';
import AddEmployeeModal from './AddEmployeeModal';

export default function EmployeeManagementOverview({ onAddEmployeeClick }) {
  const { isDark } = useTheme();
  const { employees, refreshData } = useData();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter employees if user is a sub-admin
  const branchEmployees = user?.role === 'subadmin' && user?.branch
    ? employees.filter(e => (e.location || '').toLowerCase() === user.branch.toLowerCase())
    : employees;

  // --- COMPUTE LIVE STATS from filtered branch data ---
  const totalEmployees = branchEmployees.length;
  const activeHosts = branchEmployees.filter(e => e.status === 'active').length;
  const numDepartments = new Set(branchEmployees.map(e => e.department).filter(Boolean)).size;
  const onLeave = branchEmployees.filter(e => e.status === 'on_leave').length;

  const statsData = [
    {
      title: "Total Employees",
      value: totalEmployees,
      trend: totalEmployees > 0 ? `+${totalEmployees}` : "0",
      isPositive: true,
      icon: Users,
      color: "#3b82f6",
      sub: "Registered in system"
    },
    {
      title: "Active Hosts",
      value: activeHosts,
      trend: activeHosts > 0 ? `${activeHosts} active` : "None",
      isPositive: true,
      icon: UserCheck,
      color: "#10b981",
      sub: "Available to receive guests"
    },
    {
      title: "Departments",
      value: numDepartments,
      trend: `${numDepartments} dept${numDepartments !== 1 ? 's' : ''}`,
      isPositive: true,
      icon: Briefcase,
      color: "#8b5cf6",
      sub: "Across all branches"
    },
    {
      title: "On Leave Today",
      value: onLeave,
      trend: onLeave > 0 ? `-${onLeave}` : "0",
      isPositive: false,
      icon: CalendarOff,
      color: "#f59e0b",
      sub: "Unavailable hosts"
    },
  ];

  const glass = {
    background: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff',
    backdropFilter: 'blur(20px)',
    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)',
    borderRadius: 20,
    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(148,163,184,0.1)',
  };

  const handleAddEmployee = (emp) => {
    refreshData(); // re-fetch from backend so stats update
    setShowAddModal(false);
  };

  const handleOpenModal = () => {
    setShowAddModal(true);
    // Also call parent's handler if provided (for AdminDashboard to know)
    if (onAddEmployeeClick) onAddEmployeeClick();
  };

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}
      >
        {/* 1. TOP ACTION BAR */}
        <motion.div
          variants={fadeUpBounce}
          style={{ ...glass, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
              Employee Management
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>
              Unified view of all personnel, hosts, and departments.{' '}
              {totalEmployees > 0 && (
                <span style={{ color: '#10b981', fontWeight: 700 }}>
                  {totalEmployees} employee{totalEmployees !== 1 ? 's' : ''} registered.
                </span>
              )}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              style={{
                padding: '10px 16px', borderRadius: 12,
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                background: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                color: isDark ? '#cbd5e1' : '#475569',
                display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600
              }}
            >
              <Download size={18} /> Export
            </button>
            <button
              onClick={handleOpenModal}
              style={{
                padding: '10px 20px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#fff', display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer', fontWeight: 700, fontSize: 14,
                boxShadow: '0 4px 14px rgba(79,70,229,0.35)'
              }}
            >
              <Plus size={18} /> Add Employee
            </button>
          </div>
        </motion.div>

        {/* 2. LIVE STATISTICS */}
        <div className="overview-stats-grid">
          {statsData.map((stat, idx) => (
            <motion.div key={idx} variants={fadeUpBounce} style={{ ...glass, padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 13,
                  background: `${stat.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color, boxShadow: `inset 0 0 0 1px ${stat.color}25`
                }}>
                  <stat.icon size={22} strokeWidth={2.2} />
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                  background: stat.isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  color: stat.isPositive ? '#10b981' : '#ef4444'
                }}>
                  {stat.trend}
                </span>
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', letterSpacing: '-1px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', marginTop: 4 }}>
                {stat.title}
              </div>
              <div style={{ fontSize: 11, color: isDark ? '#64748b' : '#94a3b8', marginTop: 2 }}>
                {stat.sub}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. EMPLOYEES TABLE */}
        <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24, overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                All Employees
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>
                Click Deactivate/Activate to change status. Changes sync to database instantly.
              </p>
            </div>
            <button
              onClick={handleOpenModal}
              style={{
                padding: '8px 16px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#fff', display: 'flex', alignItems: 'center', gap: 6,
                cursor: 'pointer', fontWeight: 700, fontSize: 13
              }}
            >
              <Plus size={15} /> Add New
            </button>
          </div>
          <EmployeesList onAddClick={handleOpenModal} />
        </motion.div>
      </motion.div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddEmployee}
        />
      )}
    </>
  );
}
