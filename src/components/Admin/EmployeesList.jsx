"use client";
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { fadeUpBounce } from "../../utils/animations";
import { useData } from "../../context/DataContext";
import { Loader2, Trash2 } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

export default function EmployeesList({ newEmployee, onAddClick }) {
  const { employees, refreshData } = useData();
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { isDark } = useTheme();
  const [loadingId, setLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // If we needed to add a locally created employee optimistically before the DB updates
  const displayEmployees = newEmployee ? [newEmployee, ...employees] : employees;

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

  // Toggle active ↔ inactive via backend PATCH
  const toggleStatus = async (emp) => {
    const newStatus = emp.status === "active" ? "inactive" : "active";
    setLoadingId(emp.id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${emp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      await refreshData(); // re-fetch employees from DB
    } catch (err) {
      console.error(err);
      alert("Failed to update employee status.");
    } finally {
      setLoadingId(null);
    }
  };

  // Delete employee via backend DELETE
  const deleteEmployee = async (emp) => {
    if (!window.confirm(`Are you sure you want to delete ${emp.name}?`)) return;
    setDeletingId(emp.id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees/${emp.id}`, {
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
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, ID, role, email..."
            className="form-input"
            style={{ paddingLeft: 36 }}
          />
        </div>

        <select
          value={filterDept}
          onChange={e => setFilterDept(e.target.value)}
          className="form-input"
          style={{ width: "auto", minWidth: 160, cursor: "pointer" }}
        >
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="form-input"
          style={{ width: "auto", minWidth: 130, cursor: "pointer" }}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="inactive">Inactive</option>
        </select>

        <span style={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", fontWeight: 600, marginLeft: "auto" }}>
          {filtered.length} employee{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Employees Table */}
      <div className="table-container" style={{ overflowX: "auto" }}>
        <table className="admin-table" style={{ minWidth: 750 }}>
          <thead>
            <tr>
              <th>Employee Profile</th>
              <th>Contact / Email</th>
              <th>Role &amp; Department</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "4rem", textAlign: "center", color: "#94a3b8" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                  <span>No employees found. Click <strong>+ Add Employee</strong> to get started.</span>
                </td>
              </tr>
            ) : (
              filtered.map((emp) => (
                <tr key={emp.id} style={{ cursor: "default" }}>
                  {/* Avatar + name + ID */}
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {emp.photo ? (
                        <img
                          src={emp.photo}
                          alt={emp.name}
                          style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid #e2e8f0" }}
                        />
                      ) : (
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0
                        }}>
                          {(emp.name || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 700, color: isDark ? "#f8fafc" : "#0f172a", fontSize: 13 }}>{emp.name}</div>
                        <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{emp.id}</div>
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

                  {/* Actions */}
                  <td>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
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
    </motion.div>
  );
}
