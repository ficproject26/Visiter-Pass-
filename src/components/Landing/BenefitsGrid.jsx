"use client";
import React from 'react';
import { Shield, Zap, Camera, BarChart, Save, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpBounce } from "../../utils/animations";
import { useTheme } from '../../context/ThemeContext';
import TiltCard from '../UI/TiltCard';
import './LandingPage.css';

export default function BenefitsGrid() {
  const { isDark } = useTheme();

  return (
    <motion.section 
      variants={fadeUpBounce}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={`benefits-section ${isDark ? 'dark' : 'light'}`}
    >
      <div className="benefits-container">
        <div className="section-header">
          <h2>Built to Enhance Your Office Security</h2>
          <p>A modern enterprise front desk requires more than paper sheets.</p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="benefits-grid"
        >
          {[
            { icon: <Shield size={28} className="benefit-icon" />, title: "Compliant Logs", desc: "Keep verified logs of ID cards, phone numbers, and check-in times to maintain high security standards." },
            { icon: <Zap size={28} className="benefit-icon" />, title: "Instant QR Badges", desc: "Provide high-contrast vector passes for fast visual checks and scanning desk clearances." },
            { icon: <Camera size={28} className="benefit-icon" />, title: "Webcam Selfie Checks", desc: "Snapping a live photo at registration secures identity records and speeds up security confirmations." },
            { icon: <BarChart size={28} className="benefit-icon" />, title: "Interactive Analytics", desc: "Visualize traffic spikes, peak days, branch distributions, and host department bookings." },
            { icon: <Save size={28} className="benefit-icon" />, title: "Data Persistence", desc: "Fully client-saved storage logs, ready to export into standard CSV logs for offline audits." },
            { icon: <Lock size={28} className="benefit-icon" />, title: "Secure Privacy", desc: "All details remain securely encrypted in your browser’s storage system—zero third-party leakage." },
          ].map((benefit, i) => (
            <motion.div 
              key={i}
              variants={fadeUpBounce}
            >
              <TiltCard className="benefit-card tilt-benefit-card">
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="benefit-icon-wrapper">{benefit.icon}</div>
                  <div>
                    <h4>{benefit.title}</h4>
                    <p>{benefit.desc}</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
