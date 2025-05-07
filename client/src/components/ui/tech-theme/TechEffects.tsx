import React from 'react';

interface TechEffectsProps {
  type?: 'grid' | 'particles' | 'scanlines' | 'matrix' | 'stars' | 'glow';
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  className?: string;
  withAnimation?: boolean;
}

/**
 * TechEffects - تأثيرات بصرية للواجهات ذات الطابع التقني
 * يمكن استخدامه كعنصر مستقل أو داخل مكونات أخرى
 */
export default function TechEffects({
  type = 'grid',
  intensity = 'medium',
  color = '#39FF14',
  className = '',
  withAnimation = true,
}: TechEffectsProps) {
  // تحويل اللون إلى تنسيق rgba للشفافية
  const getRGBA = (opacity: number) => {
    // إذا كان اللون بتنسيق hex
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    // إذا كان اللون بتنسيق rgb
    if (color.startsWith('rgb')) {
      return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
    }
    // حالات أخرى، استخدم اللون الافتراضي
    return `rgba(57, 255, 20, ${opacity})`;
  };

  // تحديد شدة التأثير
  const getOpacity = () => {
    switch (intensity) {
      case 'low':
        return 0.1;
      case 'high':
        return 0.3;
      default: // medium
        return 0.2;
    }
  };

  // تحديد نوع التأثير
  const renderEffect = () => {
    switch (type) {
      case 'scanlines':
        return (
          <div 
            className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
            style={{
              background: `repeating-linear-gradient(
                0deg,
                ${getRGBA(getOpacity() / 5)} 0px,
                ${getRGBA(getOpacity() / 5)} 1px,
                transparent 1px,
                transparent 2px
              )`,
              backgroundSize: '100% 4px',
              mixBlendMode: 'overlay',
            }}
          />
        );
      
      case 'particles':
        return (
          <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
            {Array.from({ length: intensity === 'low' ? 10 : intensity === 'high' ? 30 : 20 }).map((_, i) => {
              const size = Math.random() * 2 + 1; // 1-3px
              const top = Math.random() * 100;
              const left = Math.random() * 100;
              const duration = Math.random() * 4 + 2; // 2-6s
              const delay = Math.random() * 5; // 0-5s
              
              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    opacity: Math.random() * 0.5 + 0.2, // 0.2-0.7
                    animation: withAnimation ? `pulse-glow ${duration}s infinite ${delay}s` : 'none',
                  }}
                />
              );
            })}
          </div>
        );
      
      case 'matrix':
        return (
          <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
            <div className="absolute inset-0 flex space-x-4">
              {Array.from({ length: 20 }).map((_, i) => {
                const width = Math.random() * 2 + 0.5; // 0.5-2.5px
                const opacity = Math.random() * 0.2 + 0.05; // 0.05-0.25
                const animationDelay = Math.random() * 5; // 0-5s
                
                return (
                  <div
                    key={i}
                    className="h-full"
                    style={{
                      width: `${width}px`,
                      backgroundColor: color,
                      opacity,
                      transformOrigin: 'top',
                      animation: withAnimation ? `float 20s linear infinite ${animationDelay}s` : 'none',
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      
      case 'stars':
        return (
          <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
            {Array.from({ length: intensity === 'low' ? 15 : intensity === 'high' ? 50 : 30 }).map((_, i) => {
              const size = Math.random() * (i % 5 === 0 ? 3 : 1) + 1; // mostly 1-2px, occasionally 1-4px
              const top = Math.random() * 100;
              const left = Math.random() * 100;
              const twinkleSpeed = Math.random() * 4 + 3; // 3-7s
              
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    boxShadow: `0 0 ${size * 2}px ${getRGBA(0.7)}`,
                    animation: withAnimation ? `pulse-glow ${twinkleSpeed}s ease-in-out infinite` : 'none',
                  }}
                />
              );
            })}
          </div>
        );
      
      case 'glow':
        return (
          <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
            <div 
              className={`absolute rounded-full ${withAnimation ? 'animate-pulse-glow' : ''}`}
              style={{
                top: '30%',
                left: '60%',
                width: '40%',
                height: '40%',
                backgroundColor: color,
                opacity: getOpacity() / 2,
                filter: 'blur(80px)',
              }}
            />
            <div 
              className={`absolute rounded-full ${withAnimation ? 'animate-pulse-glow' : ''}`}
              style={{
                top: '10%',
                right: '30%',
                width: '30%',
                height: '30%',
                backgroundColor: color,
                opacity: getOpacity() / 3,
                filter: 'blur(60px)',
                animationDelay: '1s',
              }}
            />
          </div>
        );
      
      case 'grid':
      default:
        // تأثير الشبكة - الافتراضي
        return (
          <div 
            className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
            style={{
              backgroundImage: `
                linear-gradient(to right, ${getRGBA(getOpacity())} 1px, transparent 1px),
                linear-gradient(to bottom, ${getRGBA(getOpacity())} 1px, transparent 1px)
              `,
              backgroundSize: intensity === 'low' ? '50px 50px' : intensity === 'high' ? '20px 20px' : '30px 30px',
            }}
          />
        );
    }
  };

  return renderEffect();
}