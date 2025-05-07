import React from "react";
import { Route, Switch } from "wouter";
import RouteGuard from "@/components/RouteGuard";
import { UserRole } from "@shared/schema";

// Layout Components
import Layout from "@/components/layout/Layout";
import { CustomerLayout, PropertyAdminLayout, SuperAdminLayout } from "@/components/layout/RoleLayouts";

// Dashboard Components
import NewSuperAdminDashboard from "@/features/dashboard/super-admin/NewSuperAdminDashboard";
import FinancialTransactions from "@/features/dashboard/super-admin/FinancialTransactions";
import NewPropertyAdminDashboard from "@/features/dashboard/property-admin/NewPropertyAdminDashboard";
import NewPropertyAdminLayout from "@/features/dashboard/property-admin/NewPropertyAdminLayout";
import CustomerDashboard from "@/features/dashboard/customer/CustomerDashboard"; // Updated to use new component
import OldCustomerDashboard from "@/features/dashboard/customer/NewCustomerDashboard";

// Public Components
import PublicHome from "@/features/public/Home";
import ServicesPage from "@/features/public/ServicesPage";
import PropertiesPage from "@/features/public/PropertiesPage";
import AboutUs from "@/features/public/AboutUs";
import ContactPage from "@/features/public/ContactPage";
import PrivacyPolicy from "@/features/public/PrivacyPolicy";
import TermsConditions from "@/features/public/TermsConditions";
import NotFound from "@/pages/not-found";
import SplashScreen from "@/pages/SplashScreen";

// Auth Components
import SimpleLoginPage from "@/features/auth/SimpleLogin";
import SimplifiedLogin from "@/features/auth/SimplifiedLogin";
import UnauthorizedPage from "@/features/auth/Unauthorized";

// Debugging Components
import FirebaseAuthTroubleshoot from "@/pages/FirebaseAuthTroubleshoot";
import AuthTest from "@/pages/AuthTest";
import SimpleAuthTest from "@/pages/SimpleAuthTest";

// Booking Components
import BookingConfirmation from "@/features/booking/BookingConfirmation";
import BookingCheckout from "@/features/booking/BookingCheckout";

// Admin Components
import AdminPage from "@/pages/admin-page";

// Testing Tools Components
import TestingToolsPage from "@/pages/testing-tools";
import AutomatedTestingPage from "@/pages/automated-testing";
import TechShowcasePage from "@/pages/tech-showcase";

// Branding Components
import FuturisticBranding from "@/components/FuturisticBranding";

/**
 * تعريف مسارات التطبيق الرئيسية
 */
export default function AppRoutes() {
  // مكون لصفحات الدفع المشتركة
  const PaymentSuccessPage = () => (
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
  );

  const PaymentCancelPage = () => (
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
  );

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
        <SimplifiedLogin />
      </Route>
      
      <Route path="/auth">
        <SimplifiedLogin />
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
      
      {/* ===== صفحة عرض العلامة التجارية الجديدة ===== */}
      <Route path="/branding">
        <Layout>
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-[#39FF14] mb-6">StayX Brand Showcase</h1>
            <FuturisticBranding />
          </div>
        </Layout>
      </Route>
      
      {/* ===== صفحات تشخيص مصادقة Firebase ===== */}
      <Route path="/auth/troubleshoot">
        <FirebaseAuthTroubleshoot />
      </Route>
      
      <Route path="/auth/test">
        <AuthTest />
      </Route>
      
      <Route path="/auth/simple-test">
        <SimpleAuthTest />
      </Route>
      
      {/* ===== صفحة الإدارة المبسطة ===== */}
      <Route path="/admin">
        <AdminPage />
      </Route>
      
      {/* ===== أدوات اختبار واجهة المستخدم ===== */}
      <Route path="/testing-tools">
        <TestingToolsPage />
      </Route>
      
      <Route path="/automated-testing">
        <AutomatedTestingPage />
      </Route>
      
      {/* ===== صفحة عرض تأثيرات التصميم الفضائي/التقني ===== */}
      <Route path="/tech-showcase">
        <TechShowcasePage />
      </Route>
      
      {/* ===== مسارات الدفع ===== */}
      <Route path="/payment-success">
        <PaymentSuccessPage />
      </Route>
      
      <Route path="/payment-cancel">
        <PaymentCancelPage />
      </Route>

      {/* ===== مسارات الحجز والدفع ===== */}
      <Route path="/booking/checkout/:id">
        {(params) => (
          <BookingCheckout />
        )}
      </Route>
      
      {/* ===== مسارات لوحة تحكم العميل ===== */}
      <Route path="/customer/booking/confirmation/:bookingId">
        {(params) => (
          <RouteGuard role={UserRole.CUSTOMER}>
            <CustomerLayout>
              <BookingConfirmation bookingId={params.bookingId} />
            </CustomerLayout>
          </RouteGuard>
        )}
      </Route>
      
      <Route path="/customer">
        <RouteGuard role={UserRole.CUSTOMER}>
          <CustomerLayout>
            <CustomerDashboard activeTab="dashboard" />
          </CustomerLayout>
        </RouteGuard>
      </Route>

      <Route path="/customer/:tab">
        {(params) => (
          <RouteGuard role={UserRole.CUSTOMER}>
            <CustomerLayout>
              <CustomerDashboard activeTab={params.tab} />
            </CustomerLayout>
          </RouteGuard>
        )}
      </Route>

      {/* ===== مسارات لوحة تحكم مدير العقارات ===== */}
      <Route path="/property-admin">
        <RouteGuard role={UserRole.PROPERTY_ADMIN}>
          <NewPropertyAdminLayout activeTab="dashboard">
            <NewPropertyAdminDashboard activeTab="dashboard" />
          </NewPropertyAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/property-admin/:tab">
        {(params) => (
          <RouteGuard role={UserRole.PROPERTY_ADMIN}>
            <NewPropertyAdminLayout activeTab={params.tab}>
              <NewPropertyAdminDashboard activeTab={params.tab} />
            </NewPropertyAdminLayout>
          </RouteGuard>
        )}
      </Route>

      {/* ===== مسارات لوحة تحكم المشرف العام ===== */}
      <Route path="/super-admin">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <NewSuperAdminDashboard />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>

      <Route path="/super-admin/:tab">
        {(params) => (
          <RouteGuard role={UserRole.SUPER_ADMIN}>
            <SuperAdminLayout>
              <NewSuperAdminDashboard />
            </SuperAdminLayout>
          </RouteGuard>
        )}
      </Route>

      <Route path="/super-admin/:tab/:action">
        {(params) => (
          <RouteGuard role={UserRole.SUPER_ADMIN}>
            <SuperAdminLayout>
              <NewSuperAdminDashboard />
            </SuperAdminLayout>
          </RouteGuard>
        )}
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
      
      {/* مسار خاص للمعاملات المالية */}
      <Route path="/super-admin/finances/transactions">
        <RouteGuard role={UserRole.SUPER_ADMIN}>
          <SuperAdminLayout>
            <FinancialTransactions />
          </SuperAdminLayout>
        </RouteGuard>
      </Route>
      
      {/* مسار للصفحات غير الموجودة */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}