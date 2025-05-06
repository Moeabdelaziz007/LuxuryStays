import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface BookingDetails {
  id: string;
  propertyId: string;
  propertyName?: string;
  checkInDate: any;
  checkOutDate: any;
  status: string;
  createdAt: any;
}

interface BookingConfirmationProps {
  bookingId: string;
}

export default function BookingConfirmation({ bookingId }: BookingConfirmationProps) {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    if (!bookingId) return;
    
    try {
      // Fetch booking details
      const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
      
      if (!bookingDoc.exists()) {
        setError('لم يتم العثور على الحجز المطلوب.');
        setLoading(false);
        return;
      }
      
      const bookingData = bookingDoc.data();
      
      // Fetch property details
      let propertyName = 'العقار غير متوفر';
      try {
        const propertyDoc = await getDoc(doc(db, 'properties', bookingData.propertyId));
        if (propertyDoc.exists()) {
          propertyName = propertyDoc.data().name;
        }
      } catch (err) {
        console.error("Error fetching property:", err);
      }
      
      // Set booking details
      setBooking({
        id: bookingDoc.id,
        propertyId: bookingData.propertyId,
        propertyName,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        status: bookingData.status,
        createdAt: bookingData.createdAt,
      });
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError('حدث خطأ أثناء تحميل تفاصيل الحجز. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (date: any) => {
    if (!date) return 'غير محدد';
    
    // Handle Firestore timestamp
    if (date.toDate) {
      return format(date.toDate(), 'dd/MM/yyyy', { locale: ar });
    }
    
    // Handle string date
    if (typeof date === 'string') {
      return format(new Date(date), 'dd/MM/yyyy', { locale: ar });
    }
    
    return 'غير محدد';
  };

  // Get status text and color
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { text: 'مؤكد', className: 'bg-green-500/10 text-green-500' };
      case 'cancelled':
        return { text: 'ملغي', className: 'bg-red-500/10 text-red-500' };
      default:
        return { text: 'قيد الانتظار', className: 'bg-yellow-500/10 text-yellow-500' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل تفاصيل الحجز...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-gray-900 rounded-lg shadow-lg border border-red-500/20">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">خطأ</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <Link to="/" className="inline-block bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500 transition-colors">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-gray-900 rounded-lg shadow-lg border border-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">لم يتم العثور على الحجز</h2>
            <p className="text-gray-400 mb-4">لم نتمكن من العثور على تفاصيل الحجز المطلوب.</p>
            <Link to="/" className="inline-block bg-green-400 text-black px-4 py-2 rounded-lg hover:bg-green-500 transition-colors">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Determine status styling
  const { text: statusText, className: statusClassName } = getStatusLabel(booking.status);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto bg-gray-900 rounded-lg shadow-lg border border-gray-800 overflow-hidden">
        <div className="bg-green-400/10 p-6 border-b border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-green-400 mb-1">تأكيد الحجز</h1>
              <p className="text-gray-400">تم استلام طلب الحجز بنجاح!</p>
            </div>
            <div className={`px-3 py-1 rounded ${statusClassName}`}>
              {statusText}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">تفاصيل الحجز</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">رقم الحجز:</span>
                <span className="font-mono">{booking.id.substring(0, 8)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">اسم العقار:</span>
                <span>{booking.propertyName}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">تاريخ الوصول:</span>
                <span>{formatDate(booking.checkInDate)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">تاريخ المغادرة:</span>
                <span>{formatDate(booking.checkOutDate)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
            <p className="text-sm text-center">
              {booking.status === 'pending' ? (
                <>
                  <span className="block font-semibold text-yellow-400 mb-1">قيد المراجعة</span>
                  <span className="text-gray-400">سيتم مراجعة طلب الحجز والرد عليه في أقرب وقت ممكن.</span>
                </>
              ) : booking.status === 'confirmed' ? (
                <>
                  <span className="block font-semibold text-green-400 mb-1">تم تأكيد الحجز</span>
                  <span className="text-gray-400">تم تأكيد الحجز بنجاح! نتطلع لاستقبالك.</span>
                </>
              ) : (
                <>
                  <span className="block font-semibold text-red-400 mb-1">تم إلغاء الحجز</span>
                  <span className="text-gray-400">للأسف، تم إلغاء هذا الحجز.</span>
                </>
              )}
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Link to="/customer" className="w-full bg-green-400 text-black text-center py-2 rounded-lg hover:bg-green-500 transition-colors">
              عرض حجوزاتي
            </Link>
            <Link to="/" className="w-full bg-transparent border border-gray-700 text-gray-400 text-center py-2 rounded-lg hover:bg-gray-800 transition-colors">
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}