import { users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, isNull, sql } from "drizzle-orm";

// توسيع واجهة IStorage لدعم الوظائف الإضافية المتعلقة بـ Firebase
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserRole(id: number, role: string): Promise<User | undefined>;
}

// تنفيذ وظائف التخزين مع قاعدة البيانات
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  // وظيفة جديدة للبحث عن مستخدم حسب معرف Firebase الفريد
  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }
  
  // وظيفة جديدة للبحث عن مستخدم حسب البريد الإلكتروني
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // محاولة إنشاء المستخدم
      const [user] = await db
        .insert(users)
        .values(insertUser)
        .returning();
      return user;
    } catch (error: any) {
      // التعامل مع حالة وجود المستخدم بالفعل (انتهاك مفتاح فريد)
      if (error.code === '23505') { // رمز PostgreSQL لانتهاك المفتاح الفريد
        // في حالة وجود مستخدم Firebase، قم بالبحث عنه وتحديثه بدلاً من الإنشاء
        if (insertUser.firebaseUid) {
          const existingUser = await this.getUserByFirebaseUid(insertUser.firebaseUid);
          if (existingUser) {
            // تحديث بيانات المستخدم الموجود
            const [updatedUser] = await db
              .update(users)
              .set({
                name: insertUser.name,
                email: insertUser.email,
                profileImage: insertUser.profileImage
              })
              .where(eq(users.id, existingUser.id))
              .returning();
            return updatedUser;
          }
        }
        
        // في حالة وجود تعارض في اسم المستخدم، ولكن ليس معرف Firebase
        if (insertUser.username) {
          // إضافة رقم عشوائي لاسم المستخدم لجعله فريداً
          const uniqueUsername = `${insertUser.username}_${Math.floor(Math.random() * 1000)}`;
          insertUser.username = uniqueUsername;
          
          // محاولة إنشاء المستخدم مرة أخرى بعد تعديل اسم المستخدم
          return this.createUser(insertUser);
        }
      }
      
      // إعادة رمي الخطأ في الحالات الأخرى
      throw error;
    }
  }
  
  // وظيفة جديدة لتحديث دور المستخدم
  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }
}

export const storage = new DatabaseStorage();
