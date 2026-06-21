"use client";
import React, { useState } from "react";
import { SUPER_ADMIN_NAV, SUB_ADMIN_NAV } from "../../constants/navigation";
import BrandLogo from "../UI/BrandLogo";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, LogOut, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SidebarNavigation({ activeTab, setActiveTab, onNavigate: externalOnNavigate, userRole = "superadmin", isOpen = true, onClose }) {
  const { isDark, toggle: toggleTheme } = useTheme();
  const router = useRouter();
  const onNavigate = externalOnNavigate || ((target) => {
    if (target === "landing") router.push("/");
    else router.push(`/${target}`);
  });
  const [expandedSections, setExpandedSections] = useState({ visitor_management: true });

  const navItems = userRole === "subadmin" ? SUB_ADMIN_NAV : SUPER_ADMIN_NAV;

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <aside
      className={`dash-sidebar${isOpen ? ' sidebar-open' : ''}`}
      style={{
        background: "#0f172a",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        zIndex: 50,
        transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      {/* Header */}
      <div style={{ padding: "24px 20px 16px" }}>
        {/* Force logo to be white since background is dark */}
        <BrandLogo onNavigate={onNavigate} variant="sidebar" isDark={true} />
      </div>

      {/* Navigation Scroll Area */}
      <div style={{ 
        flex: 1, 
        overflowY: "auto", 
        overflowX: "hidden", 
        padding: "0 12px",
        display: "flex",
        flexDirection: "column",
        gap: 4
      }} className="sidebar-scroll">
        
        {navItems.map((section) => {
          const isExpanded = expandedSections[section.id];
          const hasSubItems = section.subItems && section.subItems.length > 0;
          const Icon = section.icon;

          // Check if any child is active
          const isChildActive = hasSubItems && section.subItems.some(sub => sub.id === activeTab);
          const isDirectActive = activeTab === section.id && !hasSubItems;

          return (
            <div key={section.id} style={{ marginBottom: 4 }}>
              <button
                onClick={() => {
                  if (hasSubItems) {
                    toggleSection(section.id);
                  } else {
                    setActiveTab(section.id);
                  }
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: 0,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  transition: "all 0.2s ease",
                  background: isDirectActive 
                    ? "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)" 
                    : (isChildActive ? "rgba(79, 70, 229, 0.15)" : "transparent"),
                  color: (isDirectActive || isChildActive) 
                    ? (isDirectActive ? "#ffffff" : "#4f46e5") 
                    : "#94a3b8", // Forced dark theme nav text color
                }}
                onMouseEnter={e => {
                  if (!isDirectActive && !isChildActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#e2e8f0";
                  }
                }}
                onMouseLeave={e => {
                  if (!isDirectActive && !isChildActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#94a3b8";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon size={18} strokeWidth={2.5} />
                  <span>{section.title}</span>
                </div>
                {hasSubItems && (
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} />
                  </motion.div>
                )}
              </button>

              {/* Sub Items Accordion */}
              {hasSubItems && (
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "4px 0 4px 34px", display: "flex", flexDirection: "column", gap: 2 }}>
                        {section.subItems.map((sub) => {
                          const isSubActive = activeTab === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => setActiveTab(sub.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 16px",
                                borderRadius: 10,
                                border: 0,
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: 500,
                                textAlign: "left",
                                transition: "all 0.2s ease",
                                background: isSubActive 
                                  ? "rgba(79, 70, 229, 0.2)" 
                                  : "transparent",
                                color: isSubActive 
                                  ? "#4f46e5" 
                                  : "#64748b"
                              }}
                              onMouseEnter={e => {
                                if (!isSubActive) {
                                  e.currentTarget.style.color = "#e2e8f0";
                                }
                              }}
                              onMouseLeave={e => {
                                if (!isSubActive) {
                                  e.currentTarget.style.color = "#64748b";
                                }
                              }}
                            >
                              <div style={{ 
                                width: 4, height: 4, borderRadius: "50%", 
                                background: isSubActive ? "#4f46e5" : "transparent" 
                              }} />
                              {sub.title}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button
          onClick={() => onNavigate("landing")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "12px",
            borderRadius: 12,
            border: "1px solid rgba(239, 68, 68, 0.2)",
            background: "rgba(239, 68, 68, 0.05)",
            color: "#ef4444",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            transition: "all 0.2s ease"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)";
          }}
        >
          <LogOut size={16} />
          Logout Dashboard
        </button>
      </div>

      <style>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.35);
          border-radius: 10px;
          transition: background 0.2s ease;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
        /* Firefox */
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(99, 102, 241, 0.35) transparent;
        }
      `}</style>
    </aside>
  );
}
