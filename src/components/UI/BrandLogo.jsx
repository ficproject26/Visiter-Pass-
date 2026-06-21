"use client";
import logoImg from '../../assets/logo.jpg';

export default function BrandLogo({ onNavigate, variant = "landing", isDark = false }) {
  const handleClick = () => {
    if (onNavigate) onNavigate("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      {isLanding ? (
        <img
          src={logoImg.src}
          alt="Forge India Connect"
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            boxShadow: "0 0 18px rgba(212,137,26,0.5)",
            objectFit: "cover",
          }}
        />
      ) : (
        <img
          src={logoImg.src}
          alt="Forge India Connect"
          style={{
            width: variant === "sidebar" ? 32 : 28,
            height: variant === "sidebar" ? 32 : 28,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      )}
      <span
        style={{
          fontSize: isLanding ? 20 : 18,
          fontWeight: 800,
          letterSpacing: "-0.5px",
          color: isDark ? "white" : "#1C1008",
        }}
      >
        Forge India Connect
      </span>
    </button>
  );
}
