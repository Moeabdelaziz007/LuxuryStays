import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CopyIcon, CheckIcon, AlertCircleIcon } from "lucide-react";

/**
 * مكون يساعد المستخدم على إضافة النطاق الحالي إلى إعدادات Firebase
 */
export default function DomainHelper() {
  const [currentDomain, setCurrentDomain] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // الحصول على النطاق الحالي
    setCurrentDomain(window.location.origin);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const checkAuthorization = async () => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=AIzaSyCziEw9ASclqaqTyPtZu1Rih1_1ad8nmgs`
      );
      const data = await response.json();
      
      if (data.authorizedDomains && Array.isArray(data.authorizedDomains)) {
        const isDomainAuthorized = data.authorizedDomains.includes(
          new URL(currentDomain).hostname
        );
        setChecked(true);
        return isDomainAuthorized;
      }
      return false;
    } catch (error) {
      console.error("خطأ في التحقق من مجالات Firebase المصرح بها:", error);
      return false;
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-900 border-gray-800 shadow-[0_0_15px_rgba(57,255,20,0.3)]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-[#39FF14]">
          مساعد النطاق المصرح به
        </CardTitle>
        <CardDescription>
          أضف النطاق الحالي إلى قائمة النطاقات المصرح بها في Firebase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>خطأ النطاق غير مصرح به</AlertTitle>
          <AlertDescription>
            النطاق الحالي غير مسجل في قائمة النطاقات المصرح بها في Firebase. يجب
            إضافته لتمكين تسجيل الدخول باستخدام Google.
          </AlertDescription>
        </Alert>

        <div className="p-3 bg-gray-800 rounded-md flex items-center justify-between">
          <code className="text-sm text-gray-300">{currentDomain}</code>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="ml-2"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-white">خطوات إضافة النطاق:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>افتح وحدة تحكم Firebase (https://console.firebase.google.com/)</li>
            <li>حدد مشروعك "staychill-3ed08"</li>
            <li>انتقل إلى "Authentication" في القائمة الجانبية</li>
            <li>اضغط على تبويب "Settings" ثم انتقل إلى قسم "Authorized domains"</li>
            <li>اضغط على "Add domain" وألصق النطاق المنسوخ أعلاه</li>
            <li>اضغط على "Add"</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
          onClick={checkAuthorization}
        >
          تحقق من حالة النطاق
        </Button>
      </CardFooter>
    </Card>
  );
}