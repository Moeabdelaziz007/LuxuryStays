import React from 'react';
import ResponsivePreview from '@/components/testing/ResponsivePreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { usePerformanceMode, PerformanceMode } from '@/hooks/use-performance-mode';

/**
 * صفحة أدوات الاختبار واستجابة واجهة المستخدم
 * تعرض أدوات مختلفة لاختبار واجهة المستخدم والتوافق
 */
export default function TestingToolsPage() {
  const [performanceSettings, setPerformanceMode] = usePerformanceMode();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              أدوات اختبار واجهة المستخدم
            </h1>
            <p className="text-gray-400">
              أدوات للتحقق من استجابة واجهة المستخدم ومراقبة الأداء عبر الأجهزة المختلفة
            </p>
          </div>
          <Link href="/">
            <div>
              <Button>العودة إلى الصفحة الرئيسية</Button>
            </div>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="responsive" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="responsive">
            استجابة الواجهة
          </TabsTrigger>
          <TabsTrigger value="performance">
            الأداء
          </TabsTrigger>
          <TabsTrigger value="accessibility">
            سهولة الوصول
          </TabsTrigger>
        </TabsList>

        <TabsContent value="responsive" className="space-y-8">
          <ResponsivePreview initialPath="/" />
          
          <Card>
            <CardHeader>
              <CardTitle>إرشادات الاستجابة</CardTitle>
              <CardDescription>
                تأكد من اختبار هذه النقاط المهمة للتوافق مع الأجهزة المحمولة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside text-gray-300">
                <li>
                  مناطق اللمس: تأكد أن جميع عناصر اللمس (الأزرار، الروابط) لا تقل عن 48×48 بكسل
                </li>
                <li>
                  التدفق: تأكد أن المحتوى ينساب بشكل صحيح على الهواتف المحمولة (لا حاجة لتمرير أفقي)
                </li>
                <li>
                  النصوص: تأكد أن النصوص مقروءة على الهواتف المحمولة (حجم الخط لا يقل عن 14px)
                </li>
                <li>
                  المسافات: احرص على وجود مسافات كافية بين العناصر القابلة للنقر لتجنب النقرات الخاطئة
                </li>
                <li>
                  الصور: تأكد أن الصور تستجيب بشكل صحيح وتتناسب مع أحجام الشاشات المختلفة
                </li>
                <li>
                  الجداول: تأكد أن الجداول تظهر بشكل صحيح أو لديها بديل ملائم للأجهزة المحمولة
                </li>
                <li>
                  أشرطة التمرير: تجنب أشرطة التمرير الأفقية وتأكد أن التمرير الرأسي سلس
                </li>
                <li>
                  القوائم: تأكد أن قوائم التنقل تعمل بشكل جيد على الأجهزة المحمولة
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الأداء</CardTitle>
              <CardDescription>
                ضبط مستوى التأثيرات البصرية لمختلف أنواع الأجهزة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <Button
                    onClick={() => setPerformanceMode(PerformanceMode.HIGH)}
                    variant={performanceSettings.mode === PerformanceMode.HIGH ? 'default' : 'outline'}
                    className={performanceSettings.mode === PerformanceMode.HIGH 
                      ? "bg-[#39FF14]/20 hover:bg-[#39FF14]/30 text-[#39FF14] border-[#39FF14]/50" 
                      : ""}
                  >
                    عالي (كل التأثيرات)
                  </Button>
                  <Button
                    onClick={() => setPerformanceMode(PerformanceMode.MEDIUM)}
                    variant={performanceSettings.mode === PerformanceMode.MEDIUM ? 'default' : 'outline'}
                    className={performanceSettings.mode === PerformanceMode.MEDIUM 
                      ? "bg-[#39FF14]/20 hover:bg-[#39FF14]/30 text-[#39FF14] border-[#39FF14]/50" 
                      : ""}
                  >
                    متوسط
                  </Button>
                  <Button
                    onClick={() => setPerformanceMode(PerformanceMode.LOW)}
                    variant={performanceSettings.mode === PerformanceMode.LOW ? 'default' : 'outline'}
                    className={performanceSettings.mode === PerformanceMode.LOW 
                      ? "bg-[#39FF14]/20 hover:bg-[#39FF14]/30 text-[#39FF14] border-[#39FF14]/50" 
                      : ""}
                  >
                    منخفض
                  </Button>
                  <Button
                    onClick={() => setPerformanceMode(PerformanceMode.BATTERY)}
                    variant={performanceSettings.mode === PerformanceMode.BATTERY ? 'default' : 'outline'}
                    className={performanceSettings.mode === PerformanceMode.BATTERY 
                      ? "bg-[#39FF14]/20 hover:bg-[#39FF14]/30 text-[#39FF14] border-[#39FF14]/50" 
                      : ""}
                  >
                    توفير البطارية
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 p-4 rounded-md">
                  <div>
                    <h3 className="text-[#39FF14] font-medium mb-2">الإعدادات النشطة حاليًا:</h3>
                    <ul className="space-y-1 text-gray-300">
                      <li className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${performanceSettings.useParticles ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        جزيئات الخلفية: {performanceSettings.useParticles ? 'مفعلة' : 'معطلة'}
                      </li>
                      <li className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${performanceSettings.useComplexShadows ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        الظلال المعقدة: {performanceSettings.useComplexShadows ? 'مفعلة' : 'معطلة'}
                      </li>
                      <li className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${performanceSettings.useHologramEffects ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        تأثيرات الهولوغرام: {performanceSettings.useHologramEffects ? 'مفعلة' : 'معطلة'}
                      </li>
                      <li className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${performanceSettings.useHeavyAnimations ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        الرسوم المتحركة المعقدة: {performanceSettings.useHeavyAnimations ? 'مفعلة' : 'معطلة'}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-1 text-gray-300 mt-8">
                      <li className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${performanceSettings.useBackgroundEffects ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        تأثيرات الخلفية: {performanceSettings.useBackgroundEffects ? 'مفعلة' : 'معطلة'}
                      </li>
                      <li className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${performanceSettings.useGlowing ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        تأثيرات التوهج: {performanceSettings.useGlowing ? 'مفعلة' : 'معطلة'}
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2 bg-blue-500"></div>
                        مستوى تأثيرات الانتقال: {performanceSettings.transitionLevel}/3
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-400">
                استخدم الوضع المنخفض أو وضع توفير البطارية للأجهزة ذات الأداء المنخفض أو الأجهزة المحمولة.
              </p>
            </CardFooter>
          </Card>
          
          {/* معلومات حول أداء الرسوم المتحركة */}
          <Card>
            <CardHeader>
              <CardTitle>الرسوم المتحركة والتأثيرات البصرية</CardTitle>
              <CardDescription>
                مبادئ توجيهية للرسوم المتحركة والتأثيرات البصرية للحفاظ على أداء جيد
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside text-gray-300">
                <li>
                  استخدم CSS transitions/animations بدلاً من JavaScript حيثما أمكن
                </li>
                <li>
                  قلل من استخدام اللوحات المتحركة (canvas) المتعددة في صفحة واحدة
                </li>
                <li>
                  استخدم transform و opacity بدلاً من تغيير خصائص أخرى مثل الألوان أو الحجم
                </li>
                <li>
                  تجنب التأثيرات المتحركة المستمرة على الأجهزة المحمولة وافصلها تلقائيًا
                </li>
                <li>
                  احترم تفضيل المستخدم للحركة المخفضة (prefers-reduced-motion)
                </li>
                <li>
                  استخدم الظلال البسيطة بدلاً من الظلال المعقدة للعناصر المتحركة
                </li>
                <li>
                  قم بتنفيذ اختبارات FPS لقياس أداء التطبيق على أجهزة مختلفة
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>اختبارات سهولة الوصول</CardTitle>
              <CardDescription>
                قائمة مرجعية لضمان أفضل تجربة مستخدم لجميع الزوار
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#39FF14] mb-2">التباين والقراءة</h3>
                  <ul className="space-y-1 list-disc list-inside text-gray-300">
                    <li>النصوص يجب أن تكون بنسبة تباين 4.5:1 على الأقل مع الخلفية</li>
                    <li>تجنب استخدام اللون كوسيلة وحيدة لنقل المعلومات</li>
                    <li>تأكد من أن النصوص قابلة للتكبير بنسبة 200% دون فقدان المحتوى</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#39FF14] mb-2">لوحة المفاتيح والتنقل</h3>
                  <ul className="space-y-1 list-disc list-inside text-gray-300">
                    <li>جميع العناصر التفاعلية قابلة للوصول باستخدام لوحة المفاتيح فقط</li>
                    <li>مؤشر تركيز مرئي واضح للتنقل باستخدام لوحة المفاتيح</li>
                    <li>ترتيب التنقل منطقي ومتسلسل عبر لوحة المفاتيح</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#39FF14] mb-2">العناصر التفاعلية</h3>
                  <ul className="space-y-1 list-disc list-inside text-gray-300">
                    <li>كل زر وعنصر تفاعلي له اسم ووصف مناسب</li>
                    <li>الصور لها نص بديل وصفي</li>
                    <li>النماذج تحتوي على تسميات واضحة ورسائل خطأ محددة</li>
                    <li>عناصر التسمية مرتبطة بعناصر الإدخال المقابلة</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#39FF14] mb-2">تحليل وتحديد المشكلات</h3>
                  <ul className="space-y-1 list-disc list-inside text-gray-300">
                    <li>استخدم أدوات فحص سهولة الوصول مثل Lighthouse أو axe</li>
                    <li>اختبر التطبيق مع قارئات الشاشة مثل VoiceOver أو NVDA</li>
                    <li>قم بتنفيذ اختبارات تنقل عبر لوحة المفاتيح فقط</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-400">
                سهولة الوصول ليست ميزة إضافية، بل هي جزء أساسي من تجربة المستخدم الجيدة.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}