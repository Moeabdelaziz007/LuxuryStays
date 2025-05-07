import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { SpaceButton } from "@/components/ui/space-button";
import { useAuth } from "@/contexts/auth-context";
import type { AuthContextType } from "@/contexts/auth-context";

/**
 * مكون تنقل متجاوب موحد للتطبيق
 * يتكيف مع جميع أحجام الشاشات بشكل انسيابي
 */
export default function ResponsiveNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPath] = useLocation();
  const { user, isAuthenticated, loading, logout } = useAuth();
  
  // تغيير حالة التمرير للشريط العلوي
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // إغلاق القائمة عند تغيير المسار
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  return (
    <>
      {/* شريط التنقل العلوي - مشترك بين جميع أحجام الشاشات */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-black/80 backdrop-blur-md shadow-lg" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* شعار التطبيق */}
            <Link href="/" className="flex items-center">
              <div className="text-xl md:text-2xl font-bold flex items-center">
                <span className="text-[#39FF14] animate-neon-pulse">Stay</span>
                <span className="text-white">X</span>
              </div>
            </Link>

            {/* قائمة تنقل الشاشات الكبيرة - تظهر فقط على الأجهزة اللوحية والحواسيب */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <NavLink href="/" label="الرئيسية" currentPath={currentPath} />
              <NavLink href="/properties" label="العقارات" currentPath={currentPath} />
              <NavLink href="/services" label="الخدمات" currentPath={currentPath} />
              <NavLink href="/about" label="عن الشركة" currentPath={currentPath} />
              <NavLink href="/contact" label="تواصل معنا" currentPath={currentPath} />
              
              {/* عناصر خاصة بالمستخدمين المسجلين دخولهم */}
              {isAuthenticated && (
                <>
                  {user?.role === "SUPER_ADMIN" && (
                    <NavLink href="/admin" label="لوحة المشرف" currentPath={currentPath} />
                  )}
                  {user?.role === "PROPERTY_ADMIN" && (
                    <NavLink href="/property-admin" label="إدارة العقارات" currentPath={currentPath} />
                  )}
                  <NavLink href="/dashboard" label="لوحة التحكم" currentPath={currentPath} />
                </>
              )}
            </nav>

            {/* أزرار المستخدم - تسجيل الدخول/الخروج */}
            <div className="hidden md:flex items-center space-x-2">
              {loading ? (
                <div className="h-10 w-24 bg-gray-800 animate-pulse rounded-md"></div>
              ) : isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-300">
                    {user?.name || user?.email}
                  </div>
                  <SpaceButton 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                    className="text-sm py-1"
                  >
                    تسجيل الخروج
                  </SpaceButton>
                </div>
              ) : (
                <Link href="/login">
                  <SpaceButton 
                    variant="primary" 
                    size="sm"
                    className="text-sm py-1"
                  >
                    تسجيل الدخول
                  </SpaceButton>
                </Link>
              )}
            </div>

            {/* زر القائمة للأجهزة المحمولة - يظهر فقط على الشاشات الصغيرة */}
            <button 
              aria-label="فتح القائمة"
              className="md:hidden relative w-10 h-10 flex justify-center items-center rounded-md border border-gray-700 hover:border-[#39FF14]/50 focus:outline-none focus:ring-1 focus:ring-[#39FF14]/30 transition-colors space-circuit-pattern"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className={`hamburger-icon ${isOpen ? 'active' : ''}`}>
                <span className="line bg-[#39FF14]"></span>
                <span className="line bg-[#39FF14]"></span>
                <span className="line bg-[#39FF14]"></span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* قائمة تنقل الأجهزة المحمولة */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center text-center space-y-6">
            <MobileNavLink href="/" label="الرئيسية" setIsOpen={setIsOpen} />
            <MobileNavLink href="/properties" label="العقارات" setIsOpen={setIsOpen} />
            <MobileNavLink href="/services" label="الخدمات" setIsOpen={setIsOpen} />
            <MobileNavLink href="/about" label="عن الشركة" setIsOpen={setIsOpen} />
            <MobileNavLink href="/contact" label="تواصل معنا" setIsOpen={setIsOpen} />
            
            {/* القائمة الخاصة بالمستخدمين المسجل دخولهم */}
            {isAuthenticated && (
              <>
                {user?.role === "SUPER_ADMIN" && (
                  <MobileNavLink href="/admin" label="لوحة المشرف" setIsOpen={setIsOpen} />
                )}
                {user?.role === "PROPERTY_ADMIN" && (
                  <MobileNavLink href="/property-admin" label="إدارة العقارات" setIsOpen={setIsOpen} />
                )}
                <MobileNavLink href="/dashboard" label="لوحة التحكم" setIsOpen={setIsOpen} />
                
                <div className="pt-4 border-t border-gray-800 w-48 mx-auto mt-4">
                  <button 
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="py-2 px-4 text-white bg-gray-800 hover:bg-red-700/30 rounded-md transition"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </>
            )}
            
            {/* زر تسجيل الدخول للمستخدمين غير المسجلين */}
            {!isAuthenticated && !loading && (
              <div className="pt-6 border-t border-gray-800 w-48 mx-auto mt-4">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <SpaceButton 
                    variant="primary"
                    className="w-full"
                  >
                    تسجيل الدخول
                  </SpaceButton>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* زر إغلاق القائمة */}
        <button 
          aria-label="إغلاق القائمة"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800"
          onClick={() => setIsOpen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* طبقة لتعويض ارتفاع الشريط العلوي - لمنع تداخل المحتوى */}
      <div className="h-16 md:h-20"></div>
      
      {/* أنماط CSS مضافة ضمن ملفات التنميط الخارجية */}
    </>
  );
}

// مكون لعناصر التنقل على الشاشات الكبيرة
const NavLink = ({ href, label, currentPath }: { href: string; label: string; currentPath: string }) => {
  const isActive = currentPath === href || 
                   (href !== "/" && currentPath.startsWith(href));
  
  return (
    <Link href={href}>
      <a className={`relative px-3 py-2 rounded-md text-sm transition-colors ${
        isActive 
          ? "text-[#39FF14] bg-[#39FF14]/10" 
          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
      }`}>
        {label}
        {isActive && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#39FF14] transform origin-left mx-3"></span>
        )}
      </a>
    </Link>
  );
};

// مكون لعناصر التنقل على الأجهزة المحمولة
const MobileNavLink = ({ 
  href, 
  label, 
  setIsOpen 
}: { 
  href: string; 
  label: string; 
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <Link href={href}>
      <a 
        className="block w-full text-xl py-3 text-white hover:text-[#39FF14] transition-colors"
        onClick={() => setIsOpen(false)}
      >
        {label}
      </a>
    </Link>
  );
};