"use client";
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { API_BASE_URL } from "../../config/api";
import { loadVisitors } from "../../utils/storage";
import VisitorPass from "./VisitorPass";
import BrandLogo from "../UI/BrandLogo";
import { useRouter } from "next/navigation";

export default function StatusCheck({ onNavigate: externalOnNavigate }) {
  const [query, setQuery] = useState("");
  const [visitor, setVisitor] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const { isDark } = useTheme();
  const router = useRouter();

  const onNavigate = externalOnNavigate || ((target) => {
    if (target === "landing") router.push("/");
    else router.push(`/${target}`);
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setVisitor(null);
    setSearched(true);

    if (!query.trim()) {
      setError("Please enter your Pass ID or Email Address.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/visitors`);
      if (!res.ok) {
        throw new Error("Failed to fetch visitors from database");
      }
      const visitors = await res.json();
      
      const found = visitors.find(
        (v) =>
          v.id.toLowerCase() === query.trim().toLowerCase() ||
          v.email.toLowerCase() === query.trim().toLowerCase()
      );

      if (found) {
        setVisitor(found);
      } else {
        setError("No registration found with that ID or Email Address.");
      }
    } catch (err) {
      console.error("Failed to query live visitor data:", err);
      setError("Database connection error. Please try again later.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark ? "#08262b" : "#F8FAFC",
        fontFamily: "var(--font-primary)",
        color: isDark ? "white" : "#0f172a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <header
        style={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "3rem",
        }}
      >
        <BrandLogo onNavigate={onNavigate} variant="header" isDark={isDark} />
        <button
          onClick={() => onNavigate("landing")}
          className="btn btn-secondary"
          style={{
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(15,23,42,0.1)",
            color: isDark ? "white" : "#0f172a",
            padding: "8px 16px",
            fontSize: 13,
            borderRadius: 8,
          }}
        >
          ← Home
        </button>
      </header>

      {/* Main card */}
      {!visitor || visitor.approvalStatus?.toUpperCase() !== "APPROVED" ? (
        <div
          className="animate-scale-up"
          style={{
            width: "100%",
            maxWidth: 500,
            background: isDark ? "#111827" : "white",
            borderRadius: 20,
            padding: "2.5rem",
            boxShadow: isDark
              ? "0 20px 45px -15px rgba(0,0,0,0.5)"
              : "0 20px 45px -15px rgba(15,23,42,0.08)",
            border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(15,23,42,0.05)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: isDark ? "rgba(45,212,191,0.1)" : "rgba(13,148,136,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              fontSize: 24,
              color: isDark ? "#2dd4bf" : "#0d9488",
            }}
          >
            🔍
          </div>

          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.5px" }}>
            Check Pass Status
          </h2>
          <p style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 13, marginBottom: "2rem", lineHeight: 1.5 }}>
            Enter your Email Address or the Pass ID generated during registration to download your digital badge.
          </p>

          <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. V-1002 or name@example.com"
              className="form-input"
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: 14,
                borderRadius: 10,
                border: isDark ? "1px solid #374151" : "1px solid #cbd5e1",
                background: isDark ? "#1f2937" : "white",
                color: isDark ? "white" : "black",
              }}
            />

            {error && (
              <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 600, textAlign: "left" }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #0d9488, #0891b2)",
                fontWeight: 750,
                border: 0,
                cursor: "pointer",
                color: "white",
                fontSize: 14,
                marginTop: 6,
              }}
            >
              Retrieve Digital Pass
            </button>
          </form>

          {searched && visitor && visitor.approvalStatus?.toUpperCase() !== "APPROVED" && (
            <div
              className="animate-fade-in"
              style={{
                marginTop: "2.5rem",
                padding: "1.5rem",
                borderRadius: 12,
                background:
                  visitor.approvalStatus?.toUpperCase() === "REJECTED"
                    ? "rgba(239,68,68,0.06)"
                    : "rgba(245,158,11,0.06)",
                border:
                  visitor.approvalStatus?.toUpperCase() === "REJECTED"
                    ? "1px solid rgba(239,68,68,0.15)"
                    : "1px solid rgba(245,158,11,0.15)",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: visitor.approvalStatus?.toUpperCase() === "REJECTED" ? "#ef4444" : "#f59e0b",
                  }}
                />
                <strong
                  style={{
                    fontSize: 13,
                    color: visitor.approvalStatus?.toUpperCase() === "REJECTED" ? "#ef4444" : "#f59e0b",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {visitor.approvalStatus?.toUpperCase() === "REJECTED" ? "Request Rejected" : "Pending Approval"}
                </strong>
              </div>
              <p
                style={{
                  fontSize: 12.5,
                  color: isDark ? "#cbd5e1" : "#475569",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {visitor.approvalStatus?.toUpperCase() === "REJECTED"
                  ? "Your request was declined by the administration/host security team. Please reach out to host contact."
                  : "Your registration has been submitted successfully but requires host admin approval. Once approved, your pass will become downloadable here and sent to your email."}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "#10b981",
              padding: "10px 20px",
              borderRadius: 30,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>✓</span> APPROVED PASS RETRIEVED
          </div>
          <VisitorPass visitor={visitor} onNavigate={onNavigate} />
        </div>
      )}
    </div>
  );
}
