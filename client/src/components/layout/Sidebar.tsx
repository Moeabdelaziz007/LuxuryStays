import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

export default function Sidebar() {
  const { user } = useAuth();

  // Only show sidebar for logged in users
  if (!user) return null;

  return (
    <div className="h-full w-64 bg-gray-900 text-white border-r border-white/10 shadow-lg flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-green-400">StayX</h2>
        <p className="text-xs text-gray-400 mt-1">Luxury stays and services</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {/* Menu items based on user role */}
          {user.role === "SUPER_ADMIN" && (
            <>
              <Link to="/super-admin" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-green-400">
                لوحة التحكم
              </Link>
              <Link to="/super-admin/properties" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-green-400">
                العقارات
              </Link>
              <Link to="/super-admin/users" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-green-400">
                المستخدمين
              </Link>
            </>
          )}
          
          {user.role === "PROPERTY_ADMIN" && (
            <>
              <Link to="/property-admin" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-green-400">
                لوحة التحكم
              </Link>
              <Link to="/property-admin/properties" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-green-400">
                عقاراتي
              </Link>
              <Link to="/property-admin/bookings" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-green-400">
                الحجوزات
              </Link>
            </>
          )}
          
          {user.role === "CUSTOMER" && (
            <>
              <Link to="/customer" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-green-400">
                الرئيسية
              </Link>
              <Link to="/customer/bookings" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-green-400">
                حجوزاتي
              </Link>
              <Link to="/customer/profile" className="block px-3 py-2 rounded-md hover:bg-gray-800 hover:text-green-400">
                الملف الشخصي
              </Link>
            </>
          )}
        </nav>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-gray-400">
          <p>© {new Date().getFullYear()} StayX</p>
          <p>النسخة 1.0.0</p>
        </div>
      </div>
    </div>
  );
}