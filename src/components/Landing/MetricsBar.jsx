"use client";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

import { Users, Building2, Zap, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

function CountUp({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(ease * target));
          if (progress < 1) requestAnimationFrame(tick);
          else setCount(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function MetricsBar() {
  const { isDark } = useTheme();

  const metrics = [
    { value: 50000, suffix: "+", label: "Visitors Processed", icon: <Users size={28} color="#0d9488" /> },
    { value: 500,   suffix: "+", label: "Organizations",       icon: <Building2 size={28} color="#0891b2" /> },
    { value: 99.9,  suffix: "%", label: "Uptime SLA",          icon: <Zap size={28} color="#e11d48" /> },
    { value: 10,    suffix: "M+",label: "Records Managed",     icon: <BarChart3 size={28} color="#16a34a" /> },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section style={{
      padding: "3rem 2rem",
      background: isDark
        ? "linear-gradient(135deg, rgba(13,148,136,0.08) 0%, rgba(8,145,178,0.05) 100%)"
        : "linear-gradient(135deg, rgba(13,148,136,0.06) 0%, rgba(8,145,178,0.04) 100%)",
      borderTop: isDark ? "1px solid rgba(212,137,26,0.18)" : "1px solid rgba(212,137,26,0.15)",
      borderBottom: isDark ? "1px solid rgba(212,137,26,0.18)" : "1px solid rgba(212,137,26,0.15)",
    }}>
      <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
        {metrics.map((m, i) => (
          <motion.div key={i} variants={item} whileHover={{ scale: 1.02 }} style={{
            textAlign: "center",
            padding: "1.5rem 1rem",
            borderRadius: 16,
            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)",
            border: isDark ? "1px solid rgba(212,137,26,0.18)" : "1px solid rgba(212,137,26,0.15)",
            backdropFilter: "blur(12px)",
            cursor: "default",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>{m.icon}</div>
            <div style={{ lineHeight: 1.1, marginBottom: 2 }}>
              <span className="metric-number">
                {m.isFloat
                  ? <span>{m.value}{m.suffix}</span>
                  : <CountUp target={m.value} suffix={m.suffix} />
                }
              </span>
            </div>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: isDark ? "rgba(250,246,240,0.6)" : "#5C4A35",
              marginTop: 6,
              letterSpacing: "0.3px",
            }}>{m.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}


