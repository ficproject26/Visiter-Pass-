"use client";
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { fadeUpBounce } from "../../utils/animations";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { Loader2, Trash2, Edit3, Key, X, Check } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

export default function EmployeesList({ newEmployee, onAddClick }) {
  const { employees, refreshData } = useData();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { isDark } = useTheme();
  const [loadingId, setLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Edit Modal State
  const [editingEmp, setEditingEmp] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    location: '',
    password: ''
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const rawEmployees = newEmployee ? [newEmployee, ...employees] : employees;

  const displayEmployees = user?.role === 'subadmin' && user?.branch
    ? rawEmployees.filter(e => (e.location || '').toLowerCase() === user.branch.toLowerCase())
    : rawEmployees;

  const departments = [...new Set(displayEmployees.map(e => e.department))].filter(Boolean);

  const filtered = displayEmployees.filter(e => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (e.name || "").toLowerCase().includes(q) ||
      (e.id || "").toLowerCase().includes(q) ||
      (e.role || "").toLowerCase().includes(q) ||
      (e.email || "").toLowerCase().includes(q);
    const matchDept = filterDept === "all" || e.department === filterDept;
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    return matchSearch && matchDept && matchStatus;
  });

  const toggleStatus = async (emp) => {
    const newStatus = emp.status === "active" ? "inactive" : "active";
    const targetId = emp.empId || emp.id;
    setLoadingId(emp.id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await refreshData();
    } catch (err) {
      console.error(err);
      alert("Failed to update employee status.");
    } finally {
      setLoadingId(null);
    }
  };

  const deleteEmployee = async (emp) => {
    if (!window.confirm(`Are you sure you want to delete ${emp.name}?`)) return;
    const targetId = emp.empId || emp.id;
    setDeletingId(emp.id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${targetId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete employee");
      await refreshData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee.");
    } finally {
      setDeletingId(null);
    }
  };

  const openEditModal = (emp) => {
    setEditingEmp(emp);
    setEditForm({
      name: emp.name || '',
      email: emp.email || '',
      role: emp.role || '',
      department: emp.department || '',
      location: emp.location || '',
      password: emp.password || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingEmp) return;
    setSavingEdit(true);
    const targetId = editingEmp.empId || editingEmp.id;

    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Failed to update employee details");

      // Also trigger password change endpoint if email or password was edited
      if (editForm.email && editForm.password) {
        await fetch(`${API_BASE_URL}/api/auth/change-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: editForm.email,
            newPassword: editForm.password
          })
        }).catch(() => null);
      }

      await refreshData();
      setEditingEmp(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update employee details.");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <motion.div variants={fadeUpBounce} initial="hidden" animate="visible" style={{ transitionDelay: "100ms" }}>
      {/* Filter controls bar */}
      <div
        style={{
          background: isDark ? "#111827" : "#FFFFFF",
          borderRadius: 16,
          border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(15,23,42,0.1)",
          padding: "1rem 1.25rem",
          marginBottom: "1.25rem",
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔍</span>
          <input
            type="text"
            placeholder="Search employee by name, ID, role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
            style={{ paddingLeft: 36, width: "100%", height: 38 }}
          />
        </div>

        <select
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
          className="search-input"
          style={{ width: "auto", height: 38 }}
        >
          <option value="all">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="search-input"
          style={{ width: "auto", height: 38 }}
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>

        {onAddClick && (
          <button
            onClick={onAddClick}
            className="btn btn-primary"
            style={{ marginLeft: "auto", padding: "8px 16px", borderRadius: 10, fontWeight: 700, fontSize: 13 }}
          >
            + Add Employee
          </button>
        )}
      </div>

      {/* Employees Data Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Employee Profile</th>
              <th>Contact / Email</th>
              <th>Role & Department</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "#94a3b8" }}>
                  No employees found matching the filters.
                </td>
              </tr>
            ) : (
              filtered.map(emp => (
                <tr key={emp.id}>
                  {/* Profile & Name */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        {emp.name ? emp.name.charAt(0).toUpperCase() : "E"}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: isDark ? "#f8fafc" : "#0f172a", fontSize: 13 }}>{emp.name}</div>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{emp.empId || emp.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ fontSize: 13, color: isDark ? "#cbd5e1" : "#475569" }}>
                    {emp.email || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>No email</span>}
                  </td>

                  {/* Role and Department */}
                  <td>
                    <div style={{ fontWeight: 600, color: isDark ? "#e2e8f0" : "#334155", fontSize: 13 }}>{emp.role}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{emp.department}</div>
                  </td>

                  {/* Branch/Location */}
                  <td style={{ fontSize: 13, fontWeight: 500, color: isDark ? "#cbd5e1" : "#475569" }}>
                    {emp.location}
                  </td>

                  {/* Status badge */}
                  <td>
                    <span style={{
                      background:
                        emp.status === "active" ? "#dcfce7" :
                        emp.status === "on_leave" ? "#fef9c3" : "#f1f5f9",
                      color:
                        emp.status === "active" ? "#15803d" :
                        emp.status === "on_leave" ? "#a16207" : "#475569",
                      borderRadius: 20,
                      padding: "4px 12px",
                      fontSize: 11,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      textTransform: "capitalize"
                    }}>
                      {(emp.status || "unknown").replace("_", " ")}
                    </span>
                  </td>

                  {/* Actions Column with Edit & Change Password */}
                  <td>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <button
                        onClick={() => openEditModal(emp)}
                        className="btn btn-secondary"
                        title="Edit Details & Password"
                        style={{ padding: "4px 10px", fontSize: 11, borderRadius: 6, display: "flex", alignItems: "center", gap: 4, background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", fontWeight: 700 }}
                      >
                        <Edit3 size={13} /> Edit / Pass
                      </button>

                      <button
                        onClick={() => toggleStatus(emp)}
                        disabled={loadingId === emp.id}
                        className={`btn ${emp.status === "active" ? "btn-danger" : "btn-success"}`}
                        style={{ padding: "4px 10px", fontSize: 11, borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}
                      >
                        {loadingId === emp.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : (emp.status === "active" ? "Deactivate" : "Activate")}
                      </button>

                      <button
                        onClick={() => deleteEmployee(emp)}
                        disabled={deletingId === emp.id}
                        className="btn btn-danger"
                        title="Delete Account"
                        style={{ padding: "4px 8px", fontSize: 11, borderRadius: 6, background: "transparent", color: "#ef4444", border: "1px solid #fecaca", display: "flex", alignItems: "center" }}
                      >
                        {deletingId === emp.id
                          ? <Loader2 size={12} className="animate-spin" />
                          : <Trash2 size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Employee & Password Modal */}
      {editingEmp && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "1rem",
            backdropFilter: "blur(4px)"
          }}
          onClick={() => setEditingEmp(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 20,
              width: "100%",
              maxWidth: 480,
              overflow: "hidden",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
            }}
            onClick={e => e.stopPropagation()}
            className="animate-scale-up"
          >
            <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Edit3 size={18} />
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Edit Account & Password</h3>
              </div>
              <button onClick={() => setEditingEmp(null)} style={{ background: "transparent", border: 0, color: "#94a3b8", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="search-input"
                  style={{ width: "100%" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="search-input"
                  style={{ width: "100%" }}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Role</label>
                  <input
                    type="text"
                    value={editForm.role}
                    onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                    className="search-input"
                    style={{ width: "100%" }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Department</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                    className="search-input"
                    style={{ width: "100%" }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 4 }}>Location / Branch</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                  className="search-input"
                  style={{ width: "100%" }}
                  required
                />
              </div>

              <div style={{ background: "#f8fafc", padding: 12, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#4f46e5", marginBottom: 6 }}>
                  <Key size={14} /> Password (Change Password)
                </label>
                <input
                  type="text"
                  value={editForm.password}
                  onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Enter new password"
                  className="search-input"
                  style={{ width: "100%", background: "white" }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setEditingEmp(null)}
                  className="btn btn-secondary"
                  style={{ padding: "8px 16px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="btn btn-primary"
                  style={{ padding: "8px 18px", display: "flex", alignItems: "center", gap: 6, background: "#4f46e5" }}
                >
                  {savingEdit ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
