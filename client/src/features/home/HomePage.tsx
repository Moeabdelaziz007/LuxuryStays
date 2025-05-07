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
  TECH_EFFECTS 
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
            
            {/* عبارة حماسية في منتصف القسم */}
            <div className="relative mx-auto w-full max-w-5xl my-8 sm:my-10 md:my-12 px-3 sm:px-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#39FF14] mb-4 
                            shadow-[0_0_10px_rgba(57,255,20,0.4)] inline-block
                            animate-pulse">
                  لسنا الوحيدون ولكننا الأفضل
                </h2>
                <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
                  تمتع بتجربة إقامة استثنائية مع أكثر من 120 عقار فاخر في أفضل المواقع
                </p>
              </div>
              
              {/* شريط البحث المتقدم */}
              <div className="bg-black/50 backdrop-blur-xl p-4 sm:p-6 rounded-xl border border-[#39FF14]/30
                           shadow-[0_0_25px_rgba(57,255,20,0.3)] relative overflow-hidden
                           transform transition-all hover:shadow-[0_0_35px_rgba(57,255,20,0.4)]">
                {/* إضافة تأثير الخلفية */}
                <div className="absolute inset-0 overflow-hidden opacity-5">
                  <div className="animate-matrix-text text-[10px] leading-tight text-[#39FF14]" style={{fontFamily: "monospace"}}>
                    {Array.from({length: 15}).map((_, i) => (
                      <div key={i}>01 STAYX 010 STAYX 101 STAYX 1010 STAYX 01 STAYX 10 STAYX 101</div>
                    ))}
                  </div>
                </div>
                
                {/* عنوان شريط البحث */}
                <div className="text-center mb-5">
                  <h3 className="text-[#39FF14] text-xl sm:text-2xl font-bold flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    ابحث عن وجهتك المثالية
                  </h3>
                </div>
                
                {/* نموذج البحث */}
                <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* حقل الموقع */}
                  <div className="relative">
                    <label className="block text-[#39FF14] text-sm mb-1 font-medium">الموقع</label>
                    <select className="w-full bg-black border border-[#39FF14]/30 rounded-md p-3 text-white focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] transition-colors appearance-none">
                      <option value="">جميع المواقع</option>
                      <option value="north-coast">الساحل الشمالي</option>
                      <option value="ras-elhekma">رأس الحكمة</option>
                      <option value="marina">مارينا</option>
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pt-5 pointer-events-none text-[#39FF14]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  
                  {/* التاريخ */}
                  <div>
                    <label className="block text-[#39FF14] text-sm mb-1 font-medium">تاريخ الوصول</label>
                    <input type="date" className="w-full bg-black border border-[#39FF14]/30 rounded-md p-3 text-white focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] transition-colors" />
                  </div>
                  
                  {/* الأشخاص */}
                  <div>
                    <label className="block text-[#39FF14] text-sm mb-1 font-medium">عدد الأشخاص</label>
                    <input type="number" min="1" max="20" defaultValue="2" className="w-full bg-black border border-[#39FF14]/30 rounded-md p-3 text-white focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] transition-colors" />
                  </div>
                  
                  {/* زر البحث */}
                  <div className="flex items-end">
                    <button type="submit" className="w-full bg-[#39FF14] text-black font-bold p-3 rounded-md hover:bg-[#39FF14]/90 transition-colors relative group">
                      <span className="relative z-10 flex items-center justify-center">
                        ابحث الآن
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 rtl:ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                      {/* تأثير التوهج عند التحويم */}
                      <span className="absolute inset-0 bg-[#39FF14] filter blur-md opacity-0 group-hover:opacity-50 transition-opacity"></span>
                    </button>
                  </div>
                </form>
                
                {/* الإحصائيات السريعة */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-6 text-center text-sm text-white/70">
                  <div className="flex items-center gap-1">
                    <span className="text-[#39FF14]">120+</span> عقار متاح
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[#39FF14]">95%</span> تقييمات ممتازة
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[#39FF14]">2,500+</span> حجز شهريًا
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
        <style>{`
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
          {/* Scanlines effect */}
          <div className={`absolute inset-x-0 top-1/3 h-12 opacity-30 ${TECH_EFFECTS.pulse}`}>
            <div className="w-full h-full bg-[#39FF14]/10 relative overflow-hidden">
              {Array.from({length: 10}).map((_, i) => (
                <div key={i} className="h-px bg-[#39FF14]/30 w-full" 
                     style={{position: 'absolute', top: `${i * 10}%`}}></div>
              ))}
            </div>
          </div>
          
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