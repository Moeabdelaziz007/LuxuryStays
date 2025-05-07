import React from "react";
import TechSpaceBackground from "@/features/home/TechSpaceBackground";
import PerformanceControls from "@/components/PerformanceControls";
import { usePerformanceContext } from "@/contexts/performance-context";

interface TechBackgroundLayoutProps {
  children: React.ReactNode;
}

/**
 * مكون التخطيط الذي يطبق خلفية التقنية/الفضاء على جميع الصفحات
 * يتضمن عناصر التقنية المتحركة وعلامة StayX التجارية
 * كما يتضمن مراقبة الأداء لضبط الرسوم المتحركة حسب قدرات الجهاز
 */
export default function TechBackgroundLayout({ children }: TechBackgroundLayoutProps) {
  const { settings } = usePerformanceContext();
  
  // تحديد ما إذا كان سيتم تحميل خلفية الفضاء التقنية بناءً على إعدادات الأداء
  const shouldLoadBackground = settings.useBackgroundEffects;
  
  return (
    <div className="min-h-screen text-white relative">
      {/* تطبيق خلفية الفضاء التقنية على التطبيق بأكمله - فقط إذا كان الأداء يسمح بذلك */}
      {shouldLoadBackground && <TechSpaceBackground className="fixed" />}
      
      {/* حاوية المحتوى مع z-index مناسب */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* زر التحكم في الأداء - متوفر دائمًا للمستخدم */}
      <PerformanceControls />
    </div>
  );
}