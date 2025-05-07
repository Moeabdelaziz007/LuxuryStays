import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FaBuilding, 
  FaCalendarAlt, 
  FaChartBar, 
  FaUsersCog, 
  FaCog, 
  FaCheckCircle, 
  FaMoneyBillWave,
  FaStar,
  FaMapMarkerAlt,
  FaPlusCircle,
  FaEye,
  FaBed,
  FaBath,
  FaHome,
  FaUserAlt,
  FaDollarSign
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import PropertyManagement from '@/features/properties/PropertyManagement';
import BookingCalendar from './BookingCalendar';
import PropertyAnalytics from './PropertyAnalytics';

export default function NewPropertyAdminDashboard({ activeTab = 'dashboard' }) {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useState(activeTab);
  
  // Synchronize with activeTab prop when it changes
  useEffect(() => {
    setSelectedTab(activeTab);
  }, [activeTab]);
  
  // جلب إحصائيات لوحة المعلومات
  const { data: dashboardStats } = useQuery({
    queryKey: ['dashboard-stats', user?.uid],
    queryFn: async () => {
      if (!user?.uid || !db) {
        return {
          propertiesCount: 0,
          bookingsCount: 0,
          totalEarnings: 0,
          reviewsCount: 0,
          activeBookings: 0,
          occupancyRate: 0
        };
      }
      
      try {
        // في الحالة الفعلية، ستقوم بجلب البيانات من Firestore
        // ولأغراض العرض، سنستخدم بيانات نموذجية
        
        return {
          propertiesCount: 5,
          bookingsCount: 28,
          totalEarnings: 12500,
          reviewsCount: 42,
          activeBookings: 12,
          occupancyRate: 78
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return {
          propertiesCount: 0,
          bookingsCount: 0,
          totalEarnings: 0,
          reviewsCount: 0,
          activeBookings: 0,
          occupancyRate: 0
        };
      }
    },
    enabled: !!user?.uid && !!db
  });
  
  // جلب آخر الحجوزات
  const { data: recentBookings = [] } = useQuery({
    queryKey: ['recent-bookings', user?.uid],
    queryFn: async () => {
      if (!user?.uid || !db) return [];
      
      try {
        // في الحالة الفعلية، ستقوم بجلب البيانات من Firestore
        // ولأغراض العرض، سنستخدم بيانات نموذجية
        
        return [
          {
            id: 'booking1',
            propertyName: 'فيلا المرجان الفاخرة',
            guestName: 'أحمد محمد',
            startDate: new Date('2025-06-10'),
            endDate: new Date('2025-06-15'),
            totalPrice: 1200,
            status: 'confirmed',
            createdAt: new Date('2025-05-01')
          },
          {
            id: 'booking2',
            propertyName: 'شقة البحر الأزرق',
            guestName: 'سارة أحمد',
            startDate: new Date('2025-06-20'),
            endDate: new Date('2025-06-25'),
            totalPrice: 850,
            status: 'pending',
            createdAt: new Date('2025-05-02')
          },
          {
            id: 'booking3',
            propertyName: 'شاليه النخيل',
            guestName: 'محمد علي',
            startDate: new Date('2025-07-05'),
            endDate: new Date('2025-07-10'),
            totalPrice: 1500,
            status: 'confirmed',
            createdAt: new Date('2025-05-03')
          }
        ];
      } catch (error) {
        console.error('Error fetching recent bookings:', error);
        return [];
      }
    },
    enabled: !!user?.uid && !!db
  });
  
  // جلب أحدث العقارات
  const { data: topProperties = [] } = useQuery({
    queryKey: ['top-properties', user?.uid],
    queryFn: async () => {
      if (!user?.uid || !db) return [];
      
      try {
        // في الحالة الفعلية، ستقوم بجلب البيانات من Firestore
        // ولأغراض العرض، سنستخدم بيانات نموذجية
        
        return [
          {
            id: 'prop1',
            name: 'فيلا المرجان الفاخرة',
            location: 'الرياض، السعودية',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&w=800&q=60',
            price: 350,
            rating: 4.8,
            bookings: 12,
            occupancyRate: 85,
            bedrooms: 4,
            bathrooms: 3,
            features: ['مسبح خاص', 'حديقة', 'موقف سيارات', 'واي فاي مجاني']
          },
          {
            id: 'prop2',
            name: 'شقة البحر الأزرق',
            location: 'دبي، الإمارات',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&w=800&q=60',
            price: 240,
            rating: 4.6,
            bookings: 8,
            occupancyRate: 72,
            bedrooms: 2,
            bathrooms: 2,
            features: ['إطلالة على البحر', 'مسبح مشترك', 'صالة رياضية', 'أمن 24 ساعة']
          },
          {
            id: 'prop3',
            name: 'شاليه النخيل',
            location: 'جدة، السعودية',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&w=800&q=60',
            price: 280,
            rating: 4.7,
            bookings: 10,
            occupancyRate: 80,
            bedrooms: 3,
            bathrooms: 2,
            features: ['شاطئ خاص', 'جاكوزي', 'شواء', 'تراس']
          }
        ];
      } catch (error) {
        console.error('Error fetching top properties:', error);
        return [];
      }
    },
    enabled: !!user?.uid && !!db
  });
  
  // وظيفة مساعدة لتحديد لون حالة الحجز
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 hover:bg-green-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  // وظيفة مساعدة لتحويل حالة الحجز إلى نص عربي
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'مؤكد';
      case 'pending':
        return 'قيد الانتظار';
      case 'cancelled':
        return 'ملغي';
      default:
        return 'غير معروف';
    }
  };
  
  // وظيفة مساعدة لتنسيق التاريخ بصيغة عربية
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // التبديل بين علامات التبويب
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    
    // التنقل إلى المسار المناسب
    const path = tab === 'dashboard' ? '/property-admin' : `/property-admin/${tab}`;
    navigate(path);
  };
  
  // عرض المحتوى المناسب بناءً على علامة التبويب المحددة
  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return (
          <>
            {/* بطاقات الإحصائيات */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-900 border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#39FF14]/10 rounded-bl-full"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">العقارات</CardTitle>
                    <FaBuilding className="text-[#39FF14] h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#39FF14]">{dashboardStats?.propertiesCount || 0}</div>
                  <p className="text-sm text-gray-400 mt-1">إجمالي العقارات المدارة</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#39FF14]/10 rounded-bl-full"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">الحجوزات النشطة</CardTitle>
                    <FaCalendarAlt className="text-[#39FF14] h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#39FF14]">
                    {dashboardStats?.activeBookings || 0} <span className="text-sm text-gray-400">/</span>{' '}
                    <span className="text-xl">{dashboardStats?.bookingsCount || 0}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">الحجوزات النشطة / الإجمالي</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#39FF14]/10 rounded-bl-full"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">الإيرادات</CardTitle>
                    <FaMoneyBillWave className="text-[#39FF14] h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#39FF14]">${dashboardStats?.totalEarnings || 0}</div>
                  <p className="text-sm text-gray-400 mt-1">إجمالي الإيرادات</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#39FF14]/10 rounded-bl-full"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">معدل الإشغال</CardTitle>
                    <FaCheckCircle className="text-[#39FF14] h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#39FF14]">{dashboardStats?.occupancyRate || 0}%</div>
                  <div className="mt-2">
                    <Progress value={dashboardStats?.occupancyRate || 0} className="h-2 bg-gray-800" indicatorClassName="bg-[#39FF14]" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* العقارات والحجوزات */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
              {/* العقارات الرائجة */}
              <div className="lg:col-span-4">
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-[#39FF14]">العقارات الرائجة</CardTitle>
                      <Link href="/property-admin/properties">
                        <Button variant="ghost" className="h-8 text-xs text-[#39FF14] hover:text-[#39FF14]/80 hover:bg-[#39FF14]/10">
                          عرض الكل
                        </Button>
                      </Link>
                    </div>
                    <CardDescription>
                      العقارات الأكثر حجزاً وتقييماً
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      {topProperties.map((property) => (
                        <div key={property.id} className="flex items-start space-x-4 rtl:space-x-reverse bg-gray-800/50 rounded-lg p-3">
                          <div className="w-20 h-20 overflow-hidden rounded-md flex-shrink-0">
                            <img 
                              src={property.image} 
                              alt={property.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">{property.name}</h4>
                            <div className="flex items-center text-sm text-gray-400 mt-1">
                              <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                              <span>{property.location}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <div className="flex items-center">
                                  <FaBed className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-400">{property.bedrooms}</span>
                                </div>
                                <div className="flex items-center">
                                  <FaBath className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-xs text-gray-400">{property.bathrooms}</span>
                                </div>
                              </div>
                              <div className="text-[#39FF14] font-medium">${property.price}/ليلة</div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center">
                                <FaStar className="h-3 w-3 text-yellow-500 mr-1" />
                                <span className="text-xs">{property.rating}/5 ({property.bookings} حجز)</span>
                              </div>
                              <div>
                                <Progress value={property.occupancyRate} className="h-1.5 w-20 bg-gray-700" indicatorClassName="bg-[#39FF14]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {topProperties.length === 0 && (
                        <div className="text-center py-8">
                          <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
                            <FaBuilding className="h-6 w-6 text-gray-500" />
                          </div>
                          <h4 className="text-gray-400 font-medium">لا توجد عقارات بعد</h4>
                          <p className="text-gray-500 text-sm mt-1">أضف عقارات جديدة لعرضها هنا</p>
                          <Button className="mt-4 bg-[#39FF14] text-black hover:bg-[#39FF14]/90">
                            <FaPlusCircle className="mr-2 h-4 w-4" />
                            إضافة عقار جديد
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  {topProperties.length > 0 && (
                    <CardFooter>
                      <Button className="w-full bg-[#39FF14] text-black hover:bg-[#39FF14]/90">
                        <FaPlusCircle className="mr-2 h-4 w-4" />
                        إضافة عقار جديد
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
              
              {/* آخر الحجوزات */}
              <div className="lg:col-span-3">
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-[#39FF14]">آخر الحجوزات</CardTitle>
                      <Link href="/property-admin/bookings">
                        <Button variant="ghost" className="h-8 text-xs text-[#39FF14] hover:text-[#39FF14]/80 hover:bg-[#39FF14]/10">
                          عرض الكل
                        </Button>
                      </Link>
                    </div>
                    <CardDescription>
                      الحجوزات الأخيرة على عقاراتك
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentBookings.map((booking: any) => (
                        <div key={booking.id} className="bg-gray-800/50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium text-white">{booking.guestName}</div>
                              <div className="text-sm text-gray-400">{booking.propertyName}</div>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusText(booking.status)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-400">من: <span className="text-white">{formatDate(booking.startDate)}</span></div>
                            <div className="text-gray-400">إلى: <span className="text-white">{formatDate(booking.endDate)}</span></div>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <div className="text-[#39FF14] font-medium">${booking.totalPrice}</div>
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                              <FaEye className="mr-1 h-3 w-3" />
                              التفاصيل
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {recentBookings.length === 0 && (
                        <div className="text-center py-8">
                          <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
                            <FaCalendarAlt className="h-6 w-6 text-gray-500" />
                          </div>
                          <h4 className="text-gray-400 font-medium">لا توجد حجوزات بعد</h4>
                          <p className="text-gray-500 text-sm mt-1">ستظهر الحجوزات الجديدة هنا</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* تحليلات الأداء */}
            <PropertyAnalytics />
          </>
        );
      case 'properties':
        return <PropertyManagement />;
        
      case 'bookings':
        return <BookingCalendar />;
        
      case 'customers':
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#39FF14]">إدارة العملاء</CardTitle>
              <CardDescription>عرض وإدارة العملاء وتفاصيل حجوزاتهم</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <FaUsersCog className="h-8 w-8 text-[#39FF14]/50" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">قائمة العملاء</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-6">
                  هنا يمكنك عرض جميع العملاء الذين قاموا بالحجز في عقاراتك، وإدارة تفاصيلهم وطلباتهم.
                </p>
                <Button className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90">
                  <FaUsersCog className="mr-2 h-4 w-4" />
                  عرض جميع العملاء
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'revenue':
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#39FF14]">تقارير الإيرادات</CardTitle>
              <CardDescription>تحليل مفصل للإيرادات والمدفوعات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <FaDollarSign className="h-8 w-8 text-[#39FF14]/50" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">تقارير الإيرادات</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-6">
                  هنا يمكنك عرض تقارير مفصلة عن الإيرادات والمدفوعات وتحليل الأداء المالي لعقاراتك.
                </p>
                <Button className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90">
                  <FaChartBar className="mr-2 h-4 w-4" />
                  عرض تقارير مفصلة
                </Button>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'analytics':
        return <PropertyAnalytics />;
        
      case 'calendar':
        return <BookingCalendar />;
        
      case 'settings':
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#39FF14]">إعدادات الحساب</CardTitle>
              <CardDescription>تخصيص إعدادات حسابك ونظام إدارة العقارات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2 flex items-center">
                    <FaUserAlt className="mr-2 h-4 w-4 text-[#39FF14]" />
                    معلومات الملف الشخصي
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">تحديث معلومات الملف الشخصي وإعدادات الحساب</p>
                  <Button variant="outline" className="border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10">
                    تعديل الملف الشخصي
                  </Button>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2 flex items-center">
                    <FaCog className="mr-2 h-4 w-4 text-[#39FF14]" />
                    إعدادات النظام
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">تخصيص إعدادات النظام وتفضيلات العرض</p>
                  <Button variant="outline" className="border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10">
                    تعديل الإعدادات
                  </Button>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2 flex items-center">
                    <FaBuilding className="mr-2 h-4 w-4 text-[#39FF14]" />
                    إعدادات العقارات
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">تخصيص إعدادات العقارات وقواعد الحجز</p>
                  <Button variant="outline" className="border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10">
                    تعديل إعدادات العقارات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#39FF14]">الصفحة غير موجودة</CardTitle>
              <CardDescription>عذراً، الصفحة التي تبحث عنها غير متوفرة.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Button 
                  className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
                  onClick={() => handleTabChange('dashboard')}
                >
                  العودة للوحة التحكم
                </Button>
              </div>
            </CardContent>
          </Card>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      {/* رسالة ترحيبية */}
      <div className="bg-gray-900/70 backdrop-blur-md rounded-xl p-6 border border-gray-800 relative overflow-hidden">
        {/* تأثيرات التوهج */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#39FF14]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 left-20 w-40 h-40 bg-[#39FF14]/10 rounded-full blur-2xl"></div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              مرحباً، <span className="text-[#39FF14]">{user?.name || "مدير العقارات"}</span>
            </h1>
            <p className="text-gray-400">
              إدارة عقاراتك في مكان واحد. قم بإضافة وتحديث العقارات وتابع الحجوزات ومراجعات العملاء بسهولة.
            </p>
          </div>
          
          <div className="flex justify-center md:justify-end gap-3">
            <Button className="bg-[#39FF14] hover:bg-[#39FF14]/90 text-black">
              <FaPlusCircle className="mr-2 h-4 w-4" />
              إضافة عقار
            </Button>
            <Button variant="outline" className="border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/10">
              <FaCalendarAlt className="mr-2 h-4 w-4" />
              الحجوزات
            </Button>
          </div>
        </div>
      </div>
      
      {/* علامات التبويب */}
      <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-gray-900 border-b border-gray-800 w-full justify-start rounded-none p-0 h-auto flex overflow-x-auto">
          <TabsTrigger 
            value="dashboard" 
            className="py-3 px-4 md:px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none whitespace-nowrap"
          >
            لوحة التحكم
          </TabsTrigger>
          <TabsTrigger 
            value="properties"
            className="py-3 px-4 md:px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none whitespace-nowrap"
          >
            إدارة العقارات
          </TabsTrigger>
          <TabsTrigger 
            value="bookings"
            className="py-3 px-4 md:px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none whitespace-nowrap"
          >
            الحجوزات
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="py-3 px-4 md:px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none whitespace-nowrap"
          >
            التحليلات
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab} className="pt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}