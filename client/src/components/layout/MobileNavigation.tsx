import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { 
  Home, 
  UserCircle, 
  Building2, 
  Settings, 
  Calendar, 
  PanelLeftOpen, 
  Users, 
  BarChart,
  CircleDollarSign,
  BookOpenCheck
} from 'lucide-react';

export default function MobileNavigation() {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) return null; // Don't show for unauthenticated users
  
  // Define navigation items based on user role
  // إضافة عناصر الصفحات العامة والتنقل المخصص حسب دور المستخدم
  const publicItems = [
    { to: '/', label: 'الرئيسية', icon: <Home size={20} /> },
    { to: '/properties', label: 'العقارات', icon: <Building2 size={20} /> },
    { to: '/services', label: 'الخدمات', icon: <BookOpenCheck size={20} /> },
  ];
  
  // عناصر التنقل الخاصة بكل دور
  let roleItems = [];
  
  switch (user.role) {
    case 'SUPER_ADMIN':
      roleItems = [
        { to: '/super-admin', label: 'لوحة التحكم', icon: <PanelLeftOpen size={20} /> },
        { to: '/super-admin/users', label: 'المستخدمين', icon: <Users size={20} /> },
        { to: '/super-admin/properties', label: 'إدارة العقارات', icon: <Building2 size={20} /> },
        { to: '/super-admin/bookings', label: 'الحجوزات', icon: <Calendar size={20} /> },
        { to: '/super-admin/revenue', label: 'الإيرادات', icon: <CircleDollarSign size={20} /> },
        { to: '/super-admin/settings', label: 'الإعدادات', icon: <Settings size={20} /> },
      ];
      break;
      
    case 'PROPERTY_ADMIN':
      roleItems = [
        { to: '/property-admin', label: 'لوحة التحكم', icon: <PanelLeftOpen size={20} /> },
        { to: '/property-admin/properties', label: 'عقاراتي', icon: <Building2 size={20} /> },
        { to: '/property-admin/bookings', label: 'الحجوزات', icon: <Calendar size={20} /> },
        { to: '/property-admin/dashboard', label: 'الإحصائيات', icon: <BarChart size={20} /> },
        { to: '/property-admin/profile', label: 'الملف', icon: <UserCircle size={20} /> },
      ];
      break;
      
    case 'CUSTOMER':
    default:
      roleItems = [
        { to: '/customer', label: 'لوحة التحكم', icon: <PanelLeftOpen size={20} /> },
        { to: '/customer/bookings', label: 'حجوزاتي', icon: <Calendar size={20} /> },
        { to: '/customer/favorites', label: 'المفضلة', icon: <BookOpenCheck size={20} /> },
        { to: '/customer/profile', label: 'حسابي', icon: <UserCircle size={20} /> },
      ];
      break;
  }
  
  // لضمان عدم تكرار العناصر والحفاظ على شريط واحد فقط لكل دور
  // سنستخدم فقط العناصر المرتبطة بدور المستخدم (بحد أقصى 5 عناصر)
  // بدون خلط مع الصفحات العامة لتجنب التكرار والالتباس
  
  // اختيار أهم 5 عناصر فقط للعرض في الشريط السفلي
  const navItems = roleItems.slice(0, 5);
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center px-2 py-1 ${
                isActive
                  ? 'text-[#39FF14]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className={`${isActive ? 'animate-pulse' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[#39FF14] rounded-full shadow-[0_0_5px_#39FF14,0_0_10px_#39FF14]"></span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}