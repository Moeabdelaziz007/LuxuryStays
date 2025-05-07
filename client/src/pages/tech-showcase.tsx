import React from "react";
import SpaceTechShowcase from "@/features/theme/SpaceTechShowcase";
import PageTransition from "@/features/common/PageTransition";

/**
 * صفحة عرض مكونات واجهة المستخدم الفضائية/التقنية
 * تعرض جميع مكونات StayX بشكل تفاعلي مع إمكانية تعديل الإعدادات
 */
export default function TechShowcasePage() {
  return (
    <PageTransition>
      <SpaceTechShowcase />
    </PageTransition>
  );
}