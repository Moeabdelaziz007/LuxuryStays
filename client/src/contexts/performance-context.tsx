import React, { createContext, useContext, useEffect, useState } from "react";
import { usePerformanceMode, PerformanceMode, PerformanceSettings } from "@/hooks/use-performance-mode";

// نوع سياق الأداء
interface PerformanceContextType {
  settings: PerformanceSettings;
  setMode: (mode: PerformanceMode) => void;
  isReducedMotion: boolean;
  isMobile: boolean;
  isBatteryLow: boolean;
}

// إنشاء سياق الأداء
const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

// مكون مزود سياق الأداء
export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setMode] = usePerformanceMode();
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isBatteryLow, setIsBatteryLow] = useState(false);

  // التحقق من تفضيلات المستخدم لتقليل الحركة
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      
      // تغيير وضع الأداء تلقائيًا إذا فضل المستخدم تقليل الحركة
      if (e.matches && settings.mode === PerformanceMode.HIGH) {
        setMode(PerformanceMode.MEDIUM);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [settings.mode, setMode]);

  // التحقق من نوع الجهاز (محمول أم لا)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // التحقق من حالة البطارية إذا كانت متوفرة
  useEffect(() => {
    if ('getBattery' in navigator) {
      const handleBattery = (battery: any) => {
        const isLow = battery.level <= 0.2 && !battery.charging;
        setIsBatteryLow(isLow);
        
        // تغيير وضع الأداء تلقائيًا إلى وضع توفير البطارية إذا كانت البطارية منخفضة
        if (isLow && settings.mode !== PerformanceMode.BATTERY) {
          setMode(PerformanceMode.BATTERY);
        }
      };

      (navigator as any).getBattery?.().then((battery: any) => {
        handleBattery(battery);
        
        battery.addEventListener('levelchange', () => handleBattery(battery));
        battery.addEventListener('chargingchange', () => handleBattery(battery));
      });
    }
  }, [settings.mode, setMode]);

  // توفير سياق الأداء لجميع المكونات الفرعية
  return (
    <PerformanceContext.Provider
      value={{
        settings,
        setMode,
        isReducedMotion,
        isMobile,
        isBatteryLow,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
}

// هوك لاستخدام سياق الأداء
export function usePerformanceContext() {
  const context = useContext(PerformanceContext);
  
  if (context === undefined) {
    throw new Error("usePerformanceContext must be used within a PerformanceProvider");
  }
  
  return context;
}