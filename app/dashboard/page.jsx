"use client";
import React from "react";
import ProtectedRoute from "../../src/components/Auth/ProtectedRoute";
import { useAuth } from "../../src/context/AuthContext";
import AdminDashboard from "../../src/components/Admin/AdminDashboard";
import SecurityDashboard from "../../src/components/Admin/SecurityDashboard";
import HRDashboard from "../../src/components/Admin/HRDashboard";

function UnifiedDashboardContent() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "admin" || user.role === "subadmin") {
    return <AdminDashboard />;
  }

  if (user.role === "security" || user.role === "gate" || user.role === "guard") {
    return <SecurityDashboard />;
  }

  if (user.role === "hr" || user.role === "employee" || user.role === "staff") {
    return <HRDashboard />;
  }

  return <AdminDashboard />;
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'subadmin', 'security', 'gate', 'guard', 'hr', 'employee', 'staff']} fallbackUrl="/login">
      <UnifiedDashboardContent />
    </ProtectedRoute>
  );
}
