import React from "react";
import SmartHeader from "@/components/layout/SmartHeader";
import Sidebar from "@/components/layout/Sidebar";
import MobileNavigation from "@/components/layout/MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "@/components/Logo";

// مكون مشترك لضبط التخطيط الأساسي بناءً على نوع المستخدم والجهاز
export function BaseLayout({ 
  children, 
  role,
  customHeader,
  customSidebar,
  gradientBackground
}: { 
  children: React.ReactNode,
  role: "CUSTOMER" | "PROPERTY_ADMIN" | "SUPER_ADMIN" | "PUBLIC",
  customHeader?: React.ReactNode,
  customSidebar?: React.ReactNode,
  gradientBackground?: boolean
}) {
  const isMobile = useIsMobile();
  
  // تحديد ألوان الخلفية وتأثيرات الجاذبية المختلفة بناءً على نوع المستخدم
  let backgroundStyles = "bg-black";
  
  if (gradientBackground) {
    switch (role) {
      case "SUPER_ADMIN":
        backgroundStyles = "bg-gradient-to-br from-gray-950 via-black to-green-950";
        break;
      case "PROPERTY_ADMIN":
        backgroundStyles = "bg-gradient-to-br from-gray-950 via-black to-blue-950";
        break;
      case "CUSTOMER":
        backgroundStyles = "bg-gradient-to-br from-gray-950 via-black to-purple-950";
        break;
    }
  }
  
  return (
    <div className={`flex h-screen ${backgroundStyles} relative`}>
      {/* StayX Logo in top right corner for all dashboards */}
      <Logo 
        size="md" 
        variant="neon" 
        withText={true} 
        position="top-right"
        withAnimation={role === "SUPER_ADMIN"}
      />
      
      {/* Show sidebar only on desktop */}
      {!isMobile && (customSidebar || <Sidebar />)}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Custom header or default SmartHeader */}
        {customHeader || <SmartHeader />}
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto text-white p-6 pb-20 md:pb-6">
          {children}
        </main>
        
        {/* Mobile navigation */}
        <MobileNavigation />
      </div>
    </div>
  );
}

// تخطيط العميل
export function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout role="CUSTOMER" gradientBackground>
      {children}
    </BaseLayout>
  );
}

// تخطيط مدير العقارات
export function PropertyAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout role="PROPERTY_ADMIN" gradientBackground>
      {children}
    </BaseLayout>
  );
}

// تخطيط المشرف الرئيسي مع إضافة عناصر خاصة للتحكم والإدارة
export function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout 
      role="SUPER_ADMIN" 
      gradientBackground
    >
      {children}
    </BaseLayout>
  );
}