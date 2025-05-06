import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Users, 
  Building, 
  Calendar,
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Settings,
  Eye,
  ArrowRight,
  UserPlus,
  ChevronsUp, 
  ChevronRight,
  Layers,
  ClipboardList,
  Wallet
} from "lucide-react";
import { 
  FaBuilding, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaStar, 
  FaUsers,
  FaDatabase,
  FaGlobe,
  FaEye,
  FaServer,
  FaCog,
  FaBolt
} from "react-icons/fa";
import SuperAdminStatsCard from './SuperAdminStatsCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis 
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface SuperAdminOverviewProps {
  stats: {
    usersCount: number;
    propertiesCount: number;
    bookingsCount: number;
    totalRevenue: number;
    pendingBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    usersGrowth: number;
    propertiesGrowth: number;
    bookingsGrowth: number;
    revenueGrowth: number;
  };
  onViewUsers: () => void;
  onViewProperties: () => void;
  onViewBookings: () => void;
  onViewRevenue: () => void;
}

export const SuperAdminOverview: React.FC<SuperAdminOverviewProps> = ({
  stats,
  onViewUsers,
  onViewProperties,
  onViewBookings,
  onViewRevenue
}) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Sample data for charts
  const revenueData = [
    { name: 'يناير', إيرادات: 4000 },
    { name: 'فبراير', إيرادات: 5000 },
    { name: 'مارس', إيرادات: 3000 },
    { name: 'أبريل', إيرادات: 7000 },
    { name: 'مايو', إيرادات: 5500 },
    { name: 'يونيو', إيرادات: 8000 },
    { name: 'يوليو', إيرادات: 9500 },
    { name: 'أغسطس', إيرادات: 11000 },
  ];

  const userActivityData = [
    { name: 'الأحد', نشاط: 1500 },
    { name: 'الإثنين', نشاط: 2200 },
    { name: 'الثلاثاء', نشاط: 1800 },
    { name: 'الأربعاء', نشاط: 2400 },
    { name: 'الخميس', نشاط: 2600 },
    { name: 'الجمعة', نشاط: 3200 },
    { name: 'السبت', نشاط: 2900 },
  ];

  const bookingStatusData = [
    { name: 'مؤكدة', value: stats.completedBookings || 65 },
    { name: 'قيد الانتظار', value: stats.pendingBookings || 25 },
    { name: 'ملغية', value: stats.cancelledBookings || 10 },
  ];

  const locationData = [
    { subject: 'الساحل الشمالي', A: 120, B: 110, fullMark: 150 },
    { subject: 'رأس الحكمة', A: 98, B: 130, fullMark: 150 },
    { subject: 'العين السخنة', A: 86, B: 130, fullMark: 150 },
    { subject: 'الغردقة', A: 99, B: 100, fullMark: 150 },
    { subject: 'شرم الشيخ', A: 85, B: 90, fullMark: 150 },
    { subject: 'مراسي', A: 65, B: 85, fullMark: 150 },
  ];

  // Calculate total booking
  const totalBookings = bookingStatusData.reduce((acc, curr) => acc + curr.value, 0);
  
  const COLORS = ['#4ade80', '#facc15', '#f43f5e'];
  const REVENUE_COLORS = ['rgba(57, 255, 20, 0.6)', 'rgba(57, 255, 20, 0.3)', 'rgba(57, 255, 20, 0.1)'];
  const ACTIVITY_COLORS = ['rgba(99, 102, 241, 0.6)', 'rgba(99, 102, 241, 0.3)', 'rgba(99, 102, 241, 0.1)'];

  // Animation utility
  const fadeIn = (delay: number) => ({
    opacity: animate ? 1 : 0,
    transform: animate ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.6s ease-out',
    transitionDelay: `${delay}ms`
  });

  return (
    <div>
      <div style={fadeIn(0)} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">لوحة تحكم المشرف العام</h1>
          <p className="text-gray-400">إحصائيات وتقارير النظام</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="text-[#39FF14] border-[#39FF14]/50 hover:bg-[#39FF14]/10">
            <Settings size={16} className="mr-1.5" />
            إعدادات النظام
          </Button>
          <Button className="bg-[#39FF14] hover:bg-[#39FF14]/90 text-black">
            <Eye size={16} className="mr-1.5" />
            لوحة المراقبة المباشرة
          </Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SuperAdminStatsCard
          title="إجمالي المستخدمين"
          value={stats.usersCount.toLocaleString('ar-EG')}
          subtitle="مستخدم مسجل"
          icon={<Users size={22} />}
          trend={stats.usersGrowth ? { value: stats.usersGrowth, isPositive: stats.usersGrowth > 0 } : undefined}
          accentColor="default"
          actionText="إدارة المستخدمين"
          onAction={onViewUsers}
          delay={100}
        />
        
        <SuperAdminStatsCard
          title="العقارات"
          value={stats.propertiesCount.toLocaleString('ar-EG')}
          subtitle="عقار مسجل"
          icon={<Building size={22} />}
          trend={stats.propertiesGrowth ? { value: stats.propertiesGrowth, isPositive: stats.propertiesGrowth > 0 } : undefined}
          accentColor="blue"
          actionText="إدارة العقارات"
          onAction={onViewProperties}
          delay={200}
        />
        
        <SuperAdminStatsCard
          title="الحجوزات"
          value={stats.bookingsCount.toLocaleString('ar-EG')}
          subtitle="حجز نشط"
          icon={<Calendar size={22} />}
          trend={stats.bookingsGrowth ? { value: stats.bookingsGrowth, isPositive: stats.bookingsGrowth > 0 } : undefined}
          accentColor="purple"
          actionText="إدارة الحجوزات"
          onAction={onViewBookings}
          delay={300}
        />
        
        <SuperAdminStatsCard
          title="الإيرادات"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="إجمالي الإيرادات"
          icon={<DollarSign size={22} />}
          trend={stats.revenueGrowth ? { value: stats.revenueGrowth, isPositive: stats.revenueGrowth > 0 } : undefined}
          accentColor="green"
          actionText="تقارير الإيرادات"
          onAction={onViewRevenue}
          delay={400}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div 
          className="lg:col-span-2"
          style={fadeIn(500)}
        >
          <Card className="border-gray-800 bg-gray-950/50 backdrop-blur-sm h-full overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-medium text-white">إيرادات النظام</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  توزيع الإيرادات للأشهر الأخيرة
                </CardDescription>
              </div>
              <Badge className="bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 12.3%
              </Badge>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#39FF14" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#39FF14" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9ca3af" 
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#f3f4f6'
                      }}
                      formatter={(value) => [`$${value}`, 'الإيرادات']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="إيرادات" 
                      stroke="#39FF14" 
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Status */}
        <div style={fadeIn(600)}>
          <Card className="border-gray-800 bg-gray-950/50 backdrop-blur-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-medium text-white">حالة الحجوزات</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  توزيع حالات الحجوزات
                </CardDescription>
              </div>
              <Calendar className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="h-[250px] mt-2 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={bookingStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={6}
                      dataKey="value"
                    >
                      {bookingStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#f3f4f6'
                      }}
                      formatter={(value: number, name) => [`${value} (${Math.round((value / (totalBookings || 1)) * 100)}%)`, name]}
                    />
                    <Legend 
                      layout="vertical" 
                      align="right" 
                      verticalAlign="middle"
                      formatter={(value, entry, index) => (
                        <span style={{ color: COLORS[index % COLORS.length], marginLeft: '10px' }}>
                          {value}
                        </span>
                      )}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <Button variant="ghost" className="text-purple-400" onClick={onViewBookings}>
                  عرض تفاصيل الحجوزات
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  {stats.bookingsCount} حجز
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2" style={fadeIn(700)}>
          <Card className="border-gray-800 bg-gray-950/50 backdrop-blur-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-medium text-white">نشاط المستخدمين</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  معدل نشاط المستخدمين خلال الأسبوع
                </CardDescription>
              </div>
              <Activity className="h-5 w-5 text-indigo-400" />
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={userActivityData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9ca3af" 
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#f3f4f6'
                      }}
                    />
                    <Bar 
                      dataKey="نشاط" 
                      fill="url(#colorActivity)" 
                      radius={[4, 4, 0, 0]}
                      barSize={36}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Locations Stats */}
        <div style={fadeIn(800)}>
          <Card className="border-gray-800 bg-gray-950/50 backdrop-blur-sm h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-medium text-white">المناطق الأكثر طلباً</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  توزيع الحجوزات والعقارات حسب المنطقة
                </CardDescription>
              </div>
              <FaGlobe className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={locationData}>
                    <PolarGrid stroke="#2d2d3d" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#9ca3af', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 150]} 
                      stroke="#4b5563"
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                    />
                    <Radar
                      name="العقارات"
                      dataKey="A"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.5}
                    />
                    <Radar
                      name="الحجوزات"
                      dataKey="B"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.5}
                    />
                    <Legend 
                      formatter={(value) => (
                        <span style={{ color: value === 'العقارات' ? '#6366f1' : '#f59e0b' }}>
                          {value}
                        </span>
                      )}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '0.5rem',
                        color: '#f3f4f6'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={fadeIn(900)}>
        <h2 className="text-xl font-bold text-white mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-gray-800 bg-gray-950/50 backdrop-blur-sm hover:border-indigo-500/50 hover:bg-gray-900/30 transition-all group">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors">
                  <UserPlus size={28} className="text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">إضافة مستخدم جديد</h3>
                <p className="text-gray-400 text-sm mb-4">قم بإضافة مستخدم جديد للنظام</p>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  إضافة مستخدم
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-gray-950/50 backdrop-blur-sm hover:border-[#39FF14]/50 hover:bg-gray-900/30 transition-all group">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#39FF14]/20 flex items-center justify-center mb-4 group-hover:bg-[#39FF14]/30 transition-colors">
                  <Layers size={28} className="text-[#39FF14]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">إضافة عقار</h3>
                <p className="text-gray-400 text-sm mb-4">قم بإضافة عقار جديد للنظام</p>
                <Button className="w-full bg-[#39FF14] hover:bg-[#39FF14]/90 text-black">
                  إضافة عقار
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-gray-950/50 backdrop-blur-sm hover:border-amber-500/50 hover:bg-gray-900/30 transition-all group">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                  <ClipboardList size={28} className="text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">تقرير النظام</h3>
                <p className="text-gray-400 text-sm mb-4">إنشاء تقرير شامل عن النظام</p>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black">
                  إنشاء تقرير
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-gray-950/50 backdrop-blur-sm hover:border-rose-500/50 hover:bg-gray-900/30 transition-all group">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-4 group-hover:bg-rose-500/30 transition-colors">
                  <Wallet size={28} className="text-rose-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">معاملات مالية</h3>
                <p className="text-gray-400 text-sm mb-4">إدارة المعاملات المالية للنظام</p>
                <Button className="w-full bg-rose-500 hover:bg-rose-600">
                  مراجعة المعاملات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8" style={fadeIn(1000)}>
        <Card className="border-gray-800 bg-gray-950/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-medium text-white">حالة النظام</CardTitle>
              <CardDescription className="text-gray-400 text-sm">
                مراقبة مؤشرات أداء النظام
              </CardDescription>
            </div>
            <FaServer className="h-5 w-5 text-[#39FF14]" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-400">قاعدة البيانات</div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-0">
                    <ChevronsUp className="h-3 w-3 mr-1" /> نشط
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <FaDatabase className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Firebase Firestore</div>
                    <div className="text-xs text-gray-500">استجابة: 180ms</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-400">المصادقة</div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-0">
                    <ChevronsUp className="h-3 w-3 mr-1" /> نشط
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <FaUsers className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Firebase Auth</div>
                    <div className="text-xs text-gray-500">استجابة: 150ms</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-400">المدفوعات</div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-0">
                    <ChevronsUp className="h-3 w-3 mr-1" /> نشط
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <FaMoneyBillWave className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Stripe API</div>
                    <div className="text-xs text-gray-500">استجابة: 220ms</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-400">التخزين</div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-0">
                    <ChevronsUp className="h-3 w-3 mr-1" /> نشط
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <FaDatabase className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Cloud Storage</div>
                    <div className="text-xs text-gray-500">استجابة: 190ms</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center gap-2">
                <div className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-gray-400">جميع الأنظمة تعمل بشكل طبيعي</span>
              </div>
              <Button variant="outline" className="text-[#39FF14] border-[#39FF14]/50 hover:bg-[#39FF14]/10">
                <FaBolt className="mr-1.5" size={14} />
                تشخيص النظام
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminOverview;