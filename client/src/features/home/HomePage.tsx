import React from "react";
import { Link } from "wouter";
import ServicesSection from "@/features/home/ServicesSection";
import NewHeroSection from "@/features/home/NewHeroSection";
import SpaceFooter from "@/components/layout/SpaceFooter";
import { SpaceButton } from "@/components/ui/space-button";
import SpaceBubbleBot from "@/features/chatbot/SpaceBubbleBot";
import { motion } from "framer-motion";

// Simple stars component for background
const BackgroundStars = ({ count = 50 }: { count?: number }) => {
  return Array.from({ length: count }).map((_, i) => {
    const size = Math.random() * 2 + 1;
    const color = Math.random() > 0.7 ? "#39FF14" : "#ffffff";
    
    return (
      <div 
        key={`star-${i}`}
        className="absolute rounded-full animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          animationDuration: `${3 + Math.random() * 7}s`,
          opacity: Math.random() * 0.7 + 0.3
        }}
      />
    );
  });
};

// Animated gradient background
const AnimatedGradientBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black z-0"></div>
      
      {/* Animated nebulae */}
      <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-[radial-gradient(ellipse_at_center,_rgba(57,255,20,0.1),transparent_50%)] rounded-full opacity-40 blur-3xl animate-pulse-very-slow"></div>
      <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-[radial-gradient(ellipse_at_center,_rgba(0,191,255,0.07),transparent_50%)] rounded-full opacity-30 blur-3xl animate-pulse-slow-delay"></div>
      
      {/* Circuit pattern overlay */}
      <div className="tech-circuit absolute inset-0 opacity-10 z-1"></div>
      
      {/* Stars */}
      <div className="absolute inset-0 z-2">
        <BackgroundStars count={70} />
      </div>
    </div>
  );
};

// Full-height section component with simple animations
const FullScreenSection = ({ 
  children, 
  className = "", 
  hasDivider = false, 
  hasAnimation = true 
}: { 
  children: React.ReactNode; 
  className?: string; 
  hasDivider?: boolean; 
  hasAnimation?: boolean;
}) => {
  const sectionClasses = `min-h-screen relative overflow-hidden flex flex-col justify-center ${className}`;
  
  return (
    <section className={sectionClasses}>
      {/* Background effects */}
      <AnimatedGradientBackground />
      
      {/* Divider on top */}
      {hasDivider && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent z-10"></div>
      )}
      
      {/* Scanning beam animation */}
      <div 
        className="absolute h-[2px] top-0 left-[-100%] right-0 bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent z-10"
        style={{ animation: "glitchScan 8s ease-in-out infinite" }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 py-20 flex-grow flex flex-col justify-center">
        {hasAnimation ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        ) : children}
      </div>
    </section>
  );
};

// Enhanced heading component with consistent styling
const SectionHeading = ({ 
  title, 
  highlight, 
  description 
}: { 
  title: string; 
  highlight: string; 
  description?: string;
}) => {
  return (
    <motion.div 
      className="mb-16 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7 }}
    >
      <h2 className="text-5xl font-bold mb-6">
        <span className="text-white">{title}</span>{" "}
        <span className="text-[#39FF14] text-shadow-glow animate-text-pulse">{highlight}</span>
      </h2>
      
      <div className="w-32 h-1 bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent mx-auto animate-pulse"></div>
      
      {description && (
        <p className="text-gray-300 mt-6 max-w-2xl mx-auto text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default function HomePage() {
  return (
    <div className="text-white">
      {/* ✨ قسم البداية - مستقبل الإقامة الفاخرة */}
      <NewHeroSection />

      {/* ✨ قسم الخدمات مع تأثيرات النجوم والدوائر الكهربائية */}
      <FullScreenSection hasDivider={true}>
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="خدماتنا" 
            highlight="المتميزة" 
            description="نقدم مجموعة متكاملة من الخدمات لضمان إقامة لا تُنسى تجمع بين الرفاهية والتقنية"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ServicesSection />
          </motion.div>
        </div>
      </FullScreenSection>
      
      {/* ✨ قسم الاتصال والتواصل - محسّن مع التأثيرات الفضائية */}
      <FullScreenSection hasDivider={true}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeading 
              title="تواصل" 
              highlight="معنا" 
              description="هل لديك أسئلة أو ترغب في الحجز؟ فريق خدمة العملاء لدينا جاهز دائمًا لمساعدتك"
            />
            
            {/* صندوق معلومات الاتصال مع التأثيرات الفضائية */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="bg-black/60 p-8 rounded-2xl border border-[#39FF14]/20 relative overflow-hidden backdrop-filter backdrop-blur-sm shadow-[0_0_40px_rgba(57,255,20,0.15)]"
            >
              {/* الخطوط المضيئة العلوية والسفلية */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
              
              {/* تأثير المسح الضوئي */}
              <div className="absolute left-0 top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-[#39FF14]/5 to-transparent opacity-30" 
                   style={{animation: "scanline 3s linear infinite"}}></div>
              
              {/* Circuit corner decorations */}
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#39FF14]/20 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#39FF14]/20 rounded-bl-xl"></div>
              
              {/* تصميم متجاوب مع الهواتف المحمولة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-right">
                <div className="relative">
                  <h3 className="text-2xl font-semibold mb-6 text-white inline-flex items-center gap-3 text-shadow-glow">
                    <span className="bg-[#39FF14]/20 p-2 rounded-full animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </span>
                    معلومات الاتصال
                  </h3>
                  
                  <div className="space-y-5 bg-black/50 p-6 rounded-xl backdrop-blur-sm border border-[#39FF14]/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <p className="text-gray-200 flex items-center justify-end gap-3 text-lg">
                      <span>info@stayx.com</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </p>
                    <p className="text-gray-200 flex items-center justify-end gap-3 text-lg">
                      <span>+20 123 456 789</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <h3 className="text-2xl font-semibold mb-6 text-white inline-flex items-center gap-3 text-shadow-glow">
                    <span className="bg-[#39FF14]/20 p-2 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#39FF14]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </span>
                    ساعات العمل
                  </h3>
                  
                  <div className="space-y-5 bg-black/50 p-6 rounded-xl backdrop-blur-sm border border-[#39FF14]/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <p className="text-gray-200 flex items-center justify-end gap-3 text-lg">
                      <span className="text-right">من السبت إلى الخميس:<br className="sm:hidden" /> 9 صباحًا - 10 مساءً</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#39FF14] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </p>
                    <p className="text-gray-200 flex items-center justify-end gap-3 text-lg">
                      <span>الجمعة: 1 ظهرًا - 10 مساءً</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#39FF14] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* زر CTA محسن بتأثيرات فضائية */}
              <div className="mt-12 text-center relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/30 to-[#39FF14]/0 rounded-lg blur-xl opacity-30"></div>
                
                <Link href="/contact">
                  <SpaceButton
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto px-8 py-4 text-lg font-bold shadow-[0_0_25px_rgba(57,255,20,0.3)]"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    }
                  >
                    التواصل مع خدمة العملاء
                  </SpaceButton>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </FullScreenSection>

      {/* ✨ تذييل الصفحة المحسّن بمكون منفصل */}
      <SpaceFooter />
      
      {/* ✨ مساعد محادثة ذكي بنمط فقاعة */}
      <SpaceBubbleBot botName="ستايكس" position="bottom-right" />
    </div>
  );
}