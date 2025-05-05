import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { properties, services } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to check server status
  app.get("/api/status", (_req, res) => {
    res.json({ status: "ok" });
  });

  // API endpoint to fetch featured properties
  app.get("/api/properties/featured", async (_req, res) => {
    try {
      const featuredProperties = await db
        .select()
        .from(properties)
        .where(eq(properties.featured, true))
        .limit(3);
      
      res.json(featuredProperties);
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      res.status(500).json({ error: "Failed to fetch featured properties" });
    }
  });

  // API endpoint to fetch active services
  app.get("/api/services/active", async (_req, res) => {
    try {
      const activeServices = await db
        .select()
        .from(services)
        .where(eq(services.status, "active"))
        .limit(2);
      
      res.json(activeServices);
    } catch (error) {
      console.error("Error fetching active services:", error);
      res.status(500).json({ error: "Failed to fetch active services" });
    }
  });

  // API endpoint to fetch coming soon services
  app.get("/api/services/coming-soon", async (_req, res) => {
    try {
      const comingSoonServices = await db
        .select()
        .from(services)
        .where(eq(services.status, "coming_soon"))
        .limit(3);
      
      res.json(comingSoonServices);
    } catch (error) {
      console.error("Error fetching coming soon services:", error);
      res.status(500).json({ error: "Failed to fetch coming soon services" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
