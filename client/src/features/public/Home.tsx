import React from "react";
import HomePage from "@/features/home/HomePage";

/**
 * PublicHome - مكون الصفحة الرئيسية العامة
 * 
 * هذا المكون يعمل كوسيط، يستدعي مكون HomePage من مجلد features/home
 * هذا النهج يسمح بفصل واضح بين المكونات العامة (public) والمكونات الأساسية (features/home)
 * بحيث يمكن استخدام نفس محتوى الصفحة الرئيسية في مسارات مختلفة
 */
export default function PublicHome() {
  return <HomePage />;
}