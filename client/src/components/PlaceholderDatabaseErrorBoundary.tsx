import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * مكون لاعتراض أخطاء قاعدة البيانات في التطبيق
 * يعرض واجهة مستخدم بديلة عندما تفشل عمليات قاعدة البيانات
 */
class DatabaseErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  // اعتراض الخطأ وتخزينه في حالة المكون
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  // تنفيذ ردود الفعل على الخطأ مثل التسجيل أو الإبلاغ عن الأخطاء
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('خطأ في الوصول إلى قاعدة البيانات:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  // إعادة تعيين حالة الخطأ لمحاولة عرض المكون مرة أخرى
  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  // تحديد ما إذا كان الخطأ متعلقًا بقاعدة البيانات
  isDatabaseError = (error: Error): boolean => {
    // فحص إذا كان الخطأ متعلقًا بـ Firestore
    const errorMessage = error.message.toLowerCase();
    return (
      errorMessage.includes('firestore') ||
      errorMessage.includes('firebase') ||
      errorMessage.includes('database') ||
      errorMessage.includes('offline') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('document') ||
      errorMessage.includes('collection')
    );
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    // إذا كان هناك خطأ، عرض الواجهة البديلة
    if (hasError) {
      // إذا كان هناك واجهة بديلة مخصصة، استخدمها
      if (fallback) {
        return fallback;
      }

      // إذا كان خطأ قاعدة البيانات، عرض واجهة خطأ قاعدة البيانات
      if (error && this.isDatabaseError(error)) {
        return (
          <Card className="shadow-lg border-red-200 bg-red-50 dark:bg-red-950/10">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                خطأ في الوصول إلى البيانات
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-700 dark:text-gray-300">
              <p>حدث خطأ أثناء محاولة الوصول إلى البيانات. قد تكون هناك مشكلة في الاتصال بقاعدة البيانات.</p>
              <p className="text-xs text-gray-500 mt-2">{error.message}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={this.handleRetry}
                className="flex items-center gap-1 mt-2"
              >
                <RefreshCw className="h-4 w-4" />
                إعادة المحاولة
              </Button>
            </CardFooter>
          </Card>
        );
      }

      // واجهة الخطأ العامة للأخطاء الأخرى
      return (
        <div className="rounded-md bg-red-50 p-4 dark:bg-red-950/10">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">حدث خطأ</h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                <p>حدث خطأ غير متوقع. يرجى إعادة المحاولة.</p>
              </div>
              <div className="mt-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={this.handleRetry}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // إذا لم يكن هناك خطأ، عرض المحتوى العادي
    return children;
  }
}

export default DatabaseErrorBoundary;