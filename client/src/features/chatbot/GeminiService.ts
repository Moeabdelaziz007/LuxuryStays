/**
 * @file GeminiService.ts
 * خدمة للتفاعل مع Google Gemini API
 * 
 * هذه الخدمة مسؤولة عن:
 * 1. إعداد واجهة برمجة تطبيقات Gemini
 * 2. إدارة سياق المحادثة
 * 3. إرسال رسائل المستخدم واستقبال الردود
 * 4. تخصيص شخصية المساعد الرقمي
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// التحقق من وجود مفتاح API
if (!import.meta.env.VITE_GEMINI_API_KEY) {
  console.error("مفتاح API لـ Google Gemini غير موجود. يرجى التحقق من ملف .env");
}

// إنشاء كائن GoogleGenerativeAI مع المفتاح
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// إعدادات تقييد المحتوى (لضمان أن المحتوى مناسب)
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// إعدادات النموذج
const geminiConfig = {
  temperature: 0.8, // التنوع في الردود (0.0 إلى 1.0)
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024, // الحد الأقصى لطول الرد
  safetySettings,
};

// تعليمات تحديد دور وشخصية المساعد
const systemInstruction = `
أنت مساعد رقمي متخصص في خدمة منصة StayX لحجز العقارات الفاخرة بتصميم فضائي مستقبلي.

اسمك: [BOT_NAME]

التوجيهات:
1. أجب باللغة العربية الفصحى البسيطة والمفهومة
2. قدم معلومات دقيقة عن خدمات الإقامة والعقارات المتاحة
3. ساعد المستخدمين في فهم عمليات الحجز والدفع
4. كن لطيفاً ومهنياً ومتعاوناً
5. إذا لم تعرف الإجابة، اقترح التواصل مع خدمة العملاء
6. تحدث بضمير المتكلم (أنا) وكأنك مساعد رقمي حقيقي
7. استخدم صيغة "أنت" عند مخاطبة المستخدم
8. قدم إجابات موجزة ومباشرة (لا تتجاوز 3-4 جمل ما لم يطلب المستخدم تفاصيل)
9. اعكس شخصية تقنية فضائية متطورة تتناسب مع التصميم المستقبلي للمنصة
10. عند توصية العقارات استخدم لغة جذابة ودقيقة مع الإشارة إلى ميزات العقار
11. استخدم المصطلحات الفضائية والعلمية بشكل معتدل في إجاباتك لتعزيز هوية المنصة

دورك الخاص في توصية العقارات:
- عندما يسأل المستخدم عن توصيات، قدم له توصيات شخصية بناءً على تفضيلاته
- يمكنك اقتراح عقارات مناسبة حسب الموقع والميزانية وعدد الأشخاص
- قدم وصفاً مميزاً لكل عقار تقترحه، مع ذكر السعر والمميزات وعدد الغرف والحمامات
- استخدم مقياس نجوم (⭐) لتقييم العقارات عند التوصية
- اذكر سبب توصيتك بهذا العقار المحدد للمستخدم

معلومات عن StayX:
- منصة رائدة لحجز العقارات الفاخرة بتصميم فضائي مستقبلي
- تقدم خدمات متنوعة: حجز الفلل والشاليهات، الحجز اليومي والأسبوعي والشهري
- توفر خيارات دفع متعددة (بطاقات ائتمان، التحويل البنكي)
- تتميز بواجهة مستخدم سهلة الاستخدام وتجربة حجز سلسة
- تعمل على مدار الساعة مع فريق دعم عملاء متاح للمساعدة
- تضم مجموعة واسعة من العقارات في مواقع ساحلية ممتازة بالساحل الشمالي وراس الحكمة

قائمة العقارات المميزة للتوصية:
1. فيلا بانوراما راس الحكمة: فيلا فاخرة بإطلالة بحرية، 4 غرف نوم، 3 حمامات، حمام سباحة خاص، 485 دولار/ليلة
2. شاليه مارينا الساحل: شاليه عصري في مارينا، 2 غرف نوم، 2 حمام، إطلالة على البحر، 259 دولار/ليلة
3. فيلا هاسيندا لاجون: فيلا راقية مع بحيرة صناعية، 3 غرف نوم، 3 حمامات، مسبح خاص، 388 دولار/ليلة
4. شاليه سيزارز جاردنز: شاليه أنيق قرب الشاطئ، 2 غرف نوم، حمام واحد، 195 دولار/ليلة
5. فيلا مراقيا بيتش فرونت: فيلا على الشاطئ مباشرة، 5 غرف نوم، 4 حمامات، شاطئ خاص، 630 دولار/ليلة
`;

/**
 * فئة لإدارة التفاعل مع Gemini API
 */
class GeminiService {
  private static instance: GeminiService;
  private chatSession: any; // جلسة المحادثة
  private history: { role: string; parts: { text: string }[] }[]; // سجل المحادثة
  private botName: string; // اسم المساعد الرقمي

  /**
   * منشئ الفئة
   */
  private constructor() {
    this.botName = "ستايكس"; // الاسم الافتراضي للمساعد
    this.history = [];
    this.initializeChat();
  }

  /**
   * الحصول على نسخة وحيدة من الخدمة (نمط Singleton)
   */
  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * تهيئة جلسة المحادثة
   */
  private initializeChat(): void {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro", ...geminiConfig });
      
      // استبدال [BOT_NAME] باسم المساعد المحدد
      const personalizedInstructions = systemInstruction.replace("[BOT_NAME]", this.botName);
      
      // إنشاء جلسة محادثة جديدة
      this.chatSession = model.startChat({
        history: [
          { role: "user", parts: [{ text: "ما هو دورك؟" }] },
          { role: "model", parts: [{ text: personalizedInstructions }] }
        ],
        generationConfig: geminiConfig,
      });
      
      // إعادة تعيين التاريخ
      this.history = [];
      
    } catch (error) {
      console.error("فشل في تهيئة جلسة المحادثة:", error);
    }
  }

  /**
   * تعيين اسم المساعد الرقمي
   */
  public setBotName(name: string): void {
    if (name && name.trim() !== "") {
      this.botName = name.trim();
      // إعادة تهيئة المحادثة مع الاسم الجديد
      this.initializeChat();
    }
  }

  /**
   * الحصول على اسم المساعد الرقمي الحالي
   */
  public getBotName(): string {
    return this.botName;
  }

  /**
   * إرسال رسالة إلى Gemini والحصول على رد
   */
  public async sendMessage(userMessage: string): Promise<string> {
    try {
      // التحقق من الإدخال
      if (!userMessage || userMessage.trim() === "") {
        return "يرجى إدخال رسالة صالحة.";
      }

      if (!this.chatSession) {
        this.initializeChat();
        if (!this.chatSession) {
          throw new Error("فشل في تهيئة المحادثة");
        }
      }

      // إضافة رسالة المستخدم إلى التاريخ
      this.history.push({ role: "user", parts: [{ text: userMessage }] });
      
      // الحصول على رد من Gemini
      const result = await this.chatSession.sendMessage(userMessage);
      const response = await result.response;
      const responseText = response.text();
      
      // إضافة رد النموذج إلى التاريخ
      this.history.push({ role: "model", parts: [{ text: responseText }] });
      
      return responseText;
    } catch (error) {
      console.error("خطأ في إرسال الرسالة إلى Gemini:", error);
      
      // محاولة إعادة تهيئة المحادثة في حالة فشل الاتصال
      this.initializeChat();
      
      return "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.";
    }
  }

  /**
   * إعادة ضبط المحادثة
   */
  public resetChat(): void {
    this.initializeChat();
  }
}

// تصدير نسخة وحيدة من الخدمة
export default GeminiService.getInstance();