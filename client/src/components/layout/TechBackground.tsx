// TechBackground.tsx - مكون الخلفية التقنية للتطبيق بتصميم فضائي/سايبر بانك
import React, { useState, useEffect } from 'react';

interface TechBackgroundProps {
  children: React.ReactNode;
  variant?: 'cyber' | 'matrix' | 'stars' | 'grid';
  intensity?: 'high' | 'medium' | 'low' | 'subtle';
  animated?: boolean;
  withGradient?: boolean;
  withGlow?: boolean;
  withScanlines?: boolean;
  withFloatingParticles?: boolean;
  withGrid?: boolean;
  className?: string;
  gradientDirection?: 'radial' | 'diagonal' | 'vertical' | 'horizontal';
}

/**
 * مكون الخلفية التقنية - يوفر خلفية بتصميم سايبر بانك / تقني متطور لكافة أجزاء التطبيق
 */
export default function TechBackground({
  children,
  variant = 'cyber',
  intensity = 'medium',
  animated = true,
  withGradient = true,
  withGlow = true,
  withScanlines = true,
  withFloatingParticles = false,
  withGrid = true,
  className = '',
  gradientDirection = 'diagonal'
}: TechBackgroundProps) {
  // حالة موضع الشبكة
  const [gridOffset, setGridOffset] = useState({ x: 0, y: 0 });
  // حالة موضع الماوس
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // تتبع حركة الماوس لتفاعل الخلفية
  useEffect(() => {
    if (!animated) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100, 
        y: (e.clientY / window.innerHeight) * 100 
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [animated]);
  
  // تحريك الشبكة إذا كانت الخلفية متحركة
  useEffect(() => {
    if (!animated || !withGrid) return;
    
    const interval = setInterval(() => {
      setGridOffset(prev => ({
        x: (prev.x + 0.2) % 100,
        y: (prev.y + 0.1) % 100
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, [animated, withGrid]);
  
  // تحديد كثافة التأثيرات حسب المستوى المطلوب
  const getOpacity = () => {
    switch (intensity) {
      case 'high': return { base: 0.3, grid: 0.15, scanlines: 0.15, glow: 0.8 };
      case 'medium': return { base: 0.2, grid: 0.1, scanlines: 0.1, glow: 0.6 };
      case 'low': return { base: 0.15, grid: 0.05, scanlines: 0.05, glow: 0.4 };
      case 'subtle': return { base: 0.1, grid: 0.03, scanlines: 0.03, glow: 0.2 };
      default: return { base: 0.2, grid: 0.1, scanlines: 0.1, glow: 0.6 };
    }
  };
  
  const opacities = getOpacity();
  
  // تحديد نوع الخلفية
  const getBackgroundElements = () => {
    switch (variant) {
      case 'matrix':
        return (
          <>
            {/* مؤثر الشفرة المتساقطة على طراز Matrix */}
            <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
              <div className="w-full h-full flex">
                {[...Array(15)].map((_, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center overflow-hidden whitespace-nowrap">
                    <div 
                      className={`text-[#39FF14] text-xs font-mono animate-matrix-text leading-3`} 
                      style={{ 
                        animationDuration: `${15 + index}s`,
                        opacity: opacities.base
                      }}
                    >
                      {Array(100).fill(0).map((_, i) => (
                        <div key={i}>{Math.random() > 0.5 ? '1' : '0'}{Math.random() > 0.5 ? '1' : '0'}{Math.random() > 0.5 ? '1' : '0'}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      
      case 'stars':
        return (
          <>
            {/* مؤثر النجوم المتوهجة */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(50)].map((_, index) => (
                <div 
                  key={index}
                  className={`absolute rounded-full bg-[#39FF14] ${animated ? 'animate-pulse-slow' : ''}`}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    opacity: Math.random() * 0.5 + 0.1,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 3 + 2}s`
                  }}
                ></div>
              ))}
            </div>
          </>
        );
      
      case 'grid':
        return null; // الشبكة هي التأثير الافتراضي في case 'cyber' وسيتم إضافتها بشكل منفصل
      
      case 'cyber':
      default:
        return null; // الشبكة والعناصر الأخرى ستضاف بشكل منفصل
    }
  };
  
  // تحديد اتجاه التدرج
  const getGradientStyle = () => {
    if (!withGradient) return {};
    
    switch (gradientDirection) {
      case 'radial':
        return {
          background: 'radial-gradient(circle at center, rgba(0, 0, 5, 0.7) 0%, rgba(0, 0, 5, 0.95) 70%)',
        };
      case 'diagonal':
        return {
          background: 'linear-gradient(135deg, rgba(0, 0, 5, 0.7) 0%, rgba(0, 0, 5, 0.95) 100%)',
        };
      case 'vertical':
        return {
          background: 'linear-gradient(to bottom, rgba(0, 0, 5, 0.7) 0%, rgba(0, 0, 5, 0.95) 100%)',
        };
      case 'horizontal':
        return {
          background: 'linear-gradient(to right, rgba(0, 0, 5, 0.7) 0%, rgba(0, 0, 5, 0.95) 100%)',
        };
      default:
        return {
          background: 'linear-gradient(135deg, rgba(0, 0, 5, 0.7) 0%, rgba(0, 0, 5, 0.95) 100%)',
        };
    }
  };

  return (
    <div className={`relative bg-black overflow-hidden ${className}`}>
      {/* طبقة التدرج (إذا كانت مطلوبة) */}
      {withGradient && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={getGradientStyle()}
        ></div>
      )}
      
      {/* طبقة الشبكة (إذا كانت مطلوبة) */}
      {withGrid && (
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(57, 255, 20, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.03) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundPosition: `${gridOffset.x}px ${gridOffset.y}px`,
            opacity: opacities.grid
          }}></div>
        </div>
      )}
      
      {/* إضافة عناصر خاصة بنوع الخلفية */}
      {getBackgroundElements()}
      
      {/* إضافة مؤثر توهج يتبع الماوس إذا كان مطلوبًا */}
      {withGlow && animated && (
        <div className="absolute opacity-30 pointer-events-none z-0" style={{
          left: `calc(${mousePosition.x}% - 150px)`,
          top: `calc(${mousePosition.y}% - 150px)`,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(57, 255, 20, 0.3) 0%, transparent 70%)',
          transition: 'left 0.3s ease-out, top 0.3s ease-out',
          opacity: opacities.glow
        }}></div>
      )}
      
      {/* مؤثر خطوط المسح (سكان لاينز) إذا كان مطلوبًا */}
      {withScanlines && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute h-full w-full" style={{ opacity: opacities.scanlines }}>
            {[...Array(15)].map((_, index) => (
              <div
                key={index}
                className="h-[1px] w-full bg-[#39FF14]/20 absolute"
                style={{
                  top: `${(index * 7) % 100}%`,
                  animation: animated ? `scan ${3 + index % 2}s linear infinite` : 'none',
                  animationDelay: `${index * 0.2}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
      
      {/* جزيئات عائمة إذا كانت مطلوبة */}
      {withFloatingParticles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(15)].map((_, index) => (
            <div 
              key={index}
              className="absolute rounded-full border border-[#39FF14]/30 bg-[#39FF14]/5"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                opacity: Math.random() * 0.4 + 0.1,
                animation: animated ? `float ${Math.random() * 10 + 15}s ease-in-out infinite` : 'none',
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      )}
      
      {/* المحتوى الرئيسي */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* تعريف الرسوم المتحركة */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes pulse-slow {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes float {
          0% { transform: translate(0, 0); }
          25% { transform: translate(10px, 10px); }
          50% { transform: translate(15px, 0); }
          75% { transform: translate(5px, -10px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes matrix-text {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        
        .animate-matrix-text {
          animation: matrix-text 20s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}