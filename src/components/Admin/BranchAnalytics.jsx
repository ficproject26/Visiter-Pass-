"use client";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Building2 } from 'lucide-react';

const PIE_COLORS = ['#4f46e5', '#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6'];

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
  const { visitors = [], branches = [] } = useData();

  const glass = { background: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff', backdropFilter: 'blur(20px)', border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)', borderRadius: 20, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(148,163,184,0.1)' };
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSec = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  // 1. Compute Live Visitors by Branch (Bar Chart)
  const visitorsByBranch = useMemo(() => {
    return branches.map(b => {
      const bVisitors = visitors.filter(v => v.branch === b.name);
      const approved = bVisitors.filter(v => v.approvalStatus === 'APPROVED' || v.status === 'checked-in' || v.status === 'checked-out').length;
      const pending = bVisitors.filter(v => v.approvalStatus === 'PENDING' || v.status === 'pending').length;
      return {
        name: b.name,
        visitors: bVisitors.length,
        approved,
        pending
      };
    });
  }, [branches, visitors]);

  // 2. Compute Live Visitor Share (Pie Chart)
  const branchShare = useMemo(() => {
    const totalVisitorsCount = visitors.length;
    if (totalVisitorsCount === 0 || branches.length === 0) return [];

    return branches.map(b => {
      const count = visitors.filter(v => v.branch === b.name).length;
      const pct = Math.round((count / totalVisitorsCount) * 100) || 0;
      return {
        name: b.name,
        value: pct,
        count
      };
    }).filter(b => b.count > 0 || branches.length <= 4);
  }, [branches, visitors]);

  // 3. Compute Live Weekly Trend for Branches
  const weeklyTrend = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = d.toISOString().split('T')[0];

      const dayObj = { day: dayName };
      branches.forEach(b => {
        const count = visitors.filter(v => v.branch === b.name && (v.visitDate === dateStr || (v.createdAt && v.createdAt.startsWith(dateStr)))).length;
        dayObj[b.name] = count;
      });
      last7Days.push(dayObj);
    }
    return last7Days;
  }, [branches, visitors]);

  const hasData = branches.length > 0;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: textPrimary }}>Branch Analytics</h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: textSec }}>Real-time comparative performance metrics across database branches</p>
      </div>

      {!hasData ? (
        <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <Building2 size={48} style={{ opacity: 0.3, color: textSec }} />
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: textPrimary }}>No Branch Data Available</h3>
          <p style={{ margin: 0, fontSize: 14, color: textSec, maxWidth: 400 }}>Add branches in the Admin dashboard to view real-time analytics and visitor distribution metrics.</p>
        </motion.div>
      ) : (
        <>
          {/* Row 1: Bar + Pie */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 28 }}>
              <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 700, color: textPrimary }}>Live Visitors by Branch</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={visitorsByBranch} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fill: textSec, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: textSec, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip isDark={isDark} />} />
                  <Bar dataKey="approved" name="Approved" stackId="a" fill="#4f46e5" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 28 }}>
              <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 700, color: textPrimary }}>Visitor Distribution</h3>
              {branchShare.length === 0 ? (
                <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textSec, fontSize: 13 }}>
                  No visitor records registered yet
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={branchShare} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {branchShare.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    {branchShare.slice(0, 4).map((item, i) => (
                      <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: PIE_COLORS[i % PIE_COLORS.length] }} />
                          <span style={{ fontSize: 12, color: textSec }}>{item.name}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: textPrimary }}>{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Row 2: Weekly Line Chart */}
          <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 28 }}>
            <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 700, color: textPrimary }}>Weekly Live Visitor Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="day" tick={{ fill: textSec, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: textSec, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                {branches.slice(0, 5).map((b, idx) => (
                  <Line key={b.name} type="monotone" dataKey={b.name} stroke={PIE_COLORS[idx % PIE_COLORS.length]} strokeWidth={3} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
