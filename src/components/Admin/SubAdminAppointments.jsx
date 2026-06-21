"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, Check, X, Clock, User, Filter, RefreshCw, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function SubAdminAppointments({ onApprove, onReject }) {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { visitors, refreshData } = useData();
  const [activeSubTab, setActiveSubTab] = useState('pending'); // pending, approved, rejected, calendar
  const [rescheduleVisitorId, setRescheduleVisitorId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  
  const assignedBranch = user?.branch || 'Krishnagiri Main';

  // Filters visitors by assigned branch and formats date
  const branchAppointments = useMemo(() => {
    return visitors.filter(v => v.branch === assignedBranch).map(v => {
      let dateStr = '';
      if (v.visitDate) {
        const d = new Date(v.visitDate);
        dateStr = isNaN(d.getTime()) ? v.visitDate : d.toISOString().split('T')[0];
      }
      return {
        ...v,
        formattedDate: dateStr
      };
    });
  }, [visitors, assignedBranch]);

  // Sub-tabs filtering
  const pendingMeetings = useMemo(() => branchAppointments.filter(v => v.approvalStatus === 'PENDING'), [branchAppointments]);
  const approvedMeetings = useMemo(() => branchAppointments.filter(v => v.approvalStatus === 'APPROVED'), [branchAppointments]);
  const rejectedMeetings = useMemo(() => branchAppointments.filter(v => v.approvalStatus === 'REJECTED'), [branchAppointments]);

  // Calendar State
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const getEventsForDay = (day) => {
    if (!day) return [];
    const targetDateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return branchAppointments.filter(v => v.formattedDate === targetDateStr);
  };

  const selectedEvents = useMemo(() => {
    const targetDateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    return branchAppointments.filter(v => v.formattedDate === targetDateStr);
  }, [branchAppointments, viewYear, viewMonth, selectedDay]);

  const handleRescheduleSubmit = async (e, id) => {
    e.preventDefault();
    if (!rescheduleDate) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/visitors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitDate: rescheduleDate })
      });
      if (response.ok) {
        setRescheduleVisitorId(null);
        refreshData();
        alert('Meeting successfully rescheduled!');
      } else {
        alert('Failed to reschedule');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend');
    }
  };

  const glass = {
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
      {/* 1. TOP HEADER ACTION BAR */}
      <motion.div variants={fadeUpBounce} style={{ ...glass, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Appointments & Meetings</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>Approve host requests, reschedule slots, and audit schedules for {assignedBranch}.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          {['pending', 'approved', 'rejected', 'calendar'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                border: 0,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'capitalize',
                background: activeSubTab === tab 
                  ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' 
                  : (isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9'),
                color: activeSubTab === tab ? '#ffffff' : (isDark ? '#cbd5e1' : '#475569'),
                transition: 'all 0.2s'
              }}
            >
              {tab === 'pending' && `Pending (${pendingMeetings.length})`}
              {tab === 'approved' && `Approved (${approvedMeetings.length})`}
              {tab === 'rejected' && `Rejected (${rejectedMeetings.length})`}
              {tab === 'calendar' && 'Calendar View'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 2. TAB WORKSPACE */}
      {activeSubTab === 'calendar' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>
          
          {/* Calendar Grid */}
          <div style={{ ...glass, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <button onClick={prevMonth} style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isDark ? '#cbd5e1' : '#475569' }}>
                <ChevronLeft size={20} />
              </button>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                {MONTHS[viewMonth]} {viewYear}
              </h3>
              <button onClick={nextMonth} style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isDark ? '#cbd5e1' : '#475569' }}>
                <ChevronRight size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '6px 0', color: isDark ? '#64748b' : '#94a3b8' }}>{d}</div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {cells.map((day, idx) => {
                const events = getEventsForDay(day);
                const hasEvents = events.length > 0;
                const isT = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
                const isSel = day === selectedDay;

                return (
                  <div
                    key={idx}
                    onClick={() => day && setSelectedDay(day)}
                    style={{
                      aspectRatio: '1', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
                      padding: '8px 4px', cursor: day ? 'pointer' : 'default',
                      background: isT ? '#4f46e5' : isSel ? (isDark ? 'rgba(79,70,229,0.25)' : '#e0e7ff') : (hasEvents ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(79,70,229,0.04)') : 'transparent'),
                      border: isSel && !isT ? '2px solid #4f46e5' : '2px solid transparent',
                      position: 'relative'
                    }}
                  >
                    {day && (
                      <>
                        <span style={{ fontSize: 13, fontWeight: isT || isSel ? 800 : 500, color: isT ? '#fff' : (isDark ? '#e2e8f0' : '#334155') }}>{day}</span>
                        {hasEvents && (
                          <div style={{ display: 'flex', gap: 3, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {events.slice(0, 3).map(e => (
                              <div key={e.id} style={{ width: 5, height: 5, borderRadius: '50%', background: isT ? '#fff' : (e.approvalStatus === 'APPROVED' ? '#10b981' : '#f59e0b') }} />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar events detail list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ ...glass, padding: 22 }}>
              <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                {MONTHS[viewMonth]} {selectedDay}, {viewYear}
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>
                {selectedEvents.length} meeting{selectedEvents.length !== 1 ? 's' : ''} scheduled
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selectedEvents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: isDark ? '#64748b' : '#94a3b8' }}>
                    <p style={{ fontSize: 13 }}>No meetings scheduled for this day.</p>
                  </div>
                ) : (
                  selectedEvents.map(ev => (
                    <div key={ev.id} style={{
                      background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                      borderRadius: 14, padding: 14,
                      borderLeft: `4px solid ${ev.approvalStatus === 'APPROVED' ? '#10b981' : (ev.approvalStatus === 'REJECTED' ? '#ef4444' : '#f59e0b')}`
                    }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: isDark ? '#e2e8f0' : '#334155', marginBottom: 4 }}>{ev.fullName}</div>
                      <div style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b', marginBottom: 8 }}>{ev.purpose}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>
                        <User size={12} /> Host: {ev.personToMeet}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Appointment Purpose</th>
                  <th>Host / Department</th>
                  <th>Visit Date / Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Pending meetings */}
                {activeSubTab === 'pending' && pendingMeetings.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No pending requests.</td></tr>
                )}
                {activeSubTab === 'approved' && approvedMeetings.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No approved meetings.</td></tr>
                )}
                {activeSubTab === 'rejected' && rejectedMeetings.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No rejected meetings.</td></tr>
                )}

                {((activeSubTab === 'pending' && pendingMeetings) || 
                  (activeSubTab === 'approved' && approvedMeetings) || 
                  (activeSubTab === 'rejected' && rejectedMeetings)).map((mtg) => (
                  <tr key={mtg.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #ccfbf1, #c7d2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 800, fontSize: 12 }}>
                          {mtg.fullName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', fontSize: 13 }}>{mtg.fullName}</div>
                          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>{mtg.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155', fontSize: 13 }}>{mtg.purpose}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}>{mtg.personToMeet}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Dept: {mtg.department}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}>{mtg.visitDate || '—'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>Time: {mtg.checkInTime || '—'}</div>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: mtg.approvalStatus === 'APPROVED' ? '#dcfce7' : (mtg.approvalStatus === 'REJECTED' ? '#fee2e2' : '#fef9c3'),
                        color: mtg.approvalStatus === 'APPROVED' ? '#15803d' : (mtg.approvalStatus === 'REJECTED' ? '#991b1b' : '#a16207')
                      }}>
                        {mtg.approvalStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {mtg.approvalStatus === 'PENDING' && (
                          <>
                            <button onClick={() => onApprove(mtg.id)} className="btn btn-success" style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Check size={14} /> Approve
                            </button>
                            <button onClick={() => onReject(mtg.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <X size={14} /> Reject
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => setRescheduleVisitorId(mtg.id)} 
                          className="btn btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4, background: isDark ? 'rgba(255,255,255,0.05)' : '#fff' }}
                        >
                          <RefreshCw size={12} /> Reschedule
                        </button>
                      </div>

                      {/* Inline reschedule form */}
                      {rescheduleVisitorId === mtg.id && (
                        <form onSubmit={(e) => handleRescheduleSubmit(e, mtg.id)} style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                          <input 
                            type="date" 
                            required 
                            className="form-input" 
                            style={{ padding: '4px 8px', fontSize: 12, width: 'auto' }}
                            value={rescheduleDate}
                            onChange={e => setRescheduleDate(e.target.value)}
                          />
                          <button type="submit" className="btn btn-primary" style={{ padding: '4px 8px', fontSize: 11, borderRadius: 6 }}>Confirm</button>
                          <button type="button" onClick={() => setRescheduleVisitorId(null)} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: 11, borderRadius: 6 }}>Cancel</button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
