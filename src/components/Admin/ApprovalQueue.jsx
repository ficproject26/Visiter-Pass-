"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { ShieldAlert, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const riskConfig = {
  LOW_RISK: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Low Risk' },
  MEDIUM_RISK: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Medium Risk' },
  HIGH_RISK: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'High Risk' },
};

export default function ApprovalQueue() {
  const { isDark } = useTheme();
  const { visitors, refreshData } = useData();
  const [localProcessed, setLocalProcessed] = useState([]); // Temporary history for visual feedback

  // Filter live pending visitors (case-insensitive)
  const queue = useMemo(() => {
    return visitors.filter(v => {
      const s = (v.approvalStatus || '').toUpperCase();
      return s === 'PENDING';
    });
  }, [visitors]);

  // Real counts from DB data — survive page refresh
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

    // Optimistic local history entry
    setLocalProcessed(prev => [{ ...item, action, processedAt: new Date().toLocaleTimeString() }, ...prev]);

    try {
      const res = await fetch(`${API_BASE_URL}/api/visitors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          approvalStatus: newStatus
        })
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

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Approval Queue</h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>Real-time queue of visitors awaiting security clearance</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: 12, padding: '10px 18px', fontWeight: 800, fontSize: 22, textAlign: 'center' }}>
            {queue.length}
            <div style={{ fontSize: 11, fontWeight: 600 }}>Pending</div>
          </div>
          <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: 12, padding: '10px 18px', fontWeight: 800, fontSize: 22, textAlign: 'center' }}>
            {approvedCount}
            <div style={{ fontSize: 11, fontWeight: 600 }}>Approved</div>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 12, padding: '10px 18px', fontWeight: 800, fontSize: 22, textAlign: 'center' }}>
            {rejectedCount}
            <div style={{ fontSize: 11, fontWeight: 600 }}>Rejected</div>
          </div>
        </div>
      </div>

      {/* Live Queue Table */}
      <div style={{ ...glass, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 0 4px rgba(245,158,11,0.2)' }} />
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>Awaiting Approval</h3>
        </div>

        {queue.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 60, textAlign: 'center', color: isDark ? '#64748b' : '#94a3b8' }}>
            <CheckCircle2 size={48} style={{ margin: '0 auto 16px', color: '#10b981', opacity: 0.8 }} />
            <p style={{ fontWeight: 800, fontSize: 18, color: isDark ? '#e2e8f0' : '#334155', margin: '0 0 8px 0' }}>Queue Clear!</p>
            <p style={{ fontSize: 14, margin: 0 }}>All visitors have been processed.</p>
          </motion.div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}>Visitor Details</th>
                  <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}>Host & Dept</th>
                  <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}>Purpose / ID</th>
                  <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}>Risk & Wait</th>
                  <th style={{ padding: '16px 24px', fontSize: 12, fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)', textAlign: 'right' }}>Actions</th>
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
                        style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.03)' }}
                      >
                        {/* Visitor Info */}
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${rc.color}30, ${rc.color}60)`, color: rc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, flexShrink: 0 }}>
                              {q.fullName ? q.fullName.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{q.fullName || 'Unknown Visitor'}</div>
                              <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>{q.company || 'Personal'}</div>
                            </div>
                          </div>
                        </td>

                        {/* Host & Dept */}
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155' }}>{q.personToMeet || q.host || 'Unknown Host'}</div>
                          <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>{q.department || q.dept || 'N/A'}</div>
                        </td>

                        {/* Purpose & ID */}
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontSize: 13, color: isDark ? '#e2e8f0' : '#334155' }}>{q.purpose || 'Meeting'}</div>
                          <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <ShieldAlert size={12} /> {q.idType || 'N/A'}
                          </div>
                        </td>

                        {/* Risk & Wait */}
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
                            <span style={{ background: rc.bg, color: rc.color, padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <AlertTriangle size={10} /> {rc.label}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: waitMin > 20 ? '#ef4444' : '#f59e0b', fontSize: 12, fontWeight: 700 }}>
                              <Clock size={12} /> {waitMin > 0 ? `${waitMin}m waiting` : 'Just now'}
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button onClick={() => handleAction(q.id, 'approved')}
                              style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'rgba(16,185,129,0.1)', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#10b981'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; e.currentTarget.style.color = '#10b981'; }}
                              title="Approve"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                            <button onClick={() => handleAction(q.id, 'rejected')}
                              style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
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
              <tbody>
                {localProcessed.map((p, i) => (
                  <motion.tr key={`${p.id}-${i}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ borderBottom: i !== localProcessed.length - 1 ? (isDark ? '1px solid rgba(255,255,255,0.03)' : '1px solid rgba(0,0,0,0.03)') : 'none', opacity: 0.8 }}>
                    <td style={{ padding: '16px 24px', width: 60 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: p.action === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.action === 'approved' ? '#10b981' : '#ef4444' }}>
                        {p.action === 'approved' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{p.fullName || p.visitorName}</div>
                      <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>{p.company || 'Personal'}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: p.action === 'approved' ? '#10b981' : '#ef4444' }}>
                        {p.action === 'approved' ? 'Approved' : 'Rejected'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: 12, color: isDark ? '#64748b' : '#94a3b8' }}>
                      {p.processedAt}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
