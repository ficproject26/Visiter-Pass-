"use client";
import React, { useState } from "react";
import BrandLogo from "../UI/BrandLogo";
import { useTheme } from "../../context/ThemeContext";
import { useRouter } from "next/navigation";

export default function AdminLogin({ onLogin, onNavigate: externalOnNavigate }) {
  const router = useRouter();
  const onNavigate = externalOnNavigate || ((target) => {
    if (target === "landing") router.push("/");
    else router.push(`/${target}`);
  });

  const [role, setRole] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isDark } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock passwords based on role
    const valid = (role === "admin" && password === "admin123") ||
                  (role === "hr" && password === "hr123") ||
                  (role === "security" && password === "sec123");
    
    if (valid) {
      onLogin(role);
    } else {
      setError("Incorrect password for the selected role");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <header className="p-6 flex justify-between items-center">
        <BrandLogo onNavigate={onNavigate} />
        <button onClick={() => onNavigate("landing")} className={`px-4 py-2 rounded-lg text-sm font-semibold border ${isDark ? 'text-slate-300 border-slate-700 hover:bg-slate-800' : 'text-slate-700 border-slate-300 hover:bg-white'} transition`}>
          ← Back to Home
        </button>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className={`w-full max-w-md p-10 rounded-3xl shadow-2xl border text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="w-20 h-20 mx-auto bg-teal-500/10 rounded-full flex items-center justify-center mb-6 text-4xl">
            🔒
          </div>
          <h1 className={`text-2xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Login</h1>
          <p className={`text-sm mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select your department and enter your PIN.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Department Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className={`w-full p-4 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none transition ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
              >
                <option value="admin">Super Admin</option>
                <option value="hr">Human Resources (HR)</option>
                <option value="security">Security / Reception</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Security PIN</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter password"
                className={`w-full p-4 rounded-xl border focus:ring-2 focus:ring-teal-500 outline-none text-center tracking-[0.2em] transition ${isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} ${error ? '!border-red-500' : ''}`}
                autoFocus
              />
              {error && <span className="text-red-500 text-sm mt-2 block font-medium">{error}</span>}
            </div>
            
            <button type="submit" className="w-full mt-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white p-4 rounded-xl font-bold shadow-lg shadow-teal-500/30 transition transform hover:-translate-y-0.5">
              Access Dashboard →
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
