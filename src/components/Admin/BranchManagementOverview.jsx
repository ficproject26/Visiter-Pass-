"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { Building2, Activity, Users, MapPin, Plus, TrendingUp } from 'lucide-react';
import AllBranches from './AllBranches';
import BranchAnalytics from './BranchAnalytics';
import CreateBranch from './CreateBranch';
import BranchPerformance from './BranchPerformance';

export default function BranchManagementOverview({ setActiveTab }) {
  const { isDark } = useTheme();
  const { employees, visitors, branches = [] } = useData();

  // --- COMPUTE LIVE STATS ---
  const employeeBranches = employees.map(e => e.location);
  const visitorBranches = visitors.map(v => v.branch);
  const allUniqueBranches = new Set([
    ...branches.map(b => b.name),
    ...employeeBranches,
    ...visitorBranches
  ].filter(Boolean));
  
  const totalBranches = allUniqueBranches.size;
  const regions = new Set([...allUniqueBranches].map(b => b.split(' ')[0]));
  const activeRegions = regions.size;

  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const activePasses = visitors.filter(v => v.status === 'checked-in').length;
  const todaysVisitors = visitors.filter(v => v.visitDate === todayStr || (v.createdAt && v.createdAt.startsWith(todayStr))).length;

  const statsData = [
    { title: "Total Branches", value: totalBranches, trend: "+2", isPositive: true, icon: Building2, color: "#3b82f6", action: "all_branches" },
    { title: "Active Regions", value: activeRegions, trend: "+1", isPositive: true, icon: Activity, color: "#8b5cf6", action: "branch_analytics" },
    { title: "Daily Footfall (Today)", value: todaysVisitors, trend: "+4%", isPositive: true, icon: Users, color: "#10b981", action: "visitor_logbook" },
    { title: "Peak Utilization (Active)", value: `${activePasses} visitors`, trend: "+1.2%", isPositive: true, icon: TrendingUp, color: "#f59e0b", action: "active_visitors" },
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
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Branch Management Dashboard</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>Unified view of all locations, analytics, and branch performance.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab && setActiveTab("create_branch")} style={{ padding: '10px 16px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 700 }}>
            <Plus size={18} /> Add New Branch
          </button>
        </div>
      </motion.div>

      {/* 2. STATISTICS OVERVIEW */}
      <div className="overview-stats-grid">
        {statsData.map((stat, idx) => (
          <motion.div 
            key={idx} 
            variants={fadeUpBounce} 
            onClick={() => stat.action && setActiveTab && setActiveTab(stat.action)}
            style={{ ...glass, padding: 20, cursor: stat.action ? 'pointer' : 'default', transition: 'transform 0.2s' }}
            whileHover={stat.action ? { scale: 1.02 } : {}}
          >
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

      {/* 3. ALL BRANCHES LIST */}
      <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24 }}>
        <AllBranches setActiveTab={setActiveTab} />
      </motion.div>

      {/* 4. BRANCH ANALYTICS */}
      <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24 }}>
        <BranchAnalytics />
      </motion.div>
      
      {/* 5. BRANCH PERFORMANCE */}
      <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24 }}>
        <BranchPerformance />
      </motion.div>

    </motion.div>
  );
}
