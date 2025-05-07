/**
 * @file auth-adapters.ts
 * محولات (adapters) لتوحيد واجهات المصادقة بين Firebase وDrizzle
 */

import { User as FirebaseUser } from "firebase/auth";
import { UserRole } from "@shared/schema";
import { UserData } from "@/features/auth/types";

/**
 * تحويل مستخدم Firebase إلى نوع UserData المستخدم في التطبيق
 * @param firebaseUser كائن مستخدم Firebase 
 * @param additionalData بيانات إضافية مثل الدور أو معلومات إضافية
 */
export function firebaseUserToAppUser(
  firebaseUser: FirebaseUser | null, 
  additionalData?: Partial<UserData>
): UserData | null {
  if (!firebaseUser) return null;
  
  // البيانات الأساسية من Firebase
  const userData: UserData = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName: firebaseUser.displayName || undefined,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "مستخدم",
    // استخدام الدور المقدم في additionalData أو CUSTOMER كقيمة افتراضية
    role: (additionalData?.role as UserRole) || UserRole.CUSTOMER,
    createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
    updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
    photoURL: firebaseUser.photoURL || undefined,
    phoneNumber: firebaseUser.phoneNumber || undefined,
    emailVerified: firebaseUser.emailVerified,
    isAnonymous: firebaseUser.isAnonymous
  };
  
  // دمج البيانات الإضافية
  if (additionalData) {
    Object.assign(userData, additionalData);
  }
  
  // حساب isAdmin بناءً على الدور
  userData.isAdmin = [UserRole.SUPER_ADMIN, UserRole.PROPERTY_ADMIN].includes(userData.role);
  
  return userData;
}

/**
 * تنسيق المستخدم للعرض (مثل قائمة المستخدمين في لوحة الإدارة)
 * @param user كائن المستخدم
 */
export function formatUserForDisplay(user: UserData) {
  return {
    id: user.uid,
    name: user.name || user.displayName || "بدون اسم",
    email: user.email || "بدون بريد إلكتروني",
    role: user.role || UserRole.CUSTOMER,
    imageUrl: user.photoURL || null,
    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "غير معروف",
    status: user.isAnonymous ? "زائر" : (user.emailVerified ? "نشط" : "غير مفعل"),
  };
}