import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to check server status
  app.get("/api/status", (_req, res) => {
    res.json({ status: "ok" });
  });

  // API endpoint to fetch featured properties
  app.get("/api/properties/featured", async (_req, res) => {
    try {
      // In a real app, this would fetch from the database
      // For now, we'll return mock data
      res.json([
        {
          id: "1",
          name: "Luxury Villa with Pool",
          location: "Palm Jumeirah, Dubai",
          price: 950,
          imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          beds: 5,
          baths: 4,
          size: 3500,
          rating: 4.9,
          featured: true
        },
        {
          id: "2",
          name: "Modern Beachfront Apartment",
          location: "JBR, Dubai",
          price: 650,
          imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          beds: 3,
          baths: 2,
          size: 1800,
          rating: 4.8,
          featured: false
        },
        {
          id: "3",
          name: "Premium Penthouse Suite",
          location: "Downtown, Dubai",
          price: 1200,
          imageUrl: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          beds: 4,
          baths: 3,
          size: 2700,
          rating: 5.0,
          featured: true
        }
      ]);
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      res.status(500).json({ error: "Failed to fetch featured properties" });
    }
  });

  // API endpoint to fetch active services
  app.get("/api/services/active", async (_req, res) => {
    try {
      // In a real app, this would fetch from the database
      // For now, we'll return mock data
      res.json([
        {
          id: "1",
          name: "Fine Dining Restaurants",
          description: "Experience culinary excellence with our partner restaurants offering exquisite dining experiences.",
          imageUrl: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          status: "active",
          iconClass: "utensils"
        },
        {
          id: "2",
          name: "Premium Nightclubs",
          description: "Access exclusive nightlife venues with VIP treatment and priority reservations.",
          imageUrl: "https://images.unsplash.com/photo-1556035511-3168381ea4d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          status: "active",
          iconClass: "glass-cheers"
        }
      ]);
    } catch (error) {
      console.error("Error fetching active services:", error);
      res.status(500).json({ error: "Failed to fetch active services" });
    }
  });

  // API endpoint to fetch coming soon services
  app.get("/api/services/coming-soon", async (_req, res) => {
    try {
      // In a real app, this would fetch from the database
      // For now, we'll return mock data
      res.json([
        {
          id: "3",
          name: "ChillRoom Lounges",
          description: "Exclusive relaxation spaces with premium amenities, perfect for unwinding after a busy day.",
          imageUrl: "",
          status: "coming_soon",
          iconClass: "couch",
          launchDate: "Q3 2023"
        },
        {
          id: "4",
          name: "Luxury Yacht Charters",
          description: "Private yacht experiences with professional crew, catering, and customized routes.",
          imageUrl: "",
          status: "coming_soon",
          iconClass: "ship",
          launchDate: "Q4 2023"
        },
        {
          id: "5",
          name: "Helicopter Transfers",
          description: "Quick and stylish transportation between properties and key locations.",
          imageUrl: "",
          status: "coming_soon",
          iconClass: "helicopter",
          launchDate: "Q1 2024"
        }
      ]);
    } catch (error) {
      console.error("Error fetching coming soon services:", error);
      res.status(500).json({ error: "Failed to fetch coming soon services" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
