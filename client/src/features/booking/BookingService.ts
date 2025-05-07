import { db } from '@/lib/firebase';
import { 
  doc, 
  collection, 
  addDoc, 
  updateDoc, 
  getDoc, 
  serverTimestamp, 
  Timestamp, 
  runTransaction 
} from 'firebase/firestore';
import { BookingStatus } from '@shared/schema';

// التوزيع المالي للحجز
// 10% عمولة للمنصة، 90% للمالك
const PLATFORM_FEE_PERCENTAGE = 0.1; // 10%
const OWNER_PERCENTAGE = 0.9; // 90%

// أنواع طرق الدفع المدعومة
export enum PaymentMethod {
  STRIPE = 'stripe',
  VODAFONE_CASH = 'vodafone_cash',
  CASH_ON_ARRIVAL = 'cash_on_arrival'
}

// واجهة بيانات الدفع الأساسية
export interface PaymentData {
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentMethodDetails?: any;
}

// واجهة بيانات المعاملة المالية
export interface Transaction {
  id?: string;
  bookingId: string;
  propertyId: string;
  propertyName: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  platformFee: number; // عمولة المنصة (10%)
  ownerAmount: number; // مبلغ المالك (90%)
  paymentMethod: PaymentMethod;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethodDetails?: any;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// فئة خدمة الحجوزات والمعاملات المالية
export class BookingService {
  /**
   * معالجة الدفع لحجز معين
   * @param paymentData بيانات الدفع
   * @returns معرف المعاملة الجديدة
   */
  static async processPayment(paymentData: PaymentData): Promise<string> {
    try {
      // الحصول على بيانات الحجز
      const bookingRef = doc(db, 'bookings', paymentData.bookingId);
      const bookingSnapshot = await getDoc(bookingRef);
      
      if (!bookingSnapshot.exists()) {
        throw new Error('الحجز غير موجود');
      }
      
      const bookingData = bookingSnapshot.data();
      const propertyId = bookingData.propertyId;
      
      // الحصول على بيانات العقار
      const propertyRef = doc(db, 'properties', propertyId);
      const propertySnapshot = await getDoc(propertyRef);
      
      if (!propertySnapshot.exists()) {
        throw new Error('العقار غير موجود');
      }
      
      const propertyData = propertySnapshot.data();
      const ownerId = propertyData.ownerId;
      
      // حساب توزيع المبالغ
      const platformFee = paymentData.amount * PLATFORM_FEE_PERCENTAGE;
      const ownerAmount = paymentData.amount * OWNER_PERCENTAGE;
      
      // إنشاء معاملة مالية جديدة
      const transactionData: Transaction = {
        bookingId: paymentData.bookingId,
        propertyId: propertyId,
        propertyName: propertyData.name,
        userId: bookingData.userId,
        userEmail: bookingData.userEmail,
        userName: bookingData.userName,
        amount: paymentData.amount,
        platformFee: platformFee,
        ownerAmount: ownerAmount,
        paymentMethod: paymentData.paymentMethod,
        paymentMethodDetails: paymentData.paymentMethodDetails,
        status: paymentData.paymentMethod === PaymentMethod.CASH_ON_ARRIVAL ? 'pending' : 'completed',
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp
      };
      
      // إضافة المعاملة إلى قاعدة البيانات
      const transactionRef = await addDoc(collection(db, 'transactions'), transactionData);
      
      // تحديث حالة الحجز
      await updateDoc(bookingRef, {
        status: paymentData.paymentMethod === PaymentMethod.CASH_ON_ARRIVAL ? 
          BookingStatus.PENDING : BookingStatus.CONFIRMED,
        paymentId: transactionRef.id,
        paymentMethod: paymentData.paymentMethod,
        paymentStatus: paymentData.paymentMethod === PaymentMethod.CASH_ON_ARRIVAL ? 'pending' : 'completed',
        updatedAt: serverTimestamp()
      });
      
      // تحديث الإحصائيات المالية للمالك
      await this.updateOwnerFinancials(ownerId, ownerAmount, platformFee);
      
      return transactionRef.id;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }
  
  /**
   * تحديث الإحصائيات المالية للمالك
   * @param ownerId معرف المالك
   * @param amount المبلغ المضاف
   * @param platformFee عمولة المنصة
   */
  static async updateOwnerFinancials(ownerId: string, amount: number, platformFee: number): Promise<void> {
    try {
      const ownerRef = doc(db, 'users', ownerId);
      
      await runTransaction(db, async (transaction) => {
        const ownerDoc = await transaction.get(ownerRef);
        
        if (!ownerDoc.exists()) {
          throw new Error('المالك غير موجود');
        }
        
        const ownerData = ownerDoc.data();
        
        // إنشاء/تحديث البيانات المالية
        const financials = ownerData.financials || {
          totalEarnings: 0,
          totalPlatformFees: 0,
          availableBalance: 0,
          pendingBalance: 0,
          totalBookings: 0
        };
        
        // تحديث البيانات المالية
        financials.totalEarnings += amount;
        financials.totalPlatformFees += platformFee;
        financials.availableBalance += amount;
        financials.totalBookings += 1;
        
        transaction.update(ownerRef, { 
          financials: financials,
          updatedAt: serverTimestamp()
        });
      });
    } catch (error) {
      console.error('Error updating owner financials:', error);
      throw error;
    }
  }
  
  /**
   * إلغاء معاملة مالية
   * @param transactionId معرف المعاملة
   * @param reason سبب الإلغاء
   */
  static async refundTransaction(transactionId: string, reason: string): Promise<void> {
    try {
      const transactionRef = doc(db, 'transactions', transactionId);
      const transactionSnapshot = await getDoc(transactionRef);
      
      if (!transactionSnapshot.exists()) {
        throw new Error('المعاملة غير موجودة');
      }
      
      const transactionData = transactionSnapshot.data() as Transaction;
      
      // التحقق من أن المعاملة ليست ملغاة بالفعل
      if (transactionData.status === 'refunded') {
        throw new Error('المعاملة ملغاة بالفعل');
      }
      
      const bookingRef = doc(db, 'bookings', transactionData.bookingId);
      
      // تحديث حالة المعاملة
      await updateDoc(transactionRef, {
        status: 'refunded',
        refundReason: reason,
        refundedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // تحديث حالة الحجز
      await updateDoc(bookingRef, {
        status: BookingStatus.CANCELLED,
        cancellationReason: reason,
        cancellationDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // إلغاء المبلغ من الإحصائيات المالية للمالك
      // (فقط إذا كانت المعاملة مكتملة)
      if (transactionData.status === 'completed') {
        await this.revertOwnerFinancials(
          transactionData.propertyId, 
          transactionData.ownerAmount, 
          transactionData.platformFee
        );
      }
    } catch (error) {
      console.error('Error refunding transaction:', error);
      throw error;
    }
  }
  
  /**
   * إلغاء التحديثات المالية للمالك (في حالة الإلغاء)
   * @param propertyId معرف العقار
   * @param amount المبلغ المستردّ
   * @param platformFee عمولة المنصة المستردّة
   */
  static async revertOwnerFinancials(propertyId: string, amount: number, platformFee: number): Promise<void> {
    try {
      const propertyRef = doc(db, 'properties', propertyId);
      const propertySnapshot = await getDoc(propertyRef);
      
      if (!propertySnapshot.exists()) {
        throw new Error('العقار غير موجود');
      }
      
      const propertyData = propertySnapshot.data();
      const ownerId = propertyData.ownerId;
      
      const ownerRef = doc(db, 'users', ownerId);
      
      await runTransaction(db, async (transaction) => {
        const ownerDoc = await transaction.get(ownerRef);
        
        if (!ownerDoc.exists()) {
          throw new Error('المالك غير موجود');
        }
        
        const ownerData = ownerDoc.data();
        const financials = ownerData.financials;
        
        if (!financials) {
          throw new Error('لا توجد بيانات مالية للمالك');
        }
        
        // استرداد المبالغ
        financials.totalEarnings -= amount;
        financials.totalPlatformFees -= platformFee;
        financials.availableBalance -= amount;
        financials.totalBookings -= 1;
        
        // لا تسمح بالقيم السالبة
        financials.totalEarnings = Math.max(0, financials.totalEarnings);
        financials.totalPlatformFees = Math.max(0, financials.totalPlatformFees);
        financials.availableBalance = Math.max(0, financials.availableBalance);
        financials.totalBookings = Math.max(0, financials.totalBookings);
        
        transaction.update(ownerRef, { 
          financials: financials,
          updatedAt: serverTimestamp()
        });
      });
    } catch (error) {
      console.error('Error reverting owner financials:', error);
      throw error;
    }
  }
  
  /**
   * الحصول على معاملة مالية بواسطة المعرف
   * @param transactionId معرف المعاملة
   * @returns بيانات المعاملة
   */
  static async getTransaction(transactionId: string): Promise<Transaction> {
    try {
      const transactionRef = doc(db, 'transactions', transactionId);
      const transactionSnapshot = await getDoc(transactionRef);
      
      if (!transactionSnapshot.exists()) {
        throw new Error('المعاملة غير موجودة');
      }
      
      return { id: transactionId, ...transactionSnapshot.data() } as Transaction;
    } catch (error) {
      console.error('Error getting transaction:', error);
      throw error;
    }
  }
  
  /**
   * تأكيد معاملة معلقة (مثل الدفع كاش عند الوصول)
   * @param transactionId معرف المعاملة
   */
  static async confirmPendingTransaction(transactionId: string): Promise<void> {
    try {
      const transactionRef = doc(db, 'transactions', transactionId);
      const transactionSnapshot = await getDoc(transactionRef);
      
      if (!transactionSnapshot.exists()) {
        throw new Error('المعاملة غير موجودة');
      }
      
      const transactionData = transactionSnapshot.data() as Transaction;
      
      // التحقق من أن المعاملة معلقة
      if (transactionData.status !== 'pending') {
        throw new Error('المعاملة ليست في حالة معلقة');
      }
      
      const bookingRef = doc(db, 'bookings', transactionData.bookingId);
      
      // تحديث حالة المعاملة
      await updateDoc(transactionRef, {
        status: 'completed',
        confirmedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // تحديث حالة الحجز
      await updateDoc(bookingRef, {
        status: BookingStatus.CONFIRMED,
        paymentStatus: 'completed',
        updatedAt: serverTimestamp()
      });
      
      // تحديث الإحصائيات المالية للمالك
      const propertyRef = doc(db, 'properties', transactionData.propertyId);
      const propertySnapshot = await getDoc(propertyRef);
      
      if (!propertySnapshot.exists()) {
        throw new Error('العقار غير موجود');
      }
      
      const propertyData = propertySnapshot.data();
      await this.updateOwnerFinancials(
        propertyData.ownerId, 
        transactionData.ownerAmount, 
        transactionData.platformFee
      );
    } catch (error) {
      console.error('Error confirming pending transaction:', error);
      throw error;
    }
  }
}

export default BookingService;