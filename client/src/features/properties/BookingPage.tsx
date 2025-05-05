import React, { useState } from "react";
import { useLocation } from "wouter";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";

export default function BookingPage() {
  // Parse propertyId from query string
  const [location] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const propertyId = params.get('propertyId') || "";
  
  const { user } = useAuth();

  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await addDoc(collection(db, "bookings"), {
      propertyId,
      userId: user.uid,
      date,
      guests,
      notes,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    setSuccess(true);
  };

  return (
    <div className="bg-black text-white min-h-screen py-12 px-6">
      <div className="max-w-lg mx-auto bg-gray-900 p-8 rounded-2xl shadow-lg border border-[#39FF14]/10">
        <h2 className="text-3xl font-bold text-[#39FF14] mb-6">تأكيد الحجز</h2>
        {success ? (
          <div className="text-center py-8">
            <div className="inline-block mb-4 bg-[#39FF14]/10 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#39FF14]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-[#39FF14] text-xl font-bold mb-2">تم إرسال طلب الحجز بنجاح!</div>
            <p className="text-gray-400 mb-6">سيتم التواصل معك خلال 24 ساعة لتأكيد الحجز</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              العودة للرئيسية
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-800/50 p-4 rounded-lg border border-[#39FF14]/10 mb-6">
              <p className="text-sm text-[#39FF14] mb-1">معلومات الحجز</p>
              <p className="text-sm text-gray-400">🔐 خاص بالعقار رقم: {propertyId}</p>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-300">🗓️ التاريخ:</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14] transition-colors" 
                required 
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-300">👥 عدد الضيوف:</label>
              <input 
                type="number" 
                min="1" 
                value={guests} 
                onChange={(e) => setGuests(Number(e.target.value))} 
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14] transition-colors" 
                required 
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 text-gray-300">📌 ملاحظات إضافية:</label>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14] transition-colors min-h-[100px]"
              ></textarea>
            </div>
            
            <div className="text-xs text-gray-500 mb-6">
              * بالضغط على زر تأكيد الحجز، أنت توافق على شروط وأحكام استخدام الخدمة.
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-[#39FF14] text-black font-bold py-3 px-6 rounded-xl text-lg hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)]"
            >
              تأكيد الحجز ✅
            </button>
          </form>
        )}
      </div>
    </div>
  );
}