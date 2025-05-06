import React, { useEffect, useState } from 'react';

interface SpaceBackgroundProps {
  children: React.ReactNode;
  density?: 'low' | 'medium' | 'high';
  withGrid?: boolean;
  withStars?: boolean;
  withNebula?: boolean;
  withScanlines?: boolean;
  className?: string;
}

export function SpaceBackground({
  children,
  density = 'medium',
  withGrid = true,
  withStars = true,
  withNebula = true,
  withScanlines = false,
  className = '',
}: SpaceBackgroundProps) {
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; opacity: number; animationDelay: string }>>([]);
  
  // تحديد عدد النجوم بناءً على الكثافة المطلوبة
  const getStarCount = () => {
    switch (density) {
      case 'low': return 50;
      case 'high': return 200;
      case 'medium':
      default: return 100;
    }
  };

  // إنشاء النجوم عند تحميل المكون
  useEffect(() => {
    if (withStars) {
      const starCount = getStarCount();
      const newStars = [];
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.7 + 0.3,
          animationDelay: `${Math.random() * 5}s`,
        });
      }
      
      setStars(newStars);
    }
  }, [withStars, density]);

  return (
    <div className={`relative overflow-hidden min-h-screen ${className}`}>
      {/* خلفية الفضاء */}
      <div className="fixed inset-0 bg-[#020510] z-[-3]" />
      
      {/* سديم الفضاء */}
      {withNebula && (
        <>
          <div className="fixed inset-0 z-[-2] opacity-20">
            <div className="absolute top-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-[#39FF14] blur-[150px] animate-pulse-very-slow" />
            <div className="absolute bottom-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#3d72d7] blur-[120px] animate-pulse-slow" />
            <div className="absolute top-[50%] right-[30%] w-[30%] h-[30%] rounded-full bg-[#8750d2] blur-[100px] animate-pulse-slow-delay" />
          </div>
        </>
      )}
      
      {/* شبكة إحداثية */}
      {withGrid && (
        <div className="fixed inset-0 z-[-1] opacity-[0.07]" 
             style={{ 
               backgroundImage: `linear-gradient(rgba(57, 255, 20, 0.3) 1px, transparent 1px), 
                                linear-gradient(90deg, rgba(57, 255, 20, 0.3) 1px, transparent 1px)`,
               backgroundSize: '50px 50px',
               backgroundPosition: 'center center'
             }} />
      )}
      
      {/* النجوم */}
      {withStars && (
        <div className="fixed inset-0 z-[-1] overflow-hidden">
          {stars.map((star, index) => (
            <div
              key={index}
              className="absolute rounded-full animate-pulse-subtle"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: 'white',
                opacity: star.opacity,
                animationDelay: star.animationDelay,
                boxShadow: star.size > 1.5 ? `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})` : 'none',
              }}
            />
          ))}
        </div>
      )}
      
      {/* خطوط المسح (كخيار) */}
      {withScanlines && (
        <div 
          className="fixed inset-0 z-[-1] pointer-events-none" 
          style={{
            backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.1) 50%)',
            backgroundSize: '4px 4px',
            opacity: 0.2
          }}
        />
      )}
      
      {/* المحتوى */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default SpaceBackground;