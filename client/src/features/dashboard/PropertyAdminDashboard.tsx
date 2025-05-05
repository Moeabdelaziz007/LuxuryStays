import React from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";

export default function PropertyAdminDashboard() {
  const { user } = useAuth();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["owner-properties", user?.uid],
    queryFn: async () => {
      const q = query(collection(db, "properties"), where("ownerId", "==", user?.uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!user
  });

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-4xl font-bold text-[#39FF14] mb-6 relative inline-block">
        لوحة مشرف العقار
        <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-[#39FF14]/40"></div>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 p-4 rounded-xl border border-[#39FF14]/10">
          <div className="text-lg text-gray-400">إجمالي العقارات</div>
          <div className="text-2xl font-bold text-white mt-1">
            {isLoading ? "..." : properties?.length || 0}
          </div>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-[#39FF14]/10">
          <div className="text-lg text-gray-400">الحجوزات الحالية</div>
          <div className="text-2xl font-bold text-white mt-1">0</div>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl border border-[#39FF14]/10">
          <div className="text-lg text-gray-400">الإيرادات الشهرية</div>
          <div className="text-2xl font-bold text-white mt-1">$0</div>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl shadow-lg mb-8 border border-[#39FF14]/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#39FF14]">🏠 إدارة العقارات</h3>
          <button className="text-sm bg-[#39FF14] text-black px-3 py-1 rounded-lg hover:bg-[#50FF30] transition-colors">
            إضافة عقار جديد
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-10 bg-[#39FF14]/20 rounded-full mb-4"></div>
              <div className="h-2 bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        ) : !properties || properties.length === 0 ? (
          <div className="bg-gray-800/50 p-8 rounded-lg text-center">
            <div className="inline-block mb-3 p-3 bg-gray-800 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#39FF14]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <p className="text-gray-400 mb-4">لا توجد عقارات حالياً. يمكنك البدء بإضافة واحدة جديدة.</p>
            <button className="inline-block bg-[#39FF14] text-black font-medium py-2 px-4 rounded-lg hover:bg-[#50FF30] transition-colors">
              إضافة عقار
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((p: any) => (
              <div key={p.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-[#39FF14]/20 transition-colors group">
                {p.imageUrl && (
                  <div className="w-full h-40 rounded-lg overflow-hidden mb-3">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                )}
                <div className="text-xl font-bold text-[#39FF14] mb-1">{p.name}</div>
                <div className="text-sm text-gray-300">💰 {p.pricePerNight}$/ليلة</div>
                <div className="text-sm text-gray-400">📍 {p.location}</div>
                
                <div className="mt-3 pt-3 border-t border-gray-700 flex justify-end gap-2">
                  <button className="text-sm text-[#39FF14]/80 hover:text-[#39FF14] transition-colors">
                    تعديل
                  </button>
                  <button className="text-sm text-gray-400 hover:text-white transition-colors">
                    عرض الحجوزات
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-6 rounded-xl shadow-lg border border-[#39FF14]/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#39FF14]">📅 حجوزات العقارات</h3>
          <div className="text-sm text-gray-400">القادمة (7 أيام)</div>
        </div>
        
        <div className="bg-gray-800/50 p-6 rounded-lg text-center">
          <div className="inline-block mb-3 p-3 bg-gray-800 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#39FF14]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-400">لا توجد حجوزات قادمة في الأيام السبعة القادمة</p>
        </div>
      </div>
    </div>
  );
}