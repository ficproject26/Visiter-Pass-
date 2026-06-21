"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUpBounce, slideInLeft, slideInRight, zeroGravityDrift } from "../../utils/animations";
import { useTheme } from "../../context/ThemeContext";
import ZeroGravityCard from "../UI/ZeroGravityCard";
import TextReveal from "../UI/TextReveal";
import MagneticButton from "../UI/MagneticButton";
import { Building2, ShieldCheck, Settings, Users } from "lucide-react";

const tabs = [
  {
    id: "reception", label: "Reception", icon: <Building2 size={16} />,
    title: "Reception Dashboard",
    desc: "Receptionists get a clean real-time view of all arrivals, pending approvals, and today's schedule.",
    highlights: ["Live visitor queue", "One-click check-in/out", "QR scanner integration", "Visitor history lookup"],
    mockup: [
      { label: "Today's Visitors", val: "42", sub: "+8 from yesterday", col: "#D4891A" },
      { label: "Pending Approval", val: "6",  sub: "3 awaiting host",   col: "#f59e0b" },
      { label: "Checked In Now",   val: "14", sub: "Active on premises",col: "#22c55e" },
      { label: "Checked Out",      val: "22", sub: "Departed today",    col: "#00B4D8" },
    ],
  },
  {
    id: "security", label: "Security", icon: <ShieldCheck size={16} />,
    title: "Security Dashboard",
    desc: "Security teams monitor entry/exit, scan QR passes, and receive instant alerts for anomalies.",
    highlights: ["QR pass scanner terminal", "Real-time alerts feed", "Overstay detection", "Photo ID verification"],
    mockup: [
      { label: "Active On-Site",  val: "14", sub: "Live occupancy",     col: "#22c55e" },
      { label: "Risk Flags",      val: "2",  sub: "Needs review",       col: "#e11d48" },
      { label: "Scans Today",     val: "67", sub: "Via QR terminal",    col: "#D4891A" },
      { label: "Alerts Sent",     val: "5",  sub: "Last 24 hours",      col: "#f59e0b" },
    ],
  },
  {
    id: "admin", label: "Admin", icon: <Settings size={16} />,
    title: "Admin Dashboard",
    desc: "Administrators manage all visitors, export data, configure rules, and oversee compliance.",
    highlights: ["Full visitor log", "CSV export", "Branch management", "Audit trail viewer"],
    mockup: [
      { label: "Total Records",  val: "3.2k", sub: "All time",          col: "#D4891A" },
      { label: "Organizations",  val: "12",   sub: "Active branches",   col: "#00B4D8" },
      { label: "Export Jobs",    val: "8",    sub: "This month",        col: "#8b5cf6" },
      { label: "Compliance",     val: "100%", sub: "GDPR status",       col: "#22c55e" },
    ],
  },
  {
    id: "hr", label: "HR", icon: <Users size={16} />,
    title: "HR Dashboard",
    desc: "HR teams track contractor visits, interview candidates, and manage visitor access policies.",
    highlights: ["Candidate visit tracking", "Contractor logs", "Access policy builder", "Department analytics"],
    mockup: [
      { label: "Interviews",     val: "18",  sub: "This week",          col: "#00B4D8" },
      { label: "Contractors",    val: "9",   sub: "On-site now",        col: "#D4891A" },
      { label: "Avg Visit Time", val: "47m", sub: "This month",         col: "#8b5cf6" },
      { label: "No-Shows",       val: "3",   sub: "This month",         col: "#e11d48" },
    ],
  },
];

export default function ProductShowcase() {
  const { isDark } = useTheme();
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <motion.section 
      variants={fadeUpBounce}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{ padding: "5rem 2rem", background: isDark ? "rgba(0,0,0,0.18)" : "rgba(247, 245, 240, 0.5)", backdropFilter: "blur(10px)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center", background: isDark ? "rgba(212,137,26,0.12)" : "rgba(212,137,26,0.1)", border: `1px solid ${isDark ? "rgba(212,137,26,0.3)" : "rgba(212,137,26,0.25)"}`, borderRadius: 50, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: "#D4891A", marginBottom: 16 }}>
            🖥️ PRODUCT SHOWCASE
          </div>
          <TextReveal
            text="A dashboard for every role"
            tag="h2"
            style={{ fontSize: "clamp(1.8rem,3.5vw,2.4rem)", fontWeight: 800, letterSpacing: "-1px", color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 10 }}
          />
          <p style={{ color: isDark ? "rgba(250,246,240,0.6)" : "#5C4A35", fontSize: 14, maxWidth: 480, margin: "0 auto" }}>
            Each team member gets a tailored view — purpose-built for their workflow.
          </p>
        </div>

        {/* Tab pills */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 36, flexWrap: "wrap" }}>
          {tabs.map((t, i) => (
            <MagneticButton key={t.id} strength={8} glowColor={"#D4891A"}>
              <button onClick={() => setActive(i)}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: "pointer", border: "1px solid", transition: "all 0.2s",
                  background: active === i ? "linear-gradient(135deg, #D4891A, #C07810)" : isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)",
                  borderColor: active === i ? "transparent" : isDark ? "rgba(255,255,255,0.1)" : "rgba(13,148,136,0.2)",
                  color: active === i ? "white" : isDark ? "rgba(255,255,255,0.65)" : "#475569",
                  boxShadow: "none",
                }}>
                <span>{t.icon}</span>{t.label}
              </button>
            </MagneticButton>
          ))}
        </div>

        {/* Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
          {/* Left: text */}
          <motion.div variants={slideInLeft}>
            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.5px", color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 12 }}>{tab.title}</h3>
            <p style={{ fontSize: 14.5, color: isDark ? "rgba(250,246,240,0.6)" : "#5C4A35", lineHeight: 1.7, marginBottom: 24 }}>{tab.desc}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tab.highlights.map((h, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #D4891A, #C07810)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>✓</div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: isDark ? "rgba(250,246,240,0.8)" : "#3D2B1A" }}>{h}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: mockup */}
          <motion.div variants={{ ...slideInRight, ...zeroGravityDrift }} className="scanline-overlay" style={{ borderRadius: 20, overflow: "hidden", border: isDark ? "1px solid rgba(212,137,26,0.2)" : "1px solid rgba(212,137,26,0.2)", boxShadow: "none", height: '100%', position: 'relative' }}>
            <ZeroGravityCard activeOffset={20} shadowScale={1.05}>
              <div style={{ background: isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.9)", height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Window chrome */}
                <div style={{ background: isDark ? "#041a19" : "#f0fdfa", padding: "10px 16px", display: "flex", alignItems: "center", gap: 6, borderBottom: isDark ? "1px solid rgba(212,137,26,0.18)" : "1px solid rgba(212,137,26,0.15)" }}>
                  {["#ff5f57","#ffbd2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                  <span style={{ marginLeft: 8, fontSize: 11, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.4)", fontWeight: 600 }}>VisitorOS — {tab.label}</span>
                </div>
                <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, flex: 1 }}>
                  {tab.mockup.map((m, i) => (
                    <div key={i} style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(13,148,136,0.04)", border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(212,137,26,0.15)", borderRadius: 12, padding: "1rem" }} data-atropos-offset="5">
                      <div style={{ fontSize: 10, fontWeight: 700, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.8)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{m.label}</div>
                      <div style={{ fontSize: 26, fontWeight: 900, color: m.col, letterSpacing: "-1px", lineHeight: 1 }}>{m.val}</div>
                      <div style={{ fontSize: 10, color: isDark ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.6)", marginTop: 4 }}>{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </ZeroGravityCard>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
