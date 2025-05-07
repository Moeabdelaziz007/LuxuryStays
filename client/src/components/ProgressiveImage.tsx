import { useState, useEffect, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  lowResSrc?: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  loadingComponent?: React.ReactNode;
  placeholderClassName?: string;
}

/**
 * ProgressiveImage - مكوّن لتحميل الصور بشكل تدريجي
 * يعرض صورة منخفضة الدقة أو تأثير غشاء ضبابي أثناء تحميل الصورة عالية الدقة
 * يحسّن تجربة المستخدم ويسرع من الاستجابة المرئية للموقع
 */
export default function ProgressiveImage({
  src,
  lowResSrc,
  alt,
  className = '',
  containerClassName = '',
  style,
  width,
  height,
  loadingComponent,
  placeholderClassName = '',
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLowResLoaded, setIsLowResLoaded] = useState(false);
  const [error, setError] = useState(false);

  // عندما يتغير مصدر الصورة، نعيد ضبط الحالة
  useEffect(() => {
    setIsLoaded(false);
    setError(false);
  }, [src]);

  // تجهيز أنماط المكوّن
  const containerStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: width || '100%',
    height: height || 'auto',
    background: 'rgba(10, 10, 20, 0.2)',
    ...style,
  };

  // مكوّن التحميل الافتراضي
  const defaultLoader = (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm",
      placeholderClassName
    )}>
      <div className="w-8 h-8 border-2 border-t-transparent border-[#39FF14]/70 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div 
      className={cn("relative overflow-hidden", containerClassName)} 
      style={containerStyle}
    >
      {/* الصورة منخفضة الدقة - تظهر فورًا كـ placeholder */}
      {lowResSrc && !isLoaded && (
        <img
          src={lowResSrc}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            isLowResLoaded ? "opacity-100" : "opacity-0",
            "blur-sm scale-105",
            placeholderClassName
          )}
          onLoad={() => setIsLowResLoaded(true)}
        />
      )}

      {/* الصورة الرئيسية عالية الدقة */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "transition-all duration-500 w-full h-full",
          isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        style={{
          objectPosition: 'center',
          objectFit: 'cover',
        }}
      />

      {/* عرض مكوّن التحميل أثناء تحميل الصورة */}
      {!isLoaded && !error && (
        loadingComponent || defaultLoader
      )}

      {/* عرض رسالة خطأ إذا فشل تحميل الصورة */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 text-white p-4 text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-red-500 mb-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <span className="text-sm">فشل تحميل الصورة</span>
        </div>
      )}
    </div>
  );
}