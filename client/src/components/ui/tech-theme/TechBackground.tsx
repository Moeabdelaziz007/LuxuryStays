import React from 'react';
import { cn } from '@/lib/utils';

export interface TechBackgroundProps {
  variant?: 'default' | 'grid' | 'stars' | 'circuits' | 'dots' | 'hexagons';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  withGradient?: boolean;
  withParticles?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/**
 * TechBackground component - Used for creating tech/space themed backgrounds
 * Can be used as a wrapper around page content
 */
export function TechBackground({
  variant = 'default',
  intensity = 'medium',
  animated = true,
  withGradient = true,
  withParticles = false,
  children,
  className
}: TechBackgroundProps) {
  // Base gradient styles
  const getGradientStyle = () => {
    if (!withGradient) return {};
    
    return {
      backgroundImage: 'var(--space-bg-gradient)',
    };
  };
  
  // Opacity based on intensity
  const getIntensityValue = () => {
    switch (intensity) {
      case 'low': return 0.07;
      case 'high': return 0.15;
      case 'medium':
      default: return 0.1;
    }
  };
  
  // Different background patterns
  const getPatternStyle = () => {
    const opacity = getIntensityValue();
    
    switch (variant) {
      case 'grid':
        return {
          backgroundImage: 'var(--grid-overlay)',
          backgroundSize: '50px 50px',
          backgroundPosition: 'center',
          opacity,
        };
      case 'stars':
        return {
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%2339FF14' stroke-width='1'%3E%3Ccircle cx='400' cy='400' r='2'/%3E%3Ccircle cx='100' cy='100' r='1'/%3E%3Ccircle cx='700' cy='100' r='1'/%3E%3Ccircle cx='100' cy='700' r='1'/%3E%3Ccircle cx='700' cy='700' r='1'/%3E%3Ccircle cx='200' cy='200' r='1'/%3E%3Ccircle cx='600' cy='200' r='1'/%3E%3Ccircle cx='200' cy='600' r='1'/%3E%3Ccircle cx='600' cy='600' r='1'/%3E%3Ccircle cx='300' cy='300' r='1'/%3E%3Ccircle cx='500' cy='300' r='1'/%3E%3Ccircle cx='300' cy='500' r='1'/%3E%3Ccircle cx='500' cy='500' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: '150px 150px',
          backgroundPosition: 'center',
          opacity,
        };
      case 'circuits':
        return {
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10 L40 10 L40 30 L60 30 L60 50 L80 50 L80 70' stroke='%2339FF14' stroke-opacity='0.15' fill='none' stroke-width='1'/%3E%3Ccircle cx='20' cy='10' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3Ccircle cx='40' cy='10' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3Ccircle cx='40' cy='30' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3Ccircle cx='60' cy='30' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3Ccircle cx='60' cy='50' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3Ccircle cx='80' cy='50' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3Ccircle cx='80' cy='70' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3C/svg%3E\")",
          backgroundSize: '300px 300px',
          backgroundPosition: 'center',
          opacity: opacity * 1.5,
        };
      case 'dots':
        return {
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2339FF14' fill-opacity='0.15'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: '20px 20px',
          opacity,
        };
      case 'hexagons':
        return {
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill='%2339FF14' fill-opacity='0.1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM15 4.5L28 12v24L15 43.5 2 36v-24L15 4.5z'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: '56px 98px',
          opacity,
        };
      case 'default':
      default:
        return {
          backgroundImage: 'radial-gradient(rgba(57, 255, 20, 0.03) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: opacity * 0.7,
        };
    }
  };
  
  // Animation properties for the pattern
  const getAnimationStyle = () => {
    if (!animated) return {};
    
    switch (variant) {
      case 'grid':
        return { animation: 'moveGrid 120s linear infinite' };
      case 'stars':
        return { animation: 'twinkleStars 15s ease-in-out infinite' };
      case 'circuits':
        return { animation: 'pulseCircuits 20s ease-in-out infinite' };
      case 'dots':
        return { animation: 'moveDots 180s linear infinite' };
      case 'hexagons':
        return { animation: 'moveHexagons 240s linear infinite' };
      case 'default':
      default:
        return { animation: 'pulse 20s ease-in-out infinite' };
    }
  };

  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-black", className)}>
      {/* Base background with gradient */}
      <div 
        className="absolute inset-0 z-0" 
        style={getGradientStyle()} 
      />
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          ...getPatternStyle(),
          ...getAnimationStyle(),
        }} 
      />
      
      {/* Optional particle effect */}
      {withParticles && (
        <>
          <div className="stars absolute inset-0 z-0"></div>
          <div className="stars2 absolute inset-0 z-0"></div>
          {intensity === 'high' && <div className="stars3 absolute inset-0 z-0"></div>}
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default TechBackground;