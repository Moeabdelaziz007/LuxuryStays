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
  // زيادة مهلة الانتظار لتحسين الاتصال على الشبكات البطيئة
  experimentalForceLongPolling: true,
});

// تهيئة خدمة التخزين
export const storage = getStorage(app);

// ملاحظة: لا نحتاج لاستدعاء enableIndexedDbPersistence لأن persistentLocalCache يقوم بذلك تلقائيًا
console.log("تم تكوين Firestore مع دعم وضع عدم الاتصال");

// دالة مساعدة للتعامل مع وثائق Firestore بشكل آمن
export const safeDoc = (doc: any) => {
  if (!doc || !doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

// تصدير كل شيء
export { app as firebaseApp, auth as firebaseAuth, db as firestoreDb, storage as firebaseStorage };

// التصدير الافتراضي
export default { app, auth, db, storage, safeDoc };