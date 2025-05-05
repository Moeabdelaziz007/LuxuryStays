import React from "react";

export default function HomePage() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      {/* 💥 Hero Section */}
      <section className="relative bg-cover bg-center h-[85vh] flex items-center justify-center text-center px-4"
        style={{ backgroundImage: "url('https://i.ibb.co/BzvWzbh/villa-hero.jpg')" }}>
        <div className="bg-black bg-opacity-60 p-8 rounded-2xl shadow-xl max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-400">StayX</h1>
          <p className="text-xl md:text-2xl text-white mb-6">الوجهة الأولى للإقامات الفاخرة والخدمات الذكية في الساحل الشمالي</p>
          <a href="/login" className="bg-green-400 hover:bg-green-500 text-black font-bold py-3 px-6 rounded-full text-lg transition-all">
            سجل دخولك الآن
          </a>
        </div>
      </section>

      {/* 🏠 Featured Properties */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-green-400">عقارات مميزة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Replace below with Firestore data later */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white text-black rounded-xl shadow-lg overflow-hidden">
              <img src={`https://source.unsplash.com/400x300/?villa,beach,summer&sig=${i}`} alt="property" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">اسم العقار {i}</h3>
                <p className="text-sm text-gray-700">موقع فخم على البحر مع مسبح خاص وإطلالة ساحرة.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🍽️ Services Section */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-8 text-center text-green-400">الخدمات المتاحة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white text-black rounded-xl p-4 shadow-md">
            <h3 className="text-xl font-bold mb-2">حجز مطاعم</h3>
            <p className="text-sm">احجز طاولتك في أفضل مطاعم الساحل مجاناً.</p>
          </div>
          <div className="bg-white text-black rounded-xl p-4 shadow-md">
            <h3 className="text-xl font-bold mb-2">نوادي ليلية</h3>
            <p className="text-sm">استمتع بالحفلات في أشهر النوادي مقابل 5$ فقط.</p>
          </div>
          <div className="bg-gray-700 text-white rounded-xl p-4 shadow-md opacity-60">
            <h3 className="text-xl font-bold mb-2">المساج</h3>
            <p className="text-sm">قريباً جداً... 💆‍♀️</p>
          </div>
        </div>
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