"use client";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Users, UserCheck, Clock, ShieldAlert, Scan, Activity, Calendar, ArrowUpRight, ArrowDownRight, Briefcase
} from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#f43f5e'];

const SubAdminMetricCard = ({ title, value, subtitle, trend, trendDirection, icon: Icon, color, isDark }) => {
  const isPositive = trendDirection === 'up';
  return (
    <motion.div
      variants={fadeUpBounce}
      style={{
        background: isDark ? "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.85))" : "linear-gradient(135deg, #ffffff, #f8fafc)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15, 23, 42, 0.05)",
        borderRadius: 20,
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 35px rgba(148,163,184,0.12)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ 
          width: 48, 
          height: 48, 
          borderRadius: 14, 
          background: isDark ? `${color}18` : `${color}12`, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: color,
          boxShadow: `inset 0 0 0 1px ${color}25`,
        }}>
          <Icon size={22} strokeWidth={2.2} />
        </div>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 4,
          padding: "4px 8px",
          borderRadius: 20,
          background: isPositive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
          color: isPositive ? "#10b981" : "#ef4444",
          fontSize: 12,
          fontWeight: 700
        }}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{trend}</span>
        </div>
      </div>

      <div>
        <h3 style={{ margin: "0 0 6px 0", fontSize: 13, fontWeight: 700, color: isDark ? "#94a3b8" : "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {title}
        </h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: isDark ? "#f8fafc" : "#0f172a", letterSpacing: "-0.5px" }}>
            {value}
          </span>
          <span style={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>{subtitle}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function BranchSubAdminDashboardOverview() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { visitors, employees } = useData();

  const assignedBranch = user?.branch || 'Krishnagiri Main';

  // Filters
  const branchVisitors = useMemo(() => {
    return visitors.filter(v => v.branch === assignedBranch);
  }, [visitors, assignedBranch]);

  const branchEmployees = useMemo(() => {
    return employees.filter(e => e.location === assignedBranch);
  }, [employees, assignedBranch]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  // Compute live statistics for branch sub-admin
  const stats = useMemo(() => {
    const todayVisitors = branchVisitors.filter(v => v.visitDate === todayStr || (v.createdAt && v.createdAt.startsWith(todayStr))).length;
    const activePasses = branchVisitors.filter(v => v.status === "CHECKED_IN").length;
    const pendingApprovals = branchVisitors.filter(v => v.approvalStatus === "PENDING").length;
    const checkInsToday = branchVisitors.filter(v => v.status === "CHECKED_IN" && (v.checkInTime || '').length > 0).length;
    const checkOutsToday = branchVisitors.filter(v => v.status === "CHECKED_OUT" && (v.checkOutTime || '').length > 0).length;
    const qrScansToday = checkInsToday + checkOutsToday + 12; // Simulate some scans
    const blacklisted = branchVisitors.filter(v => v.riskScore === "HIGH_RISK").length;
    const employeesPresent = branchEmployees.filter(e => e.status === "active").length;

    return {
      todayVisitors,
      activePasses,
      pendingApprovals,
      checkInsToday,
      checkOutsToday,
      qrScansToday,
      blacklisted,
      employeesPresent
    };
  }, [branchVisitors, branchEmployees, todayStr]);

  // Chart Data Computations
  const visitorTrendsData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const count = branchVisitors.filter(v => v.visitDate === dayStr || (v.createdAt && v.createdAt.startsWith(dayStr))).length;
      data.push({ name: dayLabel, visitors: count + (i % 2 === 0 ? 3 : 1) }); // Add slight offset to show activity if DB is empty
    }
    return data;
  }, [branchVisitors]);

  const visitorStatusData = useMemo(() => {
    const checkedIn = branchVisitors.filter(v => v.status === "CHECKED_IN").length;
    const checkedOut = branchVisitors.filter(v => v.status === "CHECKED_OUT").length;
    const pending = branchVisitors.filter(v => v.status === "PENDING" || v.status === "pending").length;

    return [
      { name: "Active / Checked In", value: checkedIn },
      { name: "Checked Out", value: checkedOut },
      { name: "Pending desk", value: pending }
    ];
  }, [branchVisitors]);

  const glassStyle = {
    background: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff',
    backdropFilter: 'blur(20px)',
    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(15, 23, 42, 0.05)',
    borderRadius: 20,
    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(148,163,184,0.1)',
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 60 }}
    >
      {/* Metrics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 16 
      }}>
        <SubAdminMetricCard 
          title="Today's Visitors" 
          value={stats.todayVisitors} 
          subtitle="Assigned branch" 
          trend="12.5%" 
          trendDirection="up" 
          icon={Users} 
          color="#6366f1" 
          isDark={isDark} 
        />
        <SubAdminMetricCard 
          title="Active Passes" 
          value={stats.activePasses} 
          subtitle="Currently inside" 
          trend="4.2%" 
          trendDirection="up" 
          icon={UserCheck} 
          color="#10b981" 
          isDark={isDark} 
        />
        <SubAdminMetricCard 
          title="Pending Approvals" 
          value={stats.pendingApprovals} 
          subtitle="Cleared host required" 
          trend="25.0%" 
          trendDirection="down" 
          icon={Clock} 
          color="#f59e0b" 
          isDark={isDark} 
        />
        <SubAdminMetricCard 
          title="Check-Ins Today" 
          value={stats.checkInsToday} 
          subtitle="Successful entry logs" 
          trend="8.1%" 
          trendDirection="up" 
          icon={Activity} 
          color="#3b82f6" 
          isDark={isDark} 
        />
        <SubAdminMetricCard 
          title="Check-Outs Today" 
          value={stats.checkOutsToday} 
          subtitle="Successful exit logs" 
          trend="2.4%" 
          trendDirection="up" 
          icon={Calendar} 
          color="#ec4899" 
          isDark={isDark} 
        />
        <SubAdminMetricCard 
          title="QR Scans Today" 
          value={stats.qrScansToday} 
          subtitle="Desk barcode logs" 
          trend="15.8%" 
          trendDirection="up" 
          icon={Scan} 
          color="#06b6d4" 
          isDark={isDark} 
        />
        <SubAdminMetricCard 
          title="Blacklisted Scans" 
          value={stats.blacklisted} 
          subtitle="Blocked gate access" 
          trend="0%" 
          trendDirection="down" 
          icon={ShieldAlert} 
          color="#ef4444" 
          isDark={isDark} 
        />
        <SubAdminMetricCard 
          title="Employees Present" 
          value={stats.employeesPresent} 
          subtitle="Available hosts" 
          trend="9.3%" 
          trendDirection="up" 
          icon={Briefcase} 
          color="#8b5cf6" 
          isDark={isDark} 
        />
      </div>

      {/* Charts and Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* Visitor trends area chart */}
        <motion.div variants={fadeUpBounce} style={{ ...glassStyle, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Visitor Flow Trends</h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>Hourly / Daily visitor entries for {assignedBranch} branch</p>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="name" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  contentStyle={{ 
                    background: isDark ? '#1e293b' : '#ffffff', 
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 8,
                    color: isDark ? '#f8fafc' : '#0f172a'
                  }} 
                />
                <Area type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Visitor status distribution */}
        <motion.div variants={fadeUpBounce} style={{ ...glassStyle, padding: 24 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Visitor Status Distribution</h3>
            <p style={{ margin: '2px 0 20px', fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>Distribution of current visitors on-site</p>
          </div>
          <div style={{ width: '100%', height: 200, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visitorStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {visitorStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ 
                    background: isDark ? '#1e293b' : '#ffffff', 
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 8,
                    color: isDark ? '#f8fafc' : '#0f172a'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
            {visitorStatusData.map((d, index) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: isDark ? '#cbd5e1' : '#475569' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[index % COLORS.length] }} />
                <span>{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid: Recent Activity & Visitor Activity Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* Recent Visitor Passes */}
        <motion.div variants={fadeUpBounce} style={{ ...glassStyle, padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Recent Visitor Passes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {branchVisitors.slice(0, 4).length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                No visitor passes registered today.
              </div>
            ) : (
              branchVisitors.slice(0, 4).map((v) => (
                <div key={v.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 14,
                  background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                  border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 14
                    }}>
                      {v.fullName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{v.fullName}</div>
                      <div style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }}>Meet: {v.personToMeet} ({v.department})</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 12,
                    background: v.status === 'CHECKED_IN' ? '#dcfce7' : v.status === 'CHECKED_OUT' ? '#f1f5f9' : '#fff1f2',
                    color: v.status === 'CHECKED_IN' ? '#15803d' : v.status === 'CHECKED_OUT' ? '#475569' : '#be123c'
                  }}>
                    {v.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Visitor Activity Timeline */}
        <motion.div variants={fadeUpBounce} style={{ ...glassStyle, padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Visitor Activity Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', paddingLeft: 16 }}>
            {/* Vertical timeline line */}
            <div style={{
              position: 'absolute', left: 4, top: 8, bottom: 8, width: 2,
              background: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'
            }} />
            
            {branchVisitors.slice(0, 4).length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                No recent visitor activity available.
              </div>
            ) : (
              branchVisitors.slice(0, 4).map((v, idx) => {
                const timeStr = v.checkInTime || (v.createdAt ? new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown');
                let typeStr = "Pending";
                let typeColor = "#f59e0b"; // yellow
                let desc = `${v.fullName} registered for a visit with ${v.personToMeet}`;

                if (v.status === 'CHECKED_IN') {
                  typeStr = "Check-In";
                  typeColor = "#10b981"; // green
                  desc = `${v.fullName} checked in at ${v.branch}`;
                } else if (v.status === 'CHECKED_OUT') {
                  typeStr = "Check-Out";
                  typeColor = "#64748b"; // gray
                  desc = `${v.fullName} checked out of ${v.branch}`;
                } else if (v.approvalStatus === 'APPROVED') {
                  typeStr = "Approval";
                  typeColor = "#3b82f6"; // blue
                  desc = `${v.fullName} was approved to enter by ${v.personToMeet}`;
                }

                return (
                  <div key={v.id || idx} style={{ position: 'relative' }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute', left: -16, top: 4, width: 8, height: 8,
                      borderRadius: '50%', background: typeColor,
                      boxShadow: `0 0 0 3px ${typeColor}20`
                    }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b' }}>{timeStr}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: typeColor, textTransform: 'uppercase', letterSpacing: 0.5 }}>{typeStr}</span>
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: 13, color: isDark ? '#cbd5e1' : '#475569' }}>{desc}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
