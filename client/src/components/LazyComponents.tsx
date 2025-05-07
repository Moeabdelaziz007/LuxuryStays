import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// تخصيص مكونات التحميل حسب نوع المحتوى
interface LoadingProps {
  type?: 'dashboard' | 'table' | 'form' | 'calendar' | 'default';
  title?: string;
}

// واجهة التحميل للمكونات الكسولة
export const LazyLoadingPlaceholder: React.FC<LoadingProps> = ({ 
  type = 'default',
  title
}) => {
  switch (type) {
    case 'dashboard':
      return (
        <Card className="w-full shadow-md animate-pulse bg-black/5 dark:bg-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      );
    
    case 'table':
      return (
        <div className="w-full space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-12 w-full" />
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
          <div className="flex justify-end mt-4">
            <Skeleton className="h-8 w-64" />
          </div>
        </div>
      );
    
    case 'form':
      return (
        <div className="w-full space-y-5">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
      );
    
    case 'calendar':
      return (
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-36" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </div>
      );
    
    default:
      return (
        <div className="w-full p-6 border rounded-md bg-black/5 dark:bg-white/5 animate-pulse">
          {title && <Skeleton className="h-7 w-48 mb-4" />}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      );
  }
};

// Lazy load components with the correct type definitions
// Customer Dashboard
const CustomerDashboardLazy = React.lazy(() => 
  import('@/features/dashboard/customer/CustomerDashboard')
);

export const LazyCustomerDashboard = (props: any) => (
  <Suspense fallback={<LazyLoadingPlaceholder type="dashboard" title="لوحة تحكم العميل" />}>
    <CustomerDashboardLazy {...props} />
  </Suspense>
);

// Property Admin Dashboard
const PropertyAdminDashboardLazy = React.lazy(() => 
  import('@/features/dashboard/property-admin/NewPropertyAdminDashboard')
);

export const LazyPropertyAdminDashboard = (props: any) => (
  <Suspense fallback={<LazyLoadingPlaceholder type="dashboard" title="لوحة تحكم مدير العقارات" />}>
    <PropertyAdminDashboardLazy {...props} />
  </Suspense>
);

// Super Admin Dashboard
const SuperAdminDashboardLazy = React.lazy(() => 
  import('@/features/dashboard/super-admin/NewSuperAdminDashboard')
);

export const LazySuperAdminDashboard = (props: any) => (
  <Suspense fallback={<LazyLoadingPlaceholder type="dashboard" title="لوحة تحكم المشرف العام" />}>
    <SuperAdminDashboardLazy {...props} />
  </Suspense>
);

// Property Management
const PropertyManagementLazy = React.lazy(() => 
  import('@/features/properties/PropertyManagement')
);

export const LazyPropertyManagement = (props: any) => (
  <Suspense fallback={<LazyLoadingPlaceholder type="table" title="إدارة العقارات" />}>
    <PropertyManagementLazy {...props} />
  </Suspense>
);

// Booking Calendar
const BookingCalendarLazy = React.lazy(() => 
  import('@/features/dashboard/property-admin/BookingCalendar')
);

export const LazyBookingCalendar = (props: any) => (
  <Suspense fallback={<LazyLoadingPlaceholder type="calendar" title="تقويم الحجوزات" />}>
    <BookingCalendarLazy {...props} />
  </Suspense>
);

// Property Analytics
const PropertyAnalyticsLazy = React.lazy(() => 
  import('@/features/dashboard/property-admin/PropertyAnalytics')
);

export const LazyPropertyAnalytics = (props: any) => (
  <Suspense fallback={<LazyLoadingPlaceholder type="dashboard" title="تحليلات العقارات" />}>
    <PropertyAnalyticsLazy {...props} />
  </Suspense>
);

// Booking Checkout
const BookingCheckoutLazy = React.lazy(() => 
  import('@/features/booking/BookingCheckout')
);

export const LazyBookingCheckout = (props: any) => (
  <Suspense fallback={<LazyLoadingPlaceholder type="form" title="إتمام الحجز" />}>
    <BookingCheckoutLazy {...props} />
  </Suspense>
);

// Booking Confirmation
const BookingConfirmationLazy = React.lazy(() => 
  import('@/features/booking/BookingConfirmation')
);

export const LazyBookingConfirmation = (props: any) => (
  <Suspense fallback={<LazyLoadingPlaceholder type="form" title="تأكيد الحجز" />}>
    <BookingConfirmationLazy {...props} />
  </Suspense>
);