import React from "react";
import SmartHeader from "./SmartHeader";
import Footer from "./Footer";
import { useLocation } from "wouter";

// تخطيط للصفحات العامة - Public Pages Layout
export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* استخدام شريط SmartHeader المشترك مع تمييزه كصفحة عامة */}
      <SmartHeader role="PUBLIC" />
      
      {/* المنطقة الرئيسية للمحتوى */}
      <main className="flex-1 overflow-y-auto text-white">
        {children}
      </main>
      
      {/* تذييل الصفحة (Footer) */}
      <Footer />
    </div>
  );
}