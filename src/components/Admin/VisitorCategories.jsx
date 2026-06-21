"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpBounce } from '../../utils/animations';
import { useTheme } from '../../context/ThemeContext';
import { Plus, Edit2, Shield, Clock, Users, Briefcase, Star, Settings } from 'lucide-react';

const mockCategories = [
  { id: 1, name: 'Guest', description: 'Standard visitors, personal visits, general inquiries.', icon: Users, defaultPassLength: '24 Hours', accessLevel: 'Basic', color: '#3b82f6' },
  { id: 2, name: 'Vendor', description: 'Delivery personnel, maintenance workers, contractors.', icon: Briefcase, defaultPassLength: '12 Hours', accessLevel: 'Restricted', color: '#f59e0b' },
  { id: 3, name: 'VIP', description: 'Executives, investors, special invitees.', icon: Star, defaultPassLength: '48 Hours', accessLevel: 'All Access', color: '#8b5cf6' },
  { id: 4, name: 'Interviewee', description: 'Job applicants and candidates.', icon: Shield, defaultPassLength: '8 Hours', accessLevel: 'Basic', color: '#10b981' },
];

export default function VisitorCategories() {
  const { isDark } = useTheme();
  const [categories] = useState(mockCategories);

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, color: isDark ? "#f8fafc" : "#0f172a", fontWeight: 800 }}>Visitor Categories</h2>
          <p style={{ margin: "4px 0 0 0", color: isDark ? "#94a3b8" : "#64748b", fontSize: 14 }}>Configure default permissions and pass validity for different visitor types.</p>
        </div>
        <button style={{
          padding: "10px 20px", borderRadius: 12, border: "none", background: "#4f46e5",
          color: "white", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
          boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
        }}>
          <Plus size={18} /> New Category
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              variants={fadeUpBounce}
              style={{
                background: isDark ? "rgba(30, 41, 59, 0.7)" : "#ffffff",
                backdropFilter: "blur(20px)",
                border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.04)",
                borderRadius: 24,
                padding: 24,
                boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.2)" : "0 10px 40px rgba(148,163,184,0.1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ 
                  width: 50, height: 50, borderRadius: 16, background: isDark ? `${cat.color}20` : `${cat.color}15`, 
                  display: "flex", alignItems: "center", justifyContent: "center", color: cat.color 
                }}>
                  <Icon size={24} />
                </div>
                <button style={{
                  background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  border: "none", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  color: isDark ? "#cbd5e1" : "#475569", cursor: "pointer"
                }}>
                  <Edit2 size={16} />
                </button>
              </div>

              <h3 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 700, color: isDark ? "#f8fafc" : "#0f172a" }}>{cat.name}</h3>
              <p style={{ margin: 0, fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", lineHeight: 1.5, minHeight: 40 }}>{cat.description}</p>

              <div style={{ marginTop: 24, borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", display: "flex", alignItems: "center", gap: 6 }}><Clock size={14} /> Default Pass Length</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#e2e8f0" : "#334155" }}>{cat.defaultPassLength}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", display: "flex", alignItems: "center", gap: 6 }}><Settings size={14} /> Access Level</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: cat.accessLevel === 'All Access' ? '#10b981' : isDark ? "#e2e8f0" : "#334155" }}>{cat.accessLevel}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
