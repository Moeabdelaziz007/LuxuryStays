import React, { ReactNode, useEffect, useState } from 'react';
import { useFirestoreStatus } from '@/contexts/FirestoreStatusContext';
import { AlertCircle, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FirestoreErrorHandlerProps {
  children: ReactNode;
  fallback?: ReactNode;
  retry?: () => void;
}

/**
 * مكون للتعامل مع أخطاء الاتصال بـ Firestore
 * يعرض حالة مناسبة عندما يكون الاتصال بـ Firestore معطلاً
 * 
 * ملاحظة: يختلف هذا المكون عن DatabaseErrorBoundary في أنه:
 * 1. يكشف عن أخطاء الاتصال من خلال FirestoreStatusContext
 * 2. يظهر رسائل خطأ مخصصة لمشاكل الاتصال بـ Firestore
 * 3. لا يعترض أخطاء التشغيل العامة مثل DatabaseErrorBoundary
 */
const FirestoreErrorHandler: React.FC<FirestoreErrorHandlerProps> = ({
  children,
  fallback,
  retry
}) => {
  const { isConnected, error, lastUpdated } = useFirestoreStatus();
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);

  // عرض إشعار عند إعادة الاتصال بـ Firestore
  useEffect(() => {
    if (isConnected && retryCount > 0) {
      toast({
        title: 'تم إعادة الاتصال',
        description: 'تم استعادة الاتصال بقاعدة البيانات بنجاح.',
        variant: 'default',
      });
    }
  }, [isConnected, retryCount, toast]);

  // التعامل مع إعادة محاولة الاتصال
  const handleRetry = () => {
    setRetryCount(count => count + 1);
    
    if (retry) {
      retry();
    } else {
      // محاولة إعادة تحميل الصفحة أو إعادة الاتصال
      window.location.reload();
    }
  };

  // إذا كان متصلاً، عرض المحتوى العادي
  if (isConnected) {
    return <>{children}</>;
  }

  // إذا كان هناك واجهة بديلة مخصصة، استخدمها
  if (fallback) {
    return <>{fallback}</>;
  }

  // عرض واجهة خطأ الاتصال الافتراضية
  return (
    <Card className="shadow-lg border-yellow-200 bg-yellow-50 dark:bg-yellow-950/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-yellow-600 dark:text-yellow-400">
          <WifiOff className="h-5 w-5 mr-2" />
          خطأ في الاتصال بقاعدة البيانات
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-700 dark:text-gray-300">
        <p>
          لا يمكن الاتصال بخدمة Firestore حاليًا. قد تكون هناك مشكلة في الشبكة أو أن الخدمة غير متاحة مؤقتًا.
        </p>
        {error && (
          <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded text-xs text-yellow-800 dark:text-yellow-300">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">تفاصيل الخطأ:</p>
                <p className="mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        )}
        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-2">
            آخر اتصال ناجح: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRetry}
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          إعادة المحاولة
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FirestoreErrorHandler;