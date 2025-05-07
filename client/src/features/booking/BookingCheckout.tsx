import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Calendar, Home, User, CreditCard, CheckCircle, Lock, X } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiRequest } from '@/lib/queryClient';
import axios from 'axios';

// إنشاء كائن Stripe باستخدام مفتاح Stripe العام
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface BookingData {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  checkInDate: string;
  checkOutDate: string;
  price: number;
  totalPrice: number;
  guestCount: number;
  customerName: string;
  customerEmail: string;
}

// مكون النموذج الخاص بالدفع
const CheckoutForm = ({ booking, onSuccess }: { booking: BookingData, onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // تأكيد الدفع مع Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?booking=${booking.id}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        // عرض رسالة الخطأ للمستخدم
        setErrorMessage(error.message || 'حدث خطأ أثناء معالجة الدفعة');
        toast({
          title: "فشل الدفع",
          description: error.message || "حدث خطأ أثناء معالجة الدفع",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // تم الدفع بنجاح
        toast({
          title: "تم الدفع بنجاح",
          description: "تمت عملية الدفع بنجاح وتم تأكيد حجزك",
          variant: "default",
        });
        
        // يمكننا هنا تحديث حالة الحجز في قاعدة البيانات إلى "confirmed"
        try {
          await apiRequest('POST', `/api/confirm-booking`, { bookingId: booking.id });
          onSuccess();
        } catch (apiError) {
          console.error("Error confirming booking:", apiError);
        }
      }
    } catch (submitError) {
      console.error("Error submitting payment:", submitError);
      setErrorMessage('حدث خطأ غير متوقع أثناء معالجة الدفع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 bg-black/80 rounded-lg border border-[#39FF14]/20">
        <PaymentElement 
          options={{
            layout: 'tabs',
            fields: {
              billingDetails: {
                name: 'auto',
                email: 'auto',
              }
            },
            terms: {
              card: 'never',
            }
          }} 
          className="text-white pb-2" 
        />
      </div>
      
      {errorMessage && (
        <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-200">
          <X className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className="flex items-center justify-center gap-2 p-3 bg-[#39FF14]/5 border border-[#39FF14]/20 rounded-lg text-sm text-[#39FF14]">
        <Lock className="h-4 w-4" />
        <span>جميع معلومات الدفع مشفرة وآمنة 100%</span>
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full h-14 bg-[#39FF14] hover:bg-[#50FF30] text-black font-bold text-lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>جاري معالجة الدفع...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span>إتمام الدفع - {booking.totalPrice} دولار</span>
          </div>
        )}
      </Button>
    </form>
  );
};

// مكون صفحة الخروج والدفع
const BookingCheckout = () => {
  const [, params] = useRoute<{ id: string }>('/booking/checkout/:id');
  const bookingId = params?.id;
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // جلب بيانات الحجز
  const { 
    data: booking,
    isLoading: isLoadingBooking,
    error: bookingError
  } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId || !db) return null;
      
      try {
        // جلب معلومات الحجز من Firestore
        const bookingRef = doc(db, 'bookings', bookingId);
        const bookingSnap = await getDoc(bookingRef);
        
        if (!bookingSnap.exists()) {
          throw new Error('لم يتم العثور على الحجز');
        }
        
        const bookingData = bookingSnap.data() as BookingData & { id: string };
        
        // إضافة معرف الحجز إلى البيانات
        return { 
          ...bookingData, 
          id: bookingId 
        };
      } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
      }
    },
    enabled: !!bookingId && !!db,
  });

  // إنشاء PaymentIntent على Stripe
  useEffect(() => {
    if (booking && !clientSecret && !paymentCompleted) {
      const createPaymentIntent = async () => {
        try {
          const response = await axios.post('/api/create-payment-intent', {
            amount: booking.totalPrice,
            bookingId: booking.id,
            metadata: {
              bookingId: booking.id,
              propertyId: booking.propertyId,
              customerEmail: user?.email || booking.customerEmail
            }
          });
          
          setClientSecret(response.data.clientSecret);
        } catch (error) {
          console.error('Error creating payment intent:', error);
          toast({
            title: "خطأ في إعداد الدفع",
            description: "حدث خطأ أثناء إعداد عملية الدفع. يرجى المحاولة مرة أخرى لاحقًا.",
            variant: "destructive",
          });
        }
      };
      
      createPaymentIntent();
    }
  }, [booking, clientSecret, paymentCompleted, user]);

  // التحقق من وجود المستخدم المصادق عليه
  useEffect(() => {
    if (!user && !isLoadingBooking) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يجب عليك تسجيل الدخول لإتمام عملية الحجز",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [user, isLoadingBooking]);

  // التعامل مع إتمام الدفع بنجاح
  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    
    // انتظر لحظة ثم انتقل إلى صفحة التأكيد
    setTimeout(() => {
      navigate(`/customer/booking/confirmation/${booking?.id}`);
    }, 1500);
  };

  // عرض شاشة التحميل
  if (isLoadingBooking || !booking) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-[#39FF14]/20 border-t-[#39FF14] animate-spin"></div>
          <h2 className="text-white text-xl font-medium">جاري تحميل معلومات الحجز...</h2>
        </div>
      </div>
    );
  }
  
  // عرض رسالة الخطأ
  if (bookingError) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Card className="w-full max-w-md border-red-800 bg-black text-white">
          <CardHeader>
            <CardTitle className="text-red-500">خطأ في تحميل الحجز</CardTitle>
            <CardDescription className="text-gray-400">
              لم نتمكن من العثور على معلومات الحجز المطلوبة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">حدث خطأ أثناء محاولة تحميل معلومات الحجز. يرجى المحاولة مرة أخرى لاحقًا.</p>
            <Button onClick={() => navigate('/customer')} className="w-full">
              العودة إلى لوحة التحكم
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // تنسيق التواريخ
  const formattedCheckIn = format(new Date(booking.checkInDate), 'dd MMMM yyyy', { locale: ar });
  const formattedCheckOut = format(new Date(booking.checkOutDate), 'dd MMMM yyyy', { locale: ar });
  
  // حساب عدد الليالي
  const checkInDate = new Date(booking.checkInDate);
  const checkOutDate = new Date(booking.checkOutDate);
  const nightsCount = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">إتمام الحجز والدفع</h1>
          <p className="text-gray-400">أنت على بعد خطوة واحدة من الاستمتاع بإقامة فاخرة</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* تفاصيل الحجز */}
          <div className="md:col-span-2 order-2 md:order-1">
            <Card className="border-[#39FF14]/20 bg-black/60 shadow-lg text-white">
              <CardHeader className="border-b border-[#39FF14]/10">
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-[#39FF14]" />
                  تفاصيل الحجز
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* صورة العقار */}
                <div className="rounded-lg overflow-hidden h-40 bg-gray-900">
                  {booking.propertyImage ? (
                    <img 
                      src={booking.propertyImage} 
                      alt={booking.propertyName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="h-12 w-12 text-gray-600" />
                    </div>
                  )}
                </div>
                
                {/* اسم العقار */}
                <div>
                  <h3 className="text-xl font-bold">{booking.propertyName}</h3>
                  <div className="flex items-center text-[#39FF14] text-sm mt-1">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>متاح للحجز</span>
                  </div>
                </div>
                
                {/* تفاصيل الإقامة */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#39FF14]" />
                      <span>تاريخ الوصول</span>
                    </div>
                    <span className="font-medium">{formattedCheckIn}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#39FF14]" />
                      <span>تاريخ المغادرة</span>
                    </div>
                    <span className="font-medium">{formattedCheckOut}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm border-b border-gray-800 pb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#39FF14]" />
                      <span>عدد الضيوف</span>
                    </div>
                    <span className="font-medium">{booking.guestCount} ضيف</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#39FF14]" />
                      <span>عدد الليالي</span>
                    </div>
                    <span className="font-medium">{nightsCount} ليلة</span>
                  </div>
                </div>
                
                {/* ملخص السعر */}
                <div className="bg-gray-900/60 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">${booking.price} × {nightsCount} ليلة</span>
                    <span>${booking.price * nightsCount}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">رسوم الخدمة</span>
                    <span>${Math.round(booking.price * nightsCount * 0.1)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">رسوم التنظيف</span>
                    <span>${Math.round(booking.price * 0.05)}</span>
                  </div>
                  
                  <Separator className="my-2 bg-gray-800" />
                  
                  <div className="flex justify-between font-bold">
                    <span>المجموع</span>
                    <span className="text-[#39FF14]">${booking.totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* نموذج الدفع */}
          <div className="md:col-span-3 order-1 md:order-2">
            <Card className="border-[#39FF14]/20 bg-black/60 shadow-lg text-white">
              <CardHeader className="border-b border-[#39FF14]/10">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#39FF14]" />
                  معلومات الدفع
                </CardTitle>
                <CardDescription className="text-gray-400">
                  يرجى إدخال معلومات بطاقتك لإتمام الحجز
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' }, locale: 'ar' }}>
                    <CheckoutForm booking={booking} onSuccess={handlePaymentSuccess} />
                  </Elements>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-10 w-10 text-[#39FF14] animate-spin" />
                      <p className="text-gray-400">جاري إعداد معلومات الدفع...</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 border-t border-[#39FF14]/10 pt-6">
                <div className="text-xs text-gray-400">
                  بالنقر على "إتمام الدفع"، فإنك توافق على <a href="/terms" className="text-[#39FF14] hover:underline">شروط الخدمة</a> و <a href="/privacy" className="text-[#39FF14] hover:underline">سياسة الخصوصية</a> الخاصة بنا.
                </div>
                
                <Button variant="outline" onClick={() => navigate('/customer')} className="w-full border-gray-800 text-gray-400 hover:text-white hover:bg-gray-900">
                  العودة إلى لوحة التحكم
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckout;