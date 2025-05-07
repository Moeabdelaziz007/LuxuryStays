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