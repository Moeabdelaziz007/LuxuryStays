import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NewHeroSection() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center justify-between">
      {/* ✨ Stars background with glowing effect */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `starPulse ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
            }}
          ></div>
        ))}
      </div>
      
      {/* Green glow effect in the center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-[#39FF14] rounded-full opacity-10 blur-[100px] animate-pulse-slow"></div>
      
      {/* Logo at top */}
      <div className="relative w-full pt-8 pb-4 px-4">
        <h1 className="text-4xl font-bold text-[#39FF14] text-center filter drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]">
          StayX
        </h1>
      </div>
      
      {/* Main content in center */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full px-5">
        {/* Central Logo */}
        <h1 className="text-6xl font-bold text-[#39FF14] mb-4 filter drop-shadow-[0_0_8px_rgba(57,255,20,0.8)] animate-neon-pulse">
          StayX
        </h1>
        
        {/* Arabic Description */}
        <p className="text-center text-white text-lg mb-10 max-w-sm font-tajawal">
          بوابتك للإقامة الفاخرة في الساحل الشمالي وراس الحكمة ✨
        </p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-md mb-8">
          <div className="bg-black/60 border border-[#39FF14]/30 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-[#39FF14] text-2xl font-bold">+٥٠</div>
            <div className="text-white text-xs font-tajawal">عقار فاخر</div>
          </div>
          
          <div className="bg-black/60 border border-[#39FF14]/30 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-[#39FF14] text-2xl font-bold">١٠٠٪</div>
            <div className="text-white text-xs font-tajawal">ضمان الجودة</div>
          </div>
          
          <div className="bg-black/60 border border-[#39FF14]/30 backdrop-blur-sm rounded-lg p-3 text-center">
            <div className="text-[#39FF14] text-2xl font-bold">٢٤/٧</div>
            <div className="text-white text-xs font-tajawal">دعم فني</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="w-full max-w-md flex flex-col gap-3">
          <Button 
            className="w-full bg-[#39FF14] hover:bg-[#39FF14]/90 text-black font-medium py-6 rounded-lg font-tajawal"
            asChild
          >
            <Link href="/properties">
              <span className="flex items-center justify-center">
                استكشف العقارات
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
          </Button>
          
          <Button 
            className="w-full bg-transparent hover:bg-black/30 text-white border border-white/30 font-medium py-6 rounded-lg font-tajawal"
            asChild
          >
            <Link href="/auth">تسجيل الدخول</Link>
          </Button>
          
          <Button 
            className="w-full bg-transparent hover:bg-black/30 text-[#39FF14] border border-[#39FF14]/30 font-medium py-6 rounded-lg font-tajawal"
            asChild
          >
            <Link href="/auth?signup=true">إنشاء حساب جديد</Link>
          </Button>
        </div>
      </div>
      
      {/* Website URL at bottom */}
      <div className="relative py-4 opacity-50 text-sm">
        staychill-3ed08.web.app
      </div>
    </div>
  );
}