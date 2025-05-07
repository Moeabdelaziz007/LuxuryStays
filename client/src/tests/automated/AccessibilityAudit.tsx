import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertCircle, Clock, AlertTriangle, CheckSquare, XSquare } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// تعريف واجهات البيانات
interface AuditIssue {
  id: string;
  element: string;
  description: string;
  impact: 'critical' | 'severe' | 'moderate' | 'minor';
  wcag?: string; // معيار WCAG، مثل "1.1.1", "2.4.3"
  screenshot?: string;
  remediation: string;
}

interface AuditResult {
  passed: boolean;
  score: number; // 0-100
  passedTests: number;
  totalTests: number;
  criticalIssues: number;
  severeIssues: number;
  moderateIssues: number;
  minorIssues: number;
  issues: AuditIssue[];
  timeStamp: string;
  pageUrl: string;
}

interface AccessibilityPrinciple {
  name: string;
  description: string;
  guidelines: {
    id: string;
    name: string;
    description: string;
  }[];
}

// منهجية التدقيق المتبعة
const auditMethodology = [
  "التحقق من توافق المحتوى مع معايير WCAG 2.1 مستوى AA",
  "استخدام أدوات التحقق الآلي المدمجة مع تحليل يدوي",
  "التحقق من إمكانية التنقل باستخدام لوحة المفاتيح فقط",
  "اختبار التكبير حتى 200% والتأكد من عدم فقدان المحتوى",
  "فحص بنية العناوين والترميز الدلالي",
  "التحقق من تباين الألوان والقراءة",
  "اختبار سهولة قراءة النصوص والوضوح",
  "التحقق من التوافق مع قارئات الشاشة",
  "فحص الرسائل الإرشادية والأخطاء"
];

// مبادئ إمكانية الوصول الرئيسية وفق WCAG
const accessibilityPrinciples: AccessibilityPrinciple[] = [
  {
    name: "قابل للإدراك (Perceivable)",
    description: "يجب أن تكون المعلومات وعناصر واجهة المستخدم قابلة للإدراك من قبل المستخدمين",
    guidelines: [
      {
        id: "1.1",
        name: "بدائل نصية",
        description: "توفير بدائل نصية لأي محتوى غير نصي"
      },
      {
        id: "1.2",
        name: "الوسائط المعتمدة على الزمن",
        description: "توفير بدائل للوسائط المعتمدة على الزمن"
      },
      {
        id: "1.3",
        name: "قابل للتكيف",
        description: "إنشاء محتوى يمكن تقديمه بطرق مختلفة دون فقدان المعلومات"
      },
      {
        id: "1.4",
        name: "قابل للتمييز",
        description: "تسهيل رؤية المحتوى وسماعه بما في ذلك فصل المقدمة عن الخلفية"
      }
    ]
  },
  {
    name: "قابل للتشغيل (Operable)",
    description: "يجب أن تكون مكونات واجهة المستخدم والتنقل قابلة للتشغيل",
    guidelines: [
      {
        id: "2.1",
        name: "إمكانية الوصول بلوحة المفاتيح",
        description: "جعل جميع الوظائف متاحة من لوحة المفاتيح"
      },
      {
        id: "2.2",
        name: "وقت كافٍ",
        description: "توفير وقت كافٍ للمستخدمين لقراءة المحتوى واستخدامه"
      },
      {
        id: "2.3",
        name: "نوبات والردود المادية",
        description: "عدم تصميم المحتوى بطريقة معروفة تسبب نوبات"
      },
      {
        id: "2.4",
        name: "قابل للتنقل",
        description: "توفير طرق لمساعدة المستخدمين في التنقل والعثور على المحتوى"
      },
      {
        id: "2.5",
        name: "طرق الإدخال",
        description: "تسهيل استخدام الوظائف من خلال مدخلات متنوعة بخلاف لوحة المفاتيح"
      }
    ]
  },
  {
    name: "قابل للفهم (Understandable)",
    description: "يجب أن تكون المعلومات وتشغيل واجهة المستخدم قابلة للفهم",
    guidelines: [
      {
        id: "3.1",
        name: "قابل للقراءة",
        description: "جعل نص المحتوى قابلاً للقراءة والفهم"
      },
      {
        id: "3.2",
        name: "قابل للتنبؤ",
        description: "جعل صفحات الويب تظهر وتعمل بطرق يمكن التنبؤ بها"
      },
      {
        id: "3.3",
        name: "مساعدة الإدخال",
        description: "مساعدة المستخدمين على تجنب الأخطاء وتصحيحها"
      }
    ]
  },
  {
    name: "متين (Robust)",
    description: "يجب أن يكون المحتوى متينًا بما يكفي للتفسير بثقة من قبل مجموعة متنوعة من العملاء",
    guidelines: [
      {
        id: "4.1",
        name: "متوافق",
        description: "تعزيز التوافق مع العملاء الحاليين والمستقبليين، بما في ذلك التقنيات المساعدة"
      }
    ]
  }
];

// القائمة المرجعية للفحص اليدوي
const manualChecklist = [
  {
    category: "الهيكل والتنقل",
    items: [
      { id: "keyboard-nav", text: "يمكن التنقل في جميع عناصر الصفحة باستخدام لوحة المفاتيح فقط", criticalForAccess: true },
      { id: "focus-order", text: "ترتيب التركيز منطقي وطبيعي", criticalForAccess: true },
      { id: "focus-visible", text: "مؤشر التركيز مرئي دائمًا", criticalForAccess: true },
      { id: "skip-link", text: "يتوفر رابط تخطي للمحتوى الرئيسي", criticalForAccess: false },
      { id: "landmarks", text: "استخدام المعالم HTML5 بشكل صحيح (header, nav, main, footer)", criticalForAccess: false }
    ]
  },
  {
    category: "المحتوى والمعلومات",
    items: [
      { id: "alt-text", text: "جميع الصور لها نص بديل مناسب", criticalForAccess: true },
      { id: "headings", text: "التسلسل الهرمي للعناوين منطقي ومنظم", criticalForAccess: true },
      { id: "link-purpose", text: "الغرض من كل رابط واضح من نصه", criticalForAccess: false },
      { id: "language", text: "تم تحديد لغة الصفحة برمجيًا", criticalForAccess: false },
      { id: "text-resize", text: "يمكن تكبير النص حتى 200% دون فقدان المحتوى", criticalForAccess: true }
    ]
  },
  {
    category: "النماذج والإدخال",
    items: [
      { id: "labels", text: "جميع عناصر النموذج لها تسميات مرتبطة بشكل صحيح", criticalForAccess: true },
      { id: "error-identify", text: "يتم تحديد أخطاء الإدخال بوضوح", criticalForAccess: true },
      { id: "error-suggestion", text: "توفير اقتراحات لتصحيح الأخطاء", criticalForAccess: false },
      { id: "form-validation", text: "رسائل التحقق من صحة النموذج سهلة الفهم", criticalForAccess: false }
    ]
  },
  {
    category: "التباين والمظهر",
    items: [
      { id: "contrast", text: "نسبة تباين النص مع الخلفية 4.5:1 على الأقل", criticalForAccess: true },
      { id: "text-spacing", text: "يمكن تعديل تباعد النص دون فقدان المحتوى", criticalForAccess: false },
      { id: "responsive", text: "التصميم المتجاوب يعمل بشكل صحيح عند تكبير الصفحة", criticalForAccess: true },
      { id: "color-meaning", text: "لا يتم استخدام اللون كوسيلة وحيدة لنقل المعلومات", criticalForAccess: true }
    ]
  },
  {
    category: "الوسائط المتعددة",
    items: [
      { id: "captions", text: "الفيديوهات لها تسميات توضيحية", criticalForAccess: true },
      { id: "audio-control", text: "توفير تحكم في مستوى الصوت", criticalForAccess: false },
      { id: "autoplay", text: "لا يوجد محتوى يبدأ تلقائيًا ويستمر لأكثر من 5 ثوانٍ", criticalForAccess: false }
    ]
  }
];

/**
 * مكون التدقيق الشامل لإمكانية الوصول
 * يوفر واجهة شاملة لإجراء وعرض نتائج تدقيق إمكانية الوصول
 */
const AccessibilityAudit: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [manualCheckResults, setManualCheckResults] = useState<Record<string, boolean | null>>({});
  const [selectedTab, setSelectedTab] = useState('methodology');
  const [showSuccessCriteria, setShowSuccessCriteria] = useState(false);
  
  // بدء التدقيق الآلي
  const startAudit = () => {
    setIsRunning(true);
    setProgress(0);
    
    // محاكاة تقدم التدقيق
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          simulateAuditResults();
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };
  
  // محاكاة نتائج التدقيق
  const simulateAuditResults = () => {
    // فحص واجهة المستخدم الحالية وجمع المشكلات
    const auditIssues: AuditIssue[] = [];
    
    // القيام بعمليات فحص بسيطة لصفحة DOM
    // فحص العناوين
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headingsArray = Array.from(headings);
    
    // التحقق من تسلسل العناوين
    let lastLevel = 0;
    for (let i = 0; i < headingsArray.length; i++) {
      const heading = headingsArray[i];
      const level = parseInt(heading.tagName.substring(1));
      
      if (level - lastLevel > 1 && lastLevel !== 0) {
        auditIssues.push({
          id: `heading-skip-${i}`,
          element: heading.tagName,
          description: `تخطي مستوى العناوين من h${lastLevel} إلى h${level}`,
          impact: 'moderate',
          wcag: '1.3.1',
          remediation: `استخدام تسلسل منطقي للعناوين دون تخطي المستويات`
        });
      }
      
      lastLevel = level;
    }
    
    // التحقق من نصوص بديلة للصور
    const images = document.querySelectorAll('img');
    Array.from(images).forEach((img, index) => {
      const imgElement = img as HTMLImageElement;
      if (!imgElement.hasAttribute('alt')) {
        auditIssues.push({
          id: `img-no-alt-${index}`,
          element: 'img',
          description: `الصورة بدون سمة alt`,
          impact: 'critical',
          wcag: '1.1.1',
          remediation: `إضافة نص بديل وصفي للصورة`
        });
      }
    });
    
    // التحقق من التباين (مبسط)
    const smallTextElements = Array.from(document.querySelectorAll('p, li, span, a')).filter(el => {
      const style = window.getComputedStyle(el);
      const fontSize = parseFloat(style.fontSize);
      return fontSize < 14 && (el.textContent ? el.textContent.trim().length > 0 : false);
    });
    
    if (smallTextElements.length > 0) {
      auditIssues.push({
        id: 'small-text',
        element: 'text',
        description: `تم العثور على ${smallTextElements.length} عنصر(عناصر) نصية بحجم خط أقل من 14px`,
        impact: 'moderate',
        wcag: '1.4.4',
        remediation: `زيادة حجم الخط إلى 14px على الأقل للقراءة السهلة`
      });
    }
    
    // التحقق من أهداف اللمس الصغيرة
    const smallTouchTargets = Array.from(document.querySelectorAll('button, a, [role="button"], input[type="button"], input[type="submit"]')).filter(el => {
      const rect = el.getBoundingClientRect();
      return (rect.width < 44 || rect.height < 44);
    });
    
    if (smallTouchTargets.length > 0) {
      auditIssues.push({
        id: 'small-touch-targets',
        element: 'interactive elements',
        description: `تم العثور على ${smallTouchTargets.length} عنصر(عناصر) تفاعلية بأبعاد أقل من 44×44 بكسل`,
        impact: 'moderate',
        wcag: '2.5.5',
        remediation: `زيادة حجم عناصر اللمس إلى 44×44 بكسل على الأقل`
      });
    }
    
    // التحقق من روابط غامضة
    const vagueLinkTexts = ['انقر هنا', 'اضغط هنا', 'المزيد', 'هنا', 'تفاصيل', 'اقرأ المزيد', 'click here', 'here', 'more', 'details', 'read more'];
    const ambiguousLinks = Array.from(document.querySelectorAll('a')).filter(link => {
      const text = link.textContent ? link.textContent.trim().toLowerCase() : '';
      return vagueLinkTexts.includes(text) && !link.getAttribute('aria-label');
    });
    
    if (ambiguousLinks.length > 0) {
      auditIssues.push({
        id: 'ambiguous-links',
        element: 'a',
        description: `تم العثور على ${ambiguousLinks.length} رابط(روابط) بنصوص غامضة`,
        impact: 'moderate',
        wcag: '2.4.4',
        remediation: `استخدام نصوص وصفية للروابط بدلاً من "انقر هنا" أو "المزيد"`
      });
    }
    
    // التحقق من الترميز الدلالي
    const hasNav = document.querySelector('nav') !== null;
    const hasMain = document.querySelector('main') !== null;
    const hasHeader = document.querySelector('header') !== null;
    const hasFooter = document.querySelector('footer') !== null;
    
    if (!hasNav || !hasMain || !hasHeader || !hasFooter) {
      auditIssues.push({
        id: 'semantic-markup',
        element: 'page structure',
        description: `بنية الصفحة تفتقر إلى بعض الترميز الدلالي الأساسي ${!hasNav ? '(nav) ' : ''}${!hasMain ? '(main) ' : ''}${!hasHeader ? '(header) ' : ''}${!hasFooter ? '(footer) ' : ''}`,
        impact: 'moderate',
        wcag: '1.3.1',
        remediation: `استخدام عناصر HTML5 الدلالية بشكل صحيح (header, nav, main, footer, etc.)`
      });
    }
    
    // حساب الدرجة والإحصائيات
    const criticalIssues = auditIssues.filter(issue => issue.impact === 'critical').length;
    const severeIssues = auditIssues.filter(issue => issue.impact === 'severe').length;
    const moderateIssues = auditIssues.filter(issue => issue.impact === 'moderate').length;
    const minorIssues = auditIssues.filter(issue => issue.impact === 'minor').length;
    
    const totalTests = 20; // عدد افتراضي للاختبارات
    const passedTests = totalTests - (criticalIssues + severeIssues + moderateIssues + minorIssues);
    
    // حساب الدرجة - الاختبارات الحرجة لها وزن أكبر
    let score = 100;
    score -= criticalIssues * 15; // خصم 15 نقطة لكل مشكلة حرجة
    score -= severeIssues * 10; // خصم 10 نقاط لكل مشكلة شديدة
    score -= moderateIssues * 5; // خصم 5 نقاط لكل مشكلة متوسطة
    score -= minorIssues * 2; // خصم نقطتين لكل مشكلة بسيطة
    
    // ضمان أن الدرجة بين 0 و 100
    score = Math.max(0, Math.min(100, score));
    
    setAuditResult({
      passed: score >= 85,
      score,
      passedTests,
      totalTests,
      criticalIssues,
      severeIssues,
      moderateIssues,
      minorIssues,
      issues: auditIssues,
      timeStamp: new Date().toLocaleString(),
      pageUrl: window.location.href
    });
  };
  
  // تحديث نتيجة عنصر القائمة المرجعية
  const updateChecklistItem = (itemId: string, value: boolean) => {
    setManualCheckResults(prev => ({
      ...prev,
      [itemId]: value
    }));
  };
  
  // حساب نتيجة التدقيق اليدوي
  const getManualAuditScore = () => {
    // حساب عدد العناصر التي تم تحديدها
    const checkedItems = Object.keys(manualCheckResults).filter(key => manualCheckResults[key] !== null);
    
    // إذا لم يتم تحديد أي عنصر، عودة 0
    if (checkedItems.length === 0) return 0;
    
    // حساب عدد العناصر التي اجتازت الاختبار
    const passedItems = Object.keys(manualCheckResults).filter(key => manualCheckResults[key] === true);
    
    // حساب النسبة المئوية
    return Math.round((passedItems.length / checkedItems.length) * 100);
  };
  
  // التصنيف على أساس درجة التدقيق
  const getAuditRating = (score: number): { label: string; color: string } => {
    if (score >= 90) return { label: 'ممتاز', color: 'green' };
    if (score >= 80) return { label: 'جيد جدًا', color: 'lime' };
    if (score >= 70) return { label: 'جيد', color: 'yellow' };
    if (score >= 60) return { label: 'مقبول', color: 'orange' };
    return { label: 'ضعيف', color: 'red' };
  };
  
  // لون الحالة بناءً على التأثير
  const getImpactColor = (impact: AuditIssue['impact']) => {
    switch (impact) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500';
      case 'severe': return 'bg-amber-500/20 text-amber-400 border-amber-500';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500';
      case 'minor': return 'bg-blue-500/20 text-blue-400 border-blue-500';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };
  
  // تنسيق رمز WCAG
  const formatWcag = (wcag: string | undefined) => {
    if (!wcag) return null;
    
    return (
      <a 
        href={`https://www.w3.org/WAI/WCAG21/Understanding/${wcag.replace(/\./g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#39FF14] hover:underline"
      >
        WCAG {wcag}
      </a>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl">تدقيق إمكانية الوصول الشامل</CardTitle>
            <CardDescription>
              تحليل شامل لإمكانية الوصول بناءً على معايير WCAG 2.1 مستوى AA
            </CardDescription>
          </div>
          <Button 
            onClick={startAudit} 
            disabled={isRunning}
            className={`bg-[#39FF14] text-black hover:bg-[#39FF14]/90 ${isRunning ? 'opacity-50' : ''}`}
          >
            {isRunning ? "جاري التدقيق..." : "بدء التدقيق"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>جاري تدقيق إمكانية الوصول...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="methodology">المنهجية</TabsTrigger>
            <TabsTrigger value="automated">التدقيق الآلي</TabsTrigger>
            <TabsTrigger value="manual">التدقيق اليدوي</TabsTrigger>
            <TabsTrigger value="guidelines">المبادئ التوجيهية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="methodology" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>منهجية التدقيق</CardTitle>
                <CardDescription>
                  يعتمد تقييم إمكانية الوصول على مجموعة شاملة من الاختبارات الآلية واليدوية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-[#39FF14] mb-2">نطاق التدقيق</h3>
                    <p className="text-gray-300 mb-4">
                      يغطي التدقيق جوانب إمكانية الوصول الرئيسية التالية وفقًا لمعايير WCAG 2.1 مستوى AA:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      {auditMethodology.map((method, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-[#39FF14] shrink-0 mr-2 mt-0.5" />
                          <span>{method}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-[#39FF14] mb-2">العملية</h3>
                    <p className="text-gray-300">
                      يتم تنفيذ عملية التدقيق على النحو التالي:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 mt-2 text-gray-300">
                      <li>تحليل آلي للكود المصدري وبنية DOM</li>
                      <li>فحص الخصائص المرئية والتفاعلية للعناصر</li>
                      <li>التحقق من صحة الترميز الدلالي وبنية المحتوى</li>
                      <li>تقييم التوافق مع معايير WCAG</li>
                      <li>إنشاء تقرير مفصل بالمشكلات والتوصيات</li>
                    </ol>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-[#39FF14] mb-2">مستويات التأثير</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2" />
                          <span className="font-medium">حرجة (Critical):</span>
                          <span className="text-gray-300 mr-1">تمنع الوصول تمامًا لبعض المستخدمين</span>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-2" />
                          <span className="font-medium">شديدة (Severe):</span>
                          <span className="text-gray-300 mr-1">تعيق الوصول بشكل كبير</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                          <span className="font-medium">متوسطة (Moderate):</span>
                          <span className="text-gray-300 mr-1">تسبب صعوبة في الوصول</span>
                        </div>
                        <div className="flex items-center">
                          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2" />
                          <span className="font-medium">بسيطة (Minor):</span>
                          <span className="text-gray-300 mr-1">تؤثر قليلًا على تجربة المستخدم</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="p-4 border border-[#39FF14]/20 rounded-lg bg-[#39FF14]/5">
              <h3 className="font-medium text-[#39FF14] mb-2 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                ملاحظة هامة
              </h3>
              <p className="text-gray-300">
                لا يغني التدقيق الآلي عن الاختبار اليدوي والتجربة المباشرة من قبل مستخدمين حقيقيين. 
                يوصى بإجراء اختبارات مع مستخدمين يعتمدون على تقنيات مساعدة للحصول على تقييم أكثر شمولاً.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="automated" className="space-y-4">
            {!auditResult ? (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-gray-400 mb-4 text-center">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-[#39FF14]/50" />
                  <p>لم يتم إجراء تدقيق آلي بعد. اضغط على زر "بدء التدقيق" لتحليل الصفحة الحالية.</p>
                </div>
                <Button 
                  onClick={startAudit} 
                  className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
                >
                  بدء التدقيق
                </Button>
              </div>
            ) : (
              <>
                <Alert className={
                  auditResult.passed
                    ? "bg-green-500/10 border-green-500"
                    : "bg-amber-500/10 border-amber-500"
                }>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-start">
                      {auditResult.passed 
                        ? <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                        : <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 mt-0.5" />
                      }
                      <div>
                        <AlertTitle>
                          {auditResult.passed 
                            ? "تم اجتياز التدقيق الأساسي" 
                            : "يوجد مشكلات يجب معالجتها"
                          }
                        </AlertTitle>
                        <AlertDescription>
                          درجة تقييم إمكانية الوصول: <strong>{auditResult.score}%</strong> ({getAuditRating(auditResult.score).label})
                        </AlertDescription>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <div className="w-20 h-20 rounded-full border-4 border-gray-700 flex items-center justify-center relative">
                        <div 
                          className="absolute inset-0 rounded-full border-4 border-transparent"
                          style={{
                            borderTopColor: `${getAuditRating(auditResult.score).color}`,
                            transform: `rotate(${auditResult.score * 3.6}deg)`,
                            transition: 'transform 1s ease-in-out'
                          }}
                        ></div>
                        <span className="text-xl font-bold">{auditResult.score}%</span>
                      </div>
                    </div>
                  </div>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-black/20">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">اختبارات ناجحة</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <p className="text-2xl font-semibold">{auditResult.passedTests}/{auditResult.totalTests}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-950/20">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">مشكلات حرجة</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <p className="text-2xl font-semibold">{auditResult.criticalIssues}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-amber-950/20">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">مشكلات شديدة</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                        <p className="text-2xl font-semibold">{auditResult.severeIssues}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow-950/20">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">مشكلات متوسطة/بسيطة</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                        <p className="text-2xl font-semibold">{auditResult.moderateIssues + auditResult.minorIssues}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {auditResult.issues.length > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>المشكلات التي تم اكتشافها ({auditResult.issues.length})</CardTitle>
                      <CardDescription>
                        قائمة المشكلات المتعلقة بإمكانية الوصول التي تم اكتشافها في التدقيق الآلي
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[120px]">التأثير</TableHead>
                            <TableHead>الوصف</TableHead>
                            <TableHead>المعيار</TableHead>
                            <TableHead className="text-right">الإصلاح المقترح</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {auditResult.issues.map((issue) => (
                            <TableRow key={issue.id}>
                              <TableCell>
                                <Badge className={`${getImpactColor(issue.impact)} border`}>
                                  {issue.impact === 'critical' && 'حرج'}
                                  {issue.impact === 'severe' && 'شديد'}
                                  {issue.impact === 'moderate' && 'متوسط'}
                                  {issue.impact === 'minor' && 'بسيط'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{issue.description}</div>
                                <div className="text-sm text-gray-400">العنصر: {issue.element}</div>
                              </TableCell>
                              <TableCell>{formatWcag(issue.wcag)}</TableCell>
                              <TableCell className="text-right">{issue.remediation}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <Alert className="bg-green-500/10 border-green-500">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <AlertTitle>لم يتم اكتشاف أي مشكلات</AlertTitle>
                    <AlertDescription>
                      لم يجد التدقيق الآلي أي مشكلات متعلقة بإمكانية الوصول في الصفحة الحالية.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400">
                    <span className="font-medium text-gray-300">ملاحظة: </span>
                    التدقيق الآلي تم إجراؤه في {auditResult.timeStamp} على الصفحة {auditResult.pageUrl}.
                    قد لا يتم اكتشاف جميع مشكلات إمكانية الوصول من خلال التدقيق الآلي وحده.
                  </p>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>القائمة المرجعية للتدقيق اليدوي</CardTitle>
                <CardDescription>
                  استخدم هذه القائمة المرجعية لإجراء تدقيق يدوي شامل لإمكانية الوصول
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.keys(manualCheckResults).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">نتيجة التدقيق اليدوي</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span>التقدم: {Object.keys(manualCheckResults).length}/{manualChecklist.reduce((sum, category) => sum + category.items.length, 0)} عنصر</span>
                        <span>الدرجة: {getManualAuditScore()}%</span>
                      </div>
                      <Progress 
                        value={getManualAuditScore()} 
                        className="h-2"
                        style={{
                          color: getManualAuditScore() >= 90 ? 'green' :
                                getManualAuditScore() >= 70 ? 'yellow' :
                                'red'
                        }}
                      />
                    </div>
                  )}
                  
                  {manualChecklist.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="border border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 p-3 font-medium">
                        {category.category}
                      </div>
                      <div className="divide-y divide-gray-700">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="p-3 flex items-start">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse mr-2">
                              <button
                                onClick={() => updateChecklistItem(item.id, true)}
                                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                  manualCheckResults[item.id] === true
                                    ? 'bg-green-500/20 text-green-500'
                                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                                }`}
                              >
                                <CheckSquare className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => updateChecklistItem(item.id, false)}
                                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                  manualCheckResults[item.id] === false
                                    ? 'bg-red-500/20 text-red-500'
                                    : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                                }`}
                              >
                                <XSquare className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span>{item.text}</span>
                                {item.criticalForAccess && (
                                  <Badge className="mr-2 bg-red-500/20 text-red-400 border border-red-500">
                                    حرج
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-400">
                  عناصر القائمة المرجعية المميزة بعلامة "حرج" تمثل متطلبات أساسية لإمكانية الوصول وفقًا لمعايير WCAG.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="guidelines" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">المبادئ التوجيهية لإمكانية الوصول WCAG 2.1</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSuccessCriteria(!showSuccessCriteria)}
              >
                {showSuccessCriteria ? "إخفاء معايير النجاح" : "عرض معايير النجاح"}
              </Button>
            </div>
            
            <div className="space-y-4">
              {accessibilityPrinciples.map((principle, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{principle.name}</CardTitle>
                    <CardDescription>{principle.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {principle.guidelines.map((guideline) => (
                        <div key={guideline.id} className="border border-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-[#39FF14] mb-1">
                            {guideline.id} {guideline.name}
                          </h4>
                          <p className="text-gray-300 mb-2">{guideline.description}</p>
                          
                          {showSuccessCriteria && (
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-gray-400 mb-2">معايير النجاح (المستوى A و AA):</h5>
                              <div className="bg-black/30 p-2 rounded text-sm">
                                {/* هنا يمكن إضافة تفاصيل معايير النجاح لكل توجيه */}
                                <p className="text-gray-400">
                                  معايير النجاح المفصلة متاحة في{' '}
                                  <a 
                                    href={`https://www.w3.org/WAI/WCAG21/Understanding/`} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#39FF14] hover:underline"
                                  >
                                    توثيق WCAG 2.1
                                  </a>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-gray-400 mb-2">
          تستند أدوات التدقيق إلى إرشادات إمكانية الوصول إلى محتوى الويب (WCAG) 2.1، مستوى AA.
        </p>
        <div>
          <a 
            href="https://www.w3.org/WAI/standards-guidelines/wcag/" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#39FF14] text-sm hover:underline inline-flex items-center"
          >
            مزيد من المعلومات حول WCAG
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AccessibilityAudit;