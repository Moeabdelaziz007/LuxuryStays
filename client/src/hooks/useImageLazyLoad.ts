import { useEffect, useRef, useState } from 'react';

/**
 * خطاف React مخصص للتحميل الكسول للصور
 * يقوم بتحميل الصور فقط عندما تكون مرئية في العرض، مما يحسن أداء التحميل الأولي للصفحة
 * @param rootMargin مقدار الهامش حول العنصر قبل تفعيل التحميل
 * @param threshold نسبة ظهور العنصر في العرض التي تفعل التحميل
 */
export function useImageLazyLoad(rootMargin = '0px', threshold = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // تكوين IntersectionObserver للكشف عن رؤية العنصر
  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin, threshold }
    );

    const currentElement = elementRef.current;
    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [rootMargin, threshold]);

  // تمييز الصورة كمحملة بعد ظهورها في العرض
  useEffect(() => {
    if (isVisible && !isLoaded) {
      setIsLoaded(true);
    }
  }, [isVisible, isLoaded]);

  return { elementRef, isVisible, isLoaded };
}