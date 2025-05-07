import React from 'react';

interface TechBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'light' | 'neon';
  particleDensity?: 'low' | 'medium' | 'high';
  gridVisible?: boolean;
  glowEffects?: boolean;
}

export default function TechBackground({
  children,
  className = '',
  variant = 'default',
  particleDensity = 'medium',
  gridVisible = true,
  glowEffects = true
}: TechBackgroundProps) {
  // تحديد ألوان الخلفية بناءً على المتغير
  const getBgClass = () => {
    switch (variant) {
      case 'dark':
        return 'bg-black';
      case 'light':
        return 'bg-gray-900';
      case 'neon':
        return 'bg-black';
      default:
        return 'bg-black';
    }
  };

  // تحديد عدد الجزيئات بناءً على الكثافة
  const getParticleCount = () => {
    switch (particleDensity) {
      case 'low':
        return 3;
      case 'high':
        return 8;
      default: // medium
        return 5;
    }
  };

  // إنشاء مصفوفة من العناصر المتحركة
  const particles = Array.from({ length: getParticleCount() }).map((_, index) => {
    // موقع عشوائي
    const top = Math.floor(Math.random() * 100);
    const left = Math.floor(Math.random() * 100);
    // حجم عشوائي
    const size = Math.floor(Math.random() * 3) + 1;
    // تأخير عشوائي للرسوم المتحركة
    const delay = (Math.random() * 2).toFixed(1);
    
    return (
      <div 
        key={index} 
        className="absolute rounded-full bg-[#39FF14] animate-ping" 
        style={{
          top: `${top}%`,
          left: `${left}%`,
          height: `${size}px`,
          width: `${size}px`,
          animationDelay: `${delay}s`,
          animationDuration: `${4 + Math.random() * 6}s`
        }}
      />
    );
  });

  // إنشاء تأثيرات التوهج
  const glowSpots = glowEffects ? (
    <>
      <div className="absolute h-32 w-32 rounded-full bg-[#39FF14] blur-[80px] opacity-5 top-[30%] left-[60%]"></div>
      <div className="absolute h-20 w-20 rounded-full bg-[#39FF14] blur-[50px] opacity-5 bottom-[20%] right-[30%]"></div>
      <div className="absolute h-40 w-40 rounded-full bg-[#39FF14] blur-[100px] opacity-5 top-[10%] right-[10%]"></div>
    </>
  ) : null;

  return (
    <div className={`relative ${getBgClass()} text-white overflow-hidden ${className}`}>
      {/* شبكة الخلفية */}
      {gridVisible && (
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgIDxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiMxMTExMTEiIHN0cm9rZS13aWR0aD0iMC41Ii8+CiAgPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPg==')] opacity-20"></div>
      )}
      
      {/* تأثيرات الجزيئات */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        {particles}
      </div>
      
      {/* تأثيرات التوهج */}
      {glowSpots}
      
      {/* المحتوى الرئيسي */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* تأثير التوهج النيون للنمط 'neon' */}
      {variant === 'neon' && (
        <div className="absolute inset-0 border border-[#39FF14]/20 shadow-[0_0_20px_rgba(57,255,20,0.3)] rounded-lg pointer-events-none"></div>
      )}
    </div>
  );
}