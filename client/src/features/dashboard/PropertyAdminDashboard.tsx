import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import PropertyManagement from "@/features/properties/PropertyManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaBuilding, FaCalendarAlt, FaStar, FaMoneyBillWave, FaUsers, FaUserTie } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

export default function PropertyAdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch statistics for the dashboard
  const { data: dashboardStats } = useQuery({
    queryKey: ["dashboard-stats", user?.uid],
    queryFn: async () => {
      if (!user?.uid || !db) {
        return {
          propertiesCount: 0,
          bookingsCount: 0,
          totalEarnings: 0,
          reviewsCount: 0,
          activeBookings: 0
        };
      }
      
      try {
        // Get properties count
        const propertiesQuery = query(
          collection(db, "properties"), 
          where("ownerId", "==", user.uid)
        );
        const propertiesSnapshot = await getDocs(propertiesQuery);
        const propertiesCount = propertiesSnapshot.size;
        
        // Get properties ids
        const propertyIds = propertiesSnapshot.docs.map(doc => doc.id);
        
        // If no properties, return default stats
        if (propertyIds.length === 0) {
          return {
            propertiesCount: 0,
            bookingsCount: 0,
            totalEarnings: 0,
            reviewsCount: 0,
            activeBookings: 0
          };
        }
        
        // Get bookings count (assuming there's a bookings collection)
        let bookingsCount = 0;
        let activeBookings = 0;
        let totalEarnings = 0;
        
        // This is a simplified approach - in a real app you might use aggregation
        for (const propertyId of propertyIds) {
          const bookingsQuery = query(
            collection(db, "bookings"),
            where("propertyId", "==", propertyId)
          );
          const bookingsSnapshot = await getDocs(bookingsQuery);
          
          bookingsCount += bookingsSnapshot.size;
          
          // Count active bookings and calculate earnings
          bookingsSnapshot.docs.forEach(doc => {
            const booking = doc.data();
            if (booking.status === "confirmed") {
              activeBookings++;
            }
            if (booking.totalPrice) {
              totalEarnings += booking.totalPrice;
            }
          });
        }
        
        // Get reviews count (assuming there's a reviews collection)
        let reviewsCount = 0;
        for (const propertyId of propertyIds) {
          const reviewsQuery = query(
            collection(db, "reviews"),
            where("propertyId", "==", propertyId)
          );
          const reviewsSnapshot = await getDocs(reviewsQuery);
          reviewsCount += reviewsSnapshot.size;
        }
        
        return {
          propertiesCount,
          bookingsCount,
          totalEarnings,
          reviewsCount,
          activeBookings
        };
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
          propertiesCount: 0,
          bookingsCount: 0,
          totalEarnings: 0,
          reviewsCount: 0,
          activeBookings: 0
        };
      }
    },
    enabled: !!user?.uid && !!db
  });
  
  // Fetch recent bookings
  const { data: recentBookings = [] } = useQuery({
    queryKey: ["recent-bookings", user?.uid],
    queryFn: async () => {
      if (!user?.uid || !db) return [];
      
      try {
        // First fetch all properties for this admin
        const propertiesQuery = query(
          collection(db, "properties"),
          where("ownerId", "==", user.uid)
        );
        const propertiesSnapshot = await getDocs(propertiesQuery);
        const propertyIds = propertiesSnapshot.docs.map(doc => doc.id);
        
        if (propertyIds.length === 0) {
          return [];
        }
        
        // Now fetch recent bookings for these properties
        const recentBookings = [];
        
        for (const propertyId of propertyIds) {
          const bookingsQuery = query(
            collection(db, "bookings"),
            where("propertyId", "==", propertyId),
            orderBy("createdAt", "desc"),
            limit(5)
          );
          
          const bookingsSnapshot = await getDocs(bookingsQuery);
          
          for (const bookingDoc of bookingsSnapshot.docs) {
            const bookingData = bookingDoc.data();
            
            // Get property details
            const propertyDoc = propertiesSnapshot.docs.find(doc => doc.id === propertyId);
            const propertyName = propertyDoc ? propertyDoc.data().name : "عقار غير معروف";
            
            recentBookings.push({
              id: bookingDoc.id,
              ...bookingData,
              propertyName
            });
          }
        }
        
        // Sort and limit to most recent 5
        return recentBookings
          .sort((a, b) => b.createdAt?.toDate?.() - a.createdAt?.toDate?.())
          .slice(0, 5);
      } catch (error) {
        console.error("Error fetching recent bookings:", error);
        return [];
      }
    },
    enabled: !!user?.uid && !!db
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Greeting */}
        <div className="mb-8 bg-gray-900/70 backdrop-blur-md rounded-xl p-6 border border-gray-800 relative overflow-hidden">
          {/* Glow Effects */}
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
              <Button size="sm" className="bg-[#39FF14] hover:bg-[#50FF30] text-black">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة عقار
              </Button>
              <Button size="sm" variant="outline" className="border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                تصفح الحجوزات
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Properties Card */}
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">العقارات</CardTitle>
              <FaBuilding className="h-4 w-4 text-[#39FF14]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#39FF14]">{dashboardStats?.propertiesCount || 0}</div>
              <div className="text-xs text-gray-400 mt-1">إجمالي العقارات المدارة</div>
            </CardContent>
          </Card>
          
          {/* Active Bookings Card */}
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">الحجوزات النشطة</CardTitle>
              <FaCalendarAlt className="h-4 w-4 text-[#39FF14]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#39FF14]">{dashboardStats?.activeBookings || 0}</div>
              <div className="text-xs text-gray-400 mt-1">من أصل {dashboardStats?.bookingsCount || 0} حجز</div>
            </CardContent>
          </Card>
          
          {/* Total Earnings Card */}
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">الأرباح</CardTitle>
              <FaMoneyBillWave className="h-4 w-4 text-[#39FF14]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#39FF14]">${dashboardStats?.totalEarnings || 0}</div>
              <div className="text-xs text-gray-400 mt-1">إجمالي الإيرادات</div>
            </CardContent>
          </Card>
          
          {/* Reviews Card */}
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">التقييمات</CardTitle>
              <FaStar className="h-4 w-4 text-[#39FF14]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#39FF14]">{dashboardStats?.reviewsCount || 0}</div>
              <div className="text-xs text-gray-400 mt-1">إجمالي تقييمات العملاء</div>
            </CardContent>
          </Card>
        </div>
        
        {/* إضافة الرسوم البيانية والإحصائيات */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* بطاقة نظرة عامة */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
            <h3 className="text-xl font-bold text-[#39FF14] mb-4">نظرة عامة على الإشغال</h3>
            
            <div className="relative h-64 mb-4">
              {/* هنا يمكن إضافة رسم بياني في حالة وجود مكتبة للرسوم البيانية */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#39FF14]/5 to-[#39FF14]/20 rounded-lg">
                <div className="flex items-end justify-around h-full w-full p-4 pb-10">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const height = 20 + Math.random() * 60; // إنشاء بيانات عشوائية للعرض فقط
                    return (
                      <div key={i} className="h-full flex flex-col items-center justify-end">
                        <div 
                          className="w-5 bg-gradient-to-t from-[#39FF14] to-[#39FF14]/50 rounded-t-sm" 
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="text-xs text-gray-400 mt-2">
                          {i+1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="absolute inset-x-0 bottom-0 p-4 text-center text-gray-400 text-xs">
                إحصائيات الإشغال للأشهر الاثني عشر الماضية
              </div>
            </div>
            
            {/* Key stats in a row */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-[#39FF14]">85%</div>
                <div className="text-xs text-gray-400">متوسط الإشغال</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#39FF14]">$120</div>
                <div className="text-xs text-gray-400">متوسط السعر اليومي</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#39FF14]">4.8</div>
                <div className="text-xs text-gray-400">متوسط التقييمات</div>
              </div>
            </div>
          </div>
          
          {/* مراجعات العملاء */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#39FF14]">آخر المراجعات</h3>
              <span className="text-xs text-gray-400">عرض الكل</span>
            </div>
            
            {dashboardStats?.reviewsCount === 0 ? (
              <div className="text-center py-12 bg-gray-800/30 rounded-lg">
                <div className="mx-auto w-12 h-12 mb-3 rounded-full bg-gray-800 flex items-center justify-center">
                  <FaStar className="text-[#39FF14]/40 h-5 w-5" />
                </div>
                <p className="text-gray-400 text-sm">لا توجد مراجعات بعد</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* نموذج لمراجعة عميل */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#39FF14]/20 flex items-center justify-center text-[#39FF14] mr-2">
                        م
                      </div>
                      <div>
                        <div className="text-sm font-medium">محمد أحمد</div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar 
                              key={star} 
                              className={`h-3 w-3 ${star <= 4 ? 'text-yellow-400' : 'text-gray-600'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">قبل 3 أيام</div>
                  </div>
                  <p className="text-sm text-gray-300">العقار رائع جداً والخدمة ممتازة. سأعود مرة أخرى بالتأكيد.</p>
                </div>
                
                {/* نموذج لمراجعة آخرى */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#39FF14]/20 flex items-center justify-center text-[#39FF14] mr-2">
                        س
                      </div>
                      <div>
                        <div className="text-sm font-medium">سارة محمود</div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar 
                              key={star} 
                              className={`h-3 w-3 ${star <= 5 ? 'text-yellow-400' : 'text-gray-600'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">قبل 1 أسبوع</div>
                  </div>
                  <p className="text-sm text-gray-300">موقع ممتاز قريب من كل الأماكن، وكانت تجربة إقامة لا تُنسى.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* علامات التبويب */}
        <Tabs defaultValue="properties" className="mb-8">
          <TabsList className="bg-gray-900 border-b border-gray-800 w-full justify-start rounded-none p-0 h-auto">
            <TabsTrigger 
              value="properties" 
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              إدارة العقارات
            </TabsTrigger>
            <TabsTrigger 
              value="bookings"
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              الحجوزات
            </TabsTrigger>
            <TabsTrigger 
              value="customers"
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              العملاء
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties" className="pt-6">
            <PropertyManagement />
          </TabsContent>
          
          <TabsContent value="bookings" className="pt-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#39FF14] mb-4">إدارة الحجوزات</h2>
              
              {recentBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 mb-4 bg-gray-800 rounded-full flex items-center justify-center">
                    <FaCalendarAlt className="text-[#39FF14] h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">لا توجد حجوزات بعد</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    عندما يقوم العملاء بحجز أي من عقاراتك، ستظهر تفاصيل الحجوزات هنا.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">العقار</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">المستخدم</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">تاريخ الحجز</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">المبلغ</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400">الحالة</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-400"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking: any) => (
                        <tr key={booking.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="py-3 px-4">{booking.propertyName}</td>
                          <td className="py-3 px-4 flex items-center">
                            <div className="w-7 h-7 bg-green-500/20 rounded-full flex items-center justify-center mr-2">
                              <FaUserCheck className="text-green-500 h-3 w-3" />
                            </div>
                            {booking.customerName || "عميل"}
                          </td>
                          <td className="py-3 px-4">
                            {booking.checkInDate?.toDate ? 
                              new Date(booking.checkInDate.toDate()).toLocaleDateString('ar-EG') : 
                              'غير محدد'}
                          </td>
                          <td className="py-3 px-4">${booking.totalPrice || 0}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                              ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 
                                booking.status === 'cancelled' ? 'bg-red-500/20 text-red-500' : 
                                'bg-yellow-500/20 text-yellow-500'}`}>
                              {booking.status === 'confirmed' ? 'مؤكد' : 
                                booking.status === 'cancelled' ? 'ملغي' : 'قيد الانتظار'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-[#39FF14] hover:text-[#50FF30] transition-colors text-sm">
                              عرض التفاصيل
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {dashboardStats?.bookingsCount > 5 && (
                    <div className="text-center mt-6">
                      <button className="text-[#39FF14] hover:text-[#50FF30] transition-colors text-sm inline-flex items-center">
                        عرض كل الحجوزات
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Customers Tab */}
          <TabsContent value="customers" className="pt-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#39FF14]">إدارة العملاء</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-[#39FF14]/30 text-[#39FF14] hover:bg-[#39FF14]/10">
                    <FaUsers className="h-3 w-3 mr-2" />
                    تصدير البيانات
                  </Button>
                  <Button size="sm" className="bg-[#39FF14] hover:bg-[#50FF30] text-black">
                    <FaUserTie className="h-3 w-3 mr-2" />
                    دعوة عملاء جدد
                  </Button>
                </div>
              </div>
              
              {/* Customer Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-gray-400 text-sm mb-1">إجمالي العملاء</div>
                        <div className="text-2xl font-bold text-[#39FF14]">32</div>
                      </div>
                      <div className="bg-[#39FF14]/10 p-3 rounded-full">
                        <FaUsers className="h-5 w-5 text-[#39FF14]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-gray-400 text-sm mb-1">العملاء الجدد</div>
                        <div className="text-2xl font-bold text-[#39FF14]">7</div>
                      </div>
                      <div className="bg-[#39FF14]/10 p-3 rounded-full">
                        <FaUserTie className="h-5 w-5 text-[#39FF14]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-gray-400 text-sm mb-1">معدل الاحتفاظ</div>
                        <div className="text-2xl font-bold text-[#39FF14]">78%</div>
                      </div>
                      <div className="bg-[#39FF14]/10 p-3 rounded-full">
                        <FaUserCheck className="h-5 w-5 text-[#39FF14]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Customer Table */}
              <div className="bg-gray-800 rounded-xl p-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-right py-3 px-4 font-semibold text-gray-400">الاسم</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-400">البريد الإلكتروني</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-400">الهاتف</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-400">تاريخ الانضمام</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-400">عدد الحجوزات</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-400">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700 hover:bg-gray-700/20">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">أ</div>
                        أحمد محمد
                      </td>
                      <td className="py-3 px-4">ahmed@example.com</td>
                      <td className="py-3 px-4">+20 1xx xxx xxxx</td>
                      <td className="py-3 px-4">12 مارس 2025</td>
                      <td className="py-3 px-4">3</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-1.5 bg-[#39FF14]/10 text-[#39FF14] rounded hover:bg-[#39FF14]/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-1.5 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-700 hover:bg-gray-700/20">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">س</div>
                        سارة محمود
                      </td>
                      <td className="py-3 px-4">sara@example.com</td>
                      <td className="py-3 px-4">+20 1xx xxx xxxx</td>
                      <td className="py-3 px-4">25 فبراير 2025</td>
                      <td className="py-3 px-4">5</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-1.5 bg-[#39FF14]/10 text-[#39FF14] rounded hover:bg-[#39FF14]/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-1.5 bg-blue-500/10 text-blue-500 rounded hover:bg-blue-500/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}