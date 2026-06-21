"use client";
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './LandingPage.css';

export default function HowItWorks() {
  const { isDark } = useTheme();

  return (
    <div className={`how-it-works-wrapper ${isDark ? 'dark' : 'light'}`}>
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>Efficient Visitor Clearance in 3 Steps</h2>
          <p>From arrival to check-out, we keep your office flow smooth and secure.</p>
        </div>

        <div className="how-it-works-grid">
          {[
            { num: "01", title: "Pre-Register Portal", desc: "Visitor registers details and host selection from any device." },
            { num: "02", title: "Host Authorization", desc: "Hosts receive a check-in alert and approve/reject with one click." },
            { num: "03", title: "QR Scan Clear", desc: "Front desk scans the QR pass to instantly check-in and log the entry." }
          ].map((step) => (
            <div key={step.num} className="how-it-works-step">
              <div className="step-number">
                {step.num}
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
