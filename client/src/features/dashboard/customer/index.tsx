import React from "react";
import { useAuth } from "@/contexts/auth-context";
import CustomerBookingsList from "@/features/booking/CustomerBookingsList";

// Dashboard Card component
function DashboardCard({ 
  title, 
  count, 
  icon, 
  color 
}: { 
  title: string; 
  count: string; 
  icon: string; 
  color: string;
}) {
  // Icon mapping
  const getIcon = () => {
    switch (icon) {
      case 'ticket':
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4H18C19.1046 4 20 4.89543 20 6V8M16 4H8M16 4V2M8 4H6C4.89543 4 4 4.89543 4 6V8M8 4V2M8 20H6C4.89543 20 4 19.1046 4 18V16M8 20H16M8 20V22M16 20H18C19.1046 20 20 19.1046 20 18V16M16 20V22M20 8V16M4 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'heart':
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.31802 6.31802C2.56066 8.07538 2.56066 10.9246 4.31802 12.682L12.0001 20.364L19.682 12.682C21.4393 10.9246 21.4393 8.07538 19.682 6.31802C17.9246 4.56066 15.0754 4.56066 13.318 6.31802L12.0001 7.63609L10.682 6.31802C8.92462 4.56066 6.07538 4.56066 4.31802 6.31802Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'envelope':
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`rounded-xl p-6 text-white ${color}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-3xl font-bold">{count}</p>
        </div>
        <div className="rounded-full bg-white/20 p-3">
          {getIcon()}
        </div>
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 border-gray-700 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-400">لوحة تحكم العميل</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="حجوزاتي"
            count="3"
            icon="ticket"
            color="bg-gradient-to-r from-indigo-500 to-indigo-700"
          />
          <DashboardCard
            title="العقارات المفضلة"
            count="7"
            icon="heart"
            color="bg-gradient-to-r from-pink-500 to-pink-700"
          />
          <DashboardCard
            title="رسائلي"
            count="2"
            icon="envelope"
            color="bg-gradient-to-r from-cyan-500 to-cyan-700"
          />
        </div>
        
        {/* Bookings List */}
        <div className="mb-8">
          <CustomerBookingsList />
        </div>
        
        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">النشاط الأخير</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-green-500/20 p-2 mt-1">
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="font-medium">تم تأكيد حجزك في فيلا البحر</p>
                <p className="text-sm text-gray-400">منذ 3 ساعات</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-500/20 p-2 mt-1">
                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="font-medium">تذكير: موعد الحجز في فيلا النخيل غداً</p>
                <p className="text-sm text-gray-400">منذ يوم واحد</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Properties Section */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">عقارات مقترحة لك</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994" 
                alt="فيلا فاخرة"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">فيلا فاخرة مع مسبح</h3>
                <p className="text-sm text-gray-400">الرياض، السعودية</p>
                <p className="text-green-400 font-bold mt-2">1200 ر.س / الليلة</p>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6" 
                alt="شقة على البحر"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">شقة فاخرة على البحر</h3>
                <p className="text-sm text-gray-400">جدة، السعودية</p>
                <p className="text-green-400 font-bold mt-2">850 ر.س / الليلة</p>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750" 
                alt="شاليه الجبل"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">شاليه في الجبل</h3>
                <p className="text-sm text-gray-400">أبها، السعودية</p>
                <p className="text-green-400 font-bold mt-2">750 ر.س / الليلة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}