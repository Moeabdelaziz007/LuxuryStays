import React from "react";
import { Link } from "wouter";
import FeaturedProperties from "@/features/home/FeaturedProperties";
import ServicesSection from "@/features/home/ServicesSection";

// استيراد المكونات الجديدة ذات طابع الفضاء-التقنية
import { 
  TechBackground, 
  TechCard, 
  TechButton, 
  TechInput, 
  TechEffects 
} from "@/components/ui/tech-theme";

export default function HomePage() {
  
  return (
    <div className="text-white min-h-screen">
      {/* ✨ قسم البداية - مستقبل الإقامة الفاخرة */}
      <section>
        <div className="relative min-h-[100vh] bg-black overflow-hidden">
          {/* الخلفية الديناميكية مع تأثيرات التقنية */}
          <div className="absolute inset-0 bg-[#000000]">
            {/* شبكة ثلاثية الأبعاد متحركة */}
            <div className="absolute inset-0 opacity-20">
              <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzOUZGMTQiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')]" 
                style={{animation: "panGrid 30s linear infinite", transformStyle: "preserve-3d", perspective: "1000px", transform: "rotateX(60deg)"}}></div>
            </div>
            
            {/* طبقة الضباب لإضافة العمق */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>
            
            {/* وهج النيون المركزي المتحرك */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vh] bg-[#39FF14] rounded-full opacity-5 blur-[100px] animate-pulse"></div>
            
            {/* نقاط البيانات المضيئة المتحركة عشوائيًا */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} 
                  className="absolute w-1 h-1 bg-[#39FF14] rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5 + 0.3,
                    animation: `float ${Math.random() * 10 + 15}s linear infinite, pulse ${Math.random() * 2 + 1}s ease-in-out infinite alternate`
                  }}
                ></div>
              ))}
            </div>
            
            {/* خطوط اتصال النيون المتحركة */}
            <div className="absolute inset-0">
              <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,100 Q300,200 600,100 T1200,100" fill="none" stroke="#39FF14" strokeWidth="0.5">
                  <animate attributeName="d" dur="10s" repeatCount="indefinite" 
                    values="M0,100 Q300,200 600,100 T1200,100;
                            M0,150 Q300,50 600,150 T1200,150;
                            M0,100 Q300,200 600,100 T1200,100" />
                </path>
              </svg>
            </div>
          </div>
          
          {/* المحتوى الرئيسي */}
          <div className="relative h-full flex flex-col justify-center container mx-auto px-4 pt-10 sm:pt-16 pb-20 sm:pb-32">
            {/* الشعار والعنوان مع تأثير النيون */}
            <div className="text-center mb-6 sm:mb-8 mt-4 sm:mt-8 relative">
              {/* نبض دائري خلف الشعار */}
              <div className="absolute w-24 sm:w-32 h-24 sm:h-32 bg-[#39FF14] rounded-full blur-[50px] opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
              
              {/* الشعار */}
              <h1 className="inline-block text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black relative pb-2
                              bg-clip-text text-transparent bg-gradient-to-b from-white via-[#39FF14] to-[#21a100]
                              filter drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">
                <span className="relative inline-block">
                  <span className="relative">Stay</span>
                  {/* تأثير النيون بالتوهج حول الحروف */}
                  <span className="absolute inset-0 blur-[5px] bg-clip-text text-transparent bg-gradient-to-b from-white via-[#39FF14] to-[#39FF14]">Stay</span>
                </span>
                <span className="text-white ml-1">X</span>
              </h1>
              
              {/* جملة وصفية مع تأثير الكتابة */}
              <div className="max-w-2xl mx-auto mt-2 sm:mt-4 h-10 sm:h-12 md:h-16 overflow-hidden relative">
                <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-300 font-light absolute inset-0 animate-typewriter opacity-0" style={{animationDelay: "0s", animationFillMode: "forwards"}}>
                  مستقبل الإقامة الفاخرة
                </p>
                <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-neon-green font-light absolute inset-0 animate-typewriter opacity-0" style={{animationDelay: "3s", animationFillMode: "forwards"}}>
                  تجربة إقامة بمفهوم جديد
                </p>
                <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-gray-300 font-light absolute inset-0 animate-typewriter opacity-0" style={{animationDelay: "6s", animationFillMode: "forwards"}}>
                  منازل ذكية. رفاهية استثنائية.
                </p>
              </div>
            </div>
            
            {/* عرض ثلاثي الأبعاد للعقارات الذكية */}
            <div className="relative mx-auto w-full max-w-5xl my-4 sm:my-6 md:my-8 perspective px-2 sm:px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {/* الكرت الأول - البيت الذكي */}
                <div className="group transform transition-all duration-500 hover:scale-105 hover:-rotate-1 perspective-card">
                  <div className="bg-black/50 backdrop-blur-sm border border-[#39FF14]/30 rounded-lg overflow-hidden relative
                              shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]
                              transition-all duration-500">
                    {/* الصورة الخلفية مع تأثير الهولوغرام */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070" 
                        alt="منزل ذكي بالكامل"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                      />
                      {/* طبقة الهولوغرام */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90"></div>
                      <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity"
                           style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(57,255,20,0.1) 2px, rgba(57,255,20,0.1) 4px)"}}>
                      </div>
                      
                      {/* مؤشرات بيانات ذكية */}
                      <div className="absolute top-2 right-2 text-xs bg-black/50 text-[#39FF14] px-2 py-1 rounded-full border border-[#39FF14]/30 backdrop-blur-sm">
                        <span className="animate-blink inline-block w-2 h-2 bg-[#39FF14] rounded-full mr-1"></span> متصل
                      </div>
                      <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded-full border border-white/30 backdrop-blur-sm">
                        <span className="text-[#39FF14]">24°C</span> درجة الحرارة
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-[#39FF14] text-xl font-bold mb-1">البيت الذكي بالكامل</h3>
                      <p className="text-gray-400 text-sm mb-3">تحكم بخصائص العقار كامل عن بُعد من التكييف وحتى الإضاءة</p>
                      <div className="flex space-x-2 rtl:space-x-reverse mb-3">
                        {/* أيقونات الميزات */}
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-black/70 border border-[#39FF14]/20 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#39FF14]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                        </span>
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-black/70 border border-[#39FF14]/20 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#39FF14]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </span>
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-black/70 border border-[#39FF14]/20 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#39FF14]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </span>
                      </div>
                      <button className="w-full py-2 bg-[#000] text-[#39FF14] border border-[#39FF14]/50 rounded 
                                        hover:bg-[#39FF14]/10 transition-colors group-hover:border-[#39FF14] text-sm font-medium">
                        عرض العقارات <span className="mr-1 rtl:ml-1">→</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* الكرت الثاني - الجلسات الخارجية */}
                <div className="group transform transition-all duration-500 hover:scale-105 hover:rotate-1 perspective-card">
                  <div className="bg-black/50 backdrop-blur-sm border border-[#39FF14]/30 rounded-lg overflow-hidden relative
                              shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]
                              transition-all duration-500">
                    {/* الصورة الخلفية مع تأثير الهولوغرام */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1564013434775-f71db0030976?q=80&w=2070" 
                        alt="شاليهات فاخرة"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                      />
                      {/* طبقة الهولوغرام */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90"></div>
                      <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity"
                           style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(57,255,20,0.1) 2px, rgba(57,255,20,0.1) 4px)"}}>
                      </div>
                      
                      {/* مؤشرات بيانات ذكية */}
                      <div className="absolute top-2 right-2 text-xs bg-black/50 text-[#39FF14] px-2 py-1 rounded-full border border-[#39FF14]/30 backdrop-blur-sm">
                        <span className="inline-block">✓</span> متاح
                      </div>
                      <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded-full border border-white/30 backdrop-blur-sm">
                        <span className="text-[#39FF14]">+12</span> عقار
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-[#39FF14] text-xl font-bold mb-1">شاليهات فاخرة</h3>
                      <p className="text-gray-400 text-sm mb-3">شاليهات وفيلات على البحر مباشرة مع جلسات خارجية خاصة</p>
                      <div className="flex space-x-2 rtl:space-x-reverse mb-3">
                        {/* أيقونات الميزات */}
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-black/70 border border-[#39FF14]/20 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#39FF14]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                        </span>
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-black/70 border border-[#39FF14]/20 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#39FF14]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                        </span>
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-black/70 border border-[#39FF14]/20 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#39FF14]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </span>
                      </div>
                      <button className="w-full py-2 bg-[#000] text-[#39FF14] border border-[#39FF14]/50 rounded 
                                        hover:bg-[#39FF14]/10 transition-colors group-hover:border-[#39FF14] text-sm font-medium">
                        حجز الآن <span className="mr-1 rtl:ml-1">→</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* الكرت الثالث - الحجز الآن */}
                <div className="group transform transition-all duration-500 hover:scale-105 hover:-rotate-1 perspective-card">
                  <div className="bg-[#39FF14]/10 backdrop-blur-sm border border-[#39FF14]/50 rounded-lg overflow-hidden relative
                              shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]
                              transition-all duration-500">
                    {/* نص الخلفية المتحرك */}
                    <div className="absolute inset-0 overflow-hidden opacity-5">
                      <div className="animate-matrix-text text-[10px] leading-tight text-[#39FF14]" style={{fontFamily: "monospace"}}>
                        {Array.from({length: 15}).map((_, i) => (
                          <div key={i}>01 STAYX 010 STAYX 101 STAYX 1010 STAYX 01 STAYX 10 STAYX 101</div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-8 text-center relative">
                      {/* أيقونة مميزة */}
                      <div className="mx-auto w-16 h-16 bg-black/70 rounded-full flex items-center justify-center mb-4 
                                    border-2 border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.5)]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#39FF14]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      
                      <h3 className="text-[#39FF14] text-2xl font-bold mb-2">احجز الآن</h3>
                      <p className="text-white text-sm mb-6">أسعار خاصة للحجوزات المبكرة مع خصم ٢٠٪ للأعضاء</p>
                      
                      {/* عداد الوقت المتبقي */}
                      <div className="flex justify-center space-x-2 rtl:space-x-reverse mb-6">
                        <div className="w-14 h-14 bg-black/70 rounded flex flex-col items-center justify-center border border-[#39FF14]/30">
                          <span className="text-[#39FF14] text-xl font-bold">٣</span>
                          <span className="text-gray-400 text-xs">أيام</span>
                        </div>
                        <div className="w-14 h-14 bg-black/70 rounded flex flex-col items-center justify-center border border-[#39FF14]/30">
                          <span className="text-[#39FF14] text-xl font-bold">١٢</span>
                          <span className="text-gray-400 text-xs">ساعة</span>
                        </div>
                        <div className="w-14 h-14 bg-black/70 rounded flex flex-col items-center justify-center border border-[#39FF14]/30">
                          <span className="text-[#39FF14] text-xl font-bold">٤٥</span>
                          <span className="text-gray-400 text-xs">دقيقة</span>
                        </div>
                      </div>
                      
                      <button className="w-full py-3 bg-[#39FF14] text-black rounded 
                                        hover:bg-[#39FF14]/90 transition-colors font-bold relative group-hover:shadow-[0_0_10px_rgba(57,255,20,0.7)]">
                        <span className="relative z-10">سجل الآن</span>
                        <span className="absolute inset-0 bg-[#39FF14] filter blur-md opacity-50 group-hover:opacity-80 transition-opacity"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* الأزرار الرئيسية */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-5 mt-6 sm:mt-8">
              <button className="group relative px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold text-black bg-[#39FF14] rounded-md
                              shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] overflow-hidden
                              min-w-[120px] md:min-w-[160px] touch-action-manipulation">
                <span className="relative z-10 flex items-center justify-center">
                  تصفح العقارات
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 rtl:ml-1 sm:rtl:ml-2 rtl:transform rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
                {/* تأثير الضوء الخاص */}
                <span className="absolute top-0 left-0 w-full h-full bg-white/30 
                                transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              </button>
              
              <button className="px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold text-[#39FF14] bg-transparent border-2 border-[#39FF14]/50 
                              rounded-md hover:bg-[#39FF14]/10 hover:border-[#39FF14] transition-colors
                              shadow-[0_0_10px_rgba(57,255,20,0.1)] hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]
                              min-w-[120px] md:min-w-[160px] touch-action-manipulation">
                تسجيل الدخول
              </button>
            </div>
            
            {/* مؤشر التمرير للأسفل بتصميم تقني مميز */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-white/60 hover:text-white/90 transition-colors cursor-pointer">
              <div className="flex flex-col items-center">
                <p className="text-xs mb-2">اكتشف المزيد</p>
                <div className="w-8 h-12 border-2 border-[#39FF14]/40 rounded-full flex justify-center pt-1 relative">
                  <div className="w-1 h-2 bg-[#39FF14] rounded-full animate-scrolldown"></div>
                  {/* خطوط المسح */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="h-full w-full bg-[#39FF14]/5 
                                 transform translate-y-0 animate-scan"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* العناصر الزخرفية الثابتة للهوية التقنية */}
          <div className="absolute top-4 left-4 flex items-center text-xs text-white/40">
            <div className="w-2 h-2 bg-[#39FF14] rounded-full mr-1 animate-blink"></div>
            <span className="hidden sm:inline">SYSTEM.ACTIVE_v2.5</span>
          </div>
          
          <div className="absolute top-4 right-4 text-xs text-white/40 hidden sm:block">
            <span className="animate-typer">[LOGIN.AUTHENTICATED=TRUE]</span>
          </div>
          
          <div className="absolute bottom-4 left-4 text-xs text-white/40 hidden sm:block">
            <span>STAYX.OS © 2025</span>
          </div>
          
          <div className="absolute bottom-4 right-4 text-xs text-white/40 hidden sm:block">
            <span className="animate-blink inline-block w-1 h-3 bg-[#39FF14]/70 mr-1"></span>
            <span className="animate-typer">SECURE.CONNECTION</span>
          </div>
        </div>
        
        {/* إضافة الأنماط الديناميكية */}
        <style jsx>{`
          @keyframes panGrid {
            from { background-position: 0 0; }
            to { background-position: 100px 0; }
          }
          
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          
          @keyframes scrolldown {
            0% { transform: translateY(0); opacity: 1; }
            30% { opacity: 1; }
            60% { opacity: 0; }
            100% { transform: translateY(6px); opacity: 0; }
          }
          
          @keyframes typer {
            0%, 100% { width: 0; }
            20%, 80% { width: 100%; }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            100% { transform: scale(1.5); }
          }
          
          @keyframes float {
            0% { transform: translate(0, 0); }
            25% { transform: translate(10px, 10px); }
            50% { transform: translate(20px, 0); }
            75% { transform: translate(10px, -10px); }
            100% { transform: translate(0, 0); }
          }
          
          @keyframes matrix-text {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          
          @keyframes typewriter {
            0% { opacity: 0; transform: translateY(20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
          }
          
          .animate-scan {
            animation: scan 2s linear infinite;
          }
          
          .animate-blink {
            animation: blink 1.5s infinite;
          }
          
          .animate-scrolldown {
            animation: scrolldown 2s ease infinite;
          }
          
          .animate-typer {
            overflow: hidden;
            white-space: nowrap;
            border-right: 2px solid #39FF14;
            animation: typer 8s steps(30) infinite;
          }
          
          .animate-matrix-text {
            animation: matrix-text 20s linear infinite;
          }
          
          .animate-typewriter {
            animation: typewriter 9s ease-in-out infinite;
          }
          
          .perspective {
            perspective: 1000px;
          }
          
          .perspective-card {
            transform-style: preserve-3d;
          }
        `}</style>
      </section>

      {/* 🏠 قسم العقارات */}
      <section className="py-8 sm:py-12 md:py-20 px-3 sm:px-4 md:px-6 relative">
        <TechBackground 
          variant="circuits" 
          intensity="low" 
          animated={true}
          withGradient={false}
        >
          <div className="absolute top-10 right-10 hidden md:block">
            <div className="bg-[#39FF14] text-black rounded-full px-4 py-1 text-sm font-bold animate-pulse">
              يتم التحديث يومياً
            </div>
          </div>
          
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-neon-green">عقارات مميزة</h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
              عقارات فاخرة تم اختيارها بعناية في أفضل المناطق في الساحل الشمالي وراس الحكمة.
              يتم إضافة عقارات جديدة بواسطة مديرين العقارات المعتمدين لدينا.
            </p>
          </div>
          
          {/* تصفية العقارات - قابلة للتمرير على الموبايل */}
          <div className="flex justify-start sm:justify-center mb-8 sm:mb-10 overflow-x-auto pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="inline-flex bg-gray-800 rounded-full p-1">
              <TechButton variant="default" size="sm" className="whitespace-nowrap rounded-full">
                الكل
              </TechButton>
              <TechButton variant="ghost" size="sm" className="whitespace-nowrap rounded-full">
                الساحل الشمالي
              </TechButton>
              <TechButton variant="ghost" size="sm" className="whitespace-nowrap rounded-full">
                راس الحكمة
              </TechButton>
            </div>
          </div>
          
          <FeaturedProperties />
          
          <div className="mt-12 text-center">
            <TechButton
              variant="outline"
              size="lg"
              glowIntensity="medium"
              className="inline-flex items-center justify-center gap-2"
              onClick={() => window.location.href = '/properties'}
            >
              عرض جميع العقارات
              <span className="text-xl">←</span>
            </TechButton>
          </div>
          
          <TechCard 
            variant="gradient"
            withGlow={true}
            className="mt-16 p-8 max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-white mb-2">هل تملك عقارات في الساحل؟</h3>
                <p className="text-gray-400">سجّل كمدير عقارات وأضف عقاراتك في دقائق</p>
              </div>
              <TechButton
                variant="default"
                size="lg"
                shimmer={true}
                onClick={() => window.location.href = '/register/property-admin'}
              >
                سجّل كمدير عقارات
              </TechButton>
            </div>
          </TechCard>
        </TechBackground>
      </section>

      {/* 🛎️ قسم الخدمات */}
      <section className="py-10 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6 relative">
        <TechBackground
          variant="dots"
          intensity="medium"
          animated={true}
          withGradient={true}
        >
          <TechEffects 
            type="scanlines" 
            intensity="medium" 
            color="#39FF14" 
            className="absolute inset-x-0 top-1/3 h-12 opacity-30"
            withAnimation={true}
          />
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-10 text-center text-neon-green">الخدمات المتوفرة</h2>
          <ServicesSection />
        </TechBackground>
      </section>

      {/* 🚀 قسم قريباً - مبسط */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 text-center relative">
        <TechBackground
          variant="hexagons"
          intensity="low"
          animated={true}
          withGradient={true}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-neon-green">ترقبوا قريباً 🔥</h2>
          
          <div className="max-w-3xl mx-auto mb-8 sm:mb-10">
            {/* ChillRoom - مكون واحد فقط */}
            <TechCard 
              variant="holographic"
              withGlow={true}
              withShimmer={true}
              className="p-6 sm:p-8 transform transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
            >
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-[#39FF14]">ChillRoom 🧊</h3>
                <p className="text-lg mb-4 text-white">
                  مساحة ترفيه ذكية داخل StayX لمشاركة اللحظات، الموسيقى، والفيديوهات
                </p>
                
                <div className="flex flex-wrap justify-center gap-6 mb-6">
                  <TechCard variant="bordered" className="p-3 text-center w-full sm:w-auto">
                    <span className="text-[#39FF14] text-xl block mb-1">🌊</span>
                    <span className="text-white font-medium">دردشة مباشرة</span>
                  </TechCard>
                  <TechCard variant="bordered" className="p-3 text-center w-full sm:w-auto">
                    <span className="text-[#39FF14] text-xl block mb-1">🥂</span>
                    <span className="text-white font-medium">حفلات خاصة</span>
                  </TechCard>
                </div>
                
                <div className="flex justify-center">
                  <TechButton
                    variant="default"
                    size="default"
                    shimmer={true}
                    onClick={() => window.location.href = '/signup'}
                  >
                    سجل اهتمامك الآن
                  </TechButton>
                </div>
                
                <div className="text-center mt-4">
                  <span className="bg-[#39FF14]/20 text-[#39FF14] px-3 py-1 rounded-full text-xs font-bold tracking-widest inline-block">
                    قريباً - صيف 2025
                  </span>
                </div>
              </div>
              <img
                src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1112"
                alt="ChillRoom"
                className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-15 transition-opacity -z-20"
              />
            </TechCard>
          </div>
          
          <div className="max-w-xl mx-auto px-2 sm:px-0">
            <p className="text-base text-gray-400 mb-5">
              سجّل الآن لتكون من أول المستخدمين وللحصول على إشعارات حصرية!
            </p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center">
              <TechInput 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                variant="glowing"
                className="w-full"
              />
              <TechButton
                variant="default"
                size="default"
                shimmer={true}
              >
                اشترك بالنشرة البريدية
              </TechButton>
            </form>
          </div>
          
          {/* خط نيون أفقي قبل الـ Footer */}
          <div className="mt-16 mb-2 mx-auto max-w-4xl h-px bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent"></div>
        </TechBackground>
      </section>

      {/* ✅ Footer بسيط */}
      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} StayX — All rights reserved.
      </footer>
    </div>
  );
}