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
  const [currentHostname, setCurrentHostname] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [copiedHostname, setCopiedHostname] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authorizedDomains, setAuthorizedDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAuthorizedDomains = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=AIzaSyCziEw9ASclqaqTyPtZu1Rih1_1ad8nmgs`
      );
      const data = await response.json();
      
      if (data.authorizedDomains && Array.isArray(data.authorizedDomains)) {
        setAuthorizedDomains(data.authorizedDomains);
        const isDomainAuthorized = data.authorizedDomains.includes(currentHostname);
        setIsAuthorized(isDomainAuthorized);
        setChecked(true);
        return isDomainAuthorized;
      }
      return false;
    } catch (error) {
      console.error("خطأ في التحقق من مجالات Firebase المصرح بها:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // الحصول على النطاق الحالي والاسم المضيف
    setCurrentDomain(window.location.origin);
    setCurrentHostname(window.location.hostname);
    
    // التحقق من حالة التصريح عند التحميل
    setTimeout(() => {
      fetchAuthorizedDomains();
    }, 500);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  
  const handleCopyHostname = () => {
    navigator.clipboard.writeText(currentHostname);
    setCopiedHostname(true);
    setTimeout(() => setCopiedHostname(false), 3000);
  };

  const checkAuthorization = () => {
    fetchAuthorizedDomains();
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
        {!isAuthorized && checked && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>خطأ النطاق غير مصرح به</AlertTitle>
            <AlertDescription>
              النطاق الحالي ({currentHostname}) غير مسجل في قائمة النطاقات المصرح بها في Firebase. يجب
              إضافته لتمكين تسجيل الدخول باستخدام Google.
            </AlertDescription>
          </Alert>
        )}

        {isAuthorized && checked && (
          <Alert>
            <CheckIcon className="h-4 w-4" />
            <AlertTitle>النطاق مصرح به</AlertTitle>
            <AlertDescription>
              النطاق الحالي ({currentHostname}) مسجل بالفعل في قائمة النطاقات المصرح بها في Firebase.
              يمكنك الآن استخدام تسجيل الدخول باستخدام Google.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <h3 className="font-medium text-white mb-2">العنوان الكامل (URL):</h3>
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
        </div>

        <div>
          <h3 className="font-medium text-white mb-2">اسم النطاق (Hostname):</h3>
          <div className="p-3 bg-gray-800 rounded-md flex items-center justify-between">
            <code className="text-sm text-gray-300">{currentHostname}</code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyHostname}
              className="ml-2"
            >
              {copiedHostname ? (
                <CheckIcon className="h-4 w-4 text-green-500" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-white">خطوات إضافة النطاق:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>افتح وحدة تحكم Firebase (https://console.firebase.google.com/)</li>
            <li>حدد مشروعك "staychill-3ed08"</li>
            <li>انتقل إلى "Authentication" في القائمة الجانبية</li>
            <li>اضغط على تبويب "Settings" ثم انتقل إلى قسم "Authorized domains"</li>
            <li>اضغط على "Add domain" وألصق اسم النطاق (Hostname) المنسوخ أعلاه</li>
            <li>اضغط على "Add"</li>
          </ol>
        </div>

        {checked && (
          <div className="mt-4">
            <h3 className="font-medium text-white mb-2">النطاقات المصرح بها حاليًا:</h3>
            <ul className="bg-gray-800 p-3 rounded-md list-inside space-y-1">
              {authorizedDomains.map(domain => (
                <li 
                  key={domain} 
                  className={`text-sm ${domain === currentHostname ? 'text-[#39FF14] font-medium' : 'text-gray-300'}`}
                >
                  {domain} {domain === currentHostname && '✓'}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
          onClick={checkAuthorization}
          disabled={loading}
        >
          {loading ? "جاري التحقق..." : "تحقق من حالة النطاق"}
        </Button>
      </CardFooter>
    </Card>
  );
}