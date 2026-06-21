"use client";
import React, { useState } from 'react';
import {  motion } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import {
  MessageSquare, Mail, Smartphone, BellRing,
  ChevronRight, CheckCircle2, XCircle
, ArrowRight } from 'lucide-react';

const sections = [
  {
    id: 'sms_notifications',
    title: 'SMS Notifications',
    description: 'Configure automated text messages for visitor arrivals and OTPs.',
    icon: MessageSquare,
    accentColor: '#3b82f6',
    stats: [{ label: 'Sent Today', value: 145 }, { label: 'Failed', value: 2 }],
    items: [
      { name: 'Host Arrival Alert', detail: 'Enabled', status: 'active' },
      { name: 'Visitor OTP', detail: 'Enabled', status: 'active' },
    ],
  },
  {
    id: 'email_notifications',
    title: 'Email Notifications',
    description: 'Manage email templates for invitations, passes, and summaries.',
    icon: Mail,
    accentColor: '#8b5cf6',
    stats: [{ label: 'Sent Today', value: 312 }, { label: 'Bounced', value: 0 }],
    items: [
      { name: 'Meeting Invitation', detail: 'Enabled', status: 'active' },
      { name: 'Daily Report', detail: 'Enabled', status: 'active' },
    ],
  },
  {
    id: 'push_notifications',
    title: 'Push Notifications',
    description: 'App-based push notifications for real-time alerts to employees.',
    icon: Smartphone,
    accentColor: '#10b981',
    stats: [{ label: 'Sent Today', value: 89 }, { label: 'Active Devices', value: 240 }],
    items: [
      { name: 'App Arrival Alert', detail: 'Enabled', status: 'active' },
      { name: 'Emergency Broadcast', detail: 'Standby', status: 'active' },
    ],
  },
  {
    id: 'alert_center',
    title: 'Alert Center',
    description: 'Centralized view of all system alerts, failures, and important notices.',
    icon: BellRing,
    accentColor: '#f59e0b',
    stats: [{ label: 'Active Alerts', value: 1 }, { label: 'Resolved', value: 14 }],
    items: [
      { name: 'SMS Gateway Delay', detail: 'Resolved at 10:00 AM', status: 'active' },
      { name: 'Email Quota Warning', detail: '80% used', status: 'failed' },
    ],
  },
];

export default function NotificationsOverview({ setActiveTab }) {
  const { isDark } = useTheme();
  
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

      <motion.div variants={fadeUpBounce}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
          Notifications
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>
          Manage all communication channels, templates, and delivery statuses.
        </p>
      </motion.div>

      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <motion.div
              key={section.id}
              variants={fadeUpBounce}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => setActiveTab && setActiveTab(section.id)}
              style={{
                ...glass,
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Top Accent Line */}
              <div style={{ height: 4, width: '100%', background: section.accentColor }} />
              
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                
                {/* Header: Icon + Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: isDark ? (section.accentColor + '20') : (section.accentColor + '15'),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: section.accentColor,
                  }}>
                    <Icon size={26} strokeWidth={2.5} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                    {section.title}
                  </h3>
                </div>

                {/* Description */}
                <p style={{ 
                  margin: 0, fontSize: 14, color: isDark ? '#94a3b8' : '#64748b', 
                  lineHeight: 1.5, flexGrow: 1 
                }}>
                  {section.description}
                </p>

                {/* Bottom Stats & Arrow */}
                <div style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  marginTop: 24, paddingTop: 16, 
                  borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' 
                }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {section.stats.map(s => (
                      <div key={s.label}>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: isDark ? '#e2e8f0' : '#334155' }}>
                          {s.value}
                        </p>
                        <p style={{ margin: 0, fontSize: 11, color: isDark ? '#64748b' : '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ 
                    width: 32, height: 32, borderRadius: '50%', 
                    background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: section.accentColor
                  }}>
                    <ArrowRight size={16} strokeWidth={3} />
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
