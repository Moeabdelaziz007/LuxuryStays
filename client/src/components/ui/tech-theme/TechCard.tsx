import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TechCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'raised' | 'gradient' | 'holographic' | 'bordered';
  border?: boolean;
  glow?: boolean;
  glassMorphism?: boolean;
  animation?: 'none' | 'pulse' | 'float';
  withGlow?: boolean;
  withShimmer?: boolean;
}

/**
 * Tech-themed card component with modern space styling
 */
export default function TechCard({
  children,
  className,
  variant = 'default',
  border = true,
  glow = false,
  glassMorphism = false,
  animation = 'none',
  withGlow = false,
  withShimmer = false,
}: TechCardProps) {
  const variantClasses = {
    default: 'bg-card',
    raised: 'bg-card shadow-lg',
    gradient: 'bg-gradient-to-br from-black via-[#0f1114] to-[#1a1c20]',
    holographic: 'bg-gradient-to-br from-black/90 via-[#1a1c20] to-[#0f1114] relative overflow-hidden',
    bordered: 'bg-black/20 backdrop-blur-sm border border-neon-green/30'
  };

  // Support both glow (old) and withGlow (new) properties
  const glowClass = (glow || withGlow) ? 'shadow-[0_0_15px_rgba(57,255,20,0.2)]' : '';
  const borderClass = variant !== 'bordered' && border ? 'border border-neon-green/20' : '';
  const glassClass = glassMorphism ? 'backdrop-blur-md bg-opacity-70' : '';
  const shimmerClass = withShimmer ? 'overflow-hidden relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:animate-shimmer' : '';

  const animationClasses = {
    none: '',
    pulse: 'animate-pulse-slow',
    float: 'animate-float'
  };

  return (
    <div
      className={cn(
        'rounded-lg p-4 transition-all duration-300',
        variantClasses[variant],
        borderClass,
        glowClass,
        glassClass,
        shimmerClass,
        animationClasses[animation],
        className
      )}
    >
      {children}
    </div>
  );
}