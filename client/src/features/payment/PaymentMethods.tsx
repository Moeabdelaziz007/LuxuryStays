import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, Elements, PaymentElement } from "@stripe/react-stripe-js";
import { FaSpinner, FaCreditCard, FaMobileAlt, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// تحميل Stripe خارج مكون React لتجنب إعادة التهيئة في كل مرة
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error("Missing Stripe public key (VITE_STRIPE_PUBLIC_KEY)");
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  bookingId?: string;
}

// مكون نموذج الدفع بـ Stripe
const StripePaymentForm = ({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js لم يتم تحميله بعد
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: "if_required",
      });

      if (error) {
        toast({
          title: "فشل الدفع",
          description: error.message || "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
        setIsProcessing(false);
      } else {
        // مرت عملية الدفع بنجاح
        toast({
          title: "تم الدفع بنجاح",
          description: "تمت معالجة الدفع الخاص بك بنجاح.",
        });
        setIsProcessing(false);
        onSuccess();
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "خطأ في نظام الدفع",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50">
        <PaymentElement />
      </div>
      
      <div className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-lg border border-gray-800/50 text-sm">
        <div className="flex items-center gap-2 text-[#39FF14]">
          <FaCheckCircle className="h-4 w-4" />
          <span className="font-medium">معاملة آمنة ومشفرة</span>
        </div>
        <p className="text-gray-400 mt-1 text-xs pr-6">جميع بيانات بطاقتك مشفرة ومحمية بواسطة معايير أمان PCI DSS العالمية.</p>
      </div>
      
      <div className="flex gap-3 justify-end mt-6">
        <Button 
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="border-gray-700 hover:bg-gray-800/50"
        >
          إلغاء
        </Button>
        <Button 
          type="submit"
          disabled={!stripe || isProcessing}
          className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-bold px-6 py-3 shadow-[0_0_10px_rgba(57,255,20,0.3)] hover:shadow-[0_0_15px_rgba(57,255,20,0.5)]"
        >
          {isProcessing ? (
            <>
              <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              جارِ المعالجة...
            </>
          ) : (
            "إكمال الدفع"
          )}
        </Button>
      </div>
    </form>
  );
};

// مكون نموذج الدفع بـ Vodafone Cash
const VodafoneCashForm = ({ onSuccess, onCancel, amount }: { 
  onSuccess: () => void; 
  onCancel: () => void;
  amount: number;
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isAwaitingVerification, setIsAwaitingVerification] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 11) {
      toast({
        title: "رقم هاتف غير صالح",
        description: "يرجى إدخال رقم هاتف صالح لـ Vodafone Cash",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // محاكاة طلب إلى API للتحقق من دفع Vodafone Cash
    setTimeout(() => {
      setIsProcessing(false);
      setIsAwaitingVerification(true);
      toast({
        title: "تم إرسال رمز التحقق",
        description: "تم إرسال رمز التحقق إلى رقم الهاتف المحدد. يرجى إدخال الرمز للتأكيد.",
      });
    }, 2000);
  };
  
  const handleVerify = () => {
    if (!verificationCode || verificationCode.length < 4) {
      toast({
        title: "رمز تحقق غير صالح",
        description: "يرجى إدخال رمز التحقق المكون من 4 أرقام",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // محاكاة التحقق من الرمز
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
      toast({
        title: "تم الدفع بنجاح",
        description: `تم دفع ${amount} دولار بنجاح باستخدام Vodafone Cash.`,
      });
    }, 2000);
  };

  if (isAwaitingVerification) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <div className="absolute -inset-2 rounded-full bg-[#39FF14]/20 blur-lg"></div>
            <FaMobileAlt className="w-16 h-16 mx-auto text-[#39FF14] relative" />
          </div>
          <h3 className="text-xl font-semibold">تأكيد دفع Vodafone Cash</h3>
          <p className="text-sm text-gray-400 mt-1">
            تم إرسال رمز التحقق إلى رقم الهاتف <span className="text-white font-medium">{phoneNumber}</span>
          </p>
        </div>
        
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50">
          <div className="space-y-3">
            <label htmlFor="verificationCode" className="block text-sm font-medium">
              رمز التحقق
            </label>
            <input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="أدخل رمز التحقق المكون من 4 أرقام"
              className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700/70 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#39FF14] focus:border-[#39FF14] text-lg tracking-widest text-center"
              maxLength={4}
            />
          </div>
          
          <div className="mt-4 bg-gray-800/30 backdrop-blur-sm p-4 rounded-lg border border-gray-800/50 text-sm">
            <div className="flex items-center gap-2 text-[#39FF14]">
              <FaCheckCircle className="h-4 w-4" />
              <span className="font-medium">معاملة آمنة</span>
            </div>
            <p className="text-gray-400 mt-1 text-xs pr-6">يرجى إدخال رمز التحقق المرسل إلى هاتفك لإتمام عملية الدفع.</p>
          </div>
        </div>
        
        <div className="flex gap-3 justify-end mt-6">
          <Button 
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
            className="border-gray-700 hover:bg-gray-800/50"
          >
            إلغاء
          </Button>
          <Button 
            type="button"
            onClick={handleVerify}
            disabled={isProcessing}
            className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-bold px-6 py-3 shadow-[0_0_10px_rgba(57,255,20,0.3)] hover:shadow-[0_0_15px_rgba(57,255,20,0.5)]"
          >
            {isProcessing ? (
              <>
                <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                جارِ التحقق...
              </>
            ) : (
              "تأكيد الدفع"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="block text-sm font-medium">
              رقم الهاتف لـ Vodafone Cash
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="أدخل رقم الهاتف (e.g. 01014567890)"
              className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700/70 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#39FF14] focus:border-[#39FF14]"
            />
          </div>
          
          <div className="bg-gray-800/40 p-4 rounded-lg border border-gray-700/50 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">المبلغ:</span>
              <span className="font-bold">${amount}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-300">سيتم خصم:</span>
              <span className="font-bold text-[#39FF14]">{amount * 31} جنيه مصري</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-lg border border-gray-800/50 text-sm">
        <div className="flex items-center gap-2 text-[#39FF14]">
          <FaCheckCircle className="h-4 w-4" />
          <span className="font-medium">معاملة آمنة ومشفرة</span>
        </div>
        <p className="text-gray-400 mt-1 text-xs pr-6">سيتم إرسال رمز تحقق إلى رقم الهاتف المدخل للتأكد من هويتك وإتمام عملية الدفع.</p>
      </div>
      
      <div className="flex gap-3 justify-end mt-6">
        <Button 
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="border-gray-700 hover:bg-gray-800/50"
        >
          إلغاء
        </Button>
        <Button 
          type="submit"
          disabled={isProcessing}
          className="bg-[#39FF14] hover:bg-[#50FF30] text-black font-bold px-6 py-3 shadow-[0_0_10px_rgba(57,255,20,0.3)] hover:shadow-[0_0_15px_rgba(57,255,20,0.5)]"
        >
          {isProcessing ? (
            <>
              <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
              جارِ المعالجة...
            </>
          ) : (
            "متابعة الدفع"
          )}
        </Button>
      </div>
    </form>
  );
};

const PaymentMethods = ({ amount, onSuccess, onCancel, bookingId }: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'vodafone' | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createPaymentIntent = async () => {
    if (!amount || amount <= 0) {
      toast({
        title: "خطأ في المبلغ",
        description: "يرجى تحديد مبلغ صالح للدفع.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount,
          bookingId
        }),
      });

      if (!response.ok) {
        throw new Error('فشل في إنشاء نية الدفع. يرجى المحاولة مرة أخرى.');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast({
        title: "خطأ في الدفع",
        description: "حدث خطأ أثناء إعداد الدفع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      onCancel();
    } finally {
      setIsLoading(false);
    }
  };

  // عند اختيار طريقة الدفع Stripe، قم بإنشاء نية الدفع
  const handleSelectStripe = async () => {
    setPaymentMethod('stripe');
    await createPaymentIntent();
  };

  const handleSelectVodafone = () => {
    setPaymentMethod('vodafone');
  };

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#39FF14]">اختر طريقة الدفع</h2>
      
      {!paymentMethod ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            className="bg-black/70 backdrop-blur-sm border border-gray-800 cursor-pointer hover:border-[#39FF14] hover:shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all group"
            onClick={handleSelectStripe}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-white">بطاقة ائتمان</CardTitle>
              <FaCreditCard className="h-5 w-5 text-[#39FF14] transition-transform group-hover:scale-110" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                الدفع الآمن باستخدام بطاقة الائتمان أو الخصم عبر Stripe
              </p>
              <div className="mt-4 p-3 bg-white/5 rounded-lg border border-gray-800 flex justify-center">
                <img src="https://cdn.brandfolder.io/B2N1K3M7/as/85hp8pdcwcm8j9w88sfxzh/Powered_by_Stripe_-_blurple.svg" alt="Powered by Stripe" className="h-8" />
              </div>
              <div className="mt-3 flex justify-end">
                <div className="bg-[#39FF14]/10 text-[#39FF14] px-3 py-1 rounded-full text-xs font-medium">
                  آمن و سريع
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-black/70 backdrop-blur-sm border border-gray-800 cursor-pointer hover:border-[#39FF14] hover:shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all group"
            onClick={handleSelectVodafone}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium text-white">Vodafone Cash</CardTitle>
              <FaMobileAlt className="h-5 w-5 text-[#39FF14] transition-transform group-hover:scale-110" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                الدفع مباشرة باستخدام رقم Vodafone Cash الخاص بك
              </p>
              <div className="mt-4 p-3 bg-white/5 rounded-lg border border-gray-800 flex justify-center">
                <div className="bg-[#e60000] text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  <FaMobileAlt /> Vodafone Cash
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <div className="bg-[#39FF14]/10 text-[#39FF14] px-3 py-1 rounded-full text-xs font-medium">
                  بالجنيه المصري
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : paymentMethod === 'stripe' ? (
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center bg-black/60 backdrop-blur-md p-8 rounded-lg border border-gray-800">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-[#39FF14]/20 blur-lg"></div>
                  <FaSpinner className="animate-spin h-10 w-10 mb-4 text-[#39FF14] relative" />
                </div>
                <span className="text-gray-300 mt-4">جاري إعداد طريقة الدفع...</span>
              </div>
            </div>
          ) : clientSecret ? (
            <div>
              <div className="flex items-center mb-6">
                <Button
                  variant="ghost"
                  onClick={() => setPaymentMethod(null)}
                  className="text-gray-300 hover:text-white flex items-center gap-2 hover:bg-black/30"
                >
                  <FaArrowLeft className="h-3 w-3" /> العودة إلى طرق الدفع
                </Button>
              </div>
              <Card className="bg-black/70 backdrop-blur-md border border-gray-800 mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FaCreditCard className="h-5 w-5 text-[#39FF14]" />
                    <h3 className="text-xl font-medium">إتمام الدفع ببطاقة الائتمان</h3>
                  </div>
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripePaymentForm onSuccess={onSuccess} onCancel={() => setPaymentMethod(null)} />
                  </Elements>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-black/60 backdrop-blur-md p-10 rounded-lg border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.2)] inline-block">
                <div className="relative inline-block mb-6">
                  <div className="absolute -inset-6 rounded-full bg-[#39FF14]/10 blur-xl"></div>
                  <FaSpinner className="h-12 w-12 text-[#39FF14] animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">جاري تحميل طريقة الدفع</h3>
                <p className="text-gray-400 mb-6">يرجى الانتظار بينما نقوم بتجهيز نموذج الدفع.</p>
                <Button 
                  onClick={() => setPaymentMethod(null)}
                  className="bg-[#39FF14] text-black hover:bg-[#50FF30]"
                >
                  العودة إلى طرق الدفع
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => setPaymentMethod(null)}
              className="text-gray-300 hover:text-white flex items-center gap-2 hover:bg-black/30"
            >
              <FaArrowLeft className="h-3 w-3" /> العودة إلى طرق الدفع
            </Button>
          </div>
          <Card className="bg-black/70 backdrop-blur-md border border-gray-800 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-6">
                <FaMobileAlt className="h-5 w-5 text-[#39FF14]" />
                <h3 className="text-xl font-medium">إتمام الدفع بـ Vodafone Cash</h3>
              </div>
              <VodafoneCashForm amount={amount} onSuccess={onSuccess} onCancel={() => setPaymentMethod(null)} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;