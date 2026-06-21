"use client";
import React, { useRef } from "react";
import html2canvas from "html2canvas";
import QRCode from "../UI/QRCode";
import { useTheme } from "../../context/ThemeContext";
import BrandLogo from "../UI/BrandLogo";
import { useRouter } from "next/navigation";

export default function VisitorPass({ visitor, onNavigate: externalOnNavigate }) {
  const { isDark } = useTheme();
  const router = useRouter();

  const onNavigate = externalOnNavigate || ((target) => {
    if (target === "landing") router.push("/");
    else router.push(`/${target}`);
  });

  // QR encodes the public pass URL — scanning opens the pass in any browser
  const qrValue = `${window.location.origin}/pass/${visitor.id}`;

  const handlePrint = () => window.print();

  const handleDownload = async () => {
    const passEl = document.getElementById("printable-visitor-pass");
    if (!passEl) return;
    try {
      const canvas = await html2canvas(passEl, { scale: 3, useCORS: true, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `VisitorPass_${visitor.id}_${visitor.fullName.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const initials = visitor.fullName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const statusMeta = {
    "checked-in":  { label: "CHECKED IN",  dot: "#22c55e", bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
    "checked-out": { label: "CHECKED OUT", dot: "#64748b", bg: "#f8fafc", text: "#475569", border: "#e2e8f0" },
    pending:       { label: "AWAITING CHECK-IN", dot: "#f59e0b", bg: "#fffbeb", text: "#b45309", border: "#fde68a" },
  };
  const s = statusMeta[visitor.status] || statusMeta.pending;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark
          ? "radial-gradient(ellipse at 20% 50%, #0D1B2A 0%, #0B1220 60%, #070C18 100%)"
          : "radial-gradient(ellipse at 20% 50%, #EEF2FF 0%, #E0E7FF 60%, #F5F3FF 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 1.5rem",
        fontFamily: "var(--font-primary)",
      }}
    >
      {/* ── Success header ── */}
      <div
        className="no-print"
        style={{ textAlign: "center", marginBottom: "2.5rem" }}
      >
        {/* Animated checkmark ring */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0d9488, #0891b2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
            fontSize: 32,
          }}
        >
          ✓
        </div>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "1.55rem",
            letterSpacing: "-0.5px",
            color: isDark ? "white" : "#0f172a",
            marginBottom: 6,
          }}
        >
          Registration Complete
        </h2>
        <p style={{ color: isDark ? "rgba(255,255,255,0.55)" : "#64748b", fontSize: 13, maxWidth: 340, margin: "0 auto" }}>
          Present this badge at reception for security clearance.
        </p>
      </div>

      {/* ══════════════════════════════════════════
          PASS CARD
      ══════════════════════════════════════════ */}
      <div
        id="printable-visitor-pass"
        className="print-area animate-scale-up"
        style={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 20,
          overflow: "hidden",
          background: "white",
          position: "relative",
        }}
      >
        {/* ── LEFT accent stripe ── */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: "linear-gradient(180deg, #0d9488 0%, #0891b2 50%, #06b6d4 100%)",
            zIndex: 2,
          }}
        />

        {/* ── HEADER ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a4a 100%)",
            padding: "1.4rem 1.6rem 1.4rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative radial glow */}
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(13,148,136,0.3) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(13,148,136,0.2)",
                border: "1px solid rgba(13,148,136,0.4)",
                borderRadius: 4,
                padding: "2px 8px",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#2dd4bf",
                }}
              />
              <span
                style={{
                  color: "#5eead4",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Visitor Pass
              </span>
            </div>
            <BrandLogo onNavigate={onNavigate} variant="header" isDark={true} />
          </div>

          {/* Pass ID pill */}
          <div
            style={{
              background: "rgba(13,148,136,0.15)",
              border: "1.5px solid rgba(13,148,136,0.4)",
              borderRadius: 8,
              padding: "6px 14px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ fontSize: 9, color: "#5eead4", fontWeight: 700, letterSpacing: "1px", marginBottom: 2 }}>
              PASS ID
            </div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 15, letterSpacing: "1px" }}>
              {visitor.id}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: "1.5rem 1.75rem 1.5rem 2rem" }}>

          {/* Identity row */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: "1.25rem" }}>

            {/* Photo / Avatar */}
            <div style={{ flexShrink: 0 }}>
              {visitor.photo ? (
                <div
                  style={{
                    width: 84,
                    height: 100,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "2px solid #e2e8f0",
                  }}
                >
                  <img
                    src={visitor.photo}
                    alt={visitor.fullName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: 84,
                    height: 100,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #0f172a 0%, #1e3a4a 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #e2e8f0",
                  }}
                >
                  <span style={{ fontSize: 26, fontWeight: 900, color: "#2dd4bf", letterSpacing: "-1px" }}>
                    {initials}
                  </span>
                </div>
              )}
            </div>

            {/* Name & details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3
                style={{
                  fontSize: 19,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 3,
                  letterSpacing: "-0.4px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {visitor.fullName}
              </h3>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 10, letterSpacing: "0.3px" }}>
                {visitor.idType} · {visitor.idNumber}
              </div>

              {/* Detail chips */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  { icon: "👤", label: "Meeting", val: visitor.personToMeet },
                  { icon: "🏢", label: "Dept", val: visitor.department },
                  { icon: "🎯", label: "Purpose", val: visitor.purpose },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                    <span style={{ fontSize: 11 }}>{icon}</span>
                    <span style={{ color: "#94a3b8", fontWeight: 600, minWidth: 50 }}>{label}:</span>
                    <span
                      style={{
                        color: "#1e293b",
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Divider with label ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #e2e8f0)" }} />
            <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, letterSpacing: "1.5px" }}>CLEARANCE DETAILS</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #e2e8f0, transparent)" }} />
          </div>

          {/* ── Info grid + QR ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12 }}>

            {/* Info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", flex: 1 }}>
              {[
                { label: "VISIT DATE", val: visitor.visitDate, highlight: false },
                { label: "ENTRY TIME", val: visitor.checkInTime || "—", highlight: false },
                { label: "LOCATION", val: visitor.branch, highlight: false },
                { label: "PHONE", val: visitor.phone, highlight: false },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div style={{ fontSize: 8, color: "#94a3b8", fontWeight: 700, letterSpacing: "1px", marginBottom: 3 }}>
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#0f172a",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>

            {/* QR Code block */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  padding: 8,
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  background: "white",
                }}
              >
                <QRCode value={qrValue} size={88} />
              </div>
              <span style={{ fontSize: 8, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.5px" }}>
                SCAN TO VERIFY
              </span>
            </div>
          </div>
        </div>

        {/* ── FOOTER STATUS STRIP ── */}
        <div
          style={{
            background: "#f8fafc",
            padding: "0.85rem 1.75rem 0.85rem 2rem",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Barcode-style decorative lines */}
          <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {[3, 1, 4, 1, 5, 2, 3, 1, 4, 2, 3, 1, 2, 4, 1].map((h, i) => (
              <div
                key={i}
                style={{
                  width: i % 3 === 0 ? 2 : 1,
                  height: h * 4,
                  background: "#cbd5e1",
                  borderRadius: 1,
                }}
              />
            ))}
          </div>

          {/* Status badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: s.bg,
              border: `1.5px solid ${s.border}`,
              borderRadius: 20,
              padding: "5px 12px",
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: s.text, letterSpacing: "0.5px" }}>
              {s.label}
            </span>
          </div>
        </div>

        {/* ── Bottom holographic shimmer strip ── */}
        <div
          style={{
            height: 4,
            background:
              "linear-gradient(90deg, #0d9488, #0891b2, #06b6d4, #2dd4bf, #0d9488)",
            backgroundSize: "200% 100%",
            animation: "shimmerBar 3s linear infinite",
          }}
        />
      </div>

      {/* ── Action buttons ── */}
      <div
        className="no-print"
        style={{
          display: "flex",
          gap: 12,
          marginTop: "2rem",
          justifyContent: "center",
          flexWrap: "wrap",
          width: "100%",
          maxWidth: 440,
        }}
      >
        <button
          onClick={() => onNavigate("landing")}
          className="btn btn-secondary"
          style={{
            flex: 1,
            minWidth: 130,
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
            border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(15,23,42,0.12)",
            color: isDark ? "white" : "#0f172a",
          }}
        >
          ← Home
        </button>
        <button
          onClick={handlePrint}
          className="btn btn-primary"
          style={{
            flex: 1,
            minWidth: 130,
            background: "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)",
          }}
        >
          🖨 Print Pass
        </button>
        <button
          onClick={handleDownload}
          className="btn btn-primary"
          style={{
            flex: 1,
            minWidth: 130,
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          }}
        >
          ⬇ Download PNG
        </button>
        <button
          onClick={() => onNavigate("register")}
          className="btn btn-secondary"
          style={{
            flex: 1,
            minWidth: 130,
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.06)",
            border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(15,23,42,0.12)",
            color: isDark ? "white" : "#0f172a",
          }}
        >
          + New Visit
        </button>
      </div>
    </div>
  );
}

