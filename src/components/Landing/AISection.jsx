"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpBounce } from "../../utils/animations";
import { useTheme } from "../../context/ThemeContext";

const aiFeatures = [
  { icon: "🛡️", title: "AI Visitor Risk Assessment", desc: "Automatic risk scoring based on visit history, ID verification status, and behavioral patterns.", badge: "BETA", color: "#e11d48" },
  { icon: "🤖", title: "AI Identity Verification",   desc: "Computer vision cross-references webcam photo with ID documents for instant identity confirmation.", badge: "NEW",  color: "#D4891A" },
  { icon: "🔮", title: "Predictive Visitor Trends",  desc: "ML models forecast peak hours, staffing requirements, and resource allocation needs.", badge: "AI",   color: "#8b5cf6" },
  { icon: "💡", title: "Smart Security Alerts",      desc: "AI detects anomalies — overstays, tailgating, unusual access patterns — and notifies instantly.", badge: "LIVE",  color: "#f59e0b" },
  { icon: "📈", title: "Smart Analytics Insights",   desc: "Natural language summaries of visitor trends delivered as weekly executive briefings.", badge: "AI",   color: "#00B4D8" },
import { staggerContainer, fadeUpBounce } from "../../utils/animations";
import { useTheme } from "../../context/ThemeContext";

const aiFeatures = [
  { icon: "🛡️", title: "AI Visitor Risk Assessment", desc: "Automatic risk scoring based on visit history, ID verification status, and behavioral patterns.", badge: "BETA", color: "#e11d48" },
  { icon: "🤖", title: "AI Identity Verification",   desc: "Computer vision cross-references webcam photo with ID documents for instant identity confirmation.", badge: "NEW",  color: "#D4891A" },
  { icon: "🔮", title: "Predictive Visitor Trends",  desc: "ML models forecast peak hours, staffing requirements, and resource allocation needs.", badge: "AI",   color: "#8b5cf6" },
  { icon: "💡", title: "Smart Security Alerts",      desc: "AI detects anomalies — overstays, tailgating, unusual access patterns — and notifies instantly.", badge: "LIVE",  color: "#f59e0b" },
  { icon: "📈", title: "Smart Analytics Insights",   desc: "Natural language summaries of visitor trends delivered as weekly executive briefings.", badge: "AI",   color: "#00B4D8" },
];

export default function AISection() {
  const { isDark } = useTheme();
  const [hov, setHov] = useState(null);

  return (
    <motion.section 
      variants={fadeUpBounce}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{ padding: "5rem 2rem", position: "relative", overflow: "hidden", background: isDark ? "linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(13,148,136,0.05) 100%)" : "#F7F5F0" }}
    >
      {/* Aurora bg blobs */}
      <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <motion.div variants={fadeUpBounce} style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center", background: isDark ? "rgba(139,92,246,0.12)" : "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.25)", borderRadius: 50, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: "#8b5cf6", marginBottom: 16 }}>
            🤖 AI-POWERED FEATURES
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.4rem)", fontWeight: 800, letterSpacing: "-1px", color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 10 }}>
            <span style={{ display: "block" }}>Intelligence built into</span>
            <span className="hero-gradient-text">every check-in.</span>
          </h2>
          <p style={{ color: isDark ? "rgba(250,246,240,0.6)" : "#5C4A35", fontSize: 14, maxWidth: 480, margin: "0 auto" }}>
            VisitorOS Enterprise layers AI across the entire visitor lifecycle — from pre-arrival to post-visit analytics.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}
        >
          {aiFeatures.map((f, i) => (
            <motion.div key={i}
              variants={fadeUpBounce}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: isDark ? "rgba(255,220,150,0.05)" : "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(10px)",
                border: `1px solid ${hov === i ? f.color + "44" : isDark ? "rgba(255,255,255,0.07)" : "rgba(13,148,136,0.12)"}`,
                borderRadius: 18, padding: "1.5rem",
                backdropFilter: "blur(16px)",
                transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s",
                transform: hov === i ? "translateY(-5px)" : "none",
                boxShadow: hov === i ? `0 16px 36px rgba(0,0,0,0.18)` : "none",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${f.color}18, transparent 70%)`, opacity: hov === i ? 1 : 0.4, transition: "opacity 0.3s" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, position: "relative", zIndex: 1 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: isDark ? `${f.color}18` : `${f.color}12`, border: `1px solid ${f.color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{f.icon}</div>
                <span style={{ background: isDark ? `${f.color}22` : `${f.color}15`, border: `1px solid ${f.color}44`, color: f.color, fontSize: 9, fontWeight: 800, borderRadius: 6, padding: "3px 8px", letterSpacing: "0.5px" }}>{f.badge}</span>
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 8, position: "relative", zIndex: 1 }}>{f.title}</h4>
              <p style={{ fontSize: 12.5, color: isDark ? "rgba(250,246,240,0.55)" : "#5C4A35", lineHeight: 1.65, margin: 0, position: "relative", zIndex: 1 }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Enterprise tag */}
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: isDark ? "rgba(139,92,246,0.1)" : "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 50, padding: "8px 20px", fontSize: 12, fontWeight: 700, color: "#8b5cf6" }}>
            🏆 AI Features available on Professional & Enterprise plans
          </span>
        </div>
      </div>
    </motion.section>
  );
}
