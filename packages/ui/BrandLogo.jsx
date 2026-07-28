"use client";
import React from "react";

export default function BrandLogo({ onNavigate, variant = "landing", isDark = false }) {
  const handleClick = () => {
    if (onNavigate) onNavigate("landing");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isLanding = variant === "landing";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Go to home"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontFamily: "inherit",
      }}
    >
      <div
        style={{
          width: isLanding ? 38 : (variant === "sidebar" ? 32 : 28),
          height: isLanding ? 38 : (variant === "sidebar" ? 32 : 28),
          borderRadius: "50%",
          background: "linear-gradient(135deg, #d4891a 0%, #4f46e5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 900,
          fontSize: 14,
          boxShadow: isLanding ? "0 0 18px rgba(212,137,26,0.5)" : "none"
        }}
      >
        F
      </div>
      <span
        style={{
          fontSize: isLanding ? 20 : 18,
          fontWeight: 800,
          letterSpacing: "-0.5px",
          color: isDark ? "white" : "#1C1008",
          whiteSpace: "nowrap"
        }}
      >
        Forge India Connect
      </span>
    </button>
  );
}
