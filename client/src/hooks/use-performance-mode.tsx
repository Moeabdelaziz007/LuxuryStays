import { useState, useEffect } from 'react';

/**
 * وحدة للكشف عن قدرات الجهاز وتوفير وضع الأداء المناسب
 * يمكن استخدامها لتقليل الرسوم المتحركة المعقدة على الأجهزة الضعيفة
 */

// عتبات الأداء للكشف عن قدرات الجهاز
const PERFORMANCE_THRESHOLDS = {
  // اختبارات الأداء البسيطة (تحت 30 إطار/ثانية يعتبر أداء منخفض)
  LOW_FPS: 30,
  // اختبار الذاكرة: حوالي 4GB
  MEMORY_LIMIT: 4 * 1024 * 1024 * 1024,
  // أقل من عدد معين من النوى يعتبر أجهزة ضعيفة
  CPU_CORES_LIMIT: 4
};

// أنواع وضع الأداء
export enum PerformanceMode {
  HIGH = 'high',    // جميع المؤثرات البصرية مفعلة (افتراضي)
  MEDIUM = 'medium', // بعض المؤثرات البصرية مخفضة
  LOW = 'low',      // الحد الأدنى من المؤثرات البصرية
  BATTERY = 'battery' // وضع توفير البطارية
}

export interface PerformanceSettings {
  mode: PerformanceMode;
  useParticles: boolean;      // جزيئات الخلفية المتحركة
  useComplexShadows: boolean; // ظلال معقدة ومؤثرات إضاءة
  useHologramEffects: boolean; // تأثيرات الهولوغرام
  useHeavyAnimations: boolean; // رسوم متحركة معقدة/متعددة
  useBackgroundEffects: boolean; // خلفيات متحركة وتأثيرات
  useGlowing: boolean;        // تأثيرات التوهج المعقدة
  transitionLevel: 1 | 2 | 3; // مستويات تأثيرات الانتقال (3=كامل، 1=بسيط)
}

/**
 * هوك استخدام وضع الأداء
 * يوفر إعدادات أداء التطبيق استنادًا إلى قدرات الجهاز
 * يمكن تخصيصه يدويًا من قبل المستخدم
 */
export function usePerformanceMode(): [PerformanceSettings, (mode: PerformanceMode) => void] {
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>(() => {
    // استرجاع إعدادات المستخدم من التخزين المحلي إن وجدت
    const savedMode = localStorage.getItem('performance-mode');
    if (savedMode && Object.values(PerformanceMode).includes(savedMode as PerformanceMode)) {
      return savedMode as PerformanceMode;
    }
    
    // الكشف التلقائي عن وضع الأداء المناسب للجهاز
    return detectPerformanceMode();
  });

  // ضبط الإعدادات بناءً على وضع الأداء المحدد
  const settings: PerformanceSettings = {
    mode: performanceMode,
    useParticles: performanceMode === PerformanceMode.HIGH,
    useComplexShadows: performanceMode !== PerformanceMode.LOW && performanceMode !== PerformanceMode.BATTERY,
    useHologramEffects: performanceMode !== PerformanceMode.LOW && performanceMode !== PerformanceMode.BATTERY,
    useHeavyAnimations: performanceMode === PerformanceMode.HIGH,
    useBackgroundEffects: performanceMode !== PerformanceMode.LOW && performanceMode !== PerformanceMode.BATTERY,
    useGlowing: performanceMode !== PerformanceMode.LOW && performanceMode !== PerformanceMode.BATTERY,
    transitionLevel: 
      performanceMode === PerformanceMode.HIGH ? 3 : 
      performanceMode === PerformanceMode.MEDIUM ? 2 : 1
  };

  // تعيين وضع الأداء وحفظه في التخزين المحلي
  const setMode = (mode: PerformanceMode) => {
    localStorage.setItem('performance-mode', mode);
    setPerformanceMode(mode);
  };

  // إذا تم تفعيل وضع توفير البطارية، تحديث الإعدادات تلقائيًا
  useEffect(() => {
    if ('getBattery' in navigator) {
      const handleBatteryChange = (battery: any) => {
        // إذا كانت البطارية أقل من 20% وغير متصلة بالشاحن، اضبط وضع توفير البطارية
        if (battery.level < 0.2 && !battery.charging && performanceMode !== PerformanceMode.BATTERY) {
          setMode(PerformanceMode.BATTERY);
        }
      };

      // استرجاع حالة البطارية (إن أمكن)
      (navigator as any).getBattery?.().then((battery: any) => {
        handleBatteryChange(battery);
        
        // مراقبة تغييرات حالة البطارية
        battery.addEventListener('levelchange', () => handleBatteryChange(battery));
        battery.addEventListener('chargingchange', () => handleBatteryChange(battery));
      });
    }
  }, [performanceMode]);

  return [settings, setMode];
}

/**
 * وظيفة الكشف التلقائي عن وضع الأداء الأنسب للجهاز
 * تستخدم عدة معايير تقنية لتقييم قدرات الجهاز
 */
function detectPerformanceMode(): PerformanceMode {
  // اختيار وضع الأداء المتوسط كوضع افتراضي
  let mode: PerformanceMode = PerformanceMode.MEDIUM;
  
  // هل المتصفح يعمل على جهاز محمول؟
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // اختبار عدد النوى الخاصة بالمعالج
  const cpuCores = navigator.hardwareConcurrency || 0;
  
  // اختبار الذاكرة (إذا كانت معلومات الذاكرة متاحة)
  const hasLowMemory = (navigator as any).deviceMemory < 4;
  
  // إذا كان جهاز محمول مع ذاكرة منخفضة أو عدد نوى قليل، استخدم وضع الأداء المنخفض
  if (isMobile && (hasLowMemory || cpuCores <= PERFORMANCE_THRESHOLDS.CPU_CORES_LIMIT)) {
    mode = PerformanceMode.LOW;
  } 
  // إذا كان جهاز بقدرات عالية، استخدم وضع الأداء العالي
  else if (!isMobile && cpuCores > PERFORMANCE_THRESHOLDS.CPU_CORES_LIMIT) {
    mode = PerformanceMode.HIGH;
  }
  
  // وضع الشاشة؟ إذا كان المستخدم يستخدم وضع الشاشة المظلم، فقد يفضل وضع أداء أقل
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // تقليل مستوى الأداء إذا كان المستخدم يفضل تقليل الحركة
    mode = mode === PerformanceMode.LOW ? PerformanceMode.LOW : PerformanceMode.MEDIUM;
  }
  
  // محاولة قياس معدل الإطارات الأولي من خلال اختبار بسيط
  try {
    measureInitialFrameRate().then(fps => {
      // إذا كان معدل الإطارات منخفضًا جدًا، قم بتخزين هذه المعلومة لاستخدامها لاحقًا
      if (fps < PERFORMANCE_THRESHOLDS.LOW_FPS) {
        localStorage.setItem('detected-low-fps', 'true');
        // إذا كان المستخدم لم يحدد وضعًا مخصصًا، قم بتحديث الوضع
        if (!localStorage.getItem('performance-mode')) {
          localStorage.setItem('performance-mode', PerformanceMode.LOW);
        }
      } else {
        localStorage.removeItem('detected-low-fps');
      }
    });
  } catch (e) {
    console.error('فشل في قياس معدل الإطارات:', e);
  }
  
  return mode;
}

/**
 * وظيفة لقياس معدل الإطارات الأولي عند تحميل التطبيق
 * تستخدم requestAnimationFrame لحساب عدد الإطارات المعروضة في وحدة زمنية
 */
async function measureInitialFrameRate(): Promise<number> {
  return new Promise((resolve) => {
    let frameCount = 0;
    let startTime: number;
    let rafId: number;
    
    // وظيفة لعد الإطارات
    const countFrames = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      
      frameCount++;
      const elapsedTime = timestamp - startTime;
      
      // قياس معدل الإطارات بعد مرور وقت كافٍ (500 مللي ثانية)
      if (elapsedTime >= 500) {
        const fps = (frameCount / elapsedTime) * 1000;
        cancelAnimationFrame(rafId);
        resolve(fps);
      } else {
        rafId = requestAnimationFrame(countFrames);
      }
    };
    
    // بدء قياس معدل الإطارات
    rafId = requestAnimationFrame(countFrames);
    
    // إذا لم نحصل على نتيجة بعد 1 ثانية، افترض FPS عالية
    setTimeout(() => {
      if (frameCount === 0) {
        cancelAnimationFrame(rafId);
        resolve(60); // افتراض معدل إطارات مقبول
      }
    }, 1000);
  });
}