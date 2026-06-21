"use client";
import React, { useState } from "react";
import QRCode from "../UI/QRCode";

export default function QRScannerSim({ visitors = [], onUpdate }) {
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

  const loadVisitorById = (id) => {
    const v = visitors.find(item => item.id === id);
    if (v) {
      setScannedVisitor(v);
      setManualCode(`VOS:${v.id}:${v.fullName}:${v.visitDate}`);
      triggerToast(`Pass scanned successfully for ${v.fullName}!`);
    } else {
      triggerToast(`Error: Visitor code ${id} not found.`);
    }
  };

  const handleSimulateScan = () => {
    if (!selectedId) return;
    loadVisitorById(selectedId);
  };

  const handleManualScanSubmit = (e) => {
    e.preventDefault();
    if (!manualCode) return;
    
    // Parse manual QR code value e.g. VOS:V001:Arjun Mehta:2026-06-15
    const parts = manualCode.split(":");
    if (parts[0] === "VOS" && parts[1]) {
      loadVisitorById(parts[1]);
    } else {
      // Fallback: try searching by ID directly
      loadVisitorById(manualCode.trim());
    }
  };

  const handleCheckIn = () => {
    if (!scannedVisitor) return;
    const timeNow = new Date().toTimeString().slice(0, 5);
    onUpdate(scannedVisitor.id, { 
      status: "checked-in", 
      approvalStatus: "approved", 
      checkInTime: timeNow 
    });
    
    // Update local state copy
    setScannedVisitor(prev => ({ 
      ...prev, 
      status: "checked-in", 
      approvalStatus: "approved", 
      checkInTime: timeNow 
    }));
    triggerToast(`${scannedVisitor.fullName} checked-in at ${timeNow}!`);
  };

  const handleCheckOut = () => {
    if (!scannedVisitor) return;
    const timeNow = new Date().toTimeString().slice(0, 5);
    onUpdate(scannedVisitor.id, { 
      status: "checked-out", 
      checkOutTime: timeNow 
    });
    
    // Update local state copy
    setScannedVisitor(prev => ({ 
      ...prev, 
      status: "checked-out", 
      checkOutTime: timeNow 
    }));
    triggerToast(`${scannedVisitor.fullName} checked-out at ${timeNow}!`);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }} className="animate-fade-in-up">
      
      {/* Left Column: Scanner controls */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", marginBottom: 12 }}>Terminal Simulator</h3>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Select a registered visitor to simulate scanning their pass QR code, or input their pass code manually.</p>

        {/* Quick selector dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Select Visitor to Scan</label>
            <div style={{ display: "flex", gap: 8 }}>
              <select 
                value={selectedId} 
                onChange={e => setSelectedId(e.target.value)} 
                className="form-input"
                style={{ flex: 1, cursor: "pointer" }}
              >
                <option value="">Choose visitor...</option>
                {visitors.map(v => (
                  <option key={v.id} value={v.id}>
                    [{v.id}] {v.fullName} ({v.status})
                  </option>
                ))}
              </select>
              <button 
                onClick={handleSimulateScan} 
                disabled={!selectedId}
                className="btn btn-primary"
                style={{ whiteSpace: "nowrap" }}
              >
                Scan Pass
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "10px 0" }}>
            <hr style={{ flex: 1, border: 0, borderTop: "1px solid #e2e8f0" }} />
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>OR</span>
            <hr style={{ flex: 1, border: 0, borderTop: "1px solid #e2e8f0" }} />
          </div>

          {/* Manual input code form */}
          <form onSubmit={handleManualScanSubmit} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Scan by QR Value or ID Code</label>
            <input 
              type="text" 
              value={manualCode} 
              onChange={e => setManualCode(e.target.value)} 
              placeholder="e.g. V001 or VOS:V001:..." 
              className="form-input"
            />
            <button 
              type="submit" 
              className="btn btn-secondary"
              style={{ marginTop: 6 }}
            >
              ⌨️ Input Code
            </button>
          </form>
        </div>

        {/* Hologram Box representing scanner */}
        <div 
          style={{ 
            marginTop: 24, 
            height: 160, 
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
            <div style={{ fontSize: 36 }}>🎯</div>
            <span style={{ fontSize: 11, letterSpacing: "1px", color: "#94a3b8" }}>SCANNING BEAM ACTIVE</span>
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
              border: "1.5px solid #e2e8f0", 
              boxShadow: "var(--shadow-md)",
              overflow: "hidden",
              flex: 1,
              display: "flex",
              flexDirection: "column"
            }}
            className="animate-scale-up"
          >
            {/* Scanned Badge Banner */}
            <div style={{ background: "linear-gradient(135deg, #041a19 0%, #0a2e2c 100%)", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#10b981", fontWeight: 700, fontSize: 12, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                ✓ Scan Results Found
              </span>
              <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 700 }}>
                ID: {scannedVisitor.id}
              </span>
            </div>

            {/* Profile info display */}
            <div style={{ padding: "1.5rem", display: "flex", gap: 16, borderBottom: "1px solid #f1f5f9" }}>
              {scannedVisitor.photo ? (
                <img 
                  src={scannedVisitor.photo} 
                  alt={scannedVisitor.fullName} 
                  style={{ width: 85, height: 110, borderRadius: 10, objectFit: "cover", border: "1px solid #cbd5e1" }} 
                />
              ) : (
                <div style={{ width: 85, height: 110, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: "#94a3b8" }}>{scannedVisitor.fullName.charAt(0)}</span>
                </div>
              )}
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>{scannedVisitor.fullName}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 12 }}><span style={{ color: "#94a3b8" }}>Meet:</span> <span style={{ color: "#334155", fontWeight: 600 }}>{scannedVisitor.personToMeet} ({scannedVisitor.department})</span></div>
                  <div style={{ fontSize: 12 }}><span style={{ color: "#94a3b8" }}>Purpose:</span> <span style={{ color: "#334155", fontWeight: 500 }}>{scannedVisitor.purpose}</span></div>
                  <div style={{ fontSize: 12 }}><span style={{ color: "#94a3b8" }}>Status:</span> <span style={{ 
                    color: scannedVisitor.status === "checked-in" ? "#16a34a" : scannedVisitor.status === "checked-out" ? "#475569" : "#e11d48",
                    fontWeight: 700 
                  }}>{scannedVisitor.status.toUpperCase()}</span></div>
                </div>
              </div>
            </div>

            {/* Additional details */}
            <div style={{ padding: "1rem 1.5rem", flex: 1 }}>
              <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    ["Phone", scannedVisitor.phone],
                    ["Email", scannedVisitor.email || "—"],
                    ["ID Verified", `${scannedVisitor.idType} (${scannedVisitor.idNumber})`],
                    ["Location", scannedVisitor.branch],
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

            {/* Quick Actions Panel */}
            <div style={{ padding: "1.25rem 1.5rem", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10 }}>
              {scannedVisitor.status === "pending" && (
                <button 
                  onClick={handleCheckIn} 
                  className="btn btn-primary"
                  style={{ flex: 1, background: "linear-gradient(135deg, #16a34a 0%, #10b981 100%)", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)" }}
                >
                  📥 Approve & Check In
                </button>
              )}
              {scannedVisitor.status === "checked-in" && (
                <button 
                  onClick={handleCheckOut} 
                  className="btn btn-secondary"
                  style={{ flex: 1, border: "1.5px solid #cbd5e1", color: "#334155" }}
                >
                  📤 Register Check Out
                </button>
              )}
              {scannedVisitor.status === "checked-out" && (
                <span style={{ width: "100%", textAlign: "center", color: "#64748b", fontSize: 13, fontWeight: 700, padding: 10 }}>
                  ✓ Visitor Visit Completed
                </span>
              )}
            </div>

          </div>
        ) : (
          <div style={{ background: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: 16, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>📟</div>
            <h4 style={{ fontWeight: 700, color: "#64748b", marginBottom: 4 }}>Awaiting Scan...</h4>
            <p style={{ fontSize: 12, maxWidth: 220 }}>Scan a visitor pass or choose a name to review profile clearance details.</p>
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

