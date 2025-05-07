import React from 'react';
import { useImageLazyLoad } from '@/hooks/useImageLazyLoad';
import { createSvgPlaceholder } from '@/utils/imageUtils';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  rootMargin?: string;
  threshold?: number;
  placeholderColor?: string;
}

/**
 * مكوّن LazyImage - تحميل الصور البطيء والمتدرج
 * يقوم بتحميل الصور فقط عندما تكون مرئية في نطاق العرض
 * مما يحسن سرعة تحميل الصفحة ويقلل استهلاك البيانات
 * 
 * @param {LazyImageProps} props خصائص المكوّن
 */
export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  containerClassName = '',
  aspectRatio = '',
  priority = false,
  objectFit = 'cover',
  rootMargin = '200px',
  threshold = 0.1,
  placeholderColor = 'rgba(20,20,30,0.8)',
}: LazyImageProps) {
  // استخدام خطاف التحميل البطيء
  const { elementRef, isLoaded } = useImageLazyLoad(rootMargin, threshold);

  // إنشاء placeholder SVG بناءً على الأبعاد المحددة
  const placeholderSrc = React.useMemo(() => {
    return width && height
      ? createSvgPlaceholder(width, height, placeholderColor)
      : undefined;
  }, [width, height, placeholderColor]);

  // إعداد نمط نسبة العرض للارتفاع
  const aspectRatioStyle = aspectRatio
    ? { aspectRatio, width: width || '100%' }
    : { width: width || '100%', height: height || 'auto' };

  return (
    <div
      ref={elementRef}
      className={cn(
        'overflow-hidden relative bg-gray-900/30',
        containerClassName
      )}
      style={aspectRatioStyle}
    >
      {/* مؤشر التحميل - مرئي فقط قبل ظهور الصورة */}
      {!isLoaded && !priority && (
        <div className="absolute inset-0 bg-gray-900/20 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-t-transparent border-[#39FF14]/70 rounded-full animate-spin"></div>
        </div>
      )}

      {/* الصورة الفعلية - نستخدم loading="eager" للصور ذات الأولوية */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        className={cn(
          'transition-opacity duration-500',
          isLoaded || priority ? 'opacity-100' : 'opacity-0',
          `object-${objectFit}`,
          className
        )}
        style={{
          height: height || '100%',
          width: width || '100%',
        }}
        onLoad={() => {
          // إضافة تأثيرات إضافية عند اكتمال التحميل إذا لزم الأمر
        }}
      />

      {/* صورة placeholder - مرئية فقط أثناء التحميل */}
      {placeholderSrc && !isLoaded && !priority && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-60"
        />
      )}
    </div>
  );
}