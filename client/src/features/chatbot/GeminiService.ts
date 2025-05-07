import { GoogleGenerativeAI } from "@google/generative-ai";

// تهيئة Gemini API باستخدام المفتاح المخزن في متغيرات البيئة
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// إعداد نموذج Gemini
const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest"
});

// إعداد سياق المحادثة الافتراضي
const defaultContext = `
أنت مساعد ذكي ودود متخصص في مساعدة العملاء في العثور على العقارات المناسبة والإجابة عن أسئلتهم.
تحدث باللغة العربية الفصحى السهلة والمفهومة.
قدم إجابات مختصرة ومفيدة.
ركز على تقديم معلومات دقيقة عن العقارات والخدمات التي نقدمها.
`;

// إنشاء فئة خدمة Gemini
export class GeminiService {
  private chatSession: any;
  private chatHistory: { role: string; parts: string }[] = [];
  private botName: string;

  constructor(botName: string = "ستايكس") {
    this.botName = botName;
    this.initializeChat();
  }

  // تهيئة المحادثة
  private initializeChat() {
    this.chatSession = geminiModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "مرحباً، هل يمكنك مساعدتي في البحث عن عقار؟" }],
        },
        {
          role: "model",
          parts: [{ text: `مرحباً! أنا ${this.botName}، المساعد الرقمي الخاص بـ StayX. بالتأكيد يمكنني مساعدتك في البحث عن العقار المناسب. هل تبحث عن نوع معين من العقارات مثل شقة، فيلا، أو استوديو؟ وهل لديك منطقة معينة تفضلها؟` }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    });

    // تخزين تاريخ المحادثة المبدئي
    this.chatHistory = [
      {
        role: "user",
        parts: "مرحباً، هل يمكنك مساعدتي في البحث عن عقار؟",
      },
      {
        role: "model",
        parts: `مرحباً! أنا ${this.botName}، المساعد الرقمي الخاص بـ StayX. بالتأكيد يمكنني مساعدتك في البحث عن العقار المناسب. هل تبحث عن نوع معين من العقارات مثل شقة، فيلا، أو استوديو؟ وهل لديك منطقة معينة تفضلها؟`,
      },
    ];
  }

  // الحصول على تاريخ المحادثة
  public getChatHistory() {
    return this.chatHistory;
  }

  // إعادة تعيين المحادثة
  public resetChat() {
    this.initializeChat();
    return this.chatHistory;
  }

  // تعيين اسم الروبوت
  public setBotName(name: string) {
    this.botName = name;
    this.resetChat();
  }

  // الحصول على اسم الروبوت
  public getBotName() {
    return this.botName;
  }

  // إرسال رسالة إلى الروبوت والحصول على استجابة
  public async sendMessage(message: string): Promise<string> {
    try {
      // إضافة رسالة المستخدم إلى تاريخ المحادثة
      this.chatHistory.push({
        role: "user",
        parts: message,
      });

      // إرسال الرسالة إلى Gemini وانتظار الرد
      const result = await this.chatSession.sendMessage(message);
      const response = await result.response;
      const responseText = response.text();

      // إضافة رد الروبوت إلى تاريخ المحادثة
      this.chatHistory.push({
        role: "model",
        parts: responseText,
      });

      return responseText;
    } catch (error) {
      console.error("خطأ في التواصل مع Gemini API:", error);
      return "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.";
    }
  }
}

// إنشاء نسخة واحدة من الخدمة يمكن استخدامها عبر التطبيق
const geminiService = new GeminiService();
export default geminiService;