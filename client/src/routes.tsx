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
import AboutUs from "@/features/public/AboutUs";
import ContactPage from "@/features/public/ContactPage";
import PrivacyPolicy from "@/features/public/PrivacyPolicy";
import TermsConditions from "@/features/public/TermsConditions";
import NotFound from "@/pages/not-found";
import RoutingDebugPage from "@/features/public/RoutingDebugPage";
import SplashScreen from "@/pages/SplashScreen";

// Auth Components
import LoginPage from "@/features/auth/Login"; // Original login component
import SimpleLoginPage from "@/features/auth/SimpleLogin"; // Simple login component
import SignupPage from "@/features/auth/Signup";
import UnauthorizedPage from "@/features/auth/Unauthorized";

// Debugging Components
import FirebaseAuthTroubleshoot from "@/pages/FirebaseAuthTroubleshoot";
import AuthTest from "@/pages/AuthTest";

// Booking Components
import BookingConfirmation from "@/features/booking/BookingConfirmation";

// Admin Components
import AdminPage from "@/pages/admin-page";

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
        <SimpleLoginPage />
      </Route>
      
      <Route path="/old-login">
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
        <AboutUs />
      </Route>
      
      <Route path="/contact">
        <ContactPage />
      </Route>
      
      <Route path="/privacy">
        <PrivacyPolicy />
      </Route>
      
      <Route path="/terms">
        <TermsConditions />
      </Route>
      
      <Route path="/unauthorized">
        <UnauthorizedPage />
      </Route>
      
      {/* ===== صفحات تشخيص مصادقة Firebase ===== */}
      <Route path="/auth/troubleshoot">
        <FirebaseAuthTroubleshoot />
      </Route>
      
      <Route path="/auth/test">
        <AuthTest />
      </Route>
      
      {/* ===== صفحة الإدارة المبسطة - للمشرفين فقط ===== */}
      <Route path="/admin">
        <AdminPage />
      </Route>
      
      {/* ===== مسارات الدفع - يمكن استخدامها من قبل جميع المستخدمين ===== */}
      <Route path="/payment-success">
        <Layout>
          <div className="container mx-auto px-4 py-12">
            <div className="bg-gray-800 rounded-xl p-8 text-center max-w-lg mx-auto">
              <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">تم الدفع بنجاح!</h1>
              <p className="text-gray-300 mb-6">
                تمت عملية الدفع بنجاح وتم تأكيد حجزك. يمكنك الآن الاطلاع على تفاصيل الحجز في لوحة التحكم الخاصة بك.
              </p>
              <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                <a href="/customer/bookings" className="bg-[#39FF14] text-black px-6 py-2 rounded-lg font-bold">
                  عرض الحجوزات
                </a>
                <a href="/" className="bg-gray-700 text-white px-6 py-2 rounded-lg">
                  العودة للصفحة الرئيسية
                </a>
              </div>
            </div>
          </div>
        </Layout>
      </Route>
      
      <Route path="/payment-cancel">
        <Layout>
          <div className="container mx-auto px-4 py-12">
            <div className="bg-gray-800 rounded-xl p-8 text-center max-w-lg mx-auto">
              <div className="w-20 h-20 bg-red-500 rounded-full mx-auto flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">تم إلغاء عملية الدفع</h1>
              <p className="text-gray-300 mb-6">
                تم إلغاء عملية الدفع الخاصة بك. إذا كنت تواجه أي مشكلة في عملية الدفع، يرجى التواصل مع فريق الدعم.
              </p>
              <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                <a href="/contact" className="bg-[#39FF14] text-black px-6 py-2 rounded-lg font-bold">
                  تواصل مع الدعم
                </a>
                <a href="/" className="bg-gray-700 text-white px-6 py-2 rounded-lg">
                  العودة للصفحة الرئيسية
                </a>
              </div>
            </div>
          </div>
        </Layout>
      </Route>

      {/* ===== مسارات لوحة تحكم العميل ===== */}
      {/* استخدام نمط القالب الموحد مع مسارات متعددة */}
      <Route path="/customer/:tab?">
        {(params) => (
          <RouteGuard role={UserRole.CUSTOMER}>
            <CustomerLayout>
              <CustomerDashboard activeTab={params.tab || "dashboard"} />
            </CustomerLayout>
          </RouteGuard>
        )}
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