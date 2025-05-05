// User role enum matching the backend schema
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PROPERTY_ADMIN = "PROPERTY_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

// User data interface
export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  [key: string]: any;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register credentials interface
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}