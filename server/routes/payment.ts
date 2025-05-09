import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { 
  BookingStatus, 
  bookings, 
  transactions
} from '@shared/schema';

// التحقق من وجود مفتاح Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('مفتاح Stripe السري غير متوفر. يرجى إضافة STRIPE_SECRET_KEY إلى متغيرات البيئة.');
}

// إنشاء كائن Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil' as any,
});

const router = Router();

/**
 * إنشاء قصد الدفع (PaymentIntent) على Stripe لحجز جديد
 */
router.post('/create-payment-intent', async (req: Request, res: Response) => {
  try {
    const { amount, bookingId, metadata } = req.body;
    
    // يجب توفير المبلغ ومعرف الحجز
    if (!amount || !bookingId) {
      return res.status(400).json({ error: 'يجب توفير المبلغ ومعرف الحجز' });
    }
    
    // إنشاء PaymentIntent على Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // تحويل المبلغ إلى سنت (Stripe يتعامل بالسنت)
      currency: 'usd',
      metadata: {
        bookingId,
        platformFee: Math.round(amount * 0.1 * 100), // 10% عمولة المنصة
        propertyOwnerAmount: Math.round(amount * 0.9 * 100), // 90% لمشرف العقار
        ...metadata
      },
      // يمكن إضافة المزيد من الإعدادات هنا حسب الحاجة
    });
    
    // إرسال سر العميل إلى العميل
    res.json({ clientSecret: paymentIntent.client_secret });
    
  } catch (error: any) {
    console.error('خطأ في إنشاء PaymentIntent:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء إعداد الدفع', details: error.message });
  }
});

/**
 * تأكيد الحجز بعد الدفع الناجح
 */
router.post('/confirm-booking', async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    
    // يجب توفير معرف الحجز
    if (!bookingId) {
      return res.status(400).json({ error: 'يجب توفير معرف الحجز' });
    }
    
    // الحصول على بيانات الحجز من قاعدة البيانات
    const bookingData = await db.query.bookings.findFirst({
      where: eq(bookings.id, parseInt(bookingId))
    });
    
    // التحقق من وجود الحجز
    if (!bookingData) {
      return res.status(404).json({ error: 'لم يتم العثور على الحجز' });
    }
    
    // تاريخ التحديث الحالي
    const now = new Date();
    
    // تحديث حالة الحجز إلى "مؤكد"
    await db.update(bookings)
      .set({
        status: BookingStatus.CONFIRMED,
        paymentConfirmedAt: now,
        updatedAt: now
      })
      .where(eq(bookings.id, parseInt(bookingId)));
    
    // إنشاء سجل للمعاملة المالية
    const totalAmount = bookingData.totalPrice || 0;
    
    // إضافة المعاملة إلى جدول المعاملات
    await db.insert(transactions).values({
      bookingId: parseInt(bookingId),
      propertyId: bookingData.propertyId,
      propertyAdminId: bookingData.propertyId, // استخدام معرف العقار كبديل عن معرف المشرف
      customerId: bookingData.customerId,
      totalAmount,
      platformFee: Math.round(totalAmount * 0.1), // 10% عمولة المنصة
      propertyOwnerAmount: Math.round(totalAmount * 0.9), // 90% لمشرف العقار
      timestamp: now,
      status: 'completed',
      paymentMethod: 'card'
    });
    
    // إرسال استجابة نجاح
    res.json({ success: true, message: 'تم تأكيد الحجز بنجاح' });
    
  } catch (error: any) {
    console.error('خطأ في تأكيد الحجز:', error);
    res.status(500).json({ error: 'حدث خطأ أثناء تأكيد الحجز', details: error.message });
  }
});

/**
 * معالج webhook من Stripe للإشعارات التلقائية
 */
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    // التحقق من أن الطلب من Stripe بالفعل
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = req.body;
    }
    
    // معالجة الأحداث المختلفة من Stripe
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // التعامل مع الدفع الناجح
        await handlePaymentSuccess(paymentIntent);
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        
        // التعامل مع فشل الدفع
        await handlePaymentFailure(failedPayment);
        break;
        
      default:
        // أنواع أخرى من الأحداث يمكن معالجتها حسب الحاجة
        console.log(`تم استلام حدث غير معالج من Stripe: ${event.type}`);
    }
    
    // إرسال استجابة نجاح لـ Stripe
    res.status(200).json({ received: true });
    
  } catch (error: any) {
    console.error('خطأ في معالجة webhook من Stripe:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

/**
 * معالجة الدفع الناجح وتحديث حالة الحجز
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // الحصول على معرف الحجز من البيانات الوصفية للدفع
  const bookingId = paymentIntent.metadata?.bookingId;
  
  if (!bookingId) {
    console.error('لا يوجد معرف حجز في بيانات الدفع');
    return;
  }
  
  try {
    // الحصول على بيانات الحجز من قاعدة البيانات
    const bookingData = await db.query.bookings.findFirst({
      where: eq(bookings.id, parseInt(bookingId))
    });
    
    // التحقق من وجود الحجز
    if (!bookingData) {
      console.error(`لم يتم العثور على الحجز بالمعرف: ${bookingId}`);
      return;
    }
    
    // تاريخ التحديث الحالي
    const now = new Date();
    
    // تحديث حالة الحجز إلى "مؤكد"
    await db.update(bookings)
      .set({
        status: BookingStatus.CONFIRMED,
        paymentConfirmedAt: now,
        updatedAt: now,
        stripePaymentIntentId: paymentIntent.id
      })
      .where(eq(bookings.id, parseInt(bookingId)));
    
    // إنشاء سجل للمعاملة المالية
    const totalAmount = bookingData.totalPrice || 0;
    
    // إضافة المعاملة إلى جدول المعاملات
    await db.insert(transactions).values({
      bookingId: parseInt(bookingId),
      propertyId: bookingData.propertyId,
      propertyAdminId: bookingData.propertyId, // استخدام معرف العقار كبديل عن معرف المشرف
      customerId: bookingData.customerId,
      totalAmount,
      platformFee: Math.round(totalAmount * 0.1), // 10% عمولة المنصة
      propertyOwnerAmount: Math.round(totalAmount * 0.9), // 90% لمشرف العقار
      status: 'completed',
      paymentMethod: 'card',
      stripePaymentIntentId: paymentIntent.id,
      timestamp: now
    });
    
    console.log(`تم تأكيد الحجز بنجاح: ${bookingId}`);
    
  } catch (error) {
    console.error('خطأ في معالجة الدفع الناجح:', error);
  }
}

/**
 * معالجة فشل الدفع وتحديث حالة الحجز
 */
async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  // الحصول على معرف الحجز من البيانات الوصفية للدفع
  const bookingId = paymentIntent.metadata?.bookingId;
  
  if (!bookingId) {
    console.error('لا يوجد معرف حجز في بيانات الدفع');
    return;
  }
  
  try {
    // الحصول على بيانات الحجز من قاعدة البيانات
    const bookingData = await db.query.bookings.findFirst({
      where: eq(bookings.id, parseInt(bookingId))
    });
    
    // التحقق من وجود الحجز
    if (!bookingData) {
      console.error(`لم يتم العثور على الحجز بالمعرف: ${bookingId}`);
      return;
    }
    
    // تاريخ التحديث الحالي
    const now = new Date();
    
    // تحديث حالة الحجز إلى "معلق" مرة أخرى أو "فشل الدفع"
    await db.update(bookings)
      .set({
        paymentFailedAt: now,
        updatedAt: now,
        paymentError: paymentIntent.last_payment_error?.message || 'فشل الدفع',
        stripePaymentIntentId: paymentIntent.id
      })
      .where(eq(bookings.id, parseInt(bookingId)));
    
    console.log(`تم تحديث حالة الحجز بعد فشل الدفع: ${bookingId}`);
    
  } catch (error) {
    console.error('خطأ في معالجة فشل الدفع:', error);
  }
}

export default router;