import React from 'react';

interface TechCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'light' | 'neon' | 'raised' | 'gradient' | 'holographic';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  withShadow?: boolean;
  withBorder?: boolean;
  withHoverEffect?: boolean;
  withGlow?: boolean;
  withShimmer?: boolean;
  onClick?: () => void;
}

export default function TechCard({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  withShadow = true,
  withBorder = true,
  withHoverEffect = true,
  withGlow = false,
  withShimmer = false,
  onClick,
  ...props
}: TechCardProps) {
  // تحديد التباعد الداخلي
  const getPaddingClass = () => {
    switch (padding) {
      case 'none':
        return 'p-0';
      case 'sm':
        return 'p-3';
      case 'lg':
        return 'p-6';
      case 'xl':
        return 'p-8';
      default: // medium
        return 'p-4';
    }
  };
  
  // تحديد أنماط البطاقة
  const getCardClasses = () => {
    const baseClasses = `rounded-lg ${getPaddingClass()} transition-all`;
    const cursorClass = onClick ? 'cursor-pointer' : '';
    
    // تحديد لون الخلفية والحدود
    let bgClass = 'bg-black/40 backdrop-blur-sm';
    let borderClass = withBorder ? 'border border-gray-800' : '';
    let shadowClass = withShadow ? 'shadow-lg' : '';
    let glowClass = withGlow ? 'shadow-[0_0_15px_rgba(57,255,20,0.2)]' : '';
    let shimmerClass = withShimmer ? 'shimmer-effect' : '';
    
    // تحديد تأثير التحويم
    let hoverEffect = '';
    if (withHoverEffect) {
      hoverEffect = 'hover:bg-gray-900/50 hover:border-gray-700';
    }
    
    switch (variant) {
      case 'dark':
        bgClass = 'bg-black backdrop-blur-sm';
        if (withHoverEffect) {
          hoverEffect = 'hover:bg-black/80 hover:border-gray-700';
        }
        break;
      case 'light':
        bgClass = 'bg-gray-900/70 backdrop-blur-sm';
        if (withHoverEffect) {
          hoverEffect = 'hover:bg-gray-800/70 hover:border-gray-700';
        }
        break;
      case 'neon':
        bgClass = 'bg-black/90 backdrop-blur-sm';
        borderClass = withBorder ? 'border border-[#39FF14]/30' : '';
        shadowClass = withShadow ? 'shadow-lg' : '';
        glowClass = withGlow ? 'shadow-[0_0_20px_rgba(57,255,20,0.3)]' : '';
        if (withHoverEffect) {
          hoverEffect = 'hover:border-[#39FF14]/60 hover:shadow-[0_0_15px_rgba(57,255,20,0.15)]';
        }
        break;
      case 'raised':
        bgClass = 'bg-gradient-to-b from-gray-900 to-black backdrop-blur-sm';
        borderClass = withBorder ? 'border border-t-gray-700 border-b-transparent border-x-gray-800' : '';
        shadowClass = withShadow ? 'shadow-xl' : '';
        if (withHoverEffect) {
          hoverEffect = 'hover:from-gray-800 hover:to-gray-900 hover:border-t-[#39FF14]/30';
        }
        break;
      case 'gradient':
        bgClass = 'bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-sm';
        borderClass = withBorder ? 'border border-[#39FF14]/10' : '';
        shadowClass = withShadow ? 'shadow-lg' : '';
        glowClass = withGlow ? 'shadow-[0_0_30px_rgba(57,255,20,0.25)]' : '';
        if (withHoverEffect) {
          hoverEffect = 'hover:border-[#39FF14]/30 hover:shadow-[0_0_20px_rgba(57,255,20,0.2)]';
        }
        break;
      case 'holographic':
        bgClass = 'bg-gradient-to-br from-gray-900/90 via-black/80 to-gray-900/90 backdrop-blur-md';
        borderClass = withBorder ? 'border border-[#39FF14]/20 border-b-white/5 border-t-white/10' : '';
        shadowClass = withShadow ? 'shadow-xl' : '';
        glowClass = withGlow ? 'shadow-[0_0_30px_rgba(57,255,20,0.3)]' : '';
        if (withHoverEffect) {
          hoverEffect = 'hover:from-black/90 hover:via-gray-900/80 hover:to-black/90 hover:border-[#39FF14]/40 hover:shadow-[0_0_25px_rgba(57,255,20,0.25)]';
        }
        break;
      default: // default
        if (withHoverEffect) {
          hoverEffect = 'hover:bg-black/60 hover:border-[#39FF14]/20';
        }
        break;
    }
    
    return `${baseClasses} ${bgClass} ${borderClass} ${shadowClass} ${glowClass} ${shimmerClass} ${hoverEffect} ${cursorClass}`;
  };
  
  // التأثيرات الخاصة بكل نوع من البطاقات
  const getSpecialEffects = () => {
    switch (variant) {
      case 'neon':
        return (
          <>
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 rounded-lg border border-[#39FF14]/10 shadow-[0_0_10px_rgba(57,255,20,0.15)]"></div>
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/10 to-[#39FF14]/0 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 group-hover:duration-1000 animate-gradient-x pointer-events-none"></div>
          </>
        );
      case 'gradient':
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/3 via-transparent to-[#39FF14]/3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        );
      case 'holographic':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/5 to-[#39FF14]/0 rounded-lg opacity-30 blur-md pointer-events-none"></div>
            <div className="absolute inset-0 rounded-lg opacity-30 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none">
              <div className="absolute inset-0 rounded-lg border border-[#39FF14]/10 shadow-[0_0_10px_rgba(57,255,20,0.15)]"></div>
            </div>
            {withShimmer && (
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/20 to-[#39FF14]/0 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 pointer-events-none"></div>
            )}
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <div 
      className={`relative group ${getCardClasses()} ${className}`}
      onClick={onClick}
      {...props}
    >
      {getSpecialEffects()}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}