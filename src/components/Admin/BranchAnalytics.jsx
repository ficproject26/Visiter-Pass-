"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const visitorsByBranch = [
  { name: 'Chennai HQ', visitors: 87, approved: 72, pending: 15 },
  { name: 'Bangalore', visitors: 54, approved: 48, pending: 6 },
  { name: 'Mumbai', visitors: 43, approved: 38, pending: 5 },
  { name: 'Hyderabad', visitors: 31, approved: 28, pending: 3 },
  { name: 'Delhi NCR', visitors: 22, approved: 18, pending: 4 },
  { name: 'Pune', visitors: 18, approved: 16, pending: 2 },
];

const weeklyTrend = [
  { day: 'Mon', Chennai: 14, Bangalore: 9, Mumbai: 7 },
  { day: 'Tue', Chennai: 18, Bangalore: 11, Mumbai: 8 },
  { day: 'Wed', Chennai: 12, Bangalore: 8, Mumbai: 6 },
  { day: 'Thu', Chennai: 20, Bangalore: 13, Mumbai: 10 },
  { day: 'Fri', Chennai: 23, Bangalore: 13, Mumbai: 12 },
  { day: 'Sat', Chennai: 10, Bangalore: 5, Mumbai: 3 },
];

const branchShare = [
  { name: 'Chennai HQ', value: 34 },
  { name: 'Bangalore', value: 21 },
  { name: 'Mumbai', value: 17 },
  { name: 'Hyderabad', value: 12 },
  { name: 'Delhi NCR', value: 9 },
  { name: 'Pune', value: 7 },
];

const PIE_COLORS = ['#4f46e5', '#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: isDark ? '#1e293b' : '#fff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
      <p style={{ margin: '0 0 6px', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', fontSize: 13 }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ margin: '2px 0', color: p.color, fontSize: 12, fontWeight: 600 }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

export default function BranchAnalytics() {
  const { isDark } = useTheme();
  const glass = { background: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff', backdropFilter: 'blur(20px)', border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)', borderRadius: 20, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(148,163,184,0.1)' };
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSec = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: textPrimary }}>Branch Analytics</h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: textSec }}>Comparative performance metrics across all branches</p>
      </div>

      {/* Row 1: Bar + Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 28 }}>
          <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 700, color: textPrimary }}>Today's Visitors by Branch</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={visitorsByBranch} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: textSec, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: textSec, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Bar dataKey="approved" name="Approved" stackId="a" fill="#4f46e5" radius={[0, 0, 0, 0]} />
              <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 28 }}>
          <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 700, color: textPrimary }}>Visitor Share</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={branchShare} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {branchShare.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {branchShare.slice(0, 4).map((item, i) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i] }} />
                  <span style={{ fontSize: 12, color: textSec }}>{item.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: textPrimary }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 2: Weekly Line Chart */}
      <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 28 }}>
        <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 700, color: textPrimary }}>Weekly Visitor Trend (Top 3 Branches)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="day" tick={{ fill: textSec, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: textSec, fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Line type="monotone" dataKey="Chennai" stroke="#4f46e5" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="Bangalore" stroke="#10b981" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="Mumbai" stroke="#f59e0b" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
