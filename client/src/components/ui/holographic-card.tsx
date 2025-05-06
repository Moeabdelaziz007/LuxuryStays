import React, { useState } from 'react';
import { cn } from "@/lib/utils";

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
  withBorder?: boolean;
  interactive?: boolean;
  variant?: 'default' | 'dark' | 'transparent';
}

export function HolographicCard({
  children,
  className = '',
  glowColor = '#39FF14',
  glowIntensity = 'medium',
  withBorder = true,
  interactive = true,
  variant = 'default',
}: HolographicCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // تحديد شدة التوهج بناءً على القيمة المحددة
  const getGlowStrength = () => {
    switch (glowIntensity) {
      case 'low': return '0 0 15px';
      case 'high': return '0 0 30px';
      case 'medium':
      default: return '0 0 20px';
    }
  };
  
  // تحديد لون خلفية البطاقة بناءً على النوع
  const getCardBackground = () => {
    switch (variant) {
      case 'dark': return 'bg-black/80 backdrop-blur-md';
      case 'transparent': return 'bg-black/30 backdrop-blur-md';
      case 'default':
      default: return 'bg-[#0a0f19]/70 backdrop-blur-md';
    }
  };
  
  // معالجة حركة الماوس لإنشاء تأثير التتبع
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    
    const x = ((event.clientX - rect.left) / card.offsetWidth) * 100;
    const y = ((event.clientY - rect.top) / card.offsetHeight) * 100;
    
    setMousePosition({ x, y });
  };
  
  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden transition-all duration-300",
        getCardBackground(),
        withBorder && "border border-[rgba(57,255,20,0.2)]",
        isHovered && interactive && "scale-[1.02]",
        className
      )}
      style={{
        boxShadow: isHovered && interactive ? `${getGlowStrength()} rgba(${glowColor.replace(/^#/, '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ')}, 0.3)` : 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* طبقة الهولوغرام الداخلية */}
      {interactive && isHovered && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${glowColor}, transparent 50%)`,
          }}
        />
      )}
      
      {/* تأثير الحدود للبطاقة، بالاعتماد على نوع البطاقة */}
      {withBorder && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 0 1px rgba(${glowColor.replace(/^#/, '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ')}, 0.2)`,
            borderRadius: '0.5rem',
          }}
        />
      )}
      
      {/* المحتوى */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* خطوط الشبكة الداخلية (اختياري) */}
      {variant === 'transparent' && (
        <div 
          className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(57, 255, 20, 0.3) 1px, transparent 1px), 
                             linear-gradient(90deg, rgba(57, 255, 20, 0.3) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            backgroundPosition: 'center center'
          }} 
        />
      )}
    </div>
  );
}

export default HolographicCard;