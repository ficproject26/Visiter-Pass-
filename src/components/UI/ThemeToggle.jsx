"use client";
import { useTheme } from "../../context/ThemeContext";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      className={`rollball-track ${isDark ? "dark" : "light"}`}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Stars shown in dark mode */}
      <span className="rollball-star s1" />
      <span className="rollball-star s2" />
      <span className="rollball-star s3" />

      {/* Sun rays shown in light mode */}
      {[...Array(8)].map((_, i) => (
        <span key={i} className="rollball-ray" style={{ "--i": i }} />
      ))}

      {/* The rolling 3D ball */}
      <span className="rollball-ball">
        <span className="rollball-face front" />
        <span className="rollball-face back" />
        <span className="rollball-face top" />
        <span className="rollball-face bottom" />
        <span className="rollball-face left" />
        <span className="rollball-face right" />
        {/* Moon craters / sun glow inside ball */}
        <span className="rollball-inner-icon">{isDark ? "🌙" : "☀️"}</span>
      </span>
    </button>
  );
}
