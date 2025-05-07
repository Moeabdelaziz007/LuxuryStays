import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// تعريف المتغيرات المتنوعة للأزرار التقنية الفضائية
const spaceTechButtonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#39FF14] disabled:pointer-events-none disabled:opacity-60 overflow-hidden group",
  {
    variants: {
      variant: {
        // زر تقني فضائي رئيسي
        primary: 
          "bg-gradient-to-r from-[#39FF14]/90 to-[#39FF14]/80 text-black font-bold border border-[#39FF14]/40 shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)]",
        
        // زر تقني شبه شفاف
        secondary: 
          "bg-black/30 backdrop-blur-md text-white border border-[#39FF14]/50 hover:text-[#39FF14] hover:border-[#39FF14]/70 shadow-[0_0_10px_rgba(57,255,20,0.2)]",
        
        // زر تقني هولوجرامي
        hologram: 
          "hologram-button bg-black/20 backdrop-blur-md text-[#39FF14] border border-[#39FF14]/40 shadow-[0_0_12px_rgba(57,255,20,0.15)]",
        
        // زر تأكيد مهام الفضاء
        command: 
          "space-button-commander bg-gradient-to-r from-[rgba(0,10,30,0.9)] to-[rgba(5,20,50,0.9)] text-white border-[#39FF14]/30 font-bold shadow-[0_0_15px_rgba(0,0,0,0.4)]",
        
        // زر تحذير
        warning: 
          "bg-amber-600/80 text-white border border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]",
        
        // زر خطر/دمار
        danger: 
          "bg-red-600/80 text-white border border-red-500 shadow-[0_0_10px_rgba(220,38,38,0.3)] hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]",
          
        // زر مخطط شفاف
        outline: 
          "bg-transparent border border-[#39FF14]/80 text-[#39FF14] hover:bg-[#39FF14]/10",
        
        // زر معدني
        metallic: 
          "bg-gradient-to-b from-gray-700 to-gray-900 text-white border border-gray-600 shadow-lg hover:from-gray-600 hover:to-gray-800",
        
        // زر تقني داكن
        stealth: 
          "bg-gray-950 text-gray-200 hover:text-[#39FF14] border border-gray-800 hover:border-[#39FF14]/20",
        
        // زر شبح
        ghost: 
          "bg-transparent hover:bg-gray-900/20 text-gray-200 hover:text-[#39FF14]",
      },
      size: {
        xs: "h-8 px-3 text-xs",
        sm: "h-9 px-4 text-xs",
        default: "h-10 px-5 py-2",
        lg: "h-11 px-6 text-base",
        xl: "h-12 px-8 text-lg",
        icon: "h-10 w-10 aspect-square"
      },
      effect: {
        none: "",
        scanline: "space-button-advanced",
        pulse: "animate-pulse-subtle",
        glow: "animate-glow-pulse",
        energize: "space-energy-button",
        thruster: "space-ship-engine"
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      effect: "scanline",
    },
  }
);

// مكونات التأثيرات المتقدمة للزر
const SpaceTechEffects = ({
  variant = "primary",
  effect = "scanline",
  animated = true
}: {
  variant?: string;
  effect?: string;
  animated?: boolean;
}) => {
  // تحديد الألوان بناءً على النوع
  const isPrimary = variant === "primary" || variant === "outline" || variant === "hologram";
  const isDanger = variant === "danger";
  const isWarning = variant === "warning";
  const isCommand = variant === "command";
  
  // تحديد لون التأثير
  const effectColor = isPrimary 
    ? "rgba(57, 255, 20, 0.8)" 
    : isDanger 
      ? "rgba(220, 38, 38, 0.8)" 
      : isWarning 
        ? "rgba(245, 158, 11, 0.8)"
        : isCommand
          ? "rgba(57, 255, 20, 0.6)"
          : "rgba(255, 255, 255, 0.6)";
        
  // تحديد ظلال التأثير
  const effectShadow = isPrimary 
    ? "0 0 8px rgba(57, 255, 20, 0.7)" 
    : isDanger 
      ? "0 0 8px rgba(220, 38, 38, 0.7)" 
      : isWarning
        ? "0 0 8px rgba(245, 158, 11, 0.7)"
        : isCommand
          ? "0 0 8px rgba(57, 255, 20, 0.5)"
          : "0 0 8px rgba(255, 255, 255, 0.5)";
  
  return (
    <>
      {/* خط المسح المتحرك - يظهر في جميع الأزرار */}
      {animated && effect === "scanline" && (
        <motion.div 
          className="absolute inset-0 overflow-hidden pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="absolute left-0 right-0 h-[1px]"
            style={{ 
              background: `linear-gradient(to right, transparent, ${effectColor}, transparent)`,
              boxShadow: effectShadow
            }}
            animate={{ 
              top: ["0%", "100%", "0%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
      
      {/* تأثير النبض/التوهج */}
      {animated && effect === "pulse" && (
        <motion.div 
          className="absolute inset-0 pointer-events-none rounded-md z-0"
          style={{ 
            boxShadow: `inset 0 0 0 1px ${effectColor}`,
          }}
          animate={{ 
            opacity: [0.3, 0.8, 0.3],
            boxShadow: [
              `inset 0 0 0 1px ${effectColor}`,
              `inset 0 0 0 1px ${effectColor}, 0 0 10px 2px ${effectColor.replace('0.8', '0.4')}`,
              `inset 0 0 0 1px ${effectColor}`
            ]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* تأثير الطاقة الكهربائية المتحركة */}
      {animated && effect === "energize" && (
        <>
          <motion.div 
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div 
              className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-0"
              style={{
                background: `radial-gradient(circle at center, ${effectColor.replace('0.8', '0.2')} 0%, transparent 70%)`,
                filter: 'blur(10px)'
              }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* جزيئات حركة عشوائية */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${2 + Math.random() * 2}px`,
                  height: `${2 + Math.random() * 2}px`,
                  background: effectColor,
                  boxShadow: effectShadow,
                  top: '50%',
                  left: '50%',
                  x: '-50%',
                  y: '-50%',
                  opacity: 0
                }}
                animate={{
                  x: [
                    '-50%',
                    `calc(-50% + ${(Math.random() * 2 - 1) * 40}px)`,
                  ],
                  y: [
                    '-50%',
                    `calc(-50% + ${(Math.random() * 2 - 1) * 40}px)`,
                  ],
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 1 + Math.random() * 1,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        </>
      )}
      
      {/* تأثير المحرك التوربيني */}
      {animated && effect === "thruster" && (
        <motion.div 
          className="absolute bottom-[-20%] left-[10%] right-[10%] h-[20px] pointer-events-none z-0"
          style={{
            background: `linear-gradient(to bottom, ${effectColor}, transparent)`,
            opacity: 0,
            filter: 'blur(3px)',
            borderRadius: '0 0 40% 40%'
          }}
          whileHover={{
            opacity: [0, 0.7, 0.4, 0.7],
            height: ['15px', '25px', '20px', '25px']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* تأثير الموجات - يطبق على كل الأزرار */}
      {animated && (
        <motion.div
          className="absolute top-0 -left-full w-full h-full pointer-events-none z-0"
          animate={{ x: '200%' }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeatDelay: 2.5,
            repeat: Infinity
          }}
          style={{
            background: `linear-gradient(to right, transparent, ${effectColor.replace('0.8', '0.2')}, transparent)`,
            opacity: 0
          }}
          whileHover={{ opacity: 1 }}
        />
      )}
      
      {/* إضاءة داخلية للزر عند التحويم */}
      <motion.div
        className="absolute inset-0 rounded-md pointer-events-none z-0"
        initial={{ opacity: 0 }}
        whileHover={{ 
          opacity: isPrimary ? 0.15 : isDanger ? 0.15 : isWarning ? 0.15 : 0.1,
          backgroundColor: isPrimary 
            ? 'rgba(57, 255, 20, 0.2)' 
            : isDanger 
              ? 'rgba(220, 38, 38, 0.2)' 
              : isWarning
                ? 'rgba(245, 158, 11, 0.2)'
                : 'rgba(255, 255, 255, 0.1)'
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
};

export interface SpaceTechButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof spaceTechButtonVariants> {
  animated?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  textColor?: string;
  withHoverScale?: boolean;
  withGlowEffect?: boolean;
}

// مكون الزر التقني الفضائي
const SpaceTechButton = forwardRef<HTMLButtonElement, SpaceTechButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "default", 
    effect = "scanline",
    animated = true,
    icon,
    iconPosition = 'left',
    textColor,
    withHoverScale = true,
    withGlowEffect = false,
    children,
    ...props 
  }, ref) => {
    // تحديد سلسلة لون النص إذا تم تحديدها
    const textColorStyle = textColor ? { color: textColor } : {};
    
    // تحديد تأثير التوسع عند التحويم
    const hoverScale = withHoverScale 
      ? {
          whileHover: { scale: 1.03 },
          whileTap: { scale: 0.98 }
        }
      : {};
    
    // تحديد تأثير التوهج عند التحويم
    const glowEffectStyle = withGlowEffect 
      ? {
          boxShadow: variant === "primary" 
            ? "0 0 15px rgba(57, 255, 20, 0.4)" 
            : variant === "danger"
              ? "0 0 15px rgba(220, 38, 38, 0.4)"
              : variant === "warning"
                ? "0 0 15px rgba(245, 158, 11, 0.4)"
                : "0 0 15px rgba(255, 255, 255, 0.2)"
        }
      : {};

    return (
      <motion.button
        ref={ref}
        className={cn(spaceTechButtonVariants({ variant, size, effect, className }))}
        style={{ ...textColorStyle, ...glowEffectStyle }}
        {...hoverScale}
        {...props}
      >
        <SpaceTechEffects 
          variant={variant} 
          effect={effect}
          animated={animated}
        />
        
        <span className="relative z-20 flex items-center justify-center gap-2">
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </span>
      </motion.button>
    );
  }
);

SpaceTechButton.displayName = "SpaceTechButton";

export { SpaceTechButton, spaceTechButtonVariants };