"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function UnifiedLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin' || user.role === 'subadmin') {
        router.push("/admin-dashboard");
      } else if (user.role === 'hr') {
        router.push("/staff-dashboard");
      } else if (user.role === 'visitor') {
        router.push("/visitor-dashboard");
      } else {
        setError("Role-based access denied or invalid role dashboard.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)',
      }}
    >
      {/* Centered Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-[16px]">
        <div className="auth-card">
          {/* Header text inside card */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1e293b", margin: 0 }}>Corporate Login</h2>
            <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Enter credentials to access your dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Corporate Email */}
            <div className="form-group">
              <label htmlFor="email">
                Corporate Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="architect@firm.com"
                required
              />
            </div>

            {/* Password */}
            <div className="form-group mt-16">
              <label htmlFor="password">
                Password
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <span className="text-red-700 text-[11px] font-bold block text-left bg-white/80 px-3 py-1.5 rounded-lg border border-red-200 mt-[16px]">
                ⚠️ {error}
              </span>
            )}

            {/* Checkbox Agreement */}
            <div className="terms">
              <input
                type="checkbox"
                id="remember"
              />
              <label htmlFor="remember">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> & <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-1.5 font-bold">
                  Login <span className="text-lg leading-none font-bold">→</span>
                </span>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
