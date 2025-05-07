import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RotateCcw } from 'lucide-react';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';

/**
 * مكوّن يعرض حالة الاتصال بقاعدة البيانات للمستخدم مع إمكانية إعادة المحاولة
 */
export default function DatabaseConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [firestoreAvailable, setFirestoreAvailable] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  // مراقبة حالة الاتصال بالإنترنت
  useEffect(() => {
    function updateOnlineStatus() {
      setIsOnline(navigator.onLine);
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);
  
  // التحقق من حالة الاتصال بـ Firestore عند تغير حالة الإنترنت
  useEffect(() => {
    let isFirestoreError = false;
    
    // إذا كان هناك رسالة خطأ تشير إلى مشكلة في Firestore
    if (typeof window !== 'undefined') {
      isFirestoreError = window.sessionStorage.getItem('firestoreError') === 'true';
      const errorMessage = window.sessionStorage.getItem('firestoreErrorDetails');
      
      if (errorMessage) {
        setErrorDetails(errorMessage);
      }
    }
    
    if (!isOnline || isFirestoreError) {
      setFirestoreAvailable(false);
      setShowAlert(true);
    } else {
      setFirestoreAvailable(true);
      setShowAlert(false);
    }
  }, [isOnline]);
  
  // وظيفة لمعالجة فقدان الاتصال بـ Firestore
  const handleFirestoreError = (error: any) => {
    console.error("Error accessing Firestore:", error);
    setFirestoreAvailable(false);
    setShowAlert(true);
    setErrorDetails(error.code || "unknown");
    
    // حفظ حالة الخطأ في الجلسة للتحقق منها لاحقًا
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('firestoreError', 'true');
      window.sessionStorage.setItem('firestoreErrorDetails', error.code || "unknown");
    }
  };
  
  // وظيفة لإعادة المحاولة والاتصال بـ Firestore
  const retryConnection = async () => {
    setRetrying(true);
    
    try {
      const db = getFirestore();
      
      // إعادة تمكين الشبكة لـ Firestore
      await disableNetwork(db); // إيقاف الشبكة أولاً
      await new Promise(resolve => setTimeout(resolve, 1000)); // انتظار لحظة
      await enableNetwork(db); // إعادة تشغيل الشبكة
      
      // مسح حالة الخطأ
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('firestoreError');
        window.sessionStorage.removeItem('firestoreErrorDetails');
      }
      
      setFirestoreAvailable(true);
      setShowAlert(false);
      setErrorDetails(null);
      console.log("Firestore network enabled");
    } catch (error) {
      console.error("Failed to reconnect to Firestore:", error);
      handleFirestoreError(error);
    } finally {
      setRetrying(false);
    }
  };
  
  if (!showAlert) return null;
  
  return (
    <Alert 
      className="fixed top-20 left-4 right-4 max-w-md mx-auto z-50 bg-yellow-900/90 border-yellow-600 text-white shadow-lg shadow-yellow-900/20 backdrop-blur-sm"
      role="alert"
    >
      <div className="flex items-start space-x-4 rtl:space-x-reverse">
        <div className="p-2 bg-yellow-700 rounded-full">
          {isOnline ? <Wifi className="h-4 w-4 text-white" /> : <WifiOff className="h-4 w-4 text-white" />}
        </div>
        
        <div className="flex-1">
          <AlertTitle className="text-yellow-200 text-lg font-bold">
            {!isOnline 
              ? "أنت غير متصل بالإنترنت"
              : "مشكلة في الاتصال بقاعدة البيانات"}
          </AlertTitle>
          
          <AlertDescription className="text-yellow-100 mt-1">
            {!isOnline 
              ? "يرجى التحقق من اتصالك بالإنترنت وإعادة المحاولة."
              : "هناك مشكلة في الاتصال بقاعدة البيانات. ستعمل بعض الميزات في وضع عدم الاتصال."}
              
            {errorDetails && (
              <div className="mt-2 text-xs bg-yellow-950/50 p-2 rounded border border-yellow-700/50">
                رمز الخطأ: {errorDetails}
              </div>
            )}
          </AlertDescription>
          
          <div className="mt-4">
            <Button 
              size="sm" 
              variant="outline"
              disabled={retrying || !isOnline}
              onClick={retryConnection}
              className="bg-yellow-800 hover:bg-yellow-700 text-white border-yellow-700"
            >
              {retrying && <RotateCcw className="h-3 w-3 mr-2 animate-spin" />}
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    </Alert>
  );
}