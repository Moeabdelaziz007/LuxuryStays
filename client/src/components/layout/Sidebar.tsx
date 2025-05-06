import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import Logo from "@/components/Logo";
import { 
  Home, Settings, Users, ChevronRight, ChevronLeft, 
  BarChart3, Calendar, BookOpen, LogOut, Menu, X, 
  ShoppingBag, Heart, CreditCard, Bell, LayoutDashboard, 
  CircleUser
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  let links = [];
  
  if (user?.role === "CUSTOMER") {
    links = [
      { to: "/customer", icon: <Home className="h-5 w-5" />, label: "الرئيسية" },
      { to: "/customer/bookings", icon: <Calendar className="h-5 w-5" />, label: "الحجوزات" },
      { to: "/customer/favorites", icon: <Heart className="h-5 w-5" />, label: "المفضلة" },
      { to: "/customer/profile", icon: <Users className="h-5 w-5" />, label: "الملف الشخصي" },
      { to: "/customer/settings", icon: <Settings className="h-5 w-5" />, label: "الإعدادات" }
    ];
  } else if (user?.role === "PROPERTY_ADMIN") {
    links = [
      { to: "/property-admin", icon: <LayoutDashboard className="h-5 w-5" />, label: "لوحة التحكم" },
      { to: "/property-admin/properties", icon: <Home className="h-5 w-5" />, label: "العقارات" },
      { to: "/property-admin/bookings", icon: <BookOpen className="h-5 w-5" />, label: "الحجوزات" },
      { to: "/property-admin/calendar", icon: <Calendar className="h-5 w-5" />, label: "التقويم" },
      { to: "/property-admin/analytics", icon: <BarChart3 className="h-5 w-5" />, label: "التحليلات" },
      { to: "/property-admin/profile", icon: <Users className="h-5 w-5" />, label: "الملف الشخصي" },
      { to: "/property-admin/settings", icon: <Settings className="h-5 w-5" />, label: "الإعدادات" }
    ];
  } else if (user?.role === "SUPER_ADMIN") {
    links = [
      { to: "/super-admin", icon: <LayoutDashboard className="h-5 w-5" />, label: "لوحة التحكم" },
      { to: "/super-admin/users", icon: <Users className="h-5 w-5" />, label: "المستخدمين" },
      { to: "/super-admin/properties", icon: <Building className="h-5 w-5" />, label: "العقارات" },
      { to: "/super-admin/bookings", icon: <Calendar className="h-5 w-5" />, label: "الحجوزات" },
      { to: "/super-admin/services", icon: <ShoppingBag className="h-5 w-5" />, label: "الخدمات" },
      { to: "/super-admin/revenue", icon: <CreditCard className="h-5 w-5" />, label: "الإيرادات" },
      { to: "/super-admin/notifications", icon: <Bell className="h-5 w-5" />, label: "الإشعارات" },
      { to: "/super-admin/settings", icon: <Settings className="h-5 w-5" />, label: "الإعدادات" }
    ];
  }

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <aside 
      className={`${collapsed ? 'w-16' : 'w-64'} h-screen fixed bg-black border-r border-gray-800 text-white flex flex-col justify-between transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col">
        {/* Logo & toggle */}
        <div className={`py-5 border-b border-gray-800 flex ${collapsed ? 'justify-center' : 'px-5 justify-between'} items-center`}>
          {!collapsed && (
            <div className="flex-1">
              <Logo size="sm" withText={true} />
            </div>
          )}
          <button 
            onClick={toggleSidebar} 
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-[#39FF14]"
          >
            {collapsed ? 
              <ChevronRight className="h-5 w-5" /> : 
              <ChevronLeft className="h-5 w-5" />
            }
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-5">
          <ul className="space-y-1.5">
            {links.map((link) => {
              const isActive = location === link.to;
              return (
                <li key={link.to}>
                  <Link to={link.to}>
                    <div 
                      className={`flex items-center px-3 py-2.5 ${collapsed ? 'justify-center' : 'pr-6'} rounded-lg cursor-pointer
                      ${isActive 
                        ? 'sidebar-active-item bg-gradient-to-r from-[#39FF14]/10 to-[#39FF14]/5 text-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.1)]' 
                        : 'hover:bg-gray-800/80 hover:shadow-[0_0_5px_rgba(57,255,20,0.1)]'}`}
                    >
                      <div className={`${isActive ? 'text-[#39FF14] animate-pulse-subtle' : 'text-gray-400'} flex sidebar-icon-hover`}>
                        {link.icon}
                      </div>
                      {!collapsed && (
                        <span className={`ml-3 text-sm ${isActive ? 'font-medium' : 'font-normal'}`}>
                          {link.label}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      
      {/* Logout */}
      <div className={`p-5 border-t border-gray-800 mb-5 ${collapsed ? 'flex justify-center' : ''}`}>
        <button 
          onClick={logout} 
          className={`flex items-center ${!collapsed && 'w-full'} px-3 py-2.5 rounded-lg hover:bg-gray-800`}
        >
          <LogOut className="h-5 w-5 text-gray-400" />
          {!collapsed && <span className="ml-3 text-sm">تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}