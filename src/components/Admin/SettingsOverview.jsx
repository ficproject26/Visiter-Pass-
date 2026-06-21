"use client";
import React, { useState } from 'react';
import {  motion } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import {
  Building, Palette, Palette as ThemeIcon, ShieldAlert, Mail, Bell,
  ChevronRight, CheckCircle2, XCircle
, ArrowRight } from 'lucide-react';

const sections = [
  {
    id: 'company_settings',
    title: 'Company Settings',
    description: 'Manage core organizational details, locations, and global preferences.',
    icon: Building,
    accentColor: '#3b82f6',
    stats: [{ label: 'Details', value: '100%' }, { label: 'Locations', value: 4 }],
    items: [
      { name: 'ForgeIndia HQ', detail: 'Primary Location', status: 'active' },
      { name: 'Billing Info', detail: 'Verified', status: 'active' },
    ],
  },
  {
    id: 'branding_logo',
    title: 'Branding & Logo',
    description: 'Customize visitor passes, emails, and kiosks with your brand identity.',
    icon: Palette,
    accentColor: '#8b5cf6',
    stats: [{ label: 'Assets', value: 12 }, { label: 'Guidelines', value: 1 }],
    items: [
      { name: 'Primary Logo', detail: 'Uploaded', status: 'active' },
      { name: 'Email Header', detail: 'Configured', status: 'active' },
    ],
  },
  {
    id: 'theme_settings',
    title: 'Theme Settings',
    description: 'Toggle dark mode, UI colors, and reception kiosk styling.',
    icon: ThemeIcon,
    accentColor: '#10b981',
    stats: [{ label: 'Active Theme', value: 'Dark' }, { label: 'Palettes', value: 3 }],
    items: [
      { name: 'Dashboard UI', detail: 'Dark Mode Enabled', status: 'active' },
      { name: 'Reception Kiosk', detail: 'Light Mode Default', status: 'active' },
    ],
  },
  {
    id: 'security_settings',
    title: 'Security Settings',
    description: 'Manage password policies, 2FA, session timeouts, and IP whitelisting.',
    icon: ShieldAlert,
    accentColor: '#ef4444',
    stats: [{ label: '2FA', value: 'Enforced' }, { label: 'Policies', value: 5 }],
    items: [
      { name: 'Two-Factor Authentication', detail: 'Required for Admins', status: 'active' },
      { name: 'Session Timeout', detail: '30 Minutes', status: 'active' },
    ],
  },
  {
    id: 'email_templates',
    title: 'Email Templates',
    description: 'Design and edit HTML email templates for all system communications.',
    icon: Mail,
    accentColor: '#f59e0b',
    stats: [{ label: 'Templates', value: 18 }, { label: 'Customized', value: 6 }],
    items: [
      { name: 'Welcome Email', detail: 'Updated yesterday', status: 'active' },
      { name: 'Pass QR Email', detail: 'Default layout', status: 'active' },
    ],
  },
  {
    id: 'notification_templates',
    title: 'Notification Templates',
    description: 'Configure SMS and push notification text content and variables.',
    icon: Bell,
    accentColor: '#0ea5e9',
    stats: [{ label: 'SMS', value: 8 }, { label: 'Push', value: 12 }],
    items: [
      { name: 'Host Alert SMS', detail: '140 chars max', status: 'active' },
      { name: 'Visitor Checkout Push', detail: 'Configured', status: 'active' },
    ],
  },
];

export default function SettingsOverview({ setActiveTab }) {
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
          Settings
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>
          Configure global preferences, security policies, branding, and system templates.
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
