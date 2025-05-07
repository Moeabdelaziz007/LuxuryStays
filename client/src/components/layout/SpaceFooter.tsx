import React from "react";

/**
 * مكون تذييل صفحة مبسط بتصميم فضائي مميز للتطبيق
 */
export default function SpaceFooter() {
  return (
    <footer className="bg-black/60 backdrop-blur-sm border-t border-[#39FF14]/10 py-6 relative overflow-hidden">
      {/* تأثير النجوم */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className={`absolute w-1 h-1 bg-white rounded-full animate-twinkle`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
        
        {/* دوائر كهربائية */}
        <div className="tech-circuit absolute inset-0 opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} StayX. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}