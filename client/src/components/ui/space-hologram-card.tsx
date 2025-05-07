import React, { useState, forwardRef, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// تعريف المتغيرات للبطاقة الهولوجرامية
const hologramCardVariants = cva(
  "relative rounded-lg p-4 overflow-hidden transition-colors",
  {
    variants: {
      variant: {
        primary: "border border-[#39FF14]/40 bg-black/50 backdrop-blur-md text-white",
        dark: "border border-gray-700 bg-black/80 backdrop-blur-sm text-white",
        glass: "border-0 bg-white/5 backdrop-blur-lg text-white shadow-glow-sm",
        tech: "border border-blue-500/30 bg-black/70 backdrop-blur-md text-white",
        command: "border border-[#39FF14]/40 bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-sm text-white",
      },
      intensity: {
        low: "[--effect-intensity:0.2]",
        medium: "[--effect-intensity:0.5]",
        high: "[--effect-intensity:0.8]",
        ultra: "[--effect-intensity:1]",
      },
      animation: {
        none: "",
        pulse: "pulse-animation",
        holographic: "holographic-animation",
        scan: "scan-animation",
        float: "float-animation",
      },
      interactivity: {
        static: "",
        hover: "transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-glow-md",
        active: "transform transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-glow-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      intensity: "medium",
      animation: "none",
      interactivity: "hover",
    },
  }
);

export interface SpaceHologramCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof hologramCardVariants> {
  children?: React.ReactNode;
  showScanLine?: boolean;
  showCorners?: boolean;
  showParticles?: boolean;
  showGlitch?: boolean;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  withHeaderAccent?: boolean;
  withHover3D?: boolean;
}

const SpaceHologramCard = forwardRef<HTMLDivElement, SpaceHologramCardProps>(
  (
    {
      className,
      variant,
      intensity,
      animation,
      interactivity,
      children,
      showScanLine = false,
      showCorners = false,
      showParticles = false,
      showGlitch = false,
      title,
      subtitle,
      icon,
      footer,
      withHeaderAccent = false,
      withHover3D = false,
      ...props
    },
    ref
  ) => {
    // حالة للتحكم في تأثير 3D
    const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    // وظيفة لمعالجة حركة الماوس لتأثير 3D
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!withHover3D || !cardRef.current) return;

      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      
      // حساب موقع المؤشر النسبي داخل البطاقة
      const x = e.clientX - rect.left; // موقع X داخل البطاقة
      const y = e.clientY - rect.top; // موقع Y داخل البطاقة
      
      // تحويل الموقع إلى قيم دوران
      // مقسمة على أبعاد العنصر للحصول على قيم نسبية من 0 إلى 1
      const rotateY = ((x / rect.width) - 0.5) * 10; // قيمة دوران حول محور Y
      const rotateX = ((y / rect.height) - 0.5) * -10; // قيمة دوران حول محور X (معكوسة)
      
      // تحديث حالة التحويل
      setTransform({ rotateX, rotateY });
    };

    // إعادة تعيين التحويل عند مغادرة الماوس
    const handleMouseLeave = () => {
      setTransform({ rotateX: 0, rotateY: 0 });
    };

    // استخدام useEffect للتعامل مع حرآة الماوس للتأثير ثلاثي الأبعاد
    useEffect(() => {
      const currentRef = cardRef.current;
      if (!currentRef || !withHover3D) return;

      // تفعيل معالجات الأحداث
      currentRef.addEventListener('mousemove', handleMouseMove as any);
      currentRef.addEventListener('mouseleave', handleMouseLeave);

      // تنظيف معالجات الأحداث عند تفكيك المكون
      return () => {
        currentRef.removeEventListener('mousemove', handleMouseMove as any);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [withHover3D]);
    
    // تحديد نوع العنصر وسلوكه بناءً على خاصية withHover3D
    if (withHover3D) {
      return (
        <motion.div
          ref={cardRef}
          className={cn(
            hologramCardVariants({ variant, intensity, animation, interactivity }),
            className
          )}
          style={{ 
            transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
            transition: "transform 0.2s ease-out"
          }}
          // @ts-ignore - Framer Motion types conflict with standard HTML div props
          {...props}
        >
          {/* الزخارف والعناصر الهولوجرامية */}
          {showScanLine && <div className="hologram-scan-line absolute inset-0 pointer-events-none" />}
          
          {showCorners && (
            <div className="absolute inset-0 pointer-events-none">
              <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#39FF14]/60" />
              <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#39FF14]/60" />
              <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#39FF14]/60" />
              <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#39FF14]/60" />
            </div>
          )}
          
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none opacity-30">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1 h-1 bg-[#39FF14] rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.6 + 0.2,
                    animation: `particle-float ${Math.random() * 4 + 2}s infinite ease-in-out ${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          )}
          
          {showGlitch && (
            <div className="absolute inset-0 pointer-events-none glitch-effect opacity-10"></div>
          )}
          
          {/* محتوى البطاقة */}
          <div className="relative z-10">
            {(title || subtitle || icon) && (
              <div className={`mb-4 ${withHeaderAccent ? 'pb-3 border-b border-[#39FF14]/20' : ''}`}>
                {icon && <div className="mb-3">{icon}</div>}
                {title && <h3 className="text-lg font-bold text-[#39FF14] mb-1">{title}</h3>}
                {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
              </div>
            )}
            
            <div>{children}</div>
            
            {footer && (
              <div className={`mt-4 ${withHeaderAccent ? 'pt-3 border-t border-[#39FF14]/20' : ''}`}>
                {footer}
              </div>
            )}
          </div>
        </motion.div>
      );
    }
    
    // البطاقة العادية بدون تأثير 3D
    return (
      <div
        ref={ref}
        className={cn(
          hologramCardVariants({ variant, intensity, animation, interactivity }),
          className
        )}
        {...props}
      >
        {/* الزخارف والعناصر الهولوجرامية */}
        {showScanLine && <div className="hologram-scan-line absolute inset-0 pointer-events-none" />}
        
        {showCorners && (
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#39FF14]/60" />
            <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#39FF14]/60" />
            <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#39FF14]/60" />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#39FF14]/60" />
          </div>
        )}
        
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none opacity-30">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-[#39FF14] rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.6 + 0.2,
                  animation: `particle-float ${Math.random() * 4 + 2}s infinite ease-in-out ${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
        
        {showGlitch && (
          <div className="absolute inset-0 pointer-events-none glitch-effect opacity-10"></div>
        )}
        
        {/* محتوى البطاقة */}
        <div className="relative z-10">
          {(title || subtitle || icon) && (
            <div className={`mb-4 ${withHeaderAccent ? 'pb-3 border-b border-[#39FF14]/20' : ''}`}>
              {icon && <div className="mb-3">{icon}</div>}
              {title && <h3 className="text-lg font-bold text-[#39FF14] mb-1">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>
          )}
          
          <div>{children}</div>
          
          {footer && (
            <div className={`mt-4 ${withHeaderAccent ? 'pt-3 border-t border-[#39FF14]/20' : ''}`}>
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }
);

SpaceHologramCard.displayName = "SpaceHologramCard";

export { SpaceHologramCard, hologramCardVariants };