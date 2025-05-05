import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md shadow-lg text-center">
        <h2 className="text-3xl font-bold text-green-400 mb-6">⚠️ غير مصرح بالوصول</h2>
        <p className="mb-6 text-lg">
          عذراً، أنت لا تملك الصلاحية للوصول إلى هذه الصفحة
        </p>
        
        {user ? (
          <div className="space-y-4">
            <p className="text-sm">
              أنت مسجل الدخول كـ <span className="font-bold text-green-400">{user.email}</span>
            </p>
            <p className="text-sm">
              دور المستخدم: <span className="font-bold text-green-400">{user.role}</span>
            </p>
            <Link to="/" className="block mt-6 bg-green-400 text-black font-bold py-2 px-4 rounded hover:scale-105">
              العودة للصفحة الرئيسية
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm">يرجى تسجيل الدخول للمتابعة</p>
            <Link to="/login" className="block mt-6 bg-green-400 text-black font-bold py-2 px-4 rounded hover:scale-105">
              تسجيل الدخول
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}