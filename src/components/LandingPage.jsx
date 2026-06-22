"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import QRCode from "./UI/QRCode";
import ThemeToggle from "./UI/ThemeToggle";
import BrandLogo from "./UI/BrandLogo";
import { useTheme } from "../context/ThemeContext";
import MetricsBar from "./Landing/MetricsBar";
import BentoFeatures from "./Landing/BentoFeatures";
import VisitorJourney from "./Landing/VisitorJourney";
import SecuritySection from "./Landing/SecuritySection";
import ProductShowcase from "./Landing/ProductShowcase";
import PricingSection from "./Landing/PricingSection";
import TestimonialsCarousel from "./Landing/TestimonialsCarousel";
import AdvancedFAQ from "./Landing/AdvancedFAQ";
import ParallaxHero from "./Landing/ParallaxHero";
import DemoModal from "./Landing/DemoModal";
import InteractiveBackground from "./UI/InteractiveBackground";

import useSmoothScroll from "../hooks/useSmoothScroll";

// Extracted Components

import HowItWorks from "./Landing/HowItWorks";
import BenefitsGrid from "./Landing/BenefitsGrid";
import Testimonials from "./Landing/Testimonials";
import CTASection from "./Landing/CTASection";
import Footer from "./Landing/Footer";

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
      router.push("/visitor-dashboard");
    } else if (target === "status") {
      router.push("/check-status");
    } else {
      router.push(`/${target}`);
    }
  };

  const [openFaq, setOpenFaq] = useState(null);
  const [showDemo, setShowDemo] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark } = useTheme();
  const { scrollProgress } = useSmoothScroll();

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqData = [
    {
      q: "How does the digital QR Pass work?",
      a: "When a visitor registers through the check-in portal, a unique pass ID and QR code are instantly generated. The receptionist scans this QR code at the desk (or inputs the ID) to instantly check the visitor in or out, automatically updating logs."
    },
    {
      q: "Can hosts approve visitors before their arrival?",
      a: "Yes! Visitors submit registration details which go into a pending approval state. Hosts can check their dashboard or receive a notification to pre-approve or reject the visitor prior to physical check-in."
    },
    {
      q: "Is there webcam verification support?",
      a: "Absolutely. The portal has built-in camera integration to snap a live photo of the visitor. This photo is embedded in the digital pass and remains on file for security compliance logs."
    },
    {
      q: "How can I export visitor records?",
      a: "Administrators can download the complete list of visitor entries directly from the dashboard in CSV format, which can be imported into Excel, Google Sheets, or other HR systems."
    }
  ];

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
            display: 'none' /* Will be shown in CSS on mobile */
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

          <button
            onClick={() => onNavigate("login")}
            className="btn"
            style={{
              padding: "8px 16px",
              backgroundColor: "#FFC72C",
              color: "#1E3A8A",
              fontWeight: 800,
              boxShadow: "0 4px 14px rgba(255, 199, 44, 0.3)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#ffd043"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#FFC72C"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Login
          </button>
        </div>
      </nav>

      {/* ─── PARALLAX HERO ─── */}
      <ParallaxHero
        onNavigate={onNavigate}
        onDemo={() => setShowDemo(true)}
      />

      {/* ─── CLIENT LOGO WALL ─── */}


      {/* ─── METRICS BAR ─── */}
      <MetricsBar />

      {/* ─── HOW IT WORKS ─── */}
      <HowItWorks />

      {/* ─── DETAILED BENEFITS GRID ─── */}
      <BenefitsGrid />

      {/* ═══ NEW PREMIUM SECTIONS ═══ */}
      <BentoFeatures />
      <ProductShowcase />
      <VisitorJourney />
      <SecuritySection />
      <TestimonialsCarousel />

      {/* ─── TESTIMONIALS SECTION ─── */}
      <Testimonials />

      {/* ─── FREQUENTLY ASKED QUESTIONS ─── */}
      <section className={`faq-section ${isDark ? 'dark' : 'light'}`}>
        <div className="faq-container">
          <div className="faq-header">
            <h2>Frequently Asked Questions</h2>
            <p>Have questions about security, data, or QR scanning?</p>
          </div>

          <div className="faq-list">
            {faqData.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`faq-item ${isDark ? 'dark' : 'light'}`}>
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="faq-toggle-btn"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span 
                      className="faq-icon" 
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                      aria-hidden="true"
                    >
                      ＋
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION BANNER ─── */}
      <CTASection onNavigate={onNavigate} />

      {/* Section divider */}
      <div className="section-divider" />

      {/* Footer horizon glow */}
      <div className="footer-horizon" />

      {/* ─── ENTERPRISE FOOTER ─── */}
      <Footer onNavigate={onNavigate} />

      {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
    </div>
  );
}
