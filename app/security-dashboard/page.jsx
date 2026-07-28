"use client";
import React from "react";
import ProtectedRoute from "../../src/components/Auth/ProtectedRoute";
import SecurityDashboard from "../../src/components/Admin/SecurityDashboard";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['security', 'gate', 'guard', 'admin', 'subadmin']} fallbackUrl="/security-login">
      <SecurityDashboard />
    </ProtectedRoute>
  );
}
