import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@shared/schema";
import { db, safeDoc } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit, getCountFromServer } from "firebase/firestore";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  Building, 
  Calendar, 
  CircleDollarSign, 
  TrendingUp, 
  ClipboardCheck, 
  Bell,
  UserPlus,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  PieChart as PieChartIcon,
  Settings,
  Download,
  AlertTriangle
} from 'lucide-react';
 
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
export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [location] = useLocation();
  
  // حالات البيانات للإحصائيات والأرقام
  const [stats, setStats] = useState({
    users: 0,
    properties: 0,
    bookings: 0,
    revenue: 0,
    revenueGrowth: 12.5,
    bookingsGrowth: 8.3,
    propertiesGrowth: 15.2,
    usersGrowth: 7.8
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
  
  // حالة التحميل للبيانات
  const [loading, setLoading] = useState(true);
  
  // معالجة توجيه لوحة القيادة للمواقع المحددة
  const isSubPage = location !== "/super-admin";
  
  useEffect(() => {
    // جلب البيانات للإحصائيات
    fetchDashboardData();
  }, []);
  
  /**
   * جلب بيانات لوحة القيادة من قاعدة البيانات
   */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // في الانتاج، نستخدم دالة safeDoc لجلب البيانات من Firestore مع معالجة الأخطاء
      // للتطوير، نستخدم بيانات محلية

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
      
      // مثال للحجوزات الأخيرة
      const mockRecentBookings = [
        { id: "BK-10458", property: "ذا سميث", customer: "أحمد خالد", date: "2025-05-03", amount: 32500, status: "مؤكد" },
        { id: "BK-10457", property: "شاطئ ستايل", customer: "سارة محمد", date: "2025-05-02", amount: 45750, status: "مؤكد" },
        { id: "BK-10456", property: "روز جاردن", customer: "فهد العلي", date: "2025-05-01", amount: 28900, status: "بانتظار الدفع" },
        { id: "BK-10455", property: "ذا برايم", customer: "نورة سعيد", date: "2025-04-30", amount: 54200, status: "ملغي" },
        { id: "BK-10454", property: "لوناريس", customer: "عمر الحسن", date: "2025-04-30", amount: 37800, status: "مؤكد" }
      ];
      
      // مثال للمستخدمين الجدد مؤخرًا
      const mockRecentUsers = [
        { id: "USR-8745", name: "محمد علي", email: "m.ali@example.com", role: "عميل", date: "2025-05-05" },
        { id: "USR-8744", name: "فاطمة العنزي", email: "f.anzi@example.com", role: "عميل", date: "2025-05-05" },
        { id: "USR-8743", name: "راشد الخالدي", email: "r.khalidi@example.com", role: "مدير عقارات", date: "2025-05-04" },
        { id: "USR-8742", name: "ريم الفيصل", email: "reem.f@example.com", role: "عميل", date: "2025-05-04" },
        { id: "USR-8741", name: "سعود الدوسري", email: "s.dosari@example.com", role: "عميل", date: "2025-05-03" }
      ];
      
      // تحديث حالة البيانات
      setUsersByRole(mockUsersByRole);
      setRevenueData(mockRevenueData);
      setBookingStatus(mockBookingStatus);
      setRecentBookings(mockRecentBookings);
      setRecentUsers(mockRecentUsers);
      
      // تحديث الإحصائيات
      setStats({
        users: 465,
        properties: 87,
        bookings: 312,
        revenue: 1520000,
        revenueGrowth: 12.5,
        bookingsGrowth: 8.3,
        propertiesGrowth: 15.2,
        usersGrowth: 7.8
      });
      
      setLoading(false);
    } catch (error) {
      console.error("خطأ في جلب بيانات لوحة القيادة:", error);
      setLoading(false);
    }
  };
  
  // إذا كانت هذه صفحة فرعية، اعرض المحتوى المناسب
  if (isSubPage) {
    const subPath = location.split('/super-admin/')[1];
    
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          {subPath === 'users' && <Users className="mr-2" />}
          {subPath === 'properties' && <Building className="mr-2" />}
          {subPath === 'bookings' && <Calendar className="mr-2" />}
          {subPath === 'revenue' && <CircleDollarSign className="mr-2" />}
          {subPath === 'settings' && <Settings className="mr-2" />}
          
          {subPath === 'users' && 'إدارة المستخدمين'}
          {subPath === 'properties' && 'إدارة العقارات'}
          {subPath === 'bookings' && 'إدارة الحجوزات'}
          {subPath === 'revenue' && 'التقارير المالية'}
          {subPath === 'settings' && 'إعدادات النظام'}
        </h2>
        
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center">
          <h3 className="text-xl mb-4">جاري تحميل صفحة {
            subPath === 'users' ? 'إدارة المستخدمين' :
            subPath === 'properties' ? 'إدارة العقارات' :
            subPath === 'bookings' ? 'إدارة الحجوزات' :
            subPath === 'revenue' ? 'التقارير المالية' :
            subPath === 'settings' ? 'إعدادات النظام' : 'لوحة التحكم'
          }</h3>
          <p className="text-gray-400 mb-6">هذه الواجهة قيد التطوير وستكون متاحة قريبًا</p>
          
          <div className="flex justify-center">
            <Link to="/super-admin" className="bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50 px-4 py-2 rounded hover:bg-[#39FF14]/30 transition-colors">
              العودة للوحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // تنسيق الأرقام لعرض العملة
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ar-EG', { 
      style: 'currency', 
      currency: 'EGP',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="pb-20 md:pb-10">
      {/* رأس الصفحة */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">مرحباً، {user?.name || 'المشرف العام'}</h1>
        <p className="text-gray-400">لوحة إدارة المنصة | الثلاثاء 6 مايو، 2025</p>
      </div>
      
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* عدد المستخدمين */}
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-[#39FF14]/10 text-[#39FF14]">
                <Users size={20} />
              </div>
              <div className={`px-2 py-1 rounded-md text-xs flex items-center ${stats.usersGrowth > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {stats.usersGrowth > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {Math.abs(stats.usersGrowth)}%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{stats.users.toLocaleString('ar-EG')}</div>
            <p className="text-gray-400 text-sm">المستخدمين المسجلين</p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
              <div className="bg-[#39FF14] h-full rounded-full" style={{width: '78%'}}></div>
            </div>
          </CardFooter>
        </Card>
        
        {/* عدد العقارات */}
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Building size={20} />
              </div>
              <div className={`px-2 py-1 rounded-md text-xs flex items-center ${stats.propertiesGrowth > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {stats.propertiesGrowth > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {Math.abs(stats.propertiesGrowth)}%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{stats.properties.toLocaleString('ar-EG')}</div>
            <p className="text-gray-400 text-sm">العقارات المسجلة</p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{width: '65%'}}></div>
            </div>
          </CardFooter>
        </Card>
        
        {/* عدد الحجوزات */}
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Calendar size={20} />
              </div>
              <div className={`px-2 py-1 rounded-md text-xs flex items-center ${stats.bookingsGrowth > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {stats.bookingsGrowth > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {Math.abs(stats.bookingsGrowth)}%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{stats.bookings.toLocaleString('ar-EG')}</div>
            <p className="text-gray-400 text-sm">إجمالي الحجوزات</p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full" style={{width: '82%'}}></div>
            </div>
          </CardFooter>
        </Card>
        
        {/* الإيرادات */}
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <CircleDollarSign size={20} />
              </div>
              <div className={`px-2 py-1 rounded-md text-xs flex items-center ${stats.revenueGrowth > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {stats.revenueGrowth > 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                {Math.abs(stats.revenueGrowth)}%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{formatCurrency(stats.revenue)}</div>
            <p className="text-gray-400 text-sm">إجمالي الإيرادات</p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{width: '92%'}}></div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* تقسيم لوحة التحكم إلى قسمين: الإحصائيات والمعلومات الحديثة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* القسم الأيسر - مخططات ورسوم بيانية */}
        <div className="lg:col-span-2 space-y-6">
          {/* مخطط الإيرادات الشهرية */}
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>الإيرادات الشهرية والحجوزات</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 px-2 border-gray-700">
                    <Download size={14} className="mr-1" />
                    تصدير
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-700">
                    <MoreHorizontal size={14} />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-80 pt-4 px-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value/1000}ك`}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", borderRadius: "8px" }}
                      itemStyle={{ color: "#fff" }}
                      formatter={(value, name) => {
                        if (name === "إيرادات") {
                          return [formatCurrency(value), name];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="إيرادات" 
                      stroke={CHART_COLORS.primary} 
                      strokeWidth={2}
                      dot={{ r: 4, fill: CHART_COLORS.primary, stroke: CHART_COLORS.primary, strokeWidth: 1 }}
                      activeDot={{ r: 6, fill: CHART_COLORS.primary, stroke: "#fff", strokeWidth: 2 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="حجوزات" 
                      stroke={CHART_COLORS.secondary} 
                      strokeWidth={2}
                      dot={{ r: 4, fill: CHART_COLORS.secondary, stroke: CHART_COLORS.secondary, strokeWidth: 1 }}
                      activeDot={{ r: 6, fill: CHART_COLORS.secondary, stroke: "#fff", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* تقسيم افقي لمخططين */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* مخطط توزيع المستخدمين */}
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-base">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    <span>المستخدمين حسب الدور</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-gray-700">
                    <MoreHorizontal size={14} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usersByRole}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {usersByRole.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", borderRadius: "8px" }}
                        itemStyle={{ color: "#fff" }}
                        formatter={(value) => [value, "مستخدم"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-2 space-y-2">
                  {usersByRole.map((role) => (
                    <div key={role.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: role.fill}}></div>
                        <span>{role.name}</span>
                      </div>
                      <span className="font-semibold">{role.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* مخطط حالة الحجوزات */}
            <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-base">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    <span>حالات الحجوزات</span>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-gray-700">
                    <MoreHorizontal size={14} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={bookingStatus}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", borderRadius: "8px" }}
                        itemStyle={{ color: "#fff" }}
                        formatter={(value) => [value, "حجز"]}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {bookingStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-2 space-y-2">
                  {bookingStatus.map((status) => (
                    <div key={status.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: status.fill}}></div>
                        <span>{status.name}</span>
                      </div>
                      <span className="font-semibold">{status.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* القسم الأيمن - المعلومات الحديثة والتنبيهات */}
        <div className="space-y-6">
          {/* علبة التنبيهات */}
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 mr-2">
                    <AlertTriangle size={16} />
                  </div>
                  <span>التنبيهات</span>
                </div>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-gray-700">
                  <MoreHorizontal size={14} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-3 border-r-4 border-amber-500">
                  <div className="text-amber-400 font-medium mb-1 text-sm">تنبيه: 7 مشاكل تسجيل دخول فاشلة</div>
                  <p className="text-gray-400 text-xs">هناك محاولات تسجيل دخول فاشلة متعددة من عنوان IP مختلف للمستخدم أحمد خالد</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-gray-500">منذ 32 دقيقة</span>
                    <a href="#" className="text-amber-400 hover:underline">مراجعة</a>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-3 border-r-4 border-red-500">
                  <div className="text-red-400 font-medium mb-1 text-sm">تحذير: نفاد صلاحية شهادة SSL</div>
                  <p className="text-gray-400 text-xs">ستنتهي صلاحية شهادة SSL للموقع خلال 7 أيام. يرجى تجديدها لتجنب مشاكل الأمان</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-gray-500">منذ 4 ساعات</span>
                    <a href="#" className="text-red-400 hover:underline">إجراء فوري</a>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-3 border-r-4 border-green-500">
                  <div className="text-green-400 font-medium mb-1 text-sm">معلومات: تحديث النظام الجديد</div>
                  <p className="text-gray-400 text-xs">تم إصدار تحديث للنظام 2.4.0 مع ميزات جديدة. يمكنك التحديث الآن</p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-gray-500">منذ 1 يوم</span>
                    <a href="#" className="text-green-400 hover:underline">تحديث</a>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full text-xs text-gray-400 hover:text-white">
                عرض كل التنبيهات
                <ChevronRight size={14} className="mr-1" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* أحدث الحجوزات */}
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 mr-2">
                    <Calendar size={16} />
                  </div>
                  <span>أحدث الحجوزات</span>
                </div>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-gray-700">
                  <MoreHorizontal size={14} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="text-sm">
                {recentBookings.map((booking, i) => (
                  <div 
                    key={booking.id}
                    className={`flex justify-between items-center px-6 py-2 ${
                      i < recentBookings.length - 1 ? 'border-b border-gray-800' : ''
                    } hover:bg-gray-800/50`}
                  >
                    <div>
                      <div className="font-medium">{booking.property}</div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <span>{booking.id}</span>
                        <span className="mx-1">•</span>
                        <span>{booking.customer}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(booking.amount)}</div>
                      <div className={`text-xs ${
                        booking.status === 'مؤكد' ? 'text-green-400' :
                        booking.status === 'بانتظار الدفع' ? 'text-amber-400' :
                        'text-red-400'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link 
                to="/super-admin/bookings" 
                className="w-full text-center text-xs text-gray-400 hover:text-white py-2 flex items-center justify-center"
              >
                عرض كل الحجوزات
                <ChevronRight size={14} className="mr-1" />
              </Link>
            </CardFooter>
          </Card>
          
          {/* المستخدمين الجدد */}
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 mr-2">
                    <UserPlus size={16} />
                  </div>
                  <span>المستخدمين الجدد</span>
                </div>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0 border-gray-700">
                  <MoreHorizontal size={14} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="text-sm">
                {recentUsers.map((user, i) => (
                  <div 
                    key={user.id}
                    className={`flex justify-between items-center px-6 py-2 ${
                      i < recentUsers.length - 1 ? 'border-b border-gray-800' : ''
                    } hover:bg-gray-800/50`}
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <span>{user.id}</span>
                        <span className="mx-1">•</span>
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs ${
                        user.role === 'مدير عقارات' ? 'text-blue-400' :
                        user.role === 'مشرف' ? 'text-purple-400' :
                        'text-green-400'
                      } font-medium`}>
                        {user.role}
                      </div>
                      <div className="text-xs text-gray-400">{user.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link 
                to="/super-admin/users" 
                className="w-full text-center text-xs text-gray-400 hover:text-white py-2 flex items-center justify-center"
              >
                عرض كل المستخدمين
                <ChevronRight size={14} className="mr-1" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}