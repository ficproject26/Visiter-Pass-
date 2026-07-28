"use client";
import React from "react";
import ProtectedRoute from "../../src/components/Auth/ProtectedRoute";
import { useAuth } from "../../src/context/AuthContext";
import HRDashboard from "../../src/components/Admin/HRDashboard";
import SecurityDashboard from "../../src/components/Admin/SecurityDashboard";

function StaffContent() {
  const { user } = useAuth();

  if (user?.role === "security" || user?.role === "gate" || user?.role === "guard") {
    return <SecurityDashboard />;
  }

  return <HRDashboard />;
}

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['hr', 'employee', 'staff', 'security', 'admin', 'subadmin']} fallbackUrl="/staff-login">
      <StaffContent />
    </ProtectedRoute>
  );
}
