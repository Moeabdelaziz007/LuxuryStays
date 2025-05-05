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
      {/* 🧊 Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center">
        <img
          src="https://i.ibb.co/BzvWzbh/villa-hero.jpg"
          alt="Luxury Villa"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center max-w-2xl px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-green-400 drop-shadow-lg mb-4">
            StayX
          </h1>
          <p className="text-2xl md:text-3xl font-light text-white mb-6 drop-shadow-md">
            إحجز إقامتك الفاخرة وخدماتك الذكية هذا الصيف ✨
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="inline-block bg-green-400 text-black font-bold py-3 px-8 rounded-full text-lg hover:scale-105 transition-all"
            >
              تسجيل الدخول الآن
            </a>
            <button 
              onClick={handleSeedData} 
              disabled={seeding}
              className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:scale-105 transition-all">
              {seeding ? 'جاري الإضافة...' : 'إضافة بيانات تجريبية'}
            </button>
          </div>
          {seedResult && (
            <div className={`mt-4 p-2 rounded ${seedResult.success ? 'bg-green-800' : 'bg-red-800'}`}>
              {seedResult.success ? 'تم إضافة البيانات بنجاح!' : 'حدث خطأ أثناء إضافة البيانات'}
            </div>
          )}
        </div>
      </section>

      {/* 🏠 العقارات */}
      <section className="py-20 px-6">
        <h2 className="text-4xl font-bold mb-10 text-center text-green-400">عقارات مميزة</h2>
        <FeaturedProperties />
      </section>

      {/* 🛎️ الخدمات */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <h2 className="text-4xl font-bold mb-10 text-center text-green-400">الخدمات المتوفرة</h2>
        <ServicesSection />
      </section>

      {/* 🚀 Coming Soon Section */}
      <section className="py-24 px-6 text-center relative bg-gradient-to-b from-black to-gray-900">
        <h2 className="text-5xl font-bold mb-12 text-green-400">ترقبوا قريباً 🔥</h2>
        
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-16">
          {/* ChillRoom */}
          <div className="bg-gray-800 rounded-xl p-8 transform transition-all hover:scale-105 shadow-lg border border-gray-700 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-4xl font-bold mb-4 text-green-400">ChillRoom 🧊</h3>
              <p className="text-xl mb-6 text-white">
                مساحة ترفيه ذكية داخل StayX لمشاركة اللحظات، الموسيقى، والفيديوهات
              </p>
              <ul className="text-left text-gray-300 mb-6">
                <li className="mb-2">✨ دردشة مباشرة مع ضيوف آخرين</li>
                <li className="mb-2">✨ مشاركة تجربتك مع الأصدقاء</li>
                <li className="mb-2">✨ مشاهدة فيديوهات حصرية</li>
              </ul>
              <span className="bg-green-400 text-black px-5 py-2 rounded-full text-sm font-bold tracking-widest">
                قريباً - صيف 2025
              </span>
            </div>
            <img
              src="https://i.ibb.co/T8PtzDz/chillroom-cover.jpg"
              alt="ChillRoom"
              className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-15 transition-opacity"
            />
          </div>
          
          {/* Coming Soon Services */}
          <div className="bg-gray-800 rounded-xl p-8 transform transition-all hover:scale-105 shadow-lg border border-gray-700">
            <h3 className="text-4xl font-bold mb-4 text-green-400">خدمات حصرية 💎</h3>
            <p className="text-xl mb-6 text-white">
              استعد لتجربة مستوى جديد من الرفاهية مع خدماتنا القادمة
            </p>
            <ul className="text-left text-gray-300 mb-6">
              <li className="mb-3">🌊 <span className="text-white font-semibold">المساج الفاخر</span> - خدمة مساج متكاملة داخل الفيلا</li>
              <li className="mb-3">⛵ <span className="text-white font-semibold">رحلات بحرية</span> - تأجير يخوت وقوارب خاصة</li>
              <li className="mb-3">🥂 <span className="text-white font-semibold">حفلات خاصة</span> - تنظيم وإدارة الحفلات في الشاليه</li>
            </ul>
            <div className="text-center">
              <a href="/register" className="inline-block bg-green-400 hover:bg-green-500 text-black font-bold py-2 px-6 rounded-full transition-all">
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
            <input type="email" placeholder="بريدك الإلكتروني" className="px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
            <button className="bg-green-400 hover:bg-green-500 text-black font-bold py-3 px-6 rounded-lg transition-all">
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