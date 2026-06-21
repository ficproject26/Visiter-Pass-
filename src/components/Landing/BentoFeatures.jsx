"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpBounce } from "../../utils/animations";
import { useTheme } from "../../context/ThemeContext";
import { QrCode, BarChart, Camera, Bell, CheckCircle, IdCard, Activity, ClipboardList } from "lucide-react";
import ZeroGravityCard from "../UI/ZeroGravityCard";

const features = [
  {
    icon: <QrCode size={20} color="#D4891A" />, title: "QR Check-In",
    desc: "Instant QR code generation and scan-based entry — zero paper, zero delays.",
    size: "large", accent: "#D4891A",
    preview: (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(13,148,136,0.15)", border: "1px solid rgba(13,148,136,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⬛</div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#D4891A" }}>PASS ID: V-904</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Rohan Singhal · 10:15 AM</div>
          </div>
          <div style={{ marginLeft: "auto", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "2px 8px", fontSize: 9, fontWeight: 800, color: "#15803d" }}>✓ VALID</div>
        </div>
        <div style={{ height: 3, borderRadius: 2, background: "linear-gradient(90deg, #0d9488, #0891b2, #06b6d4)", backgroundSize: "200% 100%", animation: "shimmerBar 2s linear infinite" }} />
      </div>
    ),
  },
  {
    icon: <BarChart size={20} color="#00B4D8" />, title: "Visitor Analytics",
    desc: "Real-time dashboards with traffic trends, peak hours, and department insights.",
    size: "tall", accent: "#00B4D8",
    preview: (
      <div style={{ marginTop: 12 }}>
        {[{ label: "Today", pct: 85, val: "142" }, { label: "This Week", pct: 62, val: "847" }, { label: "This Month", pct: 44, val: "3.2k" }].map(r => (
          <div key={r.label} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>
              <span>{r.label}</span><span style={{ color: "#D4891A", fontWeight: 700 }}>{r.val}</span>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
              <div style={{ width: `${r.pct}%`, height: "100%", background: "linear-gradient(90deg,#0d9488,#0891b2)", borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <Camera size={20} color="#8b5cf6" />, title: "Face Verification",
    desc: "Live webcam capture embedded in passes for identity verification.",
    size: "small", accent: "#8b5cf6",
    preview: (
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        {["AM", "RS", "PK"].map((initials, i) => (
          <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, #0f172a, #1e3a4a)`, border: "2px solid rgba(139,92,246,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#a78bfa" }}>{initials}</div>
        ))}
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "2px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>+</div>
      </div>
    ),
  },
  {
    icon: <Bell size={20} color="#e11d48" />, title: "Security Alerts",
    desc: "Instant notifications for unauthorized access, overstay, and policy violations.",
    size: "small", accent: "#e11d48",
    preview: (
      <div style={{ marginTop: 10 }}>
        {[{ t: "Overstay Detected", s: "2m ago", c: "#fca5a5" }, { t: "Badge Expired", s: "5m ago", c: "#fcd34d" }].map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5, background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "4px 6px" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: a.c, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: a.c }}>{a.t}</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.35)" }}>{a.s}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <CheckCircle size={20} color="#22c55e" />, title: "Smart Approvals",
    desc: "One-click host approval via dashboard before visitor arrival.",
    size: "medium", accent: "#22c55e",
    preview: (
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <div style={{ flex: 1, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 16 }}>✓</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#22c55e", marginTop: 2 }}>APPROVE</div>
        </div>
        <div style={{ flex: 1, background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.25)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
          <div style={{ fontSize: 16 }}>✕</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#f87171", marginTop: 2 }}>REJECT</div>
        </div>
      </div>
    ),
  },
  {
    icon: <IdCard size={20} color="#D4891A" />, title: "Digital Visitor Passes",
    desc: "Professional enterprise-grade passes with QR codes, photos, and clearance details.",
    size: "medium", accent: "#D4891A",
    preview: (
      <div style={{ marginTop: 10, background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "none" }}>
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a4a)", padding: "6px 10px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: "#5eead4", fontSize: 7, fontWeight: 700 }}>VISITOR PASS</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 7 }}>V-904</span>
        </div>
        <div style={{ padding: "6px 10px", display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ width: 20, height: 24, borderRadius: 4, background: "linear-gradient(135deg,#0f172a,#1e3a4a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#D4891A", fontWeight: 900 }}>RS</div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#0f172a" }}>Rohan Singhal</div>
            <div style={{ fontSize: 7, color: "#94a3b8" }}>Interview · HR Dept</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Activity size={20} color="#06b6d4" />, title: "Real-Time Tracking",
    desc: "Live dashboard showing current occupancy, active check-ins, and location data.",
    size: "wide", accent: "#06b6d4",
    preview: (
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        {[{ label: "Active", val: "24", color: "#22c55e" }, { label: "Pending", val: "8", color: "#f59e0b" }, { label: "Today", val: "142", color: "#00B4D8" }].map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 2, paddingLeft: 8 }}>
          {[3,5,4,7,6,8,5,9,7,6,8,10].map((h, i) => (
            <div key={i} style={{ flex: 1, height: h * 4, background: i === 11 ? "#D4891A" : "rgba(13,148,136,0.3)", borderRadius: 2, transition: "height 0.3s" }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: <ClipboardList size={20} color="#f59e0b" />, title: "Audit Logs",
    desc: "Complete tamper-proof audit trails for compliance, investigations, and reporting.",
    size: "small", accent: "#f59e0b",
    preview: (
      <div style={{ marginTop: 8 }}>
        {["Check-In: V-901", "Approval: V-902", "Export: Admin"].map((l, i) => (
          <div key={i} style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: 6 }}>
            <span style={{ color: "#fbbf24" }}>▸</span>{l}
          </div>
        ))}
      </div>
    ),
  },
];

export default function BentoFeatures() {
  const { isDark } = useTheme();
  const headRef    = null;
  const [hovered, setHovered] = useState(null);

  const glass = (accent) => ({
    background: isDark
      ? `linear-gradient(135deg, rgba(13,148,136,0.06) 0%, rgba(8,145,178,0.03) 100%)`
      : `rgba(255,255,255,0.75)`,
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${isDark ? `rgba(${accent === "#D4891A" ? "13,148,136" : accent === "#00B4D8" ? "8,145,178" : accent === "#e11d48" ? "225,29,72" : "255,255,255"},0.15)` : "rgba(13,148,136,0.15)"}`,
    borderRadius: 20,
    padding: "1.5rem",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease",
    cursor: "default",
  });

  return (
    <motion.section 
      variants={fadeUpBounce}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{
        padding: "5rem 2rem",
        background: isDark ? "#08262b" : "#F0EDE6",
      }}
    >
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <motion.div variants={fadeUpBounce} style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: isDark ? "#6366F1" : "#0a3a42", border: "1px solid transparent", borderRadius: 50, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: isDark ? "#0B0F19" : "#F8FAFC", marginBottom: 16 }}>
            ⚡ FEATURE SUITE
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, letterSpacing: "-1px", color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 12 }}>
            Everything your enterprise needs
          </h2>
          <p style={{ color: isDark ? "rgba(250,246,240,0.6)" : "#5C4A35", fontSize: 15, maxWidth: 520, margin: "0 auto" }}>
            A complete visitor management platform built for security, compliance, and speed.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gridTemplateRows: "auto",
            gap: 16,
          }}
        >
          {features.map((f, i) => {
            const spanMap = { large: "span 5", tall: "span 4", small: "span 3", medium: "span 4", wide: "span 7" };
            const colSpan = spanMap[f.size] || "span 4";
            const isHov = hovered === i;

            return (
              <motion.div
                key={i}
                variants={fadeUpBounce}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  gridColumn: colSpan,
                  height: '100%',
                }}
              >
                <ZeroGravityCard activeOffset={20} shadowScale={1.03} style={{ height: '100%' }}>
                  <div style={{
                    ...glass(f.accent),
                    height: "100%",
                    transform: isHov ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
                    boxShadow: isHov ? `0 0 0 1px ${f.accent}44` : "none",
                  }}>
                    {/* Glow blob */}
                    <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${f.accent}22 0%, transparent 70%)`, pointerEvents: "none", transition: "opacity 0.25s", opacity: isHov ? 1 : 0.5 }} />

                    <div style={{ position: "relative", zIndex: 1 }} data-atropos-offset="2">
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: isDark ? `${f.accent}22` : `${f.accent}15`,
                          border: `1px solid ${f.accent}44`,
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                        }} data-atropos-offset="5">{f.icon}</div>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: isDark ? "#FAF6F0" : "#1C1008", margin: 0 }} data-atropos-offset="4">{f.title}</h3>
                      </div>
                      <p style={{ fontSize: 12, color: isDark ? "rgba(250,246,240,0.55)" : "#5C4A35", lineHeight: 1.6, margin: 0 }} data-atropos-offset="2">{f.desc}</p>
                      <div data-atropos-offset="8">
                        {f.preview}
                      </div>
                    </div>
                  </div>
                </ZeroGravityCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}



