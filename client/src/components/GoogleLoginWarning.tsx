import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GoogleAuthDomainFeedback from './GoogleAuthDomainFeedback';

export default function GoogleLoginWarning() {
  // استخدام النطاق المخزن في localStorage إذا كان موجودًا، وإلا استخدام النطاق الحالي
  const savedDomain = localStorage.getItem('currentAuthDomain');
  const currentDomain = savedDomain || window.location.host;
  
  const handleCopyDomain = () => {
    navigator.clipboard.writeText(currentDomain);
    alert('تم نسخ النطاق إلى الحافظة!');
  };
  
  return (
    <Card className="mx-auto max-w-lg bg-black/80 border-amber-800/50 text-white backdrop-blur-sm">
      <CardHeader className="bg-amber-900/30 border-b border-amber-800/20">
        <CardTitle className="flex items-center gap-2 text-amber-300">
          <AlertCircle className="h-5 w-5" />
          تسجيل الدخول باستخدام Google غير متاح
        </CardTitle>
        <CardDescription className="text-gray-300">
          النطاق الحالي غير مضاف إلى قائمة النطاقات المصرح بها في Firebase
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <GoogleAuthDomainFeedback />
      </CardContent>
      <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
        <Button 
          variant="outline"
          className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-white"
          onClick={handleCopyDomain}
        >
          <Copy className="h-4 w-4 mr-2" />
          نسخ النطاق
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => window.open('https://console.firebase.google.com/project/_/authentication/settings/authorized-domains', '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          فتح إعدادات Firebase
        </Button>
      </CardFooter>
    </Card>
  );
}