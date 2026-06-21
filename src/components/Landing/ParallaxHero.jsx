"use client";
import { useState, useEffect } from "react";
import Atropos from "atropos/react";
import "atropos/css";
import QRCode from "../UI/QRCode";
import { motion } from "framer-motion";
import TextReveal from "../UI/TextReveal";
import MagneticButton from "../UI/MagneticButton";

/* ── floating idle animation via CSS ── */
const FLOAT_STYLE = `
@keyframes cardFloat {
  0%,100% { transform: translateY(0px) rotate(0deg); }
  25%      { transform: translateY(-10px) rotate(0.4deg); }
  75%      { transform: translateY(5px) rotate(-0.4deg); }
}
@keyframes glowPulseCard {
  0%,100% { opacity: 0.55; }
  50%      { opacity: 0.85; }
}
@keyframes scanLine {
  0%   { top: 0; opacity: 1; }
  80%  { top: 100%; opacity: 0.6; }
  100% { top: 100%; opacity: 0; }
}
@keyframes particleDrift {
  0%   { transform: translateY(0) scale(1); opacity: 0.7; }
  50%  { opacity: 0.3; }
  100% { transform: translateY(-60px) scale(0.6); opacity: 0; }
}
@keyframes shimmerBar {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
@keyframes blinkCursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.hero-gradient-text {
  white-space: nowrap;
  font-size: clamp(2rem, 7vw, 4rem);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -2px;
  background: linear-gradient(90deg, #818CF8, #C084FC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-cursor {
  display: inline-block;
  width: 5px;
  height: clamp(2rem, 7vw, 4rem);
  background-color: #818CF8;
  margin-left: 6px;
  animation: blinkCursor 1s step-end infinite;
  border-radius: 2px;
  vertical-align: middle;
}
.hero-layout {
  display: grid;
  grid-template-columns: minmax(400px, 1fr) minmax(320px, 450px);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  position: relative;
  z-index: 10;
}
.hero-center {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.hero-pass-card-outer {
  transform: perspective(1000px) rotateY(-8deg);
  transform-origin: center right;
  width: 100%;
  max-width: 360px;
}
.hero-pass-side {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  height: 100%;
  min-height: 420px;
}
@media (max-width: 1100px) {
  .hero-layout {
    grid-template-columns: 1fr;
    gap: 48px;
    padding: 0 0.5rem;
  }
  .hero-layout-spacer { display: none; }
  .hero-pass-side {
    justify-content: center;
    min-height: auto;
  }
  .hero-pass-card-outer {
    transform: none !important;
    max-width: 340px;
    margin: 0 auto;
  }
}
`;

/* ── static particles ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i, x: (i * 43) % 100, y: (i * 67) % 100,
  size: 2 + (i % 3) * 1.5,
  color: i % 2 === 0 ? "#818CF8" : "#C084FC",
  delay: (i * 0.4) % 3,
  dur: 2.5 + (i % 3),
}));

const MARQUEE_PHRASES = [
  "Let's connect.",
];

const Typewriter = ({ phrases }) => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    const i = loopNum % phrases.length;
    const fullText = phrases[i];

    let speed = isDeleting ? 40 : 100;
    let timer;

    if (!isDeleting && text === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      timer = setTimeout(() => { }, 500);
    } else {
      timer = setTimeout(() => {
        setText(fullText.substring(0, text.length + (isDeleting ? -1 : 1)));
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, phrases]);

  return (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      <span className="hero-gradient-text">{text}</span>
      <span className="hero-cursor"></span>
    </span>
  );
};

export default function ParallaxHero({ onNavigate, onDemo }) {
  const [hovered, setHovered] = useState(false);

  const QUOTES = [
    "“Connection is the energy that exists between people when they feel seen, heard, and valued.” — Brené Brown",
    "“Alone we can do so little; together we can do so much.” — Helen Keller",
    "“Coming together is a beginning; keeping together is progress; working together is success.” — Henry Ford",
    "“Great things in business are never done by one person. They're done by a team of people.” — Steve Jobs",
    "“Unity is strength... when there is teamwork and collaboration, wonderful things can be achieved.” — Mattie Stepanek",
    "“The strength of the team is each individual member. The strength of each member is the team.” — Phil Jackson"
  ];
  const fourHoursInMs = 4 * 60 * 60 * 1000;
  const quoteIndex = Math.floor(Date.now() / fourHoursInMs) % QUOTES.length;
  const activeQuote = QUOTES[quoteIndex];

  return (
    <>
      <style>{FLOAT_STYLE}</style>

      {/* ════════════════ HERO SHELL ════════════════ */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        background: "transparent",
        padding: "5rem 1.5rem",
      }}>
        {/* ── Background mesh gradient ── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 120% 70% at 50% -10%, #0d2035 0%, #0B1020 60%)" }} />
          <div style={{ position: "absolute", top: "-20%", left: "-15%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(129, 140, 248,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(192, 132, 252,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
          {/* Grid mesh */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(129, 140, 248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(129, 140, 248,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", opacity: 0.6 }} />
        </div>

        {/* ── Floating particles ── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
          {PARTICLES.map(p => (
            <div key={p.id} style={{
              position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size, borderRadius: "50%",
              background: p.color, opacity: 0.5,
              animation: `particleDrift ${p.dur}s ${p.delay}s ease-in infinite`,
              filter: "blur(0.5px)",
            }} />
          ))}
        </div>

        {/* ── Geometric accents ── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "8%", right: "8%", width: 80, height: 80, borderRadius: "50%", border: "1px solid rgba(129, 140, 248,0.15)" }} />
          <div style={{ position: "absolute", top: "10.5%", right: "10.5%", width: 44, height: 44, borderRadius: "50%", border: "1px solid rgba(129, 140, 248,0.22)" }} />
          <div style={{ position: "absolute", bottom: "12%", left: "4%", width: 28, height: 28, border: "1px solid rgba(129, 140, 248,0.14)", transform: "rotate(45deg)" }} />
          {[0, 1, 2, 3].map(i => <div key={i} style={{ position: "absolute", left: `${3 + i * 2}%`, top: "55%", width: 4, height: 4, borderRadius: "50%", background: "rgba(129, 140, 248,0.18)" }} />)}
        </div>

        {/* ══════════════ LAYOUT: text left | pass right ══════════════ */}
        <div className="hero-layout">

          {/* ── LEFT COPY ── */}
          <motion.div
            className="hero-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div style={{ marginBottom: "1.4rem", width: "100%" }}>
              <TextReveal
                text="Welcome to"
                tag="h1"
                style={{ fontSize: "clamp(2rem, 7vw, 4rem)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-2px", color: "#F8FAFC", margin: 0 }}
                delay={200}
              />
              <TextReveal
                text="Forge India"
                tag="h1"
                style={{ fontSize: "clamp(2rem, 7vw, 4rem)", fontWeight: 900, lineHeight: 1.08, letterSpacing: "-2px", color: "#F8FAFC", margin: 0 }}
                delay={505}
              />
              <Typewriter phrases={MARQUEE_PHRASES} />
            </div>

            <p style={{
              fontSize: "1.1rem",
              lineHeight: 1.78,
              maxWidth: 520,
              marginBottom: "2.5rem",
              color: "#5eead4",
              fontStyle: "italic",
              fontWeight: 500,
              textShadow: "0 0 10px rgba(94, 234, 212, 0.25)"
            }}>
              {activeQuote}
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: "2.5rem", justifyContent: "flex-start" }}>
              <MagneticButton strength={12} glowColor="#FFC72C">
                <motion.button onClick={() => onNavigate("register")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ padding: "14px 32px", fontSize: 15, borderRadius: 12, fontWeight: 800, cursor: "pointer", border: "none", background: "#FFC72C", color: "#1E3A8A" }}
                >
                  Start Free Check-In →
                </motion.button>
              </MagneticButton>

            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-start" }}>
              {[["50K+", "Visitors/mo"], ["500+", "Orgs"], ["99.9%", "Uptime"], ["10M+", "Records"]].map(([v, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(129, 140, 248,0.14)", borderRadius: 50, padding: "5px 13px" }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: "#818CF8" }}>{v}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(248,250,252,0.45)" }}>{l}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT SIDE: 3D PARALLAX PASS ── */}
          <motion.div
            className="hero-pass-side"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div style={{
              position: "absolute", width: 320, height: 320, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(129, 140, 248,0.12) 0%, transparent 70%)",
              filter: "blur(50px)", top: "5%", left: "50%", transform: "translateX(-50%)",
              animation: "glowPulseCard 4s ease-in-out infinite", pointerEvents: "none",
            }} />

            <div className="hero-pass-card-outer">
              <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                  width: "100%",
                  animation: hovered ? "none" : "cardFloat 6s ease-in-out infinite",
                }}
              >
                <Atropos
                  activeOffset={50}
                  shadowScale={1.08}
                  rotateXMax={14}
                  rotateYMax={14}
                  highlight={true}
                  shadow={true}
                  style={{ width: "100%" }}
                >
                  <div style={{
                    background: "white", borderRadius: 20, overflow: "hidden",
                    boxShadow: "0 32px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(129, 140, 248,0.2)",
                    position: "relative",
                  }}>
                    {/* Scan line overlay */}
                    <div style={{
                      position: "absolute", left: 0, right: 0, height: 2,
                      background: "linear-gradient(90deg, transparent, rgba(129, 140, 248,0.6), transparent)",
                      animation: "scanLine 3s ease-in-out infinite", zIndex: 20, pointerEvents: "none",
                    }} />

                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: "linear-gradient(180deg,#818CF8,#C084FC)", zIndex: 2 }} data-atropos-offset="5" />

                    <div style={{
                      background: "linear-gradient(135deg,#0f172a 0%,#1e3a4a 100%)",
                      padding: "1.1rem 1.25rem 1.1rem 1.6rem",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      position: "relative", overflow: "hidden",
                    }} data-atropos-offset="8">
                      <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,rgba(129, 140, 248,0.25) 0%,transparent 70%)" }} />
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(129, 140, 248,0.15)", border: "1px solid rgba(129, 140, 248,0.35)", borderRadius: 4, padding: "2px 7px", marginBottom: 5 }}>
                          <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22c55e" }} />
                          <span style={{ color: "#5eead4", fontSize: 8, fontWeight: 700, letterSpacing: "1.5px" }}>VISITOR PASS</span>
                        </div>
                        <div style={{ color: "white", fontWeight: 800, fontSize: 14 }}>Forge India Connect</div>
                      </div>
                      <div style={{ background: "rgba(129, 140, 248,0.12)", border: "1.5px solid rgba(129, 140, 248,0.4)", borderRadius: 7, padding: "5px 11px", position: "relative", zIndex: 1 }} data-atropos-offset="12">
                        <div style={{ fontSize: 8, color: "#5eead4", fontWeight: 700, letterSpacing: "1px", marginBottom: 1 }}>PASS ID</div>
                        <div style={{ color: "white", fontWeight: 800, fontSize: 13, letterSpacing: "1px" }}>V-904</div>
                      </div>
                    </div>

                    <div style={{ padding: "1.1rem 1.25rem 1.1rem 1.6rem" }} data-atropos-offset="6">
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: "0.9rem" }}>
                        <div style={{
                          width: 64, height: 78, borderRadius: 10,
                          background: "linear-gradient(135deg,#0f172a,#1e3a4a)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: "2px solid #e2e8f0", flexShrink: 0,
                          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        }} data-atropos-offset="15">
                          <span style={{ fontSize: 22, fontWeight: 900, color: "#818CF8", letterSpacing: "-1px" }}>RS</span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 800, color: "#1C1008", margin: "0 0 2px", letterSpacing: "-0.3px" }}>Rohan Singhal</h4>
                          <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginBottom: 8 }}>Aadhaar · 1234-5678-9012</div>
                          {[
                            { icon: "👤", l: "Meeting", v: "Vikram Nair" },
                            { icon: "🏢", l: "Dept", v: "HR" },
                            { icon: "🎯", l: "Purpose", v: "Interview" },
                          ].map(({ icon, l, v }) => (
                            <div key={l} style={{ display: "flex", gap: 5, fontSize: 11, marginBottom: 3, alignItems: "center" }}>
                              <span style={{ fontSize: 10 }}>{icon}</span>
                              <span style={{ color: "#94a3b8", fontWeight: 600, minWidth: 42 }}>{l}:</span>
                              <span style={{ color: "#1e293b", fontWeight: 600 }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.9rem" }}>
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,transparent,#e2e8f0)" }} />
                        <span style={{ fontSize: 8, color: "#94a3b8", fontWeight: 700, letterSpacing: "1.5px" }}>CLEARANCE DETAILS</span>
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,#e2e8f0,transparent)" }} />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 10 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", flex: 1 }}>
                          {[["VISIT DATE", "15-Jun-2026"], ["ENTRY TIME", "10:15 AM"], ["LOCATION", "HQ Office"], ["PHONE", "9123456780"]].map(([l, v]) => (
                            <div key={l}>
                              <div style={{ fontSize: 7, color: "#94a3b8", fontWeight: 700, letterSpacing: "1px", marginBottom: 2 }}>{l}</div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#1C1008" }}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }} data-atropos-offset="18">
                          <div style={{ padding: 6, border: "1.5px solid #e2e8f0", borderRadius: 8, background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                            <QRCode value="VOS:V-904:Rohan Singhal:2026-06-15" size={60} fill="#0f172a" />
                          </div>
                          <span style={{ fontSize: 7, color: "#94a3b8", fontWeight: 700, letterSpacing: "0.5px" }}>SCAN TO VERIFY</span>
                        </div>
                      </div>
                    </div>

                    <div style={{
                      background: "#FAF6F0", padding: "0.65rem 1.25rem 0.65rem 1.6rem",
                      borderTop: "1px solid #f1f5f9", display: "flex",
                      justifyContent: "space-between", alignItems: "center",
                    }} data-atropos-offset="4">
                      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                        {[3, 1, 4, 1, 5, 2, 3, 1, 4].map((h, i) => (
                          <div key={i} style={{ width: i % 3 === 0 ? 2 : 1, height: h * 3, background: "#cbd5e1", borderRadius: 1 }} />
                        ))}
                      </div>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 20, padding: "4px 10px", fontSize: 9, fontWeight: 800, color: "#15803d" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                        CHECKED IN
                      </span>
                    </div>

                    <div style={{ height: 4, background: "linear-gradient(90deg,#818CF8,#C084FC,#06b6d4,#2dd4bf,#818CF8)", backgroundSize: "200% 100%", animation: "shimmerBar 3s linear infinite" }} />
                  </div>
                </Atropos>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
