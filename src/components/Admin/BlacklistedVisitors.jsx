"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { AlertTriangle, Search, Filter, ShieldAlert, FileText, Unlock } from 'lucide-react';

const mockBlacklist = [
  { id: 'BL-001', name: 'John Doe', reason: 'Repeatedly ignored security protocols in restricted zones.', dateAdded: '2026-05-12', addedBy: 'Security Team Alpha', riskLevel: 'High' },
  { id: 'BL-002', name: 'Jane Smith', reason: 'Expired vendor credentials used for unauthorized entry.', dateAdded: '2026-06-01', addedBy: 'Admin (System)', riskLevel: 'Medium' },
  { id: 'BL-003', name: 'Robert Johnson', reason: 'Aggressive behavior towards reception staff.', dateAdded: '2026-06-15', addedBy: 'HR Department', riskLevel: 'High' }
];

export default function BlacklistedVisitors() {
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");
  const [blacklist] = useState(mockBlacklist);

  const filteredList = blacklist.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}
    >
      {/* High Security Warning Header */}
      <div style={{ 
        background: isDark ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
        border: isDark ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid #fecaca",
        borderRadius: 24, padding: "24px 32px", display: "flex", alignItems: "flex-start", gap: 20
      }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <ShieldAlert size={28} />
        </div>
        <div>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 20, color: isDark ? "#fca5a5" : "#991b1b", fontWeight: 800 }}>Restricted Access Registry</h2>
          <p style={{ margin: 0, color: isDark ? "#f87171" : "#b91c1c", fontSize: 14, lineHeight: 1.5, opacity: 0.9 }}>
            Individuals listed below are permanently or temporarily banned from the premises. Any attempt to generate a pass for a blacklisted individual will trigger a high-priority security alert.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
          <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: isDark ? "#64748b" : "#94a3b8" }} />
          <input 
            type="text" 
            placeholder="Search restricted individuals..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px 12px 48px", borderRadius: 12,
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
              border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
              color: isDark ? "#f8fafc" : "#0f172a", fontSize: 14, outline: "none"
            }}
          />
        </div>
        <button style={{
          padding: "0 20px", borderRadius: 12, border: isDark ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid #fecaca", 
          background: isDark ? "rgba(239, 68, 68, 0.15)" : "#fee2e2",
          color: "#ef4444", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8, cursor: "pointer"
        }}>
          <AlertTriangle size={18} /> Add to Blacklist
        </button>
      </div>

      {/* Grid of Blacklisted Individuals */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 24 }}>
        <AnimatePresence>
          {filteredList.map((person) => (
            <motion.div
              key={person.id}
              variants={fadeUpBounce}
              style={{
                background: isDark ? "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))" : "#ffffff",
                backdropFilter: "blur(20px)",
                border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
                borderTop: "3px solid #ef4444",
                borderRadius: 20,
                padding: 24,
                boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.2)" : "0 10px 40px rgba(148,163,184,0.1)",
                display: "flex", flexDirection: "column"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: isDark ? "#334155" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: isDark ? "#94a3b8" : "#64748b" }}>
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? "#f8fafc" : "#0f172a" }}>{person.name}</h3>
                    <span style={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", fontWeight: 600 }}>ID: {person.id}</span>
                  </div>
                </div>
                <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: "uppercase" }}>
                  {person.riskLevel} Risk
                </div>
              </div>

              <div style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", borderRadius: 12, padding: 16, marginBottom: 20, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <FileText size={16} color={isDark ? "#64748b" : "#94a3b8"} style={{ marginTop: 2 }} flexShrink={0} />
                  <p style={{ margin: 0, fontSize: 13, color: isDark ? "#cbd5e1" : "#475569", lineHeight: 1.5 }}>
                    <strong style={{ color: isDark ? "#e2e8f0" : "#334155" }}>Reason: </strong>
                    {person.reason}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)", paddingTop: 16 }}>
                <div>
                  <span style={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", display: "block" }}>Added By</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#e2e8f0" : "#334155" }}>{person.addedBy}</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", display: "block" }}>Date</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#e2e8f0" : "#334155" }}>{person.dateAdded}</span>
                </div>
                <button style={{
                  background: "transparent", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)", borderRadius: 8, padding: "6px 12px",
                  color: isDark ? "#94a3b8" : "#64748b", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
                }}>
                  <Unlock size={14} /> Lift Ban
                </button>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
