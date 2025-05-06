import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserProfileForm from "./UserProfileForm";
import UserSettingsForm from "./UserSettingsForm";
import { 
  FaCalendarAlt, 
  FaHeart, 
  FaCreditCard, 
  FaRegStar,
  FaSpinner,
  FaMapMarkerAlt,
  FaBed,
  FaUser
} from "react-icons/fa";

// Define booking type
interface Booking {
  id: string;
  propertyId: string;
  propertyName?: string;
  propertyImage?: string;
  checkInDate: any;
  checkOutDate: any;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");

  // Fetch user's bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["customer-bookings", user?.uid],
    queryFn: async () => {
      if (!user?.uid || !db) return [];
      
      try {
        const q = query(
          collection(db, "bookings"), 
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        
        // Get bookings with property details
        const bookingsWithDetails = [];
        
        for (const doc of snapshot.docs) {
          const bookingData = doc.data();
          
          // Get property details
          let propertyName = "عقار غير معروف";
          let propertyImage = "";
          
          if (bookingData.propertyId) {
            try {
              const propertyDoc = await db.collection("properties").doc(bookingData.propertyId).get();
              if (propertyDoc.exists) {
                const propertyData = propertyDoc.data();
                propertyName = propertyData.name;
                propertyImage = propertyData.imageUrl;
              }
            } catch (error) {
              console.error("Error fetching property details:", error);
            }
          }
          
          bookingsWithDetails.push({
            id: doc.id,
            ...bookingData,
            propertyName,
            propertyImage
          });
        }
        
        return bookingsWithDetails;
      } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
      }
    },
    enabled: !!user?.uid && !!db
  });
  
  // Fetch user's favorite properties
  const { data: favorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ["customer-favorites", user?.uid],
    queryFn: async () => {
      if (!user?.uid || !db) return [];
      
      try {
        const q = query(
          collection(db, "favorites"), 
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        
        // Get favorites with property details
        const favoritesWithDetails = [];
        
        for (const doc of snapshot.docs) {
          const favoriteData = doc.data();
          
          // Get property details
          if (favoriteData.propertyId) {
            try {
              const propertyDoc = await db.collection("properties").doc(favoriteData.propertyId).get();
              if (propertyDoc.exists) {
                const propertyData = propertyDoc.data();
                favoritesWithDetails.push({
                  id: doc.id,
                  ...favoriteData,
                  property: {
                    id: favoriteData.propertyId,
                    ...propertyData
                  }
                });
              }
            } catch (error) {
              console.error("Error fetching property details:", error);
            }
          }
        }
        
        return favoritesWithDetails;
      } catch (error) {
        console.error("Error fetching favorites:", error);
        return [];
      }
    },
    enabled: !!user?.uid && !!db
  });

  const formatDate = (dateObj: any) => {
    if (!dateObj) return "غير محدد";
    
    try {
      const date = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);
      return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return "غير محدد";
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="bg-green-500">مؤكد</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">قيد الانتظار</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">ملغي</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Neon Effect */}
        <h1 className="text-4xl font-bold text-[#39FF14] mb-6 relative inline-block">
          لوحة تحكم العميل
          <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-[#39FF14]/40"></div>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Bookings Card */}
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">الحجوزات</CardTitle>
              <FaCalendarAlt className="h-4 w-4 text-[#39FF14]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#39FF14]">{bookings.length}</div>
              <div className="text-xs text-gray-400 mt-1">إجمالي الحجوزات</div>
            </CardContent>
          </Card>
          
          {/* Favorites Card */}
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">المفضلة</CardTitle>
              <FaHeart className="h-4 w-4 text-[#39FF14]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#39FF14]">{favorites.length}</div>
              <div className="text-xs text-gray-400 mt-1">العقارات المفضلة</div>
            </CardContent>
          </Card>
          
          {/* Payments Card */}
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">المدفوعات</CardTitle>
              <FaCreditCard className="h-4 w-4 text-[#39FF14]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#39FF14]">
                ${bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)}
              </div>
              <div className="text-xs text-gray-400 mt-1">إجمالي المدفوعات</div>
            </CardContent>
          </Card>
          
          {/* Reviews Card */}
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">التقييمات</CardTitle>
              <FaRegStar className="h-4 w-4 text-[#39FF14]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#39FF14]">0</div>
              <div className="text-xs text-gray-400 mt-1">إجمالي التقييمات</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-gray-900 border-b border-gray-800 w-full justify-start rounded-none p-0 h-auto">
            <TabsTrigger 
              value="bookings" 
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              حجوزاتي
            </TabsTrigger>
            <TabsTrigger 
              value="favorites"
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              المفضلة
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              الملف الشخصي
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="py-3 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none"
            >
              الإعدادات
            </TabsTrigger>
          </TabsList>
          
          {/* Bookings Tab */}
          <TabsContent value="bookings" className="pt-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#39FF14] mb-6">حجوزاتي</h2>
              
              {bookingsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <FaSpinner className="animate-spin h-8 w-8 mb-4 text-[#39FF14]" />
                    <span className="text-gray-400">جاري تحميل الحجوزات...</span>
                  </div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-gray-800 p-4 rounded-full inline-block mb-4">
                    <FaCalendarAlt className="h-10 w-10 text-[#39FF14]/70" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">لا توجد حجوزات حتى الآن</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">لم تقم بإجراء أي حجوزات بعد. تصفح العقارات المتاحة واحجز أول إقامة لك.</p>
                  <Button className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-medium">
                    تصفح العقارات
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bookings.map((booking: Booking) => (
                    <div key={booking.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-[#39FF14]/20 transition-colors group">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-2/5 h-40 md:h-auto bg-gray-700 relative">
                          {booking.propertyImage ? (
                            <img 
                              src={booking.propertyImage}
                              alt={booking.propertyName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaMapMarkerAlt className="h-12 w-12 text-gray-600" />
                            </div>
                          )}
                          {getStatusBadge(booking.status)}
                        </div>
                        
                        <div className="p-4 flex-1">
                          <h3 className="text-lg font-bold text-[#39FF14] mb-2">
                            {booking.propertyName || "عقار غير معروف"}
                          </h3>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-300">
                              <FaCalendarAlt className="h-3 w-3 mr-2 text-[#39FF14]" />
                              <span className="font-medium ml-1">الوصول:</span>
                              {formatDate(booking.checkInDate)}
                            </div>
                            <div className="flex items-center text-sm text-gray-300">
                              <FaCalendarAlt className="h-3 w-3 mr-2 text-[#39FF14]" />
                              <span className="font-medium ml-1">المغادرة:</span>
                              {formatDate(booking.checkOutDate)}
                            </div>
                            <div className="flex items-center text-sm text-gray-300">
                              <FaCreditCard className="h-3 w-3 mr-2 text-[#39FF14]" />
                              <span className="font-medium ml-1">المبلغ:</span>
                              ${booking.totalPrice || 0}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                            <div className="text-xs text-gray-400">
                              تاريخ الحجز: {formatDate(booking.createdAt)}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#39FF14] border-[#39FF14] hover:bg-[#39FF14]/10"
                            >
                              التفاصيل
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Favorites Tab */}
          <TabsContent value="favorites" className="pt-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#39FF14] mb-6">العقارات المفضلة</h2>
              
              {favoritesLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <FaSpinner className="animate-spin h-8 w-8 mb-4 text-[#39FF14]" />
                    <span className="text-gray-400">جاري تحميل العقارات المفضلة...</span>
                  </div>
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-gray-800 p-4 rounded-full inline-block mb-4">
                    <FaHeart className="h-10 w-10 text-[#39FF14]/70" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">لا توجد عقارات مفضلة</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    لم تقم بإضافة أي عقارات إلى المفضلة حتى الآن. أضف العقارات التي تعجبك للرجوع إليها لاحقاً.
                  </p>
                  <Button className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-medium">
                    تصفح العقارات
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favorites.map((favorite: any) => (
                    <div key={favorite.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-[#39FF14]/20 transition-colors group">
                      <div className="relative h-48 overflow-hidden">
                        {favorite.property?.imageUrl ? (
                          <img 
                            src={favorite.property.imageUrl}
                            alt={favorite.property.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-700">
                            <FaMapMarkerAlt className="h-12 w-12 text-gray-600" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-[#39FF14] text-black px-3 py-1 rounded-full text-sm font-bold">
                          ${favorite.property?.price || 0} / ليلة
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-[#39FF14] mb-2">
                          {favorite.property?.name || "عقار غير معروف"}
                        </h3>
                        
                        <div className="flex items-center text-sm text-gray-300 mb-2">
                          <FaMapMarkerAlt className="h-3 w-3 mr-2 text-[#39FF14]" />
                          {favorite.property?.location || "موقع غير معروف"}
                        </div>
                        
                        <div className="flex gap-3 mb-3">
                          {favorite.property?.beds && (
                            <div className="flex items-center text-xs text-gray-400">
                              <FaBed className="h-3 w-3 mr-1" />
                              {favorite.property.beds} أسرة
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-500 hover:bg-transparent p-0"
                          >
                            <FaHeart className="h-4 w-4" />
                          </Button>
                          <Button
                            className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-medium text-sm"
                          >
                            حجز الآن
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="pt-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-8 mb-8">
                <div className="md:w-1/4 flex flex-col items-center">
                  <div className="mb-4">
                    <Avatar className="h-32 w-32 border-4 border-[#39FF14]/20">
                      <AvatarImage src={user?.profileImage || ""} alt={user?.name} />
                      <AvatarFallback className="bg-gray-800 text-[#39FF14] text-4xl">
                        <FaUser />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h2 className="text-2xl font-bold text-[#39FF14] mb-1">{user?.name}</h2>
                  <p className="text-gray-400 mb-4">{user?.email}</p>
                  <Badge>{user?.role || "CUSTOMER"}</Badge>
                </div>
                
                <div className="md:w-3/4">
                  <h3 className="text-xl font-semibold text-[#39FF14] mb-4">معلومات الملف الشخصي</h3>
                  <UserProfileForm />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="pt-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#39FF14] mb-6">الإعدادات</h2>
              <UserSettingsForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}