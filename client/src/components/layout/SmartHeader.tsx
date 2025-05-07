import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Link, useLocation } from "wouter";
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
  Facebook,
  DollarSign as CircleDollarSign
} from "lucide-react";

interface SmartHeaderProps {
  role?: "CUSTOMER" | "PROPERTY_ADMIN" | "SUPER_ADMIN" | "PUBLIC";
}

export default function SmartHeader({ role }: SmartHeaderProps) {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isMobile = useIsMobile();
  const [location] = useLocation();
  
  // تحديد ما إذا كنا في الواجهة العامة أو في لوحة التحكم
  const isPublicPage = location ? (
    !location.includes('admin') && 
    !location.includes('customer') && 
    !location.includes('property-admin') &&
    !location.includes('super-admin')
  ) : true; // إذا كان location غير محدد، فنفترض أننا في صفحة عامة
  
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
    // روابط الصفحات العامة - متاحة دائمًا ولكن فقط في الصفحات العامة
    const publicLinks = (
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" 
          className={`text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5 relative group ${location === '/' ? 'text-[#39FF14]' : ''}`}>
          <Home size={16} className="inline-block" />
          <span>الرئيسية</span>
          {location === '/' && <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] rounded-full shadow-[0_0_5px_#39FF14]"></div>}
          <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_0_5px_#39FF14]"></div>
        </Link>
        
        <Link to="/properties" 
          className={`text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5 relative group ${location === '/properties' ? 'text-[#39FF14]' : ''}`}>
          <Building size={16} className="inline-block" />
          <span>العقارات</span>
          {location === '/properties' && <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] rounded-full shadow-[0_0_5px_#39FF14]"></div>}
          <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_0_5px_#39FF14]"></div>
        </Link>
        
        <Link to="/services" 
          className={`text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5 relative group ${location === '/services' ? 'text-[#39FF14]' : ''}`}>
          <PackageOpen size={16} className="inline-block" />
          <span>الخدمات</span>
          {location === '/services' && <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] rounded-full shadow-[0_0_5px_#39FF14]"></div>}
          <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_0_5px_#39FF14]"></div>
        </Link>
        
        <Link to="/about" 
          className={`text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5 relative group ${location === '/about' ? 'text-[#39FF14]' : ''}`}>
          <Info size={16} className="inline-block" />
          <span>من نحن</span>
          {location === '/about' && <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] rounded-full shadow-[0_0_5px_#39FF14]"></div>}
          <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_0_5px_#39FF14]"></div>
        </Link>
        
        <a href="https://www.facebook.com/share/1L5CCr1JVD/?mibextid=wwXIfr" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white hover:text-[#39FF14] transition-colors duration-300 flex items-center gap-1.5 relative group">
          <Facebook size={16} className="inline-block" />
          <span>فيسبوك</span>
          <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_0_5px_#39FF14]"></div>
        </a>
      </div>
    );

    // الروابط الخاصة بكل دور (تم تبسيطها لتجنب التكرار مع الشريط الجانبي)
    let roleLinks = null;
    
    if (user && !isMobile) {
      // نعرض فقط رابط واحد للعودة إلى لوحة التحكم الرئيسية حسب دور المستخدم
      // بدون تكرار الروابط الفرعية التي موجودة بالفعل في الشريط الجانبي
      switch (user.role) {
        case "SUPER_ADMIN":
          roleLinks = (
            <Link to="/super-admin" className="text-[#39FF14] hover:text-[#50FF30] transition-colors duration-300 font-medium flex items-center gap-1.5 relative group">
              <PanelLeftOpen size={16} className="inline-block" />
              <span>لوحة تحكم المدير</span>
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_0_5px_#39FF14]"></div>
            </Link>
          );
          break;
        
        case "PROPERTY_ADMIN":
          roleLinks = (
            <Link to="/property-admin" className="text-[#39FF14] hover:text-[#50FF30] transition-colors duration-300 font-medium flex items-center gap-1.5 relative group">
              <PanelLeftOpen size={16} className="inline-block" />
              <span>لوحة تحكم المالك</span>
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_0_5px_#39FF14]"></div>
            </Link>
          );
          break;
          
        case "CUSTOMER":
          roleLinks = (
            <Link to="/customer" className="text-[#39FF14] hover:text-[#50FF30] transition-colors duration-300 font-medium flex items-center gap-1.5 relative group">
              <PanelLeftOpen size={16} className="inline-block" />
              <span>لوحة تحكم العميل</span>
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#39FF14] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full shadow-[0_0_5px_#39FF14]"></div>
            </Link>
          );
          break;
        
        default:
          break;
      }
    }
    
    // عرض القائمة المناسبة حسب حالة المستخدم ونوع الصفحة
    return (
      <div className="hidden md:flex items-center gap-6">
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
    if (isMobile) {
      return (
        <div className="flex items-center gap-3 md:hidden">
          {!isPublicPage && (
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-full bg-black/40 backdrop-blur-md border border-[#39FF14]/20 hover:border-[#39FF14]/50 transition-colors"
            >
              <Bell size={18} className="text-[#39FF14]" />
              {/* رمز تنبيه (إذا كان هناك إشعارات جديدة) */}
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          )}
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-[#39FF14]/20 hover:border-[#39FF14]/50 transition-colors"
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
        <div className="absolute top-16 right-0 w-80 bg-black/90 backdrop-blur-xl border border-[#39FF14]/30 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] p-4 z-50">
          <h3 className="text-white font-bold border-b border-[#39FF14]/20 pb-2 mb-3 flex items-center">
            <Bell size={16} className="text-[#39FF14] mr-2" />
            الإشعارات
          </h3>
          <div className="max-h-60 overflow-y-auto">
            {/* محتوى الإشعارات */}
            <div className="p-3 hover:bg-[#39FF14]/5 rounded-lg transition-colors mb-2 border border-[#39FF14]/10">
              <div className="text-sm text-white font-medium">تم تأكيد حجزك الجديد</div>
              <div className="text-xs text-gray-400 mt-1">منذ 5 دقائق</div>
            </div>
            <div className="p-3 hover:bg-[#39FF14]/5 rounded-lg transition-colors mb-2 border border-[#39FF14]/10">
              <div className="text-sm text-white font-medium">لديك رسالة جديدة</div>
              <div className="text-xs text-gray-400 mt-1">منذ ساعة</div>
            </div>
            {/* إشعارات أخرى */}
          </div>
          <div className="mt-3 pt-2 border-t border-[#39FF14]/20 text-center">
            <Link to="/notifications" className="text-xs text-[#39FF14] hover:underline">عرض كل الإشعارات</Link>
          </div>
        </div>
      );
    }
    
    return null;
  };

  // تصميم وإظهار القائمة المتحركة للأجهزة المحمولة
  const renderMobileMenu = () => {
    if (mobileMenuOpen) {
      const mobilePrimaryLinks = [
        { to: '/', label: 'الرئيسية', icon: <Home size={20} /> },
        { to: '/properties', label: 'العقارات', icon: <Building size={20} /> },
        { to: '/services', label: 'الخدمات', icon: <PackageOpen size={20} /> },
        { to: '/about', label: 'من نحن', icon: <Info size={20} /> },
      ];
      
      const dashboardLink = user ? (
        {
          to: `/${user.role.toLowerCase().replace('_', '-')}`,
          label: 'لوحة التحكم',
          icon: <PanelLeftOpen size={20} className="text-[#39FF14]" />
        }
      ) : null;
      
      return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col">
          {/* قائمة الهاتف الجوال */}
          <div className="py-4 px-6 flex justify-between items-center border-b border-[#39FF14]/20">
            {/* الشعار */}
            <div className="text-2xl font-bold">
              <span className="text-[#39FF14]">Stay</span>
              <span className="text-white">X</span>
            </div>
            
            {/* زر الإغلاق */}
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full bg-[#39FF14]/10 hover:bg-[#39FF14]/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#39FF14]">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* روابط القائمة */}
          <div className="flex-1 overflow-y-auto py-4 px-6">
            {user && (
              <div className="mb-6 border-b border-[#39FF14]/20 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#39FF14]/10 flex items-center justify-center">
                    <UserCircle size={24} className="text-[#39FF14]" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{user.name || "مستخدم"}</div>
                    <div className="text-xs text-[#39FF14]">
                      {user.role === "SUPER_ADMIN" && "مدير النظام"}
                      {user.role === "PROPERTY_ADMIN" && "مدير عقارات"}
                      {user.role === "CUSTOMER" && "عميل"}
                    </div>
                  </div>
                </div>
                
                {dashboardLink && (
                  <Link 
                    to={dashboardLink.to}
                    className="flex items-center gap-2 p-3 rounded-lg bg-[#39FF14]/10 hover:bg-[#39FF14]/20 transition-colors text-white mb-2 w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {dashboardLink.icon}
                    <span>{dashboardLink.label}</span>
                  </Link>
                )}
                
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-red-900/20 hover:bg-red-900/30 transition-colors text-white w-full"
                >
                  <LogOut size={20} className="text-red-400" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            )}
            
            <div className="space-y-2">
              {mobilePrimaryLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.to}
                  className={`flex items-center gap-3 p-4 rounded-lg hover:bg-[#39FF14]/10 transition-colors ${location === link.to ? 'text-[#39FF14] bg-[#39FF14]/5 border-r-2 border-[#39FF14]' : 'text-white'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              
              {/* رابط الفيسبوك */}
              <a 
                href="https://www.facebook.com/share/1L5CCr1JVD/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-[#39FF14]/10 transition-colors text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Facebook size={20} />
                <span className="font-medium">فيسبوك</span>
              </a>
            </div>
            
            {!user && (
              <div className="mt-8 space-y-3 border-t border-[#39FF14]/20 pt-6">
                <Link 
                  to="/login"
                  className="flex items-center justify-center gap-2 p-3 rounded-lg border border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogOut size={18} className="transform rotate-180" />
                  <span className="font-medium">تسجيل الدخول</span>
                </Link>
                
                <Link 
                  to="/signup"
                  className="flex items-center justify-center gap-2 p-3 rounded-lg bg-[#39FF14] text-black hover:bg-[#39FF14]/90 transition-colors w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} />
                  <span className="font-medium">إنشاء حساب</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || !isPublicPage 
        ? "bg-black/80 backdrop-blur-xl shadow-md border-b border-[#39FF14]/10" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center relative">
          {/* Logo with Neon Glow Effect */}
          <Link 
            to={user ? `/${user.role.toLowerCase().replace('_', '-')}` : "/"} 
            className="relative group"
            title={user ? "الذهاب إلى لوحة التحكم" : "الصفحة الرئيسية"}
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
                    className="relative p-2 rounded-full bg-black/40 backdrop-blur-md border border-[#39FF14]/20 hover:border-[#39FF14]/50 transition-colors"
                  >
                    <Bell size={18} className="text-white" />
                    {/* رمز تنبيه (إذا كان هناك إشعارات جديدة) */}
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  
                  {/* زر البحث للأجهزة المكتبية */}
                  <button className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-[#39FF14]/20 hover:border-[#39FF14]/50 transition-colors">
                    <Search size={18} className="text-white" />
                  </button>
                  
                  {/* زر تسجيل الخروج */}
                  <button 
                    onClick={handleLogout}
                    className="relative group overflow-hidden ml-2"
                  >
                    <span className="relative z-10 px-4 py-2 inline-block bg-black/60 backdrop-blur-md text-[#39FF14] rounded-lg border border-[#39FF14]/50 group-hover:border-[#39FF14] group-hover:bg-black/80 transition-all duration-300 flex items-center gap-1.5">
                      <LogOut size={16} className="inline-block" />
                      <span>تسجيل الخروج</span>
                    </span>
                    <div className="absolute inset-0 bg-[#39FF14]/10 blur group-hover:bg-[#39FF14]/20 rounded-lg transition-colors duration-300"></div>
                  </button>
                </div>
              )
            ) : (
              isPublicPage && !isMobile && (
                <div className="hidden md:flex gap-3">
                  <Link 
                    to="/login" 
                    className="relative group overflow-hidden"
                  >
                    <span className="relative z-10 px-4 py-2 inline-block rounded-lg bg-black/60 backdrop-blur-md text-[#39FF14] border border-[#39FF14]/50 group-hover:border-[#39FF14] group-hover:bg-black/80 transition-all duration-300 flex items-center gap-1.5">
                      <LogOut size={16} className="inline-block transform rotate-180" />
                      <span>تسجيل الدخول</span>
                    </span>
                    <div className="absolute inset-0 bg-[#39FF14]/10 blur group-hover:bg-[#39FF14]/20 rounded-lg transition-colors duration-300"></div>
                  </Link>

                  <Link 
                    to="/signup" 
                    className="relative group overflow-hidden"
                  >
                    <span className="relative z-10 px-4 py-2 inline-block rounded-lg bg-[#39FF14] text-black font-medium transform group-hover:scale-[1.03] transition-transform duration-300 flex items-center gap-1.5">
                      <User size={16} className="inline-block" />
                      <span>إنشاء حساب</span>
                    </span>
                    <div className="absolute inset-0 bg-[#39FF14] blur-sm opacity-50 group-hover:opacity-70 rounded-lg transition-opacity duration-300"></div>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Notifications dropdown */}
      {renderNotifications()}
      
      {/* Mobile Menu */}
      {renderMobileMenu()}
      
      {/* Decorative header element - horizontal line with glow */}
      {isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#39FF14]/30 to-transparent"></div>
      )}
    </header>
  );
}