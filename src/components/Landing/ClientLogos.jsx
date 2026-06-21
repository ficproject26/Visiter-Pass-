"use client";
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './LandingPage.css';

export default function ClientLogos() {
  const { isDark } = useTheme();

  return (
    <section className={`client-logo-wall ${isDark ? 'dark' : 'light'}`}>
      <span className="client-logo-subtitle">
        Trusted by leading organizations worldwide
      </span>
      <div className="client-logo-grid">
        {["ACME CORP", "GLOBEX", "INITECH", "UMBRELLA INC", "HOOLI", "VEHEMENT"].map((logo) => (
          <span key={logo} className="client-logo-item">
            {logo}
          </span>
        ))}
      </div>
    </section>
  );
}
