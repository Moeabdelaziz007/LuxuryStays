import { httpsCallable, getFunctions } from "firebase/functions";

/**
 * معالج ديناميكي لنطاقات Firebase
 * يقوم بإضافة النطاق الحالي إلى قائمة النطاقات المسموح بها في Firebase Auth تلقائياً
 */
export interface DomainResponse {
  success: boolean;
  message: string;
  domains?: string[];
}

/**
 * تحديث قائمة النطاقات المسموح بها في Firebase Auth
 * يستخدم وظيفة سحابية cloud function للتحديث
 */
export async function updateFirebaseAuthDomains(app: any): Promise<DomainResponse> {
  try {
    // الحصول على النطاق الحالي
    const currentDomain = window.location.hostname;
    
    // إنشاء اتصال بـ Firebase Functions
    const functions = getFunctions(app);
    
    // طلب إضافة النطاق الحالي إلى قائمة النطاقات المسموح بها
    const addAuthDomain = httpsCallable<{ domain: string }, DomainResponse>(
      functions,
      'addAuthDomain'
    );
    
    console.log(`جاري إضافة النطاق ${currentDomain} إلى النطاقات المعتمدة في Firebase Auth...`);
    
    // استدعاء الوظيفة السحابية
    const result = await addAuthDomain({ domain: currentDomain });
    
    console.log(`نتيجة إضافة النطاق: `, result.data);
    
    return result.data;
  } catch (error: any) {
    console.error(`فشل في تحديث نطاقات Firebase Auth: `, error);
    
    return {
      success: false,
      message: error.message || 'حدث خطأ غير معروف'
    };
  }
}

/**
 * التحقق من وجود النطاق الحالي في قائمة النطاقات المعتمدة في Firebase
 * يعود بـ true إذا كان النطاق موجوداً، و false إذا كان غير موجود
 */
export function isCurrentDomainAuthorized(authorizedDomains: string[]): boolean {
  const currentDomain = window.location.hostname;
  return authorizedDomains.includes(currentDomain);
}

/**
 * الحصول على إرشادات تسجيل الدخول بـ Google
 * يوفر تعليمات للمستخدم لإضافة النطاق الحالي إلى إعدادات Firebase
 */
export function getGoogleLoginInstructions(): string {
  const currentDomain = window.location.hostname;
  
  return `
    عليك إضافة النطاق التالي إلى قائمة النطاقات المعتمدة في Firebase:
    
    ${currentDomain}
    
    خطوات الإضافة:
    1. انتقل إلى وحدة تحكم Firebase
    2. اختر المشروع الخاص بك
    3. انتقل إلى Authentication
    4. انتقل إلى تبويب "إعدادات"
    5. في قسم "المجالات المسموح بها"، أضف المجال المذكور أعلاه
    6. انقر على "حفظ"
  `;
}