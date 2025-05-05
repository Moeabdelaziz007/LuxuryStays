import React from "react";

export default function PropertyAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-400">لوحة تحكم مدير العقارات</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            title="الشقق المدارة"
            count="12"
            icon="building"
            color="bg-gradient-to-r from-amber-500 to-amber-700"
          />
          <DashboardCard
            title="الحجوزات النشطة"
            count="28"
            icon="calendar-check"
            color="bg-gradient-to-r from-teal-500 to-teal-700"
          />
        </div>

        <div className="mt-10 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">أحدث الطلبات</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium">شقة الخليج - 204</h3>
                <p className="text-sm text-gray-400">طلب حجز جديد</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-green-600 rounded-md text-sm">قبول</button>
                <button className="px-3 py-1 bg-red-600 rounded-md text-sm">رفض</button>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
              <div>
                <h3 className="font-medium">فيلا البحر - 3</h3>
                <p className="text-sm text-gray-400">طلب تعديل</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-green-600 rounded-md text-sm">عرض</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  count: string;
  icon: 'building' | 'calendar-check';
  color: string;
}

// Simple dashboard card component
function DashboardCard({ title, count, icon, color }: DashboardCardProps) {
  return (
    <div className={`${color} rounded-xl p-6 shadow-lg`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-2xl font-bold mt-2">{count}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
          <span className="text-xl">{icon === "building" ? "🏢" : "✅"}</span>
        </div>
      </div>
    </div>
  );
}