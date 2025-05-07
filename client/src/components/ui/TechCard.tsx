import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// تعريف متغيرات أنماط البطاقة التقنية
const techCardVariants = cva(
  "relative rounded-xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-black/70 border border-[#39FF14]/30",
        outline: "bg-transparent border border-[#39FF14]/40",
        glass: "bg-black/40 backdrop-blur-md border border-white/10",
        gradient: "bg-gradient-to-br from-black/90 via-black/80 to-black/70 border border-[#39FF14]/20",
        solid: "bg-[#000005] border border-[#39FF14]/30",
        neo: "bg-black border-2 border-[#39FF14]",
      },
      shadow: {
        none: "",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        tech: "shadow-[0_5px_30px_rgba(0,0,0,0.7)]",
      },
      withGlow: {
        true: "hover:shadow-[0_0_20px_rgba(57,255,20,0.2)]",
        false: "",
      },
      withShimmer: {
        true: "overflow-hidden",
        false: "",
      },
      withBorder: {
        true: "border border-[#39FF14]/20 hover:border-[#39FF14]/40",
        false: "",
      },
      hoverEffect: {
        none: "",
        scale: "hover:scale-[1.02]",
        glow: "hover:shadow-[0_0_30px_rgba(57,255,20,0.25)]",
        border: "hover:border-[#39FF14]/70",
        full: "hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(57,255,20,0.25)] hover:border-[#39FF14]/60",
      },
    },
    defaultVariants: {
      variant: "default",
      shadow: "tech",
      withGlow: false,
      withShimmer: false,
      withBorder: true,
      hoverEffect: "none",
    },
  }
);

export interface TechCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof techCardVariants> {
  className?: string;
  children?: React.ReactNode;
}

/**
 * بطاقة بتصميم تقني متطور يتماشى مع التصميم العام للتطبيق
 * تدعم مؤثرات بصرية متنوعة مثل التوهج والحركة
 */
const TechCard = React.forwardRef<HTMLDivElement, TechCardProps>(
  ({ className, variant, shadow, withGlow, withShimmer, withBorder, hoverEffect, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          techCardVariants({ 
            variant, 
            shadow, 
            withGlow, 
            withShimmer, 
            withBorder, 
            hoverEffect,
            className 
          })
        )}
        ref={ref}
        {...props}
      >
        {/* مؤثر الوميض إن كان مطلوباً */}
        {withShimmer && (
          <span 
            className="absolute top-0 -left-[100%] w-[300%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none animate-shimmer-x" 
            style={{animationDuration: '5s'}}
          />
        )}
        
        {children}
        
        {/* مؤثر خط الزخرفة العلوي والسفلي */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    );
  }
);
TechCard.displayName = "TechCard";

export { TechCard, techCardVariants };