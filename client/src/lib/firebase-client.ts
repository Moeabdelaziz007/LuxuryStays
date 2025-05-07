/**
 * @file firebase-client.ts
 * ملف موحد لإعدادات Firebase على جانب العميل
 * يحل محل الملفات المتعددة لتجنب تضارب التهيئة
 */

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  connectAuthEmulator,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence,
  User 
} from "firebase/auth";
import {
  getFirestore,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// التحقق من وجود مفاتيح Firebase
if (!import.meta.env.VITE_FIREBASE_API_KEY || !import.meta.env.VITE_FIREBASE_PROJECT_ID) {
  console.error("مفاتيح Firebase غير متوفرة. تأكد من وجود VITE_FIREBASE_API_KEY و VITE_FIREBASE_PROJECT_ID في ملف .env");
}

// تكوين Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// تهيئة تطبيق Firebase (مرة واحدة فقط)
export const app = initializeApp(firebaseConfig);

// تهيئة خدمة المصادقة
export const auth = getAuth(app);

// إعدادات محسّنة لـ Firestore مع دعم وضع عدم الاتصال ومعالجة أخطاء الاتصال
export const db = initializeFirestore(app, {
  // استخدام التخزين المؤقت المحلي لتحسين الأداء ودعم وضع عدم الاتصال
  localCache: persistentLocalCache({
    // السماح باستخدام التطبيق في عدة علامات تبويب في نفس المتصفح
    tabManager: persistentMultipleTabManager(),
    // زيادة حجم التخزين المؤقت للتطبيقات الكبيرة
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  }),
  // زيادة مهلة الانتظار لتحسين الاتصال على الشبكات البطيئة
  experimentalForceLongPolling: true,
});

// تهيئة خدمة التخزين
export const storage = getStorage(app);

// ملاحظة: لا داعي لاستدعاء enableIndexedDbPersistence لأننا نستخدم بالفعل persistentLocalCache

// دالة مساعدة للتعامل مع وثائق Firestore بشكل آمن
export const safeDoc = (doc: any) => {
  if (!doc || !doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
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