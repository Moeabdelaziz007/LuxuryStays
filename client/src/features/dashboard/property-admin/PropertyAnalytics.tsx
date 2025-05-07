import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

// بيانات تجريبية للرسوم البيانية
const bookingsData = [
  { month: 'يناير', bookings: 5 },
  { month: 'فبراير', bookings: 8 },
  { month: 'مارس', bookings: 12 },
  { month: 'أبريل', bookings: 15 },
  { month: 'مايو', bookings: 20 },
  { month: 'يونيو', bookings: 25 },
  { month: 'يوليو', bookings: 30 },
  { month: 'أغسطس', bookings: 32 },
  { month: 'سبتمبر', bookings: 28 },
  { month: 'أكتوبر', bookings: 22 },
  { month: 'نوفمبر', bookings: 18 },
  { month: 'ديسمبر', bookings: 15 }
];

const revenueData = [
  { month: 'يناير', revenue: 500 },
  { month: 'فبراير', revenue: 800 },
  { month: 'مارس', revenue: 1200 },
  { month: 'أبريل', revenue: 1500 },
  { month: 'مايو', revenue: 2000 },
  { month: 'يونيو', revenue: 2500 },
  { month: 'يوليو', revenue: 3000 },
  { month: 'أغسطس', revenue: 3200 },
  { month: 'سبتمبر', revenue: 2800 },
  { month: 'أكتوبر', revenue: 2200 },
  { month: 'نوفمبر', revenue: 1800 },
  { month: 'ديسمبر', revenue: 1500 }
];

const sourceData = [
  { name: 'مباشر', value: 400 },
  { name: 'محركات البحث', value: 300 },
  { name: 'وسائل التواصل', value: 200 },
  { name: 'الإحالات', value: 100 }
];

const COLORS = ['#39FF14', '#0088FE', '#FFBB28', '#FF8042'];

export default function PropertyAnalytics() {
  const { user } = useAuth();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>('year');
  
  // جلب قائمة العقارات
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['analytics-properties', user?.uid],
    queryFn: async () => {
      if (!user?.uid || !db) return [];
      
      try {
        const q = query(
          collection(db, 'properties'),
          where('ownerId', '==', user.uid)
        );
        
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
      }
    },
    enabled: !!user?.uid && !!db
  });
  
  // تحديد العقار الافتراضي عند تحميل البيانات
  React.useEffect(() => {
    if (properties.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties, selectedPropertyId]);
  
  // جلب بيانات التحليلات للعقار المختار
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['property-analytics', selectedPropertyId, timeRange],
    queryFn: async () => {
      if (!selectedPropertyId || !db) return null;
      
      // في الحالة الحقيقية، سنقوم بجلب البيانات من قاعدة البيانات
      // ولكن لأغراض العرض سنستخدم بيانات تجريبية
      
      try {
        // هنا يمكن إضافة منطق لجلب البيانات الفعلية من Firestore
        
        return {
          totalBookings: 208,
          totalRevenue: 20800,
          averageOccupancy: 78,
          averageRating: 4.7,
          bookingsData: bookingsData,
          revenueData: revenueData,
          sourceData: sourceData
        };
      } catch (error) {
        console.error('Error fetching analytics:', error);
        return null;
      }
    },
    enabled: !!selectedPropertyId && !!db
  });
  
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-[#39FF14]">تحليلات الأداء</CardTitle>
          <CardDescription>
            {selectedProperty 
              ? `عرض تحليلات الأداء لـ ${selectedProperty.name}`
              : 'اختر عقاراً لعرض التحليلات'
            }
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-4">
          <Select 
            value={selectedPropertyId || ''} 
            onValueChange={(value) => setSelectedPropertyId(value)}
            disabled={propertiesLoading || properties.length === 0}
          >
            <SelectTrigger className="w-[180px] bg-gray-950 border-gray-800">
              <SelectValue placeholder="اختر عقاراً" />
            </SelectTrigger>
            <SelectContent className="bg-gray-950 border-gray-800">
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[120px] bg-gray-950 border-gray-800">
              <SelectValue placeholder="المدة الزمنية" />
            </SelectTrigger>
            <SelectContent className="bg-gray-950 border-gray-800">
              <SelectItem value="month">شهر</SelectItem>
              <SelectItem value="quarter">ربع سنة</SelectItem>
              <SelectItem value="year">سنة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {!analytics ? (
          <div className="text-center py-12 text-gray-400">
            {analyticsLoading ? 'جاري تحميل البيانات...' : 'اختر عقاراً لعرض التحليلات'}
          </div>
        ) : (
          <>
            {/* بطاقات إحصائية */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">إجمالي الحجوزات</div>
                <div className="text-3xl font-bold text-white">{analytics.totalBookings}</div>
                <div className="text-xs text-green-400 mt-1">↑ 12% عن الفترة السابقة</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">إجمالي الإيرادات</div>
                <div className="text-3xl font-bold text-white">${analytics.totalRevenue}</div>
                <div className="text-xs text-green-400 mt-1">↑ 8% عن الفترة السابقة</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">متوسط الإشغال</div>
                <div className="text-3xl font-bold text-white">{analytics.averageOccupancy}%</div>
                <div className="text-xs text-green-400 mt-1">↑ 5% عن الفترة السابقة</div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">متوسط التقييمات</div>
                <div className="text-3xl font-bold text-white">{analytics.averageRating}/5</div>
                <div className="text-xs text-green-400 mt-1">↑ 0.2 عن الفترة السابقة</div>
              </div>
            </div>
            
            {/* علامات تبويب التحليلات */}
            <Tabs defaultValue="bookings" className="w-full">
              <TabsList className="bg-gray-800 border-gray-700 w-full justify-start mb-4">
                <TabsTrigger 
                  value="bookings"
                  className="data-[state=active]:bg-[#39FF14]/10 data-[state=active]:text-[#39FF14] rounded-sm"
                >
                  الحجوزات
                </TabsTrigger>
                <TabsTrigger 
                  value="revenue" 
                  className="data-[state=active]:bg-[#39FF14]/10 data-[state=active]:text-[#39FF14] rounded-sm"
                >
                  الإيرادات
                </TabsTrigger>
                <TabsTrigger 
                  value="source" 
                  className="data-[state=active]:bg-[#39FF14]/10 data-[state=active]:text-[#39FF14] rounded-sm"
                >
                  مصادر الحجوزات
                </TabsTrigger>
              </TabsList>
              
              {/* محتوى تبويب الحجوزات */}
              <TabsContent value="bookings" className="border border-gray-800 rounded-lg p-4">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.bookingsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="month" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} 
                        labelStyle={{ color: '#ddd' }}
                      />
                      <Legend />
                      <Bar dataKey="bookings" name="عدد الحجوزات" fill="#39FF14" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center text-sm text-gray-400">
                  إجمالي الحجوزات خلال {timeRange === 'year' ? 'العام' : timeRange === 'quarter' ? 'الربع' : 'الشهر'} الماضي
                </div>
              </TabsContent>
              
              {/* محتوى تبويب الإيرادات */}
              <TabsContent value="revenue" className="border border-gray-800 rounded-lg p-4">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analytics.revenueData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="month" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} 
                        labelStyle={{ color: '#ddd' }}
                        formatter={(value) => [`$${value}`, 'الإيرادات']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        name="الإيرادات" 
                        stroke="#39FF14" 
                        strokeWidth={2}
                        dot={{ fill: '#39FF14', strokeWidth: 1, r: 4 }}
                        activeDot={{ r: 8, fill: '#fff', stroke: '#39FF14' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center text-sm text-gray-400">
                  إجمالي الإيرادات خلال {timeRange === 'year' ? 'العام' : timeRange === 'quarter' ? 'الربع' : 'الشهر'} الماضي (بالدولار الأمريكي)
                </div>
              </TabsContent>
              
              {/* محتوى تبويب مصادر الحجوزات */}
              <TabsContent value="source" className="border border-gray-800 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="col-span-1 md:col-span-2">
                    <div className="space-y-4">
                      <h3 className="font-bold text-lg text-[#39FF14]">مصادر الحجوزات</h3>
                      <p className="text-gray-400 text-sm">
                        تحليل توزيع مصادر الحجوزات حسب القنوات المختلفة. استخدم هذه البيانات لتحسين استراتيجيات التسويق وزيادة الحجوزات.
                      </p>
                      
                      <div className="mt-6 space-y-3">
                        {analytics.sourceData.map((entry, index) => (
                          <div key={`source-${index}`} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="text-sm text-gray-300">{entry.name}</span>
                            </div>
                            <div className="font-medium">{entry.value} ({Math.round(entry.value / analytics.totalBookings * 100)}%)</div>
                          </div>
                        ))}
                      </div>
                      
                      <Button className="mt-4 w-full bg-[#39FF14] text-black hover:bg-[#39FF14]/90">
                        تنزيل التقرير الكامل
                      </Button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-3 h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.sourceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analytics.sourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} 
                          formatter={(value: any, name) => {
                            // Safely calculate percentage with type checking
                            const numValue = Number(value);
                            const totalBookings = Number(analytics.totalBookings);
                            const percentage = !isNaN(numValue) && totalBookings > 0 
                              ? Math.round((numValue / totalBookings) * 100) 
                              : 0;
                            return [`${value} (${percentage}%)`, name];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}