"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Building2, MapPin, User, Phone, Globe, CheckCircle2, AlertCircle } from 'lucide-react';

const INDIAN_STATES = ['Andhra Pradesh','Delhi','Gujarat','Karnataka','Kerala','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

export default function CreateBranch() {
  const { isDark } = useTheme();
  const { refreshData } = useData();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'Branch', address: '', city: '', state: '', pincode: '', manager: '', phone: '', email: '', password: '', capacity: '' });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create branch');
      }
      refreshData();
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const glass = { background: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff', backdropFilter: 'blur(20px)', border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)', borderRadius: 20, boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(148,163,184,0.1)' };
  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 12, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', color: isDark ? '#f8fafc' : '#0f172a', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: isDark ? '#64748b' : '#94a3b8', display: 'block', marginBottom: 8 };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Create New Branch</h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>Register a new office location within the Forge India Connect network</p>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: 14, fontWeight: 600 }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {submitted ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ ...glass, padding: 60, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#10b981' }}><CheckCircle2 size={36} /></div>
          <h3 style={{ color: isDark ? '#f8fafc' : '#0f172a', fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>Branch Created Successfully!</h3>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: 15 }}>"{form.name || 'New Branch'}" has been added to the system.</p>
          <button onClick={() => { setSubmitted(false); setForm({ name: '', type: 'Branch', address: '', city: '', state: '', pincode: '', manager: '', phone: '', email: '', password: '', capacity: '' }); }} style={{ marginTop: 24, padding: '11px 28px', borderRadius: 12, border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Create Another</button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Section: Basic Info */}
            <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <Building2 size={20} color="#4f46e5" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>Branch Information</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
                <div><label style={labelStyle}>Branch Name *</label><input required value={form.name} onChange={set('name')} placeholder="e.g. Chennai HQ" style={inputStyle} /></div>
                <div>
                  <label style={labelStyle}>Branch Type *</label>
                  <select value={form.type} onChange={set('type')} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {['Headquarters', 'Regional Office', 'Branch', 'Satellite Office'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Section: Address */}
            <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <MapPin size={20} color="#4f46e5" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>Address Details</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div><label style={labelStyle}>Street Address *</label><input required value={form.address} onChange={set('address')} placeholder="Building, Street, Area" style={inputStyle} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                  <div><label style={labelStyle}>City *</label><input required value={form.city} onChange={set('city')} placeholder="City" style={inputStyle} /></div>
                  <div>
                    <label style={labelStyle}>State *</label>
                    <select required value={form.state} onChange={set('state')} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div><label style={labelStyle}>PIN Code *</label><input required value={form.pincode} onChange={set('pincode')} placeholder="600001" maxLength={6} style={inputStyle} /></div>
                </div>
              </div>
            </motion.div>

            {/* Section: Manager */}
            <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <User size={20} color="#4f46e5" />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>Branch Manager Details</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <div><label style={labelStyle}>Manager Name *</label><input required value={form.manager} onChange={set('manager')} placeholder="Full Name" style={inputStyle} /></div>
                <div><label style={labelStyle}>Phone *</label><input required value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" style={inputStyle} /></div>
                <div><label style={labelStyle}>Email *</label><input required type="email" value={form.email} onChange={set('email')} placeholder="manager@forgeindia.com" style={inputStyle} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
                <div><label style={labelStyle}>Manager Password *</label><input required type="password" value={form.password} onChange={set('password')} placeholder="Password" style={inputStyle} /></div>
                <div>
                  <label style={labelStyle}>Max Visitor Capacity / Day</label>
                  <input type="number" value={form.capacity} onChange={set('capacity')} placeholder="e.g. 100" style={inputStyle} />
                </div>
              </div>
            </motion.div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: 14 }}>
              <button type="submit" disabled={loading} style={{ padding: '13px 36px', borderRadius: 14, border: 'none', background: loading ? '#64748b' : 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 16px rgba(79,70,229,0.4)' }}>
                {loading ? 'Creating...' : 'Create Branch'}
              </button>
              <button type="button" disabled={loading} onClick={() => setForm({ name: '', type: 'Branch', address: '', city: '', state: '', pincode: '', manager: '', phone: '', email: '', password: '', capacity: '' })} style={{ padding: '13px 28px', borderRadius: 14, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', background: 'transparent', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer' }}>
                Reset
              </button>
            </div>
          </div>
        </form>
      )}
    </motion.div>
  );
}
