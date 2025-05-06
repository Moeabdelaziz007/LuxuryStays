import React from "react";
import SmartHeader from "./SmartHeader";
import Sidebar from "./Sidebar";
import MobileNavigation from "./MobileNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

// تخطيط للصفحات العامة
export default function Layout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex h-screen bg-black">
      {/* إظهار الشريط الجانبي فقط على سطح المكتب */}
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* استخدام شريط SmartHeader المشترك مع تمييزه كصفحة عامة */}
        <SmartHeader role="PUBLIC" />
        
        {/* المنطقة الرئيسية للمحتوى */}
        <main className="flex-1 overflow-y-auto text-white p-6 pb-20 md:pb-6">
          {children}
        </main>
        
        {/* شريط التنقل السفلي للموبايل */}
        <MobileNavigation />
      </div>
    </div>
  );
}