import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getGoogleLoginInstructions } from "@/lib/DynamicFirebaseDomainHandler";
import { AlertCircle, Copy, Check } from "lucide-react";

/**
 * مكوّن لعرض رسالة تحذير عندما يكون النطاق الحالي غير معتمد في Firebase
 * يوفر تعليمات للمستخدم لإضافة النطاق إلى إعدادات Firebase
 */
export default function GoogleAuthDomainAlert() {
  const [copied, setCopied] = useState(false);
  const currentDomain = window.location.hostname;

  // نسخ النطاق الحالي إلى الحافظة
  const copyDomain = () => {
    navigator.clipboard.writeText(currentDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // إعادة تعيين حالة النسخ عند تغير النطاق
  useEffect(() => {
    setCopied(false);
  }, [currentDomain]);

  return (
    <Alert className="bg-yellow-900/20 border-yellow-600/50 backdrop-blur-sm my-4">
      <AlertCircle className="h-5 w-5 text-yellow-400" />
      <AlertTitle className="text-yellow-400 font-bold text-lg">
        تنبيه: النطاق غير معتمد لتسجيل الدخول باستخدام Google
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-white mb-4">
          النطاق الحالي <span className="font-mono bg-black/30 px-2 py-1 rounded border border-yellow-600/30">{currentDomain}</span> غير مسجل في إعدادات المصادقة في Firebase.
        </p>
        
        <div className="bg-black/40 rounded-lg p-4 border border-yellow-600/30 my-4">
          <h4 className="font-semibold text-white mb-2">يرجى إضافة النطاق في لوحة تحكم Firebase:</h4>
          <ol className="list-decimal list-inside space-y-1 text-gray-300 mb-4">
            <li>انتقل إلى <a href="https://console.firebase.google.com/" className="text-yellow-400 hover:underline" target="_blank" rel="noopener noreferrer">لوحة تحكم Firebase</a></li>
            <li>اختر المشروع <span className="font-mono bg-black/30 px-1 rounded">stay-chill-e3743</span></li>
            <li>انتقل إلى المصادقة Authentication</li>
            <li>اختر تبويب "إعدادات"</li>
            <li>في قسم "المجالات المسموح بها"، أضف النطاق المذكور أعلاه</li>
            <li>انقر على "إضافة"</li>
          </ol>
          
          <div className="flex">
            <Button
              className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold flex items-center gap-2"
              onClick={copyDomain}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "تم النسخ!" : "نسخ النطاق"}
            </Button>
          </div>
        </div>
        
        <p className="text-gray-300 text-sm">
          بعد الإضافة، قم بإعادة تحميل الصفحة ومحاولة تسجيل الدخول باستخدام Google مجددًا.
        </p>
      </AlertDescription>
    </Alert>
  );
}