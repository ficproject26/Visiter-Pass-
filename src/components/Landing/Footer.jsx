"use client";
import React from 'react';
import BrandLogo from '../UI/BrandLogo';
import { useTheme } from '../../context/ThemeContext';
import './LandingPage.css';

export default function Footer({ onNavigate }) {
  const { isDark } = useTheme();

  return (
    <footer className={`landing-footer ${isDark ? 'dark' : 'light'}`}>
      <div className="footer-container">
        {/* Brand Info */}
        <div className="footer-brand">
          <div className="footer-logo-wrapper">
            <BrandLogo onNavigate={onNavigate} variant="sidebar" isDark={isDark} />
          </div>
          <p className="footer-desc">
            Secure front-desk clearance and log book tracking systems for global corporate workplaces.
          </p>
        </div>

        {/* Product links */}
        <div className="footer-column">
          <h5>Product</h5>
          <button className="footer-link" onClick={() => onNavigate("register")}>Register Portal</button>
          <button className="footer-link" onClick={() => onNavigate("admin")}>Live Dashboard</button>
          <button className="footer-link">QR Scanning Terminal</button>
        </div>

        {/* Resources links */}
        <div className="footer-column">
          <h5>Resources</h5>
          <button className="footer-link">Security Compliance</button>
          <button className="footer-link">Lobby Optimization</button>
          <button className="footer-link">CSV Integrations</button>
        </div>

        {/* Legal links */}
        <div className="footer-column">
          <h5>Legal</h5>
          <button className="footer-link">Privacy Policy</button>
          <button className="footer-link">Terms of Service</button>
          <button className="footer-link">GDPR Compliance</button>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="copyright">
          © 2026 Forge India Connect. All rights reserved.
        </span>
        <div className="social-links">
          {["𝕏", "💼", "✉️", "🐙"].map((icon, idx) => (
            <button
              key={idx}
              className="social-icon"
              aria-label={`Social link ${idx}`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
