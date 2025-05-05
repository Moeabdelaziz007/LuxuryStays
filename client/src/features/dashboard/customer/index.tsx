import React from "react";

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-400">لوحة تحكم العميل</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">حجوزاتي القادمة</h2>
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">شقة بانوراما البحر</h3>
                  <p className="text-sm text-gray-400 mt-1">15 يونيو - 22 يونيو 2025</p>
                </div>
                <div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">مؤكد</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">فيلا الواحة</h3>
                  <p className="text-sm text-gray-400 mt-1">5 يوليو - 10 يوليو 2025</p>
                </div>
                <div>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">بانتظار الدفع</span>
                </div>
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
  icon: 'ticket' | 'heart' | 'envelope';
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
          <span className="text-xl">
            {icon === "ticket" ? "🎫" : icon === "heart" ? "❤️" : "✉️"}
          </span>
        </div>
      </div>
    </div>
  );
}