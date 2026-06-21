"use client";
import React, { useState } from "react";
import { MOCK_VISITORS } from "../../constants/visitorConstants";
import BrandLogo from "../UI/BrandLogo";
import ThemeToggle from "../UI/ThemeToggle";
import QRScannerSim from "./QRScannerSim";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import "../../styles/dashboard.css";

export default function HRDashboard({ visitors = [], onUpdate, onNavigate: externalOnNavigate }) {
  const router = useRouter();
  const onNavigate = externalOnNavigate || ((target) => {
    if (target === "landing") router.push("/");
    else router.push(`/${target}`);
  });

  const { isDark } = useTheme();
  const { user } = useAuth();
  // Filter only Interview Candidates for HR
  const candidates = MOCK_VISITORS.filter(v => v.purpose === "Interview" || v.visitorType === "Interview Candidate");

  const [activeTab, setActiveTab] = useState("candidates");

  return (
    <div style={{ width: "100%", height: "100%", background: isDark ? "#0B1220" : "#F8FAFC", display: "flex", fontFamily: "var(--font-primary)", overflow: "hidden" }}>
      {/* Sidebar navigation */}
      <aside
        style={{
          width: 250,
          minWidth: 250,
          flexShrink: 0,
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          padding: "2rem 1rem",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          position: "sticky",
          height: "100%",
          left: 0,
          top: 0,
          zIndex: 10,
          borderRight: "1px solid rgba(255,255,255,0.05)"
        }}
      >
        {/* Brand logo */}
        <div style={{ padding: "0 0.75rem", marginBottom: 8 }}>
          <BrandLogo onNavigate={onNavigate} variant="sidebar" isDark={true} />
        </div>

        {/* Theme toggle row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 0.75rem" }}>
          <ThemeToggle />
          <span style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600 }}>{isDark ? "Dark Mode" : "Light Mode"}</span>
        </div>

        {/* Navigation items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { key: "candidates", label: "Interview Candidates", icon: "👩‍💼" },
            { key: "scanner", label: "QR Pass Reader", icon: "📟" },
            { key: "schedule", label: "Schedule Interview", icon: "📅" }
          ].map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: 0,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: "left",
                  transition: "all 0.2s",
                  background: isActive ? "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" : "transparent",
                  color: isActive ? "white" : "#94a3b8"
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.target.style.background = "rgba(255,255,255,0.05)";
                    e.target.style.color = "white";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#94a3b8";
                  }
                }}
              >
                <span style={{ fontSize: 18 }}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Logout Action */}
        <div style={{ marginTop: "auto" }}>
          <button
            onClick={() => onNavigate("landing")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 12,
              border: 0,
              background: "transparent",
              color: "#64748b",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              width: "100%"
            }}
            onMouseEnter={e => e.target.style.color = "#94a3b8"}
            onMouseLeave={e => e.target.style.color = "#64748b"}
          >
            🚪 Logout Dashboard
          </button>
        </div>
      </aside>

      {/* Main Workspace content */}
      <main style={{ padding: "clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 4vw, 3rem)", flex: 1, minWidth: 0, height: "100%", overflowY: "auto", overflowX: "hidden" }}>
        {/* Header toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: isDark ? "#F8FAFC" : "#0F172A", letterSpacing: "-0.5px" }}>
              HR Dashboard
            </h1>
            <p style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 13, marginTop: 4 }}>
              Manage interview candidates and schedules
            </p>
          </div>

          <button className="btn btn-primary">
            ➕ Schedule New
          </button>
        </div>

        {/* Stats Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: "2.5rem" }}>
          {[
            { label: "Total Candidates Today", val: candidates.length, color: "#4f46e5", bg: "#e0f2fe", subText: "Active scheduled logs" },
            { label: "Pending Approvals", val: candidates.filter(c => c.approvalStatus === 'pending').length, color: "#e11d48", bg: "#fff1f2", subText: "Awaiting action" },
            { label: "Interviews Completed", val: candidates.filter(c => c.status === 'checked-out').length, color: "#16a34a", bg: "#dcfce7", subText: "Finished sessions" }
          ].map((card, index) => (
            <div
              key={index}
              style={{
                background: isDark ? "#111827" : "#FFFFFF",
                borderRadius: 16,
                padding: "1.25rem 1.5rem",
                border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(15,23,42,0.1)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                gap: 4
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? "#94a3b8" : "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</span>
              <span style={{ fontSize: 32, fontWeight: 800, color: isDark ? "#F8FAFC" : "#0F172A" }}>{card.val}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: card.color }} />
                <span style={{ fontSize: 10, color: "#94a3b8" }}>{card.subText}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab contents */}
        {activeTab === "candidates" && (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Position</th>
                  <th>Interviewer</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: "4rem", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                      <span>No candidates scheduled today.</span>
                    </td>
                  </tr>
                ) : (
                  candidates.map(c => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: isDark ? "#F8FAFC" : "#0f172a", fontSize: 13 }}>{c.fullName}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.email}</div>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 500 }}>
                        {c.positionApplied || "SDE Intern"}
                      </td>
                      <td style={{ fontSize: 13, color: isDark ? "#cbd5e1" : "#475569" }}>
                        {c.personToMeet}
                      </td>
                      <td style={{ fontSize: 13, color: isDark ? "#cbd5e1" : "#475569" }}>
                        {c.checkInTime}
                      </td>
                      <td>
                        <span
                          style={{
                            background: c.status === "checked-in" ? "#dcfce7" : "#fff1f2",
                            color: c.status === "checked-in" ? "#15803d" : "#be123c",
                            borderRadius: 20,
                            padding: "3px 10px",
                            fontSize: 11,
                            fontWeight: 700,
                            whiteSpace: "nowrap"
                          }}
                        >
                          {c.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {c.approvalStatus === 'pending' ? (
                          <button className="btn btn-primary" style={{ padding: "4px 8px", fontSize: 11, borderRadius: 6 }}>Approve</button>
                        ) : (
                          <button className="btn btn-secondary" style={{ padding: "4px 8px", fontSize: 11, borderRadius: 6 }}>View CV</button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "scanner" && <QRScannerSim visitors={visitors} onUpdate={onUpdate} />}

        {activeTab === "schedule" && (
          <div style={{ background: isDark ? "#111827" : "#FFFFFF", borderRadius: 16, padding: "2rem", border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(15,23,42,0.1)", color: isDark ? "#F8FAFC" : "#0F172A" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>Schedule a New Interview</h2>
            <p style={{ color: "#94a3b8", fontSize: 14 }}>Feature simulator to schedule sessions, assign managers, and email confirmation passes.</p>
          </div>
        )}
      </main>
    </div>
  );
}
