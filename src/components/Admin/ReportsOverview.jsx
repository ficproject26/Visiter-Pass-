"use client";
import React, { useState } from 'react';
import {  motion } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import {
  FileText, Calendar, BarChart2, TrendingUp, Clock, Download,
  ChevronRight, CheckCircle2, XCircle
, ArrowRight } from 'lucide-react';

const sections = [
  {
    id: 'daily_reports',
    title: 'Daily Reports',
    description: 'Overview of today\'s visitor traffic, check-ins, and appointments.',
    icon: FileText,
    accentColor: '#3b82f6',
    stats: [{ label: 'Generated', value: 12 }, { label: 'Scheduled', value: 2 }],
    items: [
      { name: 'Today\'s Summary', detail: 'Generated at 08:00 AM', status: 'active' },
      { name: 'Security Log', detail: 'Generated at 09:00 AM', status: 'active' },
    ],
  },
  {
    id: 'weekly_reports',
    title: 'Weekly Reports',
    description: 'Weekly breakdown of visitor volume and operational metrics.',
    icon: Calendar,
    accentColor: '#8b5cf6',
    stats: [{ label: 'Generated', value: 4 }, { label: 'Scheduled', value: 1 }],
    items: [
      { name: 'Last Week Summary', detail: 'Generated on Monday', status: 'active' },
    ],
  },
  {
    id: 'monthly_reports',
    title: 'Monthly Reports',
    description: 'Comprehensive monthly analysis and compliance logs.',
    icon: BarChart2,
    accentColor: '#ec4899',
    stats: [{ label: 'Generated', value: 12 }, { label: 'Scheduled', value: 1 }],
    items: [
      { name: 'May 2026 Overview', detail: 'Generated on June 1st', status: 'active' },
    ],
  },
  {
    id: 'visitor_trends',
    title: 'Visitor Trends',
    description: 'Historical data analysis identifying patterns and anomalies in visitor behavior.',
    icon: TrendingUp,
    accentColor: '#10b981',
    stats: [{ label: 'Data Points', value: '10K+' }, { label: 'Anomalies', value: 3 }],
    items: [
      { name: 'Q1 Growth Trend', detail: '+12% vs last quarter', status: 'active' },
    ],
  },
  {
    id: 'peak_visit_hours',
    title: 'Peak Visit Hours',
    description: 'Identify busiest hours to optimize staffing and reception resources.',
    icon: Clock,
    accentColor: '#f59e0b',
    stats: [{ label: 'Peak Time', value: '10 AM' }, { label: 'Avg Wait', value: '4m' }],
    items: [
      { name: 'Morning Rush', detail: '09:30 AM - 11:30 AM', status: 'active' },
    ],
  },
  {
    id: 'export_reports',
    title: 'Export Reports',
    description: 'Custom report builder with CSV/PDF export options.',
    icon: Download,
    accentColor: '#6366f1',
    stats: [{ label: 'Exports Today', value: 15 }, { label: 'Failed', value: 0 }],
    items: [
      { name: 'Compliance Export', detail: 'CSV format', status: 'active' },
    ],
  },
];

export default function ReportsOverview({ setActiveTab }) {
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
          Reports & Analytics
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>
          Comprehensive insights, data trends, and customizable exports for your visitor management.
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
