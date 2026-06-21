"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { Plus, Search, Calendar, Clock, Users, Building2, Video, CheckCircle2, XCircle, AlertCircle, ChevronRight, MessageSquare } from 'lucide-react';

const mockRequests = [
  { id: 'MR-001', requester: 'Arjun Sharma', company: 'TechCorp Pvt Ltd', host: 'Priya Nair', department: 'Engineering', date: '2026-06-22', time: '10:30 AM', duration: '1 Hour', mode: 'In-Person', agenda: 'Q2 Product Review and Roadmap Discussion', status: 'pending', avatar: 'A' },
  { id: 'MR-002', requester: 'Meena Rajan', company: 'StartupX', host: 'Raj Kumar', department: 'Sales', date: '2026-06-23', time: '2:00 PM', duration: '45 Min', mode: 'Video Call', agenda: 'Partnership Proposal Presentation', status: 'approved', avatar: 'M' },
  { id: 'MR-003', requester: 'Sanjay Patel', company: 'FinSolve Inc', host: 'Anika Bose', department: 'Finance', date: '2026-06-24', time: '11:00 AM', duration: '2 Hours', mode: 'In-Person', agenda: 'Budget Allocation Review for FY2026', status: 'pending', avatar: 'S' },
  { id: 'MR-004', requester: 'Divya Krishnan', company: 'CloudBase', host: 'Dev Singh', department: 'IT', date: '2026-06-21', time: '3:30 PM', duration: '30 Min', mode: 'Video Call', agenda: 'Infrastructure Security Audit Discussion', status: 'rejected', avatar: 'D' },
  { id: 'MR-005', requester: 'Ravi Verma', company: 'HRConnect', host: 'Sunita Rao', department: 'HR', date: '2026-06-25', time: '9:00 AM', duration: '1.5 Hours', mode: 'In-Person', agenda: 'Talent Acquisition Strategy Meeting', status: 'approved', avatar: 'R' },
];

const statusConfig = {
  pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', text: 'Pending', icon: AlertCircle },
  approved: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', text: 'Approved', icon: CheckCircle2 },
  rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', text: 'Rejected', icon: XCircle },
};

export default function MeetingRequests() {
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = mockRequests.filter(r => {
    const matchSearch = r.requester.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: mockRequests.length,
    pending: mockRequests.filter(r => r.status === 'pending').length,
    approved: mockRequests.filter(r => r.status === 'approved').length,
    rejected: mockRequests.filter(r => r.status === 'rejected').length,
  };

  const cardBase = {
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
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Meeting Requests</h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>Manage and respond to all incoming meeting requests</p>
        </div>
        <button style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.35)' }}>
          <Plus size={18} /> New Request
        </button>
      </div>

      {/* Stats Pills */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {['all', 'pending', 'approved', 'rejected'].map(s => {
          const cfg = s === 'all' ? { color: '#4f46e5', bg: 'rgba(79,70,229,0.1)' } : statusConfig[s];
          return (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '8px 18px', borderRadius: 40, border: `2px solid ${statusFilter === s ? cfg.color : 'transparent'}`,
              background: statusFilter === s ? cfg.bg : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
              color: statusFilter === s ? cfg.color : (isDark ? '#94a3b8' : '#64748b'),
              fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s'
            }}>
              {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
            </button>
          );
        })}
        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#64748b' : '#94a3b8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests..."
            style={{ padding: '9px 16px 9px 40px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', color: isDark ? '#f8fafc' : '#0f172a', fontSize: 13, outline: 'none', minWidth: 240 }} />
        </div>
      </div>

      {/* Requests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AnimatePresence>
          {filtered.map(req => {
            const sc = statusConfig[req.status];
            const StatusIcon = sc.icon;
            return (
              <motion.div key={req.id} variants={fadeUpBounce} layout
                style={{ ...cardBase, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer' }}
                whileHover={{ y: -2, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(148,163,184,0.18)' }}
                onClick={() => setSelected(selected?.id === req.id ? null : req)}
              >
                {/* Avatar */}
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, flexShrink: 0 }}>
                  {req.avatar}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{req.requester}</h3>
                    <span style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>•</span>
                    <span style={{ fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>{req.company}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, background: isDark ? 'rgba(79,70,229,0.15)' : '#e0e7ff', color: '#4f46e5', padding: '2px 10px', borderRadius: 20 }}>{req.id}</span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: isDark ? '#94a3b8' : '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <MessageSquare size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />{req.agenda}
                  </p>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: isDark ? '#cbd5e1' : '#475569', fontWeight: 600 }}>
                    <Calendar size={14} /> {req.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>
                    <Clock size={14} /> {req.time} · {req.duration}
                  </div>
                </div>

                {/* Mode */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', fontSize: 12, fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569', flexShrink: 0 }}>
                  {req.mode === 'Video Call' ? <Video size={14} /> : <Building2 size={14} />} {req.mode}
                </div>

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: sc.bg, color: sc.color, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  <StatusIcon size={13} /> {sc.text}
                </div>

                <ChevronRight size={16} color={isDark ? '#64748b' : '#94a3b8'} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Expanded Detail Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            style={{ ...cardBase, padding: 28 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Request Details — {selected.id}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 24 }}>
              {[
                { label: 'Requester', value: selected.requester },
                { label: 'Company', value: selected.company },
                { label: 'Host', value: selected.host },
                { label: 'Department', value: selected.department },
                { label: 'Date', value: selected.date },
                { label: 'Time', value: `${selected.time} (${selected.duration})` },
                { label: 'Mode', value: selected.mode },
                { label: 'Status', value: selected.status.toUpperCase() },
              ].map(item => (
                <div key={item.label}>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8' }}>{item.label}</span>
                  <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155' }}>{item.value}</p>
                </div>
              ))}
            </div>
            <div style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderRadius: 14, padding: 16, marginBottom: 24 }}>
              <span style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 700, color: isDark ? '#64748b' : '#94a3b8' }}>Agenda</span>
              <p style={{ margin: '6px 0 0', fontSize: 14, color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.6 }}>{selected.agenda}</p>
            </div>
            {selected.status === 'pending' && (
              <div style={{ display: 'flex', gap: 12 }}>
                <button style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: '#10b981', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>✓ Approve</button>
                <button style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>✕ Reject</button>
                <button onClick={() => setSelected(null)} style={{ padding: '10px 24px', borderRadius: 12, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', background: 'transparent', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Close</button>
              </div>
            )}
            {selected.status !== 'pending' && (
              <button onClick={() => setSelected(null)} style={{ padding: '10px 24px', borderRadius: 12, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', background: 'transparent', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Close</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
