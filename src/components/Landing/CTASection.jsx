"use client";
import React from 'react';
import { motion } from "framer-motion";
import { scaleUp } from "../../utils/animations";
import { useTheme } from '../../context/ThemeContext';
import './LandingPage.css';

export default function CTASection({ onNavigate }) {
  const { isDark } = useTheme();

  return (
    <section className="cta-section">
      <motion.div
        variants={scaleUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className={`cta-card ${isDark ? 'dark' : 'light'}`}
      >
        <h2>Ready to upgrade your visitor book?</h2>
        <p>
          Set up VisitorOS for your lobby today. It takes less than a minute to check in your first visitor.
        </p>

        <div className="cta-buttons">
          <button
            onClick={() => onNavigate("register")}
            className="btn cta-btn-primary"
            style={{
              backgroundColor: "#FFC72C",
              color: "#1E3A8A",
              fontWeight: 800,
              boxShadow: "0 4px 14px rgba(255, 199, 44, 0.3)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#ffd043"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#FFC72C"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            Start Free Check-In
          </button>
        </div>
      </motion.div>
    </section>
  );
}
