"use client";
import React from "react";
import ProtectedRoute from "../../src/components/Auth/ProtectedRoute";
import HRDashboard from "../../src/components/Admin/HRDashboard";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['hr', 'employee', 'staff']} fallbackUrl="/staff-login">
      <HRDashboard />
    </ProtectedRoute>
  );
}
