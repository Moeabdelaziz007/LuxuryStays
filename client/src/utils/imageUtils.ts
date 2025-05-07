/**
 * وحدة مساعدة لمعالجة الصور وتحسين أدائها
 */

/**
 * يقوم بإنشاء نسخة منخفضة الدقة من مسار الصورة
 * يمكن استخدامها كصورة مصغرة أثناء تحميل الصورة الكاملة
 * 
 * ملاحظة: هذه الدالة تفترض أن مسارات الصور تحتوي على معلمات مخصصة
 * يمكن استخدام CDN أو خدمة تحويل صور لتحقيق ذلك بشكل أفضل
 * @param originalSrc المسار الأصلي للصورة
 * @param width العرض المطلوب للصورة المصغرة
 */
export function createThumbnailUrl(originalSrc: string, width = 20): string {
  // إذا كانت الصورة من Cloudinary
  if (originalSrc.includes('cloudinary.com')) {
    // استبدال المعلمات الحالية أو إضافة معلمات جديدة للحصول على نسخة مصغرة
    return originalSrc.replace(/\/upload\//, `/upload/w_${width},q_10,e_blur:1000/`);
  } 
  
  // إذا كان URL للصورة يحتوي على معلمات حجم Imgix
  if (originalSrc.includes('imgix.net')) {
    const separator = originalSrc.includes('?') ? '&' : '?';
    return `${originalSrc}${separator}w=${width}&q=10&blur=500`;
  }

  // في حالة عدم وجود CDN، إرجاع المصدر الأصلي
  // في بيئة حقيقية، يمكن إنشاء خدمة خلفية لتحويل الصور
  return originalSrc;
}

/**
 * يقوم بإنشاء صورة placeholder SVG بسيطة جدًا
 * يمكن استخدامها عندما تكون أحجام الصور معروفة ولكن المحتوى غير متاح بعد
 * @param width عرض الصورة
 * @param height ارتفاع الصورة
 * @param color لون الخلفية
 */
export function createSvgPlaceholder(
  width: number,
  height: number,
  color = 'rgba(20,20,30,0.8)'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * وظيفة مساعدة لتأخير تحميل الصور حتى ظهورها في منطقة العرض
 * @param imgElement عنصر الصورة المراد تأخير تحميله
 * @param src المسار المراد تحميله
 */
export function lazyLoadImage(imgElement: HTMLImageElement, src: string): void {
  if (!imgElement) return;

  if ('loading' in HTMLImageElement.prototype) {
    // استخدام خاصية loading="lazy" المدمجة في المتصفح إذا كانت مدعومة
    imgElement.loading = 'lazy';
    imgElement.src = src;
  } else {
    // استخدام IntersectionObserver كحل بديل
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        imgElement.src = src;
        observer.disconnect();
      }
    });

    observer.observe(imgElement);
  }
}

/**
 * يعالج أخطاء تحميل الصور عن طريق استبدالها بصورة بديلة
 * @param imgElement عنصر الصورة
 * @param fallbackSrc المسار البديل في حالة الفشل
 */
export function handleImageError(
  imgElement: HTMLImageElement,
  fallbackSrc = '/assets/image-placeholder.svg'
): void {
  if (!imgElement) return;
  
  imgElement.onerror = () => {
    imgElement.src = fallbackSrc;
    imgElement.onerror = null; // منع التكرار في حالة فشل الصورة البديلة أيضًا
  };
}