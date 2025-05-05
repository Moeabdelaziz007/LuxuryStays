// ✅ RouteGuard.tsx — مكون حماية المسارات باستخدام الصلاحيات
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { getLocalUser } from "@/lib/local-auth";

interface RouteGuardProps {
  children: React.ReactNode;
  role: string;
}

export default function RouteGuard({ children, role }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);
  const [authUser, setAuthUser] = useState(user);

  // Check for local user as fallback
  useEffect(() => {
    if (!loading) {
      // If auth context loading is done, use that data
      setAuthUser(user);
      setLocalLoading(false);
      return;
    }

    // If loading is taking too long, check for local user
    const localUser = getLocalUser();
    if (localUser) {
      console.log("RouteGuard: Using local user as fallback", localUser);
      setAuthUser(localUser);
    }
    
    // Set a timeout to stop showing loading indefinitely
    const timeout = setTimeout(() => {
      setLocalLoading(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [user, loading]);

  // عرض حالة التحميل (مع حد زمني)
  if (loading && localLoading) {
    return <div className="text-white text-center mt-10">⏳ جاري التحقق من الوصول...</div>;
  }

  // التوجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مسجل
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // السماح للمشرف العام بالوصول إلى جميع المسارات
  if (authUser.role === "SUPER_ADMIN") {
    return <>{children}</>;
  }

  // توجيه المستخدمين غير المصرح لهم
  if (!authUser.role || authUser.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // عرض المحتوى إذا كان المستخدم مصرح له
  return <>{children}</>;
}