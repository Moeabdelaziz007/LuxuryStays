import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TechButtonProps = React.ComponentPropsWithoutRef<typeof Button> & {
  glowIntensity?: 'subtle' | 'medium' | 'strong';
  variant?: 'default' | 'outline' | 'ghost' | 'neon';
  animation?: 'none' | 'pulse' | 'flicker' | 'scanner';
};

/**
 * Tech-themed button component with adjustable glow and animations
 */
export default function TechButton({
  children,
  className,
  glowIntensity = 'medium',
  variant = 'default',
  animation = 'none',
  ...props
}: TechButtonProps) {
  const glowClasses = {
    subtle: 'hover:shadow-[0_0_5px_rgba(57,255,20,0.3)]',
    medium: 'hover:shadow-[0_0_10px_rgba(57,255,20,0.6)]',
    strong: 'hover:shadow-[0_0_20px_rgba(57,255,20,0.8)]',
  };

  const animationClasses = {
    none: '',
    pulse: 'animate-neon-pulse',
    flicker: 'animate-neon-flicker',
    scanner: 'relative overflow-hidden before:absolute before:inset-0 before:bg-scanner-beam before:animate-scanner',
  };

  const variantClasses = {
    default: 'bg-neon-green text-space-black font-bold',
    outline: 'bg-transparent border border-neon-green text-neon-green hover:bg-neon-green/10',
    ghost: 'bg-transparent text-neon-green hover:bg-neon-green/10',
    neon: 'neon-btn',
  };

  return (
    <Button
      className={cn(
        'transition-all duration-300',
        variantClasses[variant],
        glowClasses[glowIntensity],
        animationClasses[animation],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}