import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Link, useLocation } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  BellIcon, 
  PanelLeftOpen, 
  Settings,
  MessageSquare,
  Bell,
  Search,
  User,
  Menu,
  Home,
  Building,
  PackageOpen,
  Info,
  LogOut,
  CalendarCheck,
  Heart,
  UserCircle,
  PieChart,
  DollarSign as CircleDollarSign
} from "lucide-react";

interface SmartHeaderProps {
  role?: "CUSTOMER" | "PROPERTY_ADMIN" | "SUPER_ADMIN";
}

export default function SmartHeader({ role }: SmartHeaderProps) {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // تحديد ما إذا كنا في الواجهة العامة أو في لوحة التحكم
  const isPublicPage = !location.pathname.includes('admin') && 
                      !location.pathname.includes('customer') && 
                      !location.pathname.includes('property-admin') &&
                      !location.pathname.includes('super-admin');
  
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
  
  // تحديد خيارات القائمة والروابط اعتمادًا على نوع المستخدم
  const renderNavLinks = () => {
    // روابط الصفحات العامة - متاحة دائمًا
    const publicLinks = (
      <>
        <Link to="/" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
          <Home size={16} className="inline-block" />
          <span>الصفحة الرئيسية</span>
        </Link>
        <Link to="/properties" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
          <Building size={16} className="inline-block" />
          <span>العقارات</span>
        </Link>
        <Link to="/services" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
          <PackageOpen size={16} className="inline-block" />
          <span>الخدمات</span>
        </Link>
        <Link to="/about" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
          <Info size={16} className="inline-block" />
          <span>عن التطبيق</span>
        </Link>
      </>
    );

    // الروابط الخاصة بكل دور
    let roleLinks = null;
    
    if (user && !isMobile) {
      // تحديد الروابط حسب دور المستخدم
      switch (user.role) {
        case "SUPER_ADMIN":
          roleLinks = (
            <>
              <Link to="/super-admin" className="text-[#39FF14] hover:text-[#50FF30] transition-colors duration-300 font-medium border-r border-gray-700 pr-4 mr-4 flex items-center gap-1.5">
                <PanelLeftOpen size={16} className="inline-block" />
                <span>لوحة تحكم المدير</span>
              </Link>
              <Link to="/super-admin/users" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
                <User size={16} className="inline-block" />
                <span>المستخدمين</span>
              </Link>
              <Link to="/super-admin/properties" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
                <Building size={16} className="inline-block" />
                <span>العقارات</span>
              </Link>
              <Link to="/super-admin/bookings" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
                <CalendarCheck size={16} className="inline-block" />
                <span>الحجوزات</span>
              </Link>
              <Link to="/super-admin/revenue" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
                <CircleDollarSign size={16} className="inline-block" />
                <span>الإيرادات</span>
              </Link>
            </>
          );
          break;
        
        case "PROPERTY_ADMIN":
          roleLinks = (
            <>
              <Link to="/property-admin" className="text-[#39FF14] hover:text-[#50FF30] transition-colors duration-300 font-medium border-r border-gray-700 pr-4 mr-4 flex items-center gap-1.5">
                <PanelLeftOpen size={16} className="inline-block" />
                <span>لوحة تحكم المالك</span>
              </Link>
              <Link to="/property-admin/properties" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
                <Building size={16} className="inline-block" />
                <span>عقاراتي</span>
              </Link>
              <Link to="/property-admin/bookings" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
                <CalendarCheck size={16} className="inline-block" />
                <span>الحجوزات</span>
              </Link>
              <Link to="/property-admin/analytics" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
                <PieChart size={16} className="inline-block" />
                <span>الإحصائيات</span>
              </Link>
            </>
          );
          break;
          
        case "CUSTOMER":
          roleLinks = (
            <>
              <Link to="/customer" className="text-[#39FF14] hover:text-[#50FF30] transition-colors duration-300 font-medium border-r border-gray-700 pr-4 mr-4 flex items-center gap-1.5">
                <PanelLeftOpen size={16} className="inline-block" />
                <span>لوحة تحكم العميل</span>
              </Link>
              <Link to="/customer/bookings" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
                <CalendarCheck size={16} className="inline-block" />
                <span>حجوزاتي</span>
              </Link>
              <Link to="/customer/favorites" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
                <Heart size={16} className="inline-block" />
                <span>المفضلة</span>
              </Link>
              <Link to="/customer/profile" className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5">
                <UserCircle size={16} className="inline-block" />
                <span>حسابي</span>
              </Link>
            </>
          );
          break;
        
        default:
          break;
      }
    }
    
    // عرض القائمة المناسبة حسب حالة المستخدم ونوع الصفحة
    return (
      <div className="hidden md:flex items-center gap-4">
        {/* دائمًا نعرض روابط لوحة التحكم أولاً إذا كان المستخدم مسجل الدخول */}
        {roleLinks}
        
        {/* عرض الروابط العامة إذا كنا في الصفحة العامة أو لم يكن هناك روابط خاصة بالدور */}
        {(isPublicPage || !roleLinks) && publicLinks}
      </div>
    );
  };
  
  // زر القائمة المنسدلة أو زر الإشعارات للواجهة المتوافقة مع الأجهزة المحمولة
  const renderMobileControls = () => {
    // نعرض هذه الأزرار فقط في لوحات التحكم
    if (!isPublicPage && isMobile) {
      return (
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <Bell size={18} className="text-[#39FF14]" />
            {/* رمز تنبيه (إذا كان هناك إشعارات جديدة) */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors md:hidden"
          >
            <Menu size={18} className="text-[#39FF14]" />
          </button>
        </div>
      );
    }
    
    return null;
  };

  // تصميم وإظهار الإشعارات
  const renderNotifications = () => {
    if (notificationsOpen) {
      return (
        <div className="absolute top-16 right-0 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-3 z-50">
          <h3 className="text-white font-bold border-b border-gray-800 pb-2 mb-2">الإشعارات</h3>
          <div className="max-h-60 overflow-y-auto">
            {/* محتوى الإشعارات */}
            <div className="p-2 hover:bg-gray-800 rounded transition-colors mb-2">
              <div className="text-sm text-white">تم تأكيد حجزك الجديد</div>
              <div className="text-xs text-gray-400">منذ 5 دقائق</div>
            </div>
            <div className="p-2 hover:bg-gray-800 rounded transition-colors mb-2">
              <div className="text-sm text-white">لديك رسالة جديدة</div>
              <div className="text-xs text-gray-400">منذ ساعة</div>
            </div>
            {/* إشعارات أخرى */}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-800 text-center">
            <Link to="/notifications" className="text-xs text-[#39FF14] hover:underline">عرض كل الإشعارات</Link>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || !isPublicPage ? "bg-gray-950/90 backdrop-blur-md shadow-md" : "bg-transparent"
    }`}>
      <div className="mx-auto px-6 py-4">
        <div className="flex justify-between items-center relative">
          {/* Logo with Neon Glow Effect */}
          <Link 
            to={user ? `/${user.role.toLowerCase().replace('_', '-')}` : "/"} 
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

          {/* Nav Links - Dynamic based on page/role */}
          {renderNavLinks()}

          {/* Mobile Controls - Only for dashboard */}
          {renderMobileControls()}

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user && !isMobile && (
              <div className="text-sm hidden md:block">
                <span className="text-gray-400">أهلاً،</span>{" "}
                <span className="text-white font-medium">{user.name || "مستخدم"}</span>{" "}
                <span className="text-[#39FF14] text-xs font-medium">
                  {user.role === "SUPER_ADMIN" && "مدير النظام"}
                  {user.role === "PROPERTY_ADMIN" && "مدير عقارات"}
                  {user.role === "CUSTOMER" && "عميل"}
                </span>
              </div>
            )}
            
            {user ? (
              !isMobile && (
                <div className="hidden md:flex items-center gap-2">
                  {/* زر الإشعارات للأجهزة المكتبية */}
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <Bell size={18} className="text-white" />
                    {/* رمز تنبيه (إذا كان هناك إشعارات جديدة) */}
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  
                  {/* زر البحث للأجهزة المكتبية */}
                  <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                    <Search size={18} className="text-white" />
                  </button>
                  
                  {/* زر تسجيل الخروج */}
                  <button 
                    onClick={handleLogout}
                    className="relative group overflow-hidden ml-2"
                  >
                    <span className="relative z-10 px-4 py-2 inline-block bg-black text-[#39FF14] rounded-lg border border-[#39FF14]/50 group-hover:border-[#39FF14] transition-colors flex items-center gap-1.5">
                      <LogOut size={16} className="inline-block" />
                      <span>تسجيل الخروج</span>
                    </span>
                    <div className="absolute inset-0 bg-[#39FF14]/10 blur group-hover:bg-[#39FF14]/20 rounded-lg transition-colors"></div>
                  </button>
                </div>
              )
            ) : (
              isPublicPage && (
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
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Notifications dropdown */}
      {renderNotifications()}
    </header>
  );
}