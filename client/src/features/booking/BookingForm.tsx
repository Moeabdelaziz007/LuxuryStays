import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function BookingForm({ propertyId }: { propertyId: string }) {
  const { user } = useAuth();
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [message, setMessage] = useState("");

  const handleBooking = async () => {
    try {
      if (!checkInDate || !checkOutDate) {
        setMessage("❌ الرجاء اختيار تاريخ الدخول والخروج");
        return;
      }

      await addDoc(collection(db, "bookings"), {
        propertyId,
        customerId: user?.uid,
        status: "pending",
        checkInDate,
        checkOutDate,
        createdAt: serverTimestamp(),
      });

      setMessage("✅ تم إرسال طلب الحجز بنجاح! سنقوم بمراجعته قريبًا.");
      setCheckInDate("");
      setCheckOutDate("");
    } catch (err) {
      console.error(err);
      setMessage("❌ حدث خطأ أثناء إرسال الحجز.");
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg max-w-md">
        <h3 className="text-xl font-bold mb-4 text-green-400">📅 حجز هذا العقار</h3>
        <p className="mb-4">يجب تسجيل الدخول أولاً للتمكن من حجز هذا العقار</p>
        <a href="/login" className="bg-green-400 text-black font-bold py-2 px-4 rounded hover:scale-105 inline-block">
          تسجيل الدخول
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg max-w-md">
      <h3 className="text-xl font-bold mb-4 text-green-400">📅 حجز هذا العقار</h3>

      <label className="block mb-2">تاريخ الوصول</label>
      <input 
        type="date" 
        value={checkInDate} 
        onChange={(e) => setCheckInDate(e.target.value)} 
        className="w-full mb-4 p-2 rounded bg-gray-800" 
      />

      <label className="block mb-2">تاريخ المغادرة</label>
      <input 
        type="date" 
        value={checkOutDate} 
        onChange={(e) => setCheckOutDate(e.target.value)} 
        className="w-full mb-4 p-2 rounded bg-gray-800" 
      />

      <button 
        onClick={handleBooking} 
        className="bg-green-400 text-black font-bold py-2 px-4 rounded hover:scale-105"
      >
        احجز الآن
      </button>

      {message && (
        <p className="mt-4 text-sm text-center">{message}</p>
      )}
    </div>
  );
}