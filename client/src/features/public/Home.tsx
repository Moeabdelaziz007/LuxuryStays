import React from "react";
import HomePage from "@/features/home/HomePage";
import PageTransition from "@/features/common/PageTransition";

/**
 * PublicHome - مكون الصفحة الرئيسية العامة
 * 
 * هذا المكون يعمل كوسيط، يستدعي مكون HomePage من مجلد features/home
 * هذا النهج يسمح بفصل واضح بين المكونات العامة (public) والمكونات الأساسية (features/home)
 * بحيث يمكن استخدام نفس محتوى الصفحة الرئيسية في مسارات مختلفة
 * 
 * تم إضافة مكون PageTransition لتقديم تجربة انتقال سلسة عند تحميل الصفحة
 */
export default function PublicHome() {
  return (
    <PageTransition direction="up" duration={0.6}>
      <HomePage />
    </PageTransition>
  );
}