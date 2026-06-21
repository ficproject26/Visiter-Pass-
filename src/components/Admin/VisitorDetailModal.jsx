"use client";
import React from "react";
import QRCode from "../UI/QRCode";

export default function VisitorDetailModal({ visitor, onClose, onCheckIn, onCheckOut, onApprove, onReject }) {
  if (!visitor) return null;

  return (
    <div 
      style={{ 
        position: "fixed", 
        inset: 0, 
        background: "rgba(4, 26, 25, 0.7)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        zIndex: 100, 
        padding: "1rem", 
        backdropFilter: "blur(5px)" 
      }} 
      onClick={onClose}
      className="no-print"
    >
      <div 
        style={{ 
          background: "white", 
          borderRadius: 24, 
          width: "100%", 
          maxWidth: 560, 
          maxHeight: "92vh", 
          overflow: "hidden", 
          boxShadow: "var(--shadow-xl)",
          display: "flex",
          flexDirection: "column"
        }} 
        onClick={e => e.stopPropagation()}
        className="animate-scale-up"
      >
        {/* Modal Header */}
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {visitor.photo ? (
              <img 
                src={visitor.photo} 
                alt={visitor.fullName} 
                style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1.5px solid rgba(255,255,255,0.2)" }} 
              />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #0d9488, #0891b2)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 16 }}>
                {visitor.fullName.charAt(0)}
              </div>
            )}
            <div>
              <h3 style={{ color: "white", fontWeight: 800, fontSize: 16 }}>{visitor.fullName}</h3>
              <span style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600 }}>Pass ID: {visitor.id}</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: "rgba(255, 255, 255, 0.1)", 
              border: "none", 
              color: "white", 
              width: 32, 
              height: 32, 
              borderRadius: "50%", 
              cursor: "pointer", 
              fontSize: 20, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              transition: "background 0.2s" 
            }}
            onMouseEnter={e => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
            onMouseLeave={e => e.target.style.background = "rgba(255, 255, 255, 0.1)"}
          >
            ×
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Identity Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "1rem 1.25rem", borderRadius: 16, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {/* Status Badge */}
              <span 
                style={{ 
                  background: visitor.status === "checked-in" ? "#dcfce7" : visitor.status === "checked-out" ? "#f1f5f9" : "#fff1f2", color: visitor.status === "checked-in" ? "#15803d" : visitor.status === "checked-out" ? "#475569" : "#be123c", 
                  borderRadius: 20, 
                  padding: "4px 12px", 
                  fontSize: 11, 
                  fontWeight: 700 
                }}
              >
                {visitor.status === "checked-in" ? "Checked In" : visitor.status === "checked-out" ? "Checked Out" : "Pending"}
              </span>

              {/* Approval Badge */}
              <span 
                style={{ 
                  background: visitor.approvalStatus === "approved" ? "#f0fdfa" : visitor.approvalStatus === "rejected" ? "#fef2f2" : "#fff1f2", color: visitor.approvalStatus === "approved" ? "#0f766e" : visitor.approvalStatus === "rejected" ? "#991b1b" : "#be123c", 
                  borderRadius: 20, 
                  padding: "4px 12px", 
                  fontSize: 11, 
                  fontWeight: 700 
                }}
              >
                {visitor.approvalStatus.toUpperCase()}
              </span>
            </div>
            
            <QRCode value={`VOS:${visitor.id}:${visitor.fullName}`} size={64} />
          </div>

          {/* Details Table List */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>Visitor Record Profile</h4>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
              {[
                ["Phone Number", visitor.phone],
                ["Email Address", visitor.email || "—"],
                ["ID Verification", `${visitor.idType} (${visitor.idNumber})`],
                ["Emergency Number", visitor.emergencyContact],
                ["Meeting Host", visitor.personToMeet],
                ["Department", visitor.department],
                ["Branch/Location", visitor.branch],
                ["Visit Date", visitor.visitDate],
                ["Registered Arrival", visitor.checkInTime],
                ["Departure Time", visitor.checkOutTime || "Not departed"],
                ["Vehicle Number", visitor.vehicleNumber || "—"],
                ["Appointment Purpose", visitor.purpose],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 700 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Action Buttons Footer */}
        <div style={{ padding: "1.25rem 1.5rem", background: "#f8fafc", borderTop: "1px solid #e2e8f0", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          
          {/* Host approvals */}
          {visitor.approvalStatus === "pending" && (
            <>
              <button 
                onClick={() => { onApprove(visitor.id); onClose(); }} 
                className="btn btn-success"
                style={{ padding: "8px 16px" }}
              >
                ✓ Approve
              </button>
              <button 
                onClick={() => { onReject(visitor.id); onClose(); }} 
                className="btn btn-danger"
                style={{ padding: "8px 16px" }}
              >
                ✕ Reject
              </button>
            </>
          )}

          {/* Check-in Actions */}
          {visitor.status === "pending" && visitor.approvalStatus === "approved" && (
            <button 
              onClick={() => { onCheckIn(visitor.id); onClose(); }} 
              className="btn btn-primary"
              style={{ background: "#16a34a", padding: "8px 16px" }}
            >
              📥 Check In Visitor
            </button>
          )}

          {/* Check-out Actions */}
          {visitor.status === "checked-in" && (
            <button 
              onClick={() => { onCheckOut(visitor.id); onClose(); }} 
              className="btn btn-secondary"
              style={{ border: "1.5px solid #cbd5e1", padding: "8px 16px" }}
            >
              📤 Check Out Visitor
            </button>
          )}

          <button 
            onClick={onClose} 
            className="btn btn-secondary"
            style={{ padding: "8px 16px", background: "white" }}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}


