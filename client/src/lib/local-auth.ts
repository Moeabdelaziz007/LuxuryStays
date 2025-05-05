import { UserRole } from "@/features/auth/types";

// Simple local storage based authentication for development/testing
// This is a fallback for when Firebase is unavailable

interface LocalUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

const LOCAL_STORAGE_KEY = 'stayx_local_auth';
const USERS_KEY = 'stayx_local_users';

// Get currently logged in user
export function getLocalUser(): LocalUser | null {
  try {
    const userData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting local user:', error);
    return null;
  }
}

// Login with email/password
export function localLogin(email: string, password: string): Promise<LocalUser> {
  return new Promise((resolve, reject) => {
    try {
      const usersData = localStorage.getItem(USERS_KEY);
      const users: Record<string, { user: LocalUser, password: string }> = usersData ? JSON.parse(usersData) : {};
      
      // Find user by email
      const userEntry = Object.values(users).find(entry => entry.user.email === email);
      
      if (!userEntry) {
        reject(new Error('User not found'));
        return;
      }
      
      if (userEntry.password !== password) {
        reject(new Error('Invalid password'));
        return;
      }
      
      // Store logged in user
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userEntry.user));
      
      resolve(userEntry.user);
    } catch (error) {
      console.error('Error in local login:', error);
      reject(error);
    }
  });
}

// Register new user
export function localRegister(name: string, email: string, password: string, role: UserRole = UserRole.CUSTOMER): Promise<LocalUser> {
  return new Promise((resolve, reject) => {
    try {
      const usersData = localStorage.getItem(USERS_KEY);
      const users: Record<string, { user: LocalUser, password: string }> = usersData ? JSON.parse(usersData) : {};
      
      // Check if email already exists
      if (Object.values(users).some(entry => entry.user.email === email)) {
        reject(new Error('Email already in use'));
        return;
      }
      
      // Create new user
      const uid = 'local_' + Date.now();
      const newUser: LocalUser = {
        uid,
        email,
        name,
        role,
        createdAt: new Date().toISOString()
      };
      
      // Store user
      users[uid] = {
        user: newUser,
        password
      };
      
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
      
      resolve(newUser);
    } catch (error) {
      console.error('Error in local register:', error);
      reject(error);
    }
  });
}

// Logout
export function localLogout(): Promise<void> {
  return new Promise((resolve) => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    resolve();
  });
}

// Create a test admin user if no users exist
export function initializeLocalUsers(): void {
  try {
    const usersData = localStorage.getItem(USERS_KEY);
    const users: Record<string, { user: LocalUser, password: string }> = usersData ? JSON.parse(usersData) : {};
    
    if (Object.keys(users).length === 0) {
      // Create test admin user
      const adminUser: LocalUser = {
        uid: 'admin123',
        email: 'admin@example.com',
        name: 'مدير النظام',
        role: UserRole.SUPER_ADMIN,
        createdAt: new Date().toISOString()
      };
      
      // Create test customer user
      const customerUser: LocalUser = {
        uid: 'customer123',
        email: 'user@example.com',
        name: 'مستخدم',
        role: UserRole.CUSTOMER,
        createdAt: new Date().toISOString()
      };
      
      users[adminUser.uid] = {
        user: adminUser,
        password: 'admin123'
      };
      
      users[customerUser.uid] = {
        user: customerUser,
        password: 'user123'
      };
      
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      console.log('Test users created:', Object.keys(users).length);
    }
  } catch (error) {
    console.error('Error initializing local users:', error);
  }
}