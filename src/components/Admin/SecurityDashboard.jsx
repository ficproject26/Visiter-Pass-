"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BrandLogo from "../UI/BrandLogo";
import { useTheme } from "../../context/ThemeContext";
import { useData } from "../../context/DataContext";
import { API_BASE_URL } from "../../config/api";
import QRScannerSim from "./QRScannerSim";

export default function SecurityDashboard({ onNavigate: externalOnNavigate }) {
  const router = useRouter();
  const onNavigate = externalOnNavigate || ((target) => {
    if (target === "landing") router.push("/");
    else router.push(`/${target}`);
  });

  const { isDark } = useTheme();
  const { visitors = [], refreshData } = useData();
  const [activeTab, setActiveTab] = useState("scanner");

  // Auto-refresh gate data every 5 seconds so security sees live host approval changes
  React.useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 5000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const handleUpdateVisitor = async (id, updatePayload) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/visitors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });
      if (res.ok) {
        refreshData();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to update visitor: ${errData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error("Failed to update visitor status:", err);
      alert("Network error: Could not reach backend server.");
    }
  };

  // Helper counts
  const checkedInCount = visitors.filter(v => (v.status || "").toUpperCase() === 'CHECKED-IN' || (v.status || "").toUpperCase() === 'CHECKED_IN').length;
  const pendingCount = visitors.filter(v => (v.approvalStatus || "").toUpperCase() === 'PENDING' || (v.status || "").toUpperCase() === 'PENDING').length;
  const approvedCount = visitors.filter(v => (v.approvalStatus || "").toUpperCase() === 'APPROVED').length;
  const checkedOutCount = visitors.filter(v => (v.status || "").toUpperCase() === 'CHECKED-OUT' || (v.status || "").toUpperCase() === 'CHECKED_OUT').length;

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans`}>
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col p-6 sticky top-0 h-screen shadow-2xl z-10 border-r border-slate-800">
        <BrandLogo onNavigate={onNavigate} variant="sidebar" isDark={true} />
        <div className="mt-8 flex flex-col gap-2 flex-1">
          <button 
            onClick={() => setActiveTab("scanner")}
            className={`flex items-center gap-3 p-3 rounded-xl transition font-semibold ${activeTab === 'scanner' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <span>📱</span> Gate Pass Verification
          </button>
          <button 
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-3 p-3 rounded-xl transition font-semibold ${activeTab === 'logs' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <span>📋</span> Entry/Exit Logs
          </button>
        </div>
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition font-semibold">
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Security Gate Command Center</h1>
            <p className="text-slate-500 font-medium">Verify Visitor Pass Codes (e.g. V129) & check Admin & Host Approval before allowing entry</p>
          </div>
          <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            Gate Terminal Active
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Active On Premises", val: checkedInCount, color: "text-green-500" },
            { label: "Approved Entry (Awaiting Gate)", val: approvedCount, color: "text-blue-500" },
            { label: "Pending Approval", val: pendingCount, color: "text-amber-500" },
            { label: "Checked Out Today", val: checkedOutCount, color: "text-slate-400" }
          ].map(s => (
            <div key={s.label} className={`p-6 rounded-2xl shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">{s.label}</h3>
              <p className={`text-4xl font-black mt-2 ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>

        {activeTab === "scanner" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold">Gate Visitor Verification</h2>
              <p className="text-slate-500 text-sm">Enter Visitor Pass Reference ID (e.g. <strong>V129</strong>) or scan QR code to check Admin & Host Approval.</p>
            </div>
            <QRScannerSim visitors={visitors} onUpdate={handleUpdateVisitor} />
          </div>
        )}

        {activeTab === "logs" && (
          <div className={`rounded-2xl shadow-sm border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <table className="w-full text-left">
              <thead className={`text-xs uppercase font-bold tracking-wider ${isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                <tr>
                  <th className="p-4">Pass ID</th>
                  <th className="p-4">Visitor Identity</th>
                  <th className="p-4">Host / Purpose</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4">Entry / Exit Log</th>
                  <th className="p-4">Gate Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {visitors.map(v => {
                  const appStatus = (v.approvalStatus || v.status || "PENDING").toUpperCase();
                  const gateStat = (v.status || "PENDING").toUpperCase();

                  return (
                    <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                      <td className="p-4 font-mono font-bold text-indigo-400">{v.id}</td>
                      <td className="p-4">
                        <div className="font-bold flex items-center gap-2">
                          {v.photo ? (
                            <img src={v.photo} alt={v.fullName} className="w-8 h-8 rounded-full object-cover border border-slate-600" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-xs font-bold">{v.fullName ? v.fullName[0] : "V"}</div>
                          )}
                          <div>
                            <div>{v.fullName}</div>
                            <div className="text-xs text-slate-500 font-normal">{v.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="font-semibold text-slate-300">{v.personToMeet} ({v.department || "Host"})</div>
                        <div className="text-xs text-slate-500">{v.purpose}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          appStatus === 'APPROVED' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                          appStatus === 'REJECTED' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                          'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          {appStatus}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-slate-400">
                        {v.checkInTime || "--:--"} / {v.checkOutTime || "--:--"}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          gateStat === 'CHECKED_IN' || gateStat === 'CHECKED-IN' ? 'bg-green-500/20 text-green-400' :
                          gateStat === 'CHECKED_OUT' || gateStat === 'CHECKED-OUT' ? 'bg-slate-700 text-slate-400' :
                          'bg-amber-500/20 text-amber-400'
                        }`}>
                          {gateStat}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
