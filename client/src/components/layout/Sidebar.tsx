import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import Logo from "@/components/Logo";
import { 
  Home, Settings, Users, ChevronRight, ChevronLeft, 
  BarChart3, Calendar, BookOpen, LogOut, Menu, X, 
  ShoppingBag, Heart, CreditCard, Bell, LayoutDashboard, 
  CircleUser, Building, Globe, AreaChart
} from "lucide-react";

// تعريف نوع عنصر القائمة
interface SidebarLink {
  to: string;
  icon: React.ReactNode;
  label: string;
  section?: string;
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("dashboard");
  
  // عناصر القائمة العامة
  const publicLinks: SidebarLink[] = [
    { to: "/", icon: <Home className="h-5 w-5" />, label: "الرئيسية", section: "public" },
    { to: "/properties", icon: <Building className="h-5 w-5" />, label: "العقارات", section: "public" },
    { to: "/services", icon: <ShoppingBag className="h-5 w-5" />, label: "الخدمات", section: "public" },
  ];
  
  // عناصر العميل - مرتبة حسب الأهمية
  const customerLinks: SidebarLink[] = [
    // القسم الرئيسي
    { to: "/customer", icon: <LayoutDashboard className="h-5 w-5" />, label: "لوحة التحكم", section: "dashboard" },
    { to: "/customer/bookings", icon: <Calendar className="h-5 w-5" />, label: "الحجوزات", section: "dashboard" },
    { to: "/customer/favorites", icon: <Heart className="h-5 w-5" />, label: "المفضلة", section: "dashboard" },
    { to: "/customer/profile", icon: <Users className="h-5 w-5" />, label: "الملف الشخصي", section: "dashboard" },
    { to: "/customer/settings", icon: <Settings className="h-5 w-5" />, label: "الإعدادات", section: "dashboard" },
  ];
  
  // عناصر مدير العقارات - مرتبة حسب الأهمية
  const propertyAdminLinks: SidebarLink[] = [
    // القسم الرئيسي
    { to: "/property-admin", icon: <LayoutDashboard className="h-5 w-5" />, label: "لوحة التحكم", section: "dashboard" },
    { to: "/property-admin/properties", icon: <Building className="h-5 w-5" />, label: "عقاراتي", section: "dashboard" },
    { to: "/property-admin/bookings", icon: <BookOpen className="h-5 w-5" />, label: "الحجوزات", section: "dashboard" },
    { to: "/property-admin/analytics", icon: <BarChart3 className="h-5 w-5" />, label: "التحليلات", section: "dashboard" },
    // عناصر أقل أهمية
    { to: "/property-admin/profile", icon: <Users className="h-5 w-5" />, label: "الملف الشخصي", section: "dashboard" },
    { to: "/property-admin/settings", icon: <Settings className="h-5 w-5" />, label: "الإعدادات", section: "dashboard" },
  ];
  
  // عناصر المشرف العام - مرتبة حسب الأهمية
  const superAdminLinks: SidebarLink[] = [
    // الصفحات الرئيسية
    { to: "/super-admin", icon: <LayoutDashboard className="h-5 w-5" />, label: "نظرة عامة", section: "dashboard" },
    { to: "/super-admin/users", icon: <Users className="h-5 w-5" />, label: "المستخدمين", section: "dashboard" },
    { to: "/super-admin/properties", icon: <Building className="h-5 w-5" />, label: "العقارات", section: "dashboard" },
    { to: "/super-admin/revenue", icon: <CreditCard className="h-5 w-5" />, label: "الإيرادات", section: "dashboard" },
    { to: "/super-admin/bookings", icon: <Calendar className="h-5 w-5" />, label: "الحجوزات", section: "dashboard" },
    // صفحات إضافية
    { to: "/super-admin/services", icon: <ShoppingBag className="h-5 w-5" />, label: "الخدمات", section: "dashboard" },
    { to: "/super-admin/analytics", icon: <AreaChart className="h-5 w-5" />, label: "التحليلات", section: "dashboard" },
    { to: "/super-admin/notifications", icon: <Bell className="h-5 w-5" />, label: "الإشعارات", section: "dashboard" },
    { to: "/super-admin/settings", icon: <Settings className="h-5 w-5" />, label: "الإعدادات", section: "dashboard" },
  ];

  // تحديد روابط القائمة بناءً على دور المستخدم
  let dashboardLinks: SidebarLink[] = [];
  let allLinks: SidebarLink[] = [];
  
  if (user?.role === "CUSTOMER") {
    dashboardLinks = customerLinks;
  } else if (user?.role === "PROPERTY_ADMIN") {
    dashboardLinks = propertyAdminLinks;
  } else if (user?.role === "SUPER_ADMIN") {
    dashboardLinks = superAdminLinks;
  }
  
  // دمج روابط لوحة التحكم مع الروابط العامة
  allLinks = [...dashboardLinks, ...publicLinks];
  
  // تحديد الروابط المعروضة بناءً على القسم المختار
  const displayedLinks = allLinks.filter(link => 
    link.section === expandedSection || link.section === undefined
  );
  
  // تبديل حالة الشريط الجانبي (مطوي/ممتد)
  const toggleSidebar = () => setCollapsed(!collapsed);
  
  // تبديل القسم (لوحة التحكم / العام)
  const toggleSection = () => {
    setExpandedSection(expandedSection === "dashboard" ? "public" : "dashboard");
  };
  
  // تأثير للتحقق من المسار الحالي وضبط القسم المناسب
  useEffect(() => {
    // تحديد القسم النشط بناءً على المسار
    const path = location || '';
    if (
      path.includes('/super-admin') || 
      path.includes('/property-admin') || 
      path.includes('/customer')
    ) {
      setExpandedSection("dashboard");
    } else if (
      path === '/' || 
      path.includes('/properties') || 
      path.includes('/services')
    ) {
      setExpandedSection("public");
    }
  }, [location]);
  
  return (
    <aside 
      className={`${collapsed ? 'w-16' : 'w-64'} h-screen fixed bg-black border-r border-gray-800 text-white flex flex-col justify-between transition-all duration-300 ease-in-out z-30`}
    >
      <div className="flex flex-col">
        {/* شعار وزر التبديل */}
        <div className={`py-4 border-b border-gray-800 flex ${collapsed ? 'justify-center' : 'px-5 justify-between'} items-center`}>
          {!collapsed && (
            <div className="flex-1">
              <Logo size="sm" withText={true} />
            </div>
          )}
          <button 
            onClick={toggleSidebar} 
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-[#39FF14] transition-all duration-300 hover:shadow-[0_0_8px_rgba(57,255,20,0.5)]"
          >
            {collapsed ? 
              <ChevronRight className="h-5 w-5 animate-pulse-subtle" /> : 
              <ChevronLeft className="h-5 w-5 animate-pulse-subtle" />
            }
          </button>
        </div>
        
        {/* زر تبديل القسم (لوحة التحكم / العام) */}
        {!collapsed && (
          <button 
            onClick={toggleSection}
            className="flex items-center justify-between px-6 py-3 transition-all duration-200 border-b border-gray-800/50 hover:bg-gray-900"
          >
            <div className="flex items-center">
              {expandedSection === "dashboard" ? (
                <>
                  <LayoutDashboard className="h-4 w-4 text-[#39FF14]" />
                  <span className="ml-2 text-sm font-medium">لوحة التحكم</span>
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 text-[#39FF14]" />
                  <span className="ml-2 text-sm font-medium">الصفحات العامة</span>
                </>
              )}
            </div>
            <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${expandedSection === "public" ? "rotate-90" : "rotate-0"}`} />
          </button>
        )}
        
        {/* عناصر القائمة */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {displayedLinks.map((link) => {
              const isActive = location === link.to;
              return (
                <li key={link.to}>
                  <Link to={link.to}>
                    <div 
                      className={`flex items-center px-3 py-2.5 ${collapsed ? 'justify-center' : ''} rounded-lg cursor-pointer transition-all duration-200
                      ${isActive 
                        ? 'sidebar-active-item text-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.15)]' 
                        : 'hover:bg-gray-800/80 hover:text-gray-100'}`}
                      onMouseEnter={() => setHoveredItem(link.to)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className={`flex items-center justify-center ${
                        isActive 
                          ? 'text-[#39FF14]' 
                          : hoveredItem === link.to 
                            ? 'text-gray-100' 
                            : 'text-gray-400'
                      } transition-all duration-200`}>
                        {link.icon}
                        {isActive && (
                          <span className="absolute right-0 h-8 w-1 bg-[#39FF14] rounded-r shadow-[0_0_8px_rgba(57,255,20,0.6)]" />
                        )}
                        {hoveredItem === link.to && !isActive && (
                          <span className="absolute right-0 h-8 w-0.5 bg-[#39FF14]/30 rounded-r" />
                        )}
                      </div>
                      {!collapsed && (
                        <span className={`ml-3 text-sm transition-all duration-200 ${
                          isActive 
                            ? 'font-medium text-[#39FF14]' 
                            : hoveredItem === link.to 
                              ? 'font-normal text-gray-100' 
                              : 'font-normal text-gray-400'
                        }`}>
                          {link.label}
                        </span>
                      )}
                      {isActive && !collapsed && (
                        <span className="absolute right-4 h-1.5 w-1.5 rounded-full bg-[#39FF14] shadow-[0_0_5px_rgba(57,255,20,0.8)]"></span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      
      {/* قسم أسفل الشريط الجانبي */}
      <div className="border-t border-gray-800 py-2">
        {/* زر تبديل القسم للشريط المطوي */}
        {collapsed && (
          <button 
            onClick={toggleSection}
            className="flex items-center justify-center w-full p-3 hover:bg-gray-800/80 transition-all duration-200 mb-1"
            title={expandedSection === "dashboard" ? "الصفحات العامة" : "لوحة التحكم"}
          >
            {expandedSection === "dashboard" ? (
              <Globe className="h-5 w-5 text-[#39FF14] animate-pulse-subtle" />
            ) : (
              <LayoutDashboard className="h-5 w-5 text-[#39FF14] animate-pulse-subtle" />
            )}
          </button>
        )}
        
        {/* زر تسجيل الخروج */}
        <div className={`p-2 ${collapsed ? 'flex justify-center' : ''}`}>
          <button 
            onClick={logout} 
            className={`
              flex items-center ${!collapsed && 'w-full justify-between'} px-3 py-2.5 rounded-lg
              hover:bg-gray-800/80 hover:shadow-[0_0_8px_rgba(239,68,68,0.2)]
              active:shadow-[0_0_5px_rgba(239,68,68,0.4)]
              transition-all duration-300
              group
            `}
          >
            <div className="flex items-center">
              <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors duration-300" />
              {!collapsed && (
                <span className="ml-3 text-sm text-gray-400 group-hover:text-gray-100 transition-colors duration-300">
                  تسجيل الخروج
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}