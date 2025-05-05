import React from "react";
import { Routes, Route } from "react-router-dom";
import RouteGuard from "@/components/RouteGuard";
import { UserRole } from "@shared/schema";

// Layouts
import Layout from "@/components/layout/Layout";
import PublicLayout from "@/components/layout/PublicLayout";

// Dashboard Components
import SuperAdminDashboard from "@/features/dashboard/super-admin";
import PropertyAdminDashboard from "@/features/dashboard/property-admin";
import CustomerDashboard from "@/features/dashboard/customer";

// Public Page Components
import PublicHome from "@/features/public/Home";
import { AboutUs } from "@/components/AboutFooter";
import NotFound from "@/pages/not-found";

// Auth Components
import LoginPage from "@/features/auth/Login";
import SignupPage from "@/features/auth/Signup";
import UnauthorizedPage from "@/features/auth/Unauthorized";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><PublicHome /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutUs /></PublicLayout>} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/customer"
        element={
          <RouteGuard role={UserRole.CUSTOMER}>
            <Layout>
              <CustomerDashboard />
            </Layout>
          </RouteGuard>
        }
      />

      <Route
        path="/property-admin"
        element={
          <RouteGuard role={UserRole.PROPERTY_ADMIN}>
            <Layout>
              <PropertyAdminDashboard />
            </Layout>
          </RouteGuard>
        }
      />

      <Route
        path="/super-admin"
        element={
          <RouteGuard role={UserRole.SUPER_ADMIN}>
            <Layout>
              <SuperAdminDashboard />
            </Layout>
          </RouteGuard>
        }
      />
      
      {/* 404 Route */}
      <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
    </Routes>
  );
}