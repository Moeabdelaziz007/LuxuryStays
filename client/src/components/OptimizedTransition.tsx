import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { usePerformanceMode, PerformanceMode } from '@/hooks/use-performance-mode';

interface Props {
  children: React.ReactNode;
  className?: string;
  mode?: 'fade' | 'slide' | 'zoom' | 'holographic' | 'futuristic' | 'none';
}

/**
 * مكون الانتقال المحسن للتبديل بين الصفحات
 * يخفف التأثيرات على الأجهزة ذات الأداء المنخفض
 */
export default function OptimizedTransition({ children, className = '', mode = 'slide' }: Props) {
  const [location] = useLocation();
  const [settings] = usePerformanceMode();
  
  // تحديد نوع الانتقال المناسب بناءً على إعدادات الأداء
  const getOptimizedTransitionMode = () => {
    // إذا اختار المستخدم عدم استخدام أي انتقالات
    if (mode === 'none') return 'none';
    
    // إذا كان وضع الأداء منخفض جدًا أو وضع توفير البطارية
    if (settings.mode === PerformanceMode.LOW || settings.mode === PerformanceMode.BATTERY) {
      return 'fade'; // استخدم الانتقال الأبسط
    }
    
    // إذا كان المستخدم يريد استخدام تأثيرات متقدمة ولكن الجهاز لا يدعمها
    if ((mode === 'holographic' || mode === 'futuristic') && !settings.useHologramEffects) {
      return 'slide'; // استخدم انتقال أبسط
    }
    
    // استخدم الانتقال المفضل للمستخدم
    return mode;
  };
  
  // اختيار مدة الانتقال المناسبة
  const getOptimizedDuration = () => {
    switch (settings.mode) {
      case PerformanceMode.HIGH:
        return 0.5;
      case PerformanceMode.MEDIUM:
        return 0.3;
      case PerformanceMode.LOW:
      case PerformanceMode.BATTERY:
        return 0.2;
      default:
        return 0.4;
    }
  };
  
  const optimizedMode = getOptimizedTransitionMode();
  const optimizedDuration = getOptimizedDuration();
  
  // تعريف تأثيرات الانتقال
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
  
  const slideVariants = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
  };
  
  const zoomVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  };
  
  // تأثيرات هولوغرام متقدمة - فقط للأجهزة القوية
  const holographicVariants = {
    initial: { 
      opacity: 0, 
      y: 10, 
      filter: 'blur(8px)',
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        opacity: { duration: optimizedDuration },
        y: { duration: optimizedDuration * 1.2 },
        filter: { duration: optimizedDuration * 1.5 },
      }
    },
    exit: { 
      opacity: 0, 
      filter: 'blur(8px)', 
      transition: { 
        opacity: { duration: optimizedDuration * 0.8 },
        filter: { duration: optimizedDuration * 0.5 },
      }
    },
  };
  
  // تأثيرات مستقبلية مع تداخل - فقط للأجهزة ذات أداء عالي
  const futuristicVariants = {
    initial: { 
      opacity: 0, 
      scale: 1.02, 
      y: 15, 
      filter: 'hue-rotate(30deg) brightness(1.2)',
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      filter: 'hue-rotate(0deg) brightness(1)', 
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
        duration: optimizedDuration * 1.4,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98, 
      y: -15, 
      filter: 'hue-rotate(-30deg) brightness(1.2)',
      transition: {
        duration: optimizedDuration * 0.8,
      }
    },
  };
  
  // اختيار التأثير المناسب
  const getVariants = () => {
    switch (optimizedMode) {
      case 'fade':
        return fadeVariants;
      case 'slide':
        return slideVariants;
      case 'zoom':
        return zoomVariants;
      case 'holographic':
        return holographicVariants;
      case 'futuristic':
        return futuristicVariants;
      case 'none':
      default:
        return {}; // لا يوجد تأثيرات
    }
  };
  
  // تهيئة نوع التأثير المناسب
  const variants = getVariants();
  
  // إذا كان وضع عدم استخدام التأثيرات، عرض المحتوى مباشرة
  if (optimizedMode === 'none') {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: optimizedDuration }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}