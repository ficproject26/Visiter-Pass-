"use client";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import TextReveal from "../UI/TextReveal";
import MagneticButton from "../UI/MagneticButton";

const plans = [
  {
    name: "Starter", price: 29, period: "mo",
    desc: "Perfect for small offices and startups.",
    color: "#D4891A",
    features: ["Up to 200 visitors/month","QR Check-In & Pass Generation","Webcam Photo Capture","Basic Dashboard","CSV Export","Email Support"],
    cta: "Get Started", popular: false,
  },
  {
    name: "Professional", price: 79, period: "mo",
    desc: "For growing teams with advanced security needs.",
    color: "#00B4D8",
    features: ["Up to 2,000 visitors/month","All Starter features","Host Pre-Approval Workflows","Advanced Analytics","Multi-Branch Support","Audit Logs","Priority Support","Custom Branding"],
    cta: "Start Free Trial", popular: true,
  },
  {
    name: "Enterprise", price: null, period: null,
    desc: "Full-scale deployment for large organizations.",
    color: "#8b5cf6",
    features: ["Unlimited visitors","All Professional features","AI Risk Assessment","SSO & SAML Integration","ISO 27001 Compliance","Dedicated SLA 99.9%","24/7 Dedicated Support","Custom Integrations","On-Premise Option"],
    cta: "Contact Sales", popular: false,
  },
];

export default function PricingSection({ onNavigate }) {
  const { isDark } = useTheme();
  const [hov, setHov] = useState(null);

  return (
    <section style={{ padding: "5rem 2rem", background: isDark ? "rgba(0,0,0,0.18)" : "rgba(247, 245, 240, 0.5)", backdropFilter: "blur(10px)" }}>
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center", background: isDark ? "rgba(212,137,26,0.12)" : "rgba(212,137,26,0.1)", border: `1px solid ${isDark ? "rgba(212,137,26,0.3)" : "rgba(212,137,26,0.25)"}`, borderRadius: 50, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: "#D4891A", marginBottom: 16 }}>
            💳 PRICING
          </div>
          <TextReveal
            text="Simple, transparent pricing"
            tag="h2"
            style={{ fontSize: "clamp(1.8rem,3.5vw,2.4rem)", fontWeight: 800, letterSpacing: "-1px", color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 10 }}
          />
          <p style={{ color: isDark ? "rgba(250,246,240,0.6)" : "#5C4A35", fontSize: 14, maxWidth: 420, margin: "0 auto" }}>
            No hidden fees. Scale as you grow. Cancel anytime.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}>
          {plans.map((p, i) => (
            <div key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                borderRadius: 20,
                padding: "2rem",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s",
                transform: p.popular ? "scale(1.03)" : hov === i ? "translateY(-6px)" : "none",
                background: p.popular
                  ? isDark ? "linear-gradient(135deg, rgba(8,145,178,0.18), rgba(13,148,136,0.12))" : "linear-gradient(135deg, rgba(8,145,178,0.1), rgba(13,148,136,0.07))"
                  : isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
                border: p.popular ? `1.5px solid ${p.color}55` : isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(212,137,26,0.18)",
                boxShadow: p.popular ? `0 20px 48px rgba(8,145,178,0.2)` : hov === i ? "0 12px 32px rgba(0,0,0,0.15)" : "none",
                backdropFilter: "blur(16px)",
              }}
            >
              {p.popular && (
                <div style={{ position: "absolute", top: 16, right: 16, background: "linear-gradient(135deg, #D4891A, #C07810)", color: "white", fontSize: 10, fontWeight: 800, borderRadius: 20, padding: "3px 10px", letterSpacing: "0.5px" }}>
                  ⭐ POPULAR
                </div>
              )}

              {/* Glow */}
              <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle, ${p.color}18 0%, transparent 70%)`, pointerEvents: "none" }} />

              <div style={{ marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: p.color, letterSpacing: "0.5px", marginBottom: 6 }}>{p.name.toUpperCase()}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 8 }}>
                  {p.price ? (
                    <>
                      <span style={{ fontSize: "2.4rem", fontWeight: 900, color: isDark ? "#FAF6F0" : "#1C1008", letterSpacing: "-2px", lineHeight: 1 }}>${p.price}</span>
                      <span style={{ fontSize: 13, color: isDark ? "rgba(255,255,255,0.45)" : "rgba(15,23,42,0.45)", marginBottom: 4 }}>/{p.period}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: "1.8rem", fontWeight: 900, color: isDark ? "#FAF6F0" : "#1C1008", letterSpacing: "-1px", lineHeight: 1 }}>Custom</span>
                  )}
                </div>
                <p style={{ fontSize: 12.5, color: isDark ? "rgba(250,246,240,0.55)" : "#5C4A35", margin: 0 }}>{p.desc}</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: "1.75rem", position: "relative", zIndex: 1 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: isDark ? "rgba(255,255,255,0.75)" : "rgba(15,23,42,0.75)" }}>
                    <span style={{ color: p.color, fontWeight: 700, fontSize: 14 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>

              <MagneticButton strength={10} style={{ width: "100%" }}>
                <button
                  onClick={() => p.price ? onNavigate("register") : null}
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    background: p.popular ? `linear-gradient(135deg, ${p.color}, #0891b2)` : "transparent",
                    border: `1.5px solid ${p.color}`,
                    color: p.popular ? "white" : p.color,
                    padding: "12px",
                    fontSize: 14,
                    fontWeight: 700,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {p.cta}
                </button>
              </MagneticButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


