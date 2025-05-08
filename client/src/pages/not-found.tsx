import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLocation } from "wouter";

/**
 * صفحة الخطأ 404 - الصفحة غير موجودة
 * تعرض رسالة خطأ للمستخدم عندما لا يتم العثور على الصفحة المطلوبة
 */
export default function NotFound() {
  const { t, isRTL } = useLanguage();
  const [_, navigate] = useLocation();

  // الرجوع إلى الصفحة الرئيسية
  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4 border-gray-200 dark:border-gray-800">
        <CardContent className="pt-6">
          <div className={`flex mb-4 gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('system.notFound')}
            </h1>
          </div>

          <p className={`mt-4 text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('system.pageNotFoundMessage') || 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'}
          </p>

          <div className={`mt-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Button 
              onClick={handleBackToHome}
              variant="outline"
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Home className="h-4 w-4" />
              {t('system.backToHome')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
