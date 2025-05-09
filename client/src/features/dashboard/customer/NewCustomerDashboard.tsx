import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc } from "firebase/firestore";
import { db, safeDoc } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { useLocation, useRoute } from "wouter";
import Logo from "@/components/Logo";
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

interface CustomerDashboardProps {
  activeTab?: string;
}

export default function NewCustomerDashboard({ activeTab = "dashboard" }: CustomerDashboardProps) {
  const { user, logout } = useAuth();
  const [_, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useState(activeTab);
  
  // Update selected tab when prop changes
  useEffect(() => {
    setSelectedTab(activeTab);
  }, [activeTab]);
  
  // Fetch user's bookings with enhanced caching and error handling
  // Use memo for stable query key to prevent unnecessary re-renders
  const bookingsQueryKey = useMemo(() => ["customer-bookings", user?.uid], [user?.uid]);
  
  const { data: bookings = [], isLoading: bookingsLoading, error: bookingsError } = useQuery({
    queryKey: bookingsQueryKey,
    queryFn: async () => {
      if (!user?.uid || !db) return [];
      
      // استخدام متغيرات مؤقتة للتخزين المؤقت لتجنب أخطاء الشاشة السوداء
      let cachedData = null;
      let cacheTimestamp = null;
      const now = Date.now();
      let cacheAge = Infinity;
      const maxCacheAge = 2 * 60 * 1000; // 2 دقائق
      
      try {
        // استخدام sessionStorage كطبقة تخزين مؤقت إضافية لتحسين الأداء
        cachedData = sessionStorage.getItem(`bookings_${user.uid}`);
        cacheTimestamp = sessionStorage.getItem(`bookings_${user.uid}_timestamp`);
        
        // تحقق من وجود بيانات مخزنة مؤقتاً صالحة (أقل من 2 دقائق)
        cacheAge = cacheTimestamp ? now - parseInt(cacheTimestamp) : Infinity;

        if (cachedData && cacheAge < maxCacheAge) {
          console.log("استخدام البيانات المخزنة مؤقتاً للحجوزات");
          return JSON.parse(cachedData);
        }
      } catch (e) {
        console.error("خطأ في قراءة التخزين المؤقت:", e);
        // استمر في تنفيذ الاستعلام
      }
      
      try {
        return await safeDoc(async () => {
          // تأكد من وجود db قبل الاستخدام
          if (!db) {
            console.error("Firestore غير متوفر");
            return [];
          }
          
          console.log("جلب بيانات الحجوزات من Firestore...");
          
          // قم بتجربة الاستعلام أولاً للتحقق من توفر المجموعة
          const bookingsCollectionRef = collection(db, "bookings");
        
          // إعداد الاستعلام لجلب حجوزات المستخدم، مرتبة حسب تاريخ الإنشاء تنازلياً
          // تحسين الاستعلام باستخدام حدود لتقليل كمية البيانات المنقولة
          const q = query(
            bookingsCollectionRef, 
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(20) // جلب أحدث 20 حجز فقط لتحسين الأداء
          );
        
        // تنفيذ الاستعلام واستخراج المستندات
        const snapshot = await getDocs(q);
        
        // استخراج البيانات والمعلومات التفصيلية
        const bookingsWithDetails: Booking[] = [];
        const propertyCache: Record<string, { name: string, imageUrl: string }> = {};
        
        // معالجة كل مستند حجز
        for (const docSnap of snapshot.docs) {
          if (!docSnap.exists()) continue; // تخطي المستندات غير الموجودة
          
          const bookingData = docSnap.data();
          
          // تعيين القيم الافتراضية
          let propertyName = "عقار غير معروف";
          let propertyImage = "";
          
          // استرجاع معلومات العقار إذا كان معرف العقار موجود
          if (bookingData.propertyId) {
            try {
              // التحقق من الكاش أولاً للحد من طلبات Firestore
              if (propertyCache[bookingData.propertyId]) {
                const cachedData = propertyCache[bookingData.propertyId];
                propertyName = cachedData.name;
                propertyImage = cachedData.imageUrl;
              } else {
                // استرجاع بيانات العقار من Firestore
                if (!db) {
                  console.error("Firestore غير متوفر");
                  continue; // تخطي هذه الحلقة
                }
                const propertyDocRef = doc(db, "properties", bookingData.propertyId);
                const propertyDocSnap = await getDoc(propertyDocRef);
                
                if (propertyDocSnap.exists()) {
                  const propertyData = propertyDocSnap.data();
                  propertyName = propertyData.name || propertyName;
                  propertyImage = propertyData.imageUrl || "";
                  
                  // تخزين البيانات في الكاش للاستخدام اللاحق
                  propertyCache[bookingData.propertyId] = {
                    name: propertyName,
                    imageUrl: propertyImage
                  };
                }
              }
            } catch (error) {
              console.error("خطأ في استرجاع تفاصيل العقار:", error);
              // نستمر بدون أي تأثير على تجربة المستخدم
            }
          }
          
          // إضافة الحجز مع بيانات العقار المستخرجة والتأكد من وجود جميع الحقول المطلوبة
          const booking: Booking = {
            id: docSnap.id,
            propertyId: bookingData.propertyId || "",
            propertyName,
            propertyImage,
            checkInDate: bookingData.checkInDate || new Date(),
            checkOutDate: bookingData.checkOutDate || new Date(),
            totalPrice: bookingData.totalPrice || 0,
            // التأكد من وجود حالة صالحة
            status: ["pending", "confirmed", "cancelled"].includes(bookingData.status)
              ? bookingData.status as 'pending' | 'confirmed' | 'cancelled'
              : "pending",
            createdAt: bookingData.createdAt || new Date(),
            ...bookingData // إضافة أي حقول إضافية
          };
          
          bookingsWithDetails.push(booking);
        }
        
        console.log(`تم استرجاع ${bookingsWithDetails.length} حجز بنجاح`);
        
        // تخزين البيانات مؤقتاً لتحسين الأداء في المرات القادمة
        try {
          sessionStorage.setItem(`bookings_${user.uid}`, JSON.stringify(bookingsWithDetails));
          sessionStorage.setItem(`bookings_${user.uid}_timestamp`, now.toString());
        } catch (cacheError) {
          console.warn("تعذر تخزين بيانات الحجوزات مؤقتاً:", cacheError);
        }
        
        return bookingsWithDetails;
      });
      } catch (error) {
        console.error("خطأ في استرجاع الحجوزات:", error);
        // إرجاع مصفوفة فارغة لتجنب انهيار التطبيق
        return [];
      }
    },
    enabled: Boolean(user?.uid) && Boolean(db),
    staleTime: 5 * 60 * 1000, // تخزين البيانات لمدة 5 دقائق قبل إعادة الاستعلام
    retry: 2, // محاولة إعادة الاستعلام مرتين في حالة الفشل
    refetchOnWindowFocus: false
  });
  
  // Fetch user's favorite properties
  // Use memo for stable query key to prevent duplicate requests
  const favoritesQueryKey = useMemo(() => ["customer-favorites", user?.uid], [user?.uid]);
  
  const { data: favorites = [], isLoading: favoritesLoading, error: favoritesError } = useQuery({
    queryKey: favoritesQueryKey,
    queryFn: async () => {
      if (!user?.uid || !db) return [];
      
      // استخدام متغيرات مؤقتة للتخزين المؤقت لتجنب أخطاء الشاشة السوداء
      let cachedData = null;
      let cacheTimestamp = null;
      const now = Date.now();
      let cacheAge = Infinity;
      const maxCacheAge = 2 * 60 * 1000; // 2 دقائق
      
      try {
        // استخدام sessionStorage كطبقة تخزين مؤقت إضافية لتحسين الأداء
        cachedData = sessionStorage.getItem(`favorites_${user.uid}`);
        cacheTimestamp = sessionStorage.getItem(`favorites_${user.uid}_timestamp`);
        
        // تحقق من وجود بيانات مخزنة مؤقتاً صالحة (أقل من 2 دقائق)
        cacheAge = cacheTimestamp ? now - parseInt(cacheTimestamp) : Infinity;

        if (cachedData && cacheAge < maxCacheAge) {
          console.log("استخدام البيانات المخزنة مؤقتاً للمفضلات");
          return JSON.parse(cachedData);
        }
      } catch (e) {
        console.error("خطأ في قراءة التخزين المؤقت للمفضلات:", e);
        // استمر في تنفيذ الاستعلام
      }
      
      // بيانات المفضلات الافتراضية (لتجنب أخطاء إذا فشل الاستعلام)
      const mockFavorites: FavoriteProperty[] = [
        // لا توجد بيانات حتى يتم جلبها من Firestore
      ];
      
      try {
        console.log("جلب بيانات المفضلات من Firestore...");
        
        // محاولة جلب بيانات المفضلة - في حالة وجود خطأ في الصلاحيات، سنعيد المصفوفة الفارغة
        try {
          // قم بتجربة الاستعلام أولاً للتحقق من توفر المجموعة
          const favoritesCollectionRef = collection(db, "favorites");
          
          // إعداد الاستعلام لجلب مفضلات المستخدم
          const q = query(
            favoritesCollectionRef, 
            where("userId", "==", user.uid)
          );
          
          // تنفيذ الاستعلام واستخراج المستندات
          const snapshot = await getDocs(q);
          
          // استخراج البيانات والمعلومات التفصيلية
          const favoritesWithDetails: FavoriteProperty[] = [];
          const propertyCache: Record<string, { name: string, imageUrl: string, price: number, location: string }> = {};
          
          // معالجة كل مستند مفضلة
          for (const docSnap of snapshot.docs) {
            if (!docSnap.exists()) continue; // تخطي المستندات غير الموجودة
            
            const favoriteData = docSnap.data();
            
            // استرجاع معلومات العقار إذا كان معرف العقار موجود
            if (favoriteData.propertyId) {
              try {
                // التحقق من الكاش أولاً للحد من طلبات Firestore
                if (propertyCache[favoriteData.propertyId]) {
                  const cachedData = propertyCache[favoriteData.propertyId];
                  favoritesWithDetails.push({
                    id: docSnap.id,
                    propertyId: favoriteData.propertyId,
                    propertyName: cachedData.name,
                    propertyImage: cachedData.imageUrl,
                    price: cachedData.price,
                    location: cachedData.location,
                    addedAt: favoriteData.createdAt || new Date()
                  });
                } else {
                  // استرجاع بيانات العقار من Firestore
                  const propertyDocRef = doc(db, "properties", favoriteData.propertyId);
                  const propertyDocSnap = await getDoc(propertyDocRef);
                  
                  if (propertyDocSnap.exists()) {
                    const propertyData = propertyDocSnap.data();
                    const propertyName = propertyData.name || 'عقار غير معروف';
                    const propertyImage = propertyData.imageUrl || '';
                    const price = propertyData.price || 0;
                    const location = propertyData.location || '';
                    
                    // إضافة العقار إلى المفضلة
                    favoritesWithDetails.push({
                      id: docSnap.id,
                      propertyId: favoriteData.propertyId,
                      propertyName,
                      propertyImage,
                      price,
                      location,
                      addedAt: favoriteData.createdAt || new Date()
                    });
                    
                    // تخزين البيانات في الكاش للاستخدام اللاحق
                    propertyCache[favoriteData.propertyId] = {
                      name: propertyName,
                      imageUrl: propertyImage,
                      price,
                      location
                    };
                  }
                }
              } catch (error) {
                console.error("خطأ في استرجاع تفاصيل العقار للمفضلة:", error);
                // نستمر بدون أي تأثير على تجربة المستخدم
              }
            }
          }
          
          console.log(`تم استرجاع ${favoritesWithDetails.length} عقار مفضل بنجاح`);
          
          // تخزين البيانات مؤقتاً لتحسين الأداء في المرات القادمة
          try {
            sessionStorage.setItem(`favorites_${user.uid}`, JSON.stringify(favoritesWithDetails));
            sessionStorage.setItem(`favorites_${user.uid}_timestamp`, now.toString());
          } catch (cacheError) {
            console.warn("تعذر تخزين بيانات المفضلات مؤقتاً:", cacheError);
          }
          
          return favoritesWithDetails;
        } catch (firestoreError) {
          console.error("خطأ في الوصول إلى مجموعة المفضلات (مشكلة صلاحيات):", firestoreError);
          // إرجاع مصفوفة فارغة في حالة خطأ الصلاحيات
          return mockFavorites;
        }
      } catch (error) {
        console.error("خطأ في استرجاع المفضلة:", error);
        // إرجاع مصفوفة فارغة لتجنب انهيار التطبيق
        return mockFavorites;
      }
    },
    enabled: Boolean(user?.uid) && Boolean(db),
    staleTime: 5 * 60 * 1000, // تخزين البيانات لمدة 5 دقائق قبل إعادة الاستعلام
    retry: 1, // محاولة إعادة الاستعلام مرة واحدة فقط في حالة الفشل
    refetchOnWindowFocus: false
  });
  
  const formatDate = (dateObj: any) => {
    if (!dateObj) return "غير محدد";
    
    try {
      // تعامل مع Firestore Timestamp
      if (dateObj && typeof dateObj === 'object' && 'toDate' in dateObj && typeof dateObj.toDate === 'function') {
        const date = dateObj.toDate();
        return date.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      // تعامل مع كائن Date
      if (dateObj instanceof Date) {
        return dateObj.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
      
      // تعامل مع سلسلة نصية أو timestamp
      if (typeof dateObj === 'string' || typeof dateObj === 'number') {
        const date = new Date(dateObj);
        if (!isNaN(date.getTime())) { // تحقق من أن التاريخ صالح
          return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      }
      
      // إذا فشلت كل المحاولات السابقة
      return "غير محدد";
    } catch (e) {
      console.error("خطأ في تنسيق التاريخ:", e);
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

  // حالة عدم الاتصال بالإنترنت أو Firestore
  const [isOffline, setIsOffline] = useState(false);
  
  // الاستماع لحالة الاتصال بالإنترنت
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };
    
    // التحقق من الحالة الأولية
    setIsOffline(!navigator.onLine);
    
    // إضافة المستمعين للاتصال
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // التنظيف عند إزالة المكون
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  // مراقبة أخطاء Firestore
  useEffect(() => {
    if (bookingsError || favoritesError) {
      setIsOffline(true);
    }
  }, [bookingsError, favoritesError]);

  return (
    <div className="min-h-screen bg-[#000005] text-white overflow-x-hidden">
      {/* إشعار عدم الاتصال */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 text-center z-50 shadow-md">
          <p className="flex items-center justify-center gap-2 text-sm font-medium">
            <span className="animate-pulse">●</span> 
            يبدو أنك غير متصل بالإنترنت أو يوجد مشكلة في الاتصال بقاعدة البيانات. بعض البيانات قد تكون غير محدثة.
          </p>
        </div>
      )}
      {/* Sidebar - only visible on desktop */}
      <div className="hidden md:flex md:w-64 flex-col bg-black border-r border-[#39FF14]/20 shadow-lg">
        <div className="p-6 border-b border-[#39FF14]/20">
          <div className="flex items-center justify-center mb-4">
            <Logo size="xl" variant="neon" withText={true} />
            <div className="text-xs text-gray-400 tracking-normal font-normal mt-2">منصة العقارات الفاخرة</div>
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
              onClick={() => {
                setSelectedTab("dashboard");
                navigate("/customer/dashboard");
              }}
            >
              <div className={`absolute inset-y-0 left-0 w-1 transition-all ${activeTab === "dashboard" ? "bg-[#39FF14]" : "bg-transparent group-hover:bg-[#39FF14]/50"}`}></div>
              <FaTachometerAlt className="mr-2 h-5 w-5" />
              <span>لوحة التحكم</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1 text-white hover:text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors relative group"
              onClick={() => {
                setSelectedTab("bookings");
                navigate("/customer/bookings");
              }}
            >
              <div className={`absolute inset-y-0 left-0 w-1 transition-all ${activeTab === "bookings" ? "bg-[#39FF14]" : "bg-transparent group-hover:bg-[#39FF14]/50"}`}></div>
              <FaCalendarAlt className="mr-2 h-5 w-5" />
              <span>الحجوزات</span>
              <Badge className="mr-auto bg-[#39FF14] text-black">{bookings.length}</Badge>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1 text-white hover:text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors relative group"
              onClick={() => {
                setSelectedTab("favorites");
                navigate("/customer/favorites");
              }}
            >
              <div className={`absolute inset-y-0 left-0 w-1 transition-all ${activeTab === "favorites" ? "bg-[#39FF14]" : "bg-transparent group-hover:bg-[#39FF14]/50"}`}></div>
              <FaHeart className="mr-2 h-5 w-5" />
              <span>المفضلة</span>
              <Badge className="mr-auto bg-[#39FF14] text-black">{favorites.length}</Badge>
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1 text-white hover:text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors relative group"
              onClick={() => {
                setSelectedTab("profile");
                navigate("/customer/profile");
              }}
            >
              <div className={`absolute inset-y-0 left-0 w-1 transition-all ${activeTab === "profile" ? "bg-[#39FF14]" : "bg-transparent group-hover:bg-[#39FF14]/50"}`}></div>
              <FaUser className="mr-2 h-5 w-5" />
              <span>الملف الشخصي</span>
            </Button>

            <Button 
              variant="ghost" 
              className="w-full justify-start mb-1 text-white hover:text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors relative group"
              onClick={() => {
                setSelectedTab("settings");
                navigate("/customer/settings");
              }}
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
                onClick={() => navigate("/")}
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
            onClick={() => {
              if (window.confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
                logout()
                  .then(() => {
                    console.log('تم تسجيل الخروج بنجاح');
                    navigate('/');
                  })
                  .catch(err => console.error('خطأ في تسجيل الخروج:', err));
              }
            }}
          >
            <FaSignOutAlt className="mr-2 h-5 w-5" />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar - Travel Dashboard Style */}
        <header className="bg-black/80 backdrop-blur-md shadow-lg px-5 py-4 flex items-center justify-between border-b border-[#39FF14]/10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="md:hidden text-[#39FF14] hover:bg-[#39FF14]/10 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            
            <div className="flex items-center md:hidden">
              <Logo size="sm" variant="neon" withText={true} />
            </div>
            
            <h1 className="text-xl font-bold hidden md:flex items-center gap-2">
              <span className="text-[#39FF14]">
                {selectedTab === "dashboard" && <FaTachometerAlt />}
                {selectedTab === "bookings" && <FaCalendarAlt />}
                {selectedTab === "favorites" && <FaHeart />}
                {selectedTab === "profile" && <FaUser />}
                {selectedTab === "settings" && <FaCog />}
              </span>
              {selectedTab === "dashboard" && "لوحة العميل"}
              {selectedTab === "bookings" && "حجوزاتي"}
              {selectedTab === "favorites" && "المفضلة"}
              {selectedTab === "profile" && "الملف الشخصي"}
              {selectedTab === "settings" && "الإعدادات"}
            </h1>
          </div>
          
          {/* Search Bar - Travel Dashboard Style */}
          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input 
                type="search" 
                className="block w-full p-2.5 pl-10 pr-4 text-sm bg-[#151820] border border-gray-700 rounded-lg focus:ring-[#39FF14] focus:border-[#39FF14] outline-none text-white" 
                placeholder="ابحث عن عقارات، حجوزات، او خدمات..." 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Currency Toggle */}
            <div className="hidden md:flex items-center bg-black/80 border border-[#39FF14]/20 rounded-lg overflow-hidden">
              <button className="px-2.5 py-1.5 bg-[#39FF14]/20 text-[#39FF14] text-sm font-medium hover:bg-[#39FF14]/30 transition-colors">USD</button>
              <button className="px-2.5 py-1.5 text-gray-400 text-sm font-medium hover:bg-black hover:text-white transition-colors">EGP</button>
            </div>
            
            {/* Notification */}
            <div className="relative p-2 bg-black/80 rounded-lg hover:bg-black transition-colors cursor-pointer border border-[#39FF14]/10">
              <FaBell className="h-5 w-5 text-gray-400 hover:text-[#39FF14]" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-[#39FF14] rounded-full animate-pulse"></span>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 p-1 border border-[#39FF14]/20 rounded-lg bg-black/80 cursor-pointer hover:border-[#39FF14]/40 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || ""} alt={user?.name || "العميل"} />
                <AvatarFallback className="bg-[#39FF14]/20 text-[#39FF14] text-xs">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "م"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-sm font-medium text-gray-200 mr-1">{user?.name?.split(' ')[0] || "العميل"}</div>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content - Travel Dashboard Style */}
        <main className="flex-1 overflow-y-auto bg-[#000005] p-4 md:p-5 pb-20 md:pb-5">
          {/* Dashboard Tab */}
          {selectedTab === "dashboard" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Travel Summary & Welcome Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {/* Welcome Card - Left Column */}
                <div className="md:col-span-2">
                  <Card className="bg-[#292C35] border-0 rounded-xl shadow-xl overflow-hidden relative">
                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute right-0 top-0 w-64 h-64 bg-[#39FF14]/5 rounded-full blur-3xl"></div>
                      <div className="absolute left-0 bottom-0 w-32 h-32 bg-[#39FF14]/10 rounded-full blur-2xl"></div>
                    </div>
                    
                    {/* Content */}
                    <CardContent className="p-8 relative z-10">
                      <div className="flex flex-col gap-6">
                        {/* Greeting */}
                        <div>
                          <div className="flex items-center gap-4 mb-3">
                            <Avatar className="h-14 w-14 border-2 border-[#39FF14]/30 shadow-lg">
                              <AvatarImage src={user?.photoURL || ""} alt={user?.name || "العميل"} />
                              <AvatarFallback className="bg-[#1F2128] text-[#39FF14] text-lg">
                                {user?.name?.charAt(0) || user?.email?.charAt(0) || "م"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h1 className="text-2xl font-bold text-white">
                                مرحباً، <span className="text-[#39FF14] drop-shadow-[0_0_2px_rgba(57,255,20,0.7)]">{user?.name || "العميل"}</span>
                              </h1>
                              <p className="text-gray-400 text-sm mt-1">
                                {(() => {
                                  const hour = new Date().getHours();
                                  if (hour < 12) return "صباح الخير! نتمنى لك يوماً سعيداً";
                                  if (hour < 17) return "ظهر الخير! نتمنى لك يوماً سعيداً";
                                  return "مساء الخير! نتمنى لك سهرة سعيدة";
                                })()}
                              </p>
                            </div>
                          </div>
                          
                          {/* Progress Towards Next Trip */}
                          <div className="bg-gradient-to-r from-[#1F2128] to-[#1F2128]/60 rounded-xl p-5 space-y-3 border border-gray-800">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold text-white">خطط رحلتك القادمة</h3>
                              <Badge className="bg-[#39FF14]/20 text-[#39FF14] hover:bg-[#39FF14]/30 border-none">جديد</Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-300">اكتملت 2 من أصل 4 خطوات</span>
                                <span className="text-[#39FF14]">50%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-[#39FF14] w-1/2 rounded-full"></div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-4">
                              <Button className="bg-[#39FF14] text-black hover:bg-[#50FF30] shadow-md">
                                <FaBed className="mr-2 h-4 w-4" /> حجز عقار
                              </Button>
                              <Button variant="outline" className="border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10">
                                <FaUser className="mr-2 h-4 w-4" /> تحديث الملف
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Access Links */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div 
                            className="bg-black/80 rounded-xl p-4 border border-[#39FF14]/10 hover:border-[#39FF14]/30 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] group"
                            onClick={() => navigate("/customer/bookings")}
                          >
                            <div className="w-10 h-10 rounded-lg bg-[#39FF14]/10 flex items-center justify-center mb-3 group-hover:bg-[#39FF14]/20 transition-colors">
                              <FaCalendarAlt className="h-5 w-5 text-[#39FF14]" />
                            </div>
                            <div className="text-sm font-medium text-white group-hover:text-[#39FF14] transition-colors">حجوزاتي</div>
                            <div className="text-xs text-gray-500 mt-1">{bookings?.length || 0} حجز</div>
                          </div>
                          
                          <div 
                            className="bg-black/80 rounded-xl p-4 border border-[#39FF14]/10 hover:border-[#39FF14]/30 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] group"
                            onClick={() => navigate("/customer/favorites")}
                          >
                            <div className="w-10 h-10 rounded-lg bg-[#39FF14]/10 flex items-center justify-center mb-3 group-hover:bg-[#39FF14]/20 transition-colors">
                              <FaHeart className="h-5 w-5 text-[#39FF14]" />
                            </div>
                            <div className="text-sm font-medium text-white group-hover:text-[#39FF14] transition-colors">المفضلة</div>
                            <div className="text-xs text-gray-500 mt-1">{favorites?.length || 0} عقار</div>
                          </div>
                          
                          <div 
                            className="bg-black/80 rounded-xl p-4 border border-[#39FF14]/10 hover:border-[#39FF14]/30 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] group"
                            onClick={() => navigate("/customer/payments")}
                          >
                            <div className="w-10 h-10 rounded-lg bg-[#39FF14]/10 flex items-center justify-center mb-3 group-hover:bg-[#39FF14]/20 transition-colors">
                              <FaCreditCard className="h-5 w-5 text-[#39FF14]" />
                            </div>
                            <div className="text-sm font-medium text-white group-hover:text-[#39FF14] transition-colors">المدفوعات</div>
                            <div className="text-xs text-gray-500 mt-1">$0 USD</div>
                          </div>
                          
                          <div 
                            className="bg-black/80 rounded-xl p-4 border border-[#39FF14]/10 hover:border-[#39FF14]/30 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] group"
                            onClick={() => navigate("/customer/services")}
                          >
                            <div className="w-10 h-10 rounded-lg bg-[#39FF14]/10 flex items-center justify-center mb-3 group-hover:bg-[#39FF14]/20 transition-colors">
                              <FaRegStar className="h-5 w-5 text-[#39FF14]" />
                            </div>
                            <div className="text-sm font-medium text-white group-hover:text-[#39FF14] transition-colors">الخدمات</div>
                            <div className="text-xs text-gray-500 mt-1">3 خدمات</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Sidebar Content */}
                <div className="md:col-span-1">
                  {/* Quick Links */}
                  <Card className="bg-black/80 border border-[#39FF14]/10 rounded-xl overflow-hidden mb-6">
                    <CardHeader className="px-5 pt-5 pb-3">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <span className="text-[#39FF14]">✧</span> روابط سريعة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          className="bg-black/90 border-[#39FF14]/10 text-white hover:bg-black hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all py-6 flex flex-col h-auto hover:shadow-[0_0_10px_rgba(57,255,20,0.1)]"
                          onClick={() => navigate("/")}
                        >
                          <FaHome className="h-5 w-5 mb-2" />
                          <span className="text-xs">الرئيسية</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="bg-black/90 border-[#39FF14]/10 text-white hover:bg-black hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all py-6 flex flex-col h-auto hover:shadow-[0_0_10px_rgba(57,255,20,0.1)]"
                          onClick={() => navigate("/properties")}
                        >
                          <FaBed className="h-5 w-5 mb-2" />
                          <span className="text-xs">عقارات</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="bg-black/90 border-[#39FF14]/10 text-white hover:bg-black hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all py-6 flex flex-col h-auto hover:shadow-[0_0_10px_rgba(57,255,20,0.1)]"
                          onClick={() => navigate("/customer/bookings")}
                        >
                          <FaCalendarAlt className="h-5 w-5 mb-2" />
                          <span className="text-xs">حجز</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="bg-black/90 border-[#39FF14]/10 text-white hover:bg-black hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all py-6 flex flex-col h-auto hover:shadow-[0_0_10px_rgba(57,255,20,0.1)]"
                          onClick={() => navigate("/customer/services")}
                        >
                          <FaRegStar className="h-5 w-5 mb-2" />
                          <span className="text-xs">خدمات</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Local Activities */}
                  <Card className="bg-black/80 border border-[#39FF14]/10 rounded-xl overflow-hidden">
                    <CardHeader className="px-5 pt-5 pb-3">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <span className="text-[#39FF14]">✧</span> أنشطة مقترحة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 py-0">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-black/90 rounded-lg hover:bg-black/60 cursor-pointer transition-all border border-[#39FF14]/5 hover:border-[#39FF14]/20">
                          <div className="w-10 h-10 rounded-md bg-[#39FF14]/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">🏊‍♂️</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white group-hover:text-[#39FF14] transition-colors">غوص في البحر الأبيض المتوسط</h4>
                            <p className="text-xs text-gray-400 mt-0.5">من <span className="text-[#39FF14]">50$</span> للشخص</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-black/90 rounded-lg hover:bg-black/60 cursor-pointer transition-all border border-[#39FF14]/5 hover:border-[#39FF14]/20">
                          <div className="w-10 h-10 rounded-md bg-[#39FF14]/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">🏄‍♂️</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white group-hover:text-[#39FF14] transition-colors">ركوب الأمواج في راس الحكمة</h4>
                            <p className="text-xs text-gray-400 mt-0.5">من <span className="text-[#39FF14]">35$</span> للشخص</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-black/90 rounded-lg hover:bg-black/60 cursor-pointer transition-all border border-[#39FF14]/5 hover:border-[#39FF14]/20">
                          <div className="w-10 h-10 rounded-md bg-[#39FF14]/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">🍹</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-white group-hover:text-[#39FF14] transition-colors">حفلة على الشاطئ</h4>
                            <p className="text-xs text-gray-400 mt-0.5">من <span className="text-[#39FF14]">25$</span> للشخص</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center mt-4 mb-3">
                        <Button variant="outline" className="text-[#39FF14] border-[#39FF14]/20 hover:bg-[#39FF14]/10 w-full hover:border-[#39FF14]/40">
                          عرض المزيد
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Stats and Analytics Section */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#39FF14]/10 flex items-center justify-center">
                    <FaChartLine className="h-3 w-3 text-[#39FF14]" />
                  </div>
                  <span className="bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text drop-shadow-sm">
                    إحصائيات وتحليلات
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Booking Stats */}
                  <div className="bg-black/80 rounded-xl p-5 border border-[#39FF14]/10 hover:border-[#39FF14]/20 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-medium text-white flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#39FF14]/10 flex items-center justify-center">
                          <FaCalendarAlt className="h-2.5 w-2.5 text-[#39FF14]" />
                        </div>
                        الحجوزات
                      </h3>
                      <Badge className="bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20 border-none">
                        {bookings?.length || 0} حجز
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between px-3 py-2 bg-black/60 rounded-lg mb-2 border border-[#39FF14]/5">
                      <div className="text-sm text-white">حجوزات مؤكدة</div>
                      <div className="text-sm font-medium text-[#39FF14]">
                        {bookings && Array.isArray(bookings) ? bookings.filter((booking: Booking) => booking.status === 'confirmed').length : 0}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between px-3 py-2 bg-black/60 rounded-lg mb-2 border border-[#39FF14]/5">
                      <div className="text-sm text-white">حجوزات قيد الانتظار</div>
                      <div className="text-sm font-medium text-[#39FF14]">
                        {bookings && Array.isArray(bookings) ? bookings.filter((booking: Booking) => booking.status === 'pending').length : 0}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between px-3 py-2 bg-black/60 rounded-lg border border-[#39FF14]/5">
                      <div className="text-sm text-white">حجوزات ملغاة</div>
                      <div className="text-sm font-medium text-[#39FF14]">
                        {bookings && Array.isArray(bookings) ? bookings.filter((booking: Booking) => booking.status === 'cancelled').length : 0}
                      </div>
                    </div>
                  </div>
                  
                  {/* Favorite Properties */}
                  <div className="bg-black/80 rounded-xl p-5 border border-[#39FF14]/10 hover:border-[#39FF14]/20 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-medium text-white flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#39FF14]/10 flex items-center justify-center">
                          <FaHeart className="h-2.5 w-2.5 text-[#39FF14]" />
                        </div>
                        المفضلة
                      </h3>
                      <Badge className="bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20 border-none">
                        {favorites?.length || 0} عقار
                      </Badge>
                    </div>
                    
                    {(favorites && favorites.length > 0) ? (
                      <div className="space-y-2">
                        {favorites.slice(0, 3).map((favorite: any) => (
                          <div key={favorite.id} className="flex items-center gap-3 p-2 bg-black/60 rounded-lg border border-[#39FF14]/5 hover:border-[#39FF14]/20 transition-all">
                            <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-black/80 border border-[#39FF14]/10">
                              {favorite.propertyImage ? (
                                <img 
                                  src={favorite.propertyImage} 
                                  alt={favorite.propertyName} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // استبدال الصورة عند حدوث خطأ في التحميل
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=240";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#39FF14]">
                                  <FaHome />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-medium text-white truncate">{favorite.propertyName || "عقار بدون اسم"}</h4>
                              <p className="text-xs text-gray-400 truncate">{favorite.location || "موقع غير محدد"}</p>
                            </div>
                            <div className="text-sm font-medium text-[#39FF14]">${favorite.price || 0}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-black/60 rounded-lg border border-[#39FF14]/5">
                        <p className="text-sm text-gray-400">لا توجد عقارات في المفضلة</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="bg-black/80 rounded-xl p-5 border border-[#39FF14]/10 hover:border-[#39FF14]/20 transition-all">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-medium text-white flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#39FF14]/10 flex items-center justify-center">
                          <FaChartLine className="h-2.5 w-2.5 text-[#39FF14]" />
                        </div>
                        النشاط الأخير
                      </h3>
                      <Badge className="bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20 border-none">
                        جديد
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 bg-black/60 rounded-lg border border-[#39FF14]/5 hover:border-[#39FF14]/20 transition-all">
                        <div className="w-8 h-8 rounded-full bg-[#39FF14]/10 flex items-center justify-center flex-shrink-0">
                          <FaCalendarAlt className="h-4 w-4 text-[#39FF14]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">تسجيل دخول</h4>
                          <p className="text-xs text-gray-400">منذ 5 دقائق</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-2 bg-black/60 rounded-lg border border-[#39FF14]/5 hover:border-[#39FF14]/20 transition-all">
                        <div className="w-8 h-8 rounded-full bg-[#39FF14]/10 flex items-center justify-center flex-shrink-0">
                          <FaHeart className="h-4 w-4 text-[#39FF14]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">تحديث الملف الشخصي</h4>
                          <p className="text-xs text-gray-400">منذ 3 ساعات</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-2 bg-black/60 rounded-lg border border-[#39FF14]/5 hover:border-[#39FF14]/20 transition-all">
                        <div className="w-8 h-8 rounded-full bg-[#39FF14]/10 flex items-center justify-center flex-shrink-0">
                          <FaUser className="h-4 w-4 text-[#39FF14]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">زيارة صفحة الموقع</h4>
                          <p className="text-xs text-gray-400">منذ يوم واحد</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                    {(bookings && Array.isArray(bookings) && bookings.length > 0) ? (
                      <div className="space-y-4">
                        {bookings.slice(0, 3).map((booking: Booking) => (
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
                        
                        {bookings && Array.isArray(bookings) && bookings.length > 3 && (
                          <Button 
                            variant="outline" 
                            className="w-full text-[#39FF14] border-[#39FF14]/20 hover:bg-[#39FF14]/10"
                            onClick={() => setSelectedTab("bookings")}
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
                    {(favorites && favorites.length > 0) ? (
                      <div className="space-y-4">
                        {favorites.slice(0, 3).map((fav: any) => (
                          <div key={fav.id} className="flex items-center gap-4 border-b border-gray-800 pb-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                              {fav.propertyImage ? (
                                <img 
                                  src={fav.propertyImage} 
                                  alt={fav.propertyName} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // استبدال الصورة عند حدوث خطأ في التحميل
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=240";
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-[#39FF14]">
                                  <FaBed className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="text-base font-bold">{fav.propertyName || "عقار بدون اسم"}</h3>
                                <span className="text-[#39FF14] font-mono font-bold">${fav.price || 0}</span>
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                <span className="inline-flex items-center gap-1">
                                  <FaMapMarkerAlt className="h-3 w-3" /> 
                                  {fav.location || "موقع غير محدد"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {(favorites && favorites.length > 3) && (
                          <Button 
                            variant="outline" 
                            className="w-full text-[#39FF14] border-[#39FF14]/20 hover:bg-[#39FF14]/10"
                            onClick={() => setSelectedTab("favorites")}
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
          {selectedTab === "bookings" && (
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
                ) : (!bookings || bookings.length === 0) ? (
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
                    {bookings.map((booking: Booking) => (
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
          {selectedTab === "favorites" && (
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
                ) : (!favorites || favorites.length === 0) ? (
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
                    {favorites.map((favorite: any) => (
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
          
          {/* Profile Tab */}
          {selectedTab === "profile" && (
            <Card className="bg-black border border-[#39FF14]/20 text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]">
              <CardHeader className="border-b border-[#39FF14]/10 pb-3">
                <CardTitle className="flex items-center">
                  <FaUser className="mr-2 h-5 w-5 text-[#39FF14]" />
                  الملف الشخصي
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Profile Information Section */}
                  <div>
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
                        <h2 className="text-2xl font-bold text-white flex items-center">
                          <span>{user?.name || "العميل"}</span>
                          <Badge className="mr-2 bg-[#39FF14]/20 text-[#39FF14] hover:bg-[#39FF14]/30 border-none">عميل</Badge>
                        </h2>
                        <p className="text-gray-400">
                          {user?.bio || "مرحباً! أنا مستخدم في منصة StayX وأتطلع لحجز أفضل العقارات الفاخرة."}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-4">
                          <div className="flex items-center text-sm text-gray-300">
                            <FaCalendarAlt className="h-4 w-4 mr-2 text-[#39FF14]" />
                            <span>انضم في: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            }) : "غير متوفر"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Profile Details */}
                  <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-medium text-[#39FF14] mb-4">المعلومات الشخصية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <label className="text-sm text-gray-400 block mb-1">الاسم الكامل</label>
                          <div className="bg-gray-800 p-3 rounded-md border border-gray-700">{user?.name || "غير محدد"}</div>
                        </div>
                        <div className="mb-4">
                          <label className="text-sm text-gray-400 block mb-1">البريد الإلكتروني</label>
                          <div className="bg-gray-800 p-3 rounded-md border border-gray-700">{user?.email || "غير محدد"}</div>
                        </div>
                        <div className="mb-4">
                          <label className="text-sm text-gray-400 block mb-1">رقم الهاتف</label>
                          <div className="bg-gray-800 p-3 rounded-md border border-gray-700">{user?.phone || "لم يتم إضافة رقم هاتف"}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="mb-4">
                          <label className="text-sm text-gray-400 block mb-1">البلد</label>
                          <div className="bg-gray-800 p-3 rounded-md border border-gray-700">{user?.country || "لم يتم التحديد"}</div>
                        </div>
                        <div className="mb-4">
                          <label className="text-sm text-gray-400 block mb-1">المدينة</label>
                          <div className="bg-gray-800 p-3 rounded-md border border-gray-700">{user?.city || "لم يتم التحديد"}</div>
                        </div>
                        <div className="mb-4">
                          <label className="text-sm text-gray-400 block mb-1">اللغة المفضلة</label>
                          <div className="bg-gray-800 p-3 rounded-md border border-gray-700">{user?.language === 'ar' ? "العربية" : "الإنجليزية"}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button className="bg-[#39FF14] text-black hover:bg-[#50FF30]">
                        تحديث المعلومات الشخصية
                      </Button>
                    </div>
                  </div>
                  
                  {/* Activity Summary */}
                  <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-medium text-[#39FF14] mb-4">ملخص النشاط</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-300">الحجوزات</h4>
                          <FaCalendarAlt className="h-4 w-4 text-[#39FF14]" />
                        </div>
                        <p className="text-2xl font-bold text-white">{bookings?.length || 0}</p>
                        <p className="text-xs text-gray-400 mt-1">إجمالي الحجوزات</p>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-300">العقارات المفضلة</h4>
                          <FaHeart className="h-4 w-4 text-[#39FF14]" />
                        </div>
                        <p className="text-2xl font-bold text-white">{favorites?.length || 0}</p>
                        <p className="text-xs text-gray-400 mt-1">إجمالي المفضلات</p>
                      </div>
                      
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-300">المدفوعات</h4>
                          <FaCreditCard className="h-4 w-4 text-[#39FF14]" />
                        </div>
                        <p className="text-2xl font-bold text-white">$0</p>
                        <p className="text-xs text-gray-400 mt-1">إجمالي المدفوعات</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Settings Tab */}
          {selectedTab === "settings" && (
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
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1F2128] border-t border-[#39FF14]/20 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          <button 
            className={`flex flex-col items-center justify-center w-1/5 h-full ${selectedTab === "dashboard" ? "text-[#39FF14]" : "text-gray-400"}`}
            onClick={() => {
              setSelectedTab("dashboard");
              navigate("/customer");
            }}
          >
            <FaTachometerAlt className="h-5 w-5 mb-1" />
            <span className="text-xs">الرئيسية</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center w-1/5 h-full ${selectedTab === "bookings" ? "text-[#39FF14]" : "text-gray-400"}`}
            onClick={() => {
              setSelectedTab("bookings");
              navigate("/customer/bookings");
            }}
          >
            <FaCalendarAlt className="h-5 w-5 mb-1" />
            <span className="text-xs">الحجوزات</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center w-1/5 h-full ${selectedTab === "favorites" ? "text-[#39FF14]" : "text-gray-400"}`}
            onClick={() => {
              setSelectedTab("favorites");
              navigate("/customer/favorites");
            }}
          >
            <FaHeart className="h-5 w-5 mb-1" />
            <span className="text-xs">المفضلة</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center w-1/5 h-full ${selectedTab === "profile" ? "text-[#39FF14]" : "text-gray-400"}`}
            onClick={() => {
              setSelectedTab("profile");
              navigate("/customer/profile");
            }}
          >
            <FaUser className="h-5 w-5 mb-1" />
            <span className="text-xs">الملف</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center w-1/5 h-full ${selectedTab === "settings" ? "text-[#39FF14]" : "text-gray-400"}`}
            onClick={() => {
              setSelectedTab("settings");
              navigate("/customer/settings");
            }}
          >
            <FaCog className="h-5 w-5 mb-1" />
            <span className="text-xs">الإعدادات</span>
          </button>
        </div>
      </div>
    </div>
  );
}