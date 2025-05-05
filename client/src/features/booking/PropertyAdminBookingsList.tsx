import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  updateDoc, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Booking {
  id: string;
  propertyId: string;
  propertyName?: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  checkInDate: any;
  checkOutDate: any;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

export default function PropertyAdminBookingsList() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    // Only fetch bookings if user is logged in
    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Fetch bookings for properties managed by this admin
  const fetchBookings = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    setError('');
    
    try {
      // First, fetch properties managed by this admin
      const propertiesQuery = query(
        collection(db, 'properties'),
        where('adminId', '==', user.uid)
      );
      
      const propertiesSnapshot = await getDocs(propertiesQuery);
      const propertyIds = propertiesSnapshot.docs.map(doc => doc.id);
      
      if (propertyIds.length === 0) {
        setBookings([]);
        setLoading(false);
        return;
      }
      
      // Fetch bookings for these properties
      const bookingsList: Booking[] = [];
      
      for (const propertyId of propertyIds) {
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('propertyId', '==', propertyId),
          orderBy('createdAt', 'desc')
        );
        
        const bookingsSnapshot = await getDocs(bookingsQuery);
        
        // Get property details
        const propertyDoc = await getDoc(doc(db, 'properties', propertyId));
        const propertyName = propertyDoc.exists() ? propertyDoc.data().name : 'عقار غير معروف';
        
        // Process each booking
        for (const bookingDoc of bookingsSnapshot.docs) {
          const bookingData = bookingDoc.data();
          
          // Get customer details
          let customerName = 'عميل غير معروف';
          let customerEmail = '';
          
          try {
            const customerDoc = await getDoc(doc(db, 'users', bookingData.customerId));
            if (customerDoc.exists()) {
              const customerData = customerDoc.data();
              customerName = customerData.name || customerName;
              customerEmail = customerData.email || '';
            }
          } catch (err) {
            console.error("Error fetching customer:", err);
          }
          
          // Add booking to list
          bookingsList.push({
            id: bookingDoc.id,
            propertyId,
            propertyName,
            customerId: bookingData.customerId,
            customerName,
            customerEmail,
            checkInDate: bookingData.checkInDate,
            checkOutDate: bookingData.checkOutDate,
            status: bookingData.status,
            createdAt: bookingData.createdAt,
          });
        }
      }
      
      setBookings(bookingsList);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError('حدث خطأ أثناء تحميل الحجوزات. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const handleUpdateStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    const confirmMessage = newStatus === 'confirmed' 
      ? 'هل تريد تأكيد هذا الحجز؟' 
      : 'هل أنت متأكد من إلغاء هذا الحجز؟';
      
    if (!window.confirm(confirmMessage)) return;
    
    try {
      // Update booking status
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: newStatus
      });
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus } 
          : booking
      ));
    } catch (err) {
      console.error(`Error ${newStatus === 'confirmed' ? 'confirming' : 'cancelling'} booking:`, err);
      alert(`حدث خطأ أثناء ${newStatus === 'confirmed' ? 'تأكيد' : 'إلغاء'} الحجز. الرجاء المحاولة مرة أخرى.`);
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

  // Filter bookings based on selected filter
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === filter);

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 rounded-lg bg-gray-900 animate-pulse">
        <div className="h-6 bg-gray-800 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-gray-800 rounded"></div>
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
        <p className="text-gray-400 mb-4">لا توجد حجوزات لعقاراتك حالياً.</p>
      </div>
    );
  }

  // Show bookings list
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-green-400">📅 إدارة الحجوزات</h3>
        
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Filter buttons */}
          <div className="flex p-1 bg-gray-800 rounded-lg text-sm">
            <button 
              className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-green-400 text-black' : 'text-gray-400'}`}
              onClick={() => setFilter('all')}
            >
              الكل
            </button>
            <button 
              className={`px-3 py-1 rounded ${filter === 'pending' ? 'bg-yellow-400 text-black' : 'text-gray-400'}`}
              onClick={() => setFilter('pending')}
            >
              قيد الانتظار
            </button>
            <button 
              className={`px-3 py-1 rounded ${filter === 'confirmed' ? 'bg-green-400 text-black' : 'text-gray-400'}`}
              onClick={() => setFilter('confirmed')}
            >
              مؤكد
            </button>
            <button 
              className={`px-3 py-1 rounded ${filter === 'cancelled' ? 'bg-red-400 text-black' : 'text-gray-400'}`}
              onClick={() => setFilter('cancelled')}
            >
              ملغي
            </button>
          </div>
          
          <button 
            onClick={fetchBookings} 
            className="text-sm text-gray-400 hover:text-white"
          >
            تحديث
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-800">
        {filteredBookings.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-400">لا توجد حجوزات تطابق التصفية المحددة.</p>
          </div>
        ) : (
          filteredBookings.map(booking => {
            // Define status styles
            let statusBadge;
            switch (booking.status) {
              case 'confirmed':
                statusBadge = <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">مؤكد</span>;
                break;
              case 'cancelled':
                statusBadge = <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs">ملغي</span>;
                break;
              default:
                statusBadge = <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-xs">قيد الانتظار</span>;
            }
            
            return (
              <div key={booking.id} className="p-4 hover:bg-gray-800/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{booking.propertyName}</h4>
                      {statusBadge}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      العميل: {booking.customerName} 
                      {booking.customerEmail && <span className="mx-1">({booking.customerEmail})</span>}
                    </p>
                    <p className="text-sm text-gray-400">
                      التاريخ: من {formatDate(booking.checkInDate)} إلى {formatDate(booking.checkOutDate)}
                    </p>
                  </div>
                </div>
                
                {booking.status === 'pending' && (
                  <div className="flex mt-3 space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                      className="px-3 py-1 bg-green-400 text-black text-sm rounded hover:bg-green-500 transition-colors"
                    >
                      تأكيد الحجز
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                      className="px-3 py-1 bg-red-400 text-black text-sm rounded hover:bg-red-500 transition-colors"
                    >
                      رفض الحجز
                    </button>
                  </div>
                )}
                
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                    className="mt-3 px-3 py-1 border border-red-500 text-red-500 text-sm rounded hover:bg-red-500/10 transition-colors"
                  >
                    إلغاء الحجز
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}