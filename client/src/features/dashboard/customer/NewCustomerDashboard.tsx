import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FaCalendarAlt, 
  FaHeart, 
  FaCreditCard, 
  FaRegStar,
  FaSpinner,
  FaMapMarkerAlt,
  FaBed,
  FaUser,
  FaChartLine,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaTachometerAlt,
  FaHome,
  FaWallet
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

interface FavoriteProperty {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  price: number;
  location: string;
  addedAt: any;
}

export default function NewCustomerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  
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
        return <Badge className="bg-green-500 hover:bg-green-600">مؤكد</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">قيد الانتظار</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">ملغي</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">{status}</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar - only visible on desktop */}
      <div className="hidden md:flex md:w-64 flex-col bg-black border-r border-[#39FF14]/20 shadow-lg">
        <div className="p-6 border-b border-[#39FF14]/20">
          <div className="flex items-center justify-center mb-4">
            <div className="text-4xl font-bold text-[#39FF14] tracking-tighter">
              StayX
              <div className="text-xs text-gray-400 tracking-normal font-normal">منصة العقارات الفاخرة</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center pt-4">
            <Avatar className="h-24 w-24 border-2 border-[#39FF14]/50 shadow-lg shadow-[#39FF14]/10 bg-gradient-to-br from-gray-900 to-gray-800 mb-3">
              <AvatarImage src={user?.photoURL || ""} alt={user?.name || "العميل"} />
              <AvatarFallback className="bg-gray-800 text-[#39FF14] animate-pulse text-2xl">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "م"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-white mb-0.5">{user?.name || "العميل"}</h2>
            <p className="text-gray-400 text-sm mb-4">{user?.email}</p>
            <Badge className="bg-[#39FF14]/20 text-[#39FF14] hover:bg-[#39FF14]/30 border-none">عميل عضوية فضية</Badge>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1 text-white hover:text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors relative group"
              onClick={() => setActiveTab("dashboard")}
            >
              <div className={`absolute inset-y-0 left-0 w-1 transition-all ${activeTab === "dashboard" ? "bg-[#39FF14]" : "bg-transparent group-hover:bg-[#39FF14]/50"}`}></div>
              <FaTachometerAlt className="mr-2 h-5 w-5" />
              <span>لوحة التحكم</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1 text-white hover:text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors relative group"
              onClick={() => setActiveTab("bookings")}
            >
              <div className={`absolute inset-y-0 left-0 w-1 transition-all ${activeTab === "bookings" ? "bg-[#39FF14]" : "bg-transparent group-hover:bg-[#39FF14]/50"}`}></div>
              <FaCalendarAlt className="mr-2 h-5 w-5" />
              <span>الحجوزات</span>
              <Badge className="mr-auto bg-[#39FF14] text-black">{bookings.length}</Badge>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1 text-white hover:text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors relative group"
              onClick={() => setActiveTab("favorites")}
            >
              <div className={`absolute inset-y-0 left-0 w-1 transition-all ${activeTab === "favorites" ? "bg-[#39FF14]" : "bg-transparent group-hover:bg-[#39FF14]/50"}`}></div>
              <FaHeart className="mr-2 h-5 w-5" />
              <span>المفضلة</span>
              <Badge className="mr-auto bg-[#39FF14] text-black">{favorites.length}</Badge>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1 text-white hover:text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors relative group"
              onClick={() => setActiveTab("settings")}
            >
              <div className={`absolute inset-y-0 left-0 w-1 transition-all ${activeTab === "settings" ? "bg-[#39FF14]" : "bg-transparent group-hover:bg-[#39FF14]/50"}`}></div>
              <FaCog className="mr-2 h-5 w-5" />
              <span>الإعدادات</span>
            </Button>
          </div>
          
          <div className="pt-6 mt-6 border-t border-[#39FF14]/10">
            <div className="text-xs uppercase text-gray-500 mb-3 px-3">روابط سريعة</div>
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start mb-1 text-white hover:text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors"
              >
                <FaHome className="mr-2 h-5 w-5" />
                <span>الصفحة الرئيسية</span>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start mb-1 text-white hover:text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors"
              >
                <FaBell className="mr-2 h-5 w-5" />
                <span>الإشعارات</span>
                <Badge className="mr-auto bg-[#39FF14] text-black">2</Badge>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start mb-1 text-white hover:text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors"
              >
                <FaWallet className="mr-2 h-5 w-5" />
                <span>المحفظة</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-[#39FF14]/20">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-white hover:text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <FaSignOutAlt className="mr-2 h-5 w-5" />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar */}
        <header className="bg-black backdrop-blur-md border-b border-[#39FF14]/20 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Button variant="ghost" className="md:hidden text-[#39FF14] hover:bg-[#39FF14]/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="text-[#39FF14]">
                {activeTab === "dashboard" && <FaTachometerAlt />}
                {activeTab === "bookings" && <FaCalendarAlt />}
                {activeTab === "favorites" && <FaHeart />}
                {activeTab === "settings" && <FaCog />}
              </span>
              {activeTab === "dashboard" && "لوحة التحكم"}
              {activeTab === "bookings" && "الحجوزات"}
              {activeTab === "favorites" && "المفضلة"}
              {activeTab === "settings" && "الإعدادات"}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Button size="sm" variant="outline" className="border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/10 hidden md:flex">
              <FaBed className="mr-2 h-4 w-4" />
              احجز عقاراً
            </Button>
            
            <div className="bg-gray-800 rounded-full p-2 cursor-pointer hover:bg-gray-700 transition-colors relative">
              <FaBell className="h-5 w-5 text-[#39FF14]" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-800/60 backdrop-blur-sm py-1 px-3 rounded-full md:hidden">
              <Avatar className="h-8 w-8 border border-[#39FF14]/30">
                <AvatarImage src={user?.photoURL || ""} alt={user?.name || "العميل"} />
                <AvatarFallback className="bg-gray-800 text-[#39FF14] text-xs">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "م"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-4 md:p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <Card className="bg-black border border-[#39FF14]/20 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent opacity-70"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#39FF14]/5 rounded-full blur-3xl"></div>
                <div className="absolute top-20 left-20 w-32 h-32 bg-[#39FF14]/5 rounded-full blur-2xl"></div>
                
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-[#39FF14]/30 shadow-lg shadow-[#39FF14]/10">
                        <AvatarImage src={user?.photoURL || ""} alt={user?.name || "العميل"} />
                        <AvatarFallback className="bg-gray-800 text-[#39FF14] animate-pulse">
                          {user?.name?.charAt(0) || user?.email?.charAt(0) || "م"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-2xl font-bold text-white">
                          مرحباً، <span className="text-[#39FF14] drop-shadow-[0_0_2px_rgba(57,255,20,0.7)]">{user?.name || "العميل"}</span>
                        </h1>
                        <p className="text-gray-400 text-sm">نتمنى لك يوماً سعيداً</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-[#39FF14] text-black hover:bg-[#50FF30] shadow-[0_0_10px_rgba(57,255,20,0.3)]">
                        <FaBed className="mr-2 h-4 w-4" /> احجز عقاراً
                      </Button>
                      <Button variant="outline" className="border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/10">
                        <FaUser className="mr-2 h-4 w-4" /> تحديث الملف الشخصي
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* الحجوزات */}
                <Card className="bg-black border border-[#39FF14]/20 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent opacity-70"></div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#39FF14]/5 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  
                  <CardHeader className="flex flex-row items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="h-5 w-5 text-[#39FF14]" />
                      <CardTitle className="text-lg font-medium">الحجوزات</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-[#39FF14] drop-shadow-[0_0_2px_rgba(57,255,20,0.3)]">{bookings.length}</div>
                    <div className="text-sm text-gray-400 mt-1">إجمالي الحجوزات</div>
                  </CardContent>
                </Card>
                
                {/* المفضلة */}
                <Card className="bg-black border border-[#39FF14]/20 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent opacity-70"></div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#39FF14]/5 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  
                  <CardHeader className="flex flex-row items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <FaHeart className="h-5 w-5 text-[#39FF14]" />
                      <CardTitle className="text-lg font-medium">المفضلة</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-[#39FF14] drop-shadow-[0_0_2px_rgba(57,255,20,0.3)]">{favorites.length}</div>
                    <div className="text-sm text-gray-400 mt-1">العقارات المفضلة</div>
                  </CardContent>
                </Card>
                
                {/* المدفوعات */}
                <Card className="bg-black border border-[#39FF14]/20 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent opacity-70"></div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#39FF14]/5 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  
                  <CardHeader className="flex flex-row items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <FaCreditCard className="h-5 w-5 text-[#39FF14]" />
                      <CardTitle className="text-lg font-medium">المدفوعات</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-[#39FF14] drop-shadow-[0_0_2px_rgba(57,255,20,0.3)]">$0</div>
                    <div className="text-sm text-gray-400 mt-1">إجمالي المدفوعات</div>
                  </CardContent>
                </Card>
                
                {/* خدمات مميزة */}
                <Card className="bg-black border border-[#39FF14]/20 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.1)] transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#39FF14]/70 to-transparent opacity-70"></div>
                  <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#39FF14]/10 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  
                  <CardHeader className="flex flex-row items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <FaRegStar className="h-5 w-5 text-[#39FF14]" />
                      <CardTitle className="text-lg font-medium">خدمات مميزة</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-start gap-2">
                      <Badge className="bg-[#39FF14]/10 hover:bg-[#39FF14]/20 text-[#39FF14] border-none">
                        مساج
                      </Badge>
                      <Badge className="bg-[#39FF14]/10 hover:bg-[#39FF14]/20 text-[#39FF14] border-none">
                        رحلات بحرية
                      </Badge>
                      <Badge className="bg-[#39FF14]/10 hover:bg-[#39FF14]/20 text-[#39FF14] border-none">
                        حفلات
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Activity & Favorites */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="bg-black border border-[#39FF14]/20 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)] lg:col-span-2">
                  <CardHeader className="border-b border-[#39FF14]/10 pb-3">
                    <CardTitle className="flex items-center">
                      <FaChartLine className="mr-2 h-5 w-5 text-[#39FF14]" />
                      نشاط الحساب
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.slice(0, 3).map((booking) => (
                          <div key={booking.id} className="flex items-center gap-4 border-b border-gray-800 pb-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                              {booking.propertyImage ? (
                                <img 
                                  src={booking.propertyImage} 
                                  alt={booking.propertyName} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-[#39FF14]">
                                  <FaBed className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="text-base font-bold">{booking.propertyName}</h3>
                                <div className="flex flex-col items-end">
                                  <span className="text-[#39FF14] font-mono font-bold">${booking.totalPrice}</span>
                                  {getStatusBadge(booking.status)}
                                </div>
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                <span className="inline-flex items-center gap-1">
                                  <FaCalendarAlt className="h-3 w-3" /> 
                                  {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {bookings.length > 3 && (
                          <Button 
                            variant="outline" 
                            className="w-full text-[#39FF14] border-[#39FF14]/20 hover:bg-[#39FF14]/10"
                            onClick={() => setActiveTab("bookings")}
                          >
                            عرض كل الحجوزات ({bookings.length})
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <FaCalendarAlt className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد حجوزات</h3>
                        <p className="text-gray-400 mb-4">لم تقم بأي حجوزات حتى الآن</p>
                        <Button className="bg-[#39FF14] text-black hover:bg-[#50FF30]">
                          <FaBed className="mr-2 h-4 w-4" /> احجز الآن
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Favorites */}
                <Card className="bg-black border border-[#39FF14]/20 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                  <CardHeader className="border-b border-[#39FF14]/10 pb-3">
                    <CardTitle className="flex items-center">
                      <FaHeart className="mr-2 h-5 w-5 text-[#39FF14]" />
                      المفضلة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {favorites.length > 0 ? (
                      <div className="space-y-4">
                        {favorites.slice(0, 3).map((fav) => (
                          <div key={fav.id} className="flex items-center gap-4 border-b border-gray-800 pb-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                              {fav.propertyImage ? (
                                <img 
                                  src={fav.propertyImage} 
                                  alt={fav.propertyName} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-[#39FF14]">
                                  <FaBed className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="text-base font-bold">{fav.propertyName}</h3>
                                <span className="text-[#39FF14] font-mono font-bold">${fav.price}</span>
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                <span className="inline-flex items-center gap-1">
                                  <FaMapMarkerAlt className="h-3 w-3" /> 
                                  {fav.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {favorites.length > 3 && (
                          <Button 
                            variant="outline" 
                            className="w-full text-[#39FF14] border-[#39FF14]/20 hover:bg-[#39FF14]/10"
                            onClick={() => setActiveTab("favorites")}
                          >
                            عرض كل المفضلة ({favorites.length})
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <FaHeart className="h-12 w-12 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">لا توجد عقارات مفضلة</h3>
                        <p className="text-gray-400 mb-4">لم تقم بإضافة أي عقارات للمفضلة حتى الآن</p>
                        <Button className="bg-[#39FF14] text-black hover:bg-[#50FF30]">
                          <FaHome className="mr-2 h-4 w-4" /> استكشف العقارات
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <Card className="bg-black border border-[#39FF14]/20 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]">
              <CardHeader className="border-b border-[#39FF14]/10 pb-3 flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <FaCalendarAlt className="mr-2 h-5 w-5 text-[#39FF14]" />
                  حجوزاتي
                </CardTitle>
                <Button className="bg-[#39FF14] text-black hover:bg-[#50FF30]">
                  <FaBed className="mr-2 h-4 w-4" /> حجز جديد
                </Button>
              </CardHeader>
              <CardContent className="p-6">
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
                    <h3 className="text-xl font-semibold mb-2">لا توجد حجوزات</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      لم تقم بإجراء أي حجوزات حتى الآن. استكشف العقارات المتاحة وقم بالحجز الآن.
                    </p>
                    <Button className="bg-[#39FF14] text-black hover:bg-[#50FF30]">
                      <FaBed className="mr-2 h-4 w-4" />
                      استكشف العقارات
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="flex flex-col md:flex-row gap-6 border-b border-gray-800 pb-6">
                        <div className="w-full md:w-1/4 h-48 md:h-32 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                          {booking.propertyImage ? (
                            <img 
                              src={booking.propertyImage} 
                              alt={booking.propertyName} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-[#39FF14]">
                              <FaBed className="h-12 w-12" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold">{booking.propertyName}</h3>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="text-sm text-gray-400 space-y-1">
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="h-4 w-4 text-[#39FF14]" /> 
                                <span>
                                  تاريخ الحجز: {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaCreditCard className="h-4 w-4 text-[#39FF14]" /> 
                                <span>
                                  المبلغ: <span className="text-white font-bold">${booking.totalPrice}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-4">
                            <Button 
                              variant="outline" 
                              className="text-[#39FF14] border-[#39FF14]/20 hover:bg-[#39FF14]/10"
                            >
                              عرض التفاصيل
                            </Button>
                            {booking.status === 'pending' && (
                              <Button variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                                إلغاء الحجز
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <Card className="bg-black border border-[#39FF14]/20 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]">
              <CardHeader className="border-b border-[#39FF14]/10 pb-3">
                <CardTitle className="flex items-center">
                  <FaHeart className="mr-2 h-5 w-5 text-[#39FF14]" />
                  العقارات المفضلة
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
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
                      لم تقم بإضافة أي عقارات للمفضلة. استكشف العقارات المتاحة وأضف ما يناسبك للمفضلة.
                    </p>
                    <Button className="bg-[#39FF14] text-black hover:bg-[#50FF30]">
                      <FaHome className="mr-2 h-4 w-4" />
                      استكشف العقارات
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((favorite) => (
                      <div 
                        key={favorite.id}
                        className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-[#39FF14]/30 transition-colors group"
                      >
                        <div className="h-48 overflow-hidden relative">
                          {favorite.propertyImage ? (
                            <img 
                              src={favorite.propertyImage} 
                              alt={favorite.propertyName} 
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-[#39FF14]">
                              <FaBed className="h-12 w-12" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full">
                            <FaHeart className="h-5 w-5 text-red-500" />
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold">{favorite.propertyName}</h3>
                            <div className="text-[#39FF14] font-mono font-bold">${favorite.price}</div>
                          </div>
                          <div className="text-sm text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                              <FaMapMarkerAlt className="h-3 w-3" /> 
                              {favorite.location}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1 bg-[#39FF14] text-black hover:bg-[#50FF30]"
                            >
                              حجز
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1 text-white border-gray-700 hover:bg-gray-800"
                            >
                              التفاصيل
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Settings Tab */}
          {activeTab === "settings" && (
            <Card className="bg-black border border-[#39FF14]/20 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]">
              <CardHeader className="border-b border-[#39FF14]/10 pb-3">
                <CardTitle className="flex items-center">
                  <FaCog className="mr-2 h-5 w-5 text-[#39FF14]" />
                  إعدادات الحساب
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Profile Settings Section */}
                  <div>
                    <h3 className="text-lg font-medium text-[#39FF14] mb-4">المعلومات الشخصية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col items-center md:items-start">
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
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">الاسم</label>
                          <div className="bg-gray-900 p-3 rounded-md border border-gray-800">{user?.name || "غير محدد"}</div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">البريد الإلكتروني</label>
                          <div className="bg-gray-900 p-3 rounded-md border border-gray-800">{user?.email || "غير محدد"}</div>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 block mb-1">رقم الهاتف</label>
                          <div className="bg-gray-900 p-3 rounded-md border border-gray-800">{user?.phone || "غير محدد"}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button className="bg-[#39FF14] text-black hover:bg-[#50FF30]">
                        تحديث المعلومات الشخصية
                      </Button>
                    </div>
                  </div>
                  
                  {/* Appearance Settings */}
                  <div className="pt-8 border-t border-gray-800">
                    <h3 className="text-lg font-medium text-[#39FF14] mb-4">المظهر والإعدادات</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <Card className="bg-gray-900 border-gray-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-lg font-medium">اللغة</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-base font-medium text-[#39FF14]">{user?.settings?.language === 'ar' ? "العربية" : "English"}</div>
                          <div className="text-xs text-gray-400 mt-1">لغة الواجهة الحالية</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-900 border-gray-800 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-lg font-medium">الإشعارات</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-base font-medium text-[#39FF14]">{user?.settings?.emailNotifications ? "مفعلة" : "غير مفعلة"}</div>
                          <div className="text-xs text-gray-400 mt-1">حالة إشعارات البريد الإلكتروني</div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-900 border-gray-800 text-white">
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
                    
                    <div className="flex justify-end">
                      <Button className="bg-[#39FF14] text-black hover:bg-[#50FF30]">
                        تحديث الإعدادات
                      </Button>
                    </div>
                  </div>
                  
                  {/* Security Settings */}
                  <div className="pt-8 border-t border-gray-800">
                    <h3 className="text-lg font-medium text-[#39FF14] mb-4">الأمان والخصوصية</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-4 border-b border-gray-800">
                        <div>
                          <h4 className="font-medium">تغيير كلمة المرور</h4>
                          <p className="text-sm text-gray-400">تحديث كلمة المرور الخاصة بك</p>
                        </div>
                        <Button variant="outline" className="border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/10">
                          تغيير
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between py-4 border-b border-gray-800">
                        <div>
                          <h4 className="font-medium">المصادقة الثنائية</h4>
                          <p className="text-sm text-gray-400">تأمين حسابك بمستوى إضافي من الحماية</p>
                        </div>
                        <Button variant="outline" className="border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/10">
                          تفعيل
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between py-4">
                        <div>
                          <h4 className="font-medium text-red-500">حذف الحساب</h4>
                          <p className="text-sm text-gray-400">سيتم حذف حسابك وجميع بياناتك بشكل نهائي</p>
                        </div>
                        <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                          حذف
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}