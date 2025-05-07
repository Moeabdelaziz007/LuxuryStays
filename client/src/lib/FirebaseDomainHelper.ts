/**
 * أداة مساعدة للتعامل مع نطاقات Firebase المصرح بها
 * تساعد في عملية تسجيل الدخول باستخدام Google عن طريق تتبع وتخزين النطاقات
 */

// قائمة بالنطاقات المعروفة والمصرح بها
const KNOWN_AUTHORIZED_DOMAINS = [
  'localhost',
  'staychill-3ed08.firebaseapp.com',
  'staychill-3ed08.web.app',
  'f383ffdf-c47a-4c1b-883b-f090e022af0c-00-3o45tueo3kkse.spock.replit.dev',
  'luxury-stays-mohamedabdela18.replit.app',
];

/**
 * التحقق مما إذا كان النطاق الحالي مصرح به في Firebase
 * @returns {boolean} ما إذا كان النطاق مصرحًا به
 */
export function isCurrentDomainAuthorized(): boolean {
  const currentDomain = window.location.hostname;
  console.log("Current domains in Firebase that should be authorized:", currentDomain);
  return KNOWN_AUTHORIZED_DOMAINS.includes(currentDomain);
}

/**
 * الحصول على النطاق الحالي للتطبيق
 * @returns {string} النطاق الحالي
 */
export function getCurrentDomain(): string {
  return window.location.hostname;
}

/**
 * تخزين النطاق الحالي في التخزين المحلي للمتصفح
 * مفيد للاستخدام في تطبيقات الويب التي تحتاج إلى تذكر النطاق الأصلي
 */
export function storeCurrentDomain(): void {
  localStorage.setItem('currentAuthDomain', window.location.hostname);
}

/**
 * استرجاع النطاق المخزن من التخزين المحلي
 * @returns {string|null} النطاق المخزن أو null إذا لم يكن موجودًا
 */
export function getStoredDomain(): string | null {
  return localStorage.getItem('currentAuthDomain');
}

/**
 * إنشاء URL لفتح إعدادات النطاقات المصرح بها في Firebase
 * @param projectId معرف مشروع Firebase (اختياري)
 * @returns رابط إلى صفحة إعدادات النطاقات المصرح بها
 */
export function getFirebaseAuthDomainsUrl(projectId: string = '_'): string {
  return `https://console.firebase.google.com/project/${projectId}/authentication/settings/authorized-domains`;
}

// تصدير النطاقات المعروفة
export { KNOWN_AUTHORIZED_DOMAINS };