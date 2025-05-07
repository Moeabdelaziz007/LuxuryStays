import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * مكوّن يقدم تعليمات واضحة للمستخدم حول كيفية إضافة نطاق
 * إلى قائمة النطاقات المصرح بها في إعدادات Firebase
 */
export default function GoogleAuthDomainFeedback() {
  const currentDomain = window.location.hostname;
  
  return (
    <div className="bg-black/60 border border-amber-600/30 rounded-lg p-5 text-white backdrop-blur-md">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-bold text-amber-400 mb-2">
            نطاق غير مصرح به في Firebase Authentication
          </h3>
          
          <p className="mb-3 text-gray-300">
            النطاق الحالي <span className="font-mono bg-black/50 px-1.5 py-0.5 rounded border border-gray-700/50 text-amber-400">{currentDomain}</span> غير مُضاف إلى قائمة النطاقات المصرح بها في إعدادات Firebase.
          </p>
          
          <div className="bg-black/40 rounded p-3 border border-gray-700/50 mb-3">
            <h4 className="text-sm font-bold text-white mb-2">لإصلاح هذه المشكلة:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>اذهب إلى <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">لوحة تحكم Firebase</a></li>
              <li>اختر مشروعك <span className="font-mono text-gray-400">staychill-3ed08</span></li>
              <li>انتقل إلى <span className="text-gray-400">Authentication</span> من القائمة الجانبية</li>
              <li>اضغط على <span className="text-gray-400">Settings</span> ثم <span className="text-gray-400">Authorized domains</span></li>
              <li>اضغط على <span className="text-gray-400">Add domain</span> وأضف: <span className="font-mono bg-black/60 px-1.5 py-0.5 rounded text-amber-400">
                {currentDomain}
              </span></li>
              <li>بعد الإضافة، قم بتحديث الصفحة وحاول تسجيل الدخول مرة أخرى</li>
            </ol>
          </div>
          
          <div className="text-xs text-gray-500">
            ملاحظة: يجب إضافة كل نطاق يستخدم فيه التطبيق إلى قائمة النطاقات المصرح بها في Firebase. هذا إجراء أمني مطلوب.
          </div>
        </div>
      </div>
    </div>
  );
}