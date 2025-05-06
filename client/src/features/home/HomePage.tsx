import React from "react";
import FeaturedProperties from "@/features/home/FeaturedProperties";
import ServicesSection from "@/features/home/ServicesSection";
import SpaceBackground from "@/components/ui/space-background";

export default function HomePage() {
  
  return (
    <div className="text-white min-h-screen">
      {/* ✨ Luxury Hero Section with Tech-Space Effect */}
      <section>
        <SpaceBackground
          density="high"
          withGrid={true}
          withStars={true}
          withNebula={true}
          withScanlines={true}
          className="min-h-[90vh] md:h-screen flex items-center relative"
        >
          
          {/* Floating Neon Elements - visible on all screens but smaller on mobile */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[15%] right-[10%] w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
            <div className="absolute bottom-[20%] left-[15%] w-20 sm:w-32 h-20 sm:h-32 rounded-full bg-[#39FF14]/5 blur-xl animate-neon-pulse"></div>
            <div className="absolute top-[40%] left-[5%] w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
          </div>
          
          {/* Main Content */}
          <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center justify-between pt-16 md:pt-0">
            {/* Text Section */}
            <div className="w-full md:w-1/2 text-center md:text-right mb-8 md:mb-0">
              <div className="relative">
                {/* Animated Highlight */}
                <div className="absolute -top-10 right-1/2 md:-right-10 transform translate-x-1/2 md:translate-x-0 w-32 h-32 bg-[#39FF14]/20 rounded-full blur-xl animate-neon-pulse"></div>
                
                {/* Branding */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-4 relative">
                  <span className="block">
                    <span className="text-neon-green">Stay</span>
                    <span className="text-white">X</span>
                  </span>
                  <div className="absolute -top-5 -left-5 w-12 h-12 bg-[#39FF14]/30 rounded-full blur-md hidden md:block"></div>
                </h1>
                
                <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-300 mb-6 md:mb-8 max-w-lg mx-auto md:mx-0 md:mr-auto leading-relaxed">
                  بوابتك للإقامة الفاخرة في <span className="text-neon-green font-semibold">الساحل الشمالي</span> وراس الحكمة ✨
                </p>
                
                {/* Stats/Features - smaller on mobile */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-10 max-w-lg mx-auto md:mx-0 md:mr-auto">
                  <div className="text-center p-2 sm:p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-[#39FF14]/20">
                    <div className="text-neon-green text-lg sm:text-2xl font-bold">+٥٠</div>
                    <div className="text-gray-300 text-xs sm:text-sm">عقار فاخر</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-[#39FF14]/20">
                    <div className="text-neon-green text-lg sm:text-2xl font-bold">١٠٠٪</div>
                    <div className="text-gray-300 text-xs sm:text-sm">ضمان الجودة</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-[#39FF14]/20">
                    <div className="text-neon-green text-lg sm:text-2xl font-bold">٢٤/٧</div>
                    <div className="text-gray-300 text-xs sm:text-sm">دعم فني</div>
                  </div>
                </div>
                
                {/* Buttons - Stacked on mobile, side by side on larger screens */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 max-w-xs sm:max-w-lg mx-auto md:mx-0 md:mr-auto">
                  <a
                    href="/properties"
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-[#39FF14] text-black font-bold rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.5)] hover:shadow-[0_0_25px_rgba(57,255,20,0.8)] active:scale-[0.98] transition-all flex items-center justify-center"
                  >
                    <span>استكشف العقارات</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a
                    href="/login"
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-black/50 backdrop-blur-md text-white font-bold rounded-xl border border-[#39FF14]/30 hover:border-[#39FF14] hover:shadow-[0_0_10px_rgba(57,255,20,0.3)] active:scale-[0.98] transition-all"
                  >
                    تسجيل الدخول
                  </a>
                  <a
                    href="/signup"
                    className="px-6 py-3 bg-gray-800/80 backdrop-blur-sm text-gray-300 font-medium rounded-xl border border-gray-700 hover:border-[#39FF14]/30 hover:bg-gray-800 active:scale-[0.98] transition-all"
                  >
                    إنشاء حساب جديد
                  </a>
                </div>
              </div>
            </div>

            {/* Image Section - hidden on small mobile, visible on medium screens and up */}
            <div className="hidden sm:flex w-full md:w-1/2 h-full relative items-center justify-center mt-4 md:mt-0">
              <div className="relative">
                {/* Images - Smaller on tablet, normal on desktop */}
                <div className="w-[300px] md:w-[400px] h-[380px] md:h-[500px] relative rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2 border-[#39FF14]/20 transform rotate-2">
                  <img 
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1170" 
                    alt="Luxury Villa" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-sm p-3 rounded-lg border border-[#39FF14]/10">
                    <div className="text-white text-lg font-bold">فيلا فاخرة في هاسيندا باي</div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#39FF14]">$350 / ليلة</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★★★★★</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-5 -right-5 w-40 h-40 rounded-xl border-2 border-white/10 -z-10"></div>
                <div className="absolute -bottom-5 -left-5 w-40 h-40 rounded-xl border-2 border-[#39FF14]/20 -z-10 shadow-[0_0_20px_rgba(57,255,20,0.1)]"></div>
                
                {/* Badge */}
                <div className="absolute -top-4 -left-4 bg-[#39FF14] text-black font-bold py-2 px-4 rounded-lg shadow-[0_0_15px_rgba(57,255,20,0.5)] transform -rotate-3">
                  أفضل اختيار
                </div>
              </div>
            </div>
          </div>
          
          {/* Neon Scroll Down Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#39FF14] drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </SpaceBackground>
      </section>

      {/* 🏠 العقارات */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 relative">
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
        
        {/* Property Filter Tabs - Scrollable on mobile */}
        <div className="flex justify-start sm:justify-center mb-8 sm:mb-10 overflow-x-auto pb-2 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="inline-flex bg-gray-800 rounded-full p-1">
            <button className="whitespace-nowrap px-4 sm:px-6 py-2 rounded-full bg-[#39FF14] text-black font-medium text-sm sm:text-base">
              الكل
            </button>
            <button className="whitespace-nowrap px-4 sm:px-6 py-2 rounded-full text-white hover:bg-gray-700 transition-colors text-sm sm:text-base">
              الساحل الشمالي
            </button>
            <button className="whitespace-nowrap px-4 sm:px-6 py-2 rounded-full text-white hover:bg-gray-700 transition-colors text-sm sm:text-base">
              راس الحكمة
            </button>
          </div>
        </div>
        
        <FeaturedProperties />
        
        <div className="mt-12 text-center">
          <a href="/properties" className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14] hover:text-black font-bold py-3 px-8 rounded-lg transition-colors">
            عرض جميع العقارات
            <span className="text-xl">←</span>
          </a>
        </div>
        
        <div className="mt-16 bg-gray-800 p-8 rounded-xl max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">هل تملك عقارات في الساحل؟</h3>
              <p className="text-gray-400">سجّل كمدير عقارات وأضف عقاراتك في دقائق</p>
            </div>
            <a href="/register/property-admin" className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-bold py-3 px-6 rounded-lg transition-colors">
              سجّل كمدير عقارات
            </a>
          </div>
        </div>
      </section>

      {/* 🛎️ الخدمات */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <h2 className="text-4xl font-bold mb-10 text-center text-neon-green">الخدمات المتوفرة</h2>
        <ServicesSection />
      </section>

      {/* 🚀 Coming Soon Section - مبسط */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 text-center relative bg-gradient-to-b from-black to-gray-900">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-neon-green">ترقبوا قريباً 🔥</h2>
        
        <div className="max-w-3xl mx-auto mb-8 sm:mb-10">
          {/* ChillRoom - مكون واحد فقط */}
          <div className="bg-gray-800 rounded-xl p-6 sm:p-8 transform transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg border border-gray-700 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-[#39FF14]">ChillRoom 🧊</h3>
              <p className="text-lg mb-4 text-white">
                مساحة ترفيه ذكية داخل StayX لمشاركة اللحظات، الموسيقى، والفيديوهات
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-6">
                <div className="bg-black/50 backdrop-blur-sm p-3 rounded-lg text-center w-full sm:w-auto">
                  <span className="text-[#39FF14] text-xl block mb-1">🌊</span>
                  <span className="text-white font-medium">دردشة مباشرة</span>
                </div>
                <div className="bg-black/50 backdrop-blur-sm p-3 rounded-lg text-center w-full sm:w-auto">
                  <span className="text-[#39FF14] text-xl block mb-1">🥂</span>
                  <span className="text-white font-medium">حفلات خاصة</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <a href="/signup" className="inline-block bg-[#39FF14] hover:bg-[#50FF30] text-black font-bold py-2 px-6 rounded-lg transition-all active:scale-[0.98]">
                  سجل اهتمامك الآن
                </a>
              </div>
              
              <div className="text-center mt-4">
                <span className="bg-[#39FF14]/20 text-[#39FF14] px-3 py-1 rounded-full text-xs font-bold tracking-widest inline-block">
                  قريباً - صيف 2025
                </span>
              </div>
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/90 to-black/70"></div>
            <img
              src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1112"
              alt="ChillRoom"
              className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-15 transition-opacity -z-20"
            />
          </div>
        </div>
        
        <div className="max-w-xl mx-auto px-2 sm:px-0">
          <p className="text-base text-gray-400 mb-5">
            سجّل الآن لتكون من أول المستخدمين وللحصول على إشعارات حصرية!
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center">
            <input type="email" placeholder="بريدك الإلكتروني" className="px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39FF14]" />
            <button className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-bold py-3 px-6 rounded-lg transition-all active:scale-[0.98]">
              اشترك بالنشرة البريدية
            </button>
          </form>
        </div>
      </section>

      {/* ✅ Footer بسيط */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-700">
        © {new Date().getFullYear()} StayX — All rights reserved.
      </footer>
    </div>
  );
}