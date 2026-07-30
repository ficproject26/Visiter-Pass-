"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { ShieldAlert, CheckCircle2, XCircle, Clock, AlertTriangle, Search, RefreshCw, Calendar, MapPin } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const riskConfig = {
  LOW_RISK: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Low Risk' },
  MEDIUM_RISK: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Medium Risk' },
  HIGH_RISK: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'High Risk' },
};

const formatVisitDate = (dateStr) => {
  if (!dateStr) return 'Today';
  try {
    const str = String(dateStr);
    let d;
    if (str.includes('T')) {
      const dateOnly = str.split('T')[0];
      const [year, month, day] = dateOnly.split('-').map(Number);
      d = new Date(year, month - 1, day);
    } else {
      d = new Date(str);
    }
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
};

const formatAppliedDate = (dateStr) => {
  if (!dateStr) return 'Just now';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Just now';
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
  } catch (e) {
    return 'Just now';
  }
};

export default function ApprovalQueue() {
  const { isDark } = useTheme();
  const { visitors, branches = [], refreshData } = useData();
  const [localProcessed, setLocalProcessed] = useState([]);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING'); // PENDING, APPROVED, REJECTED, ALL
  const [dateFilter, setDateFilter] = useState('ALL'); // TODAY, ALL
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setLocalProcessed([]);
    try {
      if (refreshData) await refreshData();
    } catch (e) {
      console.error("Error refreshing live queue:", e);
    }
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Branch Options
  const branchOptions = useMemo(() => {
    const set = new Set(branches.map(b => b.name).concat(visitors.map(v => v.branch)).filter(Boolean));
    return Array.from(set).sort();
  }, [branches, visitors]);

  // Filtered queue calculation
  const queue = useMemo(() => {
    return visitors.filter(v => {
      const s = (v.approvalStatus || '').toUpperCase();
      const isProcessedLocally = localProcessed.some(p => p.id === v.id);

      // Status filter
      if (statusFilter !== 'ALL') {
        if (s !== statusFilter) return false;
        if (statusFilter === 'PENDING' && isProcessedLocally) return false;
      }

      // Branch filter
      if (branchFilter !== 'ALL' && v.branch !== branchFilter) return false;

      // Date filter (Today vs All)
      if (dateFilter === 'TODAY') {
        const todayStr = new Date().toISOString().split('T')[0];
        const vDate = v.visitDate ? String(v.visitDate).split('T')[0] : todayStr;
        const cDate = v.createdAt ? new Date(v.createdAt).toISOString().split('T')[0] : todayStr;
        if (vDate !== todayStr && cDate !== todayStr) return false;
      }

      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = (v.fullName || '').toLowerCase();
        const id = (v.id || v.visitorId || '').toLowerCase();
        const phone = (v.phone || '').toLowerCase();
        const host = (v.personToMeet || v.host || '').toLowerCase();
        const dept = (v.department || v.dept || '').toLowerCase();
        return name.includes(q) || id.includes(q) || phone.includes(q) || host.includes(q) || dept.includes(q);
      }

      return true;
    });
  }, [visitors, localProcessed, statusFilter, branchFilter, dateFilter, searchQuery]);

  // Counts
  const pendingCount = useMemo(() => 
    visitors.filter(v => (v.approvalStatus || '').toUpperCase() === 'PENDING' && !localProcessed.some(p => p.id === v.id)).length
  , [visitors, localProcessed]);

  const approvedCount = useMemo(() => 
    visitors.filter(v => (v.approvalStatus || '').toUpperCase() === 'APPROVED').length
  , [visitors]);

  const rejectedCount = useMemo(() => 
    visitors.filter(v => (v.approvalStatus || '').toUpperCase() === 'REJECTED').length
  , [visitors]);

  const handleAction = async (id, action) => {
    const item = queue.find(q => q.id === id);
    if (!item) return;

    const newStatus = action === 'approved' ? 'APPROVED' : 'REJECTED';

    setLocalProcessed(prev => [{ ...item, action, processedAt: new Date().toLocaleTimeString() }, ...prev]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/visitors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalStatus: newStatus })
      });
      if (!res.ok) {
        const err = await res.json();
        console.error('Approval failed:', err);
      }
      await refreshData();
    } catch (error) {
      console.error("Failed to update visitor:", error);
    }
  };

  const glass = {
    background: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff',
    backdropFilter: 'blur(20px)',
    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)',
    borderRadius: 20,
    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(148,163,184,0.1)',
  };

  const thStyle = {
    padding: '16px 20px',
    fontSize: 11,
    fontWeight: 800,
    color: isDark ? '#94a3b8' : '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    whiteSpace: 'nowrap'
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header Stats & Manual Live Sync Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Approval Queue</h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>Real-time queue of visitors awaiting security clearance</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 12,
              border: isDark ? '1px solid rgba(56,189,248,0.3)' : '1px solid #0284c7',
              background: isDark ? 'rgba(56,189,248,0.1)' : 'rgba(2,132,199,0.06)',
              color: isDark ? '#38bdf8' : '#0284c7',
              fontWeight: 700,
              fontSize: 13,
              cursor: isRefreshing ? 'wait' : 'pointer',
              opacity: isRefreshing ? 0.7 : 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw
              size={15}
              style={{
                transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)',
                transition: isRefreshing ? 'transform 0.6s linear' : 'none'
              }}
            />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh Live Queue'}</span>
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: 12, padding: '8px 16px', fontWeight: 800, fontSize: 20, textAlign: 'center' }}>
              {pendingCount}
              <div style={{ fontSize: 10, fontWeight: 600 }}>Pending</div>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: 12, padding: '8px 16px', fontWeight: 800, fontSize: 20, textAlign: 'center' }}>
              {approvedCount}
              <div style={{ fontSize: 10, fontWeight: 600 }}>Approved</div>
            </div>
            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 12, padding: '8px 16px', fontWeight: 800, fontSize: 20, textAlign: 'center' }}>
              {rejectedCount}
              <div style={{ fontSize: 10, fontWeight: 600 }}>Rejected</div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔍 FILTER & SEARCH TOOLBAR */}
      <div style={{ ...glass, padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 240, background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', padding: '8px 14px', borderRadius: 12, border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
          <Search size={16} style={{ color: isDark ? '#94a3b8' : '#64748b' }} />
          <input
            type="text"
            placeholder="Search visitor name, Pass ID, phone, host..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: isDark ? '#f8fafc' : '#0f172a', fontSize: 13, fontWeight: 600 }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>✕</button>
          )}
        </div>

        {/* Filters Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', padding: '4px', borderRadius: 10 }}>
            {['PENDING', 'ALL', 'APPROVED', 'REJECTED'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: statusFilter === st ? (isDark ? '#38bdf8' : '#4f46e5') : 'transparent',
                  color: statusFilter === st ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b'),
                  transition: 'all 0.2s ease'
                }}
              >
                {st === 'PENDING' ? '⏳ Pending' : st === 'ALL' ? '📋 All' : st === 'APPROVED' ? '✓ Approved' : '✕ Rejected'}
              </button>
            ))}
          </div>

          {/* Date Filter Toggle */}
          <button
            onClick={() => setDateFilter(prev => prev === 'TODAY' ? 'ALL' : 'TODAY')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 10,
              border: dateFilter === 'TODAY' ? '1px solid #10b981' : isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
              background: dateFilter === 'TODAY' ? 'rgba(16,185,129,0.15)' : 'transparent',
              color: dateFilter === 'TODAY' ? '#10b981' : isDark ? '#cbd5e1' : '#475569',
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer'
            }}
          >
            <Calendar size={14} />
            <span>{dateFilter === 'TODAY' ? "📅 Today's Visitors" : "📅 All Dates"}</span>
          </button>

          {/* Branch Filter */}
          {branchOptions.length > 0 && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
              <MapPin size={14} style={{ color: '#6366f1' }} />
              <select
                value={branchFilter}
                onChange={e => setBranchFilter(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: isDark ? '#f8fafc' : '#0f172a', fontSize: 12, fontWeight: 700, outline: 'none', cursor: 'pointer' }}
              >
                <option value="ALL">All Locations</option>
                {branchOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          )}
        </div>

      </div>

      {/* Live Queue Table */}
      <div style={{ ...glass, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 0 4px rgba(245,158,11,0.2)' }} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
              {statusFilter === 'PENDING' ? 'Awaiting Approval' : statusFilter === 'APPROVED' ? 'Approved Visitors' : statusFilter === 'REJECTED' ? 'Rejected Visitors' : 'All Registered Visitors'}
            </h3>
            <span style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>({queue.length} records)</span>
          </div>

          {(searchQuery || dateFilter !== 'ALL' || branchFilter !== 'ALL') && (
            <button onClick={() => { setSearchQuery(''); setDateFilter('ALL'); setBranchFilter('ALL'); setStatusFilter('PENDING'); }} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              Reset Filters
            </button>
          )}
        </div>

        {queue.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 60, textAlign: 'center', color: isDark ? '#64748b' : '#94a3b8' }}>
            <CheckCircle2 size={48} style={{ margin: '0 auto 16px', color: '#10b981', opacity: 0.8 }} />
            <p style={{ fontWeight: 800, fontSize: 18, color: isDark ? '#e2e8f0' : '#334155', margin: '0 0 8px 0' }}>Queue Clear!</p>
            <p style={{ fontSize: 14, margin: 0 }}>No matching visitors found for the selected filter.</p>
          </motion.div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0', background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' }}>
                  <th style={thStyle}>Visitor Name</th>
                  <th style={thStyle}>Applied Date</th>
                  <th style={thStyle}>Visit Date</th>
                  <th style={thStyle}>Branch</th>
                  <th style={thStyle}>Department</th>
                  <th style={thStyle}>Purpose / ID</th>
                  <th style={thStyle}>Host</th>
                  <th style={thStyle}>Risk & Wait</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {queue.map((q) => {
                    const riskKey = q.riskScore || 'LOW_RISK';
                    const rc = riskConfig[riskKey] || riskConfig['LOW_RISK'];
                    
                    let waitMin = 0;
                    if (q.requestTime) {
                       const reqTime = new Date(q.requestTime);
                       if (!isNaN(reqTime)) waitMin = Math.floor((new Date() - reqTime) / 60000);
                    }

                    return (
                      <motion.tr 
                        key={q.id} 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', transition: { duration: 0.2 } }}
                        style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)' }}
                      >
                        {/* 1. Visitor Name & ID */}
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 12, background: `linear-gradient(135deg, ${rc.color}30, ${rc.color}60)`, color: rc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, flexShrink: 0 }}>
                              {q.fullName ? q.fullName.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {q.fullName || 'Unknown Visitor'}
                                {q.arrivedAtGate && (
                                  <span style={{ background: '#ef4444', color: 'white', fontSize: 9, fontWeight: 800, padding: '2px 5px', borderRadius: 4 }}>
                                    🚨 GATE
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600, marginTop: 1 }}>ID: {q.id || q.visitorId}</div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Applied Date */}
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155' }}>
                            {formatAppliedDate(q.createdAt)}
                          </div>
                        </td>

                        {/* 3. Visit Date */}
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            📅 {formatVisitDate(q.visitDate)}
                          </div>
                        </td>

                        {/* 4. Branch */}
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#f8fafc' : '#0f172a' }}>
                            {q.branch || 'Main Branch'}
                          </div>
                        </td>

                        {/* 5. Department */}
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: 12, color: isDark ? '#cbd5e1' : '#475569', fontWeight: 500 }}>
                            {q.department || q.dept || 'General'}
                          </div>
                        </td>

                        {/* 6. Purpose / ID */}
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155' }}>{q.purpose || 'Meeting'}</div>
                          <div style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <ShieldAlert size={11} /> {q.idType || 'Govt ID'}
                          </div>
                        </td>

                        {/* 7. Host */}
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
                            {q.personToMeet || q.host || 'Branch Admin'}
                          </div>
                        </td>

                        {/* 8. Risk & Wait */}
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                            <span style={{ background: rc.bg, color: rc.color, padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <AlertTriangle size={10} /> {rc.label}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: waitMin > 20 ? '#ef4444' : '#f59e0b', fontSize: 11, fontWeight: 700 }}>
                              <Clock size={11} /> {waitMin > 0 ? `${waitMin}m waiting` : 'Just now'}
                            </div>
                          </div>
                        </td>

                        {/* 9. Actions */}
                        <td style={{ padding: '16px 20px', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button onClick={() => handleAction(q.id, 'approved')}
                              style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'rgba(16,185,129,0.12)', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.12)'; e.currentTarget.style.color = '#10b981'; }}
                              title="Approve"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                            <button onClick={() => handleAction(q.id, 'rejected')}
                              style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'rgba(239,68,68,0.12)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#ef4444'; }}
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Processed History Table */}
      {localProcessed.length > 0 && (
        <div style={{ ...glass, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
              Recently Processed ({localProcessed.length})
            </h3>
          </div>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0', background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc' }}>
                  <th style={thStyle}>Visitor Name</th>
                  <th style={thStyle}>Applied Date</th>
                  <th style={thStyle}>Visit Date</th>
                  <th style={thStyle}>Branch</th>
                  <th style={thStyle}>Department</th>
                  <th style={thStyle}>Purpose / ID</th>
                  <th style={thStyle}>Host</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Status & Time</th>
                </tr>
              </thead>
              <tbody>
                {localProcessed.map((p, i) => {
                  const riskKey = p.riskScore || 'LOW_RISK';
                  const rc = riskConfig[riskKey] || riskConfig['LOW_RISK'];
                  return (
                  <motion.tr key={`${p.id}-${i}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ borderBottom: i !== localProcessed.length - 1 ? (isDark ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.03)') : 'none', opacity: 0.8 }}>
                    
                    {/* Visitor Info */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 12, background: `linear-gradient(135deg, ${rc.color}30, ${rc.color}60)`, color: rc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, flexShrink: 0 }}>
                          {p.fullName ? p.fullName.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{p.fullName || 'Unknown Visitor'}</div>
                          <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600 }}>ID: {p.id || p.visitorId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155' }}>
                        {formatAppliedDate(p.createdAt)}
                      </div>
                    </td>

                    {/* Visit Date */}
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        📅 {formatVisitDate(p.visitDate)}
                      </div>
                    </td>

                    {/* Branch */}
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#f8fafc' : '#0f172a' }}>
                        {p.branch || 'Main Branch'}
                      </div>
                    </td>

                    {/* Department */}
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 12, color: isDark ? '#cbd5e1' : '#475569', fontWeight: 500 }}>
                        {p.department || p.dept || 'General'}
                      </div>
                    </td>

                    {/* Purpose / ID */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontSize: 13, color: isDark ? '#e2e8f0' : '#334155' }}>{p.purpose || 'Meeting'}</div>
                      <div style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ShieldAlert size={11} /> {p.idType || 'N/A'}
                      </div>
                    </td>

                    {/* Host */}
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155' }}>
                        {p.personToMeet || p.host || 'Branch Admin'}
                      </div>
                    </td>

                    {/* Status & Time */}
                    <td style={{ padding: '16px 20px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                        <span style={{ 
                          background: p.action === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                          color: p.action === 'approved' ? '#10b981' : '#ef4444', 
                          padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 
                        }}>
                          {p.action === 'approved' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {p.action === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: isDark ? '#64748b' : '#94a3b8', fontSize: 11, fontWeight: 600 }}>
                          <Clock size={11} /> {p.processedAt}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
