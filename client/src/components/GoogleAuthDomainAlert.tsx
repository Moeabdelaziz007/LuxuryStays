import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';
import { getGoogleLoginInstructions, isCurrentDomainAuthorized } from '@/lib/DynamicFirebaseDomainHandler';

/**
 * مكوّن لعرض رسالة تحذير عندما يكون النطاق الحالي غير معتمد في Firebase
 * يوفر تعليمات للمستخدم لإضافة النطاق إلى إعدادات Firebase
 */
export default function GoogleAuthDomainAlert() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDomainAuthorized, setIsDomainAuthorized] = useState(true);
  const [wasChecked, setWasChecked] = useState(false);

  useEffect(() => {
    // تعيين الرسالة كمرئية عند التشغيل المبدئي
    setIsVisible(true);
    setWasChecked(true);
    setIsDomainAuthorized(false);
    
    // جلب قائمة النطاقات المعتمدة من localStorage إذا كانت متوفرة
    const storedDomains = localStorage.getItem('firebase_authorized_domains');
    
    if (storedDomains) {
      try {
        const domains = JSON.parse(storedDomains);
        const isAuthorized = isCurrentDomainAuthorized(domains);
        setIsDomainAuthorized(isAuthorized);
        
        if (!isAuthorized) {
          // التحقق إذا تم إغلاق التنبيه في هذه الجلسة
          const isDismissed = sessionStorage.getItem('google_auth_domain_alert_dismissed') === 'true';
          setIsVisible(!isDismissed);
        }
      } catch (e) {
        console.error('Error parsing stored domains:', e);
      }
    }
    
    // إضافة النطاق الحالي إلى localStorage على أي حال
    const currentDomain = window.location.hostname;
    if (currentDomain) {
      const domains = storedDomains ? JSON.parse(storedDomains) : [];
      if (!domains.includes(currentDomain)) {
        domains.push(currentDomain);
        localStorage.setItem('firebase_authorized_domains', JSON.stringify(domains));
      }
    }
  }, []);
  
  const dismissAlert = () => {
    setIsVisible(false);
    // حفظ حالة الإغلاق في هذه الجلسة فقط
    sessionStorage.setItem('google_auth_domain_alert_dismissed', 'true');
  };
  
  // لا نعرض التنبيه إذا كان النطاق معتمداً أو لم يتم التحقق منه بعد أو تم إغلاقه
  if (isDomainAuthorized || !wasChecked || !isVisible) {
    return null;
  }
  
  return (
    <Alert className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-50 bg-orange-900/90 border-orange-600 text-white shadow-lg backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <AlertTitle className="flex items-center">
            تسجيل الدخول بـ Google غير متاح في هذا النطاق
            <Button variant="ghost" size="icon" onClick={dismissAlert} className="ml-auto text-orange-300 hover:text-white hover:bg-orange-800">
              <X className="h-4 w-4" />
            </Button>
          </AlertTitle>
          
          <AlertDescription className="mt-2 text-orange-200">
            <p className="mb-2">النطاق الحالي غير معتمد في إعدادات Firebase. يمكنك استخدام طرق تسجيل الدخول الأخرى أو إضافة هذا النطاق يدويًا.</p>
            
            <div className="p-2 bg-orange-950/50 border border-orange-700/30 rounded-md mt-3 text-xs leading-relaxed">
              {getGoogleLoginInstructions().split('\n').map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
              ))}
            </div>
            
            <div className="mt-3">
              <Button 
                variant="destructive" 
                size="sm" 
                className="bg-orange-700 hover:bg-orange-600 text-white"
                onClick={() => window.open('https://console.firebase.google.com/project/_/authentication/providers', '_blank')}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" />
                فتح إعدادات Firebase
              </Button>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}