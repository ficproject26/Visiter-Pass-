"use client";
import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children, allowedRoles = [], fallbackUrl = "/login" }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace(fallbackUrl);
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.replace(fallbackUrl);
      }
    }
  }, [user, loading, router, allowedRoles, fallbackUrl]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Authenticating Security Session...</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Verifying portal access permissions</div>
        </div>
      </div>
    );
  }

  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return null;
  }

  return children;
}
