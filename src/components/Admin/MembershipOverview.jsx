"use client";
import React, { useState } from 'react';
import {  motion } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import {
  Award, Shield, Crown, Diamond, History, RefreshCw,
  ChevronRight, CheckCircle2, XCircle
, ArrowRight } from 'lucide-react';

const sections = [
  {
    id: 'silver_plan',
    title: 'Silver Plan',
    description: 'Basic membership tier for standard recurring visitors.',
    icon: Award,
    accentColor: '#94a3b8',
    stats: [{ label: 'Active', value: 150 }, { label: 'Revenue', value: '₹15K' }],
    items: [
      { name: 'Benefits', detail: 'Standard Entry, Lobby Access', status: 'active' },
      { name: 'Pricing', detail: '₹100/month', status: 'active' },
    ],
  },
  {
    id: 'gold_plan',
    title: 'Gold Plan',
    description: 'Premium membership tier with priority access and extra zones.',
    icon: Shield,
    accentColor: '#facc15',
    stats: [{ label: 'Active', value: 85 }, { label: 'Revenue', value: '₹42K' }],
    items: [
      { name: 'Benefits', detail: 'Priority Entry, Lounge Access', status: 'active' },
      { name: 'Pricing', detail: '₹500/month', status: 'active' },
    ],
  },
  {
    id: 'diamond_plan',
    title: 'Diamond Plan',
    description: 'Elite membership tier for VIPs and executives.',
    icon: Diamond,
    accentColor: '#38bdf8',
    stats: [{ label: 'Active', value: 24 }, { label: 'Revenue', value: '₹24K' }],
    items: [
      { name: 'Benefits', detail: 'All Zones, Valet Parking', status: 'active' },
      { name: 'Pricing', detail: '₹1000/month', status: 'active' },
    ],
  },
  {
    id: 'platinum_plan',
    title: 'Platinum Plan',
    description: 'Highest tier membership with custom bespoke benefits.',
    icon: Crown,
    accentColor: '#a855f7',
    stats: [{ label: 'Active', value: 8 }, { label: 'Revenue', value: '₹16K' }],
    items: [
      { name: 'Benefits', detail: '24/7 Access, Dedicated Host', status: 'active' },
      { name: 'Pricing', detail: '₹2000/month', status: 'active' },
    ],
  },
  {
    id: 'subscription_history',
    title: 'Subscription History',
    description: 'Ledger of all past and present membership payments and upgrades.',
    icon: History,
    accentColor: '#10b981',
    stats: [{ label: 'Transactions', value: '1.2K' }, { label: 'Refunds', value: 2 }],
    items: [
      { name: 'Recent Payment', detail: 'Rahul V. - Gold Plan (Success)', status: 'active' },
      { name: 'Failed Payment', detail: 'Anita D. - Silver Plan (Card Error)', status: 'failed' },
    ],
  },
  {
    id: 'renewal_management',
    title: 'Renewal Management',
    description: 'Automated billing, expiration alerts, and grace period settings.',
    icon: RefreshCw,
    accentColor: '#f97316',
    stats: [{ label: 'Due Soon', value: 18 }, { label: 'Auto-Renew', value: '85%' }],
    items: [
      { name: 'Expiration Alerts', detail: 'Sent 3 days prior', status: 'active' },
      { name: 'Grace Period', detail: '5 days active', status: 'active' },
    ],
  },
];

export default function MembershipOverview({ setActiveTab }) {
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
          Membership Management
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>
          Manage tiered visitor plans, track subscriptions, and automate renewals.
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
