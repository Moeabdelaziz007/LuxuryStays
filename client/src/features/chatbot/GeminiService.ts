/**
 * @file GeminiService.ts
 * خدمة محسنة للتفاعل مع Google Gemini API
 * 
 * هذه الخدمة مسؤولة عن:
 * 1. إعداد واجهة برمجة تطبيقات Gemini
 * 2. إدارة سياق المحادثة
 * 3. إرسال رسائل المستخدم واستقبال الردود
 * 4. تخصيص شخصية المساعد الرقمي
 * 5. التعامل مع حالات الخطأ والاتصال
 * 6. تقديم تجربة مستخدم مميزة مع توصيات ذكية
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// التحقق من وجود مفتاح API
if (!import.meta.env.VITE_GEMINI_API_KEY) {
  console.error("مفتاح API لـ Google Gemini غير موجود. يرجى التحقق من ملف .env");
}

// إنشاء كائن GoogleGenerativeAI مع المفتاح
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// إعدادات تقييد المحتوى مع مستوى حساسية متوازن
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

// إعدادات النموذج المحسنة لاستجابات أكثر إبداعاً
const geminiConfig = {
  temperature: 0.7, // التنوع في الردود (أقل من السابق لتحسين الدقة)
  topK: 40,
  topP: 0.9, 
  maxOutputTokens: 800, // خفض الحد الأقصى للردود الأكثر دقة وتركيزًا
};

// تكوين النموذج مع إعدادات السلامة
const modelConfig = {
  model: "gemini-1.5-pro",
  safetySettings,
};

// الإعدادات لتوصيات العقارات (أكثر إبداعاً)
const recommendationConfig = {
  temperature: 0.8, // زيادة طفيفة للحصول على توصيات أكثر إبداعاً
  topK: 40,
  topP: 0.9,
  maxOutputTokens: 1024, // زيادة الحد الأقصى للحصول على توصيات مفصلة
};

// تعليمات تحديد دور وشخصية المساعد مُحسّنة
const systemInstruction = `
أنت مساعد ودي باسم [BOT_NAME] يساعد المستخدمين في العثور على عقارات للإيجار في منصة StayX. هدفك هو توفير معلومات دقيقة ومفيدة.

# مهامك:
- مساعدة المستخدمين في إيجاد عقارات مناسبة لاحتياجاتهم
- الإجابة عن الأسئلة المتعلقة بعملية الحجز
- تقديم معلومات واضحة عن المواقع والأسعار
- التحدث بأسلوب مهذب ومفيد

# كيفية التواصل:
1. استخدم اللغة العربية البسيطة والواضحة
2. قدم إجابات موجزة (3-4 جمل فقط)
3. استخدم "أنا" عند الإشارة إلى نفسك
4. كن مهذباً ومحترماً دائماً
5. استخدم الدولار الأمريكي عند ذكر الأسعار

# المعلومات التي يمكنك تقديمها:
- تفاصيل العقارات المتاحة (عدد الغرف، المرافق، الموقع)
- أسعار الإيجار والشروط
- مميزات كل موقع
- نصائح للمستخدمين حول اختيار العقار المناسب

# عند تقديم التوصيات:
1. اسأل عن احتياجات المستخدم (عدد الأشخاص، الميزانية)
2. اقترح 2-3 خيارات مناسبة من القائمة أدناه
3. اشرح سبب توصيتك بكل خيار
4. قدم المعلومات بشكل منظم وواضح

# معلومات عن StayX:
- منصة لحجز العقارات في مناطق ساحلية بمصر
- توفر خيارات دفع متعددة
- تهتم براحة العملاء وتسهيل عملية الحجز

# قائمة العقارات المتاحة:
1. فيلا بانوراما: 4 غرف نوم، 3 حمامات، مسبح، 485 دولار/ليلة
2. شاليه مارينا: 2 غرف نوم، 2 حمام، إطلالة بحر، 259 دولار/ليلة
3. فيلا هاسيندا: 3 غرف نوم، 3 حمامات، مسبح، 388 دولار/ليلة
4. شاليه سيزارز: 2 غرف نوم، حمام واحد، قرب الشاطئ، 195 دولار/ليلة
5. فيلا مراقيا: 5 غرف نوم، 4 حمامات، شاطئ خاص، 630 دولار/ليلة
6. شاليه الماسة: 3 غرف نوم، 2 حمام، قرب المطاعم، 320 دولار/ليلة
7. قصر الشاطئ: 6 غرف نوم، 5 حمامات، حديقة كبيرة، 850 دولار/ليلة
8. استوديو ستيلار: غرفة واحدة، حمام واحد، إطلالة بحرية، 150 دولار/ليلة
`;

/**
 * فئة لإدارة التفاعل مع Gemini API
 * تم تحسينها لتوفير تجربة أفضل مع إدارة الأخطاء ودعم وضع عدم الاتصال
 */
class GeminiService {
  private static instance: GeminiService;
  private chatSession: any; // جلسة المحادثة
  private history: { role: string; parts: { text: string }[] }[]; // سجل المحادثة
  private botName: string; // اسم المساعد الرقمي
  private lastError: string | null = null; // آخر خطأ حدث
  private connectionStatus: 'connected' | 'offline' | 'error' = 'connected'; // حالة الاتصال
  private recommendationMode: boolean = false; // وضع التوصيات
  private reconnectAttempts: number = 0; // عدد محاولات إعادة الاتصال
  private maxReconnectAttempts: number = 3; // الحد الأقصى لمحاولات إعادة الاتصال

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
   * تهيئة جلسة المحادثة بمعالجة أخطاء محسنة
   */
  private async initializeChat(): Promise<void> {
    try {
      // استخدام نموذج gemini-1.5-pro للحصول على نتائج أفضل
      const model = genAI.getGenerativeModel(modelConfig);
      
      // استبدال [BOT_NAME] باسم المساعد المحدد
      const personalizedInstructions = systemInstruction.replace("[BOT_NAME]", this.botName);
      
      // إنشاء جلسة محادثة جديدة
      this.chatSession = model.startChat({
        history: [
          { role: "user", parts: [{ text: "ما هو دورك؟" }] },
          { role: "model", parts: [{ text: personalizedInstructions }] }
        ]
      });
      
      // إعادة تعيين التاريخ
      this.history = [];
      
      // تعيين حالة الاتصال إلى متصل وإعادة تعيين عداد محاولات إعادة الاتصال
      this.connectionStatus = 'connected';
      this.reconnectAttempts = 0;
      this.lastError = null;
      
      // اختبار الاتصال بالخدمة
      await this.testConnection();
      
    } catch (error) {
      console.error("فشل في تهيئة جلسة المحادثة:", error);
      this.handleConnectionError(error);
    }
  }

  /**
   * اختبار الاتصال بالخدمة
   */
  private async testConnection(): Promise<void> {
    try {
      // إرسال رسالة اختبار قصيرة للتأكد من الاتصال
      const testResult = await this.chatSession.sendMessage("مرحباً (اختبار الاتصال)");
      await testResult.response;
      
      // إذا نجح الاختبار، تعيين حالة الاتصال إلى متصل
      this.connectionStatus = 'connected';
    } catch (error) {
      // إذا فشل الاختبار، تعيين حالة الاتصال إلى خطأ
      this.handleConnectionError(error);
    }
  }

  /**
   * معالجة أخطاء الاتصال
   */
  private handleConnectionError(error: any): void {
    console.error("خطأ في الاتصال بخدمة Gemini:", error);
    
    // تعيين حالة الاتصال بناءً على نوع الخطأ
    if (error.message && (
        error.message.includes('network') || 
        error.message.includes('connection') ||
        error.message.includes('timeout')
      )) {
      this.connectionStatus = 'offline';
      this.lastError = "فشل الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.";
    } else {
      this.connectionStatus = 'error';
      this.lastError = "حدث خطأ غير متوقع في خدمة المحادثة.";
    }
    
    // زيادة عدد محاولات إعادة الاتصال
    this.reconnectAttempts++;
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
   * تشغيل/إيقاف وضع التوصيات المتخصص
   * يستخدم إعدادات مختلفة لتحسين تجربة التوصيات
   */
  public setRecommendationMode(enabled: boolean): void {
    this.recommendationMode = enabled;
    // إذا تم تغيير الوضع، قم بإعادة التهيئة للحصول على الإعدادات الجديدة
    this.initializeChat();
  }

  /**
   * الحصول على حالة الاتصال الحالية
   */
  public getConnectionStatus(): { status: 'connected' | 'offline' | 'error', error: string | null } {
    return {
      status: this.connectionStatus,
      error: this.lastError
    };
  }

  /**
   * إرسال رسالة إلى Gemini والحصول على رد مع دعم محسن للأخطاء والتوصيات
   */
  public async sendMessage(userMessage: string): Promise<string> {
    try {
      // التحقق من الإدخال
      if (!userMessage || userMessage.trim() === "") {
        return "يرجى إدخال رسالة صالحة.";
      }

      // التحقق من حالة الاتصال
      if (this.connectionStatus === 'offline') {
        // إذا كانت حالة الاتصال غير متصلة، محاولة إعادة الاتصال
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          await this.initializeChat();
          
          // إذا فشلت محاولة إعادة الاتصال، إرجاع رسالة خطأ
          if (this.connectionStatus === 'offline' || this.connectionStatus === 'error') {
            return `عذراً، ما زلنا نواجه مشكلة في الاتصال بخدمة المحادثة. (محاولة ${this.reconnectAttempts}/${this.maxReconnectAttempts})`;
          }
        } else {
          // إذا تجاوزنا الحد الأقصى لمحاولات إعادة الاتصال، إرجاع رسالة خطأ
          return "يبدو أن هناك مشكلة في الاتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى لاحقاً.";
        }
      }

      // التحقق من وجود جلسة محادثة
      if (!this.chatSession) {
        await this.initializeChat();
        if (!this.chatSession) {
          throw new Error("فشل في تهيئة المحادثة");
        }
      }

      // الكشف عن طلبات التوصية وتفعيل وضع التوصيات إذا لزم الأمر
      const isRecommendationQuery = this.detectRecommendationQuery(userMessage);
      if (isRecommendationQuery && !this.recommendationMode) {
        this.setRecommendationMode(true);
      }

      // إضافة رسالة المستخدم إلى التاريخ
      this.history.push({ role: "user", parts: [{ text: userMessage }] });
      
      // اختيار الإعدادات المناسبة بناءً على وضع التوصيات
      const config = this.recommendationMode ? recommendationConfig : geminiConfig;
      
      // الحصول على رد من Gemini
      const result = await this.chatSession.sendMessage(userMessage);
      const response = await result.response;
      const responseText = response.text();
      
      // إضافة رد النموذج إلى التاريخ
      this.history.push({ role: "model", parts: [{ text: responseText }] });
      
      // إذا كان رداً على توصية، إعادة وضع التوصيات إلى الإعداد الافتراضي
      if (isRecommendationQuery) {
        // بعد الرد على طلب التوصية، العودة إلى الوضع العادي
        setTimeout(() => this.setRecommendationMode(false), 100);
      }
      
      return responseText;
    } catch (error: any) {
      console.error("خطأ في إرسال الرسالة إلى Gemini:", error);
      
      // معالجة الخطأ بشكل أفضل
      this.handleConnectionError(error);
      
      // تحسين رسائل الخطأ لتكون أكثر فائدة للمستخدم
      if (error.message && error.message.includes('quota')) {
        return "عذراً، تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة مرة أخرى لاحقاً.";
      } else if (error.message && error.message.includes('content filtered')) {
        return "عذراً، لا يمكنني الإجابة على هذا السؤال بسبب قيود المحتوى. يرجى طرح سؤال آخر.";
      } else if (this.connectionStatus === 'offline') {
        return "يبدو أن هناك مشكلة في الاتصال بالإنترنت. ستتم محاولة إعادة الاتصال تلقائياً.";
      }
      
      // محاولة إعادة تهيئة المحادثة في حالة فشل الاتصال
      this.initializeChat();
      
      return "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.";
    }
  }

  /**
   * الكشف عما إذا كانت الرسالة تحتوي على طلب توصية
   */
  private detectRecommendationQuery(message: string): boolean {
    const recommendationKeywords = [
      'اقترح', 'توصية', 'اقتراح', 'ترشيح', 'أفضل عقار', 'أنسب عقار',
      'عقار مناسب', 'فيلا مناسبة', 'شاليه مناسب', 'ميزانية', 'سعر',
      'أفضل خيار', 'توصي', 'تنصح', 'عقار يناسب', 'نصيحة', 'مقارنة'
    ];
    
    message = message.toLowerCase();
    return recommendationKeywords.some(keyword => message.includes(keyword));
  }

  /**
   * إعادة ضبط المحادثة
   */
  public resetChat(): void {
    this.initializeChat();
  }

  /**
   * الحصول على التاريخ الحالي للمحادثة
   */
  public getChatHistory(): { role: string; parts: { text: string }[] }[] {
    return [...this.history];
  }
}

// تصدير نسخة وحيدة من الخدمة
export default GeminiService.getInstance();