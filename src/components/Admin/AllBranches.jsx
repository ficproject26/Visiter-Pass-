"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { MapPin, Users, Building2, TrendingUp, MoreVertical, Search, Plus, CheckCircle2, AlertCircle, Edit2, Trash2, X } from 'lucide-react';

const INDIAN_STATES = ['Andhra Pradesh','Delhi','Gujarat','Karnataka','Kerala','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'];

export default function AllBranches({ setActiveTab }) {
  const { isDark } = useTheme();
  const { employees, visitors, branches = [], refreshData } = useData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Edit / Delete Modal states
  const [editingBranch, setEditingBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dynamically compute branches merged with database branches
  const employeeBranches = employees.map(e => e.location);
  const visitorBranches = visitors.map(v => v.branch);
  const allUniqueBranchNames = [...new Set([
    ...branches.map(b => b.name),
    ...employeeBranches,
    ...visitorBranches
  ].filter(Boolean))];

  const liveBranches = allUniqueBranchNames.map((branchName, idx) => {
    const dbBranch = branches.find(b => b.name === branchName);
    const branchEmployees = employees.filter(e => e.location === branchName).length;
    const branchVisitors = visitors.filter(v => v.branch === branchName).length;
    return {
      id: dbBranch?.id || null, // null if it's mock
      mockId: `BR-00${idx+1}`,
      name: branchName,
      city: dbBranch?.city || branchName.split(' ')[0] || branchName,
      state: dbBranch?.state || '',
      address: dbBranch?.address || '',
      pincode: dbBranch?.pincode || '',
      manager: dbBranch?.manager || '',
      phone: dbBranch?.phone || '',
      email: dbBranch?.email || '',
      password: dbBranch?.password || '',
      capacity: dbBranch?.capacity || '',
      employees: branchEmployees,
      visitors: branchVisitors,
      status: dbBranch?.status || 'active',
      type: dbBranch?.type || (idx === 0 ? 'Headquarters' : 'Branch'),
      isDb: !!dbBranch
    };
  });

  const filtered = liveBranches.filter(b => {
    const m = b.name.toLowerCase().includes(search.toLowerCase()) || b.city.toLowerCase().includes(search.toLowerCase());
    const s = filter === 'all' || b.status === filter;
    return m && s;
  });

  const handleEditClick = (branch) => {
    setEditingBranch({ ...branch });
    setError(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (editingBranch.isDb) {
        // PATCH existing branch
        response = await fetch(`/api/branches/${editingBranch.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingBranch)
        });
      } else {
        // POST new branch because it was just a mock branch from employees/visitors data
        response = await fetch('/api/branches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingBranch)
        });
      }

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save branch');
      }

      refreshData();
      setEditingBranch(null);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (branch) => {
    if (!branch.isDb) {
      alert("This is a virtual branch auto-generated from active employees/visitors data. It cannot be deleted from the database.");
      return;
    }
    if (!confirm(`Are you sure you want to delete the branch "${branch.name}"?`)) return;

    try {
      const response = await fetch(`/api/branches/${branch.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete branch');
      }
      refreshData();
    } catch (err) {
      alert(err.message || 'Error deleting branch');
    }
  };

  const glass = {
    background: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff',
    backdropFilter: 'blur(20px)',
    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)',
    borderRadius: 20,
    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(148,163,184,0.1)',
  };

  const modalGlass = {
    background: isDark ? '#1e293b' : '#ffffff',
    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
    borderRadius: 24,
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
    width: '100%',
    maxWidth: 600,
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: 32,
    position: 'relative'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: isDark ? '#64748b' : '#94a3b8',
    display: 'block',
    marginBottom: 6
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* Header + Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>All Branches</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {['all', 'active', 'maintenance'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '7px 16px', borderRadius: 30, border: `2px solid ${filter === s ? '#4f46e5' : 'transparent'}`, background: filter === s ? 'rgba(79,70,229,0.1)' : 'transparent', color: filter === s ? '#4f46e5' : (isDark ? '#94a3b8' : '#64748b'), fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: isDark ? '#64748b' : '#94a3b8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search branches..." style={{ padding: '8px 14px 8px 34px', borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', color: isDark ? '#f8fafc' : '#0f172a', fontSize: 13, outline: 'none', width: 200 }} />
          </div>
          <button onClick={() => setActiveTab && setActiveTab("create_branch")} style={{ padding: '8px 18px', borderRadius: 10, border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <Plus size={16} /> Add Branch
          </button>
        </div>
      </div>

      {/* Branch Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        <AnimatePresence>
          {filtered.map(branch => (
            <motion.div key={branch.id || branch.name} variants={fadeUpBounce} style={{ ...glass, padding: 24, position: 'relative' }}
              whileHover={{ y: -4, boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.35)' : '0 12px 36px rgba(148,163,184,0.2)' }}>
              
              <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 8 }}>
                <button title="Edit Branch" onClick={() => handleEditClick(branch)} style={{ background: 'transparent', border: 'none', color: isDark ? '#64748b' : '#94a3b8', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'} onMouseLeave={(e) => e.currentTarget.style.color = (isDark ? '#64748b' : '#94a3b8')}>
                  <Edit2 size={16} />
                </button>
                {branch.isDb && (
                  <button title="Delete Branch" onClick={() => handleDelete(branch)} style={{ background: 'transparent', border: 'none', color: isDark ? '#64748b' : '#94a3b8', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'} onMouseLeave={(e) => e.currentTarget.style.color = (isDark ? '#64748b' : '#94a3b8')}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingRight: branch.isDb ? 50 : 25 }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 800 }}>
                    {branch.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{branch.name}</h3>
                    <span style={{ fontSize: 11, background: isDark ? 'rgba(79,70,229,0.15)' : '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{branch.type}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: branch.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: branch.status === 'active' ? '#10b981' : '#f59e0b' }}>
                  {branch.status === 'active' ? '● Active' : '⚠ Maintenance'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>
                <MapPin size={14} /> {branch.city || '--'}, {branch.state || '--'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)', paddingTop: 16 }}>
                {[
                  { label: 'Manager', value: branch.manager ? branch.manager.split(' ')[0] : '--' },
                  { label: 'Employees', value: branch.employees },
                  { label: 'Visitors', value: branch.visitors },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 2px', fontSize: 11, color: isDark ? '#64748b' : '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: isDark ? '#e2e8f0' : '#334155' }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Branch Modal */}
      <AnimatePresence>
        {editingBranch && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.5)', 
            backdropFilter: 'blur(8px)', 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'center', 
            zIndex: 1000, 
            padding: '40px 20px', 
            overflowY: 'auto' 
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              style={{ ...modalGlass, margin: 'auto', maxHeight: 'none', overflowY: 'visible' }}
            >
              
              <button onClick={() => setEditingBranch(null)} style={{ position: 'absolute', top: 24, right: 24, background: 'transparent', border: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>

              <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                Edit Branch: {editingBranch.name}
              </h2>
              <p style={{ margin: '0 0 24px', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>
                Update branch configurations and status
              </p>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleUpdate}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  
                  {/* Basic details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Branch Name *</label>
                      <input required value={editingBranch.name} onChange={e => setEditingBranch(prev => ({ ...prev, name: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Branch Type *</label>
                      <select value={editingBranch.type} onChange={e => setEditingBranch(prev => ({ ...prev, type: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                        {['Headquarters', 'Regional Office', 'Branch', 'Satellite Office'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Status selection */}
                  <div>
                    <label style={labelStyle}>Status *</label>
                    <select value={editingBranch.status} onChange={e => setEditingBranch(prev => ({ ...prev, status: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  {/* Address */}
                  <div>
                    <label style={labelStyle}>Street Address *</label>
                    <input required value={editingBranch.address} onChange={e => setEditingBranch(prev => ({ ...prev, address: e.target.value }))} style={inputStyle} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>City *</label>
                      <input required value={editingBranch.city} onChange={e => setEditingBranch(prev => ({ ...prev, city: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>State *</label>
                      <select required value={editingBranch.state} onChange={e => setEditingBranch(prev => ({ ...prev, state: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>PIN Code *</label>
                      <input required value={editingBranch.pincode} onChange={e => setEditingBranch(prev => ({ ...prev, pincode: e.target.value }))} maxLength={6} style={inputStyle} />
                    </div>
                  </div>

                  {/* Manager Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Manager Name *</label>
                      <input required value={editingBranch.manager} onChange={e => setEditingBranch(prev => ({ ...prev, manager: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Phone *</label>
                      <input required value={editingBranch.phone} onChange={e => setEditingBranch(prev => ({ ...prev, phone: e.target.value }))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <input required type="email" value={editingBranch.email} onChange={e => setEditingBranch(prev => ({ ...prev, email: e.target.value }))} style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Manager Password</label>
                      <input type="password" value={editingBranch.password} onChange={e => setEditingBranch(prev => ({ ...prev, password: e.target.value }))} placeholder="Keep empty to remain unchanged" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Max Capacity / Day</label>
                      <input type="number" value={editingBranch.capacity} onChange={e => setEditingBranch(prev => ({ ...prev, capacity: e.target.value }))} style={inputStyle} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                    <button type="button" onClick={() => setEditingBranch(null)} style={{ padding: '10px 20px', borderRadius: 10, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', background: 'transparent', color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>

                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
