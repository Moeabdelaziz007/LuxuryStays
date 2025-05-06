import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";

// تهيئة الأنماط المختلفة للزر
const techButtonVariants = cva(
  "relative overflow-hidden transition-all duration-300 flex items-center justify-center gap-2",
  {
    variants: {
      variant: {
        default: "bg-transparent border border-[#39FF14]/70 text-[#39FF14] hover:bg-[#39FF14]/20",
        solid: "bg-[#39FF14] text-black hover:bg-[#39FF14]/90",
        ghost: "bg-transparent hover:bg-[#39FF14]/10 text-[#39FF14]",
        outline: "bg-transparent border border-[#39FF14]/50 text-[#39FF14] hover:border-[#39FF14]",
        destructive: "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30",
        holographic: "bg-black/40 backdrop-blur-md border border-[#39FF14]/30 text-[#39FF14] hover:border-[#39FF14]/70",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
      },
      glow: {
        none: "",
        low: "hover:shadow-[0_0_5px_rgba(57,255,20,0.5)]",
        medium: "hover:shadow-[0_0_10px_rgba(57,255,20,0.7)]",
        high: "hover:shadow-[0_0_15px_rgba(57,255,20,0.9)]",
      },
      scanlines: {
        true: "after:content-[''] after:absolute after:inset-0 after:bg-scanlines after:opacity-10 after:pointer-events-none after:z-10",
        false: "",
      },
      withPulse: {
        true: "animate-pulse-subtle",
        false: "",
      },
      withGlitch: {
        true: "",
        false: "",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "medium",
      scanlines: false,
      withPulse: false,
      withGlitch: false,
      rounded: "md",
    },
  }
);

// تعريف الواجهة البرمجية للزر
export interface TechButtonProps 
  extends Omit<ButtonProps, "variant" | "size">, 
    VariantProps<typeof techButtonVariants> {
  withTrail?: boolean;
  trailColor?: string;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export function TechButton({
  className,
  variant,
  size,
  glow,
  scanlines,
  withPulse,
  withGlitch,
  rounded,
  withTrail = false,
  trailColor = 'rgba(57, 255, 20, 0.3)',
  isLoading = false,
  startIcon,
  endIcon,
  children,
  ...props
}: TechButtonProps) {
  const [trails, setTrails] = useState<{ id: number; x: number; y: number; opacity: number; }[]>([]);
  const [trailCounter, setTrailCounter] = useState(0);
  
  // إضافة تأثير المسار خلف المؤشر
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!withTrail) return;
    
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newTrail = {
      id: trailCounter,
      x,
      y,
      opacity: 1
    };
    
    setTrails(prev => [...prev, newTrail]);
    setTrailCounter(prev => prev + 1);
    
    // إزالة المسارات القديمة للحفاظ على الأداء
    setTimeout(() => {
      setTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
    }, 1000);
  };
  
  // إعادة تشكيل الحالة عند إيقاف تمرير المؤشر
  const handleMouseLeave = () => {
    if (!withTrail) return;
    setTimeout(() => setTrails([]), 500);
  };
  
  return (
    <Button
      className={cn(
        techButtonVariants({ 
          variant, 
          size, 
          glow, 
          scanlines, 
          withPulse, 
          withGlitch,
          rounded
        }),
        className
      )}
      {...props}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={isLoading || props.disabled}
    >
      {/* تأثير المسارات خلف المؤشر */}
      {withTrail && trails.map(trail => (
        <div
          key={trail.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: trail.x,
            top: trail.y,
            width: '8px',
            height: '8px',
            backgroundColor: trailColor,
            opacity: trail.opacity,
            transition: 'opacity 1s ease-out',
            transform: 'translate(-50%, -50%)',
            zIndex: 0
          }}
        />
      ))}
      
      {/* تأثير التحميل */}
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          جاري التحميل...
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 z-10">
          {startIcon && <span className="flex-shrink-0">{startIcon}</span>}
          {children}
          {endIcon && <span className="flex-shrink-0">{endIcon}</span>}
        </div>
      )}
      
      {/* تأثير التوهج عند تمرير المؤشر (للأنماط التي تدعم التوهج) */}
      {glow && glow !== 'none' && (
        <div className="absolute inset-0 opacity-0 hover:opacity-30 bg-[#39FF14]/20 transition-opacity duration-300 pointer-events-none z-0" />
      )}
      
      {/* تأثير "الشرارة" المتحركة */}
      {variant !== 'solid' && (
        <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
      )}
      
      {/* تأثير الخلل (تأثير خاص للأزرار المميزة) */}
      {withGlitch && (
        <>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[#39FF14]/20 clip-glitch-1 animate-glitch-1 z-0" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[#1d7f0a]/30 clip-glitch-2 animate-glitch-2 z-0" />
        </>
      )}
    </Button>
  );
}

// تعريف نمط خطوط المسح (سكانلاينز)
const scanlines = `repeating-linear-gradient(
  to bottom,
  transparent,
  transparent 1px,
  rgba(0, 0, 0, 0.2) 1px,
  rgba(0, 0, 0, 0.2) 2px
)`;

export default TechButton;