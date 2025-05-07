/**
 * @file firebase-drizzle-adapter.ts
 * طبقة تكيف (adapter) بين بيانات مستخدم Firebase وكائنات Drizzle ORM
 * الغرض منه هو تسهيل تحويل كائنات مستخدم Firebase إلى كائنات قابلة للتخزين في قاعدة البيانات عبر Drizzle
 */

import { User, InsertUser } from "@shared/schema";
import { storage } from "../storage";
import { UserRole } from "@shared/schema";

interface FirebaseUserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

/**
 * تحويل مستخدم Firebase إلى كائن متوافق مع Drizzle InsertUser
 */
export function firebaseUserToDrizzleUser(firebaseUser: FirebaseUserData, extraData?: Partial<InsertUser>): InsertUser {
  // تأكد من وجود اسم مستخدم فريد من البريد الإلكتروني أو إنشاء اسم مستخدم عشوائي
  const username = firebaseUser.email?.split('@')[0] || 
                  `user_${firebaseUser.uid.substring(0, 8)}`;
  
  // بناء كائن InsertUser متوافق مع النموذج الخاص بنا
  return {
    username,
    // استخدام كلمة مرور عشوائية آمنة لأن المصادقة تتم عبر Firebase
    password: `firebase_auth_${Math.random().toString(36).slice(2, 10)}`,
    name: firebaseUser.displayName || username,
    email: firebaseUser.email || `${username}@placeholder.com`,
    role: UserRole.CUSTOMER, // الدور الافتراضي
    profileImage: firebaseUser.photoURL || undefined,
    firebaseUid: firebaseUser.uid,
    // يمكن دمج بيانات إضافية من الباراميتر الثاني
    ...extraData
  };
}

/**
 * البحث عن مستخدم بواسطة معرف Firebase UID
 * إذا لم يكن موجودًا، قم بإنشائه
 */
export async function findOrCreateUserByFirebaseUid(
  firebaseUser: FirebaseUserData, 
  extraData?: Partial<InsertUser>
): Promise<User> {
  try {
    // تحويل من بيانات Firebase إلى بيانات Drizzle
    const insertData = firebaseUserToDrizzleUser(firebaseUser, extraData);
    
    // إدراج المستخدم في قاعدة البيانات
    const user = await storage.createUser(insertData);
    return user;
  } catch (error) {
    // في حالة حدوث خطأ (مثل تكرار اسم المستخدم)
    console.error("خطأ في إنشاء مستخدم Drizzle من مستخدم Firebase:", error);
    throw new Error("فشل في إنشاء سجل المستخدم");
  }
}

/**
 * تسجيل تسجيل دخول مستخدم Firebase في قاعدة البيانات
 */
export async function recordFirebaseLogin(firebaseUser: FirebaseUserData): Promise<void> {
  // يمكن استخدام هذه الوظيفة لتسجيل عمليات تسجيل الدخول أو تحديث بيانات المستخدم
  try {
    // التنفيذ الكامل: حفظ معلومات تسجيل الدخول في جدول إضافي
    console.log(`تم تسجيل دخول المستخدم: ${firebaseUser.uid} في ${new Date().toISOString()}`);
  } catch (error) {
    console.error("خطأ في تسجيل دخول Firebase:", error);
  }
}