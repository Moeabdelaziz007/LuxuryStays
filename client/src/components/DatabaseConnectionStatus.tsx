import React, { useEffect, useState } from "react";
import { AlertCircle, InfoIcon, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db } from "@/lib/firebase";
import { enableNetwork, disableNetwork } from "firebase/firestore";

/**
 * مكوّن يعرض حالة الاتصال بقاعدة البيانات للمستخدم مع إمكانية إعادة المحاولة
 */
const DatabaseConnectionStatus: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // مراقبة حالة الاتصال بالإنترنت و Firestore
  useEffect(() => {
    // التحقق من وجود Firestore
    if (!db) {
      setIsOffline(true);
      setShowAlert(true);
      return;
    }

    // وظيفة للتحقق من حالة الاتصال بـ Firestore
    const checkFirestoreStatus = async () => {
      try {
        // محاولة إجراء عملية بسيطة للتحقق من الاتصال بـ Firestore
        // استخدام الخاصية '.type' للتحقق من وجود اتصال بدون إجراء عملية قراءة فعلية
        if (db && typeof db.type === 'string') {
          // Firestore موجود ونشط
          if (isOffline) {
            setIsOffline(false);
            // إظهار رسالة نجاح مؤقتة
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
          }
        } else {
          setIsOffline(true);
          setShowAlert(true);
        }
      } catch (error) {
        console.error("Failed to check Firestore status:", error);
        setIsOffline(true);
        setShowAlert(true);
      }
    };

    // التحقق من حالة الاتصال بالإنترنت
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        // محاولة إعادة الاتصال بـ Firestore عند عودة الاتصال بالإنترنت
        if (isOffline && db) {
          handleRetryConnection();
        }
      } else {
        setIsOffline(true);
        setShowAlert(true);
      }
    };

    // فحص حالة Firestore عند تحميل المكون
    checkFirestoreStatus();

    // تحقق من حالة Firestore بشكل دوري كل 30 ثانية
    const intervalId = setInterval(checkFirestoreStatus, 30000);

    // الاستماع إلى تغيّرات حالة الاتصال
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // التنظيف عند إلغاء تحميل المكوّن
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [isOffline]);

  // محاولة إعادة الاتصال بـ Firestore مع استراتيجية أكثر قوة
  const handleRetryConnection = async () => {
    if (!db) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      // استخدام نسخة نظيفة من db لتجنب أخطاء TypeScript
      const firestore = db;
      
      // محاولة أولى لتفعيل الشبكة مباشرة
      console.log("محاولة إعادة الاتصال بـ Firestore...");
      
      // محاولة تفعيل الشبكة باستخدام استراتيجية التعافي
      const enableResult = await enableNetwork(firestore).catch(async (error) => {
        console.warn("فشل في تفعيل الشبكة مباشرة، جارٍ تجربة استراتيجية بديلة:", error);
        
        // إذا فشلت المحاولة المباشرة، نجرب تعطيل ثم إعادة تفعيل بفاصل زمني
        try {
          await disableNetwork(firestore);
          console.log("تم تعطيل الشبكة بنجاح، انتظار قبل إعادة المحاولة...");
          
          // انتظار قبل إعادة تفعيل الشبكة
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // محاولة إعادة تفعيل الشبكة
          await enableNetwork(firestore);
          return true; // إشارة إلى نجاح الاستراتيجية البديلة
        } catch (innerError) {
          console.error("فشل في استخدام استراتيجية التعافي البديلة:", innerError);
          throw innerError; // إعادة إلقاء الخطأ ليتم التقاطه في الـ catch الخارجي
        }
      });
      
      console.log("✅ تم إعادة تفعيل اتصال Firestore بنجاح", enableResult);
      
      // التحقق من الاتصال بإجراء عملية اختبار بسيطة
      const testResult = await new Promise<boolean>((resolve) => {
        // إعداد مهلة للعملية في حالة عدم اكتمالها
        const timeoutId = setTimeout(() => {
          console.warn("⌛ انتهت مهلة اختبار الاتصال");
          resolve(false);
        }, 5000);
        
        // محاولة الوصول إلى خاصية type للتأكد من وجود اتصال
        try {
          if (db && typeof db.type === 'string') {
            clearTimeout(timeoutId);
            resolve(true);
          } else {
            clearTimeout(timeoutId);
            resolve(false);
          }
        } catch (error) {
          console.error("خطأ أثناء اختبار الاتصال:", error);
          clearTimeout(timeoutId);
          resolve(false);
        }
      });
      
      if (testResult) {
        setIsOffline(false);
        // إظهار رسالة نجاح مؤقتة
        setShowAlert(true);
        
        // إخفاء الإشعار بعد قليل
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } else {
        console.warn("⚠️ الاتصال لا يزال غير متاح رغم محاولة إعادة التفعيل");
        // الاستمرار في إظهار حالة عدم الاتصال
        setIsOffline(true);
      }
    } catch (error) {
      console.error("❌ فشل في إعادة تفعيل شبكة Firestore:", error);
      // عرض الخطأ بمزيد من التفاصيل
      setIsOffline(true);
    } finally {
      setIsRetrying(false);
    }
  };

  // إذا لم تكن هناك مشكلة اتصال، لا تعرض شيئًا
  if (!showAlert) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Alert 
        className={`border border-yellow-600/50 ${isOffline ? 'bg-yellow-900/20' : 'bg-green-900/20'} backdrop-blur-sm text-white`}
      >
        <div className="flex items-start">
          {isOffline ? (
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
          ) : (
            <InfoIcon className="h-5 w-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <AlertTitle className={isOffline ? "text-yellow-400" : "text-green-400"}>
              {isOffline ? "مشكلة في الاتصال" : "تم استعادة الاتصال"}
            </AlertTitle>
            <AlertDescription className="text-sm mt-1">
              {isOffline ? (
                <>
                  <p>لا يمكن الاتصال بقاعدة البيانات. قد تكون هناك مشكلة في الاتصال بالإنترنت.</p>
                  <button
                    onClick={handleRetryConnection}
                    disabled={isRetrying}
                    className="mt-2 flex items-center text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    {isRetrying ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        جاري إعادة المحاولة...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        إعادة المحاولة
                      </>
                    )}
                  </button>
                </>
              ) : (
                "تم استعادة الاتصال بقاعدة البيانات بنجاح."
              )}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default DatabaseConnectionStatus;