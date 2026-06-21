"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "../UI/QRCode";
import BrandLogo from "../UI/BrandLogo";
import { API_BASE_URL } from "../../config/api";

export default function PublicPassView() {
  const { id } = useParams();
  const router = useRouter();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVisitor = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/visitors`);
        if (!res.ok) throw new Error("Server error");
        const all = await res.json();
        const found = all.find(v => v.id?.toLowerCase() === id?.toLowerCase());
        if (found) setVisitor(found);
        else setError("No visitor pass found for this ID.");
      } catch {
        setError("Unable to connect to server. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchVisitor();
  }, [id]);

  const approvalStatus = visitor?.approvalStatus?.toUpperCase();
  const visitorStatus = visitor?.status?.toUpperCase();

  const statusMeta = {
    CHECKED_IN:  { label: "CHECKED IN",      dot: "#22c55e", bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
    CHECKED_OUT: { label: "CHECKED OUT",     dot: "#64748b", bg: "#f8fafc", text: "#475569", border: "#e2e8f0" },
    PENDING:     { label: "AWAITING CHECK-IN", dot: "#f59e0b", bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  };
  const s = statusMeta[visitorStatus] || statusMeta.PENDING;

  const initials = visitor?.fullName
    ? visitor.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", flexDirection: "column", gap: 20 }}>
        <div style={{ width: 48, height: 48, border: "4px solid rgba(13,148,136,0.3)", borderTopColor: "#0d9488", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "#64748b", fontSize: 14, fontFamily: "sans-serif" }}>Loading visitor pass...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !visitor) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", flexDirection: "column", gap: 16, padding: "2rem", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 48 }}>❌</div>
        <h2 style={{ color: "white", fontWeight: 800, margin: 0 }}>Pass Not Found</h2>
        <p style={{ color: "#94a3b8", textAlign: "center", maxWidth: 300, margin: 0 }}>{error}</p>
        <button onClick={() => router.push("/")} style={{ marginTop: 12, padding: "10px 24px", borderRadius: 10, background: "#0d9488", color: "white", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          Go to Home
        </button>
      </div>
    );
  }

  if (approvalStatus !== "APPROVED") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", flexDirection: "column", gap: 16, padding: "2rem", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: 48 }}>{approvalStatus === "REJECTED" ? "🚫" : "⏳"}</div>
        <h2 style={{ color: "white", fontWeight: 800, margin: 0 }}>
          {approvalStatus === "REJECTED" ? "Pass Rejected" : "Pending Approval"}
        </h2>
        <p style={{ color: "#94a3b8", textAlign: "center", maxWidth: 340, margin: 0, lineHeight: 1.6 }}>
          {approvalStatus === "REJECTED"
            ? "This visitor pass has been rejected by the admin."
            : "This pass is awaiting admin approval. Please check back after approval."}
        </p>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 24px", color: "#e2e8f0", fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>
          Pass ID: {visitor.id}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 20% 50%, #0D1B2A 0%, #0B1220 60%, #070C18 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1.5rem",
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      {/* Verified badge */}
      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", padding: "8px 18px", borderRadius: 30, fontSize: 13, fontWeight: 700 }}>
        <span>✓</span> VERIFIED VISITOR PASS
      </div>

      {/* PASS CARD */}
      <div id="pass-card" style={{ width: "100%", maxWidth: 440, borderRadius: 20, overflow: "hidden", background: "white", position: "relative", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>

        {/* Left accent */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: "linear-gradient(180deg, #0d9488, #0891b2, #06b6d4)", zIndex: 2 }} />

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a4a)", padding: "1.4rem 1.6rem 1.4rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(13,148,136,0.2)", border: "1px solid rgba(13,148,136,0.4)", borderRadius: 4, padding: "2px 8px", marginBottom: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#2dd4bf" }} />
              <span style={{ color: "#5eead4", fontSize: 9, fontWeight: 700, letterSpacing: "1.5px" }}>VISITOR PASS</span>
            </div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px" }}>Forge India Connect</div>
          </div>
          <div style={{ background: "rgba(13,148,136,0.15)", border: "1.5px solid rgba(13,148,136,0.4)", borderRadius: 8, padding: "6px 14px", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 9, color: "#5eead4", fontWeight: 700, letterSpacing: "1px", marginBottom: 2 }}>PASS ID</div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 15, letterSpacing: "1px" }}>{visitor.id}</div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem 1.75rem 1.5rem 2rem" }}>
          {/* Identity */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: "1.25rem" }}>
            <div style={{ flexShrink: 0 }}>
              {visitor.photo ? (
                <div style={{ width: 84, height: 100, borderRadius: 12, overflow: "hidden", border: "2px solid #e2e8f0" }}>
                  <img src={visitor.photo} alt={visitor.fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ width: 84, height: 100, borderRadius: 12, background: "linear-gradient(135deg, #0f172a, #1e3a4a)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #e2e8f0" }}>
                  <span style={{ fontSize: 26, fontWeight: 900, color: "#2dd4bf", letterSpacing: "-1px" }}>{initials}</span>
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", marginBottom: 3, letterSpacing: "-0.4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{visitor.fullName}</h3>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 10 }}>{visitor.idType} · {visitor.idNumber}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  { icon: "👤", label: "Meeting", val: visitor.personToMeet },
                  { icon: "🏢", label: "Dept",    val: visitor.department },
                  { icon: "🎯", label: "Purpose", val: visitor.purpose },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                    <span style={{ fontSize: 11 }}>{icon}</span>
                    <span style={{ color: "#94a3b8", fontWeight: 600, minWidth: 50 }}>{label}:</span>
                    <span style={{ color: "#1e293b", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #e2e8f0)" }} />
            <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, letterSpacing: "1.5px" }}>CLEARANCE DETAILS</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #e2e8f0, transparent)" }} />
          </div>

          {/* Info + QR */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", flex: 1 }}>
              {[
                { label: "VISIT DATE", val: visitor.visitDate ? new Date(visitor.visitDate).toLocaleDateString("en-IN") : "—" },
                { label: "ENTRY TIME", val: visitor.checkInTime || "—" },
                { label: "LOCATION",   val: visitor.branch },
                { label: "PHONE",      val: visitor.phone },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div style={{ fontSize: 8, color: "#94a3b8", fontWeight: 700, letterSpacing: "1px", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <div style={{ padding: 8, border: "1.5px solid #e2e8f0", borderRadius: 10, background: "white" }}>
                <QRCode value={`${window.location.origin}/pass/${visitor.id}`} size={88} />
              </div>
              <span style={{ fontSize: 8, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.5px" }}>SCAN TO VERIFY</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#f8fafc", padding: "0.85rem 1.75rem 0.85rem 2rem", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {[3, 1, 4, 1, 5, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1].map((h, i) => (
              <div key={i} style={{ width: i % 3 === 0 ? 2 : 1, height: h * 4, background: "#cbd5e1", borderRadius: 1 }} />
            ))}
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 20, padding: "5px 12px" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: s.text, letterSpacing: "0.5px" }}>{s.label}</span>
          </div>
        </div>

        {/* Bottom shimmer */}
        <div style={{ height: 4, background: "linear-gradient(90deg, #0d9488, #0891b2, #06b6d4, #2dd4bf, #0d9488)", backgroundSize: "200% 100%", animation: "shimmerBar 3s linear infinite" }} />
      </div>

      <button onClick={() => navigate("/")} style={{ marginTop: "1.5rem", padding: "10px 28px", borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
        ← Home
      </button>
    </div>
  );
}
