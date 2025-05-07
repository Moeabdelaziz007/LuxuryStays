import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase-client';
import { onSnapshotsInSync, disableNetwork, enableNetwork } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';

/**
 * مكون للتعامل مع أخطاء الاتصال بـ Firestore وعرض حالة الاتصال للمستخدم
 * يقدم واجهة مستخدم لإدارة مشاكل الاتصال وإعادة المحاولة
 */
export default function FirestoreErrorHandler() {
  const [online, setOnline] = useState(window.navigator.onLine);
  const [firestoreConnected, setFirestoreConnected] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  // مراقبة حالة الاتصال بالإنترنت
  useEffect(() => {
    function updateOnlineStatus() {
      const isOnline = window.navigator.onLine;
      setOnline(isOnline);
      
      // إذا عاد الاتصال، حاول إعادة تمكين الشبكة تلقائيًا
      if (isOnline && offlineMode) {
        handleRetryConnection();
      }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [offlineMode]);

  // مراقبة حالة الاتصال بـ Firestore
  useEffect(() => {
    const unsubscribe = onSnapshotsInSync(db, () => {
      setFirestoreConnected(true);
    });

    return () => unsubscribe();
  }, []);

  // إعادة محاولة الاتصال
  const handleRetryConnection = async () => {
    try {
      setIsRetrying(true);
      await enableNetwork(db);
      setOfflineMode(false);
      setFirestoreConnected(true);
      console.log("تم إعادة الاتصال بنجاح!");
    } catch (error) {
      console.error("فشلت إعادة الاتصال:", error);
      setFirestoreConnected(false);
    } finally {
      setIsRetrying(false);
    }
  };

  // تمكين وضع عدم الاتصال
  const handleEnableOfflineMode = async () => {
    try {
      await disableNetwork(db);
      setOfflineMode(true);
      console.log("تم تمكين وضع عدم الاتصال");
    } catch (error) {
      console.error("فشل تمكين وضع عدم الاتصال:", error);
    }
  };

  // إذا كان كل شيء يعمل بشكل صحيح، لا تعرض أي شيء
  if (online && firestoreConnected && !offlineMode) {
    return null;
  }

  return (
    <Alert variant={online ? "default" : "destructive"} className="border-2 mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-bold">
        {!online 
          ? "أنت غير متصل بالإنترنت"
          : !firestoreConnected
          ? "مشكلة في الاتصال بقاعدة البيانات"
          : "وضع عدم الاتصال نشط"}
      </AlertTitle>
      <AlertDescription className="mt-2">
        {!online ? (
          <p>لا يمكن الاتصال بالإنترنت. بعض الميزات قد تكون محدودة.</p>
        ) : !firestoreConnected ? (
          <p>هناك مشكلة في الاتصال بخدمة البيانات. يمكنك المحاولة مرة أخرى أو استخدام الوضع غير المتصل.</p>
        ) : (
          <p>تعمل حاليًا في وضع عدم الاتصال. البيانات السابقة متاحة ولكن التغييرات الجديدة ستتم مزامنتها عند إعادة الاتصال.</p>
        )}
        
        <div className="flex gap-2 mt-4">
          {online && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetryConnection}
              disabled={isRetrying}
              className="flex items-center gap-1"
            >
              {isRetrying ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Wifi className="h-4 w-4" />
              )}
              {isRetrying ? "جاري المحاولة..." : "إعادة الاتصال"}
            </Button>
          )}
          
          {online && !offlineMode && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEnableOfflineMode}
              className="flex items-center gap-1"
            >
              <WifiOff className="h-4 w-4" />
              وضع عدم الاتصال
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}