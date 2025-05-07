import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@shared/schema";
import { collection, getDocs, doc, updateDoc, query, orderBy, limit, getCountFromServer } from "firebase/firestore";
import { db, safeDoc } from "@/lib/firebase-client";
import { 
  Terminal, 
  AlertTriangle, 
  CircleCheck, 
  Shield, 
  Database, 
  Server, 
  Code, 
  BarChart3, 
  Activity,
  Bell,
  Calendar,
  Settings,
  Users,
  Home,
  Menu
} from "lucide-react";

// مكونات لوحة تحكم المشرف العام
import DashboardStats from "./components/DashboardStats";
import RevenueChart from "./components/RevenueChart";
import UsersManagement from "./components/UsersManagement";
import BookingsManagement from "./components/BookingsManagement";
import ActionMenu from "./components/ActionMenu";
import SystemStatus from "./components/SystemStatus";

/**
 * مجموعة ألوان المخطط للإحصائيات
 */
const CHART_COLORS = {
  primary: "#39FF14",
  secondary: "#0070F3",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  background: "rgba(40, 40, 40, 0.3)",
  text: "#FFFFFF"
};

// تأثيرات الإضاءة للخلفية
const GlowEffect = () => (
  <>
    <div className="fixed top-20 left-10 w-32 h-32 bg-[#39FF14]/5 rounded-full blur-[80px] animate-pulse-slow"></div>
    <div className="fixed top-40 right-20 w-48 h-48 bg-[#39FF14]/3 rounded-full blur-[100px] animate-pulse-slow-delay"></div>
    <div className="fixed bottom-20 left-1/4 w-64 h-64 bg-green-600/5 rounded-full blur-[120px] animate-pulse-slow"></div>
    <div className="fixed -bottom-10 right-1/3 w-56 h-56 bg-[#39FF14]/10 rounded-full blur-[90px] animate-pulse-very-slow"></div>
  </>
);

/**
 * لوحة تحكم المشرف العام
 */
export default function NewSuperAdminDashboard() {
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  
  // حالات البيانات للإحصائيات والأرقام
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    bookings: 0,
    revenue: 0,
    revenueGrowth: 0,
    bookingsGrowth: 0,
    propertiesGrowth: 0,
    usersGrowth: 0
  });
  
  // بيانات الإيرادات الشهرية
  const [revenueData, setRevenueData] = useState<Array<{
    name: string;
    إيرادات: number;
    حجوزات: number;
  }>>([]);
  
  // بيانات المستخدمين حسب الدور
  const [usersByRole, setUsersByRole] = useState<Array<{
    name: string;
    value: number;
    fill: string;
  }>>([]);
  
  // بيانات حالة الحجوزات 
  const [bookingStatus, setBookingStatus] = useState<Array<{
    name: string;
    value: number;
    fill: string;
  }>>([]);
  
  // آخر الحجوزات
  const [recentBookings, setRecentBookings] = useState<Array<{
    id: string;
    property: string;
    customer: string;
    date: string;
    amount: number;
    status: string;
  }>>([]);
  
  // آخر المستخدمين المسجلين
  const [recentUsers, setRecentUsers] = useState<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    date: string;
  }>>([]);

  // حالة النظام
  const [systemHealth, setSystemHealth] = useState({
    server: 'healthy' as 'healthy' | 'warning' | 'critical',
    database: 'healthy' as 'healthy' | 'warning' | 'critical',
    security: 'healthy' as 'healthy' | 'warning' | 'critical',
    api: 'healthy' as 'healthy' | 'warning' | 'critical',
    lastUpdated: new Date().toLocaleString('ar-EG')
  });
  
  // حالة التحميل للبيانات
  const [loading, setLoading] = useState(true);
  
  // حالة قائمة التحكم الجانبية
  const [showSidebar, setShowSidebar] = useState(true);
  
  // تحكم في العرض المرئي للمشرف
  const [darkMode, setDarkMode] = useState(true);
  
  // معالجة توجيه لوحة القيادة للمواقع المحددة
  const isSubPage = location !== "/super-admin";
  
  // تأكد من أن المستخدم هو مشرف عام
  useEffect(() => {
    if (user && user.role !== UserRole.SUPER_ADMIN) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // جلب البيانات للإحصائيات
    fetchDashboardData();
  }, []);
  
  /**
   * معالج تغيير دور المستخدم
   */
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      if (!db) return;
      
      // تحديث دور المستخدم في Firestore
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        role: newRole
      });
      
      // تحديث واجهة المستخدم
      setRecentUsers(prevUsers => {
        return prevUsers.map(user => {
          if (user.id === userId) {
            // استخدم نفس التحويل من كود الى نص عربي
            const roleLabel = newRole === UserRole.SUPER_ADMIN ? 'مشرف عام' : 
                              newRole === UserRole.PROPERTY_ADMIN ? 'مدير عقارات' : 'عميل';
            return { ...user, role: newRole };  // نخزن قيمة التعداد مباشرة
          }
          return user;
        });
      });
      
      console.log(`تم تغيير دور المستخدم ${userId} إلى ${newRole}`);
    } catch (error) {
      console.error('خطأ في تغيير دور المستخدم:', error);
    }
  };
  
  /**
   * جلب بيانات لوحة القيادة من قاعدة البيانات
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // محاولة جلب البيانات من Firestore
      if (db) {
        // جلب عدد المستخدمين
        const usersCountSnap = await safeDoc(() => {
          if (!db) throw new Error("Firestore not initialized");
          return getCountFromServer(collection(db, "users"));
        }, null);
        const usersCount = usersCountSnap?.data().count || 0;
        
        // جلب عدد العقارات
        const propertiesCountSnap = await safeDoc(() => {
          if (!db) throw new Error("Firestore not initialized");
          return getCountFromServer(collection(db, "properties"));
        }, null);
        const propertiesCount = propertiesCountSnap?.data().count || 0;
        
        // جلب عدد الحجوزات
        const bookingsCountSnap = await safeDoc(() => {
          if (!db) throw new Error("Firestore not initialized");
          return getCountFromServer(collection(db, "bookings"));
        }, null);
        const bookingsCount = bookingsCountSnap?.data().count || 0;
        
        // جلب المستخدمين الجدد
        const recentUsersQuery = await safeDoc(() => {
          if (!db) throw new Error("Firestore not initialized");
          return getDocs(
            query(collection(db, "users"), orderBy("createdAt", "desc"), limit(5))
          );
        }, null);
        
        // جلب الحجوزات الأخيرة
        const recentBookingsQuery = await safeDoc(() => {
          if (!db) throw new Error("Firestore not initialized");
          return getDocs(
            query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(5))
          );
        }, null);
        
        // إذا تم جلب البيانات بنجاح، قم بتحديث حالة المكون
        if (usersCount || propertiesCount || bookingsCount) {
          // تحديث الإحصائيات
          setStats({
            users: usersCount,
            properties: propertiesCount,
            bookings: bookingsCount,
            revenue: 1520000, // قيمة تقديرية، في الإنتاج ستأتي من الحسابات
            revenueGrowth: 12.5,
            bookingsGrowth: 8.3,
            propertiesGrowth: 15.2,
            usersGrowth: 7.8
          });
          
          // تحديث المستخدمين الجدد
          if (recentUsersQuery && !recentUsersQuery.empty) {
            const usersData = recentUsersQuery.docs.map((doc: any) => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.name || 'مستخدم',
                email: data.email || 'بدون بريد إلكتروني',
                role: data.role, // تخزين قيمة التعداد مباشرة
                date: new Date(data.createdAt?.toDate() || new Date()).toISOString().split('T')[0]
              };
            });
            setRecentUsers(usersData);
          }
          
          // تحديث الحجوزات الأخيرة
          if (recentBookingsQuery && !recentBookingsQuery.empty) {
            const bookingsData = recentBookingsQuery.docs.map((doc: any) => {
              const data = doc.data();
              return {
                id: doc.id,
                property: data.propertyName || 'عقار',
                customer: data.customerName || 'عميل',
                date: new Date(data.checkInDate?.toDate() || new Date()).toISOString().split('T')[0],
                amount: data.totalAmount || 0,
                status: data.status === 'confirmed' ? 'مؤكد' : 
                        data.status === 'pending' ? 'بانتظار الدفع' : 'ملغي'
              };
            });
            setRecentBookings(bookingsData);
          }
        } else {
          // إذا لم تنجح عملية جلب البيانات، استخدم بيانات بديلة للعرض
          console.log("لا يمكن جلب بيانات حقيقية، استخدام بيانات نموذجية للعرض");
        }
      }
      
      // بيانات نموذجية للعرض (ستكون حقيقية في الإنتاج)
      // إحصائيات المستخدمين حسب الدور
      const mockUsersByRole = [
        { name: "العملاء", value: 428, fill: CHART_COLORS.primary },
        { name: "مدراء العقارات", value: 32, fill: CHART_COLORS.secondary },
        { name: "المشرفون", value: 5, fill: CHART_COLORS.success }
      ];
      
      // بيانات الإيرادات الشهرية
      const mockRevenueData = [
        { name: "يناير", إيرادات: 150000, حجوزات: 40 },
        { name: "فبراير", إيرادات: 185000, حجوزات: 55 },
        { name: "مارس", إيرادات: 220000, حجوزات: 72 },
        { name: "أبريل", إيرادات: 280000, حجوزات: 90 },
        { name: "مايو", إيرادات: 320000, حجوزات: 110 },
        { name: "يونيو", إيرادات: 450000, حجوزات: 150 }
      ];
      
      // بيانات حالة الحجوزات
      const mockBookingStatus = [
        { name: "مؤكدة", value: 72, fill: CHART_COLORS.success },
        { name: "معلقة", value: 18, fill: CHART_COLORS.warning },
        { name: "ملغاة", value: 10, fill: CHART_COLORS.danger }
      ];
      
      // مثال للحجوزات الأخيرة (إذا لم يتم جلبها من Firestore)
      if (recentBookings.length === 0) {
        const defaultRecentBookings = [
          { id: "BK-10458", property: "فيلا ذا سميث", customer: "أحمد خالد", date: "2025-05-03", amount: 32500, status: "مؤكد" },
          { id: "BK-10457", property: "شاليه ستايل", customer: "سارة محمد", date: "2025-05-02", amount: 45750, status: "مؤكد" },
          { id: "BK-10456", property: "فيلا روز جاردن", customer: "فهد العلي", date: "2025-05-01", amount: 28900, status: "بانتظار الدفع" },
          { id: "BK-10455", property: "شاليه ذا برايم", customer: "نورة سعيد", date: "2025-04-30", amount: 54200, status: "ملغي" },
          { id: "BK-10454", property: "فيلا لوناريس", customer: "عمر الحسن", date: "2025-04-30", amount: 37800, status: "مؤكد" }
        ];
        setRecentBookings(defaultRecentBookings);
      }
      
      // مثال للمستخدمين الجدد (إذا لم يتم جلبها من Firestore)
      if (recentUsers.length === 0) {
        const defaultRecentUsers = [
          { id: "USR-8745", name: "محمد علي", email: "m.ali@example.com", role: UserRole.CUSTOMER, date: "2025-05-05" },
          { id: "USR-8744", name: "فاطمة العنزي", email: "f.anzi@example.com", role: UserRole.CUSTOMER, date: "2025-05-05" },
          { id: "USR-8743", name: "راشد الخالدي", email: "r.khalidi@example.com", role: UserRole.PROPERTY_ADMIN, date: "2025-05-04" },
          { id: "USR-8742", name: "ريم الفيصل", email: "reem.f@example.com", role: UserRole.CUSTOMER, date: "2025-05-04" },
          { id: "USR-8741", name: "سعود الدوسري", email: "s.dosari@example.com", role: UserRole.CUSTOMER, date: "2025-05-03" }
        ];
        setRecentUsers(defaultRecentUsers);
      }
      
      // تحديث حالة البيانات
      setUsersByRole(mockUsersByRole);
      setRevenueData(mockRevenueData);
      setBookingStatus(mockBookingStatus);
      
      // حالة النظام
      setSystemHealth({
        server: 'healthy',
        database: 'healthy',
        security: 'healthy',
        api: 'healthy',
        lastUpdated: new Date().toLocaleString('ar-EG')
      });
      
      setLoading(false);
    } catch (error) {
      console.error("خطأ في جلب بيانات لوحة القيادة:", error);
      setLoading(false);
    }
  };
  
  // تنسيق الأرقام لعرض العملة
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', { 
      style: 'currency', 
      currency: 'EGP',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  // إذا كانت هذه صفحة فرعية، اعرض المحتوى المناسب
  if (isSubPage) {
    const subPath = location.split('/super-admin/')[1];
    
    return (
      <div className="p-6 relative overflow-hidden min-h-screen bg-gray-950">
        {/* خلفية مع تأثيرات الإضاءة */}
        <GlowEffect />
        
        {/* قائمة التنقل في أعلى الصفحات الفرعية */}
        <div className="bg-black/50 backdrop-blur-md border border-gray-800 rounded-xl mb-8 p-4 shadow-[0_0_15px_rgba(57,255,20,0.1)] flex items-center justify-between">
          <button 
            onClick={() => navigate('/super-admin')}
            className="bg-black hover:bg-gray-900 text-[#39FF14] px-4 py-2 rounded-md flex items-center text-sm border border-[#39FF14]/30 shadow-[0_0_10px_rgba(57,255,20,0.1)] hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] transition-all"
          >
            <span>العودة إلى لوحة التحكم</span>
          </button>
          
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-gray-900 text-gray-400 hover:text-white">
              <AlertTriangle size={18} />
            </button>
            <button className="p-2 rounded-full bg-gray-900 text-gray-400 hover:text-white">
              <Terminal size={18} />
            </button>
            <button className="p-2 rounded-full bg-gray-900 text-gray-400 hover:text-white" onClick={() => setDarkMode(!darkMode)}>
              <Activity size={18} />
            </button>
          </div>
        </div>
        
        <div className="bg-black/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <h2 className="text-3xl font-bold mb-6 text-white flex items-center">
            {subPath === 'users' && <><Users className="mr-3 text-[#39FF14]" size={28} /> إدارة المستخدمين</>}
            {subPath === 'properties' && <><Home className="mr-3 text-[#39FF14]" size={28} /> إدارة العقارات</>}
            {subPath === 'bookings' && <><Calendar className="mr-3 text-[#39FF14]" size={28} /> إدارة الحجوزات</>}
            {subPath === 'revenue' && <><BarChart3 className="mr-3 text-[#39FF14]" size={28} /> التقارير المالية</>}
            {subPath === 'settings' && <><Settings className="mr-3 text-[#39FF14]" size={28} /> إعدادات النظام</>}
            {subPath === 'security' && <><Shield className="mr-3 text-[#39FF14]" size={28} /> الأمان والصلاحيات</>}
            {!subPath && <>لوحة التحكم</>}
          </h2>
          
          {/* عرض المكون المناسب بناءً على المسار */}
          {subPath === 'users' ? (
            <div className="bg-black/50 backdrop-blur-md rounded-xl border border-gray-800">
              <div className="p-5 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#39FF14]" />
                  <span>إدارة المستخدمين</span>
                </h2>
              </div>
              <div className="p-5">
                <UsersManagement 
                  usersByRole={usersByRole} 
                  recentUsers={recentUsers} 
                  onRoleChange={handleRoleChange}
                />
              </div>
            </div>
          ) : subPath === 'properties' ? (
            <div className="bg-black/50 backdrop-blur-md rounded-xl border border-gray-800">
              <div className="p-5 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Home className="w-5 h-5 mr-2 text-[#39FF14]" />
                  <span>إدارة العقارات</span>
                </h2>
              </div>
              <div className="p-5">
                <div className="text-center py-12">
                  <Home className="h-16 w-16 text-[#39FF14] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4 text-white">إدارة العقارات</h3>
                  <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                    تمكنك هذه الصفحة من إدارة جميع العقارات على المنصة، بما في ذلك إضافة عقارات جديدة، تعديل العقارات الموجودة، وإزالة العقارات القديمة.
                  </p>
                  <Button className="bg-[#39FF14] text-black hover:bg-[#39FF14]/80">إضافة عقار جديد</Button>
                </div>
              </div>
            </div>
          ) : subPath === 'bookings' ? (
            <div className="bg-black/50 backdrop-blur-md rounded-xl border border-gray-800">
              <div className="p-5 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#39FF14]" />
                  <span>إدارة الحجوزات</span>
                </h2>
              </div>
              <div className="p-5">
                <BookingsManagement 
                  bookingStatus={bookingStatus} 
                  recentBookings={recentBookings}
                  formatCurrency={formatCurrency}
                />
              </div>
            </div>
          ) : (
            // للصفحات الأخرى التي ما زالت قيد التطوير
            <div className="bg-gray-900/70 p-8 rounded-lg border border-gray-800/50 text-center relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.2)] backdrop-blur-sm">
              {/* تأثيرات خلفية للصفحة قيد التطوير */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#39FF14]/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#39FF14]/5 rounded-full blur-3xl"></div>
              
              <Terminal className="inline-block mb-6 text-[#39FF14] w-16 h-16 animate-pulse" />
              <h3 className="text-2xl font-bold mb-4 text-white">هذه الصفحة قيد التطوير</h3>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">سيتم إضافة محتوى {
                subPath === 'revenue' ? 'التقارير المالية' :
                subPath === 'settings' ? 'إعدادات النظام' :
                subPath === 'security' ? 'الأمان والصلاحيات' : 'هذه الصفحة'
              } قريبًا</p>
              
              <div className="inline-block relative">
                <div className="h-1 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent w-80 max-w-full mx-auto rounded animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 relative overflow-hidden">
        <GlowEffect />
        <div className="flex flex-col items-center justify-center gap-4 bg-black/40 p-8 rounded-xl backdrop-blur-md border border-gray-800/50 shadow-2xl">
          <div className="relative">
            <div className="w-12 h-12 bg-[#39FF14]/80 rounded-full animate-ping"></div>
            <div className="w-12 h-12 bg-black rounded-full border-4 border-[#39FF14] absolute top-0 left-0 animate-pulse"></div>
          </div>
          <span className="text-white font-medium text-lg tracking-wider">جاري تحميل البيانات...</span>
          <p className="text-gray-400 text-sm">نظام StayX | لوحة المشرف العام</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-20 md:pb-10 relative">
      {/* تأثيرات الإضاءة في الخلفية */}
      <GlowEffect />
      
      {/* شريط التحكم العلوي */}
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-gray-800 py-3 px-6 flex justify-between items-center mb-8 shadow-md">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-[#39FF14]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="h-6 w-px bg-gray-800 mx-1"></div>
          <div className="bg-gray-900 rounded-lg flex items-center px-3 py-1 text-gray-400 gap-2">
            <Database className="h-4 w-4" />
            <span className="text-xs">متصل</span>
          </div>
          <div className="bg-gray-900 rounded-lg flex items-center px-3 py-1 text-gray-400 gap-2">
            <Server className="h-4 w-4" />
            <span className="text-xs">اكتيف</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#39FF14] rounded-full"></span>
            </button>
          </div>
          <button className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white">
            <Settings className="h-5 w-5" />
          </button>
          <div className="h-6 w-px bg-gray-800 mx-1"></div>
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm hidden md:inline">{user?.name || 'المشرف العام'}</span>
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-[#39FF14] font-bold border border-gray-700">
              {user?.name?.charAt(0) || 'م'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6">
        {/* رأس الصفحة */}
        <div className="mb-8 bg-black/50 backdrop-blur-md rounded-xl p-6 border border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <h1 className="text-3xl font-bold mb-3 text-white">مرحباً، <span className="text-[#39FF14] drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">{user?.name || 'المشرف العام'}</span></h1>
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <p className="text-gray-400">
              <span>لوحة إدارة المنصة | </span>
              <span>{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </p>
            
            <div className="flex gap-2">
              <button className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-medium px-4 py-2 rounded-lg shadow-[0_0_10px_rgba(57,255,20,0.3)] flex items-center gap-2 text-sm">
                <Terminal className="w-4 h-4" />
                <span>وحدة التحكم</span>
              </button>
              <button className="bg-black hover:bg-gray-900 text-[#39FF14] border border-[#39FF14]/30 px-4 py-2 rounded-lg shadow-[0_0_10px_rgba(57,255,20,0.1)] flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" />
                <span>الأمان</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* بطاقات الإحصائيات */}
        <DashboardStats stats={stats} formatCurrency={formatCurrency} />
        
        {/* قائمة الإجراءات السريعة */}
        <div className="mb-8">
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-5 border border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center">
              <Code className="w-5 h-5 mr-2 text-[#39FF14]" />
              <span>إجراءات سريعة</span>
            </h2>
            <ActionMenu />
          </div>
        </div>

        {/* تقسيم لوحة التحكم إلى إحصائيات ورسوم بيانية وإدارة */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* القسم الأيمن - مخطط الإيرادات */}
          <div className="lg:col-span-2">
            <div className="bg-black/50 backdrop-blur-md rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.3)] h-full">
              <div className="p-5 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-[#39FF14]" />
                  <span>الإيرادات والحجوزات</span>
                </h2>
              </div>
              <div className="p-5">
                <RevenueChart data={revenueData} formatCurrency={formatCurrency} />
              </div>
            </div>
          </div>
          
          {/* القسم الأيسر - حالة النظام */}
          <div className="lg:col-span-1">
            <div className="bg-black/50 backdrop-blur-md rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.3)] h-full">
              <div className="p-5 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Server className="w-5 h-5 mr-2 text-[#39FF14]" />
                  <span>حالة النظام</span>
                </h2>
              </div>
              <div className="p-5">
                <SystemStatus systemHealth={systemHealth} />
              </div>
            </div>
          </div>
        </div>
        
        {/* إدارة الحجوزات */}
        <div className="mb-8">
          <div className="bg-black/50 backdrop-blur-md rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <div className="p-5 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-[#39FF14]" />
                <span>إدارة الحجوزات</span>
              </h2>
            </div>
            <div className="p-5">
              <BookingsManagement 
                bookingStatus={bookingStatus} 
                recentBookings={recentBookings}
                formatCurrency={formatCurrency}
              />
            </div>
          </div>
        </div>
        
        {/* إدارة المستخدمين */}
        <div className="mb-8">
          <div className="bg-black/50 backdrop-blur-md rounded-xl border border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <div className="p-5 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-[#39FF14]" />
                <span>إدارة المستخدمين</span>
              </h2>
            </div>
            <div className="p-5">
              <UsersManagement 
                usersByRole={usersByRole} 
                recentUsers={recentUsers}
                roleChange={handleRoleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}