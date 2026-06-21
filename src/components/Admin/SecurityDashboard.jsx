"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_VISITORS } from "../../constants/visitorConstants";
import BrandLogo from "../UI/BrandLogo";
import { useTheme } from "../../context/ThemeContext";
import QRScannerSim from "./QRScannerSim";

export default function SecurityDashboard({ onNavigate: externalOnNavigate }) {
  const router = useRouter();
  const onNavigate = externalOnNavigate || ((target) => {
    if (target === "landing") router.push("/");
    else router.push(`/${target}`);
  });

  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("scanner");

  // All visitors for today
  const visitorsToday = MOCK_VISITORS;

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
            <span>📱</span> QR Pass Scanner
          </button>
          <button 
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-3 p-3 rounded-xl transition font-semibold ${activeTab === 'logs' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <span>📋</span> Entry/Exit Logs
          </button>
          <button 
            onClick={() => setActiveTab("incidents")}
            className={`flex items-center gap-3 p-3 rounded-xl transition font-semibold text-red-400 hover:bg-red-950/30 ${activeTab === 'incidents' ? 'bg-red-900/50 border border-red-500' : ''}`}
          >
            <span>🚨</span> Report Incident
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
            <h1 className="text-3xl font-black tracking-tight">Security Command Center</h1>
            <p className="text-slate-500 font-medium">Verify identities and monitor premises access</p>
          </div>
          <div className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            Emergency Lockdown
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Active On Premises", val: visitorsToday.filter(v => v.status === 'checked-in').length, color: "text-green-500" },
            { label: "Expected Arrivals", val: visitorsToday.filter(v => v.status === 'pending').length, color: "text-blue-500" },
            { label: "Checked Out", val: visitorsToday.filter(v => v.status === 'checked-out').length, color: "text-slate-500" },
            { label: "High Risk Alerts", val: 0, color: "text-red-500" }
          ].map(s => (
            <div key={s.label} className={`p-6 rounded-2xl shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">{s.label}</h3>
              <p className={`text-4xl font-black mt-2 ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>

        {activeTab === "scanner" && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <h2 className="text-xl font-bold">QR Pass Verification</h2>
              <p className="text-slate-500 text-sm">Scan the visitor's digital pass or enter Pass ID manually.</p>
            </div>
            {/* Re-use the existing QRScannerSim or build a specialized one here. For now, use the sim. */}
            <QRScannerSim visitors={visitorsToday} onUpdate={() => {}} />
          </div>
        )}

        {activeTab === "logs" && (
          <div className={`rounded-2xl shadow-sm border overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <table className="w-full text-left">
              <thead className={`text-xs uppercase font-bold tracking-wider ${isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                <tr>
                  <th className="p-4">Visitor Identity</th>
                  <th className="p-4">ID Details</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Entry / Exit</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {visitorsToday.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                    <td className="p-4">
                      <div className="font-bold flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-xs">{v.fullName[0]}</div>
                        {v.fullName}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{v.idType}: {v.idNumber}</td>
                    <td className="p-4 text-sm">{v.purpose}</td>
                    <td className="p-4 text-sm">{v.checkInTime || "--:--"} / {v.checkOutTime || "--:--"}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${v.status === 'checked-in' ? 'bg-green-100 text-green-700' : v.status === 'checked-out' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>
                        {v.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded shadow text-xs font-bold">Verify</button>
                      <button className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded shadow text-xs font-bold">Blacklist</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
