import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import GoogleAuthDomainFeedback from './GoogleAuthDomainFeedback';

/**
 * مكوّن لعرض رسالة تحذير عندما يكون النطاق الحالي غير معتمد في Firebase
 * يوفر تعليمات للمستخدم لإضافة النطاق إلى إعدادات Firebase
 */
export default function GoogleAuthDomainAlert() {
  const [showDetails, setShowDetails] = React.useState(false);
  const currentDomain = window.location.hostname;
  
  return (
    <>
      <Alert variant="destructive" className="bg-black border-amber-500/50 text-white shadow-lg">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <AlertTitle className="text-amber-400 mb-1">تعذر تسجيل الدخول باستخدام Google</AlertTitle>
        <AlertDescription className="text-gray-300">
          <p className="mb-2">
            النطاق الحالي <span className="font-mono bg-black/60 px-1.5 py-0.5 rounded text-amber-400">{currentDomain}</span> غير مضاف إلى قائمة النطاقات المصرح بها في Firebase.
          </p>
          <Button 
            onClick={() => setShowDetails(true)} 
            variant="outline" 
            className="mt-1 bg-black/60 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
          >
            عرض التعليمات
          </Button>
        </AlertDescription>
      </Alert>
      
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-black/90 border-amber-800/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-amber-400 text-xl">إضافة النطاق إلى Firebase</DialogTitle>
            <DialogDescription className="text-gray-300">
              اتبع هذه الخطوات لإضافة النطاق الحالي إلى قائمة النطاقات المصرح بها
            </DialogDescription>
          </DialogHeader>
          
          <GoogleAuthDomainFeedback />
        </DialogContent>
      </Dialog>
    </>
  );
}