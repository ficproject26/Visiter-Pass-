"use client";
import React, { useState } from 'react';
import {  motion } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import {
  QrCode, ScanLine, UserCheck, Shield,
  ChevronRight, CheckCircle2, XCircle
, ArrowRight } from 'lucide-react';

const sections = [
  {
    id: 'qr_pass_generator',
    title: 'QR Pass Generator',
    description: 'Create and manage secure QR codes for visitors, contractors, and VIPs.',
    icon: QrCode,
    accentColor: '#3b82f6',
    stats: [{ label: 'Generated Today', value: 85 }, { label: 'Active Now', value: 42 }],
    items: [
      { name: 'Standard Visitor Pass', detail: 'Single Entry', status: 'active' },
      { name: 'VIP Pass', detail: 'Multi-Entry (7 days)', status: 'active' },
    ],
  },
  {
    id: 'qr_scan_logs',
    title: 'QR Scan Logs',
    description: 'Real-time feed of all QR code scans across all entry and exit points.',
    icon: ScanLine,
    accentColor: '#8b5cf6',
    stats: [{ label: 'Scans Today', value: 342 }, { label: 'Denied', value: 3 }],
    items: [
      { name: 'Main Lobby Entry', detail: 'Scanned at 10:15 AM', status: 'active' },
      { name: 'Server Room Entry', detail: 'Access Denied - 10:10 AM', status: 'failed' },
    ],
  },
  {
    id: 'visitor_verification',
    title: 'Visitor Verification',
    description: 'Live dashboard for receptionists to verify incoming visitor details.',
    icon: UserCheck,
    accentColor: '#10b981',
    stats: [{ label: 'Pending', value: 5 }, { label: 'Verified', value: 120 }],
    items: [
      { name: 'Rahul Verma', detail: 'Awaiting ID Check', status: 'failed' },
      { name: 'Anita Desai', detail: 'Verified by Reception', status: 'active' },
    ],
  },
  {
    id: 'id_verification_records',
    title: 'ID Verification Records',
    description: 'Secure repository of scanned government IDs and facial captures.',
    icon: Shield,
    accentColor: '#f59e0b',
    stats: [{ label: 'Records', value: '4.2K' }, { label: 'Flagged', value: 12 }],
    items: [
      { name: 'Aadhaar Card Logs', detail: 'Encrypted Storage', status: 'active' },
      { name: 'Driving License Logs', detail: 'Encrypted Storage', status: 'active' },
    ],
  },
];

export default function VerificationOverview({ setActiveTab }) {
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
          Verification Center
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>
          Manage QR passes, monitor scan logs, and verify visitor identities securely.
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
