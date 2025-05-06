import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/features/auth/types";

/**
 * صفحة للتصحيح تعرض معلومات التوجيه والحالة
 */
export default function RoutingDebugPage() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // المعلومات الحالية للجلسة والتوجيه
  const routingInfo = {
    currentPath: location.pathname,
    search: location.search,
    isAuthenticated: !!user,
    userRole: user?.role || "غير مسجل دخول",
    loading,
  };

  // الانتقال إلى لوحة التحكم المناسبة
  const goToDashboard = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    switch (user.role) {
      case UserRole.CUSTOMER:
        navigate("/customer");
        break;
      case UserRole.PROPERTY_ADMIN:
        navigate("/property-admin");
        break;
      case UserRole.SUPER_ADMIN:
        navigate("/super-admin");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900">
      <Card className="w-full max-w-2xl bg-black border-gray-800 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800">
          <CardTitle className="text-2xl text-center text-[#39FF14]">
            صفحة تصحيح التوجيه
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* معلومات الحالة الحالية */}
          <div className="rounded-lg bg-gray-900 p-4 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">حالة الجلسة والتوجيه</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">المسار الحالي:</span>
                <span className="font-mono text-[#39FF14]">{routingInfo.currentPath}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">بارامترات البحث:</span>
                <span className="font-mono text-[#39FF14]">{routingInfo.search || "لا يوجد"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">حالة المصادقة:</span>
                <span className="font-mono text-[#39FF14]">
                  {routingInfo.isAuthenticated ? "مسجل دخول" : "غير مسجل دخول"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">الدور:</span>
                <span className="font-mono text-[#39FF14]">{routingInfo.userRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">حالة التحميل:</span>
                <span className="font-mono text-[#39FF14]">
                  {routingInfo.loading ? "جاري التحميل..." : "تم التحميل"}
                </span>
              </div>
            </div>
            {user && (
              <div className="mt-4 p-2 bg-gray-800 rounded-lg">
                <h3 className="text-lg text-white">معلومات المستخدم</h3>
                <pre className="text-xs mt-2 text-gray-300 overflow-x-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* اختبار التوجيه */}
          <div className="rounded-lg bg-gray-900 p-4 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">اختبار التوجيه</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-[#39FF14]"
                onClick={() => navigate("/")}
              >
                الصفحة الرئيسية
              </Button>
              <Button
                variant="outline"
                className="border-[#39FF14]"
                onClick={goToDashboard}
              >
                انتقل إلى لوحة التحكم الخاصة بك
              </Button>
              <Button
                variant="outline"
                className="border-[#39FF14]"
                onClick={() => navigate("/customer")}
              >
                لوحة العميل
              </Button>
              <Button
                variant="outline"
                className="border-[#39FF14]"
                onClick={() => navigate("/property-admin")}
              >
                لوحة مدير العقارات
              </Button>
              <Button
                variant="outline"
                className="border-[#39FF14]"
                onClick={() => navigate("/super-admin")}
              >
                لوحة المشرف العام
              </Button>
              <Button
                variant="outline"
                className="border-[#39FF14]"
                onClick={() => navigate("/unauthorized")}
              >
                صفحة غير مصرح
              </Button>
            </div>
          </div>

          {/* حالة المصادقة */}
          <div className="rounded-lg bg-gray-900 p-4 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4">إدارة المصادقة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {!user ? (
                <>
                  <Button
                    variant="outline"
                    className="border-[#39FF14]"
                    onClick={() => navigate("/login")}
                  >
                    تسجيل الدخول
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#39FF14]"
                    onClick={() => navigate("/signup")}
                  >
                    تسجيل حساب جديد
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => logout()}
                  >
                    تسجيل الخروج
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/login?redirect=${encodeURIComponent('/customer')}`)}
                  >
                    اختبار إعادة التوجيه
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Link
              to="/"
              className="text-[#39FF14] hover:text-white transition-colors"
            >
              العودة إلى الصفحة الرئيسية
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}