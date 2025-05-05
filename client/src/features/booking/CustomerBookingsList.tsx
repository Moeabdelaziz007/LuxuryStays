import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Booking {
  id: string;
  propertyId: string;
  propertyName?: string;
  checkInDate: any;
  checkOutDate: any;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

export default function CustomerBookingsList() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch bookings if user is logged in
    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Fetch the user's bookings
  const fetchBookings = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch bookings from Firestore
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('customerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(bookingsQuery);
      const bookingsList: Booking[] = [];
      
      // Process each booking
      for (const bookingDoc of querySnapshot.docs) {
        const bookingData = bookingDoc.data();
        
        // Fetch property details for each booking if needed
        let propertyName = "العقار غير متوفر";
        try {
          const propertyDoc = await getDocs(
            query(collection(db, 'properties'), where('id', '==', bookingData.propertyId))
          );
          if (!propertyDoc.empty) {
            propertyName = propertyDoc.docs[0].data().name;
          }
        } catch (err) {
          console.error("Error fetching property:", err);
        }
        
        // Add booking to list
        bookingsList.push({
          id: bookingDoc.id,
          propertyId: bookingData.propertyId,
          propertyName,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          status: bookingData.status,
          createdAt: bookingData.createdAt,
        });
      }
      
      setBookings(bookingsList);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError('حدث خطأ أثناء تحميل الحجوزات. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) return;
    
    try {
      // Update booking status to cancelled
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'cancelled'
      });
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as const } 
          : booking
      ));
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert('حدث خطأ أثناء إلغاء الحجز. الرجاء المحاولة مرة أخرى.');
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
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { text: 'مؤكد', color: 'text-green-500', bgColor: 'bg-green-500/10' };
      case 'cancelled':
        return { text: 'ملغي', color: 'text-red-500', bgColor: 'bg-red-500/10' };
      case 'pending':
      default:
        return { text: 'قيد الانتظار', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' };
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 rounded-lg bg-gray-900 animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-800 rounded"></div>
          <div className="h-12 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
        <p>{error}</p>
        <button 
          onClick={fetchBookings}
          className="mt-2 text-sm underline"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // Show empty state
  if (bookings.length === 0) {
    return (
      <div className="p-6 text-center rounded-lg bg-gray-900 border border-gray-800">
        <svg 
          className="w-12 h-12 mx-auto mb-4 text-gray-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        <h3 className="mb-2 text-xl font-bold text-white">لا توجد حجوزات</h3>
        <p className="text-gray-400 mb-4">لم تقم بأي حجوزات بعد.</p>
        <a 
          href="/"
          className="inline-flex items-center px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors"
        >
          تصفح العقارات
        </a>
      </div>
    );
  }

  // Show bookings list
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-green-400">📅 الحجوزات</h3>
        <button 
          onClick={fetchBookings} 
          className="text-sm text-gray-400 hover:text-white"
        >
          تحديث
        </button>
      </div>
      
      <div className="divide-y divide-gray-800">
        {bookings.map(booking => {
          const { text: statusText, color: statusColor, bgColor: statusBgColor } = getStatusDetails(booking.status);
          
          return (
            <div key={booking.id} className="p-4 hover:bg-gray-800/50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{booking.propertyName}</h4>
                  <span className="text-sm text-gray-400">
                    من {formatDate(booking.checkInDate)} إلى {formatDate(booking.checkOutDate)}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${statusColor} ${statusBgColor}`}>
                  {statusText}
                </span>
              </div>
              
              {booking.status === 'pending' && (
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="text-sm text-red-400 hover:text-red-300 mt-2"
                >
                  إلغاء الحجز
                </button>
              )}
              
              {booking.status === 'confirmed' && (
                <div className="flex mt-2 space-x-2 rtl:space-x-reverse">
                  <a 
                    href={`/booking/${booking.id}`}
                    className="text-sm text-green-400 hover:text-green-300"
                  >
                    عرض التفاصيل
                  </a>
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="text-sm text-red-400 hover:text-red-300 mr-2"
                  >
                    إلغاء الحجز
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}