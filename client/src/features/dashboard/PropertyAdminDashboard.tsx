import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import PropertyManagement from "@/features/properties/PropertyManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaBuilding, FaCalendarAlt, FaStar, FaMoneyBillWave } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";

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
        <h1 className="text-4xl font-bold text-[#39FF14] mb-6 relative inline-block">
          لوحة مشرف العقار
          <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-[#39FF14]/40"></div>
        </h1>
        
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
        </Tabs>
      </div>
    </div>
  );
}