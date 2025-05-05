import React from "react";
import { Routes, Route } from "react-router-dom";
import RouteGuard from "@/components/RouteGuard";
import { UserRole } from "@shared/schema";

// Dashboard components
import SuperAdminDashboard from "@/features/dashboard/SuperAdminDashboard";
import PropertyAdminDashboard from "@/features/dashboard/PropertyAdminDashboard";
import CustomerDashboard from "@/features/dashboard/CustomerDashboard";

// Public components
import PublicHome from "@/features/public/Home";
import NotFound from "@/pages/not-found";

// Auth components
import LoginPage from "@/features/auth/Login";
import SignupPage from "@/features/auth/Signup";
import UnauthorizedPage from "@/features/auth/Unauthorized";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/customer"
        element={
          <RouteGuard role={UserRole.CUSTOMER}>
            <CustomerDashboard />
          </RouteGuard>
        }
      />

      <Route
        path="/property-admin"
        element={
          <RouteGuard role={UserRole.PROPERTY_ADMIN}>
            <PropertyAdminDashboard />
          </RouteGuard>
        }
      />

      <Route
        path="/super-admin"
        element={
          <RouteGuard role={UserRole.SUPER_ADMIN}>
            <SuperAdminDashboard />
          </RouteGuard>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}