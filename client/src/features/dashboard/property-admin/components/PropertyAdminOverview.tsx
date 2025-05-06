import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Calendar, DollarSign, Star, Users, ChevronRight, TrendingUp, Eye, Plus } from "lucide-react";
import { FaBuilding, FaCalendarAlt, FaMoneyBillWave, FaStar, FaChartLine } from "react-icons/fa";
import PropertyAdminStatsCard from './PropertyAdminStatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface PropertyAdminOverviewProps {
  stats: {
    propertiesCount: number;
    bookingsCount: number;
    totalEarnings: number;
    reviewsCount: number;
    activeBookings: number;
  };
  recentBookings: any[];
  onViewAllProperties: () => void;
  onViewAllBookings: () => void;
  onAddProperty: () => void;
}

export const PropertyAdminOverview: React.FC<PropertyAdminOverviewProps> = ({
  stats,
  recentBookings,
  onViewAllProperties,
  onViewAllBookings,
  onAddProperty
}) => {
  const [animate, setAnimate] = useState(false);
  
  // Animation on load
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Mock data for charts
  const bookingsByMonth = [
    { name: 'يناير', حجوزات: 12 },
    { name: 'فبراير', حجوزات: 19 },
    { name: 'مارس', حجوزات: 15 },
    { name: 'أبريل', حجوزات: 27 },
    { name: 'مايو', حجوزات: 29 },
    { name: 'يونيو', حجوزات: 24 },
  ];

  const earningsByProperty = [
    { name: 'فيلا الساحل', value: 4000 },
    { name: 'شاليه البحر', value: 3000 },
    { name: 'فيلا الهدوء', value: 2000 },
    { name: 'شاليه المرجان', value: 2780 },
  ];

  const bookingStatusData = [
    { name: 'مؤكدة', value: stats.activeBookings },
    { name: 'قيد الانتظار', value: stats.bookingsCount - stats.activeBookings - Math.floor(stats.bookingsCount * 0.1) },
    { name: 'ملغية', value: Math.floor(stats.bookingsCount * 0.1) },
  ];

  const COLORS = ['#6366f1', '#f59e0b', '#ef4444'];
  
  // Calculate total days for all bookings (assuming each booking is about 7 days)
  const totalBookedDays = stats.bookingsCount * 7;
  
  // Calculate occupancy rate (assuming each property has 365 available days per year)
  const occupancyRate = stats.propertiesCount > 0 
    ? Math.min(100, Math.round((totalBookedDays / (stats.propertiesCount * 365)) * 100)) 
    : 0;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">مرحبًا في لوحة تحكم المالك</h2>
        <p className="text-gray-400">إدارة عقاراتك وحجوزاتك بكل سهولة</p>
      </div>
      
      {/* Quick Actions */}
      <div className={`mb-8 bg-gradient-to-r from-indigo-900/20 to-indigo-800/10 border border-indigo-800/30 rounded-xl p-5 ${
        animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`} style={{ transitionDelay: '100ms', transition: 'all 0.7s ease-out' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">إدارة مؤجراتك</h3>
            <p className="text-sm text-gray-400">تريد إضافة عقار جديد أو عرض الحجوزات الحالية؟</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={onAddProperty}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-600/20"
            >
              <Plus size={16} className="mr-1" />
              إضافة عقار جديد
            </Button>
            <Button 
              variant="outline" 
              className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10"
              onClick={onViewAllProperties}
            >
              <Building size={16} className="mr-1" />
              إدارة العقارات
            </Button>
            <Button 
              variant="outline" 
              className="border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10"
              onClick={onViewAllBookings}
            >
              <Calendar size={16} className="mr-1" />
              إدارة الحجوزات
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <PropertyAdminStatsCard
          title="العقارات"
          value={stats.propertiesCount}
          icon={<Building size={20} />}
          color="indigo-500"
          trend={{ value: 10, isPositive: true }}
          delay={200}
          animate={animate}
        />
        
        <PropertyAdminStatsCard
          title="الحجوزات النشطة"
          value={stats.activeBookings}
          subtitle={`من أصل ${stats.bookingsCount} حجز`}
          icon={<Calendar size={20} />}
          color="amber-500"
          trend={{ value: 5, isPositive: true }}
          delay={300}
          animate={animate}
        />
        
        <PropertyAdminStatsCard
          title="الإيرادات"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          icon={<DollarSign size={20} />}
          color="green-500"
          trend={{ value: 15, isPositive: true }}
          delay={400}
          animate={animate}
        />
        
        <PropertyAdminStatsCard
          title="التقييمات"
          value={stats.reviewsCount}
          icon={<Star size={20} />}
          color="rose-500"
          trend={{ value: 2, isPositive: false }}
          delay={500}
          animate={animate}
        />
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bookings Chart */}
        <Card className={`col-span-1 lg:col-span-2 border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '600ms', transition: 'all 0.7s ease-out' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-white">
              إحصائيات الحجوزات
            </CardTitle>
            <FaChartLine className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bookingsByMonth}
                  margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#f3f4f6'
                    }}
                  />
                  <Bar 
                    dataKey="حجوزات" 
                    fill="#6366f1" 
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Booking Status Distribution */}
        <Card className={`border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '700ms', transition: 'all 0.7s ease-out' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-white">
              توزيع الحجوزات
            </CardTitle>
            <FaCalendarAlt className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
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
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span style={{ color: '#e5e7eb' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Financial Insights & Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className={`border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '800ms', transition: 'all 0.7s ease-out' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-white">
              الإيرادات حسب العقار
            </CardTitle>
            <FaMoneyBillWave className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={earningsByProperty}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value}`}
                  >
                    {earningsByProperty.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`hsl(${210 + index * 30}, 70%, 50%)`} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#f3f4f6'
                    }}
                    formatter={(value) => [`$${value}`, 'الإيرادات']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Occupancy Rate */}
        <Card className={`border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '900ms', transition: 'all 0.7s ease-out' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-white">
              معدل الإشغال
            </CardTitle>
            <Users className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-[300px]">
              <div className="relative w-48 h-48">
                {/* Background circle */}
                <div className="absolute inset-0 rounded-full bg-gray-800"></div>
                
                {/* Progress circle */}
                <div 
                  className="absolute inset-0 rounded-full bg-indigo-600"
                  style={{ 
                    clipPath: `polygon(0 0, 100% 0, 100% ${occupancyRate}%, 0 ${occupancyRate}%)`,
                    transform: 'rotate(180deg)'
                  }}
                ></div>
                
                {/* Inner circle */}
                <div className="absolute inset-4 rounded-full bg-gray-950 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">{occupancyRate}%</div>
                    <div className="text-sm text-gray-400">معدل الإشغال</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                <div className="bg-gray-800/60 rounded-md p-3 text-center">
                  <div className="text-3xl font-bold text-indigo-400">{totalBookedDays}</div>
                  <div className="text-xs text-gray-400">إجمالي أيام الحجز</div>
                </div>
                
                <div className="bg-gray-800/60 rounded-md p-3 text-center">
                  <div className="text-3xl font-bold text-indigo-400">{stats.propertiesCount * 365}</div>
                  <div className="text-xs text-gray-400">إجمالي الأيام المتاحة</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity and Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Bookings */}
        <Card className={`border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '1000ms', transition: 'all 0.7s ease-out' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-white">أحدث الحجوزات</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-indigo-400 h-8 px-2 hover:text-indigo-300"
              onClick={onViewAllBookings}
            >
              <Eye size={16} className="mr-1" /> عرض الكل
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.slice(0, 5).map((booking, index) => (
                  <div key={booking.id} className="flex items-center gap-3 border-b border-gray-800 pb-3 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                      <Calendar size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {booking.customerName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {booking.propertyName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-indigo-400">${booking.totalPrice}</p>
                      <p className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-500 mb-3" />
                  <p className="text-gray-400">لا توجد حجوزات حديثة</p>
                </div>
              )}
              
              {recentBookings.length > 0 && (
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                    onClick={onViewAllBookings}
                  >
                    عرض جميع الحجوزات
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Performance Metrics */}
        <Card className={`border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '1100ms', transition: 'all 0.7s ease-out' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium text-white">مؤشرات الأداء</CardTitle>
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Average Daily Rate */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">متوسط السعر اليومي</p>
                    <p className="text-xs text-gray-400">متوسط السعر لكل ليلة</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-400">
                    ${stats.totalEarnings > 0 && totalBookedDays > 0 
                      ? Math.round(stats.totalEarnings / totalBookedDays) 
                      : 0}
                  </p>
                  <Badge className="bg-green-500/20 text-green-400 border-0">
                    <TrendingUp size={12} className="mr-1" /> 3.2%
                  </Badge>
                </div>
              </div>
              
              {/* Average Rating */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center text-amber-400">
                    <Star size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">متوسط التقييم</p>
                    <p className="text-xs text-gray-400">رضا العملاء</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <p className="text-xl font-bold text-amber-400">4.2</p>
                    <Star size={16} className="ml-1 fill-current text-amber-400" />
                  </div>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={12} 
                        className={`${star <= 4 ? 'fill-current text-amber-400' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Booking Conversion Rate */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center text-green-400">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">معدل تحويل الحجوزات</p>
                    <p className="text-xs text-gray-400">نسبة تحويل المشاهدات إلى حجوزات</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-400">24%</p>
                  <Badge className="bg-green-500/20 text-green-400 border-0">
                    <TrendingUp size={12} className="mr-1" /> 5.7%
                  </Badge>
                </div>
              </div>
              
              {/* Revenue Per Property */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-rose-600/20 flex items-center justify-center text-rose-400">
                    <Building size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">الإيرادات لكل عقار</p>
                    <p className="text-xs text-gray-400">متوسط الإيرادات لكل عقار</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-rose-400">
                    ${stats.propertiesCount > 0 
                      ? Math.round(stats.totalEarnings / stats.propertiesCount) 
                      : 0}
                  </p>
                  <Badge className="bg-green-500/20 text-green-400 border-0">
                    <TrendingUp size={12} className="mr-1" /> 8.4%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PropertyAdminOverview;