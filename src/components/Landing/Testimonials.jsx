"use client";
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './LandingPage.css';

export default function Testimonials() {
  const { isDark } = useTheme();

  return (
    <div className={`testimonials-wrapper ${isDark ? 'dark' : 'light'}`}>
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Security Managers Say</h2>
          <p>Loved by administration desks and safety coordinators.</p>
        </div>

        <div className="testimonials-grid">
          {[
            {
              quote: "VisitorOS has completely automated our visitor registration. The QR pass generator and print integration reduced front-desk queue delays by 70%.",
              author: "Nisha Varghese",
              role: "Head of Operations",
              company: "Globex Technologies"
            },
            {
              quote: "The webcam capture feature is brilliant. Being able to secure a live selfie checklist on visitor cards gives our office building high clearance security.",
              author: "Praveen Kumar",
              role: "Chief of Safety",
              company: "ACME Labs"
            },
            {
              quote: "The simulated scanner dashboard is exactly what our front security guards needed. Checking people in and out takes less than 3 seconds.",
              author: "Amir Khan",
              role: "Office Facility Manager",
              company: "Initech Offices"
            }
          ].map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-quote">"{t.quote}"</p>
              <div>
                <div className="testimonial-author">{t.author}</div>
                <div className="testimonial-role">{t.role} · {t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
