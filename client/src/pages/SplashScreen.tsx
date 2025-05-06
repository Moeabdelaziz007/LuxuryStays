import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import Logo from '@/components/Logo';

export default function SplashScreen() {
  const [animate, setAnimate] = useState(false);
  const [_, navigate] = useLocation();

  useEffect(() => {
    // Start animation after a short delay
    const animationTimer = setTimeout(() => {
      setAnimate(true);
    }, 300);

    // Navigate to home page after animation completes
    const navigationTimer = setTimeout(() => {
      navigate('/');
    }, 4500); // أطول قليلاً للسماح بانتهاء الرسوم المتحركة

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(navigationTimer);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* نجوم خلفية متلألئة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>
      
      <div className="relative z-10">
        {/* تأثير توهج نابض */}
        <div className={`absolute inset-0 rounded-full bg-[#39FF14]/20 blur-xl scale-150 transition-opacity duration-2000 ${
          animate ? 'opacity-70 animate-pulse' : 'opacity-0'
        }`}></div>
        
        {/* الشعار مع رسوم متحركة للحجم */}
        <div className={`relative transition-all duration-1000 ${
          animate ? 'scale-110' : 'scale-90 opacity-80'
        }`}>
          <Logo 
            size="xl" 
            variant="neon" 
            withText={true} 
            withAnimation={animate}
          />
        </div>
        
        {/* تأثير وميض النيون */}
        <div className={`absolute inset-0 bg-[#39FF14]/10 mix-blend-overlay filter blur-md rounded-full transition-opacity duration-300 ${
          animate ? 'opacity-100 animate-neon-flicker' : 'opacity-0'
        }`}></div>
        
        {/* شعار العلامة التجارية مع تأثير ظهور تدريجي */}
        <div className={`absolute -bottom-16 left-0 right-0 text-center text-white font-light text-lg tracking-widest transition-all duration-1000 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="text-[#39FF14]/90 mb-2 tracking-wide font-medium">صيف ٢٠٢٥</div>
          <div className="rtl-text">نغير كيف تقيم، كيف تستكشف، كيف تستمتع</div>
        </div>
      </div>
      
      {/* تأثير نيون أفقي */}
      <div className={`absolute bottom-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent transition-opacity duration-1000 ${
        animate ? 'opacity-80' : 'opacity-0'
      }`}></div>
    </div>
  );
}