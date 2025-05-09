// ✅ RouteGuard.tsx — مكون حماية المسارات باستخدام الصلاحيات
import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@shared/schema";

interface RouteGuardProps {
  children: React.ReactNode;
  role: string;
}

export default function RouteGuard({ children, role }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const [location] = useLocation();
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(true);
  
  // تسجيل معلومات التصحيح
  useEffect(() => {
    console.log("[DEBUG] RouteGuard:", { 
      role, 
      path: location, 
      isAuthenticated: !!user, 
      userRole: user?.role || 'none',
      loading
    });
  }, [role, location, user, loading]);

  // إلغاء تأخير التحميل لتسريع الوصول
  useEffect(() => {
    setShowLoadingAnimation(false);
  }, []);
  
  // عرض حالة التحميل بأسلوب أكثر جاذبية ولكن فقط للمرة الأولى أو عند التحميل الفعلي
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-t-4 border-[#39FF14] animate-spin"></div>
        </div>
        <div className="mt-4 text-lg font-medium">جاري التحقق من صلاحياتك...</div>
        <div className="mt-1 text-sm text-gray-400">هذا قد يستغرق بضع ثوانٍ</div>
      </div>
    );
  }

  // التوجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مسجل
  if (!user) {
    // احفظ مسار التوجيه الحالي للعودة إليه بعد تسجيل الدخول
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const redirectPath = currentPath + currentSearch;
    
    return <Redirect to={`/login?redirect=${encodeURIComponent(redirectPath)}`} />;
  }

  // التحقق من أن المستخدم لديه دور صالح
  if (!user.role) {
    return <Redirect to="/unauthorized" />;
  }
  
  // السماح للمشرف العام بالوصول إلى جميع المسارات
  if (user.role === UserRole.SUPER_ADMIN) {
    console.log("[DEBUG] Super Admin access granted");
    return <>{children}</>; // المشرف العام يمكنه الوصول إلى أي مسار
  }
  
  // التحقق من الدور المطلوب
  if (user.role === role) {
    console.log(`[DEBUG] Access granted to ${role}`);
    return <>{children}</>; // المستخدم لديه الدور المطلوب
  }
  
  // في هذه المرحلة، المستخدم ليس لديه الدور المطلوب
  console.log(`[DEBUG] Access denied: User role ${user.role} doesn't match required role ${role}`);
  
  // إعداد رسالة مخصصة بناءً على دور المستخدم والمسار المطلوب
  let errorMessage = "";
  let recommendedPath = "";
  
  switch(user.role) {
    case UserRole.CUSTOMER:
      errorMessage = "ليس لديك صلاحيات للوصول إلى لوحة تحكم المسؤولين.";
      recommendedPath = "/customer";
      break;
    case UserRole.PROPERTY_ADMIN:
      errorMessage = "ليس لديك صلاحيات للوصول إلى هذا المسار.";
      recommendedPath = "/property-admin";
      break;
    default:
      errorMessage = "ليس لديك الصلاحيات المطلوبة للوصول إلى هذه الصفحة.";
      recommendedPath = "/";
  }
  
  // حفظ رسالة الخطأ في sessionStorage لعرضها في صفحة غير مصرح
  sessionStorage.setItem('authErrorMessage', errorMessage);
  sessionStorage.setItem('recommendedPath', recommendedPath);
  
  return <Redirect to="/unauthorized" />;
}