import React from "react";
import { FaUsers, FaHome, FaTools, FaBullhorn, FaPalette, FaBell } from "react-icons/fa";

export default function SuperAdminDashboard() {
  const cards = [
    { 
      icon: <FaUsers size={24} />, 
      label: "المستخدمين", 
      desc: "إدارة الحسابات والصلاحيات", 
      color: "from-[#39FF14] to-[#32CD32]" 
    },
    { 
      icon: <FaHome size={24} />, 
      label: "العقارات", 
      desc: "التحكم بالعقارات المعروضة", 
      color: "from-[#39FF14]/90 to-[#39FF14]" 
    },
    { 
      icon: <FaTools size={24} />, 
      label: "الخدمات", 
      desc: "تعديل وإضافة الخدمات", 
      color: "from-[#39FF14]/80 to-[#39FF14]/95" 
    },
    { 
      icon: <FaPalette size={24} />, 
      label: "الثيم والتصميم", 
      desc: "تخصيص الهوية البصرية", 
      color: "from-[#39FF14]/70 to-[#39FF14]/85" 
    },
    { 
      icon: <FaBell size={24} />, 
      label: "الإشعارات", 
      desc: "إرسال تنبيهات عامة أو خاصة", 
      color: "from-[#39FF14]/60 to-[#39FF14]/75" 
    },
    { 
      icon: <FaBullhorn size={24} />, 
      label: "العروض", 
      desc: "إدارة العروض الترويجية", 
      color: "from-[#39FF14]/50 to-[#39FF14]/65" 
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen p-8">
      {/* Header with Neon Effect */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-[#39FF14] mb-3 inline-block relative">
          لوحة المشرف العام
          <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-[#39FF14]/40"></div>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          مرحباً بك في لوحة تحكم المشرف العام، يمكنك من هنا إدارة جميع جوانب المنصة
        </p>
      </div>

      {/* Stats Overview */}
      <div className="bg-gray-900/50 p-4 rounded-xl border border-[#39FF14]/10 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3">
            <div className="text-sm text-gray-400">إجمالي المستخدمين</div>
            <div className="text-2xl font-bold">256</div>
          </div>
          <div className="p-3">
            <div className="text-sm text-gray-400">العقارات النشطة</div>
            <div className="text-2xl font-bold">126</div>
          </div>
          <div className="p-3">
            <div className="text-sm text-gray-400">الحجوزات اليوم</div>
            <div className="text-2xl font-bold">17</div>
          </div>
          <div className="p-3">
            <div className="text-sm text-gray-400">الإيرادات (24 ساعة)</div>
            <div className="text-2xl font-bold text-[#39FF14]">$3,750</div>
          </div>
        </div>
      </div>

      {/* Admin Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <div 
            key={i} 
            className={`rounded-2xl p-6 shadow-[0_10px_20px_rgba(0,0,0,0.3)] bg-gradient-to-br ${card.color} hover:scale-[1.03] transition-all cursor-pointer border border-white/10`}
          >
            <div className="flex items-center gap-4">
              <div className="bg-black/20 p-3 rounded-full">{card.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-black">{card.label}</h3>
                <p className="text-sm text-black/80">{card.desc}</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-black/10 flex justify-end">
              <button className="text-sm bg-black/20 hover:bg-black/30 text-white px-4 py-2 rounded-lg transition-colors">
                فتح
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="mt-12 bg-gray-900 p-6 rounded-xl border border-[#39FF14]/10">
        <h3 className="text-xl font-bold text-[#39FF14] mb-4">آخر النشاطات</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="bg-[#39FF14]/20 p-2 rounded-full">
              <FaUsers className="text-[#39FF14]" />
            </div>
            <div>
              <div className="font-medium">تم تسجيل مستخدم جديد</div>
              <div className="text-sm text-gray-400">منذ 5 دقائق</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="bg-[#39FF14]/20 p-2 rounded-full">
              <FaHome className="text-[#39FF14]" />
            </div>
            <div>
              <div className="font-medium">تمت إضافة عقار جديد</div>
              <div className="text-sm text-gray-400">منذ 20 دقيقة</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="bg-[#39FF14]/20 p-2 rounded-full">
              <FaBell className="text-[#39FF14]" />
            </div>
            <div>
              <div className="font-medium">تم إرسال إشعار للمستخدمين</div>
              <div className="text-sm text-gray-400">منذ ساعة</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}