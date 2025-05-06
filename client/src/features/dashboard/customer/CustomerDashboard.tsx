import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from "firebase/firestore";
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

// Define types
interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  checkInDate: any;
  checkOutDate: any;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
  [key: string]: any; // Allow additional properties
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
        
        for (const docSnap of snapshot.docs) {
          const bookingData = docSnap.data();
          
          // Get property details
          let propertyName = "عقار غير معروف";
          let propertyImage = "";
          
          if (bookingData.propertyId) {
            try {
              const propertyDocRef = doc(db, "properties", bookingData.propertyId);
              const propertyDocSnap = await getDoc(propertyDocRef);
              if (propertyDocSnap.exists()) {
                const propertyData = propertyDocSnap.data();
                propertyName = propertyData.name;
                propertyImage = propertyData.imageUrl;
              }
            } catch (error) {
              console.error("Error fetching property details:", error);
            }
          }
          
          bookingsWithDetails.push({
            id: docSnap.id,
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
  
  // Define favorite property type
  interface FavoriteProperty {
    id: string;
    propertyId: string;
    propertyName: string;
    propertyImage: string;
    price: number;
    location: string;
    addedAt: any;
  }

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
        const favoritesWithDetails: FavoriteProperty[] = [];
        
        for (const docSnap of snapshot.docs) {
          const favoriteData = docSnap.data();
          
          // Get property details
          if (favoriteData.propertyId) {
            try {
              if (db) {
                const propertyDocRef = doc(db, "properties", favoriteData.propertyId);
                const propertyDocSnap = await getDoc(propertyDocRef);
                if (propertyDocSnap.exists()) {
                  const propertyData = propertyDocSnap.data();
                  favoritesWithDetails.push({
                    id: docSnap.id,
                    propertyId: favoriteData.propertyId,
                    propertyName: propertyData.name || 'عقار غير معروف',
                    propertyImage: propertyData.imageUrl || '',
                    price: propertyData.price || 0,
                    location: propertyData.location || '',
                    addedAt: favoriteData.createdAt || new Date()
                  });
                }
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
        {/* مساحة عرض الملخص */}
        <div className="mb-8 bg-gray-900/70 backdrop-blur-md rounded-xl p-6 border border-gray-800 relative overflow-hidden">
          {/* خلفية التأثير الضوئي */}
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#39FF14]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#39FF14]/10 rounded-full blur-2xl"></div>
          
          {/* معلومات العميل */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Avatar className="h-16 w-16 border-2 border-[#39FF14]/20 shadow-lg shadow-[#39FF14]/10">
                <AvatarImage src={user?.photoURL || ""} alt={user?.name || "العميل"} />
                <AvatarFallback className="bg-gray-800 text-[#39FF14]">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "م"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  مرحباً، <span className="text-[#39FF14]">{user?.name || "العميل"}</span>
                </h1>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>
            </div>
            
            <div className="col-span-2 md:text-left text-center">
              <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                <Button size="sm" variant="outline" className="border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/10">
                  <FaBed className="mr-2 h-4 w-4" /> احجز عقاراً
                </Button>
                <Button size="sm" variant="outline" className="border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/10">
                  <FaUser className="mr-2 h-4 w-4" /> تحديث الملف الشخصي
                </Button>
              </div>
            </div>
          </div>
        </div>
        
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
                ${bookings.reduce((sum, booking: any) => sum + (booking.totalPrice || 0), 0)}
              </div>
              <div className="text-xs text-gray-400 mt-1">إجمالي المدفوعات</div>
            </CardContent>
          </Card>
          
          {/* Coming Soon Card */}
          <Card className="bg-gray-900 border-gray-800 text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 bg-[#39FF14]/60 rounded-full w-16 h-16 blur-xl"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">خدمات إضافية</CardTitle>
              <div className="bg-gray-800 rounded-full p-1">
                <FaRegStar className="h-3 w-3 text-[#39FF14]" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <Badge variant="outline" className="bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20 mb-2">
                قريباً
              </Badge>
              <div className="text-sm text-gray-400">خدمات النوادي، المطاعم والترفيه قيد التطوير</div>
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
                  {bookings.map((booking: any) => (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((property: FavoriteProperty) => (
                    <div key={property.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-[#39FF14]/20 transition-colors group">
                      <div className="relative h-48 overflow-hidden">
                        {property.propertyImage ? (
                          <img 
                            src={property.propertyImage}
                            alt={property.propertyName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-700">
                            <FaMapMarkerAlt className="h-12 w-12 text-gray-600" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-[#39FF14] text-black px-3 py-1 rounded-full text-sm font-bold">
                          ${property.price || 0} / ليلة
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-[#39FF14] mb-2">
                          {property.propertyName || "عقار غير معروف"}
                        </h3>
                        
                        <div className="flex items-center text-sm text-gray-300 mb-2">
                          <FaMapMarkerAlt className="h-3 w-3 mr-2 text-[#39FF14]" />
                          {property.location || "موقع غير معروف"}
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                          <div className="text-xs text-gray-400">
                            تاريخ الإضافة: {formatDate(property.addedAt)}
                          </div>
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
              {/* معلومات تعريفية */}
              <div className="mb-8 bg-gray-800/70 rounded-xl p-6">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="w-full md:w-1/3 flex flex-col items-center">
                    <Avatar className="h-32 w-32 border-2 border-[#39FF14]/20 shadow-lg shadow-[#39FF14]/10 mb-4">
                      <AvatarImage src={user?.photoURL || ""} alt={user?.name || "العميل"} />
                      <AvatarFallback className="bg-gray-800 text-[#39FF14] text-4xl">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || "م"}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/10 mt-2">
                      تغيير الصورة
                    </Button>
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">الاسم</h3>
                        <p className="text-white font-medium">{user?.name || "غير محدد"}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">البريد الإلكتروني</h3>
                        <p className="text-white">{user?.email || "غير محدد"}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">رقم الهاتف</h3>
                        <p className="text-white">{user?.phone || "غير محدد"}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm mb-1">العضوية</h3>
                        <p className="text-[#39FF14] font-medium">عضو منذ {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : "غير محدد"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-medium text-white mb-4">تعديل المعلومات الشخصية</h3>
                <UserProfileForm />
              </div>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="pt-6">
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#39FF14] mb-6">إعدادات الحساب</h2>
              
              {/* قسم خلاصة الإعدادات */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">اللغة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-base font-medium text-[#39FF14]">{user?.settings?.language === 'ar' ? "العربية" : "English"}</div>
                    <div className="text-xs text-gray-400 mt-1">لغة الواجهة الحالية</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">الإشعارات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-base font-medium text-[#39FF14]">{user?.settings?.emailNotifications ? "مفعلة" : "غير مفعلة"}</div>
                    <div className="text-xs text-gray-400 mt-1">حالة إشعارات البريد الإلكتروني</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">السمة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-base font-medium text-[#39FF14]">
                      {user?.settings?.theme === 'dark' ? "داكنة" : 
                        user?.settings?.theme === 'light' ? "فاتحة" : "تلقائية"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">سمة التطبيق الحالية</div>
                  </CardContent>
                </Card>
              </div>
              
              <UserSettingsForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}