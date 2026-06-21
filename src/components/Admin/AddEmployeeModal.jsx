"use client";
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { DEPARTMENTS, BRANCHES, DEPARTMENT_ROLES } from "../../constants/visitorConstants";
import { Loader2, UserPlus, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

export default function AddEmployeeModal({ onClose, onAdd }) {
  const { isDark } = useTheme();
  const initialDept = DEPARTMENTS[0] || "Engineering";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: initialDept,
    role: DEPARTMENT_ROLES[initialDept]?.[0] || "",
    location: BRANCHES[0] || "Bangalore HQ",
    status: "active"
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === "department") {
        newData.role = DEPARTMENT_ROLES[value]?.[0] || "";
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const newEmp = {
      id: `EMP-${Date.now().toString().slice(-6)}`,
      photo: null,
      ...formData
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/employees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmp)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save employee");
      }

      const savedEmp = await response.json();
      setSuccess(true);

      // Show success for 1.2s then close
      setTimeout(() => {
        onAdd(savedEmp);
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to connect to the backend database.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #e2e8f0",
    background: isDark ? "rgba(255,255,255,0.05)" : "#f8fafc",
    color: isDark ? "#f8fafc" : "#0f172a",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box"
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 700,
    color: isDark ? "#94a3b8" : "#64748b",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.4px"
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.25rem",
      backgroundColor: "rgba(8, 14, 31, 0.75)",
      backdropFilter: "blur(8px)"
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{
          background: isDark ? "#0f172a" : "#ffffff",
          width: "100%",
          maxWidth: 560,
          borderRadius: 24,
          border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "22px 28px 18px",
          borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #f1f5f9",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: isDark ? "rgba(79,70,229,0.08)" : "linear-gradient(135deg, #ede9fe, #f0f9ff)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <UserPlus size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? "#f8fafc" : "#0f172a" }}>
                Add New Employee
              </h2>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>
                All fields required. Employee can log in with email + password.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: isDark ? "rgba(255,255,255,0.05)" : "#fff",
              border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
              borderRadius: 10, width: 34, height: 34,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: isDark ? "#94a3b8" : "#64748b",
              fontSize: 18, fontWeight: 700
            }}
          >
            ×
          </button>
        </div>

        {/* Success State */}
        {success ? (
          <div style={{
            padding: "48px 28px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
            textAlign: "center"
          }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              <CheckCircle2 size={64} color="#10b981" />
            </motion.div>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: isDark ? "#f8fafc" : "#0f172a" }}>
              Employee Added! 🎉
            </h3>
            <p style={{ margin: 0, fontSize: 14, color: isDark ? "#94a3b8" : "#64748b" }}>
              <strong>{formData.name}</strong> has been saved to the database successfully.
            </p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Full Name */}
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Arjun Mehta"
                style={inputStyle}
              />
            </div>

            {/* Email + Password */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="arjun@company.com"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Password *</label>
                <div style={{ position: "relative" }}>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: isDark ? "#64748b" : "#94a3b8", padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Department + Role */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Department *</label>
                <select name="department" value={formData.department} onChange={handleChange} style={inputStyle}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Role *</label>
                <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
                  {(DEPARTMENT_ROLES[formData.department] || []).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location + Status */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={labelStyle}>Branch / Location *</label>
                <select name="location" value={formData.location} onChange={handleChange} style={inputStyle}>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                  <option value="active">Active</option>
                  <option value="on_leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: "10px 14px", borderRadius: 10,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#ef4444", fontSize: 13, fontWeight: 600
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Info note */}
            <div style={{
              padding: "10px 14px", borderRadius: 10,
              background: isDark ? "rgba(79,70,229,0.08)" : "#eff6ff",
              border: isDark ? "1px solid rgba(79,70,229,0.2)" : "1px solid #dbeafe",
              color: isDark ? "#a5b4fc" : "#3b82f6", fontSize: 12, fontWeight: 600
            }}>
              💡 Employee will be able to log in using their email &amp; password at the Login page.
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 4 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontWeight: 600,
                  background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
                  color: isDark ? "#94a3b8" : "#475569", fontSize: 14
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "10px 24px", borderRadius: 10, border: "none",
                  background: loading ? "rgba(79,70,229,0.5)" : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  color: "#fff", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  fontSize: 14, display: "flex", alignItems: "center", gap: 8,
                  boxShadow: loading ? "none" : "0 4px 14px rgba(79,70,229,0.35)"
                }}
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Saving...</>
                ) : (
                  <><UserPlus size={16} /> Add Employee</>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
