import React from 'react';

interface TechCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'light' | 'neon' | 'raised';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  withShadow?: boolean;
  withBorder?: boolean;
  withHoverEffect?: boolean;
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
      default: // default
        if (withHoverEffect) {
          hoverEffect = 'hover:bg-black/60 hover:border-[#39FF14]/20';
        }
        break;
    }
    
    return `${baseClasses} ${bgClass} ${borderClass} ${shadowClass} ${hoverEffect} ${cursorClass}`;
  };
  
  // الرسوم المتحركة لوضع 'neon'
  const getNeonEffects = () => {
    if (variant === 'neon') {
      return (
        <>
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 rounded-lg border border-[#39FF14]/10 shadow-[0_0_10px_rgba(57,255,20,0.15)]"></div>
          </div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#39FF14]/0 via-[#39FF14]/10 to-[#39FF14]/0 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 group-hover:duration-1000 animate-gradient-x pointer-events-none"></div>
        </>
      );
    }
    return null;
  };
  
  return (
    <div 
      className={`relative group ${getCardClasses()} ${className}`}
      onClick={onClick}
      {...props}
    >
      {getNeonEffects()}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}