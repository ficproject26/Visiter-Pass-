"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { ChevronLeft, ChevronRight, User, Clock, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Mock events: keyed by "YYYY-M-D" (no leading zeros)
const mockEvents = {
  '2026-6-20': [
    { id: 1, title: 'Ravi Verma — HR Meeting', time: '9:00 AM', host: 'Sunita Rao', status: 'confirmed', type: 'meeting' },
    { id: 2, title: 'Vendor Site Check', time: '11:30 AM', host: 'Dev Singh', status: 'pending', type: 'visit' },
  ],
  '2026-6-22': [
    { id: 3, title: 'Kartik Mehta — Product Demo', time: '10:00 AM', host: 'Anjali Desai', status: 'confirmed', type: 'visit' },
    { id: 4, title: 'Arjun Sharma — Q2 Review', time: '10:30 AM', host: 'Priya Nair', status: 'confirmed', type: 'meeting' },
  ],
  '2026-6-23': [
    { id: 5, title: 'Preethi Suresh — Interview', time: '2:30 PM', host: 'Nikhil Sharma', status: 'pending', type: 'visit' },
    { id: 6, title: 'Meena Rajan — Partnership', time: '2:00 PM', host: 'Raj Kumar', status: 'confirmed', type: 'meeting' },
  ],
  '2026-6-24': [
    { id: 7, title: 'Akash Singh — Audit Review', time: '11:00 AM', host: 'Ritu Joshi', status: 'confirmed', type: 'visit' },
    { id: 8, title: 'Sanjay Patel — Budget Mtg', time: '11:00 AM', host: 'Anika Bose', status: 'pending', type: 'meeting' },
  ],
  '2026-6-25': [
    { id: 9, title: 'Manoj Kumar — Site Visit', time: '4:00 PM', host: 'Deepa Nair', status: 'pending', type: 'visit' },
    { id: 10, title: 'Ravi Verma — Strategy Mtg', time: '9:00 AM', host: 'Sunita Rao', status: 'confirmed', type: 'meeting' },
  ],
};

const eventTypeConfig = {
  meeting: { color: '#4f46e5', bg: 'rgba(79,70,229,0.12)', label: 'Meeting' },
  visit: { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Visit' },
};

const statusConfig = {
  confirmed: { color: '#10b981', icon: CheckCircle2 },
  pending: { color: '#f59e0b', icon: AlertCircle },
};

export default function CalendarView({ setActiveTab }) {
  const { isDark } = useTheme();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isSelected = (d) => d === selectedDay && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const getEventsForDay = (d) => {
    if (!d) return [];
    const key = `${viewYear}-${viewMonth + 1}-${d}`;
    return mockEvents[key] || [];
  };

  const selectedKey = `${viewYear}-${viewMonth + 1}-${selectedDay}`;
  const selectedEvents = mockEvents[selectedKey] || [];

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
      <div>
        {setActiveTab && (
          <button 
            onClick={() => setActiveTab("visitor_management")} 
            className="btn btn-secondary" 
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", marginBottom: "16px", borderRadius: 8, border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0", background: "transparent", color: isDark ? "#cbd5e1" : "#475569", cursor: "pointer", fontWeight: 600 }}
          >
            <span style={{ fontSize: 18 }}>←</span> Back to Dashboard
          </button>
        )}
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Calendar View</h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>Visualize all scheduled visits and meetings in one place</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, alignItems: 'start' }}>

        {/* Calendar Grid */}
        <div style={{ ...glass, padding: 28 }}>
          {/* Month Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <button onClick={prevMonth} style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isDark ? '#cbd5e1' : '#475569' }}>
              <ChevronLeft size={20} />
            </button>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
              {MONTHS[viewMonth]} {viewYear}
            </h3>
            <button onClick={nextMonth} style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isDark ? '#cbd5e1' : '#475569' }}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '6px 0', color: isDark ? '#64748b' : '#94a3b8' }}>{d}</div>
            ))}
          </div>

          {/* Day Cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((day, idx) => {
              const events = getEventsForDay(day);
              const hasEvents = events.length > 0;
              const isT = isToday(day);
              const isSel = day && selectedDay === day && viewMonth === today.getMonth() && viewYear === today.getFullYear();

              return (
                <motion.div key={idx} whileHover={day ? { scale: 1.05 } : {}}
                  onClick={() => day && setSelectedDay(day)}
                  style={{
                    aspectRatio: '1', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
                    padding: '8px 4px', cursor: day ? 'pointer' : 'default',
                    background: isT ? '#4f46e5' : isSel ? (isDark ? 'rgba(79,70,229,0.25)' : '#e0e7ff') : (hasEvents ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(79,70,229,0.04)') : 'transparent'),
                    border: isSel && !isT ? '2px solid #4f46e5' : '2px solid transparent',
                    transition: 'all 0.15s',
                  }}>
                  {day && (
                    <>
                      <span style={{ fontSize: 14, fontWeight: isT || isSel ? 800 : 500, color: isT ? '#fff' : (isDark ? '#e2e8f0' : '#334155') }}>{day}</span>
                      {hasEvents && (
                        <div style={{ display: 'flex', gap: 3, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                          {events.slice(0, 2).map(e => (
                            <div key={e.id} style={{ width: 6, height: 6, borderRadius: '50%', background: isT ? '#fff' : eventTypeConfig[e.type].color }} />
                          ))}
                          {events.length > 2 && <div style={{ width: 6, height: 6, borderRadius: '50%', background: isT ? 'rgba(255,255,255,0.5)' : '#94a3b8' }} />}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 20, marginTop: 24, paddingTop: 20, borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}>
            {Object.entries(eventTypeConfig).map(([key, cfg]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.color }} />
                {cfg.label}
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4f46e5' }} /> Today
            </div>
          </div>
        </div>

        {/* Day Detail Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...glass, padding: 22 }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
              {MONTHS[viewMonth]} {selectedDay}, {viewYear}
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>
              {selectedEvents.length === 0 ? 'No events scheduled' : `${selectedEvents.length} event${selectedEvents.length > 1 ? 's' : ''} scheduled`}
            </p>

            {selectedEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: isDark ? '#64748b' : '#94a3b8' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📅</div>
                <p style={{ fontSize: 13 }}>No visits or meetings today</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {selectedEvents.map(ev => {
                  const cfg = eventTypeConfig[ev.type];
                  const sc = statusConfig[ev.status];
                  const StatusIcon = sc.icon;
                  return (
                    <motion.div key={ev.id} variants={fadeUpBounce}
                      style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: 14, padding: 16, borderLeft: `4px solid ${cfg.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <span style={{ background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>{cfg.label}</span>
                        <StatusIcon size={14} color={sc.color} />
                      </div>
                      <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: isDark ? '#e2e8f0' : '#334155', lineHeight: 1.3 }}>{ev.title}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>
                          <Clock size={12} /> {ev.time}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>
                          <User size={12} /> Host: {ev.host}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Stats Card */}
          <div style={{ ...glass, padding: 22 }}>
            <h4 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>This Month</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Total Events', value: Object.values(mockEvents).flat().length, color: '#4f46e5' },
                { label: 'Confirmed', value: Object.values(mockEvents).flat().filter(e => e.status === 'confirmed').length, color: '#10b981' },
                { label: 'Pending', value: Object.values(mockEvents).flat().filter(e => e.status === 'pending').length, color: '#f59e0b' },
              ].map(stat => (
                <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>{stat.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 800, color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
