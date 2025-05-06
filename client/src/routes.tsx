import React from "react";
import { Routes, Route } from "react-router-dom";
import RouteGuard from "@/components/RouteGuard";
import { UserRole } from "@shared/schema";

// Layout Components
import Layout from "@/components/layout/Layout";

// Dashboard Components
import SuperAdminDashboard from "@/features/dashboard/super-admin/SuperAdminDashboard";
import PropertyAdminDashboard from "@/features/dashboard/PropertyAdminDashboard";
import CustomerDashboard from "@/features/dashboard/customer/CustomerDashboard";

// Public Components
import PublicHome from "@/features/public/Home";
import NotFound from "@/pages/not-found";

// Auth Components
import LoginPage from "@/features/auth/Login";
import SignupPage from "@/features/auth/Signup";
import UnauthorizedPage from "@/features/auth/Unauthorized";

// Booking Components
import BookingConfirmation from "@/features/booking/BookingConfirmation";

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
      
      {/* Booking routes */}
      <Route
        path="/booking/confirmation/:bookingId"
        element={
          <RouteGuard role={UserRole.CUSTOMER}>
            <BookingConfirmation />
          </RouteGuard>
        }
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}