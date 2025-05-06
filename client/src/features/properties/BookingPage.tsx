import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  addDoc, 
  collection, 
  serverTimestamp, 
  doc, 
  getDoc,
  updateDoc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaStickyNote, 
  FaArrowLeft, 
  FaSpinner,
  FaCheckCircle,
  FaHome
} from "react-icons/fa";
import PaymentMethods from "@/features/payment/PaymentMethods";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function BookingPage() {
  // Parse propertyId from query string
  const [location, navigate] = useLocation();
  const params = new URLSearchParams(location.split('?')[1]);
  const propertyId = params.get('propertyId') || "";
  
  const { user } = useAuth();
  const { toast } = useToast();

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [step, setStep] = useState(1); // 1: تفاصيل الحجز, 2: الدفع
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // جلب معلومات العقار
  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId || !db) return;
      
      try {
        const propertyDoc = await getDoc(doc(db, "properties", propertyId));
        
        if (propertyDoc.exists()) {
          setProperty({
            id: propertyDoc.id,
            ...propertyDoc.data()
          });
        } else {
          toast({
            title: "خطأ",
            description: "لم يتم العثور على العقار المطلوب",
            variant: "destructive"
          });
          navigate("/properties");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast({
          title: "خطأ في النظام",
          description: "فشل في جلب معلومات العقار. الرجاء المحاولة مرة أخرى لاحقاً",
          variant: "destructive"
        });
      } finally {
        setLoadingProperty(false);
      }
    };
    
    fetchProperty();
  }, [propertyId, db, toast, navigate]);

  // حساب السعر الكلي عند تغيير التواريخ
  useEffect(() => {
    if (!property || !checkInDate || !checkOutDate) {
      setTotalPrice(0);
      return;
    }
    
    // حساب عدد الأيام
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkOut <= checkIn) {
      setTotalPrice(0);
      return;
    }
    
    // حساب الفرق بالأيام
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // حساب السعر الكلي
    const price = property.price || 0;
    const total = diffDays * price;
    
    setTotalPrice(total);
  }, [property, checkInDate, checkOutDate]);

  // التحقق من تاريخ ليس في الماضي
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // التأكد من أن تاريخ المغادرة بعد تاريخ الوصول
  const getMinCheckoutDate = () => {
    if (!checkInDate) return getTodayDate();
    
    const checkIn = new Date(checkInDate);
    checkIn.setDate(checkIn.getDate() + 1);
    
    const year = checkIn.getFullYear();
    const month = String(checkIn.getMonth() + 1).padStart(2, '0');
    const day = String(checkIn.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // إتمام الحجز
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "مطلوب تسجيل الدخول",
        description: "يرجى تسجيل الدخول لإتمام عملية الحجز",
        variant: "destructive"
      });
      navigate(`/login?redirect=${encodeURIComponent(location)}`);
      return;
    }
    
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى تحديد تاريخ الوصول والمغادرة",
        variant: "destructive"
      });
      return;
    }
    
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      toast({
        title: "خطأ في التواريخ",
        description: "يجب أن يكون تاريخ المغادرة بعد تاريخ الوصول",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!db) throw new Error("قاعدة البيانات غير متاحة");
      
      // إنشاء سجل الحجز
      const bookingData = {
        propertyId,
        userId: user.uid,
        propertyOwnerId: property?.ownerId || "",
        checkInDate: new Date(checkInDate).toISOString(),
        checkOutDate: new Date(checkOutDate).toISOString(),
        guests,
        notes,
        totalPrice,
        status: "pending",
        paymentStatus: "unpaid",
        createdAt: serverTimestamp(),
        propertyName: property?.name || "",
        propertyImage: property?.imageUrl || "",
      };
      
      const docRef = await addDoc(collection(db, "bookings"), bookingData);
      
      // حفظ معرف الحجز لاستخدامه في عملية الدفع
      setBookingId(docRef.id);
      
      // الانتقال إلى خطوة الدفع
      setStep(2);
      
      toast({
        title: "تم إنشاء الحجز",
        description: "يمكنك الآن إكمال عملية الدفع",
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "فشل في إنشاء الحجز",
        description: "حدث خطأ أثناء محاولة إنشاء الحجز. الرجاء المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // عند اكتمال عملية الدفع
  const handlePaymentSuccess = async () => {
    try {
      if (!bookingId || !db) {
        throw new Error("معلومات الحجز غير متوفرة");
      }
      
      // تحديث حالة الدفع في سجل الحجز
      await updateDoc(doc(db, "bookings", bookingId), {
        paymentStatus: "paid",
        status: "confirmed",
        updatedAt: serverTimestamp()
      });
      
      setSuccess(true);
      
      toast({
        title: "تم إكمال الحجز بنجاح",
        description: "تم تأكيد الحجز ودفع المستحقات بنجاح",
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "خطأ في تحديث حالة الحجز",
        description: "تم إتمام الدفع بنجاح ولكن حدث خطأ في تحديث حالة الحجز. سيتم المتابعة معك من قبل فريق الدعم.",
        variant: "destructive"
      });
    }
  };

  // إلغاء عملية الدفع والعودة لشاشة الحجز
  const handlePaymentCancel = () => {
    setStep(1);
  };

  // إذا كان هناك تحميل للعقار
  if (loadingProperty) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 mx-auto text-[#39FF14] mb-4" />
          <p className="text-gray-400">جاري تحميل معلومات العقار...</p>
        </div>
      </div>
    );
  }

  // إذا لم يتم العثور على العقار
  if (!property) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-[#39FF14] text-5xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">العقار غير موجود</h2>
          <p className="text-gray-400 mb-6">لم يتم العثور على العقار المطلوب أو أنه لم يعد متاحاً.</p>
          <Button 
            onClick={() => navigate("/properties")}
            className="bg-[#39FF14] text-black hover:bg-[#50FF30]"
          >
            عرض العقارات المتاحة
          </Button>
        </div>
      </div>
    );
  }

  // نجاح العملية
  if (success) {
    return (
      <div className="bg-black text-white min-h-screen py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="inline-block mb-4 bg-[#39FF14]/10 p-6 rounded-full">
                  <FaCheckCircle className="h-16 w-16 text-[#39FF14]" />
                </div>
                <h2 className="text-[#39FF14] text-2xl font-bold mb-4">تم إكمال الحجز بنجاح!</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  تم تأكيد حجزك بنجاح وإرسال تفاصيل الحجز إلى بريدك الإلكتروني.
                  يمكنك متابعة حالة الحجز من صفحة حجوزاتي.
                </p>
                
                <div className="bg-gray-800 rounded-lg p-6 mb-8 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-[#39FF14] mb-3">تفاصيل الحجز</h3>
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-400">العقار:</span>
                      <span>{property.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">تاريخ الوصول:</span>
                      <span>{new Date(checkInDate).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">تاريخ المغادرة:</span>
                      <span>{new Date(checkOutDate).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">إجمالي المبلغ:</span>
                      <span className="font-bold text-[#39FF14]">${totalPrice}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    onClick={() => navigate("/customer")}
                    className="bg-[#39FF14] hover:bg-[#50FF30] text-black"
                  >
                    <FaHome className="mr-2" /> الذهاب إلى لوحة التحكم
                  </Button>
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                  >
                    العودة للرئيسية
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // صفحة الحجز الرئيسية
  return (
    <div className="bg-black text-white min-h-screen">
      {/* ✨ خلفية متحركة لصفحة الحجز */}
      <div className="relative overflow-hidden">
        {/* تحسين خلفية التدرج المتحركة - مشابهة للصفحة الرئيسية */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-0">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=2070')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
          
          {/* خطوط شبكة خفيفة */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(to right, rgba(57, 255, 20, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(57, 255, 20, 0.2) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}></div>
          </div>
          
          {/* عناصر نيون عائمة */}
          <div className="absolute inset-0 overflow-hidden hidden md:block">
            <div className="absolute top-[15%] right-[10%] w-20 h-20 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
            <div className="absolute bottom-[20%] left-[15%] w-32 h-32 rounded-full bg-[#39FF14]/5 blur-xl animate-neon-pulse"></div>
            <div className="absolute top-[40%] left-[5%] w-16 h-16 rounded-full bg-[#39FF14]/10 blur-xl animate-neon-pulse"></div>
          </div>
        </div>
        
        <div className="relative z-10 py-12 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {step === 1 ? (
              <Card className="bg-black/60 backdrop-blur-md border border-[#39FF14]/20 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#39FF14]">حجز عقار</h2>
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate(-1)}
                      className="text-gray-400 hover:text-white"
                    >
                      <FaArrowLeft className="mr-2" /> عودة
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div>
                      <div className="bg-gray-800/50 rounded-lg overflow-hidden mb-4 h-48 relative group">
                        {property.imageUrl ? (
                          <img 
                            src={property.imageUrl} 
                            alt={property.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-700/50 backdrop-blur-sm">
                            <FaHome className="h-16 w-16 text-gray-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-2 right-2">
                          <span className="bg-[#39FF14] text-black text-xs font-bold px-2 py-1 rounded-full">
                            فاخر
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">{property.name}</h3>
                      <p className="text-gray-400 mb-4">{property.location}</p>
                      
                      <div className="rounded-lg bg-black/50 backdrop-blur-sm p-4 mb-4 border border-gray-800/50">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">سعر الليلة:</span>
                          <span className="font-bold text-[#39FF14]">${property.price || 0}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">نوع العقار:</span>
                          <span>{property.type || 'فيلا'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">التقييم:</span>
                          <span>{property.rating || 5} ⭐</span>
                        </div>
                      </div>
                    </div>
                
                    <div>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <label className="block text-sm font-medium">
                            <FaCalendarAlt className="inline-block mr-2 text-[#39FF14]" /> تاريخ الوصول:
                          </label>
                          <input 
                            type="date" 
                            value={checkInDate} 
                            onChange={(e) => setCheckInDate(e.target.value)} 
                            min={getTodayDate()}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14] transition-colors" 
                            required 
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-sm font-medium">
                            <FaCalendarAlt className="inline-block mr-2 text-[#39FF14]" /> تاريخ المغادرة:
                          </label>
                          <input 
                            type="date" 
                            value={checkOutDate} 
                            onChange={(e) => setCheckOutDate(e.target.value)} 
                            min={getMinCheckoutDate()}
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14] transition-colors" 
                            required 
                            disabled={!checkInDate}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-sm font-medium">
                            <FaUsers className="inline-block mr-2 text-[#39FF14]" /> عدد الضيوف:
                          </label>
                          <input 
                            type="number" 
                            min="1" 
                            max={property.maxGuests || 10}
                            value={guests} 
                            onChange={(e) => setGuests(Number(e.target.value))} 
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14] transition-colors" 
                            required 
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <label className="block text-sm font-medium">
                            <FaStickyNote className="inline-block mr-2 text-[#39FF14]" /> ملاحظات إضافية:
                          </label>
                          <textarea 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)} 
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-[#39FF14] focus:outline-none focus:ring-1 focus:ring-[#39FF14] transition-colors min-h-[80px]"
                          ></textarea>
                        </div>
                        
                        <Separator className="bg-gray-800 my-6" />
                        
                        <div className="bg-gray-800 rounded-lg p-4">
                          <h4 className="font-medium mb-3">ملخص الحجز</h4>
                          <div className="space-y-2">
                            {checkInDate && checkOutDate && new Date(checkOutDate) > new Date(checkInDate) ? (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">السعر لكل ليلة:</span>
                                  <span>${property.price || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">عدد الليالي:</span>
                                  <span>{Math.ceil(
                                    Math.abs(new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / 
                                    (1000 * 60 * 60 * 24)
                                  )}</span>
                                </div>
                                <Separator className="bg-gray-700 my-2" />
                                <div className="flex justify-between font-bold">
                                  <span>الإجمالي:</span>
                                  <span className="text-[#39FF14]">${totalPrice}</span>
                                </div>
                              </>
                            ) : (
                              <p className="text-gray-400 text-center py-2">
                                يرجى اختيار تواريخ الوصول والمغادرة لعرض التفاصيل
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 mt-4">
                          * بالضغط على زر متابعة الحجز، أنت توافق على شروط وأحكام استخدام الخدمة.
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-[#39FF14] text-black font-bold py-6 text-lg hover:bg-[#50FF30] transition-colors"
                          disabled={isLoading || !checkInDate || !checkOutDate || new Date(checkOutDate) <= new Date(checkInDate)}
                        >
                          {isLoading ? (
                            <>
                              <FaSpinner className="animate-spin mr-2" /> جاري معالجة الطلب...
                            </>
                          ) : (
                            "متابعة الحجز والدفع"
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/60 backdrop-blur-md border border-[#39FF14]/20 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#39FF14]">إتمام الدفع</h2>
                    <Button 
                      variant="ghost" 
                      onClick={() => setStep(1)}
                      className="text-gray-400 hover:text-white"
                      disabled={isLoading}
                    >
                      <FaArrowLeft className="mr-2" /> العودة للحجز
                    </Button>
                  </div>
                  
                  <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-4 mb-6 border border-gray-700/30">
                    <h3 className="font-medium mb-3 text-[#39FF14]">ملخص الحجز</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">العقار:</p>
                        <p className="font-medium">{property.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">الموقع:</p>
                        <p>{property.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">تاريخ الوصول:</p>
                        <p>{new Date(checkInDate).toLocaleDateString('ar-EG')}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">تاريخ المغادرة:</p>
                        <p>{new Date(checkOutDate).toLocaleDateString('ar-EG')}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">عدد الضيوف:</p>
                        <p>{guests}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">المبلغ الإجمالي:</p>
                        <p className="font-bold text-[#39FF14]">${totalPrice}</p>
                      </div>
                    </div>
                  </div>
                  
                  <PaymentMethods 
                    amount={totalPrice} 
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                    bookingId={bookingId || undefined}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}