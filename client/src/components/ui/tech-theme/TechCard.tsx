import React from 'react';
import { cn } from '@/lib/utils';

export interface TechCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'glowing' | 'gradient' | 'holographic';
  intensity?: 'low' | 'medium' | 'high';
  withGlow?: boolean;
  neonColor?: 'green' | 'blue' | 'purple' | 'cyan';
  withCircuitPattern?: boolean;
  withShimmer?: boolean;
  children: React.ReactNode;
}

/**
 * TechCard component - Designed for a tech-space UI theme
 * Features various styles and effects to match a futuristic space-tech interface
 */
export function TechCard({
  className,
  variant = 'default',
  intensity = 'medium',
  withGlow = false,
  neonColor = 'green',
  withCircuitPattern = false,
  withShimmer = false,
  children,
  ...props
}: TechCardProps) {
  const getNeonColorValue = () => {
    switch (neonColor) {
      case 'blue': return 'var(--neon-blue)';
      case 'purple': return 'var(--neon-purple)';
      case 'cyan': return 'var(--neon-cyan)';
      case 'green':
      default: return 'var(--neon-green)';
    }
  };
  
  const colorValue = getNeonColorValue();
  
  const getGlowStyles = () => {
    switch (intensity) {
      case 'low': return `0 0 10px rgba(${neonColor === 'green' ? '57, 255, 20' : '0, 150, 255'}, 0.2)`;
      case 'high': return `0 0 30px rgba(${neonColor === 'green' ? '57, 255, 20' : '0, 150, 255'}, 0.5)`;
      case 'medium':
      default: return `0 0 20px rgba(${neonColor === 'green' ? '57, 255, 20' : '0, 150, 255'}, 0.3)`;
    }
  };
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'bordered':
        return {
          border: `1px solid ${colorValue}`,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          boxShadow: withGlow ? getGlowStyles() : 'none',
        };
      case 'glowing':
        return {
          border: `1px solid ${colorValue}`,
          backgroundColor: 'rgba(10, 15, 25, 0.8)',
          boxShadow: `0 0 15px rgba(${neonColor === 'green' ? '57, 255, 20' : '0, 150, 255'}, 0.4)`,
        };
      case 'gradient':
        return {
          background: `linear-gradient(145deg, rgba(0, 0, 0, 0.9), rgba(10, 15, 25, 0.8))`,
          border: `1px solid rgba(${neonColor === 'green' ? '57, 255, 20' : '0, 150, 255'}, 0.3)`,
          boxShadow: withGlow ? getGlowStyles() : 'none',
        };
      case 'holographic':
        return {
          background: 'rgba(0, 0, 0, 0.7)',
          border: `1px solid rgba(${neonColor === 'green' ? '57, 255, 20' : '0, 150, 255'}, 0.5)`,
          boxShadow: `0 0 20px rgba(${neonColor === 'green' ? '57, 255, 20' : '0, 150, 255'}, 0.3)`,
          backdropFilter: 'blur(8px)' as any,
          position: 'relative' as 'relative',
          overflow: 'hidden' as 'hidden',
        };
      case 'default':
      default:
        return {
          backgroundColor: 'rgba(10, 15, 25, 0.7)',
          boxShadow: withGlow ? getGlowStyles() : 'none',
        };
    }
  };
  
  const circuitPattern = withCircuitPattern ? {
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10 L40 10 L40 30 L60 30 L60 50 L80 50 L80 70' stroke='%2339FF14' stroke-opacity='0.1' fill='none' stroke-width='1'/%3E%3Ccircle cx='20' cy='10' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3Ccircle cx='40' cy='10' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3Ccircle cx='40' cy='30' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3Ccircle cx='60' cy='30' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3Ccircle cx='60' cy='50' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3Ccircle cx='80' cy='50' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3Ccircle cx='80' cy='70' r='2' fill='%2339FF14' fill-opacity='0.2'/%3E%3C/svg%3E\")",
    backgroundSize: "200px 200px",
  } : {};

  return (
    <div
      className={cn(
        "rounded-lg p-4 backdrop-blur-sm",
        className
      )}
      style={{
        ...getVariantStyles(),
        ...circuitPattern,
      }}
      {...props}
    >
      {variant === 'holographic' && withShimmer && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: `linear-gradient(45deg, transparent, ${colorValue}, transparent)`,
            animation: 'shimmer 2s infinite linear',
            backgroundSize: '200% 200%',
          }}
        />
      )}
      {children}
    </div>
  );
}

export default TechCard;