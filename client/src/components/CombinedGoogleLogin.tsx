import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import GoogleLoginRedirect from './GoogleLoginRedirect';
import GoogleLoginPopup from './GoogleLoginPopup';
import DirectGoogleLogin from './DirectGoogleLogin';
import FallbackLoginButton from './FallbackLoginButton';

interface CombinedGoogleLoginProps {
  redirectPath?: string;
  className?: string;
  onLoginSuccess?: () => void;
  showCard?: boolean;
  title?: string;
  description?: string;
}

/**
 * مكون يجمع بين جميع طرق تسجيل الدخول مع Google
 * يتيح للمستخدم تجربة العديد من الخيارات في حالة فشل أحدها
 */
export default function CombinedGoogleLogin({
  redirectPath = '/customer',
  className = '',
  onLoginSuccess,
  showCard = true,
  title = 'تسجيل الدخول باستخدام Google',
  description = 'اختر إحدى طرق تسجيل الدخول مع Google أدناه:'
}: CombinedGoogleLoginProps) {
  const [selectedTab, setSelectedTab] = useState('direct');
  const { toast } = useToast();

  const content = (
    <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="direct">طريقة مباشرة</TabsTrigger>
        <TabsTrigger value="redirect">إعادة توجيه</TabsTrigger>
        <TabsTrigger value="popup">نافذة منبثقة</TabsTrigger>
      </TabsList>
      
      <TabsContent value="direct" className="space-y-4">
        <div className="text-sm text-gray-500 mb-3 dark:text-gray-400">
          هذه الطريقة تستخدم واجهة Google Sign-In مباشرة وهي الأكثر موثوقية.
        </div>
        <DirectGoogleLogin 
          redirectPath={redirectPath}
          onLoginSuccess={onLoginSuccess}
          buttonText="تسجيل الدخول مع Google"
        />
      </TabsContent>
      
      <TabsContent value="redirect" className="space-y-4">
        <div className="text-sm text-gray-500 mb-3 dark:text-gray-400">
          هذه الطريقة تستخدم إعادة التوجيه وقد تكون أفضل في بعض المتصفحات.
        </div>
        <GoogleLoginRedirect 
          redirectPath={redirectPath}
          onLoginSuccess={onLoginSuccess}
          buttonText="تسجيل الدخول مع إعادة التوجيه"
        />
      </TabsContent>
      
      <TabsContent value="popup" className="space-y-4">
        <div className="text-sm text-gray-500 mb-3 dark:text-gray-400">
          هذه الطريقة تستخدم نافذة منبثقة وتعمل في معظم المتصفحات الحديثة.
        </div>
        <GoogleLoginPopup 
          redirectPath={redirectPath}
          onLoginSuccess={onLoginSuccess}
          buttonText="تسجيل الدخول مع نافذة منبثقة"
        />
      </TabsContent>
      
      {/* خيار تسجيل الدخول كضيف */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 mb-3 dark:text-gray-400">
          إذا واجهت مشكلة في تسجيل الدخول مع Google، يمكنك:
        </div>
        <FallbackLoginButton 
          redirectPath={redirectPath}
          onSuccess={onLoginSuccess}
          buttonText="الدخول كضيف"
          variant="secondary"
        />
      </div>
    </Tabs>
  );

  // إذا كان showCard صحيحًا، سيتم عرض المحتوى داخل بطاقة
  if (showCard) {
    return (
      <Card className={`w-full max-w-md mx-auto ${className}`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    );
  }

  // وإلا، سيتم عرض المحتوى مباشرة
  return <div className={className}>{content}</div>;
}