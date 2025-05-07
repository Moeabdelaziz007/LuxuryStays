import React from "react";
import { Link } from "wouter";
import FeaturedProperties from "@/features/home/FeaturedProperties";
import ServicesSection from "@/features/home/ServicesSection";
import NewHeroSection from "@/features/home/NewHeroSection";

export default function HomePage() {
  return (
    <div className="text-white min-h-screen relative">
      {/* ✨ قسم البداية - مستقبل الإقامة الفاخرة */}
      <NewHeroSection />

      {/* ✨ قسم العقارات المميزة */}
      <section className="py-20 bg-opacity-80 backdrop-filter backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-white">العقارات</span>{" "}
              <span className="text-[#39FF14]">المميزة</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              اكتشف مجموعة منتقاة من أفخم العقارات في الساحل الشمالي ورأس الحكمة
            </p>
          </div>
          <FeaturedProperties />
        </div>
      </section>

      {/* ✨ قسم الخدمات */}
      <section className="py-20 bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-white">خدماتنا</span>{" "}
              <span className="text-[#39FF14]">المتميزة</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              نقدم مجموعة متكاملة من الخدمات لضمان إقامة لا تُنسى
            </p>
          </div>
          <ServicesSection />
        </div>
      </section>

      {/* ✨ قسم الاتصال والتواصل - محسّن للجوال */}
      <section className="py-12 sm:py-16 md:py-20 bg-opacity-80 backdrop-filter backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              <span className="text-white">تواصل</span>{" "}
              <span className="text-[#39FF14]">معنا</span>
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-4 sm:mb-8"></div>
            
            <p className="text-gray-300 mb-6 sm:mb-10 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto">
              هل لديك أسئلة أو ترغب في الحجز؟ فريق خدمة العملاء لدينا جاهز دائمًا لمساعدتك
            </p>
            
            <div className="bg-gray-900 bg-opacity-80 p-4 sm:p-6 md:p-8 rounded-xl border border-gray-800 relative overflow-hidden backdrop-filter backdrop-blur-sm">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
              
              {/* تصميم متجاوب مع الهواتف المحمولة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                <div className="relative">
                  {/* عناصر زخرفية - تظهر فقط على الشاشات الكبيرة */}
                  <div className="hidden md:block absolute -top-6 -right-6 w-12 h-12 border border-[#39FF14]/20 rounded-full opacity-40"></div>
                  <div className="hidden md:block absolute -bottom-4 -right-4 w-8 h-8 border border-[#39FF14]/10 rounded-full opacity-30"></div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white inline-flex items-center gap-2">
                    <span className="md:hidden bg-[#39FF14]/20 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </span>
                    معلومات الاتصال
                  </h3>
                  
                  <div className="space-y-3 bg-black/30 p-3 rounded-lg backdrop-blur-sm border border-gray-800/60">
                    <p className="text-gray-300 flex items-center justify-end gap-2 text-sm sm:text-base">
                      <span>info@stayx.com</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </p>
                    <p className="text-gray-300 flex items-center justify-end gap-2 text-sm sm:text-base">
                      <span>+20 123 456 789</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  {/* عناصر زخرفية - تظهر فقط على الشاشات الكبيرة */}
                  <div className="hidden md:block absolute -top-6 -left-6 w-12 h-12 border border-[#39FF14]/20 rounded-full opacity-40"></div>
                  <div className="hidden md:block absolute -bottom-4 -left-4 w-8 h-8 border border-[#39FF14]/10 rounded-full opacity-30"></div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white inline-flex items-center gap-2">
                    <span className="md:hidden bg-[#39FF14]/20 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </span>
                    ساعات العمل
                  </h3>
                  
                  <div className="space-y-3 bg-black/30 p-3 rounded-lg backdrop-blur-sm border border-gray-800/60">
                    <p className="text-gray-300 flex items-center justify-end gap-2 text-sm sm:text-base">
                      <span className="text-right">من السبت إلى الخميس:<br className="sm:hidden" /> 9 صباحًا - 10 مساءً</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#39FF14] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </p>
                    <p className="text-gray-300 flex items-center justify-end gap-2 text-sm sm:text-base">
                      <span>الجمعة: 1 ظهرًا - 10 مساءً</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#39FF14] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* زر CTA أكثر بروزًا للجوال */}
              <div className="mt-8 sm:mt-10">
                <Link href="/contact">
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-[#39FF14] hover:bg-[#45ff25] text-black font-bold rounded-lg transition-all duration-300 group relative overflow-hidden shadow-[0_0_15px_rgba(57,255,20,0.3)]">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      التواصل مع خدمة العملاء
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </span>
                    <span className="absolute inset-0 w-0 bg-white opacity-20 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ قسم التذييل - محسّن للجوال مع روابط مفيدة */}
      <footer className="pt-12 pb-6 sm:py-12 bg-black bg-opacity-80 backdrop-filter backdrop-blur-sm border-t border-gray-800/50">
        <div className="container mx-auto px-4">
          {/* محتوى تذييل محسّن */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-right">
            <div className="space-y-4">
              <h3 className="text-white text-xl font-bold mb-4 flex items-center justify-end">
                <span className="ml-2 bg-[#39FF14]/10 p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </span>
                <span>StayX</span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                بوابتك للإقامة الفاخرة في أفضل العقارات بالساحل الشمالي وراس الحكمة مع خدمات حصرية وتجربة تقنية متطورة.
              </p>
              <div className="flex justify-end space-x-3 space-x-reverse">
                <a href="#" className="bg-gray-800 hover:bg-[#39FF14]/20 p-2 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-[#39FF14]/20 p-2 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-[#39FF14]/20 p-2 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center justify-end">
                <span className="ml-2 bg-[#39FF14]/10 p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span>روابط سريعة</span>
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-[#39FF14] transition-colors">
                  <a href="/" className="flex items-center justify-end gap-1">
                    <span>الصفحة الرئيسية</span>
                    <span className="text-[#39FF14]">›</span>
                  </a>
                </li>
                <li className="hover:text-[#39FF14] transition-colors">
                  <a href="/properties" className="flex items-center justify-end gap-1">
                    <span>استكشف العقارات</span>
                    <span className="text-[#39FF14]">›</span>
                  </a>
                </li>
                <li className="hover:text-[#39FF14] transition-colors">
                  <a href="/services" className="flex items-center justify-end gap-1">
                    <span>خدماتنا</span>
                    <span className="text-[#39FF14]">›</span>
                  </a>
                </li>
                <li className="hover:text-[#39FF14] transition-colors">
                  <a href="/about" className="flex items-center justify-end gap-1">
                    <span>من نحن</span>
                    <span className="text-[#39FF14]">›</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center justify-end">
                <span className="ml-2 bg-[#39FF14]/10 p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </span>
                <span>الفئات المتميزة</span>
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-[#39FF14] transition-colors">
                  <a href="/properties?category=villas" className="flex items-center justify-end gap-1">
                    <span>الفلل الفاخرة</span>
                    <span className="text-[#39FF14]">›</span>
                  </a>
                </li>
                <li className="hover:text-[#39FF14] transition-colors">
                  <a href="/properties?category=chalets" className="flex items-center justify-end gap-1">
                    <span>شاليهات على البحر</span>
                    <span className="text-[#39FF14]">›</span>
                  </a>
                </li>
                <li className="hover:text-[#39FF14] transition-colors">
                  <a href="/properties?category=pools" className="flex items-center justify-end gap-1">
                    <span>عقارات بمسابح خاصة</span>
                    <span className="text-[#39FF14]">›</span>
                  </a>
                </li>
                <li className="hover:text-[#39FF14] transition-colors">
                  <a href="/properties?category=luxury" className="flex items-center justify-end gap-1">
                    <span>العقارات الاستثنائية</span>
                    <span className="text-[#39FF14]">›</span>
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center justify-end">
                <span className="ml-2 bg-[#39FF14]/10 p-1 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <span>تواصل معنا</span>
              </h3>
              <div className="space-y-3 text-gray-400 text-sm">
                <div className="flex items-center justify-end gap-2">
                  <div>
                    <p>info@stayx.com</p>
                    <p>support@stayx.com</p>
                  </div>
                  <div className="bg-[#39FF14]/10 p-1 rounded flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div>
                    <p>+20 123 456 789</p>
                    <p>+20 123 456 780</p>
                  </div>
                  <div className="bg-[#39FF14]/10 p-1 rounded flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* سطر فاصل مع تأثير تكنو فضائي */}
          <div className="relative h-px mb-6">
            <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent"></div>
            <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-[#39FF14] transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          </div>
          
          {/* حقوق النشر */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-right">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-lg font-bold mb-2">
                <span className="text-[#39FF14]">StayX</span>
                <span className="text-white"> - بوابة الإقامة الفاخرة</span>
              </h3>
            </div>
            <p className="text-gray-400 text-xs">
              © {new Date().getFullYear()} StayX. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}