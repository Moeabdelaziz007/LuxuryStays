import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'wouter';
import AutomatedUITester from '@/tests/automated/AutomatedUITester';
import PerformanceMonitor from '@/tests/automated/PerformanceMonitor';

/**
 * صفحة الاختبارات الآلية ومراقبة الأداء
 * تعرض أدوات لاختبار واجهة المستخدم ومراقبة الأداء بشكل آلي
 */
export default function AutomatedTestingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">الاختبارات الآلية ومراقبة الأداء</h1>
          <p className="text-gray-400">
            أدوات متقدمة لقياس واختبار أداء التطبيق ومراقبة جودة واجهة المستخدم بشكل آلي ومستمر
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/testing-tools">
            <div>
              <Button variant="outline">
                أدوات الاختبار الأخرى
              </Button>
            </div>
          </Link>
          <Link href="/">
            <div>
              <Button>
                العودة إلى الصفحة الرئيسية
              </Button>
            </div>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="performance-monitor" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="performance-monitor">
            مراقبة الأداء
          </TabsTrigger>
          <TabsTrigger value="automated-testing">
            الاختبارات الآلية
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance-monitor" className="space-y-6">
          <PerformanceMonitor />
          
          <div className="p-6 bg-black/20 rounded-lg border border-gray-800 mt-6">
            <h2 className="text-xl font-semibold text-[#39FF14] mb-4">نصائح لتحسين الأداء</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">1. تقليل الحمل على JavaScript</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>تجنب معالجة البيانات الكبيرة في الـ main thread</li>
                  <li>استخدم Web Workers للعمليات المعقدة في الخلفية</li>
                  <li>تأكد من التخلص من event listeners غير المستخدمة</li>
                  <li>قم بتقسيم الكود إلى أجزاء صغيرة وتحميلها عند الحاجة فقط</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">2. تحسين العرض المرئي</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>استخدم will-change بحكمة مع العناصر المتحركة بشكل متكرر</li>
                  <li>تجنب التحريك المتزامن للعديد من العناصر</li>
                  <li>استخدم transform و opacity بدلاً من خصائص أخرى</li>
                  <li>تقليل تعقيد CSS selectors</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">3. تحسين تحميل الموارد</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>ضغط وتصغير ملفات JavaScript و CSS</li>
                  <li>تحميل الصور بأحجام مناسبة واستخدام التنسيقات الحديثة مثل WebP</li>
                  <li>استخدام تقنيات التحميل الكسول للصور والمكونات</li>
                  <li>تطبيق استراتيجيات التخزين المؤقت المناسبة</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="automated-testing" className="space-y-6">
          <AutomatedUITester />
          
          <div className="p-6 bg-black/20 rounded-lg border border-gray-800 mt-6">
            <h2 className="text-xl font-semibold text-[#39FF14] mb-4">نصائح لتحسين جودة واجهة المستخدم</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">1. إمكانية الوصول</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>تأكد من وصول التباين بين النص والخلفية إلى نسبة 4.5:1 على الأقل</li>
                  <li>استخدم سمات ARIA بشكل صحيح لمساعدة قارئات الشاشة</li>
                  <li>تأكد من إمكانية استخدام جميع وظائف التطبيق باستخدام لوحة المفاتيح فقط</li>
                  <li>أضف نصوص بديلة وصفية لجميع الصور</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">2. التصميم المتجاوب</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>اختبر واجهة المستخدم على مجموعة متنوعة من أحجام الشاشات والأجهزة</li>
                  <li>تأكد من أن عناصر اللمس لا تقل عن 44×44 بكسل على الأجهزة المحمولة</li>
                  <li>استخدم وحدات نسبية (rem و em و %) بدلاً من البكسل</li>
                  <li>تجنب التمرير الأفقي على الأجهزة المحمولة</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-2">3. التحقق من النماذج والإدخال</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>قدم تعليمات واضحة للمستخدمين حول متطلبات الإدخال</li>
                  <li>اعرض رسائل خطأ محددة وواضحة بالقرب من حقول الإدخال المعنية</li>
                  <li>تحقق من صحة البيانات على جانب العميل قبل الإرسال</li>
                  <li>حافظ على البيانات التي أدخلها المستخدم عند حدوث خطأ</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}