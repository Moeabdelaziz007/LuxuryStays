// Enum لأدوار المستخدمين
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PROPERTY_ADMIN = "PROPERTY_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

// واجهة لبيانات المستخدم
export interface UserData {
  uid: string;
  email: string;
  name?: string;
  displayName?: string;
  role: UserRole;
  createdAt: any;
  updatedAt?: any;
  isAdmin?: boolean;
  [key: string]: any;
}

// واجهة لبيانات تسجيل الدخول
export interface LoginCredentials {
  email: string;
  password: string;
}

// واجهة لبيانات إنشاء حساب جديد
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// واجهة لحالة المصادقة
export interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}