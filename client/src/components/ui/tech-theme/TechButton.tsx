import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#39FF14] text-black hover:bg-[#39FF14]/90 active:scale-[0.98]",
        outline: "border border-[#39FF14] text-[#39FF14] bg-transparent hover:bg-[#39FF14]/10 active:scale-[0.98]",
        ghost: "text-[#39FF14] hover:bg-[#39FF14]/10 hover:text-[#39FF14] active:scale-[0.98]",
        glowing: "border border-[#39FF14] text-[#39FF14] bg-transparent hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] hover:border-[#39FF14] active:scale-[0.98]",
        neon: "bg-black text-[#39FF14] border border-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]",
        blue: "bg-[#0088ff] text-white hover:bg-[#0088ff]/90 active:scale-[0.98]",
        purple: "bg-[#8a2be2] text-white hover:bg-[#8a2be2]/90 active:scale-[0.98]",
        cyan: "bg-[#00ffff] text-black hover:bg-[#00ffff]/90 active:scale-[0.98]",
        link: "text-[#39FF14] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const shimmerVariants = cva(
  "absolute inset-0 overflow-hidden rounded-md pointer-events-none",
  {
    variants: {
      shimmer: {
        true: "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        circuit: "after:absolute after:inset-0 after:bg-circuit-pattern after:opacity-10",
        pulse: "animate-pulse-subtle",
        none: "",
      },
    },
    defaultVariants: {
      shimmer: "none",
    },
  }
);

export interface TechButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  shimmer?: 'true' | 'circuit' | 'pulse' | 'none';
  glowIntensity?: 'low' | 'medium' | 'high';
}

const TechButton = React.forwardRef<HTMLButtonElement, TechButtonProps>(
  ({ className, variant, size, shimmer = 'none', glowIntensity = 'medium', asChild = false, ...props }, ref) => {
    
    const getGlowStyle = () => {
      if (variant !== 'glowing' && variant !== 'neon') return {};
      
      switch (glowIntensity) {
        case 'low':
          return { boxShadow: '0 0 10px rgba(57, 255, 20, 0.3)' };
        case 'high':
          return { boxShadow: '0 0 30px rgba(57, 255, 20, 0.7)' };
        case 'medium':
        default:
          return { boxShadow: '0 0 20px rgba(57, 255, 20, 0.5)' };
      }
    };
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={getGlowStyle()}
        {...props}
      >
        {props.children}
        <div className={cn(shimmerVariants({ shimmer }))}></div>
      </button>
    );
  }
);

TechButton.displayName = "TechButton";

export { TechButton, buttonVariants };