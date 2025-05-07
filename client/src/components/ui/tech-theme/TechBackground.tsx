import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TechBackgroundProps {
  children: ReactNode;
  className?: string;
  variant?: 'space' | 'grid' | 'stars' | 'minimal' | 'circuits' | 'dots' | 'hexagons';
  overlay?: boolean;
  animated?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  withGradient?: boolean;
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
  intensity = 'medium',
  withGradient = true,
}: TechBackgroundProps) {
  // Get opacity value based on intensity
  const getOpacity = () => {
    switch (intensity) {
      case 'low': return 'opacity-10';
      case 'high': return 'opacity-40';
      default: return 'opacity-20';
    }
  };

  // Define base variant classes
  const variantClasses = {
    space: 'bg-space-gradient',
    grid: 'bg-space-black relative before:content-[""] before:absolute before:inset-0 before:bg-grid-overlay before:opacity-30',
    stars: 'bg-space-black relative',
    minimal: 'bg-space-black',
    circuits: 'bg-space-black relative before:content-[""] before:absolute before:inset-0 before:bg-circuits-overlay ' + getOpacity(),
    dots: 'bg-space-black relative before:content-[""] before:absolute before:inset-0 before:bg-dots-pattern ' + getOpacity(),
    hexagons: 'bg-space-black relative before:content-[""] before:absolute before:inset-0 before:bg-hexagons-pattern ' + getOpacity()
  };

  // Apply overlay with gradient if enabled
  const overlayClass = overlay 
    ? `relative after:content-[""] after:absolute after:inset-0 after:pointer-events-none ${
        withGradient ? 'after:bg-gradient-to-b after:from-black/20 after:to-black/80' : ''
      }` 
    : '';
  
  // Add animation if enabled  
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