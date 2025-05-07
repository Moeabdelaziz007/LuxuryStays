import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TechCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'raised' | 'gradient' | 'holographic';
  border?: boolean;
  glow?: boolean;
  glassMorphism?: boolean;
  animation?: 'none' | 'pulse' | 'float';
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
}: TechCardProps) {
  const variantClasses = {
    default: 'bg-card',
    raised: 'bg-card shadow-lg',
    gradient: 'bg-card-gradient',
    holographic: 'bg-card-gradient relative overflow-hidden'
  };

  const glowClass = glow ? 'shadow-[0_0_15px_rgba(57,255,20,0.2)]' : '';
  const borderClass = border ? 'border border-neon-green/20' : '';
  const glassClass = glassMorphism ? 'backdrop-blur-md bg-opacity-70' : '';

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
        animationClasses[animation],
        className
      )}
    >
      {children}
    </div>
  );
}