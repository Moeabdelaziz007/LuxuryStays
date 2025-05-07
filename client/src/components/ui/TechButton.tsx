import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// تعريف متغيرات أنماط الزر
const buttonVariants = cva(
  "relative inline-flex items-center justify-center text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#39FF14] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#39FF14] text-black hover:bg-[#39FF14]/90 border border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.4)]",
        destructive: "bg-red-600 text-white hover:bg-red-700 border border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]",
        outline: "border border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10 hover:border-[#39FF14]/80 hover:text-[#39FF14] bg-black/40 backdrop-blur-sm",
        ghost: "text-[#39FF14] hover:bg-[#39FF14]/10 hover:text-[#39FF14]",
        subtle: "bg-black/40 border border-[#39FF14]/20 text-gray-200 hover:bg-black/60 hover:border-[#39FF14]/40 hover:text-white backdrop-blur-sm",
        link: "text-[#39FF14] underline-offset-4 hover:underline",
        neo: "bg-gradient-to-r from-black/90 to-black/70 border border-[#39FF14]/30 text-[#39FF14] hover:border-[#39FF14] hover:shadow-[0_0_15px_rgba(57,255,20,0.3)]",
        cyber: "text-black bg-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)] relative overflow-hidden",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-md",
        sm: "h-8 px-3 py-1 rounded-md text-xs",
        lg: "h-12 px-6 py-3 rounded-md text-base",
        icon: "h-10 w-10 rounded-full",
        xl: "h-14 px-8 py-4 rounded-md text-lg",
      },
      glowIntensity: {
        none: "",
        low: "hover:shadow-[0_0_10px_rgba(57,255,20,0.2)]",
        medium: "shadow-[0_0_8px_rgba(57,255,20,0.2)] hover:shadow-[0_0_15px_rgba(57,255,20,0.4)]",
        strong: "shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)]",
      },
      shimmer: {
        true: "overflow-hidden",
        false: "",
      },
      animation: {
        none: "",
        pulse: "animate-pulse-slow",
        float: "animate-float",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glowIntensity: "medium",
      shimmer: false,
      animation: "none",
    },
  }
);

export interface TechButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  className?: string;
  children?: React.ReactNode;
}

/**
 * زر بتصميم تقني متطور يتماشى مع التصميم العام للتطبيق
 * يدعم مؤثرات بصرية متنوعة مثل التوهج والحركة
 */
const TechButton = React.forwardRef<HTMLButtonElement, TechButtonProps>(
  ({ className, variant, size, glowIntensity, shimmer, animation, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, glowIntensity, shimmer, animation, className }))}
        ref={ref}
        {...props}
      >
        {/* مؤثر الوميض إن كان مطلوباً */}
        {shimmer && (
          <span 
            className="absolute top-0 -left-[100%] w-[300%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer-x" 
            style={{animationDuration: '3s'}}
          />
        )}
        
        {children}
      </button>
    );
  }
);
TechButton.displayName = "TechButton";

export { TechButton, buttonVariants };