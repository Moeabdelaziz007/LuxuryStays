import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { format, isSameDay, isSameMonth, isWithinInterval, addDays, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CalendarIcon, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type BookingType = {
  id: string;
  propertyId: string;
  propertyName?: string;
  startDate: Date | { toDate: () => Date };
  endDate: Date | { toDate: () => Date };
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  guests: number;
};

type PropertyType = {
  id: string;
  name: string;
  location: string;
  type: string;
  dailyPrice: number;
  image?: string;
};

// مكون منفصل لعرض تفاصيل الحجز
const BookingDetails = ({ booking }: { booking: BookingType }) => {
  // تحويل التواريخ إذا كانت كائنات Firestore Timestamp
  const startDate = booking.startDate instanceof Date ? booking.startDate : booking.startDate.toDate();
  const endDate = booking.endDate instanceof Date ? booking.endDate : booking.endDate.toDate();
  
  // حساب عدد الأيام
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // تحديد لون الحالة
  const statusColor = {
    pending: "bg-yellow-500 hover:bg-yellow-600",
    confirmed: "bg-green-500 hover:bg-green-600",
    cancelled: "bg-red-500 hover:bg-red-600"
  };
  
  // ترجمة حالة الحجز إلى العربية
  const statusText = {
    pending: "قيد الانتظار",
    confirmed: "مؤكد",
    cancelled: "ملغي"
  };
  
  // أيقونة الحالة
  const StatusIcon = {
    pending: Clock,
    confirmed: CheckCircle,
    cancelled: XCircle
  }[booking.status];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{booking.propertyName || "عقار"}</h3>
        <Badge className={statusColor[booking.status]}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {statusText[booking.status]}
        </Badge>
      </div>
      
      <div className="bg-gray-800/40 rounded-lg p-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">تاريخ الوصول:</span>
          <span className="font-medium">{format(startDate, 'yyyy/MM/dd', { locale: ar })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">تاريخ المغادرة:</span>
          <span className="font-medium">{format(endDate, 'yyyy/MM/dd', { locale: ar })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">عدد الأيام:</span>
          <span className="font-medium">{days} يوم</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">عدد الضيوف:</span>
          <span className="font-medium">{booking.guests} ضيف</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">السعر الكلي:</span>
          <span className="font-medium text-[#39FF14]">${booking.totalPrice}</span>
        </div>
      </div>
      
      <div className="mt-2">
        <h4 className="text-sm font-medium mb-2">معلومات العميل</h4>
        <div className="bg-gray-800/40 rounded-lg p-3 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">الاسم:</span>
            <span className="font-medium">{booking.guestName}</span>
          </div>
          {booking.guestEmail && (
            <div className="flex justify-between">
              <span className="text-gray-400">البريد الإلكتروني:</span>
              <span className="font-medium">{booking.guestEmail}</span>
            </div>
          )}
          {booking.guestPhone && (
            <div className="flex justify-between">
              <span className="text-gray-400">رقم الهاتف:</span>
              <span className="font-medium" dir="ltr">{booking.guestPhone}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2 rtl:space-x-reverse pt-2">
        <Button 
          variant="default" 
          size="sm" 
          className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90 grow"
        >
          تعديل الحجز
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/10"
        >
          التواصل مع العميل
        </Button>
      </div>
    </div>
  );
};

export default function BookingCalendar() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);
  
  // جلب جميع العقارات لمدير العقارات
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ['admin-properties', user?.uid],
    queryFn: async () => {
      if (!user?.uid || !db) return [];
      
      try {
        const propertiesQuery = query(
          collection(db, 'properties'),
          where('ownerId', '==', user.uid)
        );
        
        const snapshot = await getDocs(propertiesQuery);
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PropertyType[];
      } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
      }
    },
    enabled: !!user?.uid && !!db,
  });
  
  // جلب جميع الحجوزات لعقارات المدير
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-bookings', user?.uid, properties.length],
    queryFn: async () => {
      if (!user?.uid || !db || properties.length === 0) return [];
      
      try {
        const propertyIds = properties.map(p => p.id);
        const allBookings: BookingType[] = [];
        
        // للمبسط، نجلب الحجوزات لكل عقار على حدة
        for (const propertyId of propertyIds) {
          const bookingsQuery = query(
            collection(db, 'bookings'),
            where('propertyId', '==', propertyId)
          );
          
          const snapshot = await getDocs(bookingsQuery);
          
          const property = properties.find(p => p.id === propertyId);
          
          snapshot.docs.forEach(doc => {
            allBookings.push({
              id: doc.id,
              propertyName: property?.name || 'عقار',
              ...doc.data()
            } as BookingType);
          });
        }
        
        return allBookings;
      } catch (error) {
        console.error('Error fetching bookings:', error);
        return [];
      }
    },
    enabled: !!user?.uid && !!db && properties.length > 0,
  });
  
  // جلب الحجوزات في التاريخ المحدد
  const bookingsForDate = selectedDate 
    ? bookings.filter(booking => {
        const startDate = booking.startDate instanceof Date 
          ? booking.startDate 
          : booking.startDate.toDate();
        
        const endDate = booking.endDate instanceof Date 
          ? booking.endDate 
          : booking.endDate.toDate();
        
        return isWithinInterval(selectedDate, { 
          start: startDate, 
          end: endDate 
        });
      })
    : [];
  
  // حساب عدد الحجوزات بحسب الحالة
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  
  // تابع مساعد لتحديد لون اليوم في التقويم
  function getDayClass(day: Date) {
    // اليوم المحدد
    const isSelected = selectedDate && isSameDay(day, selectedDate);
    
    // الحجوزات في هذا اليوم
    const dayBookings = bookings.filter(booking => {
      const startDate = booking.startDate instanceof Date 
        ? booking.startDate 
        : booking.startDate.toDate();
      
      const endDate = booking.endDate instanceof Date 
        ? booking.endDate 
        : booking.endDate.toDate();
      
      return isWithinInterval(day, { start: startDate, end: endDate });
    });
    
    // هل هناك حجوزات مؤكدة في هذا اليوم
    const hasConfirmed = dayBookings.some(b => b.status === 'confirmed');
    // هل هناك حجوزات قيد الانتظار في هذا اليوم
    const hasPending = dayBookings.some(b => b.status === 'pending');
    
    const bookingCount = dayBookings.length;
    
    // تحديد اللون بناءً على الحالة
    if (isSelected) {
      return 'bg-[#39FF14] text-black hover:bg-[#39FF14]';
    } else if (hasConfirmed) {
      return 'bg-green-900/30 text-green-400 font-medium border-green-900';
    } else if (hasPending) {
      return 'bg-yellow-900/30 text-yellow-400 font-medium border-yellow-900';
    } else if (bookingCount > 0) {
      return 'bg-gray-800 text-gray-200 font-medium';
    }
    
    return '';
  }
  
  // تابع مساعد لإعادة إنشاء رمز تلميح لكل يوم في التقويم
  function renderDayBadge(day: Date) {
    // الحجوزات في هذا اليوم
    const dayBookings = bookings.filter(booking => {
      const startDate = booking.startDate instanceof Date 
        ? booking.startDate 
        : booking.startDate.toDate();
      
      const endDate = booking.endDate instanceof Date 
        ? booking.endDate 
        : booking.endDate.toDate();
      
      return isWithinInterval(day, { start: startDate, end: endDate });
    });
    
    if (dayBookings.length === 0) return null;
    
    // أرقام الحجوزات حسب الحالة
    const confirmedCount = dayBookings.filter(b => b.status === 'confirmed').length;
    const pendingCount = dayBookings.filter(b => b.status === 'pending').length;
    
    return (
      <div className="text-[8px] flex justify-center gap-1 -mt-1 mb-1">
        {confirmedCount > 0 && <span className="bg-green-900/60 px-1 rounded-sm text-green-400">{confirmedCount}</span>}
        {pendingCount > 0 && <span className="bg-yellow-900/60 px-1 rounded-sm text-yellow-400">{pendingCount}</span>}
      </div>
    );
  }
  
  return (
    <Card className="bg-gray-900 border-gray-800 w-full">
      <CardHeader>
        <CardTitle className="text-[#39FF14]">تقويم الحجوزات</CardTitle>
        <CardDescription>عرض جميع الحجوزات في تقويم شهري لإدارة أفضل</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-7 lg:gap-6">
          {/* تقويم الحجوزات */}
          <div className="col-span-1 lg:col-span-4 mb-6 lg:mb-0">
            <div className="relative">
              {bookingsLoading && (
                <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center z-10 rounded-md">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-32 bg-gray-800" />
                    <Skeleton className="h-4 w-24 bg-gray-800" />
                  </div>
                </div>
              )}
              
              <Calendar
                locale={ar}
                mode="single"
                selected={selectedDate as any}
                onSelect={(date) => {
                  // Handle setting selected date safely
                  if (date instanceof Date || date === undefined) {
                    setSelectedDate(date || null);
                    setSelectedBooking(null);
                  }
                }}
                className="rounded-md border border-gray-800 bg-gray-950"
                classNames={{
                  day_selected: "bg-[#39FF14] text-black hover:bg-[#39FF14]",
                  day_today: "bg-gray-800 text-white",
                  day_outside: "text-gray-500 opacity-40",
                  day: cn(
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-800"
                  ),
                  head_cell: "text-gray-500 font-normal text-[0.8rem]",
                  cell: cn(
                    "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-transparent"
                  ),
                }}
                components={{
                  IconLeft: () => <ChevronRight className="h-4 w-4" />,
                  IconRight: () => <ChevronLeft className="h-4 w-4" />,
                  Day: ({ date, ...props }) => {
                    const dayClass = getDayClass(date);
                    return (
                      <div className="p-0 relative">
                        <button
                          className={cn(
                            "h-9 w-9 p-0 font-normal rounded-md",
                            dayClass
                          )}
                          {...props}
                        >
                          {date.getDate()}
                        </button>
                        {renderDayBadge(date)}
                      </div>
                    );
                  },
                }}
              />
            </div>
            
            {/* ملخص الحجوزات */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-800/60 rounded-md p-3 text-center">
                <div className="text-yellow-400 font-bold text-2xl">{pendingBookings}</div>
                <div className="text-xs text-gray-400">قيد الانتظار</div>
              </div>
              <div className="bg-gray-800/60 rounded-md p-3 text-center">
                <div className="text-green-400 font-bold text-2xl">{confirmedBookings}</div>
                <div className="text-xs text-gray-400">مؤكدة</div>
              </div>
              <div className="bg-gray-800/60 rounded-md p-3 text-center">
                <div className="text-red-400 font-bold text-2xl">{cancelledBookings}</div>
                <div className="text-xs text-gray-400">ملغاة</div>
              </div>
            </div>
          </div>
          
          {/* تفاصيل الحجوزات في اليوم المحدد */}
          <div className="col-span-1 lg:col-span-3">
            <div className="bg-gray-800/30 rounded-md p-4 min-h-[500px]">
              {selectedDate ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">
                      حجوزات {format(selectedDate, 'yyyy/MM/dd', { locale: ar })}
                    </h3>
                    <Badge variant="outline" className="bg-gray-900 border-gray-700">
                      {bookingsForDate.length} حجز
                    </Badge>
                  </div>
                  
                  {bookingsForDate.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center">
                      <div className="bg-gray-800/60 rounded-full p-3 mb-3">
                        <CalendarIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <h4 className="text-gray-300 font-medium">لا توجد حجوزات في هذا اليوم</h4>
                      <p className="text-gray-500 text-sm mt-1">اختر يوماً آخر أو أضف حجزاً جديداً</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedBooking ? (
                        <BookingDetails booking={selectedBooking} />
                      ) : (
                        <div className="divide-y divide-gray-800">
                          {bookingsForDate.map((booking) => (
                            <div 
                              key={booking.id} 
                              className="py-3 cursor-pointer hover:bg-gray-800/40 px-2 rounded-md"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <div className="flex justify-between">
                                <div className="flex items-center">
                                  <div 
                                    className={cn(
                                      "w-2 h-2 rounded-full mr-2",
                                      booking.status === 'confirmed' ? "bg-green-500" : 
                                      booking.status === 'pending' ? "bg-yellow-500" : 
                                      "bg-red-500"
                                    )}
                                  />
                                  <span className="font-medium">{booking.guestName}</span>
                                </div>
                                <div className="text-sm text-gray-400">{booking.propertyName}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-gray-800/60 rounded-full p-3 mb-3">
                    <CalendarIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 className="text-gray-300 font-medium">اختر يوماً من التقويم</h4>
                  <p className="text-gray-500 text-sm mt-1">لعرض تفاصيل الحجوزات في ذلك اليوم</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}