import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
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
  BookOpenCheck,
  Menu,
  Globe,
  LogOut,
  ChevronUp
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

export default function MobileNavigation() {
  const { user, logout } = useAuth();
  const [currentPath] = useLocation();
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  if (!user) return null; // Don't show for unauthenticated users
  
  // تعريف عناصر التنقل للمشرف العام
  const superAdminItems: NavItem[] = [
    // قسم لوحة التحكم
    { to: '/super-admin', label: 'نظرة عامة', icon: <PanelLeftOpen size={20} />, section: 'dashboard' },
    { to: '/super-admin/users', label: 'المستخدمين', icon: <Users size={20} />, section: 'dashboard' },
    { to: '/super-admin/properties', label: 'العقارات', icon: <Building2 size={20} />, section: 'dashboard' },
    { to: '/super-admin/bookings', label: 'الحجوزات', icon: <Calendar size={20} />, section: 'dashboard' },
    { to: '/super-admin/revenue', label: 'الإيرادات', icon: <CircleDollarSign size={20} />, section: 'dashboard' },
    { to: '/super-admin/settings', label: 'الإعدادات', icon: <Settings size={20} />, section: 'dashboard' },
    
    // الصفحات العامة
    { to: '/', label: 'الرئيسية', icon: <Home size={20} />, section: 'public' },
    { to: '/properties', label: 'العقارات', icon: <Building2 size={20} />, section: 'public' },
    { to: '/services', label: 'الخدمات', icon: <BookOpenCheck size={20} />, section: 'public' },
  ];
  
  // تعريف عناصر التنقل لمدير العقارات
  const propertyAdminItems: NavItem[] = [
    { to: '/property-admin', label: 'لوحة التحكم', icon: <PanelLeftOpen size={20} />, section: 'dashboard' },
    { to: '/property-admin/properties', label: 'عقاراتي', icon: <Building2 size={20} />, section: 'dashboard' },
    { to: '/property-admin/bookings', label: 'الحجوزات', icon: <Calendar size={20} />, section: 'dashboard' },
    { to: '/property-admin/dashboard', label: 'الإحصائيات', icon: <BarChart size={20} />, section: 'dashboard' },
    { to: '/property-admin/profile', label: 'الملف', icon: <UserCircle size={20} />, section: 'dashboard' },
    
    // الصفحات العامة
    { to: '/', label: 'الرئيسية', icon: <Home size={20} />, section: 'public' },
    { to: '/properties', label: 'العقارات', icon: <Building2 size={20} />, section: 'public' },
    { to: '/services', label: 'الخدمات', icon: <BookOpenCheck size={20} />, section: 'public' },
  ];
  
  // تعريف عناصر التنقل للعميل
  const customerItems: NavItem[] = [
    { to: '/customer', label: 'لوحة التحكم', icon: <PanelLeftOpen size={20} />, section: 'dashboard' },
    { to: '/customer/bookings', label: 'حجوزاتي', icon: <Calendar size={20} />, section: 'dashboard' },
    { to: '/customer/favorites', label: 'المفضلة', icon: <BookOpenCheck size={20} />, section: 'dashboard' },
    { to: '/customer/profile', label: 'حسابي', icon: <UserCircle size={20} />, section: 'dashboard' },
    
    // الصفحات العامة
    { to: '/', label: 'الرئيسية', icon: <Home size={20} />, section: 'public' },
    { to: '/properties', label: 'العقارات', icon: <Building2 size={20} />, section: 'public' },
    { to: '/services', label: 'الخدمات', icon: <BookOpenCheck size={20} />, section: 'public' },
  ];
  
  // تحديد قائمة العناصر حسب دور المستخدم
  let navItems: NavItem[] = [];
  
  switch (user.role) {
    case 'SUPER_ADMIN':
      navItems = superAdminItems;
      break;
    case 'PROPERTY_ADMIN':
      navItems = propertyAdminItems;
      break;
    case 'CUSTOMER':
    default:
      navItems = customerItems;
      break;
  }
  
  // تحديد القسم النشط بناءً على المسار الحالي
  useEffect(() => {
    if (currentPath && (
      currentPath.includes('/super-admin') || 
      currentPath.includes('/property-admin') || 
      currentPath.includes('/customer')
    )) {
      setActiveSection('dashboard');
    } else {
      setActiveSection('public');
    }
  }, [currentPath]);
  
  // فلترة العناصر حسب القسم النشط
  const filteredItems = navItems
    .filter(item => item.section === activeSection)
    .slice(0, 4); // عرض 4 عناصر فقط للحفاظ على مساحة للزر الإضافي
  
  return (
    <>
      {/* شريط التنقل السفلي */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {filteredItems.map((item) => {
            const isActive = currentPath === item.to;
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
          
          {/* زر القائمة المنسدلة */}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center justify-center px-2 py-1 ${
              showMoreMenu ? 'text-[#39FF14]' : 'text-gray-400'
            }`}
          >
            <div className={showMoreMenu ? 'animate-pulse' : ''}>
              {showMoreMenu ? <ChevronUp size={20} /> : <Menu size={20} />}
            </div>
            <span className="text-[10px] mt-1">المزيد</span>
          </button>
        </div>
      </div>
      
      {/* القائمة المنسدلة للخيارات الإضافية */}
      {showMoreMenu && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 shadow-lg py-2 animate-slideUp">
          {/* زر تبديل بين لوحة التحكم والصفحات العامة */}
          <button
            onClick={() => setActiveSection(activeSection === 'dashboard' ? 'public' : 'dashboard')}
            className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:bg-gray-800"
          >
            <span className="flex items-center gap-2">
              {activeSection === 'dashboard' ? <Globe size={18} /> : <PanelLeftOpen size={18} />}
              <span>{activeSection === 'dashboard' ? 'الصفحات العامة' : 'لوحة التحكم'}</span>
            </span>
          </button>
          
          {/* عناصر إضافية يمكن إضافتها هنا */}
          <div className="h-px w-full bg-gray-800 my-1"></div>
          
          {/* زر تسجيل الخروج */}
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-3 text-red-400 hover:bg-gray-800"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
      
      {/* طبقة شفافة لإغلاق القائمة عند النقر خارجها */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 z-40 bg-black/50" 
          onClick={() => setShowMoreMenu(false)}
        ></div>
      )}
    </>
  );
}