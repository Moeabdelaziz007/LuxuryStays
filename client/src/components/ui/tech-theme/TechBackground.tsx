import React, { ReactNode, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface TechBackgroundProps {
  children: ReactNode;
  className?: string;
  variant?: 'space' | 'grid' | 'stars' | 'minimal' | 'circuits' | 'dots' | 'hexagons' | 'matrix' | 'cyber';
  overlay?: boolean;
  animated?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  withGradient?: boolean;
  withGlow?: boolean;
  accentColor?: string;
  withScanlines?: boolean;
  withFloatingParticles?: boolean;
  gradientDirection?: 'top-bottom' | 'radial' | 'diagonal';
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
  withGlow = false,
  accentColor = '#39FF14',
  withScanlines = false,
  withFloatingParticles = false,
  gradientDirection = 'top-bottom',
}: TechBackgroundProps) {
  // Parse accent color to RGB for animations and effects
  const accentColorRgb = useMemo(() => {
    // Default RGB values (neon green)
    let r = 57, g = 255, b = 20;
    
    // Try to parse hex color
    if (accentColor.startsWith('#')) {
      const hex = accentColor.slice(1);
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      }
    }
    
    return { r, g, b };
  }, [accentColor]);
  
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
    hexagons: 'bg-space-black relative before:content-[""] before:absolute before:inset-0 before:bg-hexagons-pattern ' + getOpacity(),
    matrix: 'bg-space-black relative',
    cyber: 'bg-[#0a0a12] relative'
  };

  // Apply overlay with gradient if enabled
  let overlayClass = overlay 
    ? `relative after:content-[""] after:absolute after:inset-0 after:pointer-events-none` 
    : '';
  
  if (withGradient) {
    switch (gradientDirection) {
      case 'radial':
        overlayClass += ' after:bg-radial-gradient after:from-transparent after:to-black/80';
        break;
      case 'diagonal':
        overlayClass += ' after:bg-gradient-to-br after:from-black/20 after:to-black/80';
        break;
      default:
        overlayClass += ' after:bg-gradient-to-b after:from-black/20 after:to-black/80';
    }
  }
  
  // Add glow effect if enabled
  const glowClass = withGlow 
    ? `before:content-[""] before:absolute before:inset-0 before:opacity-10 before:z-0 before:pointer-events-none`
    : '';
    
  // Set background glow color dynamically in styles instead of className
  const glowStyle = withGlow ? { 
    '--glow-color': `${accentColor}10` 
  } as React.CSSProperties : {};
  
  // Add animation if enabled  
  const animationClass = animated ? 'relative overflow-hidden' : '';
  
  // Set z-index for proper layering
  const containerClass = 'relative z-0';
  
  // Floating particles styling
  const particlesStyle = { 
    '--accent-r': accentColorRgb.r, 
    '--accent-g': accentColorRgb.g, 
    '--accent-b': accentColorRgb.b 
  } as React.CSSProperties;

  // Combine all styles
  const combinedStyles = {
    ...particlesStyle,
    ...glowStyle
  };

  return (
    <div
      className={cn(
        'w-full',
        variantClasses[variant],
        overlayClass,
        glowClass,
        animationClass,
        containerClass,
        className
      )}
      style={combinedStyles}
    >
      {variant === 'stars' && (
        <>
          <div className="stars absolute inset-0 z-0" />
          <div className="stars2 absolute inset-0 z-0" />
          <div className="stars3 absolute inset-0 z-0" />
        </>
      )}
      
      {variant === 'matrix' && (
        <div className="absolute inset-0 overflow-hidden opacity-10 z-0 pointer-events-none">
          <div className="animate-matrix-text text-[10px] leading-tight" 
               style={{
                 fontFamily: "monospace", 
                 color: accentColor
               }}>
            {Array.from({length: 30}).map((_, i) => (
              <div key={i} style={{
                transform: `translateY(${i * 5}px)`,
                animationDelay: `${i * 0.1}s`,
                opacity: 1 - (i * 0.02)
              }}>
                {i % 2 === 0 ? 
                  '01 STAYX 010 SEARCH 101 LUXURY 1010 ELITE 01 COAST 10 VILLAS 101' : 
                  '10 NORTH 101 COAST 010 BOOKING 1010 PREMIUM 01 STAY 10 EXPERIENCE 01'}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {variant === 'cyber' && (
        <>
          <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0 pointer-events-none" 
               style={{
                 backgroundSize: '40px 40px',
                 backgroundImage: `linear-gradient(to right, ${accentColor}20 1px, transparent 1px),
                                  linear-gradient(to bottom, ${accentColor}20 1px, transparent 1px)`
               }}/>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent z-0" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/40 to-transparent z-0" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-[#39FF14]/40 to-transparent z-0" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#39FF14]/40 to-transparent z-0" />
        </>
      )}
      
      {withScanlines && (
        <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(${accentColorRgb.r}, ${accentColorRgb.g}, ${accentColorRgb.b}, 0.1) 2px, transparent 4px)`,
            backgroundSize: '100% 4px',
            mixBlendMode: 'overlay'
          }}></div>
        </div>
      )}
      
      {withFloatingParticles && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: `${3 + (i % 4) * 2}px`,
                height: `${3 + (i % 4) * 2}px`,
                backgroundColor: `rgba(var(--accent-r), var(--accent-g), var(--accent-b), ${0.3 + (i % 5) * 0.1})`,
                top: `${10 + (i * 8)}%`,
                left: `${5 + (i * 9)}%`,
                boxShadow: `0 0 ${4 + (i % 3) * 2}px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.6)`,
                animationDuration: `${15 + (i % 5) * 4}s`,
                animationDelay: `${i * 0.7}s`,
                transform: `translateZ(0)`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}