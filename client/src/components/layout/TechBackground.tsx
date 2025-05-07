import React from "react";
import { cn } from "@/lib/utils";

interface TechBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'dark' | 'glow';
  withParticles?: boolean;
  withScanlines?: boolean;
  withGrid?: boolean;
}

/**
 * خلفية تقنية متطورة مع تأثيرات بصرية متعددة
 * تستخدم كغلاف للعناصر لمنحها المظهر العصري المستقبلي
 */
export default function TechBackground({ 
  children, 
  className,
  variant = 'default',
  withParticles = true,
  withScanlines = true,
  withGrid = true
}: TechBackgroundProps) {
  // تحديد الألوان والخلفيات حسب التنويع المختار
  const variantStyles = {
    default: "bg-[#000005] bg-opacity-90",
    subtle: "bg-[#000005] bg-opacity-75",
    dark: "bg-black",
    glow: "bg-[#000005] bg-opacity-95",
  };
  
  return (
    <div className={cn(
      "relative min-h-screen overflow-hidden",
      variantStyles[variant],
      className
    )}>
      {/* الشبكة الخلفية - تعطي تأثير ثلاثي الأبعاد */}
      {withGrid && (
        <div className="absolute inset-0 z-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(57, 255, 20, 0.1) 1px, transparent 1px), 
                               linear-gradient(90deg, rgba(57, 255, 20, 0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              backgroundPosition: '-1px -1px',
            }}
          />
        </div>
      )}
      
      {/* خطوط المسح - تعطي تأثير شاشة قديمة */}
      {withScanlines && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(
                0deg,
                transparent 0%,
                rgba(57, 255, 20, 0.2) 50%,
                transparent 100%
              )`,
              backgroundSize: '100% 4px',
            }}
          />
        </div>
      )}

      {/* جزيئات متحركة في الخلفية */}
      {withParticles && (
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="absolute w-full h-full">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {Array.from({ length: 50 }).map((_, index) => {
              const size = Math.random() * 3 + 1;
              const opacity = Math.random() * 0.5 + 0.3;
              const left = `${Math.random() * 100}%`;
              const top = `${Math.random() * 100}%`;
              const animationDuration = Math.random() * 20 + 30; // بين 30 و 50 ثانية
              
              return (
                <circle
                  key={index}
                  cx={left}
                  cy={top}
                  r={size}
                  fill="#39FF14"
                  opacity={opacity}
                  filter="url(#glow)"
                  style={{
                    animation: `float ${animationDuration}s infinite alternate ${Math.random() * -40}s`,
                  }}
                />
              );
            })}
          </svg>
        </div>
      )}
      
      {/* تأثير التوهج العلوي */}
      {variant === 'glow' && (
        <div 
          className="absolute top-0 left-0 right-0 h-[150px] z-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(57, 255, 20, 0.2), transparent 70%)',
          }}
        />
      )}
      
      {/* الـGradients الأساسية لتسليط الضوء على الزوايا */}
      <div 
        className="absolute top-0 left-0 w-[250px] h-[250px] z-0 opacity-10"
        style={{
          background: 'radial-gradient(circle at top left, rgba(57, 255, 20, 0.3), transparent 70%)',
        }}
      />
      
      <div 
        className="absolute bottom-0 right-0 w-[250px] h-[250px] z-0 opacity-10"
        style={{
          background: 'radial-gradient(circle at bottom right, rgba(57, 255, 20, 0.3), transparent 70%)',
        }}
      />
      
      {/* المحتوى الفعلي */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
}