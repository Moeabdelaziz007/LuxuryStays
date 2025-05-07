import React from 'react';
import { cn } from '@/lib/utils';

/* ============= قسم عناصر التأثيرات البصرية ============= */

export interface NeonGlowProps {
  color?: 'green' | 'blue' | 'purple' | 'cyan';
  intensity?: 'low' | 'medium' | 'high';
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const NeonGlow: React.FC<NeonGlowProps> = ({
  color = 'green',
  intensity = 'medium',
  pulse = true,
  size = 'md',
  className
}) => {
  const getColorValue = () => {
    switch (color) {
      case 'blue': return 'var(--neon-blue)';
      case 'purple': return 'var(--neon-purple)';
      case 'cyan': return 'var(--neon-cyan)';
      case 'green':
      default: return 'var(--neon-green)';
    }
  };
  
  const colorValue = getColorValue();
  
  const getSizeClass = () => {
    switch(size) {
      case 'sm': return 'h-32 w-32';
      case 'lg': return 'h-96 w-96';
      case 'xl': return 'h-[500px] w-[500px]';
      case 'md':
      default: return 'h-64 w-64';
    }
  };
  
  const getIntensityValue = () => {
    switch (intensity) {
      case 'low': return 0.05;
      case 'high': return 0.2;
      case 'medium':
      default: return 0.1;
    }
  };
  
  const opacityValue = getIntensityValue();
  
  return (
    <div 
      className={cn(
        "absolute rounded-full blur-[100px] -z-10",
        pulse && "animate-pulse-very-slow",
        getSizeClass(),
        className
      )}
      style={{ 
        backgroundColor: colorValue,
        opacity: opacityValue
      }}
    />
  );
};

export interface CircuitPatternProps {
  opacity?: number;
  className?: string;
  animated?: boolean;
  color?: 'green' | 'blue' | 'purple' | 'cyan';
}

export const CircuitPattern: React.FC<CircuitPatternProps> = ({
  opacity = 0.1,
  animated = true,
  color = 'green',
  className
}) => {
  const getColorHex = () => {
    switch (color) {
      case 'blue': return '0088ff';
      case 'purple': return '8a2be2';
      case 'cyan': return '00ffff';
      case 'green':
      default: return '39FF14';
    }
  };
  
  const colorHex = getColorHex();
  
  return (
    <div 
      className={cn(
        "absolute inset-0 -z-10 pointer-events-none",
        animated && "animate-pulse-slow",
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10 L40 10 L40 30 L60 30 L60 50 L80 50 L80 70' stroke='%23${colorHex}' stroke-opacity='${opacity}' fill='none' stroke-width='1'/%3E%3Ccircle cx='20' cy='10' r='2' fill='%23${colorHex}' fill-opacity='${opacity}'/%3E%3Ccircle cx='40' cy='10' r='2' fill='%23${colorHex}' fill-opacity='${opacity}'/%3E%3Ccircle cx='40' cy='30' r='2' fill='%23${colorHex}' fill-opacity='${opacity}'/%3E%3Ccircle cx='60' cy='30' r='2' fill='%23${colorHex}' fill-opacity='${opacity}'/%3E%3Ccircle cx='60' cy='50' r='2' fill='%23${colorHex}' fill-opacity='${opacity}'/%3E%3Ccircle cx='80' cy='50' r='2' fill='%23${colorHex}' fill-opacity='${opacity}'/%3E%3Ccircle cx='80' cy='70' r='2' fill='%23${colorHex}' fill-opacity='${opacity}'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px'
      }}
    />
  );
};

export interface GridPatternProps {
  opacity?: number;
  className?: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'purple' | 'cyan';
}

export const GridPattern: React.FC<GridPatternProps> = ({
  opacity = 0.05,
  animated = true,
  size = 'md',
  color = 'green',
  className
}) => {
  const getColorHex = () => {
    switch (color) {
      case 'blue': return '0088ff';
      case 'purple': return '8a2be2';
      case 'cyan': return '00ffff';
      case 'green':
      default: return '39FF14';
    }
  };
  
  const getSize = () => {
    switch(size) {
      case 'sm': return '20px';
      case 'lg': return '60px';
      case 'md':
      default: return '40px';
    }
  };
  
  const colorHex = getColorHex();
  const gridSize = getSize();
  
  return (
    <div 
      className={cn(
        "absolute inset-0 -z-10 pointer-events-none",
        animated && "animate-[moveGrid_180s_linear_infinite]",
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='${gridSize}' height='${gridSize}' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L40 0 L40 40 L0 40 Z' fill='none' stroke='%23${colorHex}' stroke-opacity='${opacity}' stroke-width='0.5' vector-effect='non-scaling-stroke'/%3E%3C/svg%3E")`,
        backgroundSize: gridSize
      }}
    />
  );
};

export interface NeonLineProps {
  orientation?: 'horizontal' | 'vertical';
  length?: string;
  thickness?: 'thin' | 'regular' | 'thick';
  color?: 'green' | 'blue' | 'purple' | 'cyan';
  glowing?: boolean;
  className?: string;
  animated?: boolean;
}

export const NeonLine: React.FC<NeonLineProps> = ({
  orientation = 'horizontal',
  length = '100%',
  thickness = 'regular',
  color = 'green',
  glowing = true,
  animated = true,
  className
}) => {
  const getColorValue = () => {
    switch (color) {
      case 'blue': return 'var(--neon-blue)';
      case 'purple': return 'var(--neon-purple)';
      case 'cyan': return 'var(--neon-cyan)';
      case 'green':
      default: return 'var(--neon-green)';
    }
  };
  
  const getThicknessValue = () => {
    switch (thickness) {
      case 'thin': return '1px';
      case 'thick': return '3px';
      case 'regular':
      default: return '2px';
    }
  };
  
  const colorValue = getColorValue();
  const thicknessValue = getThicknessValue();
  
  const isHorizontal = orientation === 'horizontal';
  
  return (
    <div 
      className={cn(
        "relative",
        animated && "animate-pulse-subtle",
        className
      )}
      style={{
        backgroundColor: colorValue,
        width: isHorizontal ? length : thicknessValue,
        height: isHorizontal ? thicknessValue : length,
        boxShadow: glowing ? `0 0 8px ${colorValue}, 0 0 20px ${colorValue}40` : 'none'
      }}
    />
  );
};

export interface ScannerEffectProps {
  color?: 'green' | 'blue' | 'purple' | 'cyan';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  duration?: 'slow' | 'normal' | 'fast';
}

export const ScannerEffect: React.FC<ScannerEffectProps> = ({
  color = 'green',
  orientation = 'horizontal',
  duration = 'normal',
  className
}) => {
  const getColorValue = () => {
    switch (color) {
      case 'blue': return 'var(--neon-blue)';
      case 'purple': return 'var(--neon-purple)';
      case 'cyan': return 'var(--neon-cyan)';
      case 'green':
      default: return 'var(--neon-green)';
    }
  };
  
  const getDuration = () => {
    switch (duration) {
      case 'slow': return '6s';
      case 'fast': return '2s';
      case 'normal':
      default: return '4s';
    }
  };
  
  const colorValue = getColorValue();
  const animationDuration = getDuration();
  const isHorizontal = orientation === 'horizontal';
  
  const gradientDirection = isHorizontal ? 'to right' : 'to bottom';
  
  return (
    <div 
      className={cn(
        "absolute pointer-events-none",
        isHorizontal ? "h-full w-[40%] left-0" : "w-full h-[40%] top-0",
        className
      )}
      style={{
        background: `linear-gradient(${gradientDirection}, transparent, ${colorValue}40, transparent)`,
        animation: `${isHorizontal ? 'scannerX' : 'scannerY'} ${animationDuration} ease-in-out infinite alternate`,
      }}
    />
  );
};

// Export all components in a bundle
export const TechEffects = {
  NeonGlow,
  CircuitPattern,
  GridPattern,
  NeonLine,
  ScannerEffect
};

export default TechEffects;