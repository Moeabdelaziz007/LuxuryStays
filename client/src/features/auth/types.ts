export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PROPERTY_ADMIN = "PROPERTY_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
