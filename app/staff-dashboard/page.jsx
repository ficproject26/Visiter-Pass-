"use client";
import React from "react";
import { useAuth } from "../../src/context/AuthContext";
import HRDashboard from "../../src/components/Admin/HRDashboard";
import SecurityDashboard from "../../src/components/Admin/SecurityDashboard";

export default function Page() {
  const { user } = useAuth();

  if (user?.role === "security" || user?.role === "gate" || user?.role === "guard") {
    return <SecurityDashboard />;
  }

  return <HRDashboard />;
}

