import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TechBackgroundProps {
  children: ReactNode;
  className?: string;
  variant?: 'space' | 'grid' | 'stars' | 'minimal';
  overlay?: boolean;
  animated?: boolean;
}

/**
 * Tech-themed background component for page sections
 */
export default function TechBackground({
  children,
  className,
  variant = 'space',
  overlay = true,
  animated = true,
}: TechBackgroundProps) {
  const variantClasses = {
    space: 'bg-space-gradient',
    grid: 'bg-space-black relative before:content-[""] before:absolute before:inset-0 before:bg-grid-overlay before:opacity-30',
    stars: 'bg-space-black relative',
    minimal: 'bg-space-black'
  };

  const overlayClass = overlay 
    ? 'relative after:content-[""] after:absolute after:inset-0 after:bg-gradient-to-b after:from-black/20 after:to-black/80 after:pointer-events-none' 
    : '';
  
  const animationClass = animated ? 'relative overflow-hidden' : '';

  return (
    <div
      className={cn(
        'w-full',
        variantClasses[variant],
        overlayClass,
        animationClass,
        className
      )}
    >
      {variant === 'stars' && (
        <>
          <div className="stars absolute inset-0" />
          <div className="stars2 absolute inset-0" />
          <div className="stars3 absolute inset-0" />
        </>
      )}
      {children}
    </div>
  );
}