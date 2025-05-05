import React, { useState } from "react";
import FeaturedProperties from "./FeaturedProperties";
import ServicesSection from "./ServicesSection";
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
    <div className="bg-black text-white min-h-screen font-sans">
      {/* 💥 Hero Section */}
      <section className="relative bg-cover bg-center h-[85vh] flex items-center justify-center text-center px-4"
        style={{ backgroundImage: "url('https://i.ibb.co/BzvWzbh/villa-hero.jpg')" }}>
        <div className="bg-black bg-opacity-60 p-8 rounded-2xl shadow-xl max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400">StayX</h1>
          <p className="text-xl md:text-2xl text-white mb-6">الوجهة الأولى للإقامات الفاخرة والخدمات الذكية في الساحل الشمالي</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/login" className="bg-green-400 hover:bg-green-500 text-black font-bold py-3 px-6 rounded-full text-lg transition-all">
              سجل دخولك الآن
            </a>
            <button 
              onClick={handleSeedData} 
              disabled={seeding}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-all">
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

      {/* 🏠 Featured Properties */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-green-400">عقارات مميزة</h2>
        <FeaturedProperties />
      </section>

      {/* 🍽️ Services Section */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-8 text-center text-green-400">الخدمات المتاحة</h2>
        <ServicesSection />
      </section>

      {/* 🔥 ChillRoom Coming Soon */}
      <section className="py-20 px-6 text-center bg-black text-white">
        <h2 className="text-4xl font-bold mb-4 text-green-400">ChillRoom 🧊</h2>
        <p className="text-xl mb-6">مساحتك الاجتماعية داخل StayX — دردش، شاهد فيديوهات، اجمع نقاط، وتفاعل مع المجتمع.</p>
        <span className="text-sm bg-green-400 text-black px-4 py-2 rounded-full">قريباً جداً - صيف 2025</span>
      </section>
    </div>
  );
}