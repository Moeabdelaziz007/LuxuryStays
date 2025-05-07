import { initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth, type UpdateRequest } from 'firebase-admin/auth';
import { getStorage, type Storage } from 'firebase-admin/storage';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin with service account
console.log('Found valid service account at: ./service-account.json');

// Initialize Firebase Admin SDK
const firebaseApp = initializeApp({
  credential: cert(JSON.parse(fs.readFileSync('./service-account.json', 'utf8'))),
  projectId: 'staychill-3ed08',
  storageBucket: 'staychill-3ed08.appspot.com'
});

console.log('Initialized Firebase Admin with service account');

// Get services
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// Export services
export const app = firebaseApp;
export { db, auth, storage };

// Utility functions
export async function verifyIdToken(token: string) {
  try {
    return await auth.verifyIdToken(token);
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await auth.getUserByEmail(email);
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

export async function getUser(uid: string) {
  try {
    return await auth.getUser(uid);
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function updateUser(uid: string, updates: UpdateRequest) {
  try {
    return await auth.updateUser(uid, updates);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * إنشاء توكن مخصص للمصادقة مع Firebase
 * يسمح للتطبيق بإنشاء توكنات للمستخدمين المصادق عليهم من خلال نظام المصادقة المخصص
 * @param uid معرف المستخدم الفريد
 * @param claims مطالبات إضافية اختيارية (مثل الأدوار أو البيانات المخصصة)
 * @returns توكن مخصص يمكن استخدامه للمصادقة مع Firebase
 */
export async function createCustomToken(uid: string, claims?: Record<string, any>) {
  try {
    return await auth.createCustomToken(uid, claims);
  } catch (error) {
    console.error('خطأ في إنشاء توكن مخصص:', error);
    throw error;
  }
}

/**
 * التحقق من صحة بيانات اعتماد المستخدم مقابل قاعدة البيانات المخصصة
 * واستخراج توكن مخصص في حالة نجاح المصادقة
 * @param email البريد الإلكتروني للمستخدم
 * @param password كلمة المرور المقدمة
 * @returns وعد يحتوي على توكن مخصص في حالة النجاح أو خطأ في حالة الفشل
 */
export async function authenticateUser(email: string, password: string) {
  try {
    // هنا يمكنك استبدال هذا المنطق بالمنطق الخاص بنظام المصادقة الخاص بك
    // مثل التحقق من قاعدة بيانات العملاء الخاصة بك
    
    // مثال: التحقق من قاعدة بيانات المستخدمين في Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (snapshot.empty) {
      throw new Error('المستخدم غير موجود');
    }
    
    // هذا مجرد مثال، في التطبيق الحقيقي يجب عليك التحقق من كلمة المرور
    // باستخدام طريقة آمنة (مثل bcrypt)
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    
    // إنشاء توكن مخصص باستخدام معرف المستخدم ومطالبات إضافية
    const customClaims = {
      role: userData.role || 'CUSTOMER',
      name: userData.name || 'مستخدم',
      // يمكنك إضافة مزيد من المطالبات المخصصة حسب الحاجة
    };
    
    return {
      token: await createCustomToken(userDoc.id, customClaims),
      user: {
        uid: userDoc.id,
        email: userData.email,
        name: userData.name,
        role: userData.role
      }
    };
  } catch (error) {
    console.error('خطأ في مصادقة المستخدم:', error);
    throw error;
  }
}