import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  query, 
  where, 
  getDocs, 
  serverTimestamp, 
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BookingStatus } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

export interface BookingRequest {
  propertyId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  propertyAdminId: string;
  checkInDate: Date | string;
  checkOutDate: Date | string;
  guestCount: number;
  price: number; // سعر الليلة الواحدة
  specialRequests?: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  propertyAdminId: string;
  checkInDate: Timestamp | string;
  checkOutDate: Timestamp | string;
  guestCount: number;
  price: number; // سعر الليلة الواحدة
  totalPrice: number; // السعر الإجمالي
  platformFee: number; // عمولة المنصة (10%)
  ownerAmount: number; // المبلغ الذي يحصل عليه المالك (90%)
  status: BookingStatus;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
  paymentConfirmedAt?: Timestamp | string;
  specialRequests?: string;
  stripePaymentIntentId?: string;
}

export class BookingService {
  /**
   * إنشاء حجز جديد
   */
  static async createBooking(bookingData: BookingRequest): Promise<{ bookingId: string }> {
    try {
      // الحصول على معلومات العقار
      const propertyRef = doc(db, 'properties', bookingData.propertyId);
      const propertySnap = await getDoc(propertyRef);
      
      if (!propertySnap.exists()) {
        throw new Error('العقار غير موجود');
      }
      
      const propertyData = propertySnap.data();
      
      // حساب الفرق بين تواريخ الوصول والمغادرة بالأيام
      const checkInDate = new Date(bookingData.checkInDate);
      const checkOutDate = new Date(bookingData.checkOutDate);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // حساب السعر الإجمالي
      const baseAmount = bookingData.price * nights;
      const serviceCharge = Math.round(baseAmount * 0.1); // 10% رسوم خدمة
      const cleaningFee = Math.round(bookingData.price * 0.05); // 5% رسوم تنظيف
      const totalPrice = baseAmount + serviceCharge + cleaningFee;
      
      // حساب عمولة المنصة والمبلغ الذي يحصل عليه المالك
      const platformFee = Math.round(totalPrice * 0.1); // 10% عمولة المنصة
      const ownerAmount = totalPrice - platformFee; // 90% للمالك
      
      // إنشاء بيانات الحجز
      const newBooking = {
        ...bookingData,
        propertyName: propertyData.name || 'عقار بدون اسم',
        propertyImage: propertyData.mainImage || null,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        totalPrice,
        platformFee,
        ownerAmount,
        status: BookingStatus.PENDING,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // إضافة الحجز إلى قاعدة البيانات
      const bookingRef = await addDoc(collection(db, 'bookings'), newBooking);
      
      // إرسال الاستجابة
      return { bookingId: bookingRef.id };
      
    } catch (error) {
      console.error('خطأ في إنشاء الحجز:', error);
      throw error;
    }
  }
  
  /**
   * الحصول على معلومات حجز محدد
   */
  static async getBooking(bookingId: string): Promise<Booking | null> {
    try {
      // الحصول على مرجع الحجز
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingSnap = await getDoc(bookingRef);
      
      // التحقق من وجود الحجز
      if (!bookingSnap.exists()) {
        return null;
      }
      
      // إرجاع بيانات الحجز مع إضافة المعرف
      return {
        id: bookingId,
        ...bookingSnap.data()
      } as Booking;
      
    } catch (error) {
      console.error('خطأ في الحصول على معلومات الحجز:', error);
      throw error;
    }
  }
  
  /**
   * الحصول على قائمة حجوزات المستخدم
   */
  static async getUserBookings(userId: string, role: string): Promise<Booking[]> {
    try {
      // تحديد المجموعة المرجعية بناءً على دور المستخدم
      let bookingsQuery;
      
      if (role === 'CUSTOMER') {
        // إذا كان المستخدم عميلًا، نبحث عن الحجوزات التي قام بها
        bookingsQuery = query(
          collection(db, 'bookings'),
          where('customerId', '==', userId)
        );
      } else if (role === 'PROPERTY_ADMIN') {
        // إذا كان المستخدم مديرًا للعقار، نبحث عن الحجوزات المرتبطة بعقاراته
        bookingsQuery = query(
          collection(db, 'bookings'),
          where('propertyAdminId', '==', userId)
        );
      } else if (role === 'SUPER_ADMIN') {
        // إذا كان المستخدم مشرفًا عامًا، نحضر جميع الحجوزات
        bookingsQuery = collection(db, 'bookings');
      } else {
        // إذا كان الدور غير معروف، نعيد قائمة فارغة
        return [];
      }
      
      // تنفيذ الاستعلام
      const bookingsSnap = await getDocs(bookingsQuery);
      
      // تحويل النتائج إلى مصفوفة من الحجوزات
      const bookings: Booking[] = [];
      
      bookingsSnap.forEach((doc) => {
        bookings.push({
          id: doc.id,
          ...doc.data()
        } as Booking);
      });
      
      return bookings;
      
    } catch (error) {
      console.error('خطأ في الحصول على قائمة الحجوزات:', error);
      throw error;
    }
  }
  
  /**
   * تحديث حالة الحجز
   */
  static async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<void> {
    try {
      // الحصول على مرجع الحجز
      const bookingRef = doc(db, 'bookings', bookingId);
      
      // تحديث حالة الحجز
      await updateDoc(bookingRef, {
        status,
        updatedAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error('خطأ في تحديث حالة الحجز:', error);
      throw error;
    }
  }
  
  /**
   * إلغاء حجز
   */
  static async cancelBooking(bookingId: string, reason?: string): Promise<void> {
    try {
      // الحصول على مرجع الحجز
      const bookingRef = doc(db, 'bookings', bookingId);
      
      // تحديث حالة الحجز إلى "ملغى"
      await updateDoc(bookingRef, {
        status: BookingStatus.CANCELLED,
        cancellationReason: reason || 'تم الإلغاء بواسطة المستخدم',
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
    } catch (error) {
      console.error('خطأ في إلغاء الحجز:', error);
      throw error;
    }
  }
  
  /**
   * إنشاء قصد دفع (Payment Intent) لحجز معين
   */
  static async createPaymentIntent(bookingId: string): Promise<{ clientSecret: string }> {
    try {
      // الحصول على معلومات الحجز
      const booking = await this.getBooking(bookingId);
      
      if (!booking) {
        throw new Error('الحجز غير موجود');
      }
      
      // إرسال طلب إلى الخادم لإنشاء قصد الدفع
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        amount: booking.totalPrice,
        bookingId: booking.id,
        metadata: {
          propertyId: booking.propertyId,
          propertyAdminId: booking.propertyAdminId,
          customerId: booking.customerId,
          customerEmail: booking.customerEmail
        }
      });
      
      // تحليل الاستجابة
      const data = await response.json();
      
      // التحقق من وجود سر العميل
      if (!data.clientSecret) {
        throw new Error('فشل في إنشاء قصد الدفع');
      }
      
      return { clientSecret: data.clientSecret };
      
    } catch (error) {
      console.error('خطأ في إنشاء قصد الدفع:', error);
      throw error;
    }
  }
  
  /**
   * تأكيد الحجز بعد الدفع
   */
  static async confirmBookingAfterPayment(bookingId: string): Promise<void> {
    try {
      // إرسال طلب إلى الخادم لتأكيد الحجز
      await apiRequest('POST', '/api/confirm-booking', { bookingId });
      
    } catch (error) {
      console.error('خطأ في تأكيد الحجز بعد الدفع:', error);
      throw error;
    }
  }
}