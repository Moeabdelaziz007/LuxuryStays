import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { FaLock, FaExclamationTriangle, FaHome, FaSignInAlt, FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string>("عذراً، أنت لا تملك الصلاحية للوصول إلى هذه الصفحة");
  const [recommendedPath, setRecommendedPath] = useState<string>("/");
  
  useEffect(() => {
    // استرجاع الرسائل المخزنة من RouteGuard
    const storedErrorMessage = sessionStorage.getItem('authErrorMessage');
    const storedRecommendedPath = sessionStorage.getItem('recommendedPath');
    
    if (storedErrorMessage) {
      setErrorMessage(storedErrorMessage);
      sessionStorage.removeItem('authErrorMessage');
    }
    
    if (storedRecommendedPath) {
      setRecommendedPath(storedRecommendedPath);
      sessionStorage.removeItem('recommendedPath');
    } else if (user) {
      // إذا لم يتم توفير مسار موصى به، حدد المسار بناءً على دور المستخدم
      switch(user.role) {
        case "CUSTOMER":
          setRecommendedPath("/customer");
          break;
        case "PROPERTY_ADMIN":
          setRecommendedPath("/property-admin");
          break;
        case "SUPER_ADMIN":
          setRecommendedPath("/super-admin");
          break;
        default:
          setRecommendedPath("/");
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-2xl shadow-lg text-center border border-gray-800">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-500/20 rounded-full">
            <FaExclamationTriangle className="h-10 w-10 text-red-500" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-[#39FF14] mb-6">غير مصرح بالوصول</h2>
        
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mb-6">
          <p className="text-lg">{errorMessage}</p>
        </div>
        
        {user ? (
          <div className="space-y-6">
            <div className="bg-gray-800/30 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between">
              <div className="text-left rtl:text-right mb-4 md:mb-0">
                <p className="text-sm text-gray-400">مرحباً،</p>
                <p className="text-lg font-medium">{user.name || user.email}</p>
              </div>
              
              <div className="flex items-center justify-center bg-gray-800 px-4 py-2 rounded-lg">
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-400">دور المستخدم:</span>
                  <span className="font-bold text-[#39FF14]">
                    {user.role === "CUSTOMER" && "عميل"}
                    {user.role === "PROPERTY_ADMIN" && "مدير عقارات"}
                    {user.role === "SUPER_ADMIN" && "مشرف عام"}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-[#39FF14] hover:bg-[#50FF30] text-black flex items-center gap-2"
              >
                <Link to={recommendedPath}>
                  <FaArrowLeft className="rtl:hidden" />
                  <FaHome className="h-4 w-4 mr-2" />
                  العودة إلى لوحة التحكم
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline"
              >
                <Link to="/">
                  <FaHome className="h-4 w-4 mr-2" />
                  الصفحة الرئيسية
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center p-4 bg-gray-800/50 rounded-lg">
              <FaLock className="h-5 w-5 mr-2 text-[#39FF14]" />
              <p>يجب تسجيل الدخول للوصول إلى هذه الصفحة</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="bg-[#39FF14] hover:bg-[#50FF30] text-black"
              >
                <Link to="/login">
                  <FaSignInAlt className="h-4 w-4 mr-2" />
                  تسجيل الدخول
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline"
              >
                <Link to="/">
                  <FaHome className="h-4 w-4 mr-2" />
                  العودة للصفحة الرئيسية
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}