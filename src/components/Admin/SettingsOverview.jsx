"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  Building, Palette, Palette as ThemeIcon, ShieldAlert, Mail, Bell,
  Key, ArrowRight, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';

const sections = [
  {
    id: 'company_settings',
    title: 'Company Settings',
    description: 'Manage core organizational details, locations, and global preferences.',
    icon: Building,
    accentColor: '#3b82f6',
    stats: [{ label: 'Details', value: '100%' }, { label: 'Locations', value: 4 }],
  },
  {
    id: 'branding_logo',
    title: 'Branding & Logo',
    description: 'Customize visitor passes, emails, and kiosks with your brand identity.',
    icon: Palette,
    accentColor: '#8b5cf6',
    stats: [{ label: 'Assets', value: 12 }, { label: 'Guidelines', value: 1 }],
  },
  {
    id: 'theme_settings',
    title: 'Theme Settings',
    description: 'Toggle dark mode, UI colors, and reception kiosk styling.',
    icon: ThemeIcon,
    accentColor: '#10b981',
    stats: [{ label: 'Active Theme', value: 'Dark' }, { label: 'Palettes', value: 3 }],
  },
  {
    id: 'security_settings',
    title: 'Security Settings',
    description: 'Manage password policies, 2FA, session timeouts, and IP whitelisting.',
    icon: ShieldAlert,
    accentColor: '#ef4444',
    stats: [{ label: '2FA', value: 'Enforced' }, { label: 'Policies', value: 5 }],
  },
];

export default function SettingsOverview({ setActiveTab }) {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const [email, setEmail] = useState(user?.email || 'superadmin@visitoros.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('Network error: Could not reach backend server.');
    } finally {
      setLoading(false);
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

      <motion.div variants={fadeUpBounce}>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
          Settings & Security
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>
          Change account passwords, configure global security policies, branding, and system preferences.
        </p>
      </motion.div>

      {/* Change Password Card */}
      <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Key size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
              Change Admin / Account Password
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>
              Update credentials for <strong>{email}</strong> directly in the database.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569', marginBottom: 6 }}>
              Target Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. superadmin@visitoros.com"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                background: isDark ? '#0f172a' : '#f8fafc',
                color: isDark ? '#f8fafc' : '#0f172a',
                fontSize: 14
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569', marginBottom: 6 }}>
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                background: isDark ? '#0f172a' : '#f8fafc',
                color: isDark ? '#f8fafc' : '#0f172a',
                fontSize: 14
              }}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px 20px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: 14,
                border: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Update Password</span>}
            </button>
          </div>
        </form>

        {message && (
          <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={18} /> {message}
          </div>
        )}

        {error && (
          <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}
      </motion.div>

      {/* Grid of Sections */}
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
              <div style={{ height: 4, width: '100%', background: section.accentColor }} />
              
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
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

                <p style={{ 
                  margin: 0, fontSize: 14, color: isDark ? '#94a3b8' : '#64748b', 
                  lineHeight: 1.5, flexGrow: 1 
                }}>
                  {section.description}
                </p>

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
