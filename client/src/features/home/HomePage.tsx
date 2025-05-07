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
      <section className="relative">
        <div className="relative min-h-[100vh] bg-black overflow-hidden">
          {/* الخلفية الديناميكية مع تأثيرات التقنية المحسنة */}
          <div className="absolute inset-0 bg-[#000000]">
            {/* شبكة ثلاثية الأبعاد متطورة مع تأثير العمق */}
            <div className="absolute inset-0 opacity-30">
              <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzOUZGMTQiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')]" 
                style={{
                  animation: "panGrid 40s linear infinite", 
                  transformStyle: "preserve-3d", 
                  perspective: "1500px", 
                  transform: "rotateX(70deg)"
                }}></div>
            </div>
            
            {/* طبقة الضباب المحسنة لإضافة مزيد من العمق */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/30 to-black"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-black"></div>
            
            {/* تأثير وهج النيون المحسن */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] bg-[#39FF14] rounded-full opacity-10 blur-[120px] animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-[30vw] h-[30vh] bg-[#39FF14] rounded-full opacity-5 blur-[80px] animate-pulse" style={{animationDelay: "1.5s"}}></div>
            <div className="absolute bottom-1/4 left-1/3 w-[25vw] h-[25vh] bg-[#39FF14] rounded-full opacity-5 blur-[90px] animate-pulse" style={{animationDelay: "0.7s"}}></div>
            
            {/* نقاط بيانات متحركة بتأثير محسن */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} 
                  className="absolute rounded-full"
                  style={{
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    background: `rgba(57, 255, 20, ${Math.random() * 0.7 + 0.3})`,
                    boxShadow: `0 0 ${Math.random() * 6 + 2}px rgba(57, 255, 20, 0.7)`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.8 + 0.2,
                    animation: `float ${Math.random() * 15 + 20}s linear infinite, pulse ${Math.random() * 3 + 2}s ease-in-out infinite alternate`
                  }}
                ></div>
              ))}
            </div>
            
            {/* خطوط اتصال النيون المتطورة */}
            <div className="absolute inset-0">
              <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,100 Q300,200 600,100 T1200,100" fill="none" stroke="#39FF14" strokeWidth="0.8" strokeDasharray="1,5">
                  <animate attributeName="d" dur="20s" repeatCount="indefinite" 
                    values="M0,100 Q300,200 600,100 T1200,100;
                            M0,150 Q300,50 600,150 T1200,150;
                            M0,100 Q300,200 600,100 T1200,100" />
                </path>
                <path d="M0,300 Q400,350 800,300 T1600,300" fill="none" stroke="#39FF14" strokeWidth="0.6" strokeDasharray="0,10">
                  <animate attributeName="d" dur="25s" repeatCount="indefinite" 
                    values="M0,300 Q400,350 800,300 T1600,300;
                            M0,250 Q400,400 800,250 T1600,250;
                            M0,300 Q400,350 800,300 T1600,300" />
                </path>
              </svg>
            </div>
          </div>
          
          {/* المحتوى الرئيسي المحسن */}
          <div className="relative h-full flex flex-col justify-center container mx-auto px-4 pt-10 sm:pt-16 pb-16 sm:pb-24">
            {/* الشعار والعنوان مع تأثير النيون المحسن */}
            <div className="text-center mb-8 sm:mb-10 md:mb-12 mt-8 sm:mt-12 relative">
              {/* توهج خلفي للشعار - محسن */}
              <div className="absolute w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-[#39FF14] rounded-full blur-[100px] opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              
              {/* الشعار المحسن */}
              <div className="relative inline-block">
                <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black pb-2
                              bg-clip-text text-transparent bg-gradient-to-b from-white via-[#39FF14] to-[#21a100]
                              filter drop-shadow-[0_0_10px_rgba(57,255,20,0.6)]">
                  <span className="relative inline-block">
                    <span className="relative">Stay</span>
                    {/* تأثير النيون المحسن بالتوهج حول الحروف */}
                    <span className="absolute inset-0 blur-[8px] bg-clip-text text-transparent bg-gradient-to-b from-white via-[#39FF14] to-[#39FF14]">Stay</span>
                  </span>
                  <span className="text-white font-black ml-1 relative">
                    X
                    <span className="absolute top-0 right-0 h-1/2 w-1/2 bg-[#39FF14] opacity-40 blur-md rounded-full"></span>
                  </span>
                </h1>
                
                {/* الخط المضيء تحت الشعار */}
                <div className="h-1 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent w-full mt-2 opacity-80"></div>
              </div>
              
              {/* جملة وصفية بتأثير الكتابة محسن */}
              <div className="max-w-2xl mx-auto mt-4 sm:mt-8 h-12 sm:h-16 md:h-18 overflow-hidden relative">
                <div className="w-full h-full relative">
                  <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-gray-200 font-light absolute inset-0 animate-typewriter opacity-0" 
                    style={{animationDelay: "0s", animationFillMode: "forwards"}}>
                    مستقبل الإقامة الفاخرة
                  </p>
                  <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-[#39FF14] font-light absolute inset-0 animate-typewriter opacity-0" 
                    style={{animationDelay: "3s", animationFillMode: "forwards", textShadow: "0 0 5px rgba(57, 255, 20, 0.5)"}}>
                    تجربة إقامة بمفهوم جديد
                  </p>
                  <p className="text-base sm:text-xl md:text-2xl lg:text-3xl text-gray-200 font-light absolute inset-0 animate-typewriter opacity-0" 
                    style={{animationDelay: "6s", animationFillMode: "forwards"}}>
                    منازل ذكية. رفاهية استثنائية.
                  </p>
                </div>
              </div>
            </div>
            
            {/* عبارة حماسية محسنة في منتصف القسم */}
            <div className="relative mx-auto w-full max-w-5xl my-8 sm:my-12 md:my-16 px-4 sm:px-6">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 sm:mb-6 relative inline-block">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#39FF14] via-white to-[#39FF14] animate-gradient-x">
                    لسنا الوحيدون ولكننا الأفضل
                  </span>
                  {/* تأثير توهج للعنوان */}
                  <span className="absolute -inset-1 blur-md bg-[#39FF14] opacity-20 rounded-lg"></span>
                </h2>
                <p className="text-gray-200 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                  تمتع بتجربة إقامة استثنائية مع أكثر من <span className="text-[#39FF14] font-semibold">120</span> عقار فاخر في أفضل المواقع
                </p>
              </div>
              
              {/* شريط البحث المتقدم - محسن */}
              <div className="relative bg-black/60 backdrop-blur-3xl p-6 sm:p-8 rounded-2xl 
                  border border-[#39FF14]/30 shadow-[0_0_40px_rgba(57,255,20,0.15)] 
                  transform transition-all hover:shadow-[0_0_50px_rgba(57,255,20,0.25)]
                  overflow-hidden">
                
                {/* إضافة خطوط التزيين الزخرفية */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#39FF14]/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent"></div>
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-[#39FF14]/40 to-transparent"></div>
                <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-[#39FF14]/40 to-transparent"></div>
                
                {/* تأثير المصفوفة المحسن في الخلفية */}
                <div className="absolute inset-0 overflow-hidden opacity-10">
                  <div className="animate-matrix-text text-[10px] leading-tight text-[#39FF14]" style={{fontFamily: "monospace"}}>
                    {Array.from({length: 20}).map((_, i) => (
                      <div key={i} style={{
                        transform: `translateY(${i * 5}px)`,
                        animationDelay: `${i * 0.1}s`,
                        opacity: 1 - (i * 0.04)
                      }}>
                        {i % 2 === 0 ? 
                          '01 STAYX 010 SEARCH 101 LUXURY 1010 STAYX 01 COAST 10 VILLAS 101' : 
                          '10 NORTH 101 COAST 010 BOOKING 1010 STAYX 01 STAY 10 EXPERIENCE 01'}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* نقاط اتصال مضيئة */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} 
                      className="absolute w-1 h-1 bg-[#39FF14]/80 rounded-full animate-ping" 
                      style={{
                        top: `${20 + (i * 10)}%`,
                        left: i % 2 === 0 ? '0%' : '100%',
                        transform: 'translate(-50%, -50%)',
                        animationDuration: `${2 + i}s`,
                        animationDelay: `${i * 0.3}s`
                      }}>
                  </div>
                ))}
                
                {/* عنوان شريط البحث المحسن */}
                <div className="text-center mb-6 sm:mb-8 relative">
                  <div className="inline-block relative">
                    <h3 className="text-white text-2xl sm:text-3xl font-bold inline-flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-[#39FF14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-white via-[#39FF14] to-white">
                        ابحث عن وجهتك المثالية
                      </span>
                    </h3>
                    {/* خط تحتي مضيء */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#39FF14] to-transparent mt-2"></div>
                  </div>
                  
                  {/* جملة توضيحية تحت العنوان */}
                  <p className="text-gray-300 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
                    اكتشف أفخم العقارات في الساحل الشمالي وراس الحكمة وقم بحجز إقامتك المثالية
                  </p>
                </div>
                
                {/* نموذج البحث المحسن */}
                <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* حقل الموقع */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/30 to-[#39FF14]/0 rounded-lg blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-500"></div>
                    <div className="relative">
                      <label className="block text-[#39FF14] text-sm mb-2 font-semibold">الموقع</label>
                      <div className="relative">
                        <select className="w-full py-3 px-4 bg-black/60 backdrop-blur-sm border border-[#39FF14]/40 rounded-lg text-white appearance-none
                                     focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14] focus:shadow-[0_0_15px_rgba(57,255,20,0.4)] 
                                     transition-all">
                          <option value="">جميع المواقع</option>
                          <option value="north-coast">الساحل الشمالي</option>
                          <option value="ras-elhekma">رأس الحكمة</option>
                          <option value="marina">مارينا</option>
                          <option value="alamein">العلمين الجديدة</option>
                          <option value="sahel-city">مدينة الساحل</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#39FF14]">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>
                        
                        {/* تأثير خطوط المسح المحسنة */}
                        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden rounded-lg">
                          <div className="h-full w-full" style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57, 255, 20, 0.15) 2px, transparent 4px)',
                            backgroundSize: '100% 4px',
                            mixBlendMode: 'overlay'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* التاريخ */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/30 to-[#39FF14]/0 rounded-lg blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-500"></div>
                    <div className="relative">
                      <TechInput
                        type="date"
                        label="تاريخ الوصول"
                        withGlow={true}
                        variant="bordered"
                        className="group-hover:border-[#39FF14]/60 transition-colors"
                      />
                    </div>
                  </div>
                  
                  {/* الأشخاص */}
                  <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/30 to-[#39FF14]/0 rounded-lg blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-500"></div>
                    <div className="relative">
                      <TechInput
                        type="number"
                        min="1"
                        max="20"
                        defaultValue="2"
                        label="عدد الأشخاص"
                        withGlow={true}
                        variant="bordered"
                        className="group-hover:border-[#39FF14]/60 transition-colors"
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                        }
                      />
                    </div>
                  </div>
                  
                  {/* زر البحث المحسن */}
                  <div className="flex items-end relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/50 to-[#39FF14]/0 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative w-full">
                      <TechButton
                        type="submit"
                        variant="default"
                        className="w-full py-3.5 text-lg font-bold group-hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]"
                        glowIntensity="strong"
                        animation="pulse"
                        shimmer={true}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span>ابحث الآن</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:transform rtl:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </span>
                      </TechButton>
                    </div>
                  </div>
                </form>
                
                {/* الإحصائيات السريعة المحسنة */}
                <div className="mt-8 pt-5 border-t border-gray-800/50">
                  <div className="flex flex-wrap justify-center sm:justify-around gap-4 sm:gap-8">
                    {/* عنصر إحصائي 1 */}
                    <div className="text-center px-4 py-2 backdrop-blur-md bg-black/30 rounded-lg border border-[#39FF14]/20 transform transition-transform hover:scale-105">
                      <div className="text-[#39FF14] text-lg sm:text-xl font-bold">120+</div>
                      <div className="text-gray-300 text-sm">عقار متاح</div>
                    </div>
                    
                    {/* عنصر إحصائي 2 */}
                    <div className="text-center px-4 py-2 backdrop-blur-md bg-black/30 rounded-lg border border-[#39FF14]/20 transform transition-transform hover:scale-105">
                      <div className="text-[#39FF14] text-lg sm:text-xl font-bold">95%</div>
                      <div className="text-gray-300 text-sm">تقييمات ممتازة</div>
                    </div>
                    
                    {/* عنصر إحصائي 3 */}
                    <div className="text-center px-4 py-2 backdrop-blur-md bg-black/30 rounded-lg border border-[#39FF14]/20 transform transition-transform hover:scale-105">
                      <div className="text-[#39FF14] text-lg sm:text-xl font-bold">2,500+</div>
                      <div className="text-gray-300 text-sm">حجز شهريًا</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* الأزرار الرئيسية - محسنة */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mt-10 sm:mt-12">
              {/* زر تصفح العقارات */}
              <div className="group relative w-full sm:w-auto">
                {/* تأثير التوهج الخارجي */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/70 to-[#39FF14]/0 rounded-lg opacity-70 blur-md group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-pulse-slow"></div>
                
                <TechButton
                  variant="default"
                  size="lg"
                  className="relative w-full sm:w-auto min-w-[220px] py-4 md:py-5 text-lg font-bold"
                  glowIntensity="strong"
                  shimmer={true}
                  animation="pulse"
                  onClick={() => window.location.href = '/properties'}
                >
                  <span className="flex items-center justify-center gap-3">
                    <span>تصفح العقارات</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 rtl:transform rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                  
                  {/* تأثير الخط المتحرك */}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                </TechButton>
              </div>
              
              {/* زر تسجيل الدخول */}
              <div className="group relative w-full sm:w-auto">
                {/* تأثير التوهج الخارجي */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/30 to-[#39FF14]/0 rounded-lg blur-md opacity-0 group-hover:opacity-70 transition duration-300"></div>
                
                <TechButton
                  variant="outline"
                  size="lg"
                  className="relative w-full sm:w-auto min-w-[220px] py-4 md:py-5 text-lg font-bold border-[#39FF14]/50 group-hover:border-[#39FF14]"
                  animation="pulse"
                  onClick={() => window.location.href = '/login'}
                >
                  <span className="flex items-center justify-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10 17 15 12 10 7"></polyline>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                    <span>تسجيل الدخول</span>
                  </span>
                </TechButton>
              </div>
            </div>
            
            {/* مؤشر التمرير للأسفل بتصميم تقني مميز - محسن */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center hover:scale-110 transition-all duration-300 cursor-pointer group">
              <div className="flex flex-col items-center">
                {/* النص فوق المؤشر */}
                <p className="text-xs text-[#39FF14] mb-2 font-medium tracking-wider group-hover:text-white transition-colors">
                  اكتشف المزيد
                </p>
                
                {/* إطار المؤشر المحسن */}
                <div className="relative">
                  {/* الهالة الخارجية */}
                  <div className="absolute -inset-1 bg-gradient-to-b from-[#39FF14]/0 via-[#39FF14]/30 to-[#39FF14]/0 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                  
                  <div className="w-8 h-14 border-2 border-[#39FF14]/50 group-hover:border-[#39FF14] rounded-full flex flex-col justify-start pt-1 relative transition-colors duration-300">
                    {/* نقطة الضوء المتحركة */}
                    <div className="w-1.5 h-1.5 bg-[#39FF14] rounded-full animate-scrolldown shadow-[0_0_5px_rgba(57,255,20,0.8)] group-hover:shadow-[0_0_8px_rgba(57,255,20,1)]"></div>
                    
                    {/* تأثير خط المسح الأفقي */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                      <div className="h-full w-full bg-[#39FF14]/5 transform translate-y-0 animate-scan"></div>
                    </div>
                    
                    {/* نقاط مضيئة ثابتة */}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} 
                          className="absolute w-0.5 h-0.5 bg-[#39FF14] rounded-full" 
                          style={{
                            top: `${30 + (i * 20)}%`,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            opacity: 0.6 - (i * 0.15)
                          }}>
                      </div>
                    ))}
                    
                    {/* الأسهم في الأسفل */}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-[#39FF14]/70 group-hover:text-[#39FF14] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
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

      {/* 🏠 قسم العقارات - محسّن مع تأثيرات تقنية متطورة */}
      <section className="py-10 sm:py-14 md:py-24 px-3 sm:px-4 md:px-6 relative">
        <TechBackground 
          variant="cyber" 
          intensity="low" 
          animated={true}
          withGradient={true}
          withGlow={true}
          withScanlines={true}
          withFloatingParticles={true}
          gradientDirection="radial"
          className="rounded-xl overflow-hidden"
        >
          {/* شارة التحديث اليومي */}
          <div className="absolute top-6 sm:top-10 right-6 sm:right-10 z-10">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39FF14]/0 to-[#39FF14]/30 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-black/80 border border-[#39FF14]/40 text-[#39FF14] rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-bold flex items-center gap-2 group-hover:border-[#39FF14]/70 transition-colors">
                <span className="animate-blink w-2 h-2 bg-[#39FF14] rounded-full"></span>
                يتم التحديث يومياً
              </div>
            </div>
          </div>
          
          {/* العنوان والوصف المحسن */}
          <div className="relative text-center mb-14 sm:mb-20">
            <div className="relative inline-block">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 relative z-10">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#39FF14]/90 via-white to-[#39FF14]/90 animate-gradient-x">
                  عقارات مميزة
                </span>
              </h2>
              <div className="absolute -inset-1 bg-[#39FF14]/10 blur-lg rounded-lg z-0"></div>
              {/* خط زخرفي تحت العنوان */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#39FF14] to-transparent mt-2"></div>
            </div>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
              عقارات فاخرة تم اختيارها بعناية في أفضل المناطق في 
              <span className="text-[#39FF14] font-semibold mx-1">الساحل الشمالي</span> 
              و
              <span className="text-[#39FF14] font-semibold mx-1">راس الحكمة</span>.
              <br />
              يتم إضافة عقارات جديدة بواسطة مديرين العقارات المعتمدين لدينا.
            </p>
          </div>
          
          {/* تصفية العقارات محسنة - قابلة للتمرير على الموبايل */}
          <div className="relative flex justify-start sm:justify-center mb-10 sm:mb-14 overflow-x-auto pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="inline-flex bg-space-black/60 border border-[#39FF14]/20 rounded-full p-1 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <TechButton variant="default" size="sm" className="whitespace-nowrap rounded-full px-5 py-1.5">
                الكل
              </TechButton>
              <TechButton variant="ghost" size="sm" className="whitespace-nowrap rounded-full px-5 py-1.5 hover:text-[#39FF14] hover:bg-black/40">
                الساحل الشمالي
              </TechButton>
              <TechButton variant="ghost" size="sm" className="whitespace-nowrap rounded-full px-5 py-1.5 hover:text-[#39FF14] hover:bg-black/40">
                راس الحكمة
              </TechButton>
              <TechButton variant="ghost" size="sm" className="whitespace-nowrap rounded-full px-5 py-1.5 hover:text-[#39FF14] hover:bg-black/40">
                مارينا
              </TechButton>
            </div>
            
            {/* خط زخرفي أسفل فلاتر التصفية */}
            <div className="absolute -bottom-2 left-0 right-0 mx-auto w-40 h-px bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent"></div>
          </div>
          
          {/* قائمة العقارات المميزة */}
          <div className="relative">
            {/* عنصر زخرفي علوي */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-40 h-8 opacity-30">
              <div className="relative w-full h-full overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#39FF14]/20 to-transparent"></div>
              </div>
            </div>
            
            <FeaturedProperties />
            
            {/* عنصر زخرفي سفلي */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-8 opacity-30 rotate-180">
              <div className="relative w-full h-full overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#39FF14]/20 to-transparent"></div>
              </div>
            </div>
          </div>
          
          {/* زر عرض جميع العقارات المحسن */}
          <div className="mt-14 sm:mt-16 text-center">
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/30 to-[#39FF14]/0 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <TechButton
                variant="outline"
                size="lg"
                glowIntensity="medium"
                className="relative inline-flex items-center justify-center gap-2 px-6 py-3 border-[#39FF14]/60 group-hover:border-[#39FF14] transition-colors"
                onClick={() => window.location.href = '/properties'}
              >
                <span>عرض جميع العقارات</span>
                <span className="text-xl rtl:rotate-180">←</span>
                
                {/* تأثير السطر المتحرك عند المرور */}
                <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#39FF14] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
              </TechButton>
            </div>
          </div>
          
          {/* كارت تسجيل مدير العقارات المحسن */}
          <div className="mt-20 max-w-4xl mx-auto relative">
            {/* تأثير الهالة الخارجية */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/20 to-[#39FF14]/0 rounded-xl blur opacity-70"></div>
            
            <TechCard 
              variant="gradient"
              withGlow={true}
              className="relative p-8 sm:p-10 border border-[#39FF14]/20 backdrop-blur-lg overflow-hidden"
            >
              {/* تأثير الخطوط المتحركة في الخلفية */}
              <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(57, 255, 20, 0.1) 10px, rgba(57, 255, 20, 0.1) 20px)',
                  backgroundSize: '30px 30px',
                  animation: 'float 20s linear infinite',
                }}></div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                <div className="mb-8 md:mb-0 text-center md:text-right">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    <span className="text-[#39FF14] ml-2">+</span>
                    هل تملك عقارات في الساحل؟
                  </h3>
                  <p className="text-gray-300 max-w-md text-sm sm:text-base">
                    سجّل الآن كمدير عقارات وأضف عقاراتك في دقائق واستفد من منصتنا لتسويق وإدارة عقاراتك بكفاءة عالية
                  </p>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/70 to-[#39FF14]/0 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-pulse-slow"></div>
                  <TechButton
                    variant="default"
                    size="lg"
                    className="relative min-w-[220px] py-4 font-bold"
                    glowIntensity="strong"
                    shimmer={true}
                    animation="pulse"
                    onClick={() => window.location.href = '/register/property-admin'}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>سجّل كمدير عقارات</span>
                    </span>
                  </TechButton>
                </div>
              </div>
            </TechCard>
          </div>
        </TechBackground>
      </section>

      {/* 🛎️ قسم الخدمات - محسّن */}
      <section className="py-16 sm:py-20 md:py-24 px-3 sm:px-4 md:px-6 relative">
        <TechBackground
          variant="matrix"
          intensity="low"
          animated={true}
          withGradient={true}
          withGlow={true}
          withScanlines={true}
          gradientDirection="diagonal"
          className="rounded-xl overflow-hidden"
        >
          {/* العنوان المحسن */}
          <div className="relative text-center mb-16">
            <div className="relative inline-block perspective">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 relative z-10">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#39FF14] to-white">
                  الخدمات المتوفرة
                </span>
              </h2>
              
              {/* تأثير توهج تحت العنوان */}
              <div className="absolute -inset-1 bg-[#39FF14]/10 blur-lg rounded-lg z-0"></div>
              
              {/* خط زخرفي تحت العنوان */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#39FF14]/80 to-transparent mt-3"></div>
            </div>
            
            {/* وصف مضاف تحت العنوان */}
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
              خدمات مميزة لضمان تجربة إقامة استثنائية في عقارات 
              <span className="text-[#39FF14] font-medium mx-1">StayX</span>
              الفاخرة
            </p>
          </div>
          
          {/* عناصر زخرفية */}
          <div className="absolute top-10 left-10 w-20 h-20 opacity-20 animate-pulse-slow">
            <div className="w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(57, 255, 20, 0.4) 0%, transparent 70%)',
            }}></div>
          </div>
          
          <div className="absolute bottom-10 right-10 w-32 h-32 opacity-10 animate-pulse-slow" style={{animationDelay: "1s"}}>
            <div className="w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(57, 255, 20, 0.3) 0%, transparent 70%)',
            }}></div>
          </div>
          
          {/* خط أفقي علوي */}
          <div className="absolute top-0 left-0 w-full h-px opacity-30">
            <div className="h-full bg-gradient-to-r from-transparent via-[#39FF14] to-transparent"></div>
          </div>
          
          {/* خط أفقي سفلي */}
          <div className="absolute bottom-0 left-0 w-full h-px opacity-30">
            <div className="h-full bg-gradient-to-r from-transparent via-[#39FF14] to-transparent"></div>
          </div>
          
          {/* أيقونة زخرفية */}
          <div className="absolute top-5 right-5 opacity-40 hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          {/* مكون الخدمات */}
          <div className="relative z-10">
            <ServicesSection />
          </div>
          
          {/* زر مشاهدة المزيد */}
          <div className="mt-16 text-center">
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/30 to-[#39FF14]/0 rounded-lg blur opacity-0 group-hover:opacity-70 transition duration-500"></div>
              <TechButton
                variant="outline"
                size="lg"
                glowIntensity="medium"
                className="relative inline-flex items-center justify-center gap-2 px-6 py-3 border-[#39FF14]/40 group-hover:border-[#39FF14]/80 transition-colors"
                onClick={() => window.location.href = '/services'}
              >
                <span>مشاهدة جميع الخدمات</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:transform rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </TechButton>
            </div>
          </div>
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
              variant="gradient"
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
                variant="bordered"
                withGlow={true}
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