import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@shared/schema";
import { collection, getDocs, doc, updateDoc, query, orderBy, limit, getCountFromServer } from "firebase/firestore";
import { db, safeDoc } from "@/lib/firebase";

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

/**
 * لوحة تحكم المشرف العام
 */
export default function NewSuperAdminDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
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
  
  // معالجة توجيه لوحة القيادة للمواقع المحددة
  const isSubPage = location.pathname !== "/super-admin";
  
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
            const roleLabel = newRole === UserRole.SUPER_ADMIN ? 'مشرف عام' : 
                              newRole === UserRole.PROPERTY_ADMIN ? 'مدير عقارات' : 'عميل';
            return { ...user, role: roleLabel };
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
        const usersCountSnap = await safeDoc(() => getCountFromServer(collection(db, "users")), null);
        const usersCount = usersCountSnap?.data().count || 0;
        
        // جلب عدد العقارات
        const propertiesCountSnap = await safeDoc(() => getCountFromServer(collection(db, "properties")), null);
        const propertiesCount = propertiesCountSnap?.data().count || 0;
        
        // جلب عدد الحجوزات
        const bookingsCountSnap = await safeDoc(() => getCountFromServer(collection(db, "bookings")), null);
        const bookingsCount = bookingsCountSnap?.data().count || 0;
        
        // جلب المستخدمين الجدد
        const recentUsersQuery = await safeDoc(() => getDocs(
          query(collection(db, "users"), orderBy("createdAt", "desc"), limit(5))
        ), null);
        
        // جلب الحجوزات الأخيرة
        const recentBookingsQuery = await safeDoc(() => getDocs(
          query(collection(db, "bookings"), orderBy("createdAt", "desc"), limit(5))
        ), null);
        
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
            const usersData = recentUsersQuery.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.name || 'مستخدم',
                email: data.email || 'بدون بريد إلكتروني',
                role: data.role === UserRole.SUPER_ADMIN ? 'مشرف عام' : 
                      data.role === UserRole.PROPERTY_ADMIN ? 'مدير عقارات' : 'عميل',
                date: new Date(data.createdAt?.toDate() || new Date()).toISOString().split('T')[0]
              };
            });
            setRecentUsers(usersData);
          }
          
          // تحديث الحجوزات الأخيرة
          if (recentBookingsQuery && !recentBookingsQuery.empty) {
            const bookingsData = recentBookingsQuery.docs.map(doc => {
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
          { id: "USR-8745", name: "محمد علي", email: "m.ali@example.com", role: "عميل", date: "2025-05-05" },
          { id: "USR-8744", name: "فاطمة العنزي", email: "f.anzi@example.com", role: "عميل", date: "2025-05-05" },
          { id: "USR-8743", name: "راشد الخالدي", email: "r.khalidi@example.com", role: "مدير عقارات", date: "2025-05-04" },
          { id: "USR-8742", name: "ريم الفيصل", email: "reem.f@example.com", role: "عميل", date: "2025-05-04" },
          { id: "USR-8741", name: "سعود الدوسري", email: "s.dosari@example.com", role: "عميل", date: "2025-05-03" }
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
  
  // إذا كانت هذه صفحة فرعية، اعرض المحتوى المناسب
  if (isSubPage) {
    const subPath = location.pathname.split('/super-admin/')[1];
    
    return (
      <div className="p-6">
        <div className="mb-6">
          <button 
            onClick={() => navigate('/super-admin')}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-md flex items-center text-sm"
          >
            <span>العودة إلى لوحة التحكم</span>
          </button>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">
          {subPath === 'users' && 'إدارة المستخدمين'}
          {subPath === 'properties' && 'إدارة العقارات'}
          {subPath === 'bookings' && 'إدارة الحجوزات'}
          {subPath === 'revenue' && 'التقارير المالية'}
          {subPath === 'settings' && 'إعدادات النظام'}
          {subPath === 'security' && 'الأمان والصلاحيات'}
          {!subPath && 'لوحة التحكم'}
        </h2>
        
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center">
          <h3 className="text-xl mb-4">هذه الصفحة قيد التطوير</h3>
          <p className="text-gray-400 mb-6">سيتم إضافة محتوى {
            subPath === 'users' ? 'إدارة المستخدمين' :
            subPath === 'properties' ? 'إدارة العقارات' :
            subPath === 'bookings' ? 'إدارة الحجوزات' :
            subPath === 'revenue' ? 'التقارير المالية' :
            subPath === 'settings' ? 'إعدادات النظام' :
            subPath === 'security' ? 'الأمان والصلاحيات' : 'هذه الصفحة'
          } قريبًا</p>
        </div>
      </div>
    );
  }
  
  // تنسيق الأرقام لعرض العملة
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', { 
      style: 'currency', 
      currency: 'EGP',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative inline-flex">
          <div className="w-8 h-8 bg-[#39FF14] rounded-full opacity-60 animate-ping"></div>
          <div className="w-8 h-8 bg-[#39FF14] rounded-full opacity-60 animate-pulse absolute top-0"></div>
        </div>
        <span className="text-gray-400 ml-4">جاري تحميل البيانات...</span>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-10">
      {/* رأس الصفحة */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">مرحباً، {user?.name || 'المشرف العام'}</h1>
        <p className="text-gray-400">لوحة إدارة المنصة | {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      {/* بطاقات الإحصائيات */}
      <DashboardStats stats={stats} formatCurrency={formatCurrency} />
      
      {/* قائمة الإجراءات السريعة */}
      <div className="mb-8">
        <ActionMenu />
      </div>

      {/* تقسيم لوحة التحكم إلى إحصائيات ورسوم بيانية وإدارة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* القسم الأيمن - مخطط الإيرادات */}
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} formatCurrency={formatCurrency} />
        </div>
        
        {/* القسم الأيسر - حالة النظام */}
        <div className="lg:col-span-1">
          <SystemStatus systemHealth={systemHealth} />
        </div>
      </div>
      
      {/* إدارة الحجوزات */}
      <div className="mb-8">
        <BookingsManagement 
          bookingStatus={bookingStatus} 
          recentBookings={recentBookings}
          formatCurrency={formatCurrency}
        />
      </div>
      
      {/* إدارة المستخدمين */}
      <div className="mb-8">
        <UsersManagement 
          usersByRole={usersByRole} 
          recentUsers={recentUsers}
          roleChange={handleRoleChange}
        />
      </div>
    </div>
  );
}