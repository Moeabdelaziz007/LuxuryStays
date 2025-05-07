import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
  className = "",
  containerClassName = "",
  style,
  width,
  height,
  loadingComponent,
  placeholderClassName = "",
}: ProgressiveImageProps) {
  const [imgSrc, setImgSrc] = useState(lowResSrc || src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // إعادة تعيين الحالة عند تغيير المصدر
    setLoading(true);
    setError(false);
    
    // إذا لم يكن هناك مصدر منخفض الدقة، استخدم المصدر الأصلي مباشرة
    if (!lowResSrc) {
      setImgSrc(src);
    }

    // تحميل الصورة عالية الدقة
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImgSrc(src);
      setLoading(false);
    };

    img.onerror = () => {
      setError(true);
      setLoading(false);
    };

    return () => {
      // تنظيف المستمعين عند إلغاء تحميل المكوّن
      img.onload = null;
      img.onerror = null;
    };
  }, [src, lowResSrc]);

  const isLoading = loading && lowResSrc;
  const hasLowResSrc = Boolean(lowResSrc);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-900/50",
        containerClassName
      )}
      style={{
        width: width,
        height: height,
      }}
    >
      {/* عنصر التحميل المخصص إذا كان متوفراً */}
      {isLoading && loadingComponent && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {loadingComponent}
        </div>
      )}

      {/* خلفية أو صورة منخفضة الدقة */}
      {hasLowResSrc && (
        <div
          className={cn(
            "absolute inset-0 z-0",
            isLoading ? "opacity-100" : "opacity-0",
            "transition-opacity duration-500",
            placeholderClassName
          )}
        >
          <img
            src={lowResSrc}
            alt={alt}
            className={cn(
              "w-full h-full object-cover filter blur-sm scale-105",
              className
            )}
            style={style}
          />
        </div>
      )}

      {/* الصورة الرئيسية عالية الدقة */}
      <div
        className={cn(
          "absolute inset-0 z-1",
          loading ? "opacity-0" : "opacity-100",
          "transition-opacity duration-500"
        )}
      >
        {!error ? (
          <img
            src={imgSrc}
            alt={alt}
            className={cn("w-full h-full object-cover", className)}
            style={style}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900/30 text-gray-400">
            <span>فشل تحميل الصورة</span>
          </div>
        )}
      </div>

      {/* مؤشر التحميل الافتراضي إذا لم يكن هناك عنصر تحميل مخصص */}
      {isLoading && !loadingComponent && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30">
          <div className="w-8 h-8 border-2 border-t-transparent border-[#39FF14]/70 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}