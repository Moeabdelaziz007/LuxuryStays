import React from 'react';
import GoogleLoginForm from './GoogleLoginForm';
import FallbackLoginButton from './FallbackLoginButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import GoogleAuthDomainAlert from './GoogleAuthDomainAlert';

interface CombinedLoginButtonsProps {
  redirectPath?: string;
  className?: string;
  showCard?: boolean;
  title?: string;
  description?: string;
}

/**
 * مكون يجمع بين طرق تسجيل الدخول المختلفة
 * يعرض خيار تسجيل الدخول بحساب Google مع خيار بديل للدخول كضيف
 */
export default function CombinedLoginButtons({
  redirectPath,
  className = '',
  showCard = true,
  title = 'تسجيل الدخول',
  description = 'اختر طريقة تسجيل الدخول المناسبة لك'
}: CombinedLoginButtonsProps) {
  
  const content = (
    <div className="space-y-4">
      <GoogleLoginForm 
        redirectPath={redirectPath} 
        buttonText="دخول بحساب Google" 
      />
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            أو
          </span>
        </div>
      </div>
      
      <FallbackLoginButton 
        redirectPath={redirectPath} 
        className="w-full"
      />
      
      {/* عرض تنبيه بشأن نطاق Google غير المعتمد */}
      <GoogleAuthDomainAlert />
    </div>
  );
  
  if (showCard) {
    return (
      <Card className={`${className} w-full max-w-md mx-auto shadow-lg border-muted animate-in fade-in-50 slide-in-from-bottom-10 duration-300`}>
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
  
  return <div className={className}>{content}</div>;
}