/**
 * @file firebase-config.ts
 * تهيئة وإعدادات Firebase المحسّنة لمعالجة مشاكل الاتصال
 */

import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
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

// تهيئة تطبيق Firebase
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
  // تحسينات الشبكة للاتصالات غير المستقرة والشبكات البطيئة
  // استخدم experimentalAutoDetectLongPolling فقط، لا يمكن استخدامه مع experimentalForceLongPolling
  experimentalAutoDetectLongPolling: true,
});

// تهيئة خدمة التخزين
export const storage = getStorage(app);

// ملاحظة: لا نحتاج لاستدعاء enableIndexedDbPersistence لأن persistentLocalCache يقوم بذلك تلقائيًا
console.log("تم تكوين Firestore مع دعم وضع عدم الاتصال");

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

// تصدير كل شيء
export { app as firebaseApp, auth as firebaseAuth, db as firestoreDb, storage as firebaseStorage };

// التصدير الافتراضي
export default { app, auth, db, storage, safeDoc };