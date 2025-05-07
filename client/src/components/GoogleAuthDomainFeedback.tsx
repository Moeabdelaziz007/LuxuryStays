import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogClose } from "@/components/ui/dialog";

/**
 * مكون يقدم تعليمات واضحة للمستخدم حول كيفية إضافة نطاق
 * إلى قائمة النطاقات المصرح بها في إعدادات Firebase
 */
export default function GoogleAuthDomainFeedback() {
  const currentDomain = window.location.host;

  return (
    <div className="space-y-4 max-w-lg">
      <div className="text-center mb-3">
        <svg 
          className="inline-block w-12 h-12 text-amber-500 mb-2" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 className="text-xl font-bold text-amber-500">تحذير: النطاق غير مصرح به</h2>
        <p className="text-gray-400 mt-2">
          النطاق الحالي <span className="font-mono bg-black/50 px-2 py-0.5 rounded border border-amber-900/50">{currentDomain}</span> غير مدرج في قائمة النطاقات المصرح بها في Firebase.
        </p>
      </div>

      <Card className="bg-black/50 border-amber-900/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-amber-400 text-md">كيفية إصلاح المشكلة:</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>انتقل إلى <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline hover:text-amber-300">Firebase Console</a></li>
            <li>اختر مشروعك</li>
            <li>انتقل إلى الإعدادات: Authentication {'>'} Settings</li>
            <li>قم بالتمرير لأسفل إلى قسم "Authorized domains"</li>
            <li>اضغط على "Add domain" وأضف: <code className="bg-black/60 px-2 py-0.5 rounded border border-amber-700/30">{currentDomain}</code></li>
          </ol>
        </CardContent>
      </Card>

      <div className="text-center pt-2">
        <DialogClose asChild>
          <Button 
            variant="outline" 
            className="text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-gray-300"
          >
            مفهوم، سأقوم بذلك لاحقاً
          </Button>
        </DialogClose>
      </div>
    </div>
  );
}