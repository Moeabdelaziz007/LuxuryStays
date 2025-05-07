import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, AlertCircle, Clock, AlertTriangle } from 'lucide-react';

// نوع التقرير المرجعي
export interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  description: string;
  details?: string;
  elementsTested?: number;
  errors?: string[];
  warnings?: string[];
}

// نوع الاختبار
export interface Test {
  id: string;
  name: string;
  description: string;
  run: () => Promise<TestResult>;
  weight: number; // وزن الاختبار في النسبة المئوية الإجمالية
}

/**
 * الاختبارات التلقائية المتاحة
 */
export const availableTests: Test[] = [
  {
    id: 'a11y-headings',
    name: 'تسلسل العناوين',
    description: 'التحقق من التسلسل المنطقي للعناوين h1-h6 في الصفحة',
    weight: 10,
    run: async () => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (headings.length === 0) {
        warnings.push('لم يتم العثور على عناوين في الصفحة');
      }
      
      // فحص وجود h1 واحد فقط
      const h1Elements = headings.filter(h => h.tagName.toLowerCase() === 'h1');
      if (h1Elements.length === 0) {
        errors.push('لم يتم العثور على عنوان h1 في الصفحة');
      } else if (h1Elements.length > 1) {
        errors.push(`تم العثور على ${h1Elements.length} عناصر h1، يجب أن يكون هناك واحد فقط`);
      }
      
      // فحص التسلسل المنطقي
      let lastLevel = 0;
      for (let i = 0; i < headings.length; i++) {
        const currentHeading = headings[i];
        const level = parseInt(currentHeading.tagName.charAt(1));
        
        if (level - lastLevel > 1 && lastLevel !== 0) {
          errors.push(`تخطي مستوى العنوان: من h${lastLevel} إلى h${level}`);
        }
        
        lastLevel = level;
      }
      
      return {
        id: 'a11y-headings',
        name: 'تسلسل العناوين',
        status: errors.length === 0 ? 'passed' : 'failed',
        description: 'التحقق من التسلسل المنطقي للعناوين h1-h6 في الصفحة',
        elementsTested: headings.length,
        errors,
        warnings
      };
    }
  },
  {
    id: 'a11y-images',
    name: 'صور ذات وصف بديل',
    description: 'التحقق من أن جميع الصور تحتوي على وصف بديل',
    weight: 10,
    run: async () => {
      const images = Array.from(document.querySelectorAll('img'));
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (images.length === 0) {
        return {
          id: 'a11y-images',
          name: 'صور ذات وصف بديل',
          status: 'passed',
          description: 'لم يتم العثور على صور في الصفحة',
          elementsTested: 0
        };
      }
      
      let imagesWithoutAlt = 0;
      let imagesWithEmptyAlt = 0;
      
      images.forEach((img, index) => {
        const imgElement = img as HTMLImageElement;
        if (!imgElement.hasAttribute('alt')) {
          imagesWithoutAlt++;
          errors.push(`الصورة #${index + 1} بدون سمة alt`);
        } else if (imgElement.alt.trim() === '') {
          // الصور الزخرفية يمكن أن تحتوي على alt=""
          const isDecorative = imgElement.classList.contains('decorative') || 
                               imgElement.role === 'presentation' ||
                               imgElement.getAttribute('aria-hidden') === 'true';
          
          if (!isDecorative) {
            imagesWithEmptyAlt++;
            warnings.push(`الصورة #${index + 1} لديها سمة alt فارغة ولكن لا تبدو زخرفية`);
          }
        }
      });
      
      return {
        id: 'a11y-images',
        name: 'صور ذات وصف بديل',
        status: errors.length === 0 ? 'passed' : 'failed',
        description: 'التحقق من أن جميع الصور تحتوي على وصف بديل',
        elementsTested: images.length,
        details: `تم اختبار ${images.length} صورة، ${imagesWithoutAlt} بدون alt، ${imagesWithEmptyAlt} بقيمة alt فارغة`,
        errors,
        warnings
      };
    }
  },
  {
    id: 'a11y-contrast',
    name: 'تباين الألوان',
    description: 'فحص توافر تباين كافٍ بين النص والخلفية',
    weight: 15,
    run: async () => {
      const textElements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label'));
      const errors: string[] = [];
      const warnings: string[] = [];
      
      // تنفيذ محدود: سيتم التحقق فقط من العناصر ذات الألوان المصرح بها
      // للتحقق الفعلي، نحتاج إلى حساب التباين من خلال فحص الألوان المحسوبة
      
      const darkTextOnBrightBg = ['text-black', 'text-gray-900', 'text-gray-800', 'text-gray-700', 'text-gray-600'];
      const brightTextOnDarkBg = ['text-white', 'text-gray-100', 'text-gray-200', 'text-gray-300'];
      
      // ستكون هذه قائمة تقريبية فقط دون حساب تباين فعلي
      const potentialLowContrastElements = textElements.filter(el => {
        const classList = Array.from(el.classList);
        const isBrightText = classList.some(c => brightTextOnDarkBg.includes(c));
        const isDarkText = classList.some(c => darkTextOnBrightBg.includes(c));
        
        // التحقق من النص الفاتح على خلفية فاتحة أو النص الداكن على خلفية داكنة
        // هذا تبسيط كبير، لكنه يوفر بعض الفحص الأساسي
        const color = window.getComputedStyle(el).color;
        const backgroundColor = window.getComputedStyle(el).backgroundColor;
        
        if (isBrightText && backgroundColor.includes('255, 255, 255')) {
          return true; // نص فاتح على خلفية بيضاء
        }
        
        if (isDarkText && backgroundColor.includes('0, 0, 0')) {
          return true; // نص داكن على خلفية سوداء
        }
        
        return false;
      });
      
      if (potentialLowContrastElements.length > 0) {
        potentialLowContrastElements.forEach((el, index) => {
          const elementText = el.textContent?.trim().substring(0, 20) || '[بدون نص]';
          warnings.push(`العنصر "${elementText}..." قد يعاني من تباين منخفض`);
        });
      }
      
      // اعتبار هذا ناجحًا ولكن مع تحذيرات، لأن التقييم الكامل يتطلب تحليلًا أكثر دقة
      return {
        id: 'a11y-contrast',
        name: 'تباين الألوان',
        status: warnings.length > 5 ? 'failed' : 'passed',
        description: 'فحص توافر تباين كافٍ بين النص والخلفية',
        elementsTested: textElements.length,
        details: 'يوصى بإجراء فحص يدوي للتباين باستخدام أدوات متخصصة',
        errors,
        warnings
      };
    }
  },
  {
    id: 'responsive-mobile',
    name: 'توافق الأجهزة المحمولة',
    description: 'التحقق من التصميم المتجاوب للشاشات الصغيرة',
    weight: 15,
    run: async () => {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      // فحص وجود العناصر الضرورية المتجاوبة
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        errors.push('لم يتم العثور على علامة viewport في رأس الصفحة');
      } else {
        const content = viewport.getAttribute('content');
        if (!content?.includes('width=device-width')) {
          errors.push('علامة viewport لا تحتوي على width=device-width');
        }
      }
      
      // التحقق من العرض الأفقي (Horizontal Overflow)
      const bodyWidth = document.body.offsetWidth;
      const windowWidth = window.innerWidth;
      if (document.body.scrollWidth > windowWidth) {
        errors.push('تم اكتشاف تمرير أفقي في واجهة المستخدم، مما قد يشير إلى مشكلات في التصميم المتجاوب');
      }
      
      // التحقق من أحجام الخط
      const smallTextElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);
        return fontSize < 12 && el.textContent?.trim().length > 0;
      });
      
      if (smallTextElements.length > 0) {
        warnings.push(`تم العثور على ${smallTextElements.length} عنصر(عناصر) مع حجم خط أقل من 12px`);
      }
      
      // التحقق من أهداف اللمس
      const smallTouchTargets = Array.from(document.querySelectorAll('button, a, [role="button"], input, select, textarea')).filter(el => {
        const rect = el.getBoundingClientRect();
        return (rect.width < 44 || rect.height < 44);
      });
      
      if (smallTouchTargets.length > 0) {
        warnings.push(`تم العثور على ${smallTouchTargets.length} هدف(أهداف) للمس بأبعاد أقل من 44×44 بكسل`);
      }
      
      return {
        id: 'responsive-mobile',
        name: 'توافق الأجهزة المحمولة',
        status: errors.length === 0 ? (warnings.length === 0 ? 'passed' : 'passed') : 'failed',
        description: 'التحقق من التصميم المتجاوب للشاشات الصغيرة',
        details: 'تم إجراء فحوصات أساسية للتصميم المتجاوب. قد تكون هناك حاجة إلى اختبارات إضافية.',
        errors,
        warnings
      };
    }
  },
  {
    id: 'performance-render',
    name: 'زمن التحميل والعرض',
    description: 'قياس أوقات تحميل وعرض الصفحة',
    weight: 15,
    run: async () => {
      // استخدام Performance API لقياس أوقات التحميل
      const errors: string[] = [];
      const warnings: string[] = [];
      
      try {
        const perfEntries = performance.getEntriesByType('navigation');
        if (!perfEntries || perfEntries.length === 0) {
          warnings.push('لم يتمكن من الوصول إلى بيانات الأداء من المتصفح');
          return {
            id: 'performance-render',
            name: 'زمن التحميل والعرض',
            status: 'failed',
            description: 'قياس أوقات تحميل وعرض الصفحة',
            errors,
            warnings
          };
        }
        
        const navEntry = perfEntries[0] as PerformanceNavigationTiming;
        const dcl = navEntry.domContentLoadedEventEnd - navEntry.startTime;
        const load = navEntry.loadEventEnd - navEntry.startTime;
        
        let details = '';
        
        // التحقق من أوقات التحميل
        if (dcl > 2000) {
          warnings.push(`DOMContentLoaded يستغرق ${dcl.toFixed(0)}ms، ويوصى بأن يكون أقل من 2000ms`);
        }
        
        if (load > 3000) {
          warnings.push(`وقت التحميل الكلي ${load.toFixed(0)}ms، ويوصى بأن يكون أقل من 3000ms`);
        }
        
        details = `DOMContentLoaded: ${dcl.toFixed(0)}ms | Load: ${load.toFixed(0)}ms`;
        
        // قياس FPS حالي
        let frames = 0;
        let lastTime = performance.now();
        const measureFPS = () => {
          frames++;
          const now = performance.now();
          const elapsed = now - lastTime;
          
          if (elapsed >= 1000) {
            const fps = Math.round((frames * 1000) / elapsed);
            details += ` | FPS: ${fps}`;
            
            if (fps < 30) {
              warnings.push(`معدل الإطارات الحالي ${fps} FPS، ويوصى بأن يكون أعلى من 30 FPS لتجربة مستخدم سلسة`);
            }
            
            frames = 0;
            lastTime = now;
            return true;
          }
          return false;
        };
        
        // تشغيل بضع دورات لقياس FPS
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => requestAnimationFrame(() => {
            if (measureFPS()) {
              resolve(true);
            } else {
              resolve(false);
            }
          }));
        }
        
        // قياس وقت استجابة الأحداث
        const interactionEvents = performance.getEntriesByType('event');
        if (interactionEvents && interactionEvents.length > 0) {
          const avgEventTime = interactionEvents.reduce((sum, entry) => sum + entry.duration, 0) / interactionEvents.length;
          details += ` | Avg. Event Time: ${avgEventTime.toFixed(2)}ms`;
          
          if (avgEventTime > 100) {
            warnings.push(`متوسط وقت استجابة الأحداث ${avgEventTime.toFixed(2)}ms، ويوصى بأن يكون أقل من 100ms`);
          }
        }
        
        return {
          id: 'performance-render',
          name: 'زمن التحميل والعرض',
          status: errors.length === 0 ? 'passed' : 'failed',
          description: 'قياس أوقات تحميل وعرض الصفحة',
          details,
          errors,
          warnings
        };
      } catch (error) {
        return {
          id: 'performance-render',
          name: 'زمن التحميل والعرض',
          status: 'failed',
          description: 'قياس أوقات تحميل وعرض الصفحة',
          details: `حدث خطأ أثناء قياس الأداء: ${error instanceof Error ? error.message : String(error)}`,
          errors: [`خطأ: ${error instanceof Error ? error.message : String(error)}`],
          warnings
        };
      }
    }
  },
  {
    id: 'functional-links',
    name: 'روابط صالحة',
    description: 'التحقق من أن جميع الروابط لها مسارات صالحة',
    weight: 10,
    run: async () => {
      const links = Array.from(document.querySelectorAll('a'));
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (links.length === 0) {
        warnings.push('لم يتم العثور على روابط في الصفحة');
      }
      
      let brokenLinks = 0;
      let externalLinks = 0;
      let hashLinks = 0;
      let emptyLinks = 0;
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) {
          emptyLinks++;
          errors.push(`الرابط "${link.textContent?.trim() || '[بدون نص]'}" لا يحتوي على سمة href`);
        } else if (href === '#') {
          hashLinks++;
          warnings.push(`الرابط "${link.textContent?.trim() || '[بدون نص]'}" يحتوي على href="#" - قد يكون معطلاً أو غير مكتمل`);
        } else if (href.startsWith('http') && !href.includes(window.location.hostname)) {
          externalLinks++;
          // لا نتحقق من الروابط الخارجية
        } else if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('/')) {
          brokenLinks++;
          errors.push(`الرابط "${link.textContent?.trim() || '[بدون نص]'}" يحتوي على مسار نسبي غير صحيح: ${href}`);
        }
      });
      
      return {
        id: 'functional-links',
        name: 'روابط صالحة',
        status: errors.length === 0 ? 'passed' : 'failed',
        description: 'التحقق من أن جميع الروابط لها مسارات صالحة',
        elementsTested: links.length,
        details: `تم اختبار ${links.length} رابط(روابط)، ${brokenLinks} مكسور(ة)، ${emptyLinks} فارغ(ة)، ${hashLinks} روابط #، ${externalLinks} خارجي(ة)`,
        errors,
        warnings
      };
    }
  },
  {
    id: 'css-overflow',
    name: 'فائض CSS',
    description: 'التحقق من مشكلات الفائض في CSS',
    weight: 10,
    run: async () => {
      const elements = Array.from(document.querySelectorAll('*'));
      const errors: string[] = [];
      const warnings: string[] = [];
      
      let horizontalOverflow = 0;
      let visibleOverflow = 0;
      
      elements.forEach(element => {
        const style = window.getComputedStyle(element);
        
        if (element.scrollWidth > element.clientWidth) {
          const overflow = style.overflowX;
          if (overflow === 'visible') {
            horizontalOverflow++;
            const selector = element.id 
              ? `#${element.id}` 
              : element.className 
                ? `.${element.className.replace(/\s+/g, '.')}`
                : element.tagName.toLowerCase();
            
            // تحديد أول 3 عناصر أبوية للمساعدة في تحديد المكان
            let parent = element.parentElement;
            let parentPath = '';
            let depth = 0;
            while (parent && depth < 3) {
              parentPath = parent.tagName.toLowerCase() + (parentPath ? ' > ' + parentPath : '');
              parent = parent.parentElement;
              depth++;
            }
            
            warnings.push(`العنصر ${selector} في ${parentPath} لديه تمرير أفقي (${element.scrollWidth}px > ${element.clientWidth}px)`);
          }
        }
        
        // التحقق من عناصر overflow: visible غير الضرورية
        if (style.overflow === 'visible' && element.scrollHeight > element.clientHeight + 50) {
          visibleOverflow++;
        }
      });
      
      // التحقق من عرض المستند
      if (document.documentElement.scrollWidth > window.innerWidth) {
        errors.push(`الصفحة تتجاوز عرض النافذة بـ ${document.documentElement.scrollWidth - window.innerWidth}px`);
      }
      
      return {
        id: 'css-overflow',
        name: 'فائض CSS',
        status: errors.length === 0 ? 'passed' : 'failed',
        description: 'التحقق من مشكلات الفائض في CSS',
        elementsTested: elements.length,
        details: `تم العثور على ${horizontalOverflow} عنصر(عناصر) بتمرير أفقي، و${visibleOverflow} عنصر(عناصر) بفائض مرئي`,
        errors,
        warnings
      };
    }
  },
  {
    id: 'form-validation',
    name: 'التحقق من صحة النماذج',
    description: 'التحقق من صحة عناصر النموذج والمدخلات',
    weight: 15,
    run: async () => {
      const forms = Array.from(document.querySelectorAll('form'));
      const formInputs = Array.from(document.querySelectorAll('input, select, textarea'));
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (forms.length === 0) {
        return {
          id: 'form-validation',
          name: 'التحقق من صحة النماذج',
          status: 'passed',
          description: 'لم يتم العثور على نماذج في الصفحة',
          elementsTested: 0
        };
      }
      
      // التحقق من إمكانية الوصول الأساسية لعناصر النموذج
      let inputsWithoutLabels = 0;
      let inputsWithoutValidation = 0;
      
      formInputs.forEach(input => {
        const inputElement = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        const type = inputElement.getAttribute('type');
        
        // تحقق من أن المدخلات لها تسميات مرتبطة
        const id = inputElement.id;
        if (id) {
          const associatedLabel = document.querySelector(`label[for="${id}"]`);
          if (!associatedLabel) {
            inputsWithoutLabels++;
            warnings.push(`العنصر ${inputElement.tagName.toLowerCase()}#${id} ليس له تسمية مرتبطة`);
          }
        } else {
          // ربما يكون لديه تسمية في النموذج
          const parentLabel = inputElement.closest('label');
          if (!parentLabel) {
            inputsWithoutLabels++;
            warnings.push(`العنصر ${inputElement.tagName.toLowerCase()} ليس له معرف أو تسمية أبوية`);
          }
        }
        
        // تحقق من سمات التحقق
        if (type === 'email' && !inputElement.hasAttribute('pattern')) {
          // حقول البريد الإلكتروني يجب أن يكون لها نمط صالح
          inputsWithoutValidation++;
          warnings.push(`حقل البريد الإلكتروني ${id ? `#${id}` : ''} ليس له سمة pattern`);
        } else if (type === 'url' && !inputElement.hasAttribute('pattern')) {
          inputsWithoutValidation++;
          warnings.push(`حقل الرابط ${id ? `#${id}` : ''} ليس له سمة pattern`);
        }
        
        // تحقق من إمكانية الوصول
        if (!inputElement.hasAttribute('aria-label') && 
            !inputElement.hasAttribute('aria-labelledby') &&
            !document.querySelector(`label[for="${id}"]`)) {
          inputsWithoutLabels++;
          warnings.push(`العنصر ${inputElement.tagName.toLowerCase()}${id ? `#${id}` : ''} ليس له تسمية aria`);
        }
      });
      
      // تحقق من أن النماذج تستخدم وسائل التحقق الصحيحة
      forms.forEach(form => {
        if (!form.hasAttribute('novalidate') && form.getAttribute('method')?.toLowerCase() === 'post') {
          // هذا جيد، فالنموذج يستخدم التحقق المدمج
        } else if (!form.id) {
          warnings.push('النموذج ليس له معرف، مما قد يؤدي إلى صعوبة التحقق من صحته');
        }
      });
      
      return {
        id: 'form-validation',
        name: 'التحقق من صحة النماذج',
        status: warnings.length > (formInputs.length / 2) ? 'failed' : 'passed',
        description: 'التحقق من صحة عناصر النموذج والمدخلات',
        elementsTested: formInputs.length,
        details: `تم اختبار ${formInputs.length} عنصر(عناصر) إدخال، ${inputsWithoutLabels} بدون تسميات، ${inputsWithoutValidation} بدون تحقق`,
        errors,
        warnings
      };
    }
  }
];

/**
 * مكون مختبر واجهة المستخدم الآلي
 * يقوم بتنفيذ اختبارات آلية لواجهة المستخدم والتصميم المتجاوب والأداء
 */
const AutomatedUITester: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedTests, setSelectedTests] = useState<string[]>(availableTests.map(test => test.id));
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  
  const formatStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-500 text-white">ناجح</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 text-white">فشل</Badge>;
      case 'running':
        return <Badge className="bg-blue-500 text-white">قيد التنفيذ</Badge>;
      case 'pending':
        return <Badge className="bg-gray-500 text-white">معلق</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">غير معروف</Badge>;
    }
  };
  
  const formatStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const runTests = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setProgress(0);
    
    // إعادة تعيين نتائج الاختبار الحالية
    const initialTestResults = availableTests
      .filter(test => selectedTests.includes(test.id))
      .map(test => ({
        id: test.id,
        name: test.name,
        status: 'pending' as const,
        description: test.description
      }));
    
    setTestResults(initialTestResults);
    
    const testsToRun = availableTests.filter(test => selectedTests.includes(test.id));
    const totalTests = testsToRun.length;
    let completedTests = 0;
    
    for (const test of testsToRun) {
      // تحديث الحالة إلى "قيد التنفيذ"
      setTestResults(prev => 
        prev.map(result => 
          result.id === test.id
            ? { ...result, status: 'running' as const }
            : result
        )
      );
      
      // تشغيل الاختبار
      try {
        const result = await test.run();
        
        // تحديث نتائج الاختبار
        setTestResults(prev => 
          prev.map(prevResult => 
            prevResult.id === test.id
              ? result
              : prevResult
          )
        );
      } catch (error) {
        console.error(`Error running test ${test.id}:`, error);
        
        // تحديث نتائج الاختبار مع الخطأ
        setTestResults(prev => 
          prev.map(result => 
            result.id === test.id
              ? {
                  ...result,
                  status: 'failed' as const,
                  errors: [`خطأ تنفيذ الاختبار: ${error instanceof Error ? error.message : String(error)}`]
                }
              : result
          )
        );
      }
      
      completedTests++;
      setProgress((completedTests / totalTests) * 100);
      
      // انتظر وجيز بين الاختبارات لتجنب تجميد واجهة المستخدم
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // حساب النتيجة الإجمالية
    calculateOverallScore();
    
    setIsRunning(false);
  };
  
  const calculateOverallScore = () => {
    const selectedTestsData = availableTests.filter(test => selectedTests.includes(test.id));
    const totalWeight = selectedTestsData.reduce((sum, test) => sum + test.weight, 0);
    
    let weightedScore = 0;
    testResults.forEach(result => {
      const test = selectedTestsData.find(t => t.id === result.id);
      if (test) {
        const score = result.status === 'passed' ? 1 : 
                     result.status === 'failed' ? 0 : 
                     (result.warnings?.length && result.errors?.length === 0) ? 0.5 : 0;
        
        weightedScore += score * test.weight;
      }
    });
    
    const finalScore = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
    setOverallScore(Math.round(finalScore));
  };
  
  const toggleTestSelection = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };
  
  const isPassed = (result: TestResult) => {
    return result.status === 'passed' || (result.status !== 'failed' && (!result.errors || result.errors.length === 0) && (!result.warnings || result.warnings.length === 0));
  };
  
  const getOccurrences = (results: TestResult[]) => {
    return {
      passed: results.filter(r => isPassed(r)).length,
      failed: results.filter(r => !isPassed(r)).length,
      warnings: results.reduce((count, r) => count + (r.warnings?.length || 0), 0),
      errors: results.reduce((count, r) => count + (r.errors?.length || 0), 0)
    };
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">اختبارات واجهة المستخدم الآلية</CardTitle>
            <CardDescription>تشغيل اختبارات آلية للتحقق من جودة واجهة المستخدم والأداء</CardDescription>
          </div>
          <Button
            onClick={runTests}
            disabled={isRunning || selectedTests.length === 0}
            className={isRunning ? "bg-blue-500" : ""}
          >
            {isRunning ? "جاري التنفيذ..." : "تشغيل الاختبارات"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* تقدم الاختبار */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>جاري تنفيذ الاختبارات...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {/* نتيجة عامة */}
        {testResults.length > 0 && !isRunning && (
          <Alert className={
            overallScore >= 90 ? "bg-green-500/10 border-green-500" :
            overallScore >= 70 ? "bg-yellow-500/10 border-yellow-500" :
            "bg-red-500/10 border-red-500"
          }>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <AlertTitle className="text-lg font-semibold">
                  نتيجة الاختبار: {overallScore}%
                </AlertTitle>
                <AlertDescription>
                  {getOccurrences(testResults).passed} ناجح, {getOccurrences(testResults).failed} فشل, {getOccurrences(testResults).warnings} تحذير, {getOccurrences(testResults).errors} خطأ
                </AlertDescription>
              </div>
              <div className="mt-2 md:mt-0">
                <div className="w-20 h-20 rounded-full border-4 border-gray-200 flex items-center justify-center relative">
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-transparent"
                    style={{
                      borderTopColor: overallScore >= 90 ? '#10b981' : overallScore >= 70 ? '#f59e0b' : '#ef4444',
                      transform: `rotate(${overallScore * 3.6}deg)`,
                      transition: 'transform 1s ease-in-out'
                    }}
                  ></div>
                  <span className="text-xl font-bold">{overallScore}%</span>
                </div>
              </div>
            </div>
          </Alert>
        )}
        
        {/* قائمة الاختبارات المتاحة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {availableTests.map(test => (
            <div
              key={test.id}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedTests.includes(test.id)
                  ? "border-[#39FF14]/50 bg-[#39FF14]/10"
                  : "border-gray-700 hover:border-gray-500"
              }`}
              onClick={() => toggleTestSelection(test.id)}
            >
              <div className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={selectedTests.includes(test.id)}
                  onChange={() => toggleTestSelection(test.id)}
                  className="ml-2"
                />
                <span className="font-medium">{test.name}</span>
              </div>
              <p className="text-sm text-gray-400">{test.description}</p>
            </div>
          ))}
        </div>
        
        {/* نتائج الاختبار */}
        {testResults.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-3">نتائج الاختبار</h3>
            <div className="space-y-3">
              {testResults.map(result => (
                <Card key={result.id} className="overflow-hidden">
                  <CardHeader className="py-3 px-4 bg-gray-800/50 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      {formatStatusIcon(result.status)}
                      <h4 className="font-medium">{result.name}</h4>
                      {formatStatusBadge(result.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-300 mb-2">{result.description}</p>
                    {result.details && (
                      <p className="text-sm text-gray-400">{result.details}</p>
                    )}
                    
                    {((result.errors && result.errors.length > 0) || (result.warnings && result.warnings.length > 0)) && (
                      <div className="mt-3 space-y-3">
                        {result.errors && result.errors.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-red-500 mb-1">الأخطاء ({result.errors.length})</h5>
                            <ScrollArea className="h-24 rounded-md bg-red-900/10 p-2">
                              <ul className="text-xs text-red-300 list-disc list-inside space-y-1">
                                {result.errors.map((error, index) => (
                                  <li key={index}>{error}</li>
                                ))}
                              </ul>
                            </ScrollArea>
                          </div>
                        )}
                        
                        {result.warnings && result.warnings.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-yellow-500 mb-1">التحذيرات ({result.warnings.length})</h5>
                            <ScrollArea className="h-24 rounded-md bg-yellow-900/10 p-2">
                              <ul className="text-xs text-yellow-300 list-disc list-inside space-y-1">
                                {result.warnings.map((warning, index) => (
                                  <li key={index}>{warning}</li>
                                ))}
                              </ul>
                            </ScrollArea>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setSelectedTests(availableTests.map(test => test.id))}
          disabled={isRunning}
        >
          تحديد الكل
        </Button>
        <Button 
          variant="destructive"
          onClick={() => setTestResults([])}
          disabled={isRunning || testResults.length === 0}
        >
          مسح النتائج
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AutomatedUITester;