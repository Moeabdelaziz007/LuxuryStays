import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, Elements, PaymentElement } from "@stripe/react-stripe-js";
import { FaSpinner, FaCreditCard, FaMobileAlt, FaCheckCircle } from "react-icons/fa";
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <div className="flex gap-2 justify-end mt-4">
        <Button 
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          إلغاء
        </Button>
        <Button 
          type="submit"
          disabled={!stripe || isProcessing}
          className="bg-[#39FF14] hover:bg-[#50FF30] text-black"
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
      <div className="space-y-4">
        <div className="text-center mb-4">
          <FaMobileAlt className="w-12 h-12 mx-auto text-[#39FF14] mb-2" />
          <h3 className="text-lg font-semibold">تأكيد دفع Vodafone Cash</h3>
          <p className="text-sm text-gray-400">
            تم إرسال رمز التحقق إلى رقم الهاتف {phoneNumber}
          </p>
        </div>
        <div className="space-y-2">
          <label htmlFor="verificationCode" className="block text-sm font-medium">
            رمز التحقق
          </label>
          <input
            id="verificationCode"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="أدخل رمز التحقق المكون من 4 أرقام"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#39FF14] focus:border-[#39FF14]"
            maxLength={4}
          />
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Button 
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
          >
            إلغاء
          </Button>
          <Button 
            type="button"
            onClick={handleVerify}
            disabled={isProcessing}
            className="bg-[#39FF14] hover:bg-[#50FF30] text-black"
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
    <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-[#39FF14] focus:border-[#39FF14]"
        />
      </div>
      <div className="bg-gray-800/50 p-3 rounded-md border border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">المبلغ:</span>
          <span className="font-bold">${amount}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-300">سيتم خصم:</span>
          <span className="font-bold">{amount * 31} جنيه مصري</span>
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <Button 
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          إلغاء
        </Button>
        <Button 
          type="submit"
          disabled={isProcessing}
          className="bg-[#39FF14] hover:bg-[#50FF30] text-black"
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
      <h2 className="text-2xl font-bold mb-6 text-center">اختر طريقة الدفع</h2>
      
      {!paymentMethod ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="bg-gray-900 border-gray-800 cursor-pointer hover:border-[#39FF14] transition-colors"
            onClick={handleSelectStripe}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">بطاقة ائتمان</CardTitle>
              <FaCreditCard className="h-5 w-5 text-[#39FF14]" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                الدفع الآمن باستخدام بطاقة الائتمان أو الخصم عبر Stripe
              </p>
              <div className="flex justify-center mt-4">
                <img src="https://cdn.brandfolder.io/B2N1K3M7/as/85hp8pdcwcm8j9w88sfxzh/Powered_by_Stripe_-_blurple.svg" alt="Powered by Stripe" className="h-8" />
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-gray-900 border-gray-800 cursor-pointer hover:border-[#39FF14] transition-colors"
            onClick={handleSelectVodafone}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Vodafone Cash</CardTitle>
              <FaMobileAlt className="h-5 w-5 text-[#39FF14]" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">
                الدفع مباشرة باستخدام رقم Vodafone Cash الخاص بك
              </p>
              <div className="flex justify-center mt-4">
                <div className="bg-[#e60000] text-white font-bold px-3 py-1 rounded text-sm">Vodafone Cash</div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : paymentMethod === 'stripe' ? (
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <FaSpinner className="animate-spin h-8 w-8 mb-4 text-[#39FF14]" />
                <span className="text-gray-400">جاري إعداد طريقة الدفع...</span>
              </div>
            </div>
          ) : clientSecret ? (
            <div>
              <div className="flex items-center mb-4">
                <Button
                  variant="ghost"
                  className="mb-4"
                  onClick={() => setPaymentMethod(null)}
                >
                  ← العودة إلى طرق الدفع
                </Button>
              </div>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm onSuccess={onSuccess} onCancel={() => setPaymentMethod(null)} />
              </Elements>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="bg-gray-800 p-4 rounded-full inline-block mb-4">
                <FaSpinner className="h-10 w-10 text-[#39FF14]/70 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold mb-2">جاري تحميل طريقة الدفع</h3>
              <p className="text-gray-400 mb-6">يرجى الانتظار بينما نقوم بتجهيز نموذج الدفع.</p>
              <Button onClick={() => setPaymentMethod(null)}>العودة إلى طرق الدفع</Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setPaymentMethod(null)}
            >
              ← العودة إلى طرق الدفع
            </Button>
          </div>
          <VodafoneCashForm amount={amount} onSuccess={onSuccess} onCancel={() => setPaymentMethod(null)} />
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;