import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function SmartHeader() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="bg-black text-white py-4 px-6 flex justify-between items-center shadow-md border-b border-white/10">
      <Link to="/" className="text-xl font-bold text-green-400">StayX 🔥</Link>

      <div className="flex items-center gap-4">
        {user && (
          <div className="text-sm text-white/80">
            👋 أهلاً، {user.name || "مستخدم"} <span className="text-green-400">({user.role})</span>
          </div>
        )}
        
        {user ? (
          <button 
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-md text-sm transition-colors"
          >
            تسجيل الخروج
          </button>
        ) : (
          <div className="flex gap-2">
            <Link 
              to="/login" 
              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-1 rounded-md text-sm transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link 
              to="/signup" 
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1 rounded-md text-sm transition-colors"
            >
              إنشاء حساب
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}