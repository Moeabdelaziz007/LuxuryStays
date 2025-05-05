import React from "react";
import { Routes, Route } from "react-router-dom";
import RoleGuard from "@/lib/RoleGuard";
import { UserRole } from "@shared/schema";

import SuperAdminDashboard from "@/features/dashboard/SuperAdminDashboard";
import PropertyAdminDashboard from "@/features/dashboard/PropertyAdminDashboard";
import CustomerDashboard from "@/features/dashboard/CustomerDashboard";
import HomePage from "@/features/home/HomePage";
import NotFound from "@/pages/not-found";

// Placeholder pages - these should be created as needed
const LoginPage = () => <div className="text-white p-8">Login Page (Coming Soon)</div>;
const SignupPage = () => <div className="text-white p-8">Signup Page (Coming Soon)</div>;
const UnauthorizedPage = () => <div className="text-white p-8 text-center">غير مصرح بالوصول</div>;

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/customer"
        element={
          <RoleGuard role={UserRole.CUSTOMER}>
            <CustomerDashboard />
          </RoleGuard>
        }
      />

      <Route
        path="/property-admin"
        element={
          <RoleGuard role={UserRole.PROPERTY_ADMIN}>
            <PropertyAdminDashboard />
          </RoleGuard>
        }
      />

      <Route
        path="/super-admin"
        element={
          <RoleGuard role={UserRole.SUPER_ADMIN}>
            <SuperAdminDashboard />
          </RoleGuard>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}