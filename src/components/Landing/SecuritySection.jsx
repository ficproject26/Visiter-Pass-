"use client";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpBounce, slideInLeft, slideInRight, zeroGravityFloat } from "../../utils/animations";
import { Lock, User, ClipboardList, Shield, Award, Cloud } from "lucide-react";
import ZeroGravityCard from "../UI/ZeroGravityCard";
import TextReveal from "../UI/TextReveal";

const items = [
  { icon: <Lock size={22} color="#D4891A" />, title: "AES-256 Encryption",    desc: "All visitor data encrypted at rest and in transit using military-grade AES-256 standards.", badge: "FIPS 140-2" },
  { icon: <User size={22} color="#D4891A" />, title: "Role-Based Access",      desc: "Fine-grained permissions — receptionists, guards, admins, and HR each see only what they need.", badge: "RBAC" },
  { icon: <ClipboardList size={22} color="#D4891A" />, title: "Audit Trails",           desc: "Every action is logged with timestamp, user ID, and IP address. Tamper-proof and exportable.", badge: "IMMUTABLE" },
  { icon: <Shield size={22} color="#D4891A" />, title: "GDPR Compliant",        desc: "Built-in data retention policies, right-to-erasure workflows, and consent management.", badge: "GDPR" },
  { icon: <Award size={22} color="#D4891A" />, title: "ISO 27001 Standards",    desc: "Information security management aligned with ISO/IEC 27001:2022 enterprise requirements.", badge: "ISO 27001" },
  { icon: <Cloud size={22} color="#D4891A" />, title: "Secure Cloud Storage",   desc: "Data stored in geo-redundant, SOC 2 Type II certified cloud infrastructure with 99.9% uptime.", badge: "SOC 2" },
];

export default function SecuritySection() {
  const { isDark } = useTheme();

  return (
    <section style={{ padding: "5rem 2rem", background: isDark ? "linear-gradient(135deg, rgba(13,148,136,0.05) 0%, rgba(8,145,178,0.03) 100%)" : "rgba(255,255,255,0.4)", backdropFilter: "blur(10px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="security-grid-main">

          {/* Left text */}
          <motion.div 
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div style={{ display: "inline-flex", gap: 8, alignItems: "center", background: isDark ? "rgba(225,29,72,0.12)" : "rgba(225,29,72,0.07)", border: "1px solid rgba(225,29,72,0.25)", borderRadius: 50, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: "#e11d48", marginBottom: 20 }}>
              <Lock size={14} /> ENTERPRISE SECURITY
            </div>
            <div style={{ marginBottom: 16, lineHeight: 1.2 }}>
              <TextReveal
                text="Security-first,"
                tag="h2"
                style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, letterSpacing: "-1px", color: isDark ? "#FAF6F0" : "#1C1008", margin: 0 }}
              />
              <TextReveal
                text="compliance by default."
                tag="h2"
                className="security-gradient-text"
                style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, letterSpacing: "-1px", margin: 0 }}
                delay={300}
              />
            </div>
            <p style={{ color: isDark ? "rgba(250,246,240,0.6)" : "#5C4A35", fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
              VisitorOS is architected for enterprise environments where security isn't optional. Every feature is built around protecting your visitors, your staff, and your data.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["GDPR", "ISO 27001", "SOC 2", "FIPS 140-2"].map(b => (
                <span key={b} style={{ background: isDark ? "rgba(13,148,136,0.15)" : "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.3)", borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 800, color: "#D4891A", letterSpacing: "0.5px" }}>{b}</span>
              ))}
            </div>
          </motion.div>

          {/* Right grid */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="security-grid-cards"
          >
            {items.map((item, i) => (
              <motion.div key={i} variants={{ ...fadeUpBounce, ...zeroGravityFloat }} style={{ height: "100%" }}>
                <ZeroGravityCard activeOffset={15} shadowScale={1.03} style={{ height: "100%" }}>
                  <div style={{
                    background: isDark ? "rgba(255,220,150,0.05)" : "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(10px)",
                    border: isDark ? "1px solid rgba(212,137,26,0.12)" : "1px solid rgba(212,137,26,0.15)",
                    borderRadius: 14, padding: "1.1rem", height: "100%"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }} data-atropos-offset="3">
                      <span style={{ fontSize: 22 }}>{item.icon}</span>
                      <span style={{ background: isDark ? "rgba(13,148,136,0.15)" : "rgba(13,148,136,0.1)", border: "1px solid rgba(212,137,26,0.3)", borderRadius: 6, padding: "2px 6px", fontSize: 8, fontWeight: 800, color: "#D4891A", letterSpacing: "0.5px" }}>{item.badge}</span>
                    </div>
                    <h4 style={{ fontSize: 12, fontWeight: 800, color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 4 }} data-atropos-offset="2">{item.title}</h4>
                    <p style={{ fontSize: 11, color: isDark ? "rgba(250,246,240,0.5)" : "#5C4A35", lineHeight: 1.5, margin: 0 }} data-atropos-offset="1">{item.desc}</p>
                  </div>
                </ZeroGravityCard>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}



