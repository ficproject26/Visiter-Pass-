"use client";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { fadeUpBounce } from "../../utils/animations";
import { FileText, CheckCircle, IdCard, ShieldCheck, LogIn, LogOut, BarChart, Route } from "lucide-react";
import TextReveal from "../UI/TextReveal";

const steps = [
  { icon: FileText, title: "Registration",       desc: "Visitor submits details via web portal from any device.",         color: "#D4891A" },
  { icon: CheckCircle, title: "Host Approval",      desc: "Host receives alert and approves or rejects with one click.",      color: "#00B4D8" },
  { icon: IdCard, title: "QR Pass Generated",  desc: "Unique QR badge instantly created with visitor details.",          color: "#06b6d4" },
  { icon: ShieldCheck, title: "Security Verify",    desc: "Guard scans QR at gate — identity and clearance confirmed.",       color: "#D4891A" },
  { icon: LogIn, title: "Check-In",           desc: "Entry logged in real-time dashboard with timestamp.",              color: "#22c55e" },
  { icon: LogOut, title: "Check-Out",          desc: "Departure recorded, duration calculated, host notified.",          color: "#00B4D8" },
  { icon: BarChart, title: "Analytics",          desc: "Visit data feeds live reports, audit trails, and compliance logs.",color: "#D4891A" },
];

export default function VisitorJourney() {
  const { isDark } = useTheme();
  const [active, setActive] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let i = 0;
        const t = setInterval(() => {
          setActive(i);
          i++;
          if (i >= steps.length) clearInterval(t);
        }, 300);
      }
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.section 
      ref={ref} 
      variants={fadeUpBounce}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{ padding: "5rem 2rem", background: isDark ? "rgba(0,0,0,0.18)" : "rgba(247, 245, 240, 0.5)", backdropFilter: "blur(10px)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div variants={fadeUpBounce} style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center", background: isDark ? "rgba(212,137,26,0.12)" : "rgba(212,137,26,0.1)", border: `1px solid ${isDark ? "rgba(212,137,26,0.3)" : "rgba(212,137,26,0.25)"}`, borderRadius: 50, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: "#D4891A", marginBottom: 16 }}>
            <Route size={14} /> VISITOR JOURNEY
          </div>
          <TextReveal
            text="From arrival to analytics — seamlessly"
            tag="h2"
            style={{ fontSize: "clamp(1.8rem,3.5vw,2.4rem)", fontWeight: 800, letterSpacing: "-1px", color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 10 }}
          />
          <p style={{ color: isDark ? "rgba(250,246,240,0.6)" : "#5C4A35", fontSize: 14, maxWidth: 480, margin: "0 auto" }}>
            Every step of the visitor lifecycle is captured, secured, and logged automatically.
          </p>
        </motion.div>

        {/* Desktop timeline */}
        <div style={{ display: "flex", alignItems: "flex-start", overflowX: "auto", paddingBottom: "1rem", gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 0 0", minWidth: 100, position: "relative" }}>
              {i < steps.length - 1 && (
                <div style={{
                  position: "absolute", top: 23, left: "50%", width: "100%", height: 2,
                  background: i < active ? `linear-gradient(90deg, ${s.color}, ${steps[i+1].color})` : isDark ? "rgba(255,255,255,0.08)" : "rgba(13,148,136,0.15)",
                  transition: "background 0.5s ease",
                }} />
              )}
              <div style={{
                width: 46, height: 46, borderRadius: "50%", fontSize: 18, zIndex: 1, position: "relative",
                background: i <= active ? `linear-gradient(135deg, ${s.color}ee, ${s.color}88)` : isDark ? "rgba(255,255,255,0.05)" : "rgba(13,148,136,0.08)",
                border: `2px solid ${i <= active ? s.color : isDark ? "rgba(255,255,255,0.1)" : "rgba(13,148,136,0.2)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: i <= active ? `0 0 18px ${s.color}44` : "none",
                transform: i === active ? "scale(1.18)" : "scale(1)",
                transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              }}>
                {(() => {
                  const Icon = s.icon;
                  return <Icon size={20} color={i <= active ? "#FFFFFF" : s.color} />;
                })()}
              </div>
              <div style={{ marginTop: 10, textAlign: "center", padding: "0 4px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: i <= active ? s.color : isDark ? "#F7F5F0" : "rgba(15,23,42,0.3)", marginBottom: 4, transition: "color 0.4s" }}>{`0${i+1}`}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: i <= active ? (isDark ? "white" : "#0f172a") : isDark ? "rgba(255,255,255,0.35)" : "rgba(15,23,42,0.35)", marginBottom: 4, transition: "color 0.4s" }}>{s.title}</div>
                <div style={{ fontSize: 10.5, color: isDark ? "rgba(255,255,255,0.38)" : "rgba(15,23,42,0.45)", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}


