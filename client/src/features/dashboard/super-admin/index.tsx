import React from "react";

export default function SuperAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-400">لوحة تحكم المسؤول الرئيسي</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="المستخدمين"
            count="1,254"
            icon="users"
            color="bg-gradient-to-r from-blue-500 to-blue-700"
          />
          <DashboardCard
            title="العقارات"
            count="48"
            icon="home"
            color="bg-gradient-to-r from-green-500 to-green-700"
          />
          <DashboardCard
            title="الحجوزات"
            count="312"
            icon="calendar"
            color="bg-gradient-to-r from-purple-500 to-purple-700"
          />
        </div>

        <div className="mt-10 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">الإحصائيات الشهرية</h2>
          <p className="text-gray-400">معلومات الإحصائيات ستظهر هنا...</p>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  count: string;
  icon: 'users' | 'home' | 'calendar';
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
          <span className="text-xl">{icon === "users" ? "👥" : icon === "home" ? "🏠" : "📅"}</span>
        </div>
      </div>
    </div>
  );
}