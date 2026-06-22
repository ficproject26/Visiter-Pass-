"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { MapPin, Users, Building2, TrendingUp, MoreVertical, Search, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AllBranches({ setActiveTab }) {
  const { isDark } = useTheme();
  const { employees, visitors, branches = [] } = useData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

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
      id: dbBranch?.id || `BR-00${idx+1}`,
      name: branchName,
      city: dbBranch?.city || branchName.split(' ')[0] || branchName,
      state: dbBranch?.state || '--',
      manager: dbBranch?.manager || '--',
      employees: branchEmployees,
      visitors: branchVisitors,
      status: dbBranch?.status || 'active',
      type: dbBranch?.type || (idx === 0 ? 'Headquarters' : 'Branch')
    };
  });

  const filtered = liveBranches.filter(b => {
    const m = b.name.toLowerCase().includes(search.toLowerCase()) || b.city.toLowerCase().includes(search.toLowerCase());
    const s = filter === 'all' || b.status === filter;
    return m && s;
  });

  const glass = {
    background: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff',
    backdropFilter: 'blur(20px)',
    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)',
    borderRadius: 20,
    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(148,163,184,0.1)',
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
            <motion.div key={branch.id} variants={fadeUpBounce} style={{ ...glass, padding: 24 }}
              whileHover={{ y: -4, boxShadow: isDark ? '0 12px 36px rgba(0,0,0,0.35)' : '0 12px 36px rgba(148,163,184,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, fontWeight: 800 }}>
                    {branch.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{branch.name}</h3>
                    <span style={{ fontSize: 11, background: isDark ? 'rgba(79,70,229,0.15)' : '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{branch.type}</span>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: branch.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: branch.status === 'active' ? '#10b981' : '#f59e0b' }}>
                  {branch.status === 'active' ? '● Active' : '⚠ Maintenance'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>
                <MapPin size={14} /> {branch.city}, {branch.state}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)', paddingTop: 16 }}>
                {[
                  { label: 'Manager', value: branch.manager.split(' ')[0] },
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
    </motion.div>
  );
}
