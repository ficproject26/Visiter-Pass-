"use client";
import React from "react";

export default function AnalyticsPanel({ visitors = [] }) {
  // Compute metrics
  const byDept = {};
  const byPurpose = {};
  const byBranch = {};
  
  visitors.forEach(v => {
    byDept[v.department] = (byDept[v.department] || 0) + 1;
    byPurpose[v.purpose] = (byPurpose[v.purpose] || 0) + 1;
    byBranch[v.branch] = (byBranch[v.branch] || 0) + 1;
  });

  const deptData = Object.entries(byDept).sort((a, b) => b[1] - a[1]);
  const purposeData = Object.entries(byPurpose).sort((a, b) => b[1] - a[1]);
  const branchData = Object.entries(byBranch).sort((a, b) => b[1] - a[1]);

  const maxDept = deptData[0]?.[1] || 1;
  const maxPurpose = purposeData[0]?.[1] || 1;

  const chartColors = [
    "#0d9488", // Teal
    "#0891b2", // Cyan/Sky
    "#f43f5e", // Rose
    "#8b5cf6", // Violet
    "#f59e0b", // Amber
    "#C084FC", // Teal-light
    "#3b82f6", // Blue
    "#a855f7"  // Purple
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }} className="animate-fade-in-up">
      
      {/* Department Distribution */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>Visitors by Department</h3>
          <p style={{ fontSize: 12, color: "#64748b" }}>Live headcount distribution per office department</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {deptData.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No data recorded</div>
          ) : (
            deptData.map(([dept, count], idx) => {
              const percentage = Math.round((count / visitors.length) * 100);
              return (
                <div key={dept}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                    <span style={{ color: "#334155", fontWeight: 600 }}>{dept}</span>
                    <span style={{ color: "#64748b", fontWeight: 500 }}>{count} ({percentage}%)</span>
                  </div>
                  <div style={{ height: 8, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                    <div 
                      style={{ 
                        height: "100%", 
                        width: `${(count / maxDept) * 100}%`, 
                        background: chartColors[idx % chartColors.length], 
                        borderRadius: 10, 
                        transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)" 
                      }} 
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Purpose of Visit Distribution */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>Primary Visit Purposes</h3>
          <p style={{ fontSize: 12, color: "#64748b" }}>Breakdown of reasons for visitor appointments</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {purposeData.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No data recorded</div>
          ) : (
            purposeData.map(([purpose, count], idx) => {
              const pct = Math.round((count / visitors.length) * 100);
              const color = chartColors[idx % chartColors.length];
              return (
                <div 
                  key={purpose} 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "10px 14px", 
                    borderRadius: 10, 
                    background: "#f8fafc",
                    borderLeft: `4px solid ${color}`
                  }}
                >
                  <span style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>{purpose}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color }}>{count}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>({pct}%)</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Office Locations */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>Traffic by Branch</h3>
          <p style={{ fontSize: 12, color: "#64748b" }}>Distribution of traffic among office locations</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {branchData.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No data recorded</div>
          ) : (
            branchData.map(([branch, count]) => {
              const pct = Math.round((count / visitors.length) * 100);
              return (
                <div 
                  key={branch} 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "12px 6px", 
                    borderBottom: "1px solid #f1f5f9" 
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14 }}>📍</span>
                    <span style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>{branch}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{count}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>({pct}%)</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Status Highlights */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>Status Breakdown</h3>
          <p style={{ fontSize: 12, color: "#64748b" }}>Log summary showing clearance states</p>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Checked In", key: "checked-in", color: "#16a34a", bg: "#f0fdf4" },
            { label: "Checked Out", key: "checked-out", color: "#475569", bg: "#f1f5f9" },
            { label: "Pending Desk Clear", key: "pending", color: "#e11d48", bg: "#fff1f2" }
          ].map(({ label, key, color, bg }) => {
            const count = visitors.filter(v => v.status === key).length;
            const pct = visitors.length ? Math.round((count / visitors.length) * 100) : 0;
            return (
              <div 
                key={key} 
                style={{ 
                  background: bg, 
                  borderRadius: 12, 
                  padding: "12px 16px", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center" 
                }}
              >
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>{count}</div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color, opacity: 0.35 }}>
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

