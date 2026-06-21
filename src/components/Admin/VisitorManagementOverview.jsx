"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { 
  Users, CalendarDays, Activity, UserCheck, UserX, AlertTriangle, 
  ScanLine, CheckCircle2, Search, Filter, Plus, Download, Calendar as CalendarIcon,
  MapPin, ShieldAlert, ChevronRight, Eye, Tags
} from 'lucide-react';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import VisitorBookings from './VisitorBookings';
import ApprovalQueue from './ApprovalQueue';
import { exportToCSV } from '../../utils/storage';

import VisitorDetailModal from './VisitorDetailModal';
import { API_BASE_URL } from '../../config/api';

export default function VisitorManagementOverview({ visitors = [], setActiveTab, onCreatePassClick }) {
  const { isDark } = useTheme();
  const { refreshData } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const handleCheckIn = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/visitors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: "CHECKED_IN",
          approvalStatus: "APPROVED",
          checkInTime: new Date().toTimeString().slice(0, 5)
        })
      });
      refreshData();
    } catch (err) {
      console.error("Failed to check in visitor:", err);
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/visitors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: "CHECKED_OUT",
          checkOutTime: new Date().toTimeString().slice(0, 5)
        })
      });
      refreshData();
    } catch (err) {
      console.error("Failed to check out visitor:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/visitors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalStatus: "APPROVED" })
      });
      refreshData();
    } catch (err) {
      console.error("Failed to approve visitor:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/visitors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalStatus: "REJECTED", status: "CHECKED_OUT" })
      });
      refreshData();
    } catch (err) {
      console.error("Failed to reject visitor:", err);
    }
  };

  // --- COMPUTE LIVE STATS ---
  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const totalVisitors = visitors.length;
  const todaysVisitors = visitors.filter(v => v.visitDate === todayStr || (v.createdAt && v.createdAt.startsWith(todayStr))).length;
  const activePasses = visitors.filter(v => v.status === 'CHECKED_IN').length;
  const pendingApprovals = visitors.filter(v => v.approvalStatus === 'PENDING').length;
  const expiredPasses = visitors.filter(v => v.status === 'CHECKED_OUT').length;

  const statsData = [
    { title: "Total Visitors", value: totalVisitors, trend: "+12.5%", isPositive: true, icon: Users, color: "#3b82f6" },
    { title: "Today's Visitors", value: todaysVisitors, trend: "+5.2%", isPositive: true, icon: CalendarDays, color: "#8b5cf6" },
    { title: "Active Passes", value: activePasses, trend: "-2.1%", isPositive: false, icon: Activity, color: "#10b981" },
    { title: "Pending Approvals", value: pendingApprovals, trend: "+8.4%", isPositive: true, icon: UserCheck, color: "#f59e0b" },
    { title: "Expired Passes", value: expiredPasses, trend: "+1.2%", isPositive: false, icon: UserX, color: "#64748b" },
    { title: "Blacklisted", value: "0", trend: "0.0%", isPositive: true, icon: AlertTriangle, color: "#ef4444" },
    { title: "QR Scans Today", value: "0", trend: "0.0%", isPositive: true, icon: ScanLine, color: "#ec4899" },
    { title: "Check-Ins Today", value: activePasses, trend: "+4.1%", isPositive: true, icon: CheckCircle2, color: "#14b8a6" },
  ];

  const recentPasses = [...visitors].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map(v => ({
    id: v.visitorId,
    name: v.fullName,
    category: v.visitorType,
    branch: v.branch,
    host: v.personToMeet,
    checkIn: v.checkInTime || '--',
    checkOut: v.checkOutTime || '--',
    status: v.status === 'CHECKED_IN' ? 'Active' : v.status === 'CHECKED_OUT' ? 'Expired' : v.approvalStatus === 'APPROVED' ? 'Approved' : 'Pending'
  }));

  const categoriesCount = visitors.reduce((acc, v) => {
    acc[v.visitorType] = (acc[v.visitorType] || 0) + 1;
    return acc;
  }, {});
  
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
  const categories = Object.keys(categoriesCount).map((key, idx) => ({
    name: key,
    count: categoriesCount[key],
    percent: totalVisitors ? Math.round((categoriesCount[key] / totalVisitors) * 100) : 0,
    color: colors[idx % colors.length],
    trend: '+0%'
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const approvals = visitors.filter(v => v.approvalStatus === 'PENDING').slice(0, 5).map(v => ({
    name: v.fullName,
    time: new Date(v.createdAt).toLocaleDateString(),
    host: v.personToMeet,
    branch: v.branch
  }));

  const chartData = [65, 85, 110, 95, 130, 40, 25];

  const glass = {
    background: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff',
    backdropFilter: 'blur(20px)',
    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)',
    borderRadius: 20,
    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(148,163,184,0.1)',
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return { bg: 'rgba(16,185,129,0.15)', text: '#10b981' };
      case 'Pending': return { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b' };
      case 'Approved': return { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' };
      case 'Expired': return { bg: 'rgba(100,116,139,0.15)', text: '#64748b' };
      case 'Rejected': return { bg: 'rgba(239,68,68,0.15)', text: '#ef4444' };
      default: return { bg: 'rgba(100,116,139,0.15)', text: '#64748b' };
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}>
      
      {/* 1. TOP ACTION BAR */}
      <motion.div variants={fadeUpBounce} style={{ ...glass, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Visitor Dashboard</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>Unified view of all visitor activity and security metrics.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#64748b' : '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search Visitors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '10px 16px 10px 40px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', color: isDark ? '#f8fafc' : '#0f172a', fontSize: 14, width: 220, outline: 'none' }} 
            />
          </div>
          <button onClick={() => setActiveTab && setActiveTab("visitor_logbook")} className="btn" style={{ padding: '10px 16px', borderRadius: 12, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', background: 'transparent', color: isDark ? '#cbd5e1' : '#475569', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
            <Filter size={16} /> Filters
          </button>
          <button onClick={() => setActiveTab && setActiveTab("calendar_view")} className="btn" style={{ padding: '10px 16px', borderRadius: 12, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', background: 'transparent', color: isDark ? '#cbd5e1' : '#475569', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
            <CalendarIcon size={16} /> Date Range
          </button>
          <button onClick={() => onCreatePassClick && onCreatePassClick()} style={{ padding: '10px 16px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 700 }}>
            <Plus size={18} /> Create Pass
          </button>
          <button onClick={() => exportToCSV(visitors)} style={{ padding: '10px 16px', borderRadius: 12, border: 'none', background: isDark ? 'rgba(255,255,255,0.1)' : '#1e293b', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
            <Download size={18} /> Export
          </button>
        </div>
      </motion.div>

      {/* 2. STATISTICS OVERVIEW (8 CARDS) */}
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

      {/* 2.5 PENDING APPROVALS */}
      <motion.div variants={fadeUpBounce}>
        <ApprovalQueue />
      </motion.div>



      {/* 4. RECENT VISITOR PASSES TABLE */}
      <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24, overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Recent Visitor Passes</h3>
          <button style={{ background: 'transparent', border: 'none', color: '#4f46e5', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            View All <ChevronRight size={16} />
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', textAlign: 'left' }}>
              {['Pass ID', 'Visitor Name', 'Category', 'Branch', 'Host Employee', 'Check-In', 'Check-Out', 'Status', 'Actions'].map(th => (
                <th key={th} style={{ padding: '0 0 12px 0', fontSize: 13, color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentPasses.map((pass, i) => {
              const st = getStatusColor(pass.status);
              const originalVisitor = visitors.find(v => v.visitorId === pass.id);
              return (
                <tr key={i} style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 0', fontSize: 14, fontWeight: 700, color: isDark ? '#e2e8f0' : '#334155' }}>{pass.id}</td>
                  <td style={{ padding: '16px 0', fontSize: 14, fontWeight: 600, color: isDark ? '#f8fafc' : '#0f172a' }}>{pass.name}</td>
                  <td style={{ padding: '16px 0', fontSize: 14, color: isDark ? '#cbd5e1' : '#475569' }}>{pass.category}</td>
                  <td style={{ padding: '16px 0', fontSize: 14, color: isDark ? '#cbd5e1' : '#475569' }}>{pass.branch}</td>
                  <td style={{ padding: '16px 0', fontSize: 14, color: isDark ? '#cbd5e1' : '#475569' }}>{pass.host}</td>
                  <td style={{ padding: '16px 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>{pass.checkIn}</td>
                  <td style={{ padding: '16px 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>{pass.checkOut}</td>
                  <td style={{ padding: '16px 0' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: st.bg, color: st.text }}>{pass.status}</span>
                  </td>
                  <td style={{ padding: '16px 0' }}>
                    <button 
                      onClick={() => setSelectedVisitor(originalVisitor)}
                      style={{ background: 'transparent', border: 'none', color: '#4f46e5', cursor: 'pointer' }}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </motion.div>

      {/* 4.5 VISITOR BOOKINGS */}
      <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24 }}>
        <VisitorBookings />
      </motion.div>

      {/* 3-COLUMN GRID: Categories, QR Scan, Blacklist */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        
        {/* 5. VISITOR CATEGORIES SUMMARY */}
        <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Categories Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {categories.map((cat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}>{cat.name} <span style={{ color: isDark ? '#64748b' : '#94a3b8' }}>({cat.count})</span></span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{cat.percent}%</span>
                </div>
                <div style={{ height: 6, width: '100%', background: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0', borderRadius: 10 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${cat.percent}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: cat.color, borderRadius: 10 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 6. QR SCAN ACTIVITY */}
        <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>QR Scan Activity</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ padding: 16, background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', borderRadius: 12 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>Successful Scans</p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#10b981' }}>284</p>
            </div>
            <div style={{ padding: 16, background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', borderRadius: 12 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>Failed Scans</p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ef4444' }}>12</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: isDark ? 'rgba(59,130,246,0.1)' : '#eff6ff', borderRadius: 10 }}>
            <ScanLine color="#3b82f6" size={20} />
            <p style={{ margin: 0, fontSize: 13, color: isDark ? '#cbd5e1' : '#1e293b', fontWeight: 500 }}>Scanner at North Gate is currently active.</p>
          </div>
        </motion.div>

        {/* 7. BLACKLIST & SECURITY */}
        <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24, borderTop: '4px solid #ef4444' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldAlert size={20} /> Security & Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: isDark ? '#cbd5e1' : '#475569', fontWeight: 500 }}>Blacklisted Visitors</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>8 Total</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: isDark ? '#cbd5e1' : '#475569', fontWeight: 500 }}>Expired Pass Attempts</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b' }}>3 Today</span>
            </div>
            <div style={{ marginTop: 8, padding: 16, background: isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2', borderRadius: 12 }}>
              <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#ef4444' }}>Suspicious Activity</p>
              <p style={{ margin: 0, fontSize: 12, color: isDark ? '#fca5a5' : '#b91c1c' }}>Repeated failed scans at Main Lobby turnstile.</p>
            </div>
          </div>
        </motion.div>

        {/* 8. QUICK ACTIONS PANEL */}
        <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Create Visitor Pass', icon: Plus, color: '#4f46e5', bg: 'rgba(79,70,229,0.1)', action: () => onCreatePassClick && onCreatePassClick() },
              { label: 'Scan QR Code', icon: ScanLine, color: '#10b981', bg: 'rgba(16,185,129,0.1)', action: () => setActiveTab && setActiveTab("verification_center") },
              { label: 'Add Visitor Category', icon: Tags, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', action: () => setActiveTab && setActiveTab("visitor_categories") },
              { label: 'Add Blacklisted Visitor', icon: UserX, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', action: () => setActiveTab && setActiveTab("blacklisted_visitors") },
              { label: 'Export Reports', icon: Download, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', action: () => exportToCSV(visitors) },
            ].map((action, i) => (
              <button key={i} onClick={action.action} style={{ padding: '14px 16px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: '0.2s', textAlign: 'left' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: action.bg, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <action.icon size={18} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155' }}>{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

      </div>

      {selectedVisitor && (
        <VisitorDetailModal
          visitor={selectedVisitor}
          onClose={() => setSelectedVisitor(null)}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

    </motion.div>
  );
}
