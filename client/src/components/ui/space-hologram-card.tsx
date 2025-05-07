import React, { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// تعريف المتغيرات لبطاقة الهولوجرام
const hologramCardVariants = cva(
  "relative overflow-hidden rounded-lg transition-all duration-300",
  {
    variants: {
      variant: {
        // بطاقة بتأثير هولوجرامي مع لون StayX الرئيسي
        primary: 
          "hologram-card bg-black/30 backdrop-blur-md border border-[#39FF14]/30 text-white shadow-[0_0_15px_rgba(57,255,20,0.15)]",
        
        // بطاقة هولوجرامية زجاجية
        glass: 
          "glass-effect bg-black/20 backdrop-blur-lg border border-white/10 text-white shadow-[0_0_15px_rgba(0,0,0,0.2)]",
        
        // بطاقة هولوجرامية عالية التقنية بلون أزرق
        tech: 
          "hologram-data-window border border-blue-500/30 text-white shadow-[0_0_15px_rgba(0,100,255,0.15)]",
        
        // بطاقة داكنة للمعلومات التقنية
        dark: 
          "bg-gray-900/90 border border-gray-800 text-gray-200 shadow-lg",
        
        // بطاقة تقنية مميزة للحالات المهمة
        command: 
          "bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-[#39FF14]/30 text-white shadow-[0_0_20px_rgba(0,0,0,0.3)]",
      },
      intensity: {
        low: "opacity-90",
        medium: "",
        high: "shadow-[0_0_25px_rgba(57,255,20,0.2)]",
        ultra: "shadow-[0_0_35px_rgba(57,255,20,0.3)]",
      },
      animation: {
        none: "",
        pulse: "animate-pulse-subtle",
        scan: "hologram-scan-effect",
        glow: "animate-glow",
        float: "animate-float",
        holographic: "hologram-element",
      },
      interactivity: {
        none: "",
        hover: "group hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(57,255,20,0.3)]",
        active: "group active:scale-[0.99] cursor-pointer",
        full: "group hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(57,255,20,0.3)] active:scale-[0.99] cursor-pointer",
      }
    },
    defaultVariants: {
      variant: "primary",
      intensity: "medium",
      animation: "none",
      interactivity: "hover"
    },
  }
);

// مكونات تأثيرات إضافية للبطاقة
const HologramCardEffects = ({
  showScanLine = true,
  showCorners = true,
  showParticles = false,
  showGlitch = false,
  variant = "primary",
}: {
  showScanLine?: boolean;
  showCorners?: boolean;
  showParticles?: boolean;
  showGlitch?: boolean;
  variant?: string;
}) => {
  const isPrimary = variant === "primary";
  const isTech = variant === "tech";
  const scanLineColor = isPrimary ? "rgba(57, 255, 20, 0.7)" : 
                       isTech ? "rgba(0, 150, 255, 0.7)" : 
                       "rgba(255, 255, 255, 0.5)";
  
  return (
    <>
      {/* خط المسح المتحرك */}
      {showScanLine && (
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="absolute left-0 right-0 h-[2px] z-10"
            style={{ 
              background: `linear-gradient(to right, transparent, ${scanLineColor}, transparent)`,
              boxShadow: `0 0 5px ${scanLineColor}`
            }}
            animate={{ 
              top: ["0%", "100%"],
              opacity: [0, 0.7, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatDelay: 5,
              ease: "linear",
              times: [0, 0.5, 1]
            }}
          />
        </motion.div>
      )}
      
      {/* زوايا مضيئة */}
      {showCorners && (
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-0 w-3 h-3 ${isPrimary ? 'border-[#39FF14]/60' : isTech ? 'border-blue-500/60' : 'border-white/40'} border-t-[1px] border-l-[1px]`} />
          <div className={`absolute top-0 right-0 w-3 h-3 ${isPrimary ? 'border-[#39FF14]/60' : isTech ? 'border-blue-500/60' : 'border-white/40'} border-t-[1px] border-r-[1px]`} />
          <div className={`absolute bottom-0 left-0 w-3 h-3 ${isPrimary ? 'border-[#39FF14]/60' : isTech ? 'border-blue-500/60' : 'border-white/40'} border-b-[1px] border-l-[1px]`} />
          <div className={`absolute bottom-0 right-0 w-3 h-3 ${isPrimary ? 'border-[#39FF14]/60' : isTech ? 'border-blue-500/60' : 'border-white/40'} border-b-[1px] border-r-[1px]`} />
        </div>
      )}
      
      {/* جزيئات مضيئة */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${isPrimary ? 'bg-[#39FF14]/80' : isTech ? 'bg-blue-500/80' : 'bg-white/60'}`}
              style={{
                boxShadow: isPrimary 
                  ? '0 0 4px rgba(57, 255, 20, 0.8)' 
                  : isTech 
                    ? '0 0 4px rgba(0, 150, 255, 0.8)'
                    : '0 0 4px rgba(255, 255, 255, 0.6)',
                top: '50%',
                left: '50%',
                opacity: 0
              }}
              animate={{
                x: [
                  0,
                  (Math.random() * 2 - 1) * 100,
                ],
                y: [
                  0,
                  (Math.random() * 2 - 1) * 60,
                ],
                opacity: [0, 0.8, 0],
                scale: [0.2, 1, 0.2]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 3,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
      
      {/* تأثير خلل/تشويش البيانات */}
      {showGlitch && (
        <motion.div 
          className="absolute inset-0 pointer-events-none bg-transparent"
          animate={{ opacity: [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1] }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity, 
            repeatDelay: 10,
            times: [0, 0.1, 0.2, 0.3, 0.4, 0.41, 0.42, 0.43, 0.44, 0.45, 1]
          }}
        >
          <motion.div 
            className="absolute inset-0 opacity-0"
            style={{ 
              background: `linear-gradient(to right, transparent, ${isPrimary ? 'rgba(57, 255, 20, 0.2)' : isTech ? 'rgba(0, 150, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}, transparent)`,
              transform: "skew(-20deg) translateX(-10%)"
            }}
            animate={{ opacity: [0, 0, 0, 0, 0, 0.8, 0, 0.8, 0] }}
            transition={{ 
              duration: 0.5, 
              repeat: Infinity, 
              repeatDelay: 10,
              times: [0, 0.1, 0.2, 0.3, 0.4, 0.41, 0.42, 0.43, 1]
            }}
          />
        </motion.div>
      )}
    </>
  );
};

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

// مكون البطاقة الهولوجرامية الرئيسي
const SpaceHologramCard = React.forwardRef<HTMLDivElement, SpaceHologramCardProps>(
  ({ 
    className, 
    children, 
    variant = "primary", 
    intensity = "medium",
    animation = "none",
    interactivity = "hover",
    showScanLine = true,
    showCorners = true,
    showParticles = false,
    showGlitch = false,
    title,
    subtitle,
    icon,
    footer,
    withHeaderAccent = false,
    withHover3D = false,
    ...props 
  }, ref) => {
    // تعقب حركة المؤشر لتأثير ثلاثي الأبعاد عند تحريك المؤشر
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!withHover3D) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
      if (!withHover3D) return;
      setMousePosition({ x: 0.5, y: 0.5 });
    };

    // احسب التدوير بناءً على موضع المؤشر
    const transform = withHover3D 
      ? {
          rotateX: (mousePosition.y - 0.5) * -8, // تدوير سالب للحصول على تأثير واقعي
          rotateY: (mousePosition.x - 0.5) * 8,
          transformPerspective: "1000px"
        }
      : {};

    // تحديد لون النص وتلاوة الخلفية بناءً على نوع البطاقة
    const isPrimary = variant === "primary";
    const isTech = variant === "tech";
    const headerAccentClass = withHeaderAccent 
      ? isPrimary 
        ? "border-b border-[#39FF14]/30 mb-3 pb-2"
        : isTech
          ? "border-b border-blue-500/30 mb-3 pb-2"
          : "border-b border-gray-700 mb-3 pb-2"
      : "";
    
    const titleColorClass = isPrimary 
      ? "text-[#39FF14]" 
      : isTech 
        ? "text-blue-400" 
        : "text-white";

    return (
      <motion.div
        ref={ref}
        className={cn(
          hologramCardVariants({ variant, intensity, animation, interactivity }),
          className
        )}
        style={{ 
          transform: withHover3D ? `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)` : undefined,
          transition: withHover3D ? "transform 0.2s ease-out" : undefined
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={withHover3D ? {} : undefined}
        {...props}
      >
        <HologramCardEffects 
          showScanLine={showScanLine}
          showCorners={showCorners}
          showParticles={showParticles}
          showGlitch={showGlitch}
          variant={variant as string}
        />
        
        <div className="relative z-10 h-full">
          {/* رأس البطاقة مع العنوان والأيقونة */}
          {(title || icon || subtitle) && (
            <div className={`p-4 ${headerAccentClass}`}>
              <div className="flex items-center justify-between">
                {title && (
                  <div>
                    <h3 className={`font-bold ${titleColorClass}`}>{title}</h3>
                    {subtitle && <p className="text-sm text-gray-300 mt-1">{subtitle}</p>}
                  </div>
                )}
                {icon && <div className="text-white">{icon}</div>}
              </div>
            </div>
          )}
          
          {/* محتوى البطاقة الرئيسي */}
          <div className="px-4 pb-4 pt-0 h-full">
            {children}
          </div>
          
          {/* تذييل البطاقة (اختياري) */}
          {footer && (
            <div className={`px-4 py-3 mt-auto border-t ${
              isPrimary ? 'border-[#39FF14]/20' : 
              isTech ? 'border-blue-500/20' : 
              'border-gray-700'
            }`}>
              {footer}
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

SpaceHologramCard.displayName = "SpaceHologramCard";

export { SpaceHologramCard, hologramCardVariants };