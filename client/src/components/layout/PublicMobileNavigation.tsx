import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  Building2,
  BookOpenCheck,
  MessageCircle,
  Info
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

/**
 * شريط تنقل للهاتف المحمول مخصص للصفحات العامة فقط
 * يعرض روابط للصفحات العامة الرئيسية في التطبيق
 */
export default function PublicMobileNavigation() {
  const [path] = useLocation();
  
  // الصفحات العامة فقط
  const publicItems: NavItem[] = [
    { to: '/', label: 'الرئيسية', icon: <Home size={20} /> },
    { to: '/properties', label: 'العقارات', icon: <Building2 size={20} /> },
    { to: '/services', label: 'الخدمات', icon: <BookOpenCheck size={20} /> },
    { to: '/about', label: 'حول', icon: <Info size={20} /> },
    { to: '/contact', label: 'اتصل بنا', icon: <MessageCircle size={20} /> },
  ];
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {publicItems.map((item) => {
          const isActive = path === item.to;
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