"use client";
import React from "react";
import ProtectedRoute from "../../src/components/Auth/ProtectedRoute";
import AdminDashboard from "../../src/components/Admin/AdminDashboard";

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'subadmin']} fallbackUrl="/admin-login">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
