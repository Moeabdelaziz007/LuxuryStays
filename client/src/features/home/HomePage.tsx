import React from "react";
import { Link } from "wouter";
import FeaturedProperties from "@/features/home/FeaturedProperties";
import ServicesSection from "@/features/home/ServicesSection";

// استيراد المكونات الجديدة ذات طابع الفضاء-التقنية
import { TechBackground } from "@/components/ui/tech-theme/TechBackground";
import { TechCard } from "@/components/ui/tech-theme/TechCard";
import { TechButton } from "@/components/ui/tech-theme/TechButton";
import { TechInput } from "@/components/ui/tech-theme/TechInput";
import { TechEffects } from "@/components/ui/tech-theme/TechEffects";

export default function HomePage() {
  
  return (
    <div className="text-white min-h-screen">
      {/* ✨ قسم البداية بتأثيرات فضائية-تقنية */}
      <section>
        <TechBackground
          variant="stars"
          intensity="high"
          animated={true}
          withGradient={true}
          withParticles={true}
          className="min-h-[90vh] md:h-screen flex items-center relative"
        >
          {/* عناصر النيون الطافية - ظاهرة على جميع الشاشات ولكن أصغر على الموبايل */}
          <TechEffects.NeonGlow 
            color="green" 
            intensity="medium" 
            size="md" 
            className="absolute top-[15%] right-[10%]"
          />
          <TechEffects.NeonGlow 
            color="blue" 
            intensity="low" 
            size="lg" 
            className="absolute bottom-[20%] left-[15%] opacity-30"
          />
          <TechEffects.NeonGlow 
            color="green" 
            intensity="low" 
            size="sm" 
            className="absolute top-[40%] left-[5%]"
          />
          
          {/* المحتوى الرئيسي */}
          <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center justify-between pt-16 md:pt-0">
            {/* قسم النص */}
            <div className="w-full md:w-1/2 text-center md:text-right mb-8 md:mb-0">
              <div className="relative">
                {/* إبراز متحرك */}
                <TechEffects.NeonGlow
                  color="green"
                  intensity="low"
                  size="sm"
                  className="absolute -top-10 right-1/2 md:-right-10 transform translate-x-1/2 md:translate-x-0"
                />
                
                {/* اسم العلامة التجارية */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-4 relative">
                  <span className="block">
                    <span className="text-neon-green animate-neon-pulse">Stay</span>
                    <span className="text-white">X</span>
                  </span>
                </h1>
                
                <p className="text-xl sm:text-2xl md:text-3xl font-light text-gray-300 mb-6 md:mb-8 max-w-lg mx-auto md:mx-0 md:mr-auto leading-relaxed">
                  بوابتك للإقامة الفاخرة في <span className="text-neon-green font-semibold">الساحل الشمالي</span> وراس الحكمة ✨
                </p>
                
                {/* الإحصائيات/الميزات - أصغر على الموبايل */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-10 max-w-lg mx-auto md:mx-0 md:mr-auto">
                  <TechCard variant="glowing" withGlow={true} className="text-center p-2 sm:p-3">
                    <div className="text-neon-green text-lg sm:text-2xl font-bold">+٥٠</div>
                    <div className="text-gray-300 text-xs sm:text-sm">عقار فاخر</div>
                  </TechCard>
                  <TechCard variant="glowing" withGlow={true} className="text-center p-2 sm:p-3">
                    <div className="text-neon-green text-lg sm:text-2xl font-bold">١٠٠٪</div>
                    <div className="text-gray-300 text-xs sm:text-sm">ضمان الجودة</div>
                  </TechCard>
                  <TechCard variant="glowing" withGlow={true} className="text-center p-2 sm:p-3">
                    <div className="text-neon-green text-lg sm:text-2xl font-bold">٢٤/٧</div>
                    <div className="text-gray-300 text-xs sm:text-sm">دعم فني</div>
                  </TechCard>
                </div>
                
                {/* الأزرار - متراصة على الموبايل، جنبًا إلى جنب على الشاشات الأكبر */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 max-w-xs sm:max-w-lg mx-auto md:mx-0 md:mr-auto">
                  <TechButton
                    variant="default"
                    size="lg"
                    shimmer={true}
                    className="flex items-center justify-center"
                    onClick={() => window.location.href = '/properties'}
                  >
                    <span>استكشف العقارات</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </TechButton>
                  <TechButton
                    variant="outline"
                    size="lg"
                    glowIntensity="medium"
                    onClick={() => window.location.href = '/login'}
                  >
                    تسجيل الدخول
                  </TechButton>
                  <TechButton
                    variant="ghost"
                    size="lg"
                    onClick={() => window.location.href = '/signup'}
                  >
                    إنشاء حساب جديد
                  </TechButton>
                </div>
              </div>
            </div>

            {/* قسم الصورة - مخفي على الموبايل الصغير، مرئي على الشاشات المتوسطة وما فوق */}
            <div className="hidden sm:flex w-full md:w-1/2 h-full relative items-center justify-center mt-4 md:mt-0">
              <div className="relative">
                {/* الصور - أصغر على التابلت، عادية على سطح المكتب */}
                <div className="w-[300px] md:w-[400px] h-[380px] md:h-[500px] relative rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2 border-[#39FF14]/20 transform rotate-2">
                  <img 
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1170" 
                    alt="Luxury Villa" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <TechCard 
                    variant="holographic" 
                    withShimmer={true}
                    className="absolute bottom-3 left-3 right-3 p-3"
                  >
                    <div className="text-white text-lg font-bold">فيلا فاخرة في هاسيندا باي</div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#39FF14]">$350 / ليلة</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★★★★★</span>
                      </div>
                    </div>
                  </TechCard>
                </div>
                
                {/* العناصر الزخرفية */}
                <div className="absolute -top-5 -right-5 w-40 h-40 rounded-xl border-2 border-white/10 -z-10"></div>
                <div className="absolute -bottom-5 -left-5 w-40 h-40 rounded-xl border-2 border-[#39FF14]/20 -z-10 shadow-[0_0_20px_rgba(57,255,20,0.1)]"></div>
                
                {/* الشارة */}
                <div className="absolute -top-4 -left-4 bg-[#39FF14] text-black font-bold py-2 px-4 rounded-lg shadow-[0_0_15px_rgba(57,255,20,0.5)] transform -rotate-3">
                  أفضل اختيار
                </div>
              </div>
            </div>
          </div>
          
          {/* مؤشر التمرير للأسفل بتأثير النيون */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#39FF14] drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </TechBackground>
      </section>

      {/* 🏠 قسم العقارات */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 relative">
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
      <section className="py-20 px-6 relative">
        <TechBackground
          variant="dots"
          intensity="medium"
          animated={true}
          withGradient={true}
        >
          <TechEffects.ScannerEffect 
            color="green" 
            orientation="horizontal" 
            duration="slow"
            className="absolute inset-x-0 top-1/3 h-12 opacity-30"
          />
          
          <h2 className="text-4xl font-bold mb-10 text-center text-neon-green">الخدمات المتوفرة</h2>
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
          <TechEffects.NeonLine 
            orientation="horizontal"
            length="100%"
            thickness="thin"
            glowing={true}
            className="mt-16 mb-2 mx-auto max-w-4xl"
          />
        </TechBackground>
      </section>

      {/* ✅ Footer بسيط */}
      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} StayX — All rights reserved.
      </footer>
    </div>
  );
}