// ✅ RouteGuard.tsx — مكون حماية المسارات باستخدام الصلاحيات
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

interface RouteGuardProps {
  children: React.ReactNode;
  role: string;
}

export default function RouteGuard({ children, role }: RouteGuardProps) {
  const { user, role: userRole, loading } = useAuth();

  // عرض حالة التحميل
  if (loading) {
    return <div className="text-white text-center mt-10">⏳ جاري التحقق من الوصول...</div>;
  }

  // التوجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مسجل
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // السماح للمشرف العام بالوصول إلى جميع المسارات
  if (userRole === "SUPER_ADMIN") {
    return <>{children}</>;
  }

  // توجيه المستخدمين غير المصرح لهم
  if (!userRole || userRole !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // عرض المحتوى إذا كان المستخدم مصرح له
  return <>{children}</>;
}