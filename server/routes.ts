import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { properties, services } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import adminRoutes from './routes/admin';
import { authenticateUser, createCustomToken } from './firebase-admin-simple';
import axios from "axios";

// إعدادات OAuth للخدمات الخارجية
const googleOAuth = {
  clientId: "299280633489-3q6odgc86hhc1j0cev92bf28q7cep5hj.apps.googleusercontent.com",
  clientSecret: "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",
  redirectUri: "/auth/google/callback",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  userInfoEndpoint: "https://www.googleapis.com/oauth2/v3/userinfo"
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Register admin routes
  app.use('/api/admin', adminRoutes);
  
  // API endpoint to check server status
  app.get("/api/status", (_req, res) => {
    res.json({ status: "ok" });
  });
  
  // API endpoint for custom authentication
  app.post("/api/auth/custom-token", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          error: "البريد الإلكتروني وكلمة المرور مطلوبان" 
        });
      }
      
      // استدعاء وظيفة المصادقة
      const authResult = await authenticateUser(email, password);
      
      // إرجاع التوكن المخصص إلى العميل
      res.json({
        token: authResult.token,
        user: authResult.user
      });
    } catch (error: any) {
      console.error("خطأ في المصادقة المخصصة:", error);
      res.status(401).json({ 
        error: error.message || "فشل في المصادقة" 
      });
    }
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
  
  // واجهة برمجة لمعالجة ردود OAuth من Google
  app.get("/auth/google/callback", async (req: Request, res: Response) => {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).send("رمز التفويض غير موجود");
      }
      
      console.log("تم استلام رمز تفويض Google OAuth:", code);
      
      // استبدال authorization code بـ access token
      const tokenResponse = await axios.post(googleOAuth.tokenEndpoint, {
        code,
        client_id: googleOAuth.clientId,
        client_secret: googleOAuth.clientSecret,
        redirect_uri: `${req.protocol}://${req.get('host')}${googleOAuth.redirectUri}`,
        grant_type: 'authorization_code'
      });
      
      const { access_token } = tokenResponse.data;
      
      // استخدام access token للحصول على معلومات المستخدم
      const userInfoResponse = await axios.get(googleOAuth.userInfoEndpoint, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      const userInfo = userInfoResponse.data;
      console.log("تم استلام معلومات المستخدم من Google:", userInfo);
      
      // إعادة توجيه المستخدم إلى الصفحة الرئيسية مع معلومات المستخدم
      res.redirect('/?login=success');
      
    } catch (error: any) {
      console.error("خطأ في معالجة رد OAuth من Google:", error.message);
      res.redirect('/?login=error&reason=' + encodeURIComponent(error.message));
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
