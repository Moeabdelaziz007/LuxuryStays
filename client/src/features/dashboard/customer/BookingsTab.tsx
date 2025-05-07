import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { BookingManager } from '@/features/booking/BookingManager';
import { UserRole } from '@shared/schema';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Home, Search } from 'lucide-react';
import { useLocation } from 'wouter';
import DatabaseErrorBoundary from '@/components/DatabaseErrorBoundary';

/**
 * تعرض قائمة بحجوزات المستخدم ضمن لوحة تحكم العميل
 */
const BookingsTab: React.FC = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isDetailView, setIsDetailView] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <p>الرجاء تسجيل الدخول لعرض حجوزاتك.</p>
      </Card>
    );
  }

  return (
    <DatabaseErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#39FF14]">حجوزاتك</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => navigate('/search')}
            >
              <Search className="h-4 w-4" />
              بحث عن عقارات
            </Button>
            <Button
              className="bg-[#39FF14] text-black hover:bg-[#32D111] flex items-center gap-1"
              size="sm"
              onClick={() => navigate('/properties')}
            >
              <Home className="h-4 w-4" />
              استكشف العقارات
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`${isDetailView ? 'md:col-span-1' : 'md:col-span-4'}`}>
            <BookingManager
              userRole={UserRole.CUSTOMER}
              userId={user.uid}
              showFilters={true}
              onBookingSelected={(booking) => {
                setSelectedBookingId(booking.id);
                setIsDetailView(true);
              }}
            />
          </div>

          {isDetailView && selectedBookingId && (
            <div className="md:col-span-3">
              <BookingDetailCard
                bookingId={selectedBookingId}
                onClose={() => {
                  setIsDetailView(false);
                  setSelectedBookingId(null);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </DatabaseErrorBoundary>
  );
};

interface BookingDetailCardProps {
  bookingId: string;
  onClose: () => void;
}

/**
 * عرض تفاصيل حجز معين
 */
const BookingDetailCard: React.FC<BookingDetailCardProps> = ({ bookingId, onClose }) => {
  // في التطبيق الحقيقي، ستقوم بجلب بيانات الحجز من الخادم
  return (
    <Card className="p-6 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-[#39FF14]" />
            تفاصيل الحجز
          </h3>
          <p className="text-sm text-muted-foreground">رقم الحجز: {bookingId}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          إغلاق
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">اسم العقار</p>
            <p className="font-medium">فيلا مع إطلالة على البحر</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">الموقع</p>
            <p className="font-medium">جدة، المملكة العربية السعودية</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">تاريخ الوصول</p>
            <p className="font-medium">15 مايو 2025</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">تاريخ المغادرة</p>
            <p className="font-medium">22 مايو 2025</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">عدد الضيوف</p>
            <p className="font-medium">4 أشخاص</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">الحالة</p>
            <p className="font-medium">
              <span className="inline-block px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                مؤكد
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-2">تفاصيل الدفع</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">سعر الليلة</span>
              <span>500 ريال × 7 ليالي</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">رسوم التنظيف</span>
              <span>250 ريال</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">رسوم الخدمة</span>
              <span>350 ريال</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>المجموع</span>
              <span className="text-[#39FF14]">4,100 ريال</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between">
            <h4 className="font-medium">ملاحظات</h4>
          </div>
          <p className="text-muted-foreground mt-2">
            لا توجد ملاحظات إضافية لهذا الحجز.
          </p>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            رجوع
          </Button>
          <Button className="bg-[#39FF14] text-black hover:bg-[#32D111]">
            طباعة تفاصيل الحجز
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BookingsTab;