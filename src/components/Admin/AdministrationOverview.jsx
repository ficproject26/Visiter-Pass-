"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  Users, Lock, ShieldAlert, Activity, ClipboardList,
  ArrowRight, ArrowLeft, Plus, CheckCircle2, XCircle, Search, Shield, Key, Laptop, RefreshCw
} from 'lucide-react';

export default function AdministrationOverview({ setActiveTab, onAddEmployeeClick }) {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { employees = [], branches = [], visitors = [] } = useData();
  const [selectedSection, setSelectedSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Live Login Sessions reading real authentication logs
  const liveLoginSessions = useMemo(() => {
    let recordedHistory = [];
    try {
      recordedHistory = JSON.parse(localStorage.getItem('vos_login_history') || '[]');
    } catch(e) {}

    const list = [];
    const addedEmails = new Set();

    // 1. First add real recorded sessions from localStorage
    recordedHistory.forEach(sess => {
      list.push(sess);
      addedEmails.add(sess.user);
    });

    // 2. If current user is logged in and not in history yet
    if (user && !addedEmails.has(user.email)) {
      list.unshift({
        user: user.email || 'admin@visitoros.com',
        name: user.name || 'Current User',
        device: 'Chrome / Local Session',
        location: user.branch && user.branch !== 'all' ? `${user.branch} Branch` : 'Admin Portal / HQ',
        time: 'Active Now',
        status: 'Online'
      });
      addedEmails.add(user.email);
    }

    // 3. For created DB branches who haven't logged in yet
    branches.forEach((b) => {
      const branchEmail = b.email || `subadmin_${b.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@visitoros.com`;
      if (!addedEmails.has(branchEmail)) {
        list.push({
          user: branchEmail,
          name: b.manager || `${b.name} Manager`,
          device: 'No active session',
          location: `${b.name} Branch`,
          time: 'Never logged in',
          status: 'Offline'
        });
        addedEmails.add(branchEmail);
      }
    });

    // 4. For DB employees who haven't logged in yet
    employees.forEach((emp) => {
      const empEmail = emp.email || `emp_${emp.id}@company.com`;
      if (!addedEmails.has(empEmail)) {
        list.push({
          user: empEmail,
          name: emp.name,
          device: 'No active session',
          location: emp.location || emp.department || 'Main Office',
          time: 'Never logged in',
          status: 'Offline'
        });
        addedEmails.add(empEmail);
      }
    });

    return list;
  }, [user, branches, employees]);

  // Local state for interactive RBAC & Access Control
  const [rolesList, setRolesList] = useState([
    { role: 'Super Admin', desc: 'Full system control & root access', usersCount: 1, permissions: { viewVisitors: true, approvePasses: true, manageBranches: true, manageEmployees: true, exportReports: true, configSecurity: true } },
    { role: 'Sub Admin', desc: 'Branch-level management access', usersCount: branches.length || 2, permissions: { viewVisitors: true, approvePasses: true, manageBranches: false, manageEmployees: true, exportReports: true, configSecurity: false } },
    { role: 'HR Manager', desc: 'Employee onboarding & visitor approvals', usersCount: employees.filter(e => e.department?.toLowerCase() === 'hr').length || 3, permissions: { viewVisitors: true, approvePasses: true, manageBranches: false, manageEmployees: true, exportReports: true, configSecurity: false } },
    { role: 'Security Guard', desc: 'Gate check-in / check-out scanner access', usersCount: 4, permissions: { viewVisitors: true, approvePasses: true, manageBranches: false, manageEmployees: false, exportReports: false, configSecurity: false } },
    { role: 'Receptionist', desc: 'Visitor registration & pass printing', usersCount: 5, permissions: { viewVisitors: true, approvePasses: false, manageBranches: false, manageEmployees: false, exportReports: false, configSecurity: false } },
  ]);

  const [accessZones, setAccessZones] = useState([
    { id: 1, name: 'Zone A – Executive Suite', type: 'RFID + Biometric', branch: 'Chennai HQ', status: 'Restricted', active: true },
    { id: 2, name: 'Zone B – Server Data Center', type: 'Biometric Scanner Only', branch: 'Bangalore', status: 'High Security', active: true },
    { id: 3, name: 'Zone C – HR & Payroll Vault', type: 'Badge Access', branch: 'Chennai HQ', status: 'Restricted', active: true },
    { id: 4, name: 'Zone D – Main Assembly Hall', type: 'Visitor Pass QR', branch: 'All Branches', status: 'General Access', active: true },
    { id: 5, name: 'Zone E – R&D Laboratory', type: 'PIN + Keycard', branch: 'Hyderabad', status: 'High Security', active: true },
  ]);

  const glass = {
    background: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff',
    backdropFilter: 'blur(20px)',
    border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.05)',
    borderRadius: 20,
    boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.25)' : '0 4px 24px rgba(148,163,184,0.1)',
  };

  // Live computations
  const subAdminList = useMemo(() => {
    const fromEmp = employees.filter(e => 
      (e.department || '').toLowerCase().includes('admin') || 
      (e.role || '').toLowerCase().includes('admin') ||
      (e.role || '').toLowerCase().includes('manager')
    );
    if (fromEmp.length > 0) return fromEmp;
    return [
      { id: 'SA-01', name: 'Super Admin', email: 'superadmin@visitoros.com', role: 'Super Administrator', location: 'All Branches', status: 'Active' },
      { id: 'SA-02', name: 'Bangalore Admin', email: 'subadmin@visitoros.com', role: 'Branch Sub Admin', location: 'Bangalore', status: 'Active' },
      { id: 'SA-03', name: 'Chennai Admin', email: 'subadmin_chennai@visitoros.com', role: 'Branch Sub Admin', location: 'Chennai', status: 'Active' }
    ];
  }, [employees]);

  const auditLogList = useMemo(() => {
    const logs = [];

    // 1. Live visitor audit events
    visitors.forEach((v, i) => {
      logs.push({
        id: `LOG-${1000 + i}`,
        timestamp: v.createdAt ? new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (v.visitDate || 'Today'),
        event: v.approvalStatus === 'APPROVED' ? 'Pass Approved' : v.status === 'checked-in' ? 'Check-In' : 'Entry Requested',
        user: v.fullName,
        detail: `${v.purpose || 'Visit'} at ${v.branch || 'Main Branch'}`,
        status: v.approvalStatus === 'APPROVED' ? 'Success' : 'Pending'
      });
    });

    // 2. Live authentication audit events
    try {
      const loginHistory = JSON.parse(localStorage.getItem('vos_login_history') || '[]');
      loginHistory.forEach((sess, idx) => {
        logs.push({
          id: sess.id || `LOG-AUTH-${idx}`,
          timestamp: sess.time || 'Recently',
          event: 'User Authentication',
          user: sess.user,
          detail: `Logged in via ${sess.device} (${sess.location})`,
          status: 'Success'
        });
      });
    } catch(e) {}

    return logs;
  }, [visitors]);

  const togglePermission = (roleIndex, permKey) => {
    setRolesList(prev => prev.map((r, idx) => {
      if (idx === roleIndex) {
        return {
          ...r,
          permissions: { ...r.permissions, [permKey]: !r.permissions[permKey] }
        };
      }
      return r;
    }));
  };

  const toggleZoneStatus = (id) => {
    setAccessZones(prev => prev.map(z => z.id === id ? { ...z, active: !z.active } : z));
  };

  const sections = [
    {
      id: 'sub_admins',
      title: 'Sub Admins',
      description: 'Manage branch-level admin accounts and their access privileges across all locations.',
      icon: Users,
      accentColor: '#4f46e5',
      stats: [{ label: 'Total Admins', value: subAdminList.length }, { label: 'Active', value: subAdminList.length }, { label: 'Branches', value: branches.length || 1 }]
    },
    {
      id: 'roles_permissions',
      title: 'Roles & Permissions',
      description: 'Define role-based access rules controlling what each user type can see and do.',
      icon: Lock,
      accentColor: '#7c3aed',
      stats: [{ label: 'Roles', value: rolesList.length }, { label: 'Permissions', value: 6 }, { label: 'Active Rules', value: 12 }]
    },
    {
      id: 'login_activity',
      title: 'Login Activity',
      description: 'Monitor all login sessions, detect anomalies, and audit authentication events.',
      icon: Activity,
      accentColor: '#0284c7',
      stats: [{ label: 'Active Today', value: subAdminList.length + 2 }, { label: 'Failed Attempts', value: 0 }, { label: 'Active Now', value: 1 }]
    },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header with optional Back button */}
      <motion.div variants={fadeUpBounce} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {selectedSection && (
              <button
                onClick={() => setSelectedSection(null)}
                style={{ padding: '8px 14px', borderRadius: 10, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1', background: 'transparent', color: isDark ? '#f8fafc' : '#0f172a', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <ArrowLeft size={16} /> Back to Overview
              </button>
            )}
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
              {selectedSection ? sections.find(s => s.id === selectedSection)?.title : 'Administration'}
            </h2>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>
            {selectedSection ? sections.find(s => s.id === selectedSection)?.description : 'Manage sub-admins, roles, access zones, login sessions, and audit trails — live in real-time.'}
          </p>
        </div>
      </motion.div>

      {/* ────────────────── OVERVIEW CARDS (WHEN NO DETAIL SECTION SELECTED) ────────────────── */}
      {!selectedSection ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                variants={fadeUpBounce}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => setSelectedSection(section.id)}
                style={{ ...glass, display: 'flex', flexDirection: 'column', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
              >
                <div style={{ height: 4, width: '100%', background: section.accentColor }} />
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: isDark ? (section.accentColor + '20') : (section.accentColor + '15'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: section.accentColor }}>
                      <Icon size={26} strokeWidth={2.5} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                      {section.title}
                    </h3>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.5, flexGrow: 1 }}>
                    {section.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', gap: 14 }}>
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
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: section.accentColor }}>
                      <ArrowRight size={16} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* ────────────────── INTERACTIVE DETAIL VIEWS ────────────────── */
        <motion.div variants={fadeUpBounce} style={{ ...glass, padding: 28 }}>

          {/* 1. SUB ADMINS DETAIL VIEW */}
          {selectedSection === 'sub_admins' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Active Sub-Admin Accounts</h3>
                <button
                  onClick={() => onAddEmployeeClick?.()}
                  style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <Plus size={16} /> Add Sub Admin
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      {['Admin Name', 'Email', 'Role', 'Assigned Branch', 'Status'].map(th => (
                        <th key={th}>{th}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subAdminList.map((sa, idx) => (
                      <tr key={sa.id || idx}>
                        <td style={{ fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{sa.name}</td>
                        <td style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{sa.email}</td>
                        <td><span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(79,70,229,0.15)', color: '#4f46e5' }}>{sa.role || sa.department || 'Sub Admin'}</span></td>
                        <td style={{ color: isDark ? '#e2e8f0' : '#334155', fontWeight: 600 }}>{sa.location || sa.branch || 'All Branches'}</td>
                        <td>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                            ● Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. ROLES & PERMISSIONS DETAIL VIEW */}
          {selectedSection === 'roles_permissions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Role-Based Access Control (RBAC) Matrix</h3>
                <span style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>Toggle checkboxes to modify live permissions</span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>System Role</th>
                      <th>Description</th>
                      <th>View Visitors</th>
                      <th>Approve Passes</th>
                      <th>Manage Branches</th>
                      <th>Manage Staff</th>
                      <th>Export Reports</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rolesList.map((r, rIdx) => (
                      <tr key={r.role}>
                        <td style={{ fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>{r.role}</td>
                        <td style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>{r.desc}</td>
                        {['viewVisitors', 'approvePasses', 'manageBranches', 'manageEmployees', 'exportReports'].map(pKey => (
                          <td key={pKey} style={{ textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={r.permissions[pKey]}
                              onChange={() => togglePermission(rIdx, pKey)}
                              style={{ width: 16, height: 16, accentColor: '#4f46e5', cursor: 'pointer' }}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}



          {/* 4. LOGIN ACTIVITY DETAIL VIEW */}
          {selectedSection === 'login_activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>Real-Time Authentication & Session Logs</h3>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      {['User Account', 'Session Device / IP', 'Location', 'Login Time', 'Status'].map(th => (
                        <th key={th}>{th}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {liveLoginSessions.map((session, sIdx) => (
                      <tr key={sIdx}>
                        <td style={{ fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
                          <div>{session.name}</div>
                          <div style={{ fontSize: 11, fontWeight: 500, color: isDark ? '#94a3b8' : '#64748b' }}>{session.user}</div>
                        </td>
                        <td style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>{session.device}</td>
                        <td style={{ color: isDark ? '#e2e8f0' : '#334155' }}>{session.location}</td>
                        <td style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>{session.time}</td>
                        <td>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                            background: session.status === 'Online' || session.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)',
                            color: session.status === 'Online' || session.status === 'Active' ? '#10b981' : '#94a3b8'
                          }}>
                            ● {session.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* End of detail views */}

        </motion.div>
      )}

    </motion.div>
  );
}
