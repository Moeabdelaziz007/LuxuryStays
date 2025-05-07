import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/auth-context';
import {
  FaBuilding,
  FaCalendarAlt,
  FaChartBar,
  FaUsersCog,
  FaCog,
  FaSignOutAlt,
  FaUserAlt,
  FaDollarSign,
  FaBell,
  FaLocationArrow,
  FaBars
} from 'react-icons/fa';

interface NewPropertyAdminLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

export default function NewPropertyAdminLayout({ children, activeTab = 'dashboard' }: NewPropertyAdminLayoutProps) {
  const { user, logout } = useAuth();
  const [_, navigate] = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // تعريف عناصر القائمة الجانبية
  const sidebarItems = [
    {
      name: 'لوحة التحكم',
      path: '/property-admin',
      icon: <FaChartBar className="w-4 h-4" />,
      id: 'dashboard'
    },
    {
      name: 'العقارات',
      path: '/property-admin/properties',
      icon: <FaBuilding className="w-4 h-4" />,
      id: 'properties'
    },
    {
      name: 'الحجوزات',
      path: '/property-admin/bookings',
      icon: <FaCalendarAlt className="w-4 h-4" />,
      id: 'bookings'
    },
    {
      name: 'العملاء',
      path: '/property-admin/customers',
      icon: <FaUsersCog className="w-4 h-4" />,
      id: 'customers'
    },
    {
      name: 'الإيرادات',
      path: '/property-admin/revenue',
      icon: <FaDollarSign className="w-4 h-4" />,
      id: 'revenue'
    },
    { 
      name: 'التحليلات',
      path: '/property-admin/analytics',
      icon: <FaChartBar className="w-4 h-4" />,
      id: 'analytics'
    },
    {
      name: 'التقويم',
      path: '/property-admin/calendar',
      icon: <FaCalendarAlt className="w-4 h-4" />,
      id: 'calendar'
    },
    {
      name: 'الإعدادات',
      path: '/property-admin/settings',
      icon: <FaCog className="w-4 h-4" />,
      id: 'settings'
    }
  ];

  // دالة للتحقق مما إذا كان العنصر نشطًا
  const isItemActive = (itemId: string) => {
    return activeTab === itemId;
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* شريط جانبي للشاشات الكبيرة */}
      <div className="hidden md:flex md:flex-col md:w-64 bg-gray-900 border-l border-gray-800">
        <div className="p-4 border-b border-gray-800 flex items-center justify-center">
          <Logo size="md" variant="neon" withText />
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link href={item.path} key={item.id}>
                <Button
                  variant={isItemActive(item.id) ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    isItemActive(item.id)
                      ? 'bg-[#39FF14] text-black hover:bg-[#39FF14]/90'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
            <Avatar>
              <AvatarImage src={user?.photoURL || ''} alt={user?.name || 'المستخدم'} />
              <AvatarFallback className="bg-[#39FF14]/20 text-[#39FF14]">
                {user?.name?.[0]?.toUpperCase() || 'م'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user?.name || 'مدير العقارات'}</div>
              <div className="text-xs text-gray-400">مدير عقارات</div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <FaSignOutAlt className="mr-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      {/* القائمة المنسدلة للجوال */}
      <Dialog open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>القائمة</DialogTitle>
            <DialogDescription>انتقل إلى القسم المطلوب.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1 py-2">
            {sidebarItems.map((item) => (
              <Link href={item.path} key={item.id}>
                <Button
                  variant={isItemActive(item.id) ? 'default' : 'ghost'}
                  className={`w-full justify-start ${
                    isItemActive(item.id)
                      ? 'bg-[#39FF14] text-black hover:bg-[#39FF14]/90'
                      : 'hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start mt-4 text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => {
              logout();
              navigate('/login');
              setIsMobileSidebarOpen(false);
            }}
          >
            <FaSignOutAlt className="mr-2 h-4 w-4" />
            تسجيل الخروج
          </Button>
        </DialogContent>
      </Dialog>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* شريط التنقل العلوي */}
        <div className="bg-gray-900 border-b border-gray-800 py-3 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <FaBars className="h-5 w-5" />
            </Button>
            <div className="md:hidden">
              <Logo size="sm" variant="neon" withText />
            </div>
            <h1 className="text-xl font-bold text-white hidden md:block">
              {sidebarItems.find((item) => isItemActive(item.id))?.name || 'لوحة التحكم'}
            </h1>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
              <FaBell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800 md:hidden">
              <FaUserAlt className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 overflow-y-auto bg-black/50 backdrop-blur-sm p-4">
          {children}
        </div>
      </div>

      {/* حوار الإعدادات */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>الإعدادات</DialogTitle>
            <DialogDescription>قم بتخصيص إعدادات حسابك.</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="account">
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger value="account">الحساب</TabsTrigger>
              <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
              <TabsTrigger value="preferences">التفضيلات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">معلومات الملف الشخصي</h4>
                <div className="rounded-md bg-gray-800 p-3">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Avatar>
                      <AvatarImage src={user?.photoURL || ''} alt={user?.name || 'المستخدم'} />
                      <AvatarFallback className="bg-[#39FF14]/20 text-[#39FF14]">
                        {user?.name?.[0]?.toUpperCase() || 'م'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user?.name || 'مدير العقارات'}</div>
                      <div className="text-xs text-gray-400">{user?.email || 'admin@stayx.com'}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-[#39FF14] text-black hover:bg-[#39FF14]/90">
                تحديث الملف الشخصي
              </Button>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">إعدادات الإشعارات</h4>
                <div className="rounded-md bg-gray-800 p-3 text-sm text-gray-400">
                  يمكنك تخصيص إعدادات الإشعارات هنا.
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">تفضيلات العرض</h4>
                <div className="rounded-md bg-gray-800 p-3 text-sm text-gray-400">
                  يمكنك تخصيص تفضيلات العرض هنا.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}