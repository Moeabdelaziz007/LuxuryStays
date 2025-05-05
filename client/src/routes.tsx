import React from "react";
import { Routes, Route } from "react-router-dom";
import RouteGuard from "@/components/RouteGuard";
import { UserRole } from "@shared/schema";

// Components
import Layout from "@/components/layout/Layout";
import SuperAdminDashboard from "@/features/dashboard/super-admin";
import PropertyAdminDashboard from "@/features/dashboard/property-admin";
import CustomerDashboard from "@/features/dashboard/customer";
import PublicHome from "@/features/public/Home";
import NotFound from "@/pages/not-found";
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
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}