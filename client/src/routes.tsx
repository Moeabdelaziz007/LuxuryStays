import React from "react";
import { Route, Switch, Router } from "wouter";
import RouteGuard from "@/components/RouteGuard";
import { UserRole } from "@shared/schema";

// Layout Components
import Layout from "@/components/layout/Layout";
import { CustomerLayout, PropertyAdminLayout, SuperAdminLayout } from "@/components/layout/RoleLayouts";

// Dashboard Components
import SuperAdminDashboard from "@/features/dashboard/super-admin/SuperAdminDashboard";
import NewSuperAdminDashboard from "@/features/dashboard/super-admin/NewSuperAdminDashboard";
import PropertyAdminDashboard from "@/features/dashboard/PropertyAdminDashboard";
import CustomerDashboard from "@/features/dashboard/customer/NewCustomerDashboard";

// Public Components
import PublicHome from "@/features/public/Home";
import ServicesPage from "@/features/public/ServicesPage";
import PropertiesPage from "@/features/public/PropertiesPage";
import NotFound from "@/pages/not-found";
import RoutingDebugPage from "@/features/public/RoutingDebugPage";
import SplashScreen from "@/pages/SplashScreen";

// Auth Components
import LoginPage from "@/features/auth/Login";
import SignupPage from "@/features/auth/Signup";
import UnauthorizedPage from "@/features/auth/Unauthorized";

// Booking Components
import BookingConfirmation from "@/features/booking/BookingConfirmation";

export default function AppRoutes() {
  return (
    <Switch>
      {/* ===== المسارات العامة - لا تحتاج إلى تسجيل دخول ===== */}
      <Route path="/splash">
        <SplashScreen />
      </Route>
      
      <Route path="/">
        <PublicHome />
      </Route>
      
      <Route path="/login">
        <LoginPage />
      </Route>
      
      <Route path="/signup">
        <SignupPage />
      </Route>
      
      <Route path="/properties">
        <PropertiesPage />
      </Route>
      
      <Route path="/services">
        <ServicesPage />
      </Route>
      
      <Route path="/about">
        <PublicHome />
      </Route>
      
      <Route path="/contact">
        <PublicHome />
      </Route>
      
      <Route path="/unauthorized">
        <UnauthorizedPage />
      </Route>
      
      {/* ===== مسارات الدفع - يمكن استخدامها من قبل جميع المستخدمين ===== */}
      <Route path="/payment-success">
        <PublicHome />
      </Route>
      
      <Route path="/payment-cancel">
        <PublicHome />
      </Route>

      {/* ===== مسارات لوحة تحكم العميل ===== */}
      <Route path="/customer">
        <RouteGuard role={UserRole.CUSTOMER}>
          <CustomerLayout>
            <CustomerDashboard />
          </CustomerLayout>
        </RouteGuard>
      </Route>

      <Route path="/customer/bookings">
        <RouteGuard role={UserRole.CUSTOMER}>
          <CustomerLayout>
            <CustomerDashboard />
          </CustomerLayout>
        </RouteGuard>
      </Route>

      <Route path="/customer/favorites">
        <RouteGuard role={UserRole.CUSTOMER}>
          <CustomerLayout>
            <CustomerDashboard />
          </CustomerLayout>
        </RouteGuard>
      </Route>

      <Route path="/customer/profile">
        <RouteGuard role={UserRole.CUSTOMER}>
          <CustomerLayout>
            <CustomerDashboard />
          </CustomerLayout>
        </RouteGuard>
      </Route>

      <Route path="/customer/settings">
        <RouteGuard role={UserRole.CUSTOMER}>
          <CustomerLayout>
            <CustomerDashboard />
          </CustomerLayout>
        </RouteGuard>
      </Route>

      <Route path="/customer/booking/confirmation/:bookingId">
        {(params) => (
          <RouteGuard role={UserRole.CUSTOMER}>
            <CustomerLayout>
              <BookingConfirmation bookingId={params.bookingId} />
            </CustomerLayout>
          </RouteGuard>
        )}
      </Route>

      {/* ===== مسارات لوحة تحكم مدير العقارات ===== */}
      <Route path="/property-admin">
        <RouteGuard role={UserRole.PROPERTY_ADMIN}>
          <PropertyAdminLayout>
            <PropertyAdminDashboard />
          </PropertyAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/property-admin/properties">
        <RouteGuard role={UserRole.PROPERTY_ADMIN}>
          <PropertyAdminLayout>
            <PropertyAdminDashboard />
          </PropertyAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/property-admin/bookings">
        <RouteGuard role={UserRole.PROPERTY_ADMIN}>
          <PropertyAdminLayout>
            <PropertyAdminDashboard />
          </PropertyAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/property-admin/calendar">
        <RouteGuard role={UserRole.PROPERTY_ADMIN}>
          <PropertyAdminLayout>
            <PropertyAdminDashboard />
          </PropertyAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/property-admin/analytics">
        <RouteGuard role={UserRole.PROPERTY_ADMIN}>
          <PropertyAdminLayout>
            <PropertyAdminDashboard />
          </PropertyAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/property-admin/profile">
        <RouteGuard role={UserRole.PROPERTY_ADMIN}>
          <PropertyAdminLayout>
            <PropertyAdminDashboard />
          </PropertyAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/property-admin/settings">
        <RouteGuard role={UserRole.PROPERTY_ADMIN}>
          <PropertyAdminLayout>
            <PropertyAdminDashboard />
          </PropertyAdminLayout>
        </RouteGuard>
      </Route>

      {/* ===== مسارات لوحة تحكم المشرف العام ===== */}
      <Route path="/super-admin">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/super-admin/users">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>
      
      <Route path="/super-admin/users/add">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/super-admin/properties">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>
      
      <Route path="/super-admin/properties/add">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/super-admin/bookings">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>
      
      <Route path="/super-admin/bookings/manage">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/super-admin/services">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/super-admin/revenue">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/super-admin/issues">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/super-admin/settings">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>
      
      <Route path="/super-admin/notifications">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>
      
      <Route path="/super-admin/security">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>
      
      <Route path="/super-admin/reports/:reportType">
        {(params) => (
          <RouteGuard role={UserRole.SUPER_ADMIN}>
            <SuperAdminLayout>
              <NewSuperAdminDashboard />
            </SuperAdminLayout>
          </RouteGuard>
        )}
      </Route>
      
      {/* مسار للصفحات غير الموجودة */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}