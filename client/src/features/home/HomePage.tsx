import React from "react";
import { Link } from "wouter";
import FeaturedProperties from "@/features/home/FeaturedProperties";
import ServicesSection from "@/features/home/ServicesSection";
import NewHeroSection from "@/features/home/NewHeroSection";

export default function HomePage() {
  return (
    <div className="text-white min-h-screen">
      {/* ✨ قسم البداية - مستقبل الإقامة الفاخرة */}
      <NewHeroSection />

      {/* ✨ قسم العقارات المميزة */}
      <section className="bg-gray-950 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-white">العقارات</span>{" "}
              <span className="text-[#39FF14]">المميزة</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              اكتشف مجموعة منتقاة من أفخم العقارات في الساحل الشمالي ورأس الحكمة
            </p>
          </div>
          <FeaturedProperties />
        </div>
      </section>

      {/* ✨ قسم الخدمات */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-white">خدماتنا</span>{" "}
              <span className="text-[#39FF14]">المتميزة</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              نقدم مجموعة متكاملة من الخدمات لضمان إقامة لا تُنسى
            </p>
          </div>
          <ServicesSection />
        </div>
      </section>

      {/* ✨ قسم الاتصال والتواصل */}
      <section className="bg-gray-950 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-white">تواصل</span>{" "}
              <span className="text-[#39FF14]">معنا</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-8"></div>
            
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
              هل لديك أسئلة أو ترغب في الحجز؟ فريق خدمة العملاء لدينا جاهز دائمًا لمساعدتك
            </p>
            
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">معلومات الاتصال</h3>
                  <div className="space-y-3">
                    <p className="text-gray-400 flex items-center justify-end gap-2">
                      <span>info@stayx.com</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </p>
                    <p className="text-gray-400 flex items-center justify-end gap-2">
                      <span>+20 123 456 789</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">ساعات العمل</h3>
                  <div className="space-y-3">
                    <p className="text-gray-400 flex items-center justify-end gap-2">
                      <span>من السبت إلى الخميس: 9 صباحًا - 10 مساءً</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </p>
                    <p className="text-gray-400 flex items-center justify-end gap-2">
                      <span>الجمعة: 1 ظهرًا - 10 مساءً</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Link href="/contact">
                  <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-all duration-300 group relative overflow-hidden">
                    <span className="relative z-10">التواصل مع خدمة العملاء</span>
                    <span className="absolute inset-0 w-0 bg-[#39FF14] opacity-20 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ قسم التذييل */}
      <footer className="bg-black py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-6">
              <span className="text-[#39FF14]">StayX</span>
              <span className="text-white"> - بوابة الإقامة الفاخرة</span>
            </h3>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} StayX. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}