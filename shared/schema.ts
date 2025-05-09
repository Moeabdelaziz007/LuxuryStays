import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PROPERTY_ADMIN = "PROPERTY_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}

// Booking statuses
export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled"
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

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  customerId: integer("customer_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"),
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date").notNull(),
  totalPrice: integer("total_price").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  paymentConfirmedAt: timestamp("payment_confirmed_at"),
  paymentFailedAt: timestamp("payment_failed_at"),
  paymentError: text("payment_error"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  updatedAt: timestamp("updated_at"),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  propertyId: integer("property_id").references(() => properties.id),
  propertyAdminId: integer("property_admin_id").references(() => users.id),
  customerId: integer("customer_id").references(() => users.id),
  totalAmount: integer("total_amount").notNull(),
  platformFee: integer("platform_fee").notNull(),
  propertyOwnerAmount: integer("property_owner_amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
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

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
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

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
