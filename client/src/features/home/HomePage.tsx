import React, { useState } from "react";
import FeaturedProperties from "@/features/home/FeaturedProperties";
import ServicesSection from "@/features/home/ServicesSection";
import { seedFirestore } from "@/lib/seedFirestore";

export default function HomePage() {
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ success: boolean, error?: any } | null>(null);
  
  const handleSeedData = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const result = await seedFirestore();
      setSeedResult(result);
    } catch (error) {
      setSeedResult({ success: false, error });
    } finally {
      setSeeding(false);
    }
  };
  
  return (
    <div className="bg-black text-white min-h-screen">
      {/* ✨ Luxury Hero Section with Neon Effect */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Enhanced Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0">
          <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
          
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 opacity-3">
            <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(to right, rgba(57, 255, 20, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(57, 255, 20, 0.2) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}></div>
          </div>
        </div>
        
        {/* Floating Neon Elements - only visible on larger screens */}
        <div className="absolute inset-0 overflow-hidden hidden md:block">
          <div className="absolute top-[15%] right-[10%] w-20 h-20 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
          <div className="absolute bottom-[20%] left-[15%] w-32 h-32 rounded-full bg-[#39FF14]/5 blur-xl animate-neon-pulse"></div>
          <div className="absolute top-[40%] left-[5%] w-16 h-16 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 z-10 flex flex-col md:flex-row items-center justify-between">
          {/* Text Section */}
          <div className="md:w-1/2 text-right mb-12 md:mb-0">
            <div className="relative">
              {/* Animated Highlight */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#39FF14]/20 rounded-full blur-xl animate-neon-pulse"></div>
              
              {/* Branding */}
              <h1 className="text-7xl md:text-8xl font-black text-white mb-4 relative">
                <span className="block">
                  <span className="text-neon-green">Stay</span>
                  <span className="text-white">X</span>
                </span>
                <div className="absolute -top-5 -left-5 w-12 h-12 bg-[#39FF14]/30 rounded-full blur-md"></div>
              </h1>
              
              <p className="text-2xl md:text-3xl font-light text-gray-300 mb-8 max-w-lg leading-relaxed">
                بوابتك للإقامة الفاخرة في <span className="text-neon-green font-semibold">الساحل الشمالي</span> وراس الحكمة ✨
              </p>
              
              {/* Stats/Features */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="text-center p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-[#39FF14]/20">
                  <div className="text-neon-green text-2xl font-bold">+٥٠</div>
                  <div className="text-gray-300 text-sm">عقار فاخر</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-[#39FF14]/20">
                  <div className="text-neon-green text-2xl font-bold">١٠٠٪</div>
                  <div className="text-gray-300 text-sm">ضمان الجودة</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-[#39FF14]/20">
                  <div className="text-neon-green text-2xl font-bold">٢٤/٧</div>
                  <div className="text-gray-300 text-sm">دعم فني</div>
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="/properties"
                  className="px-8 py-4 bg-[#39FF14] text-black font-bold rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.5)] hover:shadow-[0_0_25px_rgba(57,255,20,0.8)] hover:scale-105 transition-all flex items-center justify-center"
                >
                  <span>استكشف العقارات</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
                <a
                  href="/login"
                  className="px-8 py-4 bg-black/50 backdrop-blur-md text-white font-bold rounded-xl border border-[#39FF14]/30 hover:border-[#39FF14] hover:shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all"
                >
                  تسجيل الدخول
                </a>
                <button 
                  onClick={handleSeedData} 
                  disabled={seeding}
                  className="px-6 py-3 bg-gray-800/80 backdrop-blur-sm text-gray-300 font-medium rounded-xl border border-gray-700 hover:border-[#39FF14]/30 hover:bg-gray-800 transition-all"
                >
                  {seeding ? 'جاري الإضافة...' : 'إضافة بيانات تجريبية'}
                </button>
              </div>
              
              {/* Result Message */}
              {seedResult && (
                <div className={`mt-6 p-3 rounded-xl backdrop-blur-sm ${seedResult.success ? 'bg-[#39FF14]/10 text-[#39FF14]' : 'bg-red-500/20 text-red-300'} border ${seedResult.success ? 'border-[#39FF14]/30' : 'border-red-500/30'}`}>
                  {seedResult.success ? '✓ تم إضافة البيانات بنجاح!' : '✗ حدث خطأ أثناء إضافة البيانات'}
                </div>
              )}
            </div>
          </div>

          {/* Image Section */}
          <div className="md:w-1/2 h-full relative flex items-center justify-center">
            <div className="relative">
              {/* Images */}
              <div className="w-[400px] h-[500px] relative rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border-2 border-[#39FF14]/20 transform rotate-2">
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
      </section>

      {/* 🏠 العقارات */}
      <section className="py-20 px-6 relative">
        <div className="absolute top-10 right-10 hidden md:block">
          <div className="bg-[#39FF14] text-black rounded-full px-4 py-1 text-sm font-bold animate-pulse">
            يتم التحديث يومياً
          </div>
        </div>
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-neon-green">عقارات مميزة</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            عقارات فاخرة تم اختيارها بعناية في أفضل المناطق في الساحل الشمالي وراس الحكمة.
            يتم إضافة عقارات جديدة بواسطة مديرين العقارات المعتمدين لدينا.
          </p>
        </div>
        
        {/* Property Filter Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-800 rounded-full p-1">
            <button className="px-6 py-2 rounded-full bg-[#39FF14] text-black font-medium">
              الكل
            </button>
            <button className="px-6 py-2 rounded-full text-white hover:bg-gray-700 transition-colors">
              الساحل الشمالي
            </button>
            <button className="px-6 py-2 rounded-full text-white hover:bg-gray-700 transition-colors">
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

      {/* 🚀 Coming Soon Section */}
      <section className="py-24 px-6 text-center relative bg-gradient-to-b from-black to-gray-900">
        <h2 className="text-5xl font-bold mb-12 text-neon-green">ترقبوا قريباً 🔥</h2>
        
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-16">
          {/* ChillRoom */}
          <div className="bg-gray-800 rounded-xl p-8 transform transition-all hover:scale-105 shadow-lg border border-gray-700 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-4xl font-bold mb-4 text-[#39FF14]">ChillRoom 🧊</h3>
              <p className="text-xl mb-6 text-white">
                مساحة ترفيه ذكية داخل StayX لمشاركة اللحظات، الموسيقى، والفيديوهات
              </p>
              <ul className="text-left text-gray-300 mb-6">
                <li className="mb-2">✨ دردشة مباشرة مع ضيوف آخرين</li>
                <li className="mb-2">✨ مشاركة تجربتك مع الأصدقاء</li>
                <li className="mb-2">✨ مشاهدة فيديوهات حصرية</li>
              </ul>
              <span className="bg-[#39FF14] text-black px-5 py-2 rounded-full text-sm font-bold tracking-widest">
                قريباً - صيف 2025
              </span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1112"
              alt="ChillRoom"
              className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-15 transition-opacity"
            />
          </div>
          
          {/* Coming Soon Services */}
          <div className="bg-gray-800 rounded-xl p-8 transform transition-all hover:scale-105 shadow-lg border border-gray-700">
            <h3 className="text-4xl font-bold mb-4 text-[#39FF14]">خدمات حصرية 💎</h3>
            <p className="text-xl mb-6 text-white">
              استعد لتجربة مستوى جديد من الرفاهية مع خدماتنا القادمة
            </p>
            <ul className="text-left text-gray-300 mb-6">
              <li className="mb-3">🌊 <span className="text-white font-semibold">المساج الفاخر</span> - خدمة مساج متكاملة داخل الفيلا</li>
              <li className="mb-3">⛵ <span className="text-white font-semibold">رحلات بحرية</span> - تأجير يخوت وقوارب خاصة</li>
              <li className="mb-3">🥂 <span className="text-white font-semibold">حفلات خاصة</span> - تنظيم وإدارة الحفلات في الشاليه</li>
            </ul>
            <div className="text-center">
              <a href="/register" className="inline-block bg-[#39FF14] hover:bg-[#50FF30] text-black font-bold py-2 px-6 rounded-full transition-all">
                سجل اهتمامك الآن
              </a>
            </div>
          </div>
        </div>
        
        <div className="max-w-xl mx-auto">
          <p className="text-lg text-gray-400 mb-8">
            سجّل الآن لتكون من أول المستخدمين وللحصول على إشعارات حصرية عند إطلاق الخدمات الجديدة. المستخدمين المسجلين سيحصلون على خصومات خاصة!
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center">
            <input type="email" placeholder="بريدك الإلكتروني" className="px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39FF14]" />
            <button className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-bold py-3 px-6 rounded-lg transition-all">
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