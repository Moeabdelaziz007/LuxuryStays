import React from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";

export default function CustomerDashboard() {
  const { user } = useAuth();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["customer-bookings", user?.uid],
    queryFn: async () => {
      const q = query(collection(db, "bookings"), where("userId", "==", user?.uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!user
  });

  return (
    <div className="bg-black text-white min-h-screen p-6">
      {/* Header with Neon Effect */}
      <h1 className="text-4xl font-bold text-[#39FF14] mb-6 relative inline-block">
        لوحة تحكم العميل
        <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-[#39FF14]/40"></div>
      </h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 p-4 rounded-xl border border-[#39FF14]/10 hover:border-[#39FF14]/30 transition-colors">
          <div className="text-lg text-gray-400">الحجوزات النشطة</div>
          <div className="text-2xl font-bold text-white mt-1">
            {isLoading ? "..." : (bookings ? bookings.filter((b: any) => b.status === "pending" || b.status === "confirmed").length : 0)}
          </div>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-[#39FF14]/10">
          <div className="text-lg text-gray-400">الليالي المحجوزة</div>
          <div className="text-2xl font-bold text-white mt-1">0</div>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-[#39FF14]/10">
          <div className="text-lg text-gray-400">نقاط المكافآت</div>
          <div className="text-2xl font-bold text-white mt-1">0</div>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-[#39FF14]/10">
          <div className="text-lg text-gray-400">التقييمات</div>
          <div className="text-2xl font-bold text-white mt-1">0</div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg mb-8 border border-[#39FF14]/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#39FF14]">📅 حجوزاتي</h3>
          <button className="text-sm text-[#39FF14] hover:text-[#50FF30] transition-colors">
            تصفية النتائج
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-10 bg-[#39FF14]/20 rounded-full mb-4"></div>
              <div className="h-2 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div className="bg-gray-800/50 p-8 rounded-lg text-center">
            <div className="inline-block mb-3 p-3 bg-gray-800 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#39FF14]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400 mb-4">لا يوجد حجوزات نشطة حالياً</p>
            <a href="/properties" className="inline-block bg-[#39FF14] text-black font-medium py-2 px-4 rounded-lg hover:bg-[#50FF30] transition-colors">
              تصفح العقارات
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b: any) => (
              <div key={b.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-[#39FF14]/20 transition-colors">
                <div className="flex justify-between">
                  <div className="mb-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      b.status === "confirmed" ? "bg-[#39FF14]/20 text-[#39FF14]" : 
                      b.status === "pending" ? "bg-yellow-400/20 text-yellow-400" :
                      "bg-red-400/20 text-red-400"
                    }`}>
                      {b.status === "confirmed" ? "مؤكد" : 
                       b.status === "pending" ? "قيد الانتظار" : "ملغي"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">{b.id.substring(0, 8)}...</div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-3 mt-2">
                  <div>
                    <div className="text-xs text-gray-500">العقار</div>
                    <div>📌 {b.propertyId}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">التاريخ</div>
                    <div>🗓️ {b.date}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">الضيوف</div>
                    <div>👥 {b.guests}</div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-700 flex justify-end">
                  <button className="text-sm text-[#39FF14]/80 hover:text-[#39FF14] transition-colors mr-3">
                    التفاصيل
                  </button>
                  <button className="text-sm text-gray-400 hover:text-white transition-colors">
                    إلغاء
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-[#39FF14]/10">
          <h3 className="text-xl font-semibold mb-3 text-[#39FF14]">⭐ تقييماتي</h3>
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-400">لم تقم بإضافة أي تقييمات بعد</p>
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-[#39FF14]/10">
          <h3 className="text-xl font-semibold mb-3 text-[#39FF14]">🎁 نقاط المكافآت</h3>
          <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">النقاط الحالية</span>
              <span className="text-xl font-bold text-white">0</span>
            </div>
          </div>
          <div className="text-sm text-center text-[#39FF14]/70">
            احجز المزيد من العقارات للحصول على نقاط مكافآت!
          </div>
        </div>
      </div>
    </div>
  );
}