"use client";
import { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function DemoModal({ onClose }) {
  const { isDark } = useTheme();

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);

  const steps = [
    { icon: "📝", title: "Register",   desc: "Fill visitor details in under 60 seconds." },
    { icon: "✅", title: "Approve",    desc: "Host approves with one click before arrival." },
    { icon: "🪪", title: "QR Pass",    desc: "Badge generated instantly — scan at entry." },
    { icon: "📊", title: "Analytics",  desc: "All data flows to live dashboards automatically." },
  ];

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(4,26,25,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem", backdropFilter: "blur(8px)" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="animate-scale-up"
        style={{ background: isDark ? "linear-gradient(135deg,#041a19,#0a2e2c)" : "white", borderRadius: 24, width: "100%", maxWidth: 680, border: isDark ? "1px solid rgba(212,137,26,0.3)" : "1px solid rgba(212,137,26,0.2)", boxShadow: "0 40px 80px rgba(0,0,0,0.5)", overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#0f172a,#1e3a4a)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", gap: 6, alignItems: "center", background: "rgba(13,148,136,0.2)", border: "1px solid rgba(13,148,136,0.35)", borderRadius: 50, padding: "3px 12px", fontSize: 10, fontWeight: 700, color: "#5eead4", marginBottom: 8 }}>▶ PRODUCT DEMO</div>
            <h3 style={{ color: "white", fontWeight: 800, fontSize: 20, letterSpacing: "-0.5px", margin: 0 }}>See VisitorOS in action</h3>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "white", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {/* Video placeholder */}
        <div style={{ background: "#020f0e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 2rem", borderBottom: isDark ? "1px solid rgba(212,137,26,0.18)" : "1px solid rgba(212,137,26,0.15)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #D4891A, #C07810)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 16, boxShadow: "0 0 0 12px rgba(13,148,136,0.12), 0 0 0 24px rgba(13,148,136,0.06)", cursor: "pointer" }}>▶</div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>3-minute overview · No signup required</p>
        </div>

        {/* Steps */}
        <div style={{ padding: "1.75rem 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 16 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 11.5, color: isDark ? "rgba(250,246,240,0.5)" : "#5C4A35", lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "1.25rem 2rem", background: isDark ? "rgba(13,148,136,0.05)" : "rgba(240,253,250,0.8)", borderTop: isDark ? "1px solid rgba(212,137,26,0.15)" : "1px solid rgba(212,137,26,0.15)", display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ background: "transparent", border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(212,137,26,0.2)", color: isDark ? "#FAF6F0" : "#1C1008" }}>Close</button>
          <button className="btn btn-primary" style={{ background: "linear-gradient(135deg, #D4891A, #C07810)" }}>Start Free Trial →</button>
        </div>
      </div>
    </div>
  );
}


