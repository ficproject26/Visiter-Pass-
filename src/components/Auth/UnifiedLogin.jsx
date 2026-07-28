"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, ShieldCheck, ShieldAlert, Users, Key } from "lucide-react";

export default function UnifiedLogin({ initialRole = 'admin', hideTabs = false }) {
  const [roleMode, setRoleMode] = useState(initialRole); // admin, security, staff, visitor
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, logout } = useAuth();
  const router = useRouter();

  // Clear any old/stale auth session whenever entering a login portal page
  useEffect(() => {
    logout();
    setError("");
  }, [roleMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      
      // Enforce Strict Portal Access Control
      if (roleMode === 'admin' && user.role !== 'admin' && user.role !== 'subadmin') {
        logout();
        throw new Error(`Access Denied: ${user.role ? user.role.toUpperCase() : 'Non-admin'} credentials cannot be used to log into Super Admin Portal.`);
      }

      if (roleMode === 'security' && user.role !== 'security' && user.role !== 'admin' && user.role !== 'subadmin') {
        logout();
        throw new Error("Access Denied: Only Security personnel can log into Security Desk Portal.");
      }

      if (roleMode === 'staff' && user.role !== 'hr' && user.role !== 'employee' && user.role !== 'staff' && user.role !== 'admin' && user.role !== 'subadmin') {
        logout();
        throw new Error("Access Denied: You do not have access to the Staff Portal.");
      }

      // Successful portal authorization -> Redirect to respective dashboard
      if (user.role === 'admin' || user.role === 'subadmin') {
        router.push("/admin-dashboard");
      } else if (user.role === 'security' || user.role === 'gate' || user.role === 'guard') {
        router.push("/security-dashboard");
      } else if (user.role === 'hr' || user.role === 'employee' || user.role === 'staff') {
        router.push("/staff-dashboard");
      } else if (user.role === 'visitor') {
        router.push("/visitor-dashboard");
      } else {
        router.push("/admin-dashboard");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const portalMeta = {
    admin: {
      title: "Super Admin Portal",
      subtitle: "Sign in to manage branches, employees, and organization settings",
      badgeBg: "rgba(79, 70, 229, 0.1)",
      badgeColor: "#4f46e5",
      icon: ShieldCheck,
      placeholder: "Enter admin email..."
    },
    security: {
      title: "Security Desk Portal",
      subtitle: "Sign in for gate verification, visitor check-in, and scanner logs",
      badgeBg: "rgba(16, 185, 129, 0.1)",
      badgeColor: "#10b981",
      icon: ShieldAlert,
      placeholder: "Enter security email..."
    },
    staff: {
      title: "Staff & Employee Portal",
      subtitle: "Sign in to view meeting requests and host appointments",
      badgeBg: "rgba(245, 158, 11, 0.1)",
      badgeColor: "#f59e0b",
      icon: Users,
      placeholder: "Enter staff email..."
    }
  };

  const meta = portalMeta[roleMode] || portalMeta.admin;
  const ModeIcon = meta.icon;

  return (
    <div
      className="min-h-screen flex flex-col font-sans relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
      }}
    >
      {/* Centered Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-[16px]">
        <div className="auth-card" style={{ maxWidth: 440, width: "100%", borderRadius: 24, padding: "2.25rem 2rem", background: "white", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}>
          
          {/* Portal Switcher Tabs (Only if hideTabs is false) */}
          {!hideTabs && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, background: "#f1f5f9", padding: 4, borderRadius: 14, marginBottom: 24 }}>
              <button
                type="button"
                onClick={() => { setRoleMode('admin'); setError(""); }}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  border: 0,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: roleMode === 'admin' ? "white" : "transparent",
                  color: roleMode === 'admin' ? "#4f46e5" : "#64748b",
                  boxShadow: roleMode === 'admin' ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
                }}
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => { setRoleMode('security'); setError(""); }}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  border: 0,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: roleMode === 'security' ? "white" : "transparent",
                  color: roleMode === 'security' ? "#10b981" : "#64748b",
                  boxShadow: roleMode === 'security' ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
                }}
              >
                🛡️ Security
              </button>
              <button
                type="button"
                onClick={() => { setRoleMode('staff'); setError(""); }}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 800,
                  border: 0,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: roleMode === 'staff' ? "white" : "transparent",
                  color: roleMode === 'staff' ? "#f59e0b" : "#64748b",
                  boxShadow: roleMode === 'staff' ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
                }}
              >
                👥 Staff
              </button>
            </div>
          )}

          {/* Header text inside card */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: meta.badgeBg, color: meta.badgeColor, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <ModeIcon size={26} strokeWidth={2.5} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>{meta.title}</h2>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 6, lineHeight: 1.4 }}>{meta.subtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Corporate Email */}
            <div className="form-group">
              <label htmlFor="email" style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder={meta.placeholder}
                required
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 14, outline: "none" }}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••••••"
                  required
                  style={{ width: "100%", padding: "10px 40px 10px 14px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 14, outline: "none" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: 0, color: "#94a3b8", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: "10px 12px", borderRadius: 10, background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", fontSize: 12, fontWeight: 700 }}>
                ⚠️ {error}
              </div>
            )}

            {/* CTA Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                background: meta.badgeColor,
                color: "white",
                fontWeight: 800,
                fontSize: 14,
                border: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 8,
                boxShadow: `0 4px 14px ${meta.badgeColor}50`
              }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>Sign In to {roleMode === 'admin' ? 'Admin' : roleMode === 'security' ? 'Security' : 'Staff'} →</span>
              )}
            </button>
          </form>

          {/* Quick Info footer */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #f1f5f9", textAlign: "center", fontSize: 12, color: "#94a3b8" }}>
            Visitor Management Portal · Forge India Connect
          </div>

        </div>
      </main>
    </div>
  );
}
