"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./UI/ThemeToggle";
import BrandLogo from "./UI/BrandLogo";
import { useTheme } from "../context/ThemeContext";
import MetricsBar from "./Landing/MetricsBar";
import ParallaxHero from "./Landing/ParallaxHero";
import DemoModal from "./Landing/DemoModal";
import useSmoothScroll from "../hooks/useSmoothScroll";
import { useRouter } from 'next/navigation';
import './Landing/LandingPage.css';

export default function LandingPage() {
  const router = useRouter();

  const onNavigate = (target) => {
    if (target === "landing") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (target === "admin" || target === "login") {
      router.push("/login");
    } else if (target === "register") {
      router.push("/register");
    } else if (target === "status") {
      router.push("/check-status");
    } else {
      router.push(`/${target}`);
    }
  };

  const [showDemo, setShowDemo] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark } = useTheme();
  const { scrollProgress } = useSmoothScroll();

  return (
    <div className="landing-root" style={{ minHeight: "100vh", position: "relative" }}>

      {/* Scroll progress bar */}
      <div
        className="scroll-progress-bar"
        style={{
          position: 'fixed', top: 0, left: 0, height: 3, background: '#D4891A',
          zIndex: 1000, transform: `scaleX(${scrollProgress})`
        }}
      />

      {/* ─── NAVIGATION HEADER ─── */}
      <nav className={`landing-nav-container ${isDark ? 'dark' : 'light'}`}>
        <BrandLogo onNavigate={onNavigate} variant="landing" isDark={isDark} />

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: isDark ? '#fff' : '#000',
            cursor: 'pointer',
            padding: '8px',
            display: 'none'
          }}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className={`nav-actions ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ThemeToggle />
          <button
            onClick={() => onNavigate("check-status")}
            className={`btn nav-ghost-btn-container ${isDark ? 'dark' : 'light'}`}
            style={{ padding: "8px 16px" }}
          >
            Check Pass Status
          </button>
          <button
            onClick={() => onNavigate("register")}
            className={`btn nav-ghost-btn-container ${isDark ? 'dark' : 'light'}`}
            style={{ padding: "8px 16px" }}
          >
            Check-In Portal
          </button>
        </div>
      </nav>

      {/* ─── PARALLAX HERO ─── */}
      <ParallaxHero
        onNavigate={onNavigate}
        onDemo={() => setShowDemo(true)}
      />

      {/* ─── METRICS BAR ─── */}
      <MetricsBar />

      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
    </div>
  );
}
