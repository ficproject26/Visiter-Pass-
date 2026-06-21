"use client";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import { staggerContainer, fadeUpBounce } from "../../utils/animations";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const daily = [
  { day: "Mon", visitors: 42 }, { day: "Tue", visitors: 68 },
  { day: "Wed", visitors: 54 }, { day: "Thu", visitors: 91 },
  { day: "Fri", visitors: 83 }, { day: "Sat", visitors: 29 },
  { day: "Sun", visitors: 17 },
];

const categories = [
  { name: "Interview", value: 38 }, { name: "Meeting", value: 27 },
  { name: "Delivery", value: 18 }, { name: "Contractor", value: 12 },
  { name: "Other", value: 5 },
];

const depts = [
  { dept: "HR", visits: 82 }, { dept: "Eng", visits: 67 },
  { dept: "Sales", visits: 54 }, { dept: "Ops", visits: 48 },
  { dept: "Finance", visits: 31 },
];

const peak = [
  { hour: "8am", v: 12 }, { hour: "9am", v: 34 }, { hour: "10am", v: 58 },
  { hour: "11am", v: 71 }, { hour: "12pm", v: 45 }, { hour: "1pm", v: 38 },
  { hour: "2pm", v: 62 }, { hour: "3pm", v: 55 }, { hour: "4pm", v: 44 },
  { hour: "5pm", v: 22 }, { hour: "6pm", v: 8 },
];

const PIE_COLORS = ["#D4891A", "#00B4D8", "#06b6d4", "#D4891A", "#5eead4"];

const TT = ({ isDark }) => ({ contentStyle: { background: isDark ? "#0a2e2c" : "white", border: "1px solid rgba(13,148,136,0.3)", borderRadius: 8, fontSize: 12, color: isDark ? "#FAF6F0" : "#1C1008" }, cursor: false });

export default function AnalyticsSection() {
  const { isDark } = useTheme();
  const card = {
    background: isDark ? "rgba(255,220,150,0.05)" : "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(10px)",
    border: isDark ? "1px solid rgba(212,137,26,0.12)" : "1px solid rgba(212,137,26,0.15)",
    borderRadius: 18, padding: "1.5rem",
    backdropFilter: "blur(12px)",
  };

  return (
    <motion.section 
      variants={fadeUpBounce}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{ padding: "5rem 2rem", background: isDark ? "rgba(0,0,0,0.1)" : "rgba(224,242,254,0.3)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div variants={fadeUpBounce} style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center", background: isDark ? "rgba(212,137,26,0.12)" : "rgba(212,137,26,0.1)", border: `1px solid ${isDark ? "rgba(212,137,26,0.3)" : "rgba(212,137,26,0.25)"}`, borderRadius: 50, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: "#D4891A", marginBottom: 16 }}>
            📊 ENTERPRISE ANALYTICS
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.4rem)", fontWeight: 800, letterSpacing: "-1px", color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 10 }}>
            Insights that drive decisions
          </h2>
          <p style={{ color: isDark ? "rgba(250,246,240,0.6)" : "#5C4A35", fontSize: 14, maxWidth: 480, margin: "0 auto" }}>
            Real-time dashboards, trend analysis, and compliance reporting — all in one place.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: 20 }}
        >

          {/* Daily Trends */}
          <motion.div variants={fadeUpBounce} className="card-lift" style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 4 }}>Daily Visitor Trends</h3>
            <p style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.45)", marginBottom: 16 }}>This week's visitor flow</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4891A" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#D4891A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip {...TT({ isDark })} />
                <Area type="monotone" dataKey="visitors" stroke="#D4891A" strokeWidth={2} fill="url(#tealGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div variants={fadeUpBounce} style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 4 }}>Visit Category Breakdown</h3>
            <p style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.45)", marginBottom: 16 }}>By visit purpose</p>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={categories} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {categories.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...TT({ isDark })} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {categories.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i], flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? "rgba(255,255,255,0.7)" : "#334155", flex: 1 }}>{c.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: PIE_COLORS[i] }}>{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Dept Chart */}
          <motion.div variants={fadeUpBounce} style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 4 }}>Department Visits</h3>
            <p style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.45)", marginBottom: 16 }}>Monthly by department</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={depts} barSize={28}>
                <XAxis dataKey="dept" tick={{ fill: isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip {...TT({ isDark })} />
                <Bar dataKey="visits" radius={[6, 6, 0, 0]}>
                  {depts.map((_, i) => <Cell key={i} fill={i === 0 ? "#D4891A" : isDark ? "rgba(13,148,136,0.35)" : "rgba(13,148,136,0.25)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Peak Hours */}
          <motion.div variants={fadeUpBounce} style={card}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: isDark ? "#FAF6F0" : "#1C1008", marginBottom: 4 }}>Peak Hour Analysis</h3>
            <p style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.45)", marginBottom: 16 }}>Busiest check-in hours</p>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={peak}>
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00B4D8" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00B4D8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fill: isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip {...TT({ isDark })} />
                <Area type="monotone" dataKey="v" stroke="#00B4D8" strokeWidth={2} fill="url(#blueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

        </motion.div>
      </div>
    </motion.section>
  );
}



