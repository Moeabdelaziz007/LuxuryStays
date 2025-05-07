import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import { usePerformanceContext } from "@/contexts/performance-context";

interface TechSpaceBackgroundProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high' | 'ultra';
}

export default function TechSpaceBackground({ 
  className = "",
  intensity = 'medium'
}: TechSpaceBackgroundProps) {
  const { settings } = usePerformanceContext();
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; color: string; delay: number }>>([]);
  const [nebulae, setNebulae] = useState<Array<{ x: number; y: number; size: number; hue: number; delay: number }>>([]);
  
  // استخدام إعدادات الأداء لتحديد عدد العناصر
  const particleCount = settings.highPerformanceMode ? 40 : 25;
  const starsCount = settings.highPerformanceMode ? 100 : 60;
  const dataFlowCount = settings.highPerformanceMode ? 10 : 7;
  const codeRainCount = settings.highPerformanceMode ? 25 : 15;
  
  // وضع النجوم والسدم عند التحميل
  useEffect(() => {
    // توليد النجوم العشوائية
    const generatedStars = Array.from({ length: starsCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      color: Math.random() > 0.7 
        ? Math.random() > 0.5 ? 'blue' : 'orange'
        : 'white',
      delay: Math.random() * 4
    }));
    
    // توليد السدم
    const generatedNebulae = Array.from({ length: 3 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 200 + 200,
      hue: Math.floor(Math.random() * 360),
      delay: Math.random() * 20
    }));
    
    setStars(generatedStars);
    setNebulae(generatedNebulae);
  }, [starsCount]);

  // تعيين مستوى التفاصيل بناءً على الكثافة المحددة
  const getDetailLevel = () => {
    switch(intensity) {
      case 'low':
        return {
          showStars: true,
          showNebulae: false,
          showCircuits: true,
          showParticles: false,
          showDataFlow: true,
          showCodeRain: false,
          showLogo: true,
          showCornerAccents: true,
          glowIntensity: 'low'
        };
      case 'medium':
        return {
          showStars: true,
          showNebulae: true,
          showCircuits: true,
          showParticles: true,
          showDataFlow: true,
          showCodeRain: true,
          showLogo: true,
          showCornerAccents: true,
          glowIntensity: 'medium'
        };
      case 'high':
        return {
          showStars: true,
          showNebulae: true,
          showCircuits: true,
          showParticles: true,
          showDataFlow: true,
          showCodeRain: true,
          showLogo: true,
          showCornerAccents: true,
          showShootingStars: true,
          showPulsatingGrid: true,
          glowIntensity: 'high'
        };
      case 'ultra':
        return {
          showStars: true,
          showNebulae: true,
          showCircuits: true,
          showParticles: true,
          showDataFlow: true,
          showCodeRain: true,
          showLogo: true,
          showCornerAccents: true,
          showShootingStars: true,
          showPulsatingGrid: true,
          showHologramEffect: true,
          showAdvancedParticles: true,
          glowIntensity: 'ultra'
        };
      default:
        return {
          showStars: true,
          showNebulae: true,
          showCircuits: true,
          showParticles: true,
          showDataFlow: true,
          showCodeRain: true,
          showLogo: true,
          showCornerAccents: true,
          glowIntensity: 'medium'
        };
    }
  };
  
  const details = getDetailLevel();
  
  // مكتبة الألوان المستخدمة
  const colors = {
    neonGreen: '#39FF14',
    spaceBlack: 'rgb(0, 0, 10)',
    nebulaPurple: 'rgba(80, 0, 150, 0.2)',
    techBlue: 'rgba(0, 150, 255, 0.8)',
    starWhite: 'rgba(255, 255, 255, 0.8)',
    starBlue: 'rgba(100, 150, 255, 0.8)',
    starOrange: 'rgba(255, 150, 50, 0.8)'
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* خلفية فضائية مطورة مع تدرج عميق */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000005] via-[#05051a] to-[#0a1025] z-0"></div>
      
      {/* طبقة النجوم */}
      {details.showStars && (
        <div className="absolute inset-0 z-1 overflow-hidden">
          {stars.map((star, i) => (
            <motion.div
              key={`star-${i}`}
              className={`absolute rounded-full ${star.color === 'blue' ? 'bg-blue-300' : star.color === 'orange' ? 'bg-amber-300' : 'bg-white'}`}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                boxShadow: star.color === 'blue' 
                  ? '0 0 4px rgba(100, 150, 255, 0.8)' 
                  : star.color === 'orange'
                    ? '0 0 4px rgba(255, 150, 50, 0.8)'
                    : '0 0 4px rgba(255, 255, 255, 0.8)'
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: star.delay
              }}
            />
          ))}
          
          {/* النجوم المتساقطة */}
          {details.showShootingStars && Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`shooting-star-${i}`}
              className="absolute h-px bg-white opacity-0"
              style={{
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 40}%`,
                width: '100px',
                boxShadow: '0 0 4px white',
                transformOrigin: 'left center',
                rotate: `${Math.random() * 45 - 22.5}deg`
              }}
              animate={{
                opacity: [0, 0.8, 0],
                x: ['0%', '100vw'],
                width: ['50px', '150px', '50px']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 5 + i * 7,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
      
      {/* سدم فضائية */}
      {details.showNebulae && (
        <div className="absolute inset-0 z-1 overflow-hidden">
          {nebulae.map((nebula, i) => (
            <motion.div
              key={`nebula-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${nebula.x}%`,
                top: `${nebula.y}%`,
                width: `${nebula.size}px`,
                height: `${nebula.size}px`,
                background: `radial-gradient(circle at center, 
                  hsla(${nebula.hue}, 70%, 60%, 0.05) 0%, 
                  hsla(${nebula.hue}, 80%, 40%, 0.03) 50%, 
                  transparent 80%)`,
                filter: 'blur(40px)',
                opacity: 0.2,
                mixBlendMode: 'screen'
              }}
              animate={{
                scale: [1, 1.2, 1],
                filter: [
                  'blur(40px) hue-rotate(0deg)',
                  'blur(60px) hue-rotate(30deg)',
                  'blur(40px) hue-rotate(0deg)'
                ]
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                delay: nebula.delay
              }}
            />
          ))}
        </div>
      )}
      
      {/* شبكة تقنية أنيميشن أكثر تطورًا */}
      <div className="tech-grid absolute inset-0 z-1 opacity-10"></div>
      
      {/* نمط دوائر كهربائية متحركة */}
      <div className="tech-circuit absolute inset-0 z-1 opacity-15"></div>
      
      {/* توهج دائري أساسي بألوان تتناسب مع StayX */}
      <motion.div 
        className="absolute top-[25%] left-[20%] rounded-full z-2"
        style={{
          width: details.glowIntensity === 'ultra' ? '400px' : details.glowIntensity === 'high' ? '300px' : '250px',
          height: details.glowIntensity === 'ultra' ? '400px' : details.glowIntensity === 'high' ? '300px' : '250px',
          background: details.glowIntensity === 'ultra' 
            ? 'radial-gradient(circle at center, rgba(57, 255, 20, 0.08) 0%, rgba(57, 255, 20, 0.04) 40%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(57, 255, 20, 0.06) 0%, rgba(57, 255, 20, 0.02) 40%, transparent 70%)',
          filter: details.glowIntensity === 'ultra' ? 'blur(100px)' : 'blur(80px)'
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: details.glowIntensity === 'ultra' 
            ? [0.8, 1, 0.8] 
            : details.glowIntensity === 'high'
              ? [0.6, 0.8, 0.6]
              : [0.5, 0.7, 0.5]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* توهج زرقاء فضائية */}
      <motion.div 
        className="absolute bottom-[15%] right-[20%] rounded-full z-2"
        style={{
          width: details.glowIntensity === 'ultra' ? '500px' : details.glowIntensity === 'high' ? '400px' : '300px',
          height: details.glowIntensity === 'ultra' ? '500px' : details.glowIntensity === 'high' ? '400px' : '300px',
          background: 'radial-gradient(circle at center, rgba(0, 100, 255, 0.04) 0%, rgba(0, 100, 255, 0.02) 40%, transparent 70%)',
          filter: details.glowIntensity === 'ultra' ? 'blur(120px)' : 'blur(90px)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: details.glowIntensity === 'ultra' 
            ? [0.7, 0.9, 0.7] 
            : details.glowIntensity === 'high'
              ? [0.5, 0.7, 0.5]
              : [0.4, 0.6, 0.4]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      {/* خطوط البيانات التقنية المتحركة - كتحسين لخطوط الدوائر السابقة */}
      <svg className="absolute inset-0 w-full h-full z-3 opacity-15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <g stroke={colors.neonGreen} strokeWidth="1" fill="none">
          <motion.path 
            d="M0,540 L1920,540" 
            strokeDasharray="1920"
            strokeDashoffset="1920"
            animate={{ 
              strokeDashoffset: [1920, 0, 0, 1920],
              opacity: [0, 0.7, 0.7, 0]
            }}
            transition={{ 
              duration: 8, 
              times: [0, 0.4, 0.6, 1],
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
          <motion.path 
            d="M960,0 L960,1080" 
            strokeDasharray="1080"
            strokeDashoffset="1080"
            animate={{ 
              strokeDashoffset: [1080, 0, 0, 1080],
              opacity: [0, 0.7, 0.7, 0]
            }}
            transition={{ 
              duration: 8, 
              times: [0, 0.4, 0.6, 1],
              repeat: Infinity,
              repeatDelay: 3,
              delay: 1
            }}
          />
          
          {/* شبكة خطوط مطورة */}
          <motion.path 
            d="M0,270 L1920,270" 
            strokeDasharray="1920"
            strokeDashoffset="1920"
            animate={{ 
              strokeDashoffset: [1920, 0, 0, 1920],
              opacity: [0, 0.5, 0.5, 0]
            }}
            transition={{ 
              duration: 8, 
              times: [0, 0.4, 0.6, 1],
              repeat: Infinity,
              repeatDelay: 3,
              delay: 1.5 
            }}
            strokeOpacity="0.5"
          />
          <motion.path 
            d="M0,810 L1920,810" 
            strokeDasharray="1920"
            strokeDashoffset="1920"
            animate={{ 
              strokeDashoffset: [1920, 0, 0, 1920],
              opacity: [0, 0.5, 0.5, 0]
            }}
            transition={{ 
              duration: 8, 
              times: [0, 0.4, 0.6, 1],
              repeat: Infinity,
              repeatDelay: 3,
              delay: 1.5 
            }}
            strokeOpacity="0.5"
          />
          <motion.path 
            d="M480,0 L480,1080" 
            strokeDasharray="1080"
            strokeDashoffset="1080"
            animate={{ 
              strokeDashoffset: [1080, 0, 0, 1080],
              opacity: [0, 0.5, 0.5, 0]
            }}
            transition={{ 
              duration: 8, 
              times: [0, 0.4, 0.6, 1],
              repeat: Infinity,
              repeatDelay: 3,
              delay: 2 
            }}
            strokeOpacity="0.5"
          />
          <motion.path 
            d="M1440,0 L1440,1080" 
            strokeDasharray="1080"
            strokeDashoffset="1080"
            animate={{ 
              strokeDashoffset: [1080, 0, 0, 1080],
              opacity: [0, 0.5, 0.5, 0]
            }}
            transition={{ 
              duration: 8, 
              times: [0, 0.4, 0.6, 1],
              repeat: Infinity,
              repeatDelay: 3,
              delay: 2
            }}
            strokeOpacity="0.5"
          />
          
          {/* شكل سداسي للدوائر الكهربائية */}
          <motion.path 
            d="M960,540 L1060,590 L1060,690 L960,740 L860,690 L860,590 Z" 
            strokeDasharray="600"
            strokeDashoffset="600"
            animate={{ 
              strokeDashoffset: [600, 0, 0, 600],
              opacity: [0, 0.8, 0.8, 0]
            }}
            transition={{ 
              duration: 8, 
              times: [0, 0.4, 0.6, 1],
              repeat: Infinity,
              repeatDelay: 3,
              delay: 3
            }}
            strokeOpacity="0.7"
          />
          
          {/* مسار هندسي إضافي متحرك بشكل مستمر */}
          {details.showPulsatingGrid && (
            <>
              <motion.circle
                cx="960"
                cy="540"
                r="200"
                stroke={colors.neonGreen}
                strokeWidth="0.5"
                strokeOpacity="0.3"
                fill="none"
                animate={{
                  r: [200, 250, 200],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.path
                d="M760,540 L860,640 M1060,640 L1160,540 M1060,440 L1160,540 M760,540 L860,440"
                strokeOpacity="0.4"
                strokeDasharray="150"
                animate={{
                  strokeDashoffset: [150, 0, 150],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </>
          )}
        </g>
      </svg>
      
      {/* جسيمات عائمة */}
      {details.showParticles && (
        <div className="absolute inset-0 z-4">
          {Array.from({ length: particleCount }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.max(1, Math.random() * 2)}px`,
                height: `${Math.max(1, Math.random() * 2)}px`,
                backgroundColor: Math.random() > 0.8 ? colors.techBlue : colors.neonGreen,
                opacity: 0.2 + Math.random() * 0.5,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 10 - 5, 0],
                opacity: [0.2, 0.6, 0.2],
                boxShadow: [
                  '0 0 0px rgba(57, 255, 20, 0)',
                  '0 0 3px rgba(57, 255, 20, 0.5)',
                  '0 0 0px rgba(57, 255, 20, 0)'
                ]
              }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
          
          {/* جسيمات متقدمة للوضع الفائق */}
          {details.showAdvancedParticles && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`adv-particle-${i}`}
                  className="absolute rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${4 + Math.random() * 4}px`,
                    height: `${4 + Math.random() * 4}px`,
                    background: `radial-gradient(circle at center, ${colors.neonGreen} 0%, transparent 70%)`,
                    opacity: 0.7,
                  }}
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.2, 0.7, 0.2],
                    filter: [
                      'blur(2px) brightness(1)',
                      'blur(4px) brightness(1.5)',
                      'blur(2px) brightness(1)'
                    ]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    delay: i * 2
                  }}
                />
              ))}
            </>
          )}
        </div>
      )}
      
      {/* شعار StayX المطور مع تأثيرات هولوغرامية */}
      <div className="absolute inset-0 flex items-center justify-center z-3 pointer-events-none">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 2.5 }}
            animate={{ 
              opacity: details.glowIntensity === 'ultra' 
                ? [0, 0.13, 0.12, 0.13]
                : details.glowIntensity === 'high'
                  ? [0, 0.11, 0.10, 0.11]
                  : [0, 0.09, 0.085, 0.09],
              scale: details.glowIntensity === 'ultra' 
                ? [2.5, 3.5, 3.3, 3.5]
                : [2.5, 3.2, 3, 3.2],
              rotateY: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Logo 
              size="xl" 
              variant={details.showHologramEffect ? "futuristic" : "neon"} 
              withText 
              withAnimation={details.showHologramEffect} 
              animationType={details.showHologramEffect ? "holographic" : "none"}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* تدفق البيانات الرقمية */}
      {details.showDataFlow && (
        <div className="absolute inset-0 z-3 overflow-hidden">
          {Array.from({ length: dataFlowCount }).map((_, i) => (
            <motion.div
              key={`data-flow-${i}`}
              className="absolute h-px bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent"
              style={{
                left: 0,
                top: `${12 + i * (80 / dataFlowCount)}%`,
                width: '100%',
                opacity: 0
              }}
              animate={{
                opacity: [0, 0.7, 0],
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 4 + i * 0.8,
                repeat: Infinity,
                delay: i * 1.2
              }}
            />
          ))}
        </div>
      )}
      
      {/* تأثير مطر الرمز التقني */}
      {details.showCodeRain && (
        <div className="absolute inset-0 z-3 overflow-hidden opacity-15">
          {Array.from({ length: codeRainCount }).map((_, i) => (
            <motion.div
              key={`code-rain-${i}`}
              className="absolute w-px bg-gradient-to-b from-transparent via-[#39FF14] to-transparent"
              style={{
                left: `${3 + i * (94 / codeRainCount)}%`,
                top: 0,
                height: '60%',
                opacity: 0
              }}
              animate={{
                opacity: [0, 0.9, 0],
                y: ['-60%', '150%']
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}
      
      {/* زخارف الزوايا للعلامة التجارية */}
      {details.showCornerAccents && (
        <>
          <div className="absolute top-6 left-6 w-20 h-20 z-4 pointer-events-none">
            <motion.div 
              className="absolute top-0 left-0 w-10 h-0.5 bg-[#39FF14]"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                boxShadow: [
                  '0 0 5px rgba(57, 255, 20, 0.3)',
                  '0 0 10px rgba(57, 255, 20, 0.5)',
                  '0 0 5px rgba(57, 255, 20, 0.3)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity
              }}
            />
            <motion.div 
              className="absolute top-0 left-0 h-10 w-0.5 bg-[#39FF14]"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                boxShadow: [
                  '0 0 5px rgba(57, 255, 20, 0.3)',
                  '0 0 10px rgba(57, 255, 20, 0.5)',
                  '0 0 5px rgba(57, 255, 20, 0.3)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 0.5
              }}
            />
          </div>
          
          <div className="absolute top-6 right-6 w-20 h-20 z-4 pointer-events-none">
            <motion.div 
              className="absolute top-0 right-0 w-10 h-0.5 bg-[#39FF14]"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                boxShadow: [
                  '0 0 5px rgba(57, 255, 20, 0.3)',
                  '0 0 10px rgba(57, 255, 20, 0.5)',
                  '0 0 5px rgba(57, 255, 20, 0.3)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 1
              }}
            />
            <motion.div 
              className="absolute top-0 right-0 h-10 w-0.5 bg-[#39FF14]"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                boxShadow: [
                  '0 0 5px rgba(57, 255, 20, 0.3)',
                  '0 0 10px rgba(57, 255, 20, 0.5)',
                  '0 0 5px rgba(57, 255, 20, 0.3)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 1.5
              }}
            />
          </div>
          
          <div className="absolute bottom-6 left-6 w-20 h-20 z-4 pointer-events-none">
            <motion.div 
              className="absolute bottom-0 left-0 w-10 h-0.5 bg-[#39FF14]"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                boxShadow: [
                  '0 0 5px rgba(57, 255, 20, 0.3)',
                  '0 0 10px rgba(57, 255, 20, 0.5)',
                  '0 0 5px rgba(57, 255, 20, 0.3)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 2
              }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 h-10 w-0.5 bg-[#39FF14]"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                boxShadow: [
                  '0 0 5px rgba(57, 255, 20, 0.3)',
                  '0 0 10px rgba(57, 255, 20, 0.5)',
                  '0 0 5px rgba(57, 255, 20, 0.3)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 2.5
              }}
            />
          </div>
          
          <div className="absolute bottom-6 right-6 w-20 h-20 z-4 pointer-events-none">
            <motion.div 
              className="absolute bottom-0 right-0 w-10 h-0.5 bg-[#39FF14]"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                boxShadow: [
                  '0 0 5px rgba(57, 255, 20, 0.3)',
                  '0 0 10px rgba(57, 255, 20, 0.5)',
                  '0 0 5px rgba(57, 255, 20, 0.3)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 3
              }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 h-10 w-0.5 bg-[#39FF14]"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                boxShadow: [
                  '0 0 5px rgba(57, 255, 20, 0.3)',
                  '0 0 10px rgba(57, 255, 20, 0.5)',
                  '0 0 5px rgba(57, 255, 20, 0.3)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 3.5
              }}
            />
          </div>
        </>
      )}
      
      {/* تدرج الطبقة النهائية للتأكد من قراءة المحتوى */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#000005] opacity-60 z-5"></div>
      
      {/* خط المسح التقني */}
      {details.showHologramEffect && (
        <motion.div 
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#39FF14]/80 to-transparent z-10"
          style={{ 
            boxShadow: '0 0 10px rgba(57, 255, 20, 0.7)',
            opacity: 0
          }}
          animate={{ 
            opacity: [0, 0.8, 0],
            top: ['0%', '100%'],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "linear"
          }}
        />
      )}
    </div>
  );
}