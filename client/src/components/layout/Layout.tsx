import React from "react";
import SmartHeader from "./SmartHeader";
import Footer from "./Footer";
import PublicMobileNavigation from "./PublicMobileNavigation";
import { useLocation } from "wouter";

/**
 * تخطيط للصفحات العامة - Public Pages Layout
 * يحتوي على هيكل مشترك لجميع الصفحات العامة في التطبيق
 * بما في ذلك الهيدر والفوتر وشريط التنقل المخصص للموبايل
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* استخدام شريط SmartHeader المشترك مع تمييزه كصفحة عامة */}
      <SmartHeader role="PUBLIC" />
      
      {/* المنطقة الرئيسية للمحتوى */}
      <main className="flex-1 overflow-y-auto text-white pb-16 md:pb-0">
        {children}
      </main>
      
      {/* تذييل الصفحة (Footer) */}
      <Footer />
      
      {/* شريط التنقل السفلي للموبايل - مخصص للصفحات العامة فقط */}
      <PublicMobileNavigation />
    </div>
  );
}