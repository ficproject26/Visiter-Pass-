"use client";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import TextReveal from "../UI/TextReveal";

const faqs = [
  { cat: "General", q: "How does QR Check-In work?",            a: "When a visitor registers, a unique QR code is generated. The receptionist scans it at the desk to instantly check in or out, logging the entry in real-time." },
  { cat: "General", q: "Can hosts approve visitors in advance?", a: "Yes. Visitors enter a pending state after registering. Hosts receive a notification and can approve or reject before the visitor arrives." },
  { cat: "Security", q: "How is visitor data secured?",          a: "All data is encrypted at rest with AES-256 and in transit with TLS 1.3. Access is role-based, and all actions produce tamper-proof audit logs." },
  { cat: "Security", q: "Are we GDPR compliant using VisitorOS?",a: "Yes. VisitorOS includes data retention policies, right-to-erasure workflows, consent collection, and a dedicated DPA available for Enterprise customers." },
  { cat: "Features", q: "Is webcam capture supported?",          a: "Absolutely. The portal has built-in camera integration to snap a live photo. This photo is embedded in the pass and stored in compliance logs." },
  { cat: "Features", q: "Can I export visitor records?",         a: "Administrators can download the full visitor log as CSV from the dashboard, importable into Excel, Google Sheets, or HR systems." },
  { cat: "Pricing",  q: "Can I switch plans later?",             a: "Yes — upgrade or downgrade at any time. Billing is prorated automatically. No long-term contracts required." },
  { cat: "Pricing",  q: "Is there a free trial?",                a: "Yes, the Professional plan includes a 14-day free trial with full features and no credit card required." },
];

const cats = ["All", ...Array.from(new Set(faqs.map(f => f.cat)))];

export default function AdvancedFAQ() {
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(null);

  const filtered = faqs.filter(f =>
    (cat === "All" || f.cat === cat) &&
    (!search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <section style={{ padding: "5rem 2rem", background: isDark ? "rgba(0,0,0,0.18)" : "rgba(247, 245, 240, 0.5)", backdropFilter: "blur(10px)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center", background: isDark ? "rgba(212,137,26,0.12)" : "rgba(212,137,26,0.1)", border: `1px solid ${isDark ? "rgba(212,137,26,0.3)" : "rgba(212,137,26,0.25)"}`, borderRadius: 50, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: "#D4891A", marginBottom: 16 }}>
            ❓ FAQ
          </div>
          <TextReveal
            text="Frequently asked questions"
            tag="h2"
            style={{ fontSize: "clamp(1.8rem,3.5vw,2.4rem)", fontWeight: 800, letterSpacing: "-1px", color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 10 }}
          />
          <p style={{ color: isDark ? "rgba(250,246,240,0.6)" : "#5C4A35", fontSize: 14 }}>Have questions? We have answers.</p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..." className="form-input"
            style={{ paddingLeft: 40, background: isDark ? "rgba(255,255,255,0.04)" : "white", border: isDark ? "1px solid rgba(212,137,26,0.2)" : "1px solid rgba(212,137,26,0.2)", color: isDark ? "#FAF6F0" : "#1C1008" }}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: "5px 14px", borderRadius: 50, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1px solid", transition: "all 0.2s",
                background: cat === c ? "linear-gradient(135deg, #D4891A, #C07810)" : isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)",
                borderColor: cat === c ? "transparent" : isDark ? "rgba(255,255,255,0.1)" : "rgba(13,148,136,0.2)",
                color: cat === c ? "white" : isDark ? "rgba(255,255,255,0.6)" : "#475569",
              }}>
              {c}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem", color: isDark ? "#F7F5F0" : "rgba(15,23,42,0.35)", fontSize: 14 }}>No questions match your search.</div>
          )}
          {filtered.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ background: isDark ? "rgba(255,220,150,0.05)" : "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(10px)", border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(13,148,136,0.14)", borderRadius: 12, overflow: "hidden", backdropFilter: "blur(10px)", transition: "border-color 0.2s", borderColor: isOpen ? "rgba(13,148,136,0.35)" : undefined }}>
                <button onClick={() => setOpen(isOpen ? null : i)}
                  style={{ width: "100%", background: "transparent", border: 0, padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: "#D4891A", background: "rgba(13,148,136,0.12)", border: "1px solid rgba(212,137,26,0.2)", borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap" }}>{f.cat}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, textAlign: "left", color: isDark ? "#FAF6F0" : "#1C1008" }}>{f.q}</span>
                  </div>
                  <span style={{ fontSize: 20, color: "#D4891A", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)", flexShrink: 0 }}>＋</span>
                </button>
                <div className={`faq-answer-wrap ${open === i ? 'open' : 'closed'}`}>
                  <div style={{ padding: 16, paddingTop: 0, fontSize: 14, color: isDark ? "rgba(250,246,240,0.6)" : "#5C4A35", lineHeight: 1.6 }}>
                    {f.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


