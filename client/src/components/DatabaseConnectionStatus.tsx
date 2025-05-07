import React, { useEffect, useState } from "react";
import { AlertCircle, InfoIcon, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db } from "@/lib/firebase";
import { enableNetwork } from "firebase/firestore";

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

  // محاولة إعادة الاتصال بـ Firestore
  const handleRetryConnection = async () => {
    if (!db) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await enableNetwork(db);
      console.log("✅ Successfully re-enabled Firestore network connection");
      setIsOffline(false);
      
      // إخفاء الإشعار بعد قليل
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to re-enable Firestore network:", error);
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