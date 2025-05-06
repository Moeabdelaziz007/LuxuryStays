import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function SmartHeader() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Track scroll position to add glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      } else {
        // If Firebase auth is not available, use local logout
        localStorage.removeItem('stayx_current_user');
        window.location.href = '/';
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-black/90 backdrop-blur-md" : "bg-transparent"
    }`}>
      <div className="mx-auto px-6 py-4">
        <div className="flex justify-between items-center relative">
          {/* Logo with Neon Glow Effect */}
          <Link 
            to="/" 
            className="relative group"
          >
            <span className="text-2xl font-bold inline-block transition-all">
              <span className="text-[#39FF14] animate-neon-pulse" 
                    style={{ textShadow: "0 0 5px rgba(57, 255, 20, 0.7), 0 0 10px rgba(57, 255, 20, 0.5)" }}>
                Stay
              </span>
              <span className="text-white group-hover:text-[#39FF14] transition-colors">X</span>
            </span>
            
            {/* Background glow effect */}
            <div className="absolute -inset-1 bg-[#39FF14]/20 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
          </Link>

          {/* Nav Links - Will show only on non-dashboard pages */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/#featured" className="text-white hover:text-[#39FF14] transition-colors duration-300">
              العقارات
            </Link>
            <Link to="/#services" className="text-white hover:text-[#39FF14] transition-colors duration-300">
              الخدمات
            </Link>
            <Link to="/#about" className="text-white hover:text-[#39FF14] transition-colors duration-300">
              عن التطبيق 
            </Link>
            <Link to="/debug" className="text-white hover:text-[#39FF14] transition-colors duration-300 bg-gray-900/50 px-2 py-1 rounded-md">
              تصحيح التوجيه
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm hidden md:block">
                <span className="text-gray-400">أهلاً،</span>{" "}
                <span className="text-white font-medium">{user.name || "مستخدم"}</span>{" "}
                <span className="text-[#39FF14] text-xs font-medium">({user.role})</span>
              </div>
            )}
            
            {user ? (
              <button 
                onClick={handleLogout}
                className="relative group overflow-hidden"
              >
                <span className="relative z-10 px-4 py-2 inline-block bg-black text-[#39FF14] rounded-lg border border-[#39FF14]/50 group-hover:border-[#39FF14] transition-colors">
                  تسجيل الخروج
                </span>
                <div className="absolute inset-0 bg-[#39FF14]/10 blur group-hover:bg-[#39FF14]/20 rounded-lg transition-colors"></div>
              </button>
            ) : (
              <div className="flex gap-3">
                <Link 
                  to="/login" 
                  className="relative group overflow-hidden"
                >
                  <span className="relative z-10 px-4 py-2 inline-block rounded-lg bg-black text-[#39FF14] border border-[#39FF14]/50 group-hover:border-[#39FF14] transition-colors">
                    تسجيل الدخول
                  </span>
                  <div className="absolute inset-0 bg-[#39FF14]/10 blur group-hover:bg-[#39FF14]/20 rounded-lg transition-colors"></div>
                </Link>

                <Link 
                  to="/signup" 
                  className="relative group overflow-hidden"
                >
                  <span className="relative z-10 px-4 py-2 inline-block rounded-lg bg-[#39FF14] text-black font-medium transform group-hover:scale-[1.03] transition-transform">
                    إنشاء حساب
                  </span>
                  <div className="absolute inset-0 bg-[#39FF14] blur-sm opacity-50 group-hover:opacity-70 rounded-lg transition-opacity"></div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}