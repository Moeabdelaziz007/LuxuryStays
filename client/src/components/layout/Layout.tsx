import React, { useState, useEffect } from "react";
import SmartHeader from "./SmartHeader";
import Footer from "./Footer";
import PublicMobileNavigation from "./PublicMobileNavigation";
import TechBackground from "./TechBackground";
import { useLocation } from "wouter";

/**
 * تخطيط للصفحات العامة - Public Pages Layout
 * يحتوي على هيكل مشترك لجميع الصفحات العامة في التطبيق
 * بما في ذلك الهيدر والفوتر وشريط التنقل المخصص للموبايل
 * مع خلفية تقنية مميزة بتصميم سايبر/فضائي
 */
export default function Layout({ 
  children,
  variant = 'cyber',
  intensity = 'low'
}: { 
  children: React.ReactNode; 
  variant?: 'cyber' | 'matrix' | 'stars' | 'grid';
  intensity?: 'high' | 'medium' | 'low' | 'subtle';
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
  
  return (
    <TechBackground
      variant={variant}
      intensity={intensity}
      animated={true}
      withGradient={true}
      withGlow={true}
      withScanlines={true}
      withFloatingParticles={location === '/' ? true : false}
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
        <button 
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 bg-black/80 border border-[#39FF14]/30 hover:border-[#39FF14] rounded-full p-3 text-[#39FF14] transition-all duration-300 hover:bg-[#39FF14]/10 group"
          aria-label="التمرير للأعلى"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-180 group-hover:-translate-y-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <div className="absolute -inset-0.5 rounded-full bg-[#39FF14]/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
        </button>
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