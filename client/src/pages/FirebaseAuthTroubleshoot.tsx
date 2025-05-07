import React, { useState, useEffect } from "react";
import DomainHelper from "@/components/DomainHelper";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import TechBackground from "@/components/layout/TechBackground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleLoginRedirect from "@/components/GoogleLoginRedirect";

/**
 * صفحة لتشخيص وإصلاح مشاكل مصادقة Firebase
 */
export default function FirebaseAuthTroubleshoot() {
  const [currentOrigin, setCurrentOrigin] = useState<string>("");
  const [authorizedDomains, setAuthorizedDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // الحصول على النطاق الحالي
    setCurrentOrigin(window.location.origin);
    const hostname = window.location.hostname;

    // الحصول على قائمة النطاقات المصرح بها من Firebase
    fetchAuthorizedDomains();
  }, []);

  const fetchAuthorizedDomains = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=AIzaSyCziEw9ASclqaqTyPtZu1Rih1_1ad8nmgs`
      );
      const data = await response.json();

      if (data.authorizedDomains && Array.isArray(data.authorizedDomains)) {
        setAuthorizedDomains(data.authorizedDomains);
      } else {
        setError("فشل في الحصول على قائمة النطاقات المصرح بها");
      }
    } catch (err) {
      setError("حدث خطأ أثناء محاولة الحصول على معلومات التكوين");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isDomainAuthorized = () => {
    if (!currentOrigin) return false;
    const hostname = new URL(currentOrigin).hostname;
    return authorizedDomains.includes(hostname);
  };

  return (
    <TechBackground>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#39FF14] mb-6 text-center">
            تشخيص وإصلاح مشاكل مصادقة Firebase
          </h1>

          <Tabs defaultValue="diagnosis" className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900">
              <TabsTrigger value="diagnosis">تشخيص المشكلة</TabsTrigger>
              <TabsTrigger value="fix">الحل</TabsTrigger>
              <TabsTrigger value="test">اختبار الحل</TabsTrigger>
            </TabsList>

            <TabsContent value="diagnosis">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-[#39FF14]">
                    تشخيص مشكلة "النطاق غير مصرح به"
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-white text-lg font-medium">
                      النطاق الحالي:
                    </h3>
                    <div className="bg-black p-3 rounded-md">
                      <code className="text-[#39FF14]">
                        {currentOrigin}
                      </code>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white text-lg font-medium">
                      اسم النطاق:
                    </h3>
                    <div className="bg-black p-3 rounded-md">
                      <code className="text-[#39FF14]">
                        {currentOrigin
                          ? new URL(currentOrigin).hostname
                          : "جاري التحميل..."}
                      </code>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white text-lg font-medium">
                      النطاقات المصرح بها في Firebase:
                    </h3>
                    {loading ? (
                      <p className="text-gray-400">جاري التحميل...</p>
                    ) : error ? (
                      <p className="text-red-500">{error}</p>
                    ) : (
                      <ul className="bg-black p-3 rounded-md list-disc list-inside">
                        {authorizedDomains.map((domain) => (
                          <li
                            key={domain}
                            className={`${
                              currentOrigin &&
                              new URL(currentOrigin).hostname === domain
                                ? "text-green-500 font-bold"
                                : "text-gray-300"
                            }`}
                          >
                            {domain}
                            {currentOrigin &&
                              new URL(currentOrigin).hostname === domain && (
                                " ✓ (النطاق الحالي)"
                              )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="bg-gray-800 p-4 rounded-md">
                    <h3 className="text-white text-lg font-medium mb-2">
                      النتيجة:
                    </h3>
                    {loading ? (
                      <p className="text-gray-400">جاري التحقق...</p>
                    ) : (
                      <p
                        className={`${
                          isDomainAuthorized()
                            ? "text-green-500"
                            : "text-red-500"
                        } font-medium`}
                      >
                        {isDomainAuthorized()
                          ? "✓ النطاق الحالي مصرح به في Firebase!"
                          : "✗ النطاق الحالي غير مصرح به في Firebase!"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fix">
              <DomainHelper />
            </TabsContent>

            <TabsContent value="test">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-[#39FF14]">
                    اختبار تسجيل الدخول بعد إضافة النطاق
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-300">
                    بعد إضافة النطاق إلى قائمة النطاقات المصرح بها في Firebase،
                    يمكنك اختبار تسجيل الدخول باستخدام Google من هنا:
                  </p>

                  <div className="flex justify-center py-4">
                    <GoogleLoginRedirect
                      redirectPath="/dashboard/customer"
                      className="w-64"
                      buttonText="تسجيل الدخول باستخدام Google"
                    />
                  </div>

                  <div className="text-center mt-6">
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={fetchAuthorizedDomains}
                    >
                      تحديث حالة النطاق
                    </Button>
                    <Link href="/login">
                      <Button variant="default" className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90">
                        العودة إلى صفحة تسجيل الدخول
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TechBackground>
  );
}