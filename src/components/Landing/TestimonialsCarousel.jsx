"use client";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { fadeUpBounce } from "../../utils/animations";
import { MessageSquare } from "lucide-react";
import TextReveal from "../UI/TextReveal";

const testimonials = [
  { quote: "VisitorOS transformed our reception desk. QR check-ins cut wait times by 80%. Our security team loves the real-time dashboard.", name: "Nisha Varghese", role: "Head of Operations", company: "Globex Technologies", visitType: "VIP Visit", rating: 5 },
  { quote: "The webcam verification gives our building the identity security we needed. The analytics alone are worth the subscription.", name: "Praveen Kumar", role: "Chief of Safety", company: "ACME Labs", visitType: "Contractor", rating: 5 },
  { quote: "We onboarded 12 offices in a week. The multi-branch support is seamless and the audit logs have already helped us pass two compliance audits.", name: "Amir Khan", role: "Office Facility Manager", company: "Initech Offices", visitType: "Interview", rating: 5 },
  { quote: "The host pre-approval workflow is a game changer. Visitors are approved before they even arrive. Zero friction at the door.", name: "Priya Mehta", role: "VP of HR", company: "Vehement Corp", visitType: "Guest", rating: 5 },
  { quote: "We replaced three separate tools with VisitorOS. The ROI was clear in the first month. Exceptional product.", name: "Rajan Sood", role: "IT Director", company: "Hooli Technologies", visitType: "Vendor", rating: 5 },
];

// Duplicate for infinite scrolling
const marqueeItems = [...testimonials, ...testimonials, ...testimonials];

function Stars({ n }) {
  return (
    <div style={{ display: "flex", gap: 3, marginBottom: "12px" }}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} style={{ color: "#fbbf24", fontSize: 16 }}>★</span>
      ))}
    </div>
  );
}

export default function TestimonialsCarousel() {
  const { isDark } = useTheme();
  const [feedback, setFeedback] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      setSubmittedFeedback(true);
      setFeedback("");
      setTimeout(() => setSubmittedFeedback(false), 4000);
    }
  };

  return (
    <motion.section 
      variants={fadeUpBounce}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{ padding: "6rem 0", background: isDark ? "rgba(0,0,0,0.18)" : "rgba(247, 245, 240, 0.5)", backdropFilter: "blur(10px)", overflow: "hidden" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
        <motion.div variants={fadeUpBounce} style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center", background: isDark ? "rgba(212,137,26,0.12)" : "rgba(212,137,26,0.1)", border: `1px solid ${isDark ? "rgba(212,137,26,0.3)" : "rgba(212,137,26,0.25)"}`, borderRadius: 50, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: "#D4891A", marginBottom: 16 }}>
            <MessageSquare size={14} /> TESTIMONIALS & FEEDBACK
          </div>
          <TextReveal
            text="Trusted by security teams worldwide"
            tag="h2"
            style={{ fontSize: "clamp(1.8rem,3.5vw,2.4rem)", fontWeight: 800, letterSpacing: "-1px", color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 10 }}
          />
          <p style={{ color: isDark ? "rgba(250,246,240,0.6)" : "#5C4A35", fontSize: 14, maxWidth: 420, margin: "0 auto" }}>
            See why 500+ organizations choose VisitorOS for their front desk.
          </p>
        </motion.div>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div className="marquee-container" style={{ margin: "2rem 0" }}>
        <div className="marquee-content">
          {marqueeItems.map((t, i) => (
            <div
              key={i}
              style={{
                width: "350px",
                whiteSpace: "normal",
                background: isDark ? "rgba(20, 20, 25, 0.9)" : "rgba(255, 255, 255, 0.8)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(79,70,229,0.15)",
                borderRadius: "20px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                backdropFilter: "blur(12px)",
                flexShrink: 0
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Stars n={t.rating} />
                <span style={{ fontSize: "11px", fontWeight: "bold", padding: "4px 10px", borderRadius: "10px", background: isDark ? "rgba(212,137,26,0.15)" : "rgba(13,148,136,0.1)", color: isDark ? "#D4891A" : "#0d9488" }}>
                  {t.visitType}
                </span>
              </div>
              
              <p style={{ fontSize: 14, color: isDark ? "rgba(255,255,255,0.85)" : "rgba(15,23,42,0.8)", fontStyle: "italic", lineHeight: 1.6, flexGrow: 1, marginBottom: "1.5rem" }}>
                "{t.quote}"
              </p>
              
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: "50%", 
                  background: "linear-gradient(135deg, #D4891A, #C07810)", 
                  display: "flex", alignItems: "center", justifyContent: "center", 
                  fontSize: 14, fontWeight: 900, color: "white", flexShrink: 0 
                }}>
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: isDark ? "#FAF6F0" : "#1C1008" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#D4891A", marginTop: 2 }}>{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
        {/* Feedback Bar */}
        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(10px)",
            border: isDark ? "1px solid rgba(212,137,26,0.12)" : "1px solid rgba(212,137,26,0.15)",
            borderRadius: 50,
            padding: submittedFeedback ? "12px 24px" : "8px 8px 8px 24px",
            width: "100%",
            maxWidth: 550,
            transition: "all 0.3s ease"
          }}>
            {submittedFeedback ? (
              <span style={{ fontSize: 14, color: "#10b981", fontWeight: 600 }}>
                Thank you! Your feedback has been received.
              </span>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Share your experience with us..."
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleFeedbackSubmit()}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: isDark ? "white" : "#1C1008",
                    fontSize: 14,
                    minWidth: 200,
                  }}
                />
                <button 
                  onClick={handleFeedbackSubmit}
                  style={{
                    background: "linear-gradient(135deg, #D4891A, #C07810)",
                    color: "white",
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: 40,
                    fontSize: 13,
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(212,137,26,0.3)",
                    transition: "transform 0.2s, opacity 0.2s"
                  }} 
                  onMouseEnter={e => { e.target.style.opacity = 0.9; e.target.style.transform = "scale(1.02)"; }} 
                  onMouseLeave={e => { e.target.style.opacity = 1; e.target.style.transform = "scale(1)"; }}
                >
                  Submit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
