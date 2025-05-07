import React, { useEffect, useRef, useState } from 'react';
import { usePerformanceMode, PerformanceMode } from '@/hooks/use-performance-mode';

type ParticleProps = {
  color?: string;
  maxParticles?: number;
  opacity?: number;
  size?: number;
  speed?: number;
  className?: string;
  glowIntensity?: 'none' | 'low' | 'medium' | 'high';
};

/**
 * مكون محسن للجزيئات المتحركة في الخلفية
 * يعدل عدد الجزيئات وتأثيراتها بناء على قدرات الجهاز
 */
export default function OptimizedParticles({
  color = '#39FF14',
  maxParticles: userMaxParticles,
  opacity = 0.3,
  size = 2,
  speed = 0.5,
  className = '',
  glowIntensity = 'medium',
}: ParticleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [settings] = usePerformanceMode();
  
  // تعديل عدد الجزيئات بناء على وضع الأداء
  const getOptimizedParticleCount = () => {
    // إذا كان المستخدم قد حدد عدد جزيئات، استخدمه كحد أقصى
    const baseMaxParticles = userMaxParticles || 100;
    
    // تعديل عدد الجزيئات بناء على وضع الأداء
    switch (settings.mode) {
      case PerformanceMode.HIGH:
        return baseMaxParticles;
      case PerformanceMode.MEDIUM:
        return Math.floor(baseMaxParticles * 0.5); // 50% من العدد الأقصى
      case PerformanceMode.LOW:
        return Math.floor(baseMaxParticles * 0.2); // 20% من العدد الأقصى
      case PerformanceMode.BATTERY:
        return 0; // لا جزيئات في وضع توفير البطارية
      default:
        return Math.floor(baseMaxParticles * 0.7);
    }
  };
  
  // تعديل شدة التوهج بناء على وضع الأداء
  const getOptimizedGlowIntensity = () => {
    if (!settings.useGlowing) return 'none';
    
    switch (settings.mode) {
      case PerformanceMode.HIGH:
        return glowIntensity;
      case PerformanceMode.MEDIUM:
        return glowIntensity === 'high' ? 'medium' : glowIntensity === 'medium' ? 'low' : 'none';
      default:
        return 'none';
    }
  };
  
  // إعدادات الجزيئات المحسنة
  const optimizedMaxParticles = getOptimizedParticleCount();
  const optimizedGlowIntensity = getOptimizedGlowIntensity();
  
  // إذا تم تعطيل جميع الجزيئات، لا داعي لعرض أي شيء
  if (optimizedMaxParticles <= 0 || settings.mode === PerformanceMode.BATTERY) {
    return null;
  }
  
  // تحديث معدل إعادة الرسم استنادًا إلى قدرات الجهاز
  const getOptimizedRefreshRate = () => {
    switch (settings.mode) {
      case PerformanceMode.HIGH:
        return 1; // كل إطار
      case PerformanceMode.MEDIUM:
        return 2; // كل إطارين
      case PerformanceMode.LOW:
        return 3; // كل 3 إطارات
      default:
        return 1;
    }
  };
  
  // تحديث معدل حركة الجزيئات
  const getOptimizedSpeed = () => {
    switch (settings.mode) {
      case PerformanceMode.HIGH:
        return speed;
      case PerformanceMode.MEDIUM:
        return speed * 0.7;
      case PerformanceMode.LOW:
        return speed * 0.5;
      default:
        return speed;
    }
  };
  
  // استخدام useEffect لإنشاء الجزيئات ورسمها
  useEffect(() => {
    if (!canvasRef.current || optimizedMaxParticles <= 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let frameCount = 0;
    const optimizedRefreshRate = getOptimizedRefreshRate();
    const particleSpeed = getOptimizedSpeed();
    
    // تحديث حجم Canvas ليناسب الشاشة
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // إنشاء الجزيئات
    const particles: Array<{
      x: number;
      y: number;
      speedX: number;
      speedY: number;
      size: number;
      opacity: number;
    }> = [];
    
    for (let i = 0; i < optimizedMaxParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedX: (Math.random() - 0.5) * particleSpeed,
        speedY: (Math.random() - 0.5) * particleSpeed,
        size: Math.random() * size + 1,
        opacity: Math.random() * opacity + 0.1,
      });
    }
    
    // إعداد الظل والتوهج
    const setupGlow = () => {
      if (!ctx) return;
      
      switch (optimizedGlowIntensity) {
        case 'high':
          ctx.shadowColor = color;
          ctx.shadowBlur = 15;
          break;
        case 'medium':
          ctx.shadowColor = color;
          ctx.shadowBlur = 8;
          break;
        case 'low':
          ctx.shadowColor = color;
          ctx.shadowBlur = 4;
          break;
        case 'none':
        default:
          ctx.shadowBlur = 0;
          break;
      }
    };
    
    // رسم الجزيئات
    const draw = () => {
      frameCount++;
      
      // تحديث فقط على الإطارات المحددة للأداء المحسن
      if (frameCount % optimizedRefreshRate !== 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setupGlow();
      
      // رسم كل جزيء
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // تحديث موقع الجزيء
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // حدود Canvas - الجزيئات تظهر من الجانب الآخر
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    // تنظيف
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, optimizedMaxParticles, opacity, size, optimizedGlowIntensity, settings.mode]);
  
  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
}