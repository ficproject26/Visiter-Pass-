"use client";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, Users, Building2, ShieldCheck, DollarSign, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];

const MetricCard = ({ title, value, subtitle, icon: Icon, color, isDark }) => (
  <motion.div
    variants={fadeUpBounce}
    style={{
      background: isDark ? "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))" : "linear-gradient(135deg, #ffffff, #f8fafc)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.04)",
      borderRadius: 20,
      padding: "20px 20px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 40px rgba(148,163,184,0.15)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease"
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = isDark ? "0 20px 40px rgba(0,0,0,0.5)" : "0 20px 40px rgba(148,163,184,0.25)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0px)";
      e.currentTarget.style.boxShadow = isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 40px rgba(148,163,184,0.15)";
    }}
  >
    <div style={{ 
      width: 52, 
      height: 52, 
      borderRadius: 16, 
      background: isDark ? `${color}20` : `${color}15`, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      color: color,
      boxShadow: `inset 0 0 0 1px ${color}30`,
      flexShrink: 0
    }}>
      <Icon size={24} strokeWidth={2.2} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <h3 style={{ margin: "0 0 4px 0", fontSize: 13, fontWeight: 600, color: isDark ? "#94a3b8" : "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h3>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: isDark ? "#f8fafc" : "#0f172a", letterSpacing: "-0.5px" }}>{value}</span>
        {subtitle && <span style={{ fontSize: 12, fontWeight: 700, color: subtitle.includes("-") ? "#ef4444" : "#10b981", whiteSpace: "nowrap" }}>{subtitle}</span>}
      </div>
    </div>
  </motion.div>
);

export default function SuperAdminDashboardOverview() {
  const { isDark } = useTheme();
  const { visitors, employees } = useData();

  // Computations
  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const totalVisitors = visitors.length;
  const todayVisitors = visitors.filter(v => v.visitDate === todayStr || (v.createdAt && v.createdAt.startsWith(todayStr))).length;
  const activePasses = visitors.filter(v => v.status === "CHECKED_IN").length;
  const expiredPasses = visitors.filter(v => v.status === "CHECKED_OUT").length;

  const totalBranches = new Set([
    ...employees.map(e => e.location),
    ...visitors.map(v => v.branch)
  ].filter(Boolean)).size;

  const totalEmployees = employees.length;
  const totalAdmins = employees.filter(e => e.role && e.role.toLowerCase().includes('manager')).length || 0;

  // Chart Data Computations
  const categoryData = useMemo(() => {
    const counts = visitors.reduce((acc, v) => {
      acc[v.visitorType] = (acc[v.visitorType] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [visitors]);

  const growthData = useMemo(() => {
    // Generate last 7 days including today
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const count = visitors.filter(v => v.visitDate === dateStr || (v.createdAt && v.createdAt.startsWith(dateStr))).length;
      data.push({ name: d.toLocaleDateString('en-US', { weekday: 'short' }), visitors: count });
    }
    return data;
  }, [visitors]);

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}
    >
      {/* Top Metrics Grid */}
      <div className="metrics-grid">
        <MetricCard title="Total Visitors" value={totalVisitors} subtitle="Live" icon={Users} color="#4f46e5" isDark={isDark} />
        <MetricCard title="Active Passes" value={activePasses} subtitle="Live" icon={CheckCircle} color="#10b981" isDark={isDark} />
        <MetricCard title="Total Branches" value={totalBranches} subtitle="Active" icon={Building2} color="#0ea5e9" isDark={isDark} />
        <MetricCard title="Monthly MRR" value="$0" subtitle="No Config" icon={DollarSign} color="#f59e0b" isDark={isDark} />
        
        <MetricCard title="Today's Traffic" value={todayVisitors} subtitle="Today" icon={Clock} color="#8b5cf6" isDark={isDark} />
        <MetricCard title="Expired Passes" value={expiredPasses} subtitle="Live" icon={AlertTriangle} color="#ef4444" isDark={isDark} />
        <MetricCard title="Total Employees" value={totalEmployees} subtitle="Internal" icon={Users} color="#14b8a6" isDark={isDark} />
        <MetricCard title="Admins / Subs" value={totalAdmins} subtitle="Managers" icon={ShieldCheck} color="#f43f5e" isDark={isDark} />
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        
        {/* Growth Chart */}
        <motion.div variants={fadeUpBounce} style={{
          background: isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(16px)",
          border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
          borderRadius: 20,
          padding: "24px",
          height: 400
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ margin: 0, color: isDark ? "#f8fafc" : "#0f172a", fontSize: 18 }}>Visitor Growth Trends</h3>
            <button style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: 0, padding: "6px 12px", borderRadius: 8, color: isDark ? "#e2e8f0" : "#475569", cursor: "pointer", fontWeight: 600, fontSize: 12 }}>This Year</button>
          </div>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} />
              <XAxis dataKey="name" stroke={isDark ? "#475569" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={isDark ? "#475569" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <RechartsTooltip 
                contentStyle={{ background: isDark ? '#1e293b' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                itemStyle={{ color: isDark ? '#fff' : '#000' }}
              />
              <Line type="monotone" dataKey="visitors" stroke="#4f46e5" strokeWidth={4} dot={{ r: 4, fill: "#4f46e5", strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Pie */}
        <motion.div variants={fadeUpBounce} style={{
          background: isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(16px)",
          border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
          borderRadius: 20,
          padding: "24px",
          height: 400
        }}>
          <h3 style={{ margin: 0, color: isDark ? "#f8fafc" : "#0f172a", fontSize: 18, marginBottom: 20 }}>Visitor Categories</h3>
          <ResponsiveContainer width="100%" height="70%">
            <PieChart>
              {categoryData.length > 0 ? (
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              ) : (
                <Pie data={[{ name: 'No Data', value: 1 }]} innerRadius={60} outerRadius={90} dataKey="value" fill={isDark ? "#334155" : "#e2e8f0"} />
              )}
              <RechartsTooltip 
                contentStyle={{ background: isDark ? '#1e293b' : '#fff', border: 'none', borderRadius: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 10 }}>
            {categoryData.length === 0 && <span style={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>No visitors yet</span>}
            {categoryData.map((entry, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS[idx % COLORS.length] }} />
                <span style={{ fontSize: 12, color: isDark ? "#cbd5e1" : "#475569", fontWeight: 500 }}>{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
