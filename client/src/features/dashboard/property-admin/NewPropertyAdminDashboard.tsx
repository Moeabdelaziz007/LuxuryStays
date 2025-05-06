import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import PropertyManagement from "@/features/properties/PropertyManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Calendar, 
  LayoutDashboard, 
  Home, 
  PieChart, 
  Settings2, 
  MessageSquare,
  User,
  CircleUser,
  LogOut
} from "lucide-react";
import { FaBuilding, FaCalendarAlt, FaMoneyBillWave, FaStar, FaChartLine } from "react-icons/fa";
import PropertyAdminOverview from "./components/PropertyAdminOverview";
import PropertyBookingCard from "./components/PropertyBookingCard";

export default function NewPropertyAdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [animate, setAnimate] = useState(false);
  
  // Animation on load
  useEffect(() => {
    setAnimate(true);
  }, []);
  
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
        
        // Get bookings count
        let bookingsCount = 0;
        let activeBookings = 0;
        let totalEarnings = 0;
        
        for (const propertyId of propertyIds) {
          const bookingsQuery = query(
            collection(db, "bookings"),
            where("propertyId", "==", propertyId)
          );
          const bookingsSnapshot = await getDocs(bookingsQuery);
          
          bookingsCount += bookingsSnapshot.size;
          
          bookingsSnapshot.docs.forEach(doc => {
            const bookingData = doc.data();
            
            if (bookingData.status === 'confirmed') {
              activeBookings++;
            }
            
            if (bookingData.totalPrice) {
              totalEarnings += bookingData.totalPrice;
            }
          });
        }
        
        // Get reviews count
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
            const location = propertyDoc ? propertyDoc.data().location : "";
            const imageUrl = propertyDoc ? propertyDoc.data().imageUrl : "";
            
            recentBookings.push({
              id: bookingDoc.id,
              propertyId,
              propertyName,
              location,
              imageUrl,
              customerName: bookingData.customerName || "عميل",
              checkInDate: bookingData.checkInDate,
              checkOutDate: bookingData.checkOutDate,
              totalPrice: bookingData.totalPrice || 0,
              status: bookingData.status || "pending",
              createdAt: bookingData.createdAt
            });
          }
        }
        
        // Sort by creation date
        return recentBookings.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000) : new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
      } catch (error) {
        console.error("Error fetching recent bookings:", error);
        return [];
      }
    },
    enabled: !!user?.uid && !!db
  });

  // Format date for display
  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Handle bookings
  const handleViewBookingDetails = (id: string) => {
    console.log("View booking details:", id);
    // Implementation to view booking details
  };
  
  const handleConfirmBooking = (id: string) => {
    console.log("Confirm booking:", id);
    // Implementation to confirm booking
  };
  
  const handleCancelBooking = (id: string) => {
    console.log("Cancel booking:", id);
    // Implementation to cancel booking
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar for Large Screens */}
          <aside className={`w-full md:w-64 lg:w-72 shrink-0 ${
            animate ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`} style={{ transition: 'all 0.5s ease-out' }}>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <Avatar className="h-14 w-14 border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/10">
                    <AvatarImage src={user?.photoURL || ""} alt={user?.name || "المالك"} />
                    <AvatarFallback className="bg-indigo-900 text-indigo-200 text-xl font-bold">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || "م"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-900"></div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{user?.name || "المالك"}</h2>
                  <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                    مالك عقارات
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-right ${
                    activeTab === 'overview' 
                      ? 'bg-gradient-to-r from-[#39FF14]/10 to-transparent text-[#39FF14] border-r-2 border-[#39FF14]' 
                      : 'text-gray-400 hover:text-[#39FF14] hover:bg-black/30 transition-all'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <LayoutDashboard size={18} className={`ml-2 ${activeTab === 'overview' ? 'text-[#39FF14]' : ''}`} />
                  <span>نظرة عامة</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-right ${
                    activeTab === 'properties' 
                      ? 'bg-gradient-to-r from-[#39FF14]/10 to-transparent text-[#39FF14] border-r-2 border-[#39FF14]' 
                      : 'text-gray-400 hover:text-[#39FF14] hover:bg-black/30 transition-all'
                  }`}
                  onClick={() => setActiveTab('properties')}
                >
                  <Building size={18} className={`ml-2 ${activeTab === 'properties' ? 'text-[#39FF14]' : ''}`} />
                  <span>العقارات</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-right ${
                    activeTab === 'bookings' 
                      ? 'bg-gradient-to-r from-[#39FF14]/10 to-transparent text-[#39FF14] border-r-2 border-[#39FF14]' 
                      : 'text-gray-400 hover:text-[#39FF14] hover:bg-black/30 transition-all'
                  }`}
                  onClick={() => setActiveTab('bookings')}
                >
                  <Calendar size={18} className={`ml-2 ${activeTab === 'bookings' ? 'text-[#39FF14]' : ''}`} />
                  <span>الحجوزات</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-right ${
                    activeTab === 'analytics' 
                      ? 'bg-gradient-to-r from-[#39FF14]/10 to-transparent text-[#39FF14] border-r-2 border-[#39FF14]' 
                      : 'text-gray-400 hover:text-[#39FF14] hover:bg-black/30 transition-all'
                  }`}
                  onClick={() => setActiveTab('analytics')}
                >
                  <PieChart size={18} className={`ml-2 ${activeTab === 'analytics' ? 'text-[#39FF14]' : ''}`} />
                  <span>التحليلات</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-right ${
                    activeTab === 'messages' 
                      ? 'bg-gradient-to-r from-[#39FF14]/10 to-transparent text-[#39FF14] border-r-2 border-[#39FF14]' 
                      : 'text-gray-400 hover:text-[#39FF14] hover:bg-black/30 transition-all'
                  }`}
                  onClick={() => setActiveTab('messages')}
                >
                  <MessageSquare size={18} className={`ml-2 ${activeTab === 'messages' ? 'text-[#39FF14]' : ''}`} />
                  <span>الرسائل</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start text-right ${
                    activeTab === 'settings' 
                      ? 'bg-gradient-to-r from-[#39FF14]/10 to-transparent text-[#39FF14] border-r-2 border-[#39FF14]' 
                      : 'text-gray-400 hover:text-[#39FF14] hover:bg-black/30 transition-all'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings2 size={18} className={`ml-2 ${activeTab === 'settings' ? 'text-[#39FF14]' : ''}`} />
                  <span>الإعدادات</span>
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-800">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-right text-gray-400 hover:text-[#39FF14] hover:bg-black/30 transition-all"
                >
                  <User size={18} className="ml-2" />
                  <span>الملف الشخصي</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-right text-gray-400 hover:text-[#39FF14] hover:bg-black/30 transition-all"
                >
                  <LogOut size={18} className="ml-2" />
                  <span>تسجيل الخروج</span>
                </Button>
              </div>
            </div>
            
            {/* Stats Summary */}
            <div className="space-y-3 bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800/50">
              <h3 className="text-xs text-gray-400 uppercase">ملخص الإحصائيات</h3>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-400 ml-3">
                    <Building size={14} />
                  </div>
                  <span className="text-sm text-gray-300">العقارات</span>
                </div>
                <span className="text-sm font-medium text-white">{dashboardStats?.propertiesCount || 0}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-400 ml-3">
                    <Calendar size={14} />
                  </div>
                  <span className="text-sm text-gray-300">الحجوزات</span>
                </div>
                <span className="text-sm font-medium text-white">{dashboardStats?.bookingsCount || 0}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-md bg-green-500/20 flex items-center justify-center text-green-400 ml-3">
                    <FaMoneyBillWave size={14} />
                  </div>
                  <span className="text-sm text-gray-300">الإيرادات</span>
                </div>
                <span className="text-sm font-medium text-white">${dashboardStats?.totalEarnings || 0}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="w-7 h-7 rounded-md bg-rose-500/20 flex items-center justify-center text-rose-400 ml-3">
                    <FaStar size={14} />
                  </div>
                  <span className="text-sm text-gray-300">التقييمات</span>
                </div>
                <span className="text-sm font-medium text-white">{dashboardStats?.reviewsCount || 0}</span>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1">
            {/* Tab Content */}
            <div className={`${
              animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} style={{ transition: 'all 0.7s ease-out', transitionDelay: '200ms' }}>
              {activeTab === 'overview' && (
                <PropertyAdminOverview 
                  stats={dashboardStats || {
                    propertiesCount: 0,
                    bookingsCount: 0,
                    totalEarnings: 0,
                    reviewsCount: 0,
                    activeBookings: 0
                  }}
                  recentBookings={recentBookings}
                  onViewAllProperties={() => setActiveTab('properties')}
                  onViewAllBookings={() => setActiveTab('bookings')}
                  onAddProperty={() => setActiveTab('properties')}
                />
              )}
              
              {activeTab === 'properties' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">إدارة العقارات</h2>
                  <PropertyManagement />
                </div>
              )}
              
              {activeTab === 'bookings' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">إدارة الحجوزات</h2>
                  
                  {/* Booking filters */}
                  <div className="mb-6 bg-gradient-to-r from-indigo-900/20 to-indigo-800/10 border border-indigo-800/30 rounded-xl p-5">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">الحجوزات</h3>
                        <p className="text-sm text-gray-400">استعراض وإدارة كافة حجوزات العقارات الخاصة بك</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          variant="outline" 
                          className="text-indigo-400 border-indigo-500/50 hover:bg-indigo-500/10"
                        >
                          جميع الحجوزات
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-amber-400 border-amber-500/50 hover:bg-amber-500/10"
                        >
                          قيد الانتظار
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-green-400 border-green-500/50 hover:bg-green-500/10"
                        >
                          مؤكدة
                        </Button>
                        <Button 
                          variant="outline" 
                          className="text-red-400 border-red-500/50 hover:bg-red-500/10"
                        >
                          ملغية
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bookings list */}
                  <div className="space-y-4">
                    {recentBookings.length > 0 ? (
                      recentBookings.map((booking, index) => (
                        <PropertyBookingCard 
                          key={booking.id}
                          booking={booking}
                          onViewDetails={handleViewBookingDetails}
                          onConfirm={booking.status === 'pending' ? handleConfirmBooking : undefined}
                          onCancel={booking.status !== 'cancelled' ? handleCancelBooking : undefined}
                          delay={100 * index}
                          animate={animate}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
                        <Calendar className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium text-gray-400 mb-2">لا توجد حجوزات</h3>
                        <p className="text-gray-500 mb-4">لا توجد حجوزات لعقاراتك حالياً</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'analytics' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">تحليلات الأداء</h2>
                  
                  <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">قريباً</CardTitle>
                      <CardDescription className="text-gray-400">
                        سيتم إضافة تحليلات مفصلة قريباً
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <PieChart className="h-16 w-16 mx-auto text-indigo-400 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">تحليلات متقدمة</h3>
                        <p className="text-gray-400 mb-4">سيتم إضافة تحليلات متقدمة للإشغال والإيرادات قريباً</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === 'messages' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">الرسائل</h2>
                  
                  <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">قريباً</CardTitle>
                      <CardDescription className="text-gray-400">
                        سيتم إضافة نظام المراسلات قريباً
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <MessageSquare className="h-16 w-16 mx-auto text-indigo-400 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">نظام المراسلات</h3>
                        <p className="text-gray-400 mb-4">سيتم إضافة نظام للتواصل مع العملاء والمشرفين قريباً</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">الإعدادات</h2>
                  
                  <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">قريباً</CardTitle>
                      <CardDescription className="text-gray-400">
                        سيتم إضافة صفحة الإعدادات قريباً
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Settings2 className="h-16 w-16 mx-auto text-indigo-400 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">إعدادات الحساب</h3>
                        <p className="text-gray-400 mb-4">سيتم إضافة إعدادات متقدمة للحساب قريباً</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}