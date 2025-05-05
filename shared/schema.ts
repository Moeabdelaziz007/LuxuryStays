import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PROPERTY_ADMIN = "PROPERTY_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("CUSTOMER"),
  profileImage: text("profile_image"),
  firebaseUid: text("firebase_uid").unique(),
  preferences: json("preferences").$type<{ language: string; notifications: boolean }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  price: integer("price").notNull(),
  currency: text("currency").notNull().default("USD"),
  imageUrl: text("image_url").notNull(),
  beds: integer("beds").notNull(),
  baths: integer("baths").notNull(),
  size: integer("size").notNull(), // in sq ft
  rating: integer("rating"),
  featured: boolean("featured").default(false),
  adminId: integer("admin_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Services table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  status: text("status").notNull().default("active"), // active or coming_soon
  launchDate: timestamp("launch_date"),
  iconClass: text("icon_class"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
