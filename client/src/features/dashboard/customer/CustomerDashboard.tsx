import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
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
  FaDollarSign,
  FaHeart,
  FaUser,
  FaSpinner,
  FaWallet,
  FaCreditCard,
  FaBell,
  FaSignOutAlt
} from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db, safeDoc } from '@/lib/firebase';

// تعريف الأنواع
interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage?: string;
  checkInDate: Date | string;
  checkOutDate: Date | string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
  location?: string;
}

interface FavoriteProperty {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage?: string;
  price?: number;
  location: string;
  addedAt: any;
}

interface CustomerDashboardProps {
  activeTab?: string;
}

export default function CustomerDashboard({ activeTab = "dashboard" }: CustomerDashboardProps) {
  const { user, logout } = useAuth();
  const [_, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useState(activeTab);
  
  // Update selected tab when prop changes
  useEffect(() => {
    setSelectedTab(activeTab);
  }, [activeTab]);
  
  // Fetch user's bookings
  const bookingsQueryKey = useMemo(() => ["customer-bookings", user?.uid], [user?.uid]);
  
  const { data: bookings = [], isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: bookingsQueryKey,
    queryFn: async () => {
      if (!user?.uid || !db) return [];
      
      try {
        console.log("جلب بيانات الحجوزات من Firestore...");
        
        return await safeDoc(async () => {
          if (!db) {
            console.error("Firestore غير متوفر");
            return [];
          }
          
          const bookingsCollectionRef = collection(db, "bookings");
        
          const q = query(
            bookingsCollectionRef, 
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(20)
          );
        
          const snapshot = await getDocs(q);
          
          const bookingsWithDetails: Booking[] = [];
          
          for (const docSnap of snapshot.docs) {
            if (!docSnap.exists()) continue;
            
            const bookingData = docSnap.data();
            
            let propertyName = "عقار غير معروف";
            let propertyImage = "";
            let location = "";
            
            if (bookingData.propertyId) {
              try {
                const propertyDocRef = doc(db, "properties", bookingData.propertyId);
                const propertyDocSnap = await getDoc(propertyDocRef);
                
                if (propertyDocSnap.exists()) {
                  const propertyData = propertyDocSnap.data();
                  propertyName = propertyData.name || propertyName;
                  propertyImage = propertyData.imageUrl || "";
                  location = propertyData.location || "";
                }
              } catch (error) {
                console.error("خطأ في استرجاع تفاصيل العقار:", error);
              }
            }
            
            const booking: Booking = {
              id: docSnap.id,
              propertyId: bookingData.propertyId || "",
              propertyName,
              propertyImage,
              location,
              checkInDate: bookingData.checkInDate || new Date(),
              checkOutDate: bookingData.checkOutDate || new Date(),
              totalPrice: bookingData.totalPrice || 0,
              status: ["pending", "confirmed", "cancelled"].includes(bookingData.status)
                ? bookingData.status as 'pending' | 'confirmed' | 'cancelled'
                : "pending",
              createdAt: bookingData.createdAt || new Date()
            };
            
            bookingsWithDetails.push(booking);
          }
          
          return bookingsWithDetails;
        });
      } catch (error) {
        console.error("خطأ في استرجاع الحجوزات:", error);
        return [];
      }
    },
    enabled: Boolean(user?.uid) && Boolean(db),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false
  });
  
  // Fetch user's favorite properties
  const favoritesQueryKey = useMemo(() => ["customer-favorites", user?.uid], [user?.uid]);
  
  const { data: favorites = [], isLoading: favoritesLoading, error: favoritesError } = useQuery({
    queryKey: favoritesQueryKey,
    queryFn: async () => {
      if (!user?.uid || !db) return [];
      
      try {
        console.log("جلب بيانات المفضلات من Firestore...");
        
        try {
          const favoritesCollectionRef = collection(db, "favorites");
          
          const q = query(
            favoritesCollectionRef, 
            where("userId", "==", user.uid)
          );
          
          const snapshot = await getDocs(q);
          
          const favoritesWithDetails: FavoriteProperty[] = [];
          
          for (const docSnap of snapshot.docs) {
            if (!docSnap.exists()) continue;
            
            const favoriteData = docSnap.data();
            
            if (favoriteData.propertyId) {
              try {
                const propertyDocRef = doc(db, "properties", favoriteData.propertyId);
                const propertyDocSnap = await getDoc(propertyDocRef);
                
                if (propertyDocSnap.exists()) {
                  const propertyData = propertyDocSnap.data();
                  
                  favoritesWithDetails.push({
                    id: docSnap.id,
                    propertyId: favoriteData.propertyId,
                    propertyName: propertyData.name || "عقار غير معروف",
                    propertyImage: propertyData.imageUrl || "",
                    price: propertyData.price,
                    location: propertyData.location || "موقع غير معروف",
                    addedAt: favoriteData.createdAt || new Date()
                  });
                }
              } catch (error) {
                console.error("خطأ في استرجاع تفاصيل العقار للمفضلة:", error);
              }
            }
          }
          
          return favoritesWithDetails;
        } catch (error) {
          console.error("خطأ في جلب المفضلات:", error);
          return [];
        }
      } catch (error) {
        console.error("خطأ في استرجاع المفضلات:", error);
        return [];
      }
    },
    enabled: Boolean(user?.uid) && Boolean(db),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false
  });
  
  // وظيفة مساعدة لتنسيق التاريخ بصيغة عربية
  const formatDate = (date: Date | string) => {
    if (!date) return "";
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj);
  };
  
  // التبديل بين علامات التبويب
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    
    // التنقل إلى المسار المناسب
    const path = tab === 'dashboard' ? '/customer' : `/customer/${tab}`;
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
                    <CardTitle className="text-lg font-medium">الحجوزات</CardTitle>
                    <FaCalendarAlt className="text-[#39FF14] h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#39FF14]">{bookings?.length || 0}</div>
                  <p className="text-sm text-gray-400 mt-1">إجمالي الحجوزات</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#39FF14]/10 rounded-bl-full"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">المفضلة</CardTitle>
                    <FaHeart className="text-[#39FF14] h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#39FF14]">
                    {favorites?.length || 0}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">العقارات المفضلة</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#39FF14]/10 rounded-bl-full"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">الإنفاق</CardTitle>
                    <FaWallet className="text-[#39FF14] h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#39FF14]">
                    ${bookings?.reduce((sum: number, booking: Booking) => sum + (booking.totalPrice || 0), 0) || 0}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">إجمالي الإنفاق</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900 border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#39FF14]/10 rounded-bl-full"></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-medium">الليالي</CardTitle>
                    <FaBed className="text-[#39FF14] h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#39FF14]">
                    {bookings?.reduce((sum: number, booking: Booking) => {
                      const checkIn = booking.checkInDate instanceof Date ? booking.checkInDate : new Date(booking.checkInDate);
                      const checkOut = booking.checkOutDate instanceof Date ? booking.checkOutDate : new Date(booking.checkOutDate);
                      const nights = Math.max(0, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
                      return sum + nights;
                    }, 0) || 0}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">إجمالي ليالي الإقامة</p>
                </CardContent>
              </Card>
            </div>
            
            {/* الحجوزات المقبلة والمفضلة */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
              {/* آخر الحجوزات */}
              <div className="lg:col-span-4">
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-[#39FF14]">الحجوزات القادمة</CardTitle>
                      <Button variant="ghost" className="h-8 text-xs text-[#39FF14] hover:text-[#39FF14]/80 hover:bg-[#39FF14]/10"
                        onClick={() => handleTabChange("bookings")}
                      >
                        عرض الكل
                      </Button>
                    </div>
                    <CardDescription>
                      أحدث حجوزاتك القادمة
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      {bookingsLoading ? (
                        <div className="text-center py-8">
                          <FaSpinner className="h-8 w-8 mx-auto mb-4 text-[#39FF14] animate-spin" />
                          <p className="text-gray-400">جاري تحميل الحجوزات...</p>
                        </div>
                      ) : bookings && bookings.length > 0 ? (
                        // Filter only upcoming bookings
                        bookings
                          .filter((booking: Booking) => {
                            const checkInDate = booking.checkInDate instanceof Date ? booking.checkInDate : new Date(booking.checkInDate);
                            return checkInDate >= new Date();
                          })
                          .slice(0, 3)
                          .map(booking => (
                            <div key={booking.id} className="bg-gray-800/50 rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="font-medium text-white truncate">{booking.propertyName}</div>
                                  <div className="text-sm text-gray-400 flex items-center">
                                    <FaMapMarkerAlt className="mr-1 h-3 w-3" />
                                    <span>{booking.location || "موقع غير محدد"}</span>
                                  </div>
                                </div>
                                <Badge className={booking.status === 'confirmed' ? 'bg-green-500 hover:bg-green-600' : 
                                               booking.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                                               'bg-red-500 hover:bg-red-600'}>
                                  {booking.status === 'confirmed' ? 'مؤكد' : 
                                   booking.status === 'pending' ? 'قيد الانتظار' : 'ملغي'}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                                <div className="text-gray-400">من: <span className="text-white">{formatDate(booking.checkInDate)}</span></div>
                                <div className="text-gray-400">إلى: <span className="text-white">{formatDate(booking.checkOutDate)}</span></div>
                              </div>
                              <div className="mt-3 flex justify-between items-center">
                                <div className="text-[#39FF14] font-medium">${booking.totalPrice}</div>
                                <Button variant="ghost" size="sm" className="h-8 text-xs">
                                  <FaEye className="mr-1 h-3 w-3" />
                                  التفاصيل
                                </Button>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
                            <FaCalendarAlt className="h-6 w-6 text-gray-500" />
                          </div>
                          <h4 className="text-gray-400 font-medium">لا توجد حجوزات قادمة</h4>
                          <p className="text-gray-500 text-sm mt-1">ابحث عن عقارات رائعة للحجز</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* العقارات المفضلة */}
              <div className="lg:col-span-3">
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-[#39FF14]">المفضلة</CardTitle>
                      <Button variant="ghost" className="h-8 text-xs text-[#39FF14] hover:text-[#39FF14]/80 hover:bg-[#39FF14]/10"
                        onClick={() => handleTabChange("favorites")}
                      >
                        عرض الكل
                      </Button>
                    </div>
                    <CardDescription>
                      العقارات التي أضفتها إلى المفضلة
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {favoritesLoading ? (
                        <div className="text-center py-8">
                          <FaSpinner className="h-8 w-8 mx-auto mb-4 text-[#39FF14] animate-spin" />
                          <p className="text-gray-400">جاري تحميل المفضلة...</p>
                        </div>
                      ) : favorites && favorites.length > 0 ? (
                        favorites.slice(0, 3).map(favorite => (
                          <div key={favorite.id} className="flex items-start space-x-4 rtl:space-x-reverse bg-gray-800/50 rounded-lg p-3">
                            <div className="w-20 h-20 overflow-hidden rounded-md flex-shrink-0">
                              <img 
                                src={favorite.propertyImage || "https://via.placeholder.com/80"} 
                                alt={favorite.propertyName} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white truncate">{favorite.propertyName}</h4>
                              <div className="flex items-center text-sm text-gray-400 mt-1">
                                <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                                <span>{favorite.location || "موقع غير محدد"}</span>
                              </div>
                              <div className="mt-2 flex justify-between items-center">
                                <div className="text-[#39FF14] font-medium">${favorite.price || "N/A"}</div>
                                <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                                  <FaCalendarAlt className="mr-1 h-3 w-3" />
                                  حجز
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
                            <FaHeart className="h-6 w-6 text-gray-500" />
                          </div>
                          <h4 className="text-gray-400 font-medium">لا توجد عقارات مفضلة</h4>
                          <p className="text-gray-500 text-sm mt-1">أضف بعض العقارات إلى المفضلة</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        );
        
      case 'bookings':
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#39FF14]">حجوزاتي</CardTitle>
              <CardDescription>عرض وإدارة جميع حجوزاتك</CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="text-center py-12">
                  <FaSpinner className="h-8 w-8 mx-auto mb-4 text-[#39FF14] animate-spin" />
                  <p className="text-gray-400">جاري تحميل الحجوزات...</p>
                </div>
              ) : bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start space-x-4 rtl:space-x-reverse">
                          <div className="w-20 h-20 overflow-hidden rounded-md flex-shrink-0">
                            <img 
                              src={booking.propertyImage || "https://via.placeholder.com/80"} 
                              alt={booking.propertyName} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{booking.propertyName}</h4>
                            <div className="flex items-center text-sm text-gray-400 mt-1">
                              <FaMapMarkerAlt className="mr-1 h-3 w-3" />
                              <span>{booking.location || "موقع غير محدد"}</span>
                            </div>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse mt-2">
                              <Badge className={booking.status === 'confirmed' ? 'bg-green-500 hover:bg-green-600' : 
                                               booking.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : 
                                               'bg-red-500 hover:bg-red-600'}>
                                {booking.status === 'confirmed' ? 'مؤكد' : 
                                booking.status === 'pending' ? 'قيد الانتظار' : 'ملغي'}
                              </Badge>
                              <span className="text-[#39FF14] font-medium">${booking.totalPrice}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-400">من:</span> <span className="text-white">{formatDate(booking.checkInDate)}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">إلى:</span> <span className="text-white">{formatDate(booking.checkOutDate)}</span>
                          </div>
                          <Button variant="outline" size="sm" className="mt-2 border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10">
                            <FaEye className="mr-1 h-3 w-3" />
                            التفاصيل
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <FaCalendarAlt className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">لا توجد حجوزات</h3>
                  <p className="text-gray-400 max-w-md mx-auto mb-6">
                    لم تقم بإجراء أي حجوزات حتى الآن. اكتشف العقارات المتاحة واحجز إقامتك الآن.
                  </p>
                  <Button 
                    className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
                    onClick={() => navigate("/")}
                  >
                    <FaHome className="mr-2 h-4 w-4" />
                    استكشاف العقارات
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      case 'favorites':
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#39FF14]">العقارات المفضلة</CardTitle>
              <CardDescription>العقارات التي أضفتها إلى المفضلة</CardDescription>
            </CardHeader>
            <CardContent>
              {favoritesLoading ? (
                <div className="text-center py-12">
                  <FaSpinner className="h-8 w-8 mx-auto mb-4 text-[#39FF14] animate-spin" />
                  <p className="text-gray-400">جاري تحميل المفضلة...</p>
                </div>
              ) : favorites && favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map(favorite => (
                    <div key={favorite.id} className="bg-gray-800/50 rounded-lg overflow-hidden group">
                      <div className="h-48 overflow-hidden relative">
                        <img 
                          src={favorite.propertyImage || "https://via.placeholder.com/300x200"} 
                          alt={favorite.propertyName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <Button variant="ghost" size="icon" className="bg-black/50 hover:bg-black/70 text-white hover:text-red-500 h-8 w-8 rounded-full">
                            <FaHeart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-white truncate">{favorite.propertyName}</h4>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                          <span className="truncate">{favorite.location || "موقع غير محدد"}</span>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                          <div className="text-[#39FF14] font-medium">${favorite.price || "N/A"}</div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10"
                            onClick={() => navigate(`/properties/${favorite.propertyId}`)}
                          >
                            <FaCalendarAlt className="mr-1 h-3 w-3" />
                            حجز
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <FaHeart className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">لا توجد عقارات مفضلة</h3>
                  <p className="text-gray-400 max-w-md mx-auto mb-6">
                    لم تضف أي عقارات إلى قائمة المفضلة حتى الآن. استكشف العقارات وأضف المفضلة لديك.
                  </p>
                  <Button 
                    className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
                    onClick={() => navigate("/")}
                  >
                    <FaHome className="mr-2 h-4 w-4" />
                    استكشاف العقارات
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
        
      case 'profile':
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#39FF14]">الملف الشخصي</CardTitle>
              <CardDescription>عرض وتعديل معلوماتك الشخصية</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-[#39FF14]/30">
                  <AvatarImage src={user?.photoURL || ""} alt={user?.name || "المستخدم"} />
                  <AvatarFallback className="bg-[#39FF14]/10 text-[#39FF14] text-xl">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-white mb-1">{user?.name || "مستخدم"}</h3>
                <p className="text-gray-400 mb-6">{user?.email}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                  <Button variant="outline" className="border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10">
                    <FaUser className="mr-2 h-4 w-4" />
                    تعديل الملف الشخصي
                  </Button>
                  <Button variant="outline" className="border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10"
                    onClick={() => handleTabChange("settings")}
                  >
                    <FaCog className="mr-2 h-4 w-4" />
                    الإعدادات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'settings':
        return (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#39FF14]">الإعدادات</CardTitle>
              <CardDescription>تخصيص إعدادات حسابك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2 flex items-center">
                    <FaUser className="mr-2 h-4 w-4 text-[#39FF14]" />
                    معلومات الحساب
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">تعديل البريد الإلكتروني وكلمة المرور وإعدادات الأمان</p>
                  <Button variant="outline" className="border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10">
                    تعديل
                  </Button>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2 flex items-center">
                    <FaBell className="mr-2 h-4 w-4 text-[#39FF14]" />
                    الإشعارات
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">تخصيص إعدادات الإشعارات والتنبيهات</p>
                  <Button variant="outline" className="border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10">
                    تعديل
                  </Button>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2 flex items-center">
                    <FaCreditCard className="mr-2 h-4 w-4 text-[#39FF14]" />
                    وسائل الدفع
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">إدارة بطاقات الائتمان وطرق الدفع</p>
                  <Button variant="outline" className="border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10">
                    تعديل
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
                  onClick={() => {
                    setSelectedTab('dashboard');
                    navigate('/customer/dashboard');
                  }}
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
              مرحباً، <span className="text-[#39FF14]">{user?.name || "مستخدم"}</span>
            </h1>
            <p className="text-gray-400">
              ابحث عن أفضل العقارات للإقامة، واحجز بسهولة، وتابع حجوزاتك بكل سهولة من مكان واحد.
            </p>
          </div>
          
          <div className="flex justify-center md:justify-end gap-3">
            <Button 
              className="bg-[#39FF14] hover:bg-[#39FF14]/90 text-black"
              onClick={() => navigate("/")}
            >
              <FaHome className="mr-2 h-4 w-4" />
              تصفح العقارات
            </Button>
            <Button 
              variant="outline" 
              className="border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/10"
              onClick={() => handleTabChange("bookings")}
            >
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
            value="bookings"
            className="py-3 px-4 md:px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none whitespace-nowrap"
          >
            الحجوزات
          </TabsTrigger>
          <TabsTrigger 
            value="favorites"
            className="py-3 px-4 md:px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none whitespace-nowrap"
          >
            المفضلة
          </TabsTrigger>
          <TabsTrigger 
            value="profile"
            className="py-3 px-4 md:px-6 data-[state=active]:border-b-2 data-[state=active]:border-[#39FF14] data-[state=active]:text-[#39FF14] rounded-none bg-transparent data-[state=active]:shadow-none whitespace-nowrap"
          >
            الملف الشخصي
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab} className="pt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
}