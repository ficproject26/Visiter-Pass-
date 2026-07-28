"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BrandLogo from "../UI/BrandLogo";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import { API_BASE_URL } from "../../config/api";
import QRScannerSim from "./QRScannerSim";

import { useAuth } from "../../context/AuthContext";

export default function SecurityDashboard({ onNavigate: externalOnNavigate }) {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();

  React.useEffect(() => {
    if (!authLoading && (!user || (user.role !== 'security' && user.role !== 'gate' && user.role !== 'guard'))) {
      router.replace("/security-login");
    }
  }, [user, authLoading, router]);

  const onNavigate = externalOnNavigate || ((target) => {
    if (target === "landing") router.push("/");
    else router.push(`/${target}`);
  });

  const { isDark } = useTheme();
  const { visitors = [], refreshData } = useData();
  const [activeTab, setActiveTab] = useState("scanner");
  const [selectedVisitorId, setSelectedVisitorId] = useState(null);

  if (!user && !authLoading) return null;

  // Auto-refresh gate data every 5 seconds so security sees live host approval changes
  React.useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 5000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const handleOpenPassCard = (vId) => {
    setSelectedVisitorId(vId);
    setActiveTab("scanner");
  };

  const handleQuickCheckOut = async (vId, e) => {
    if (e) e.stopPropagation();
    const timeNow = new Date().toTimeString().slice(0, 5);
    await handleUpdateVisitor(vId, {
      status: "CHECKED_OUT",
      checkOutTime: timeNow
    });
  };

  const handleUpdateVisitor = async (id, updatePayload) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/visitors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });
      if (res.ok) {
        refreshData();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to update visitor: ${errData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error("Failed to update visitor status:", err);
      alert("Network error: Could not reach backend server.");
    }
  };

  // Helper counts
  const checkedInCount = visitors.filter(v => (v.status || "").toUpperCase() === 'CHECKED-IN' || (v.status || "").toUpperCase() === 'CHECKED_IN').length;
  const pendingCount = visitors.filter(v => (v.approvalStatus || "").toUpperCase() === 'PENDING' || (v.status || "").toUpperCase() === 'PENDING').length;
  const approvedCount = visitors.filter(v => (v.approvalStatus || "").toUpperCase() === 'APPROVED').length;
  const checkedOutCount = visitors.filter(v => (v.status || "").toUpperCase() === 'CHECKED-OUT' || (v.status || "").toUpperCase() === 'CHECKED_OUT').length;

  return (
    <div style={{ width: "100%", height: "100vh", background: isDark ? "#0B1220" : "#F8FAFC", display: "flex", fontFamily: "var(--font-primary)", overflow: "hidden" }}>
      {/* Sidebar Navigation */}
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
          height: "100vh",
          borderRight: "1px solid rgba(255,255,255,0.05)"
        }}
      >
        <div style={{ padding: "0 0.75rem", marginBottom: 8 }}>
          <BrandLogo onNavigate={onNavigate} variant="sidebar" isDark={true} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { key: "scanner", label: "Gate Pass Verification", icon: "📱" },
            { key: "logs", label: "Entry/Exit Logs", icon: "📋" }
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
                  background: isActive ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" : "transparent",
                  color: isActive ? "white" : "#94a3b8"
                }}
              >
                <span style={{ fontSize: 18 }}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={() => {
              logout();
              router.push("/security-login");
            }}
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
          >
            🚪 Logout Terminal
          </button>
        </div>
      </aside>

      {/* Main Workspace content */}
      <main style={{ padding: "clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 4vw, 3rem)", flex: 1, minWidth: 0, height: "100vh", overflowY: "auto", overflowX: "hidden" }}>
        {/* Header toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: isDark ? "#F8FAFC" : "#0F172A", letterSpacing: "-0.5px" }}>
              Security Gate Command Center
            </h1>
            <p style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 13, marginTop: 4 }}>
              Verify Visitor Pass Codes (e.g. V129) & check Admin & Host Approval before allowing entry
            </p>
          </div>
          <div style={{ background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d0", padding: "8px 16px", borderRadius: 10, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
            Gate Terminal Active
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: "2.5rem" }}>
          {[
            { label: "Active On Premises", val: checkedInCount, color: "#16a34a", subText: "Inside building" },
            { label: "Approved Entry", val: approvedCount, color: "#2563eb", subText: "Awaiting at gate" },
            { label: "Pending Approval", val: pendingCount, color: "#d97706", subText: "Awaiting action" },
            { label: "Checked Out Today", val: checkedOutCount, color: "#64748b", subText: "Finished visits" }
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
              <span style={{ fontSize: 32, fontWeight: 800, color: card.color }}>{card.val}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: card.color }} />
                <span style={{ fontSize: 10, color: "#94a3b8" }}>{card.subText}</span>
              </div>
            </div>
          ))}
        </div>

        {activeTab === "scanner" && (
          <div style={{ width: "100%" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: isDark ? "#F8FAFC" : "#0F172A" }}>Gate Visitor Verification</h2>
              <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 2 }}>Enter Visitor Pass Reference ID (e.g. <strong>V129</strong>) or scan QR code to check Admin & Host Approval.</p>
            </div>
            <QRScannerSim visitors={visitors} onUpdate={handleUpdateVisitor} initialVisitorId={selectedVisitorId} />
          </div>
        )}

        {activeTab === "logs" && (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pass ID</th>
                  <th>Visitor Identity</th>
                  <th>Host / Purpose</th>
                  <th>Approval Status</th>
                  <th>Entry / Exit Log</th>
                  <th>Gate Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map(v => {
                  const vId = v.id || v.visitorId;
                  const appStatus = (v.approvalStatus || v.status || "PENDING").toUpperCase();
                  const gateStat = (v.status || "PENDING").toUpperCase();
                  const isCheckedIn = gateStat === 'CHECKED_IN' || gateStat === 'CHECKED-IN';

                  return (
                    <tr key={vId} style={{ cursor: "pointer" }} onClick={() => handleOpenPassCard(vId)} title="Click to open Pass Card in Gate Terminal">
                      <td>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenPassCard(vId); }}
                          style={{
                            background: "rgba(79, 70, 229, 0.1)",
                            color: "#4f46e5",
                            border: "1px solid rgba(79, 70, 229, 0.3)",
                            borderRadius: 6,
                            padding: "3px 8px",
                            fontWeight: 800,
                            fontFamily: "monospace",
                            fontSize: 12,
                            cursor: "pointer"
                          }}
                        >
                          🔍 {vId}
                        </button>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#2563eb", fontSize: 13, textDecoration: "underline" }}>{v.fullName}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{v.phone}</div>
                      </td>
                      <td style={{ fontSize: 13 }}>
                        <div style={{ fontWeight: 600 }}>{v.personToMeet} ({v.department || "Host"})</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{v.purpose}</div>
                      </td>
                      <td>
                        <span style={{
                          background: appStatus === 'APPROVED' ? '#dcfce7' : appStatus === 'REJECTED' ? '#ffe4e6' : '#fef3c7',
                          color: appStatus === 'APPROVED' ? '#15803d' : appStatus === 'REJECTED' ? '#be123c' : '#b45309',
                          borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700
                        }}>
                          {appStatus}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: "#64748b" }}>
                        {v.checkInTime || "--:--"} / {v.checkOutTime || "--:--"}
                      </td>
                      <td>
                        <span style={{
                          background: isCheckedIn ? '#dcfce7' : '#f1f5f9',
                          color: isCheckedIn ? '#15803d' : '#475569',
                          borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700
                        }}>
                          {gateStat.replace("_", "-")}
                        </span>
                      </td>
                      <td>
                        {isCheckedIn ? (
                          <button
                            onClick={(e) => handleQuickCheckOut(vId, e)}
                            className="btn btn-secondary"
                            style={{
                              padding: "4px 10px",
                              fontSize: 11,
                              borderRadius: 8,
                              fontWeight: 700,
                              background: "#fee2e2",
                              color: "#dc2626",
                              border: "1px solid #fca5a5"
                            }}
                          >
                            📤 Check Out
                          </button>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleOpenPassCard(vId); }}
                            className="btn btn-primary"
                            style={{
                              padding: "4px 10px",
                              fontSize: 11,
                              borderRadius: 8,
                              fontWeight: 700
                            }}
                          >
                            🔍 Open Pass
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
