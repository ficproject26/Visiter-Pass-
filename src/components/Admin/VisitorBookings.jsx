"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Plus, Search, Calendar, Clock, MapPin, User, Tag, CheckCircle2, AlertCircle, XCircle, Trash2 } from 'lucide-react';

const statusConfig = {
  confirmed: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', text: 'Confirmed', icon: CheckCircle2 },
  pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', text: 'Pending', icon: AlertCircle },
  cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', text: 'Cancelled', icon: XCircle },
};

const categoryColors = {
  Vendor: '#f59e0b', Interviewee: '#10b981', Guest: '#3b82f6', VIP: '#8b5cf6',
};

export default function VisitorBookings() {
  const { isDark } = useTheme();
  const { visitors, refreshData } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = visitors.filter(b => {
    const vName = (b.fullName || b.visitorName || '').toLowerCase();
    const vId = (b.visitorId || b.id || '').toLowerCase();
    const vHost = (b.personToMeet || b.host || '').toLowerCase();
    
    const matchSearch = vName.includes(search.toLowerCase()) ||
      vId.includes(search.toLowerCase()) ||
      vHost.includes(search.toLowerCase());
      
    // Map backend approvalStatus/status to 'confirmed', 'pending', 'cancelled'
    const statusVal = b.approvalStatus === 'APPROVED' ? 'confirmed' : (b.approvalStatus === 'REJECTED' ? 'cancelled' : 'pending');
    const matchStatus = statusFilter === 'all' || statusVal === statusFilter;
    
    return matchSearch && matchStatus;
  });

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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Visitor Bookings</h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>View and manage all pre-scheduled visitor bookings</p>
        </div>
        <button style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}>
          <Plus size={18} /> New Booking
        </button>
      </div>

      {/* Filter + Search Bar */}
      <div style={{ ...glass, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {['all', 'confirmed', 'pending', 'cancelled'].map(s => {
          const cfg = s === 'all' ? { color: '#4f46e5', bg: 'rgba(79,70,229,0.1)' } : statusConfig[s];
          return (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '6px 16px', borderRadius: 30, border: `2px solid ${statusFilter === s ? cfg.color : 'transparent'}`,
              background: statusFilter === s ? cfg.bg : 'transparent',
              color: statusFilter === s ? cfg.color : (isDark ? '#94a3b8' : '#64748b'),
              fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s'
            }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          );
        })}
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#64748b' : '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookings..."
            style={{ padding: '8px 16px 8px 40px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', color: isDark ? '#f8fafc' : '#0f172a', fontSize: 13, outline: 'none', minWidth: 220 }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ ...glass, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                {['Booking ID', 'Visitor', 'Host & Dept', 'Branch', 'Date & Time', 'Purpose', 'Category', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: isDark ? '#64748b' : '#94a3b8', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((b, i) => {
                  const mappedStatus = b.approvalStatus === 'APPROVED' ? 'confirmed' : (b.approvalStatus === 'REJECTED' ? 'cancelled' : 'pending');
                  const sc = statusConfig[mappedStatus] || statusConfig['pending'];
                  const StatusIcon = sc.icon;
                  const mappedCat = b.visitorType || b.category || 'Guest';
                  const catColor = categoryColors[mappedCat] || categoryColors['Guest'] || '#3b82f6';
                  
                  return (
                    <motion.tr key={b.id || i} variants={fadeUpBounce}
                      style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 20px', fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>{b.visitorId || b.id || 'VB-000'}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: isDark ? '#f8fafc' : '#0f172a' }}>{b.fullName || b.visitorName}</div>
                        <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', marginTop: 2 }}>{b.phoneNumber || b.visitorPhone || '--'}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: isDark ? '#e2e8f0' : '#334155' }}>{b.personToMeet || b.host || 'Unknown'}</div>
                        <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', marginTop: 2 }}>{b.department || b.hostDept || '--'}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: isDark ? '#cbd5e1' : '#475569' }}>
                          <MapPin size={13} /> {b.branch || '--'}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Calendar size={13} /> {b.visitDate || '--'}
                        </div>
                        <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Clock size={12} /> {b.visitTime || '--'}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: isDark ? '#cbd5e1' : '#475569' }}>{b.purpose || '--'}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ background: isDark ? `${catColor}20` : `${catColor}15`, color: catColor, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{mappedCat}</span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ background: sc.bg, color: sc.color, padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, width: 'fit-content' }}>
                          <StatusIcon size={12} /> {sc.text}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <button style={{ padding: '5px 10px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600 }}>
                          <Trash2 size={13} /> Cancel
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
