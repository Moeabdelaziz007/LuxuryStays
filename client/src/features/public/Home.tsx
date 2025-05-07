import React, { useEffect } from "react";
import { useLocation } from "wouter";
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
  const [_, navigate] = useLocation();
  
  // التحقق من وجود مسار إعادة توجيه
  useEffect(() => {
    // التحقق من وجود معلمة redirect في URL
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('redirect');
    
    // التحقق من وجود مسار محفوظ في sessionStorage
    const storedPath = sessionStorage.getItem('redirect_path');
    
    // استخدام المسار من المعلمة أو من التخزين المؤقت
    const targetPath = redirectPath || storedPath;
    
    // إذا وجد مسار، قم بالتوجيه إليه
    if (targetPath) {
      console.log("تم العثور على مسار إعادة توجيه:", targetPath);
      
      // إزالة المسار من التخزين المؤقت لتجنب إعادة التوجيه المتكررة
      sessionStorage.removeItem('redirect_path');
      
      // تأخير قصير لضمان تحميل التطبيق بالكامل
      setTimeout(() => {
        navigate(targetPath.startsWith("/") ? targetPath : `/${targetPath}`);
      }, 100);
    }
  }, [navigate]);
  
  return (
    <PageTransition direction="up" duration={0.6}>
      <HomePage />
    </PageTransition>
  );
}