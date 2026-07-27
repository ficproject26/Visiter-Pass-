"use client";
import React, { useState, useEffect } from "react";
import QRCode from "../UI/QRCode";
import { API_BASE_URL } from "../../config/api";

export default function QRScannerSim({ visitors = [], onUpdate, initialVisitorId }) {
  const [selectedId, setSelectedId] = useState("");
  const [scannedVisitor, setScannedVisitor] = useState(null);
  const [manualCode, setManualCode] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load pass card if initialVisitorId is provided from table click
  useEffect(() => {
    if (initialVisitorId) {
      loadVisitorById(initialVisitorId);
    }
  }, [initialVisitorId]);

  // Keep scannedVisitor in real-time sync when visitors prop updates
  useEffect(() => {
    if (scannedVisitor) {
      const currentId = scannedVisitor.id || scannedVisitor.visitorId;
      const cleanCurrentId = String(currentId).toUpperCase().replace(/[^A-Z0-9]/g, "");
      const updated = visitors.find(v => {
        const vId = String(v.id || v.visitorId || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
        return vId === cleanCurrentId;
      });
      if (updated && (updated.approvalStatus !== scannedVisitor.approvalStatus || updated.status !== scannedVisitor.status || updated.arrivedAtGate !== scannedVisitor.arrivedAtGate)) {
        setScannedVisitor(updated);
      }
    }
  }, [visitors, scannedVisitor]);

  const loadVisitorById = async (searchQuery) => {
    if (!searchQuery) return;
    const cleanQuery = searchQuery.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

    // 1. Search in local visitors list with sanitized ID matching
    let v = visitors.find(item => {
      const itemCode = String(item.id || item.visitorId || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
      const phone = String(item.phone || "").toUpperCase();
      const name = String(item.fullName || "").toUpperCase();
      return itemCode === cleanQuery || phone === cleanQuery || (cleanQuery.length > 2 && name.includes(cleanQuery));
    });

    // 2. Direct backend fallback search if not found in memory
    if (!v) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/visitors/${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const fetched = await res.json();
          if (fetched && (fetched.id || fetched.visitorId)) {
            v = fetched;
          }
        }
      } catch (err) {
        console.warn("Backend visitor search failed:", err);
      }
    }

    if (v) {
      setScannedVisitor(v);
      setManualCode(v.id || v.visitorId || searchQuery);
      const appStatus = (v.approvalStatus || v.status || "PENDING").toUpperCase();
      if (appStatus === "APPROVED") {
        triggerToast(`🟢 Host Approval CONFIRMED for ${v.fullName} (${v.id || v.visitorId})!`);
      } else if (appStatus === "REJECTED") {
        triggerToast(`🔴 ACCESS DENIED: ${v.fullName} is REJECTED by host.`);
      } else {
        triggerToast(`🟡 Pass code loaded: ${v.fullName} is PENDING host approval.`);
      }
    } else {
      triggerToast(`⚠️ Visitor code '${searchQuery}' not found in database.`);
    }
  };

  const handleSimulateScan = () => {
    if (!selectedId) return;
    loadVisitorById(selectedId);
  };

  const handleManualScanSubmit = (e) => {
    e.preventDefault();
    if (!manualCode) return;
    
    // Parse manual QR code value e.g. VOS:V129:Arjun Mehta:2026-06-15
    const parts = manualCode.split(":");
    if (parts[0] === "VOS" && parts[1]) {
      loadVisitorById(parts[1]);
    } else {
      loadVisitorById(manualCode.trim());
    }
  };

  const handleCheckIn = () => {
    if (!scannedVisitor) return;
    const timeNow = new Date().toTimeString().slice(0, 5);
    const vId = scannedVisitor.id || scannedVisitor.visitorId;

    onUpdate(vId, { 
      status: "CHECKED_IN",
      approvalStatus: "APPROVED", 
      checkInTime: timeNow 
    });
    
    // Update local state copy
    setScannedVisitor(prev => ({ 
      ...prev, 
      status: "CHECKED_IN", 
      approvalStatus: "APPROVED", 
      checkInTime: timeNow 
    }));
    triggerToast(`✅ ${scannedVisitor.fullName} checked-in at gate (${timeNow})!`);
  };

  const handleCheckOut = () => {
    if (!scannedVisitor) return;
    const timeNow = new Date().toTimeString().slice(0, 5);
    const vId = scannedVisitor.id || scannedVisitor.visitorId;

    onUpdate(vId, { 
      status: "CHECKED_OUT", 
      checkOutTime: timeNow 
    });
    
    // Update local state copy
    setScannedVisitor(prev => ({ 
      ...prev, 
      status: "CHECKED_OUT", 
      checkOutTime: timeNow 
    }));
    triggerToast(`👋 ${scannedVisitor.fullName} checked-out at ${timeNow}!`);
  };

  // Derive status states cleanly
  const rawAppStatus = scannedVisitor ? (scannedVisitor.approvalStatus || scannedVisitor.status || "PENDING").toUpperCase() : "";
  const rawGateStatus = scannedVisitor ? (scannedVisitor.status || "PENDING").toUpperCase() : "";

  const isApproved = rawAppStatus === "APPROVED";
  const isRejected = rawAppStatus === "REJECTED";
  const isPending = rawAppStatus === "PENDING" && rawGateStatus !== "CHECKED_IN" && rawGateStatus !== "CHECKED-IN";
  const isCheckedIn = rawGateStatus === "CHECKED_IN" || rawGateStatus === "CHECKED-IN";
  const isCheckedOut = rawGateStatus === "CHECKED_OUT" || rawGateStatus === "CHECKED-OUT";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }} className="animate-fade-in-up">
      
      {/* Left Column: Scanner controls */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>Gate Pass Terminal</h3>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Enter visitor pass code (e.g. <strong>V129</strong>) or select from registered visitors list to verify host approval.</p>

        {/* Quick selector dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Select Visitor Code</label>
            <div style={{ display: "flex", gap: 8 }}>
              <select 
                value={selectedId} 
                onChange={e => setSelectedId(e.target.value)} 
                className="form-input"
                style={{ flex: 1, cursor: "pointer" }}
              >
                <option value="">Choose visitor pass...</option>
                {visitors.map(v => {
                  const idCode = v.id || v.visitorId;
                  const appSt = (v.approvalStatus || v.status || "PENDING").toUpperCase();
                  return (
                    <option key={idCode} value={idCode}>
                      [{idCode}] {v.fullName} ({appSt})
                    </option>
                  );
                })}
              </select>
              <button 
                onClick={handleSimulateScan} 
                disabled={!selectedId}
                className="btn btn-primary"
                style={{ whiteSpace: "nowrap" }}
              >
                Verify Code
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "10px 0" }}>
            <hr style={{ flex: 1, borderTop: "1px solid #e2e8f0" }} />
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>OR ENTER MANUALLY</span>
            <hr style={{ flex: 1, borderTop: "1px solid #e2e8f0" }} />
          </div>

          {/* Manual input code form */}
          <form onSubmit={handleManualScanSubmit} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Enter Pass Code (e.g. V129 or Phone)</label>
            <input 
              type="text" 
              value={manualCode} 
              onChange={e => setManualCode(e.target.value)} 
              placeholder="e.g. V129" 
              className="form-input"
              style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1 }}
            />
            <button 
              type="submit" 
              className="btn btn-secondary"
              style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              🔍 Check Security Approval
            </button>
          </form>
        </div>

        {/* Hologram Box representing scanner */}
        <div 
          style={{ 
            marginTop: 24, 
            height: 140, 
            borderRadius: 12, 
            border: "1.5px solid #cbd5e1", 
            background: "#041a19",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div 
            style={{ 
              position: "absolute", 
              left: 0, 
              width: "100%", 
              height: 3, 
              background: "#10b981", 
              boxShadow: "0 0 10px #10b981",
              animation: "scannerLine 3s infinite linear" 
            }} 
          />
          
          <div style={{ textAlign: "center", color: "#64748b", zIndex: 1 }}>
            <div style={{ fontSize: 32 }}>🎯</div>
            <span style={{ fontSize: 11, letterSpacing: "1px", color: "#94a3b8", fontWeight: 700 }}>GATE SECURITY SCANNER READY</span>
          </div>
        </div>
      </div>

      {/* Right Column: Display scan results */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {scannedVisitor ? (
          <div 
            style={{ 
              background: "white", 
              borderRadius: 16, 
              border: isApproved ? "2px solid #10b981" : isRejected ? "2px solid #ef4444" : "2px solid #f59e0b", 
              boxShadow: "var(--shadow-md)",
              overflow: "hidden",
              flex: 1,
              display: "flex",
              flexDirection: "column"
            }}
            className="animate-scale-up"
          >
            {/* Scanned Badge Banner */}
            <div 
              style={{ 
                background: isApproved 
                  ? "linear-gradient(135deg, #064e3b 0%, #047857 100%)" 
                  : isRejected 
                  ? "linear-gradient(135deg, #881337 0%, #be123c 100%)" 
                  : "linear-gradient(135deg, #78350f 0%, #d97706 100%)", 
                padding: "1.25rem 1.5rem", 
                color: "white" 
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  {isApproved ? "✓ ENTRY APPROVAL CONFIRMED" : isRejected ? "🚫 ACCESS DENIED (REJECTED)" : "⚠️ PENDING ENTRY APPROVAL"}
                </span>
                <span style={{ fontSize: 14, fontWeight: 900, background: "rgba(255,255,255,0.2)", padding: "2px 10px", borderRadius: 6 }}>
                  PASS CODE: {scannedVisitor.id || scannedVisitor.visitorId}
                </span>
              </div>
              <p style={{ fontSize: 12, marginTop: 4, opacity: 0.9 }}>
                {isApproved ? `Entry APPROVED for meeting with ${scannedVisitor.personToMeet}.` : isRejected ? `Entry REJECTED for meeting with ${scannedVisitor.personToMeet}.` : `Awaiting entry approval for meeting with ${scannedVisitor.personToMeet}.`}
              </p>
            </div>

            {/* Profile info display */}
            <div style={{ padding: "1.5rem", display: "flex", gap: 16, borderBottom: "1px solid #f1f5f9" }}>
              {scannedVisitor.photo ? (
                <img 
                  src={scannedVisitor.photo} 
                  alt={scannedVisitor.fullName} 
                  style={{ width: 90, height: 115, borderRadius: 10, objectFit: "cover", border: "1px solid #cbd5e1" }} 
                />
              ) : (
                <div style={{ width: 90, height: 115, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: "#94a3b8" }}>{scannedVisitor.fullName ? scannedVisitor.fullName.charAt(0) : "V"}</span>
                </div>
              )}
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>{scannedVisitor.fullName}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 13 }}><span style={{ color: "#94a3b8" }}>Person to Meet:</span> <span style={{ color: "#0f172a", fontWeight: 700 }}>{scannedVisitor.personToMeet} ({scannedVisitor.department || "Host"})</span></div>
                  <div style={{ fontSize: 13 }}><span style={{ color: "#94a3b8" }}>Visit Purpose:</span> <span style={{ color: "#334155", fontWeight: 600 }}>{scannedVisitor.purpose}</span></div>
                  <div style={{ fontSize: 13 }}><span style={{ color: "#94a3b8" }}>Branch / Gate:</span> <span style={{ color: "#334155", fontWeight: 600 }}>{scannedVisitor.branch || "Headquarters"}</span></div>
                </div>
              </div>
            </div>

            {/* Additional details */}
            <div style={{ padding: "1rem 1.5rem", flex: 1 }}>
              <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    ["Phone Number", scannedVisitor.phone],
                    ["Email Address", scannedVisitor.email || "—"],
                    ["ID Proof Details", `${scannedVisitor.idType} (${scannedVisitor.idNumber})`],
                    ["Check-in Log", scannedVisitor.checkInTime ? `${scannedVisitor.visitDate} @ ${scannedVisitor.checkInTime}` : "Not logged"],
                    ["Check-out Log", scannedVisitor.checkOutTime ? `${scannedVisitor.visitDate} @ ${scannedVisitor.checkOutTime}` : "Not logged"]
                  ].map(([label, val]) => (
                    <tr key={label} style={{ borderBottom: "1px solid #f8fafc" }}>
                      <td style={{ padding: "8px 0", color: "#94a3b8", fontWeight: 500 }}>{label}</td>
                      <td style={{ padding: "8px 0", color: "#334155", fontWeight: 600, textAlign: "right" }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Security Gate Action Panel */}
            <div style={{ padding: "1.25rem 1.5rem", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", flexDirection: "column", gap: 10 }}>
              
              {/* Scenario 1: APPROVED and NOT checked-in -> Can Allow Inside */}
              {isApproved && !isCheckedIn && !isCheckedOut && (
                <button 
                  onClick={handleCheckIn} 
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "12px", fontSize: 14, background: "linear-gradient(135deg, #16a34a 0%, #10b981 100%)", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)" }}
                >
                  📥 ALLOW INSIDE (Check In)
                </button>
              )}

              {/* Scenario 2: PENDING Host Approval -> Option to Notify Admin */}
              {isPending && (
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
                  <button 
                    disabled
                    className="btn"
                    style={{ width: "100%", padding: "10px", background: "#fef3c7", color: "#b45309", border: "1px solid #fde68a", cursor: "not-allowed", fontWeight: 700 }}
                  >
                    🔒 ENTRY BLOCKED - Awaiting Admin / Host Approval
                  </button>
                  <button
                    onClick={() => {
                      const vId = scannedVisitor.id || scannedVisitor.visitorId;
                      onUpdate(vId, { arrivedAtGate: true });
                      setScannedVisitor(prev => ({ ...prev, arrivedAtGate: true }));
                      triggerToast(`🔔 Admin & Host notified: ${scannedVisitor.fullName} is waiting at the Gate!`);
                    }}
                    className="btn"
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: scannedVisitor.arrivedAtGate ? "#0284c7" : "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      color: "white",
                      fontWeight: 800,
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)"
                    }}
                  >
                    {scannedVisitor.arrivedAtGate ? "🔔 Admin Notified! (Waiting at Gate)" : "🔔 Notify Admin / Host Visitor Arrived"}
                  </button>
                  <span style={{ fontSize: 11, color: "#d97706", display: "block", marginTop: 2 }}>
                    Branch Admin / Host ({scannedVisitor.personToMeet}) must click <strong>Approve</strong> in Admin Dashboard.
                  </span>
                </div>
              )}

              {/* Scenario 3: REJECTED -> Blocked */}
              {isRejected && (
                <div style={{ textAlign: "center" }}>
                  <button 
                    disabled
                    className="btn"
                    style={{ width: "100%", padding: "12px", background: "#ffe4e6", color: "#be123c", border: "1px solid #fecdd3", cursor: "not-allowed", fontWeight: 700 }}
                  >
                    ⛔ ACCESS DENIED - Rejected by Admin / Host
                  </button>
                  <span style={{ fontSize: 11, color: "#e11d48", display: "block", marginTop: 6 }}>
                    Entry is strictly forbidden for this pass code.
                  </span>
                </div>
              )}

              {/* Scenario 4: CHECKED IN -> Option to Check Out */}
              {isCheckedIn && (
                <button 
                  onClick={handleCheckOut} 
                  className="btn btn-secondary"
                  style={{ width: "100%", padding: "12px", fontSize: 14, border: "1.5px solid #cbd5e1", color: "#334155", fontWeight: 700 }}
                >
                  📤 REGISTER CHECK OUT
                </button>
              )}

              {/* Scenario 5: CHECKED OUT -> Completed */}
              {isCheckedOut && (
                <div style={{ width: "100%", textAlign: "center", color: "#64748b", fontSize: 13, fontWeight: 700, padding: 8, background: "#e2e8f0", borderRadius: 8 }}>
                  ✓ Visitor Visit Completed & Checked Out
                </div>
              )}

            </div>

          </div>
        ) : (
          <div style={{ background: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: 16, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>📟</div>
            <h4 style={{ fontWeight: 700, color: "#64748b", marginBottom: 4 }}>Awaiting Pass Code Input...</h4>
            <p style={{ fontSize: 12, maxWidth: 260 }}>Enter a pass code like <strong>V129</strong> or choose from the dropdown to check Host Approval and allow entrance.</p>
          </div>
        )}
      </div>

      {/* Floating Status Toast Notifications */}
      {toastMessage && (
        <div 
          style={{ 
            position: "fixed", 
            bottom: 24, 
            right: 24, 
            background: "#0a2e2c", 
            color: "white", 
            padding: "12px 20px", 
            borderRadius: 10, 
            boxShadow: "var(--shadow-xl)", 
            fontSize: 13, 
            fontWeight: 600,
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderLeft: "4px solid #10b981"
          }}
          className="animate-fade-in"
        >
          <span>🔔</span> {toastMessage}
        </div>
      )}

    </div>
  );
}
