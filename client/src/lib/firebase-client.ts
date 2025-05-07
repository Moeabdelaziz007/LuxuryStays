/**
 * @file firebase-client.ts
 * ملف موحد لإعدادات Firebase على جانب العميل
 * يحل محل الملفات المتعددة لتجنب تضارب التهيئة
 */

import { 
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence,
  User 
} from "firebase/auth";

// استيراد خدمات Firebase المُهيأة من الملف الرئيسي
import { auth as firebaseAuth, app as firebaseApp, db as firestoreDb, storage as firebaseStorage } from './firebase-config';
// إعادة تصدير المتغيرات للتوافق
export const auth = firebaseAuth;
export const app = firebaseApp;
export const db = firestoreDb;
export const storage = firebaseStorage;

// دالة مساعدة محسّنة للتعامل مع وثائق Firestore بشكل آمن مع معالجة الأخطاء
export const safeDoc = async <T>(docFn: () => Promise<any>, defaultValue: T | null = null): Promise<T | null> => {
  try {
    const doc = await docFn();
    
    // إذا كانت النتيجة فارغة أو غير موجودة
    if (!doc) return defaultValue;
    
    // التعامل مع وثيقة فردية
    if (doc.exists && typeof doc.data === 'function') {
      return { id: doc.id, ...doc.data() } as T;
    }
    
    // التعامل مع نتائج query (مجموعة وثائق)
    if (doc.docs && Array.isArray(doc.docs)) {
      return doc.docs.map((d: any) => ({ id: d.id, ...d.data() })) as unknown as T;
    }
    
    // التعامل مع حالات خاصة مثل getCountFromServer
    if (doc.data && typeof doc.data === 'function' && !doc.exists) {
      return doc.data() as T;
    }
    
    // إذا كان الكائن بالفعل معالج
    if (doc.id) return doc as T;
    
    return defaultValue;
  } catch (error) {
    console.error("خطأ في الوصول إلى Firestore:", error);
    return defaultValue;
  }
};

// ======= وظائف المصادقة المحسّنة =======

// إنشاء موفر Google جديد لكل محاولة تسجيل دخول لتجنب مشاكل الحالة القديمة
export const createGoogleProvider = () => {
  const provider = new GoogleAuthProvider();
  
  // إضافة نطاقات لـ Google OAuth
  provider.addScope('email');
  provider.addScope('profile');
  
  // تعيين معلمات مخصصة لتوافق أفضل
  provider.setCustomParameters({
    prompt: 'select_account',
    // تعطيل تلميحات تسجيل الدخول لعرض شاشة تسجيل دخول نظيفة في كل مرة
    login_hint: ''
  });
  
  return provider;
};

// ضمان استمرارية محلية لتحسين تجربة المستخدم
export const ensurePersistence = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    return true;
  } catch (error) {
    console.warn("فشل تعيين الاستمرارية:", error);
    // استمر على أي حال، فهذا مجرد تحسين
    return false;
  }
};

// تسجيل الدخول المحسّن مع معالجة أخطاء متقدمة وتدفق أكثر سلاسة
export async function login() {
  // تعيين الاستمرارية لتحسين تجربة المستخدم
  await ensurePersistence();
  
  const provider = createGoogleProvider();
  
  try {
    // دائمًا جرب النافذة المنبثقة أولاً لأنها توفر أفضل تجربة للمستخدم
    return await signInWithPopup(auth, provider);
  } catch (error: any) {
    console.log("فشل تسجيل الدخول بالنافذة المنبثقة مع الخطأ:", error.code);
    
    // استخدم إعادة التوجيه كحل بديل فقط لحالات أخطاء محددة
    if (
      error.code === 'auth/popup-blocked' || 
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request'
    ) {
      console.log("استخدام إعادة التوجيه كحل بديل بسبب مشاكل النافذة المنبثقة");
      return signInWithRedirect(auth, provider);
    }
    
    // بالنسبة للنطاق غير المصرح به، لا نحاول إعادة التوجيه لأنه سيفشل أيضًا
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error("domain_unauthorized");
    }
    
    // بالنسبة للأخطاء الأخرى، قم بنشرها
    throw error;
  }
}

// تسجيل الدخول مع Google باستخدام النافذة المنبثقة (نسخة محسّنة)
export async function loginWithPopup() {
  await ensurePersistence();
  const provider = createGoogleProvider();
  return signInWithPopup(auth, provider);
}

// تسجيل الدخول كضيف مع موثوقية محسّنة
export async function loginAsGuest() {
  await ensurePersistence();
  try {
    return await signInAnonymously(auth);
  } catch (error) {
    console.error("فشل تسجيل الدخول كضيف:", error);
    throw error;
  }
}

// معالج إعادة التوجيه المحسّن مع تقارير أخطاء أفضل
export async function handleRedirect() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      // هذا يعطيك رمز وصول Google. يمكنك استخدامه للوصول إلى واجهات برمجة تطبيقات Google.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      // معلومات المستخدم المسجّل الدخول.
      const user = result.user;
      
      // النجاح - إرجاع المستخدم
      return { success: true, user, token };
    }
    return { success: false, message: "لا توجد نتيجة إعادة توجيه" };
  } catch (error: any) {
    console.error("خطأ في معالجة إعادة التوجيه:", error);
    // تقديم استجابة خطأ أكثر سهولة للمستخدم
    return { 
      success: false, 
      errorCode: error.code,
      errorMessage: error.message,
      friendlyMessage: getFriendlyErrorMessage(error.code),
      email: error.customData?.email,
      credential: GoogleAuthProvider.credentialFromError(error)
    };
  }
}

// دالة مساعدة لتوفير رسائل خطأ صديقة للمستخدم
export function getFriendlyErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/unauthorized-domain':
      return "هذا الموقع غير مصرح له للمصادقة. يرجى تجربة خيار الدخول كضيف.";
    case 'auth/popup-blocked':
      return "تم حظر نافذة تسجيل الدخول. يرجى السماح بالنوافذ المنبثقة وإعادة المحاولة.";
    case 'auth/popup-closed-by-user':
      return "تم إغلاق نافذة تسجيل الدخول قبل إكمال العملية.";
    case 'auth/cancelled-popup-request':
      return "تم إلغاء طلب المصادقة. يرجى المحاولة مرة أخرى.";
    case 'auth/account-exists-with-different-credential':
      return "هناك حساب موجود بالفعل لهذا البريد الإلكتروني باستخدام طريقة تسجيل دخول مختلفة.";
    case 'auth/network-request-failed':
      return "فشل الاتصال بالشبكة. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.";
    default:
      return "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";
  }
}