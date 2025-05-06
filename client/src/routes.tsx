import React from "react";
import { Routes, Route } from "react-router-dom";
import RouteGuard from "@/components/RouteGuard";
import { UserRole } from "@shared/schema";

// Layout Components
import Layout from "@/components/layout/Layout";
import { CustomerLayout, PropertyAdminLayout, SuperAdminLayout } from "@/components/layout/RoleLayouts";

// Dashboard Components
import SuperAdminDashboard from "@/features/dashboard/super-admin/SuperAdminDashboard";
import PropertyAdminDashboard from "@/features/dashboard/PropertyAdminDashboard";
import CustomerDashboard from "@/features/dashboard/customer/CustomerDashboard";

// Public Components
import PublicHome from "@/features/public/Home";
import NotFound from "@/pages/not-found";
import RoutingDebugPage from "@/features/public/RoutingDebugPage";

// Auth Components
import LoginPage from "@/features/auth/Login";
import SignupPage from "@/features/auth/Signup";
import UnauthorizedPage from "@/features/auth/Unauthorized";

// Booking Components
import BookingConfirmation from "@/features/booking/BookingConfirmation";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== المسارات العامة - لا تحتاج إلى تسجيل دخول ===== */}
      <Route path="/" element={<PublicHome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/properties" element={<PublicHome />} /> {/* سيتم استبدالها بصفحة العقارات */}
      <Route path="/services" element={<PublicHome />} /> {/* سيتم استبدالها بصفحة الخدمات */}
      <Route path="/about" element={<PublicHome />} /> {/* سيتم استبدالها بصفحة عن الشركة */}
      <Route path="/contact" element={<PublicHome />} /> {/* سيتم استبدالها بصفحة التواصل */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/debug" element={<RoutingDebugPage />} />
      
      {/* ===== مسارات الدفع - يمكن استخدامها من قبل جميع المستخدمين ===== */}
      <Route path="/payment-success" element={<PublicHome />} /> {/* سيتم استبدالها بصفحة نجاح الدفع */}
      <Route path="/payment-cancel" element={<PublicHome />} /> {/* سيتم استبدالها بصفحة إلغاء الدفع */}

      {/* ===== مسارات لوحة تحكم العميل ===== */}
      <Route path="/customer/*" element={
        <RouteGuard role={UserRole.CUSTOMER}>
          <CustomerLayout>
            <Routes>
              <Route path="/" element={<CustomerDashboard />} />
              <Route path="/bookings" element={<CustomerDashboard />} /> {/* سيتم استبدالها بصفحة الحجوزات */}
              <Route path="/favorites" element={<CustomerDashboard />} /> {/* سيتم استبدالها بصفحة المفضلة */}
              <Route path="/profile" element={<CustomerDashboard />} /> {/* سيتم استبدالها بصفحة الملف الشخصي */}
              <Route path="/settings" element={<CustomerDashboard />} /> {/* سيتم استبدالها بصفحة الإعدادات */}
              <Route path="/booking/confirmation/:bookingId" element={<BookingConfirmation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CustomerLayout>
        </RouteGuard>
      } />

      {/* ===== مسارات لوحة تحكم مدير العقارات ===== */}
      <Route path="/property-admin/*" element={
        <RouteGuard role={UserRole.PROPERTY_ADMIN}>
          <PropertyAdminLayout>
            <Routes>
              <Route path="/" element={<PropertyAdminDashboard />} />
              <Route path="/properties" element={<PropertyAdminDashboard />} /> {/* سيتم استبدالها بصفحة إدارة العقارات */}
              <Route path="/bookings" element={<PropertyAdminDashboard />} /> {/* سيتم استبدالها بصفحة الحجوزات */}
              <Route path="/calendar" element={<PropertyAdminDashboard />} /> {/* سيتم استبدالها بصفحة التقويم */}
              <Route path="/analytics" element={<PropertyAdminDashboard />} /> {/* سيتم استبدالها بصفحة التحليلات */}
              <Route path="/profile" element={<PropertyAdminDashboard />} /> {/* سيتم استبدالها بصفحة الملف الشخصي */}
              <Route path="/settings" element={<PropertyAdminDashboard />} /> {/* سيتم استبدالها بصفحة الإعدادات */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PropertyAdminLayout>
        </RouteGuard>
      } />

      {/* ===== مسارات لوحة تحكم المشرف العام ===== */}
      <Route path="/super-admin/*" element={
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <Routes>
              <Route path="/" element={<SuperAdminDashboard />} />
              <Route path="/users" element={<SuperAdminDashboard />} /> {/* سيتم استبدالها بصفحة إدارة المستخدمين */}
              <Route path="/properties" element={<SuperAdminDashboard />} /> {/* سيتم استبدالها بصفحة إدارة العقارات */}
              <Route path="/bookings" element={<SuperAdminDashboard />} /> {/* سيتم استبدالها بصفحة الحجوزات */}
              <Route path="/services" element={<SuperAdminDashboard />} /> {/* سيتم استبدالها بصفحة الخدمات */}
              <Route path="/revenue" element={<SuperAdminDashboard />} /> {/* سيتم استبدالها بصفحة الإيرادات */}
              <Route path="/issues" element={<SuperAdminDashboard />} /> {/* سيتم استبدالها بصفحة المشكلات */}
              <Route path="/settings" element={<SuperAdminDashboard />} /> {/* سيتم استبدالها بصفحة الإعدادات */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SuperAdminLayout>
        </RouteGuard>
      } />
      
      {/* مسار للصفحات غير الموجودة */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}