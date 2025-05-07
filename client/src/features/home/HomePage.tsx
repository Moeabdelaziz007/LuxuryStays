import React from "react";
import { Link } from "wouter";
import ServicesSection from "@/features/home/ServicesSection";
import NewHeroSection from "@/features/home/NewHeroSection";
import ComingSoonSection from "@/features/home/ComingSoonSection";
import LastMinuteDeals from "@/features/home/LastMinuteDeals";
import SpaceFooter from "@/components/layout/SpaceFooter";
import { SpaceButton } from "@/components/ui/space-button";
import SpaceBubbleBot from "@/features/chatbot/SpaceBubbleBot";

export default function HomePage() {
  return (
    <div className="text-white min-h-screen relative">
      {/* ✨ قسم البداية - مستقبل الإقامة الفاخرة */}
      <NewHeroSection />

      {/* ✨ قسم الخدمات مع تأثيرات النجوم والدوائر الكهربائية */}
      <section className="py-20 bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm relative overflow-hidden">
        {/* تأثير النجوم */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className={`absolute w-1 h-1 bg-white rounded-full animate-twinkle`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          ))}
          
          {/* دوائر كهربائية */}
          <div className="tech-circuit absolute inset-0 opacity-10"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold mb-4 animate-text-glow">
              <span className="text-white">خدماتنا</span>{" "}
              <span className="text-[#39FF14]">المتميزة</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent mx-auto animate-pulse"></div>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              نقدم مجموعة متكاملة من الخدمات لضمان إقامة لا تُنسى
            </p>
          </div>
          <ServicesSection />
        </div>
      </section>

      {/* ✨ قسم الخدمات القادمة - ChillRoom وخدمات التنظيف والخدمات الأخرى */}
      <ComingSoonSection />
      
      {/* ✨ قسم العروض اللحظية - عروض خاصة لفترة محدودة */}
      <LastMinuteDeals />
      
      {/* ✨ قسم الاتصال والتواصل - محسّن مع التأثيرات الفضائية */}
      <section className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
        {/* تأثير النجوم */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i}
              className={`absolute w-[2px] h-[2px] bg-white rounded-full animate-twinkle`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
          
          {/* دوائر كهربائية */}
          <div className="absolute inset-0 opacity-5">
            <div className="tech-circuit h-full w-full"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 animate-text-glow">
              <span className="text-white">تواصل</span>{" "}
              <span className="text-[#39FF14]">معنا</span>
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent mx-auto mb-4 sm:mb-8 animate-pulse"></div>
            
            <p className="text-gray-300 mb-6 sm:mb-10 text-sm sm:text-base max-w-xl sm:max-w-2xl mx-auto">
              هل لديك أسئلة أو ترغب في الحجز؟ فريق خدمة العملاء لدينا جاهز دائمًا لمساعدتك
            </p>
            
            {/* صندوق معلومات الاتصال مع التأثيرات الفضائية */}
            <div className="bg-black/70 p-4 sm:p-6 md:p-8 rounded-xl border border-[#39FF14]/20 relative overflow-hidden backdrop-filter backdrop-blur-sm shadow-[0_0_30px_rgba(57,255,20,0.15)] animate-circuit-pulse">
              {/* الخطوط المضيئة العلوية والسفلية */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
              
              {/* تأثير المسح الضوئي */}
              <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent to-[#39FF14]/5 animate-scan-grid opacity-30" 
                   style={{animationDuration: '3s'}}></div>
              
              {/* تصميم متجاوب مع الهواتف المحمولة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                <div className="relative">
                  {/* عناصر زخرفية - الدوائر المضيئة */}
                  <div className="hidden md:block absolute -top-6 -right-6 w-12 h-12 border border-[#39FF14]/20 rounded-full opacity-40 animate-pulse"></div>
                  <div className="hidden md:block absolute -bottom-4 -right-4 w-8 h-8 border border-[#39FF14]/10 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white inline-flex items-center gap-2 text-shadow-glow">
                    <span className="bg-[#39FF14]/20 p-1 rounded-full animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </span>
                    معلومات الاتصال
                  </h3>
                  
                  <div className="space-y-3 bg-black/50 p-3 sm:p-4 rounded-lg backdrop-blur-sm border border-[#39FF14]/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
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
                  {/* عناصر زخرفية - الدوائر المضيئة */}
                  <div className="hidden md:block absolute -top-6 -left-6 w-12 h-12 border border-[#39FF14]/20 rounded-full opacity-40 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="hidden md:block absolute -bottom-4 -left-4 w-8 h-8 border border-[#39FF14]/10 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1.5s'}}></div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white inline-flex items-center gap-2 text-shadow-glow">
                    <span className="bg-[#39FF14]/20 p-1 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </span>
                    ساعات العمل
                  </h3>
                  
                  <div className="space-y-3 bg-black/50 p-3 sm:p-4 rounded-lg backdrop-blur-sm border border-[#39FF14]/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
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
              
              {/* زر CTA محسن بتأثيرات فضائية */}
              <div className="mt-8 sm:mt-10 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/30 to-[#39FF14]/0 rounded-lg blur-sm opacity-30 group-hover:opacity-100 transition-all duration-500"></div>
                <Link href="/contact">
                  <SpaceButton
                    variant="primary"
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 font-bold effect-glow"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    }
                  >
                    التواصل مع خدمة العملاء
                  </SpaceButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ تذييل الصفحة المحسّن بمكون منفصل */}
      <SpaceFooter />
      
      {/* ✨ مساعد محادثة ذكي بنمط فقاعة */}
      <SpaceBubbleBot botName="ستايكس" position="bottom-right" />
    </div>
  );
}