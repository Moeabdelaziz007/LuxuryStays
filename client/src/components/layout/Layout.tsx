import React, { useState, useEffect } from "react";
import TechBackground from "./TechBackground";
import { SpaceButton } from "@/components/ui/space-button";
import { useLocation } from "wouter";
import ResponsiveNavigation from "@/components/layout/ResponsiveNavigation";
import SpaceFooter from "@/components/layout/SpaceFooter";

/**
 * تخطيط للصفحات العامة - Public Pages Layout
 * يحتوي على هيكل مشترك لجميع الصفحات العامة في التطبيق
 * بما في ذلك الهيدر والفوتر وشريط التنقل المخصص للموبايل
 * مع خلفية تقنية مميزة بتصميم سايبر/فضائي
 */
export default function Layout({ 
  children, 
}: { 
  children: React.ReactNode;
}) {
  const [location] = useLocation();
  const [showScroll, setShowScroll] = useState(false);
  
  // إظهار زر التمرير للأعلى عند التمرير لأسفل
  useEffect(() => {
    const checkScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);
  
  // وظيفة التمرير للأعلى
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const isHomePage = location === '/';

  return (
    <TechBackground
      variant="default"
      withParticles={isHomePage}
      withScanlines={true}
      withGrid={true}
      className="flex flex-col min-h-screen"
    >
      {/* استخدام شريط SmartHeader المشترك مع تمييزه كصفحة عامة */}
      <SmartHeader role="PUBLIC" />
      
      {/* المنطقة الرئيسية للمحتوى */}
      <main className="flex-1 overflow-hidden text-white pb-16 md:pb-0">
        {children}
      </main>
      
      {/* تذييل الصفحة (Footer) */}
      <Footer />
      
      {/* شريط التنقل السفلي للموبايل - مخصص للصفحات العامة فقط */}
      <PublicMobileNavigation />
      
      {/* زر التمرير للأعلى */}
      {showScroll && (
        <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50">
          <TechButton 
            onClick={scrollToTop}
            variant="outline"
            size="icon"
            glowIntensity="medium"
            className="rounded-full"
            aria-label="التمرير للأعلى"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-180 group-hover:-translate-y-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </TechButton>
        </div>
      )}
      
      {/* عناصر الزخرفة في الزوايا */}
      <div className="fixed top-0 left-0 w-20 h-20 pointer-events-none z-0 opacity-30 hidden lg:block">
        <div className="absolute top-2 left-2 w-px h-4 bg-[#39FF14]/50"></div>
        <div className="absolute top-2 left-2 w-4 h-px bg-[#39FF14]/50"></div>
      </div>
      
      <div className="fixed top-0 right-0 w-20 h-20 pointer-events-none z-0 opacity-30 hidden lg:block">
        <div className="absolute top-2 right-2 w-px h-4 bg-[#39FF14]/50"></div>
        <div className="absolute top-2 right-2 w-4 h-px bg-[#39FF14]/50"></div>
      </div>
      
      <div className="fixed bottom-0 left-0 w-20 h-20 pointer-events-none z-0 opacity-30 hidden lg:block">
        <div className="absolute bottom-2 left-2 w-px h-4 bg-[#39FF14]/50"></div>
        <div className="absolute bottom-2 left-2 w-4 h-px bg-[#39FF14]/50"></div>
      </div>
      
      <div className="fixed bottom-0 right-0 w-20 h-20 pointer-events-none z-0 opacity-30 hidden lg:block">
        <div className="absolute bottom-2 right-2 w-px h-4 bg-[#39FF14]/50"></div>
        <div className="absolute bottom-2 right-2 w-4 h-px bg-[#39FF14]/50"></div>
      </div>
    </TechBackground>
  );
}