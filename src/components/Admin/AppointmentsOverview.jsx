"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { CalendarDays, Users, CheckSquare, Calendar as CalendarIcon, Search, Filter, Plus, CalendarCheck, Clock } from 'lucide-react';
import MeetingRequests from './MeetingRequests';
import ApprovalQueue from './ApprovalQueue';
import CalendarView from './CalendarView';

export default function AppointmentsOverview() {
  const { isDark } = useTheme();
  const { visitors } = useData();

  // --- COMPUTE LIVE STATS ---
  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const totalMeetings = visitors.length;
  const pendingApprovals = visitors.filter(v => v.approvalStatus === 'PENDING').length;
  const upcomingToday = visitors.filter(v => (v.visitDate === todayStr || (v.createdAt && v.createdAt.startsWith(todayStr))) && v.status !== 'CHECKED_IN' && v.status !== 'CHECKED_OUT').length;
  const canceled = visitors.filter(v => v.approvalStatus === 'REJECTED').length;

  const statsData = [
    { title: "Total Meetings", value: totalMeetings, trend: "+12%", isPositive: true, icon: CalendarDays, color: "#3b82f6" },
    { title: "Pending Approvals", value: pendingApprovals, trend: "+3%", isPositive: true, icon: Clock, color: "#f59e0b" },
    { title: "Upcoming Today", value: upcomingToday, trend: "+8%", isPositive: true, icon: CalendarCheck, color: "#10b981" },
    { title: "Canceled", value: canceled, trend: "-2%", isPositive: false, icon: CheckSquare, color: "#ef4444" },
  ];

  const glass = {
    background: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff',
    backdropFilter: 'blur(20px)',
    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)',
    borderRadius: 20,
    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(148,163,184,0.1)',
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}>
      
      {/* 1. TOP ACTION BAR */}
      <motion.div variants={fadeUpBounce} style={{ ...glass, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Appointments Dashboard</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>Unified view of all schedules, meetings, and queues.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button style={{ padding: '10px 16px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 700 }}>
            <Plus size={18} /> New Appointment
          </button>
        </div>
      </motion.div>

      {/* 2. STATISTICS OVERVIEW */}
      <div className="overview-stats-grid">
        {statsData.map((stat, idx) => (
          <motion.div key={idx} variants={fadeUpBounce} style={{ ...glass, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                <stat.icon size={22} />
              </div>
              <div style={{ padding: '4px 8px', borderRadius: 20, background: stat.isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: stat.isPositive ? '#10b981' : '#ef4444', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                {stat.trend}
              </div>
            </div>
            <p style={{ margin: '0 0 4px', fontSize: 32, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{stat.value}</p>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* 3. CALENDAR & QUEUE GRID */}
      <div className="overview-split-grid">
        <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24 }}>
          <CalendarView />
        </motion.div>
        
        <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24, height: 700, overflowY: 'auto' }}>
          <ApprovalQueue />
        </motion.div>
      </div>

      {/* 4. MEETINGS & BOOKINGS STACK */}
      <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24 }}>
        <MeetingRequests />
      </motion.div>

    </motion.div>
  );
}
