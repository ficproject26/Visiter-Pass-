"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { Search, Filter, Printer, Share2, ShieldCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

// Simulated QR Code Graphic
const QRCodeMockup = ({ isDark }) => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="12" fill={isDark ? "#1e293b" : "#f8fafc"} />
    <path fillRule="evenodd" clipRule="evenodd" d="M20 20H40V40H20V20ZM25 25H35V35H25V25Z" fill={isDark ? "#94a3b8" : "#475569"}/>
    <path fillRule="evenodd" clipRule="evenodd" d="M60 20H80V40H60V20ZM65 25H75V35H65V25Z" fill={isDark ? "#94a3b8" : "#475569"}/>
    <path fillRule="evenodd" clipRule="evenodd" d="M20 60H40V80H20V60ZM25 65H35V75H25V65Z" fill={isDark ? "#94a3b8" : "#475569"}/>
    <rect x="60" y="60" width="10" height="10" fill={isDark ? "#94a3b8" : "#475569"} />
    <rect x="75" y="60" width="5" height="10" fill={isDark ? "#94a3b8" : "#475569"} />
    <rect x="60" y="75" width="20" height="5" fill={isDark ? "#94a3b8" : "#475569"} />
    <rect x="45" y="20" width="10" height="20" fill={isDark ? "#94a3b8" : "#475569"} />
    <rect x="20" y="45" width="20" height="10" fill={isDark ? "#94a3b8" : "#475569"} />
    <rect x="60" y="45" width="20" height="10" fill={isDark ? "#94a3b8" : "#475569"} />
    <rect x="45" y="45" width="10" height="35" fill={isDark ? "#94a3b8" : "#475569"} />
  </svg>
);

const VisitorPassCard = ({ visitor, isDark }) => {
  const getStatusConfig = (status) => {
    switch(status?.toLowerCase()) {
      case 'checked-in': return { color: '#10b981', bg: '#dcfce7', text: 'Active Pass', icon: CheckCircle2 };
      case 'checked-out': return { color: '#64748b', bg: '#f1f5f9', text: 'Expired', icon: Clock };
      case 'pending': default: return { color: '#f59e0b', bg: '#fef3c7', text: 'Pending Entry', icon: AlertCircle };
    }
  };

  const statusConfig = getStatusConfig(visitor.status);
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      variants={fadeUpBounce}
      style={{
        background: isDark ? "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))" : "linear-gradient(135deg, #ffffff, #f8fafc)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.04)",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 10px 40px rgba(148,163,184,0.15)",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease"
      }}
      whileHover={{ y: -5, boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.5)" : "0 20px 40px rgba(148,163,184,0.25)" }}
    >
      {/* Card Header */}
      <div style={{ 
        padding: "16px 20px", 
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheck size={18} color="#4f46e5" />
          <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? "#e2e8f0" : "#334155", letterSpacing: "0.5px" }}>
            VISITOR PASS
          </span>
        </div>
        <div style={{ 
          background: isDark ? `${statusConfig.color}20` : statusConfig.bg, 
          color: statusConfig.color, 
          padding: "4px 10px", 
          borderRadius: 20, 
          fontSize: 11, 
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 4
        }}>
          <StatusIcon size={12} />
          {statusConfig.text}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: "24px 20px", display: "flex", gap: 20, flex: 1 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: "0 0 4px 0", fontSize: 20, fontWeight: 800, color: isDark ? "#f8fafc" : "#0f172a" }}>
            {visitor.fullName}
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", fontWeight: 500 }}>
            {visitor.visitorType || "Guest"} • {visitor.visitorId || "V-Pending"}
          </p>

          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <span style={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Host</span>
              <p style={{ margin: "2px 0 0 0", fontSize: 14, color: isDark ? "#e2e8f0" : "#334155", fontWeight: 600 }}>{visitor.personToMeet}</p>
            </div>
            <div>
              <span style={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Purpose</span>
              <p style={{ margin: "2px 0 0 0", fontSize: 14, color: isDark ? "#e2e8f0" : "#334155", fontWeight: 600 }}>{visitor.purpose}</p>
            </div>
          </div>
        </div>

        {/* QR & Photo Column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {visitor.photoUrl ? (
            <img 
              src={visitor.photoUrl} 
              alt={visitor.fullName} 
              style={{ width: 80, height: 80, borderRadius: 16, objectFit: "cover", border: isDark ? "2px solid rgba(255,255,255,0.1)" : "2px solid rgba(0,0,0,0.1)" }}
            />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: 16, background: isDark ? "#334155" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: isDark ? "#94a3b8" : "#64748b", border: isDark ? "2px solid rgba(255,255,255,0.1)" : "2px solid rgba(0,0,0,0.1)" }}>
              {visitor.fullName.charAt(0)}
            </div>
          )}
          <QRCodeMockup isDark={isDark} />
        </div>
      </div>

      {/* Card Footer Actions */}
      <div style={{ 
        padding: "16px 20px", 
        borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12
      }}>
        <button style={{
          padding: "8px", borderRadius: 12, border: "none", background: isDark ? "rgba(79, 70, 229, 0.1)" : "#e0e7ff",
          color: "#4f46e5", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer"
        }}>
          <Printer size={16} /> Print
        </button>
        <button style={{
          padding: "8px", borderRadius: 12, border: "none", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          color: isDark ? "#cbd5e1" : "#475569", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer"
        }}>
          <Share2 size={16} /> Share
        </button>
      </div>
    </motion.div>
  );
};

export default function VisitorPassesList({ visitors = [], forcedFilter = null, hideFilterDropdown = false }) {
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(forcedFilter || "all");

  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = v.fullName?.toLowerCase().includes(search.toLowerCase()) || 
                          v.visitorId?.toLowerCase().includes(search.toLowerCase());
    
    const targetStatus = forcedFilter || statusFilter;
    const matchesStatus = targetStatus === "all" || v.status?.toLowerCase() === targetStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      style={{ display: "flex", flexDirection: "column", gap: 24 }}
    >
      {/* Header & Controls */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        flexWrap: "wrap", 
        gap: 16,
        background: isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(16px)",
        padding: "16px 24px",
        borderRadius: 20,
        border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
        boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.03)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 300 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: isDark ? "#64748b" : "#94a3b8" }} />
            <input 
              type="text" 
              placeholder="Search passes by visitor name or ID..." 
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
          
          {!hideFilterDropdown && (
            <div style={{ position: "relative" }}>
              <Filter size={18} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: isDark ? "#64748b" : "#94a3b8", pointerEvents: "none" }} />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  padding: "12px 36px 12px 42px", borderRadius: 12,
                  background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                  border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
                  color: isDark ? "#f8fafc" : "#0f172a", fontSize: 14, outline: "none", cursor: "pointer",
                  appearance: "none"
                }}
              >
                <option value="all">All Passes</option>
                <option value="checked-in">Active (Checked-In)</option>
                <option value="pending">Pending</option>
                <option value="checked-out">Expired</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Grid of Passes */}
      {filteredVisitors.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          <AnimatePresence>
            {filteredVisitors.map((visitor, idx) => (
              <VisitorPassCard key={visitor.id || idx} visitor={visitor} isDark={isDark} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "64px 20px", color: isDark ? "#64748b" : "#94a3b8" }}>
          <AlertCircle size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
          <h3 style={{ fontSize: 18, color: isDark ? "#e2e8f0" : "#334155" }}>No passes found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </motion.div>
  );
}
