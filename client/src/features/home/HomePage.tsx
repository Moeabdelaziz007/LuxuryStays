import React from "react";
import { Link } from "wouter";
import ServicesSection from "@/features/home/ServicesSection";
import NewHeroSection from "@/features/home/NewHeroSection";
import LastMinuteDeals from "@/features/home/LastMinuteDeals";
import SpaceFooter from "@/components/layout/SpaceFooter";
import { SpaceButton } from "@/components/ui/space-button";
import SimplifiedChatbot from "@/features/chatbot/SimplifiedChatbot";

export default function HomePage() {
  return (
    <div className="text-white min-h-screen relative">
      {/* ✨ قسم البداية - مستقبل الإقامة الفاخرة */}
      <NewHeroSection />

      {/* ✨ قسم الخدمات مع خلفية بسيطة */}
      <section className="py-20 bg-black min-h-screen flex items-center relative overflow-hidden">
        {/* خلفية بسيطة */}
        <div className="absolute inset-0 overflow-hidden">
          {/* عدد أقل من النجوم للخلفية */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${5 + Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.2
              }}
            />
          ))}
          
          {/* تدرج بسيط أحادي اللون */}
          <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900/30 opacity-40"></div>
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

      {/* ✨ قسم العروض اللحظية - عروض خاصة لفترة محدودة */}
      <LastMinuteDeals />
      
      {/* ✨ قسم الاتصال والتواصل - مبسط */}
      <section className="py-20 min-h-screen flex items-center relative overflow-hidden">
        {/* خلفية بسيطة */}
        <div className="absolute inset-0 overflow-hidden">
          {/* عدد قليل من النجوم */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-[2px] h-[2px] rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: "#fff",
                animationDuration: `${5 + Math.random() * 5}s`,
                opacity: Math.random() * 0.4 + 0.2
              }}
            />
          ))}
          
          {/* خلفية متدرجة بسيطة */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900/30 to-black"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 animate-text-glow">
              <span className="text-white">تواصل</span>{" "}
              <span className="text-[#39FF14]">معنا</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent mx-auto mb-6 animate-pulse"></div>
            
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
              هل لديك أسئلة أو ترغب في الحجز؟ فريق خدمة العملاء لدينا جاهز دائمًا لمساعدتك
            </p>
            
            {/* صندوق معلومات الاتصال مع التأثيرات الفضائية */}
            <div className="bg-black/70 p-8 rounded-xl border border-[#39FF14]/20 relative overflow-hidden backdrop-filter backdrop-blur-sm shadow-[0_0_30px_rgba(57,255,20,0.15)]">
              {/* الخطوط المضيئة العلوية والسفلية */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
              
              {/* تأثير المسح الضوئي */}
              <div className="absolute left-0 top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-[#39FF14]/5 to-transparent opacity-30" 
                   style={{animation: "scanline 3s linear infinite"}}></div>
              
              {/* تصميم متجاوب مع الهواتف المحمولة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-right">
                <div className="relative">
                  <h3 className="text-xl font-semibold mb-4 text-white inline-flex items-center gap-2 text-shadow-glow">
                    <span className="bg-[#39FF14]/20 p-1 rounded-full animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </span>
                    معلومات الاتصال
                  </h3>
                  
                  <div className="space-y-3 bg-black/50 p-4 rounded-lg backdrop-blur-sm border border-[#39FF14]/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <p className="text-gray-300 flex items-center justify-end gap-2 text-sm sm:text-base">
                      <span>info@stayx.com</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </p>
                    <p className="text-gray-300 flex items-center justify-end gap-2 text-sm sm:text-base">
                      <span>+20 123 456 789</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <h3 className="text-xl font-semibold mb-4 text-white inline-flex items-center gap-2 text-shadow-glow">
                    <span className="bg-[#39FF14]/20 p-1 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </span>
                    ساعات العمل
                  </h3>
                  
                  <div className="space-y-3 bg-black/50 p-4 rounded-lg backdrop-blur-sm border border-[#39FF14]/10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    <p className="text-gray-300 flex items-center justify-end gap-2 text-sm sm:text-base">
                      <span className="text-right">من السبت إلى الخميس:<br className="sm:hidden" /> 9 صباحًا - 10 مساءً</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </p>
                    <p className="text-gray-300 flex items-center justify-end gap-2 text-sm sm:text-base">
                      <span>الجمعة: 1 ظهرًا - 10 مساءً</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#39FF14] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* زر CTA محسن بتأثيرات فضائية */}
              <div className="mt-10 text-center">
                <Link href="/contact">
                  <SpaceButton
                    variant="primary"
                    className="w-full sm:w-auto px-6 py-3 font-bold shadow-[0_0_15px_rgba(57,255,20,0.4)]"
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
      <SimplifiedChatbot botName="ستايكس" position="bottom-right" />
    </div>
  );
}