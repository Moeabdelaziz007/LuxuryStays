import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  duration?: number;
  delay?: number;
  className?: string;
}

/**
 * مكون انتقال الصفحة المحسّن مع تأثيرات حركية متنوعة
 * يساعد على جعل الانتقال بين الصفحات أكثر سلاسة ويوفر خيارات متعددة للانتقال
 */
export default function PageTransition({ 
  children, 
  direction = 'up',
  duration = 0.5,
  delay = 0,
  className = ''
}: PageTransitionProps) {
  
  // تعريف متغيرات الحركة بناءً على الاتجاه
  const getInitialAnimate = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 20 };
      case 'down':
        return { opacity: 0, y: -20 };
      case 'left':
        return { opacity: 0, x: 20 };
      case 'right':
        return { opacity: 0, x: -20 };
      case 'fade':
      default:
        return { opacity: 0 };
    }
  };
  
  const getFinalAnimate = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 };
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 };
      case 'fade':
      default:
        return { opacity: 1 };
    }
  };
  
  const getExitAnimate = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: -20 };
      case 'down':
        return { opacity: 0, y: 20 };
      case 'left':
        return { opacity: 0, x: -20 };
      case 'right':
        return { opacity: 0, x: 20 };
      case 'fade':
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialAnimate()}
      animate={getFinalAnimate()}
      exit={getExitAnimate()}
      transition={{ 
        duration: duration, 
        delay: delay,
        ease: [0.22, 1, 0.36, 1] // إعدادات التسارع الخاصة بنمط مخصص للحركة
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}