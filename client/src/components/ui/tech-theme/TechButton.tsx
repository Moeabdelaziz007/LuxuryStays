import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        neon: 'bg-transparent text-primary border border-primary hover:bg-primary/10',
        dark: 'bg-card text-card-foreground border border-border hover:bg-muted',
        light: 'bg-white text-black border border-gray-200 hover:bg-gray-50',
        ghost: 'bg-transparent text-primary hover:bg-primary/10 hover:text-primary',
        outline: 'border border-primary bg-transparent text-primary hover:bg-primary/10',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10',
      },
      glowIntensity: {
        none: '',
        light: 'shadow-[0_0_10px_rgba(57,255,20,0.3)]',
        medium: 'shadow-[0_0_15px_rgba(57,255,20,0.4)]',
        strong: 'shadow-[0_0_20px_rgba(57,255,20,0.5)]',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse-subtle',
        float: 'animate-float',
        glow: 'animate-neon-pulse',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      glowIntensity: 'none',
      animation: 'none',
    },
  }
);

export interface TechButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  shimmer?: boolean;
}

const TechButton = forwardRef<HTMLButtonElement, TechButtonProps>(
  ({ className, variant, size, glowIntensity, animation, shimmer, children, ...props }, ref) => {
    // Extract our custom properties to avoid passing non-standard props to HTML elements
    const buttonAttrs = { ...props };
    
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, glowIntensity, animation, className }),
          shimmer ? 'shimmer-effect' : ''
        )}
        ref={ref}
        data-shimmer={shimmer ? 'true' : undefined}
        {...buttonAttrs}
      >
        <span className="relative z-10">{children}</span>
        
        {/* Shimmer effect (conditional) */}
        {shimmer && (
          <span className="absolute inset-0 overflow-hidden rounded-md">
            <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-primary/20 to-transparent"></span>
          </span>
        )}
      </button>
    );
  }
);
TechButton.displayName = 'TechButton';

export { TechButton, buttonVariants };