import React, { useState, useEffect, useRef } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider, StyleSheetManager } from 'styled-components';
import geminiService from './GeminiService';
import { SafeStyleProvider } from './StyledChatbotComponents';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { MessageSquare, X, Settings, Zap, Rocket, Bot, Sparkles, User, RefreshCw, Home, Search, Star, Building, BedDouble, Bath, DollarSign } from 'lucide-react';

// زر وصول سريع للخدمات
const QuickButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(57, 255, 20, 0.1);
  color: #39FF14;
  font-size: 0.8rem;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  border: 1px solid rgba(57, 255, 20, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 0 5px rgba(57, 255, 20, 0.2);
  
  &:hover {
    background-color: rgba(57, 255, 20, 0.2);
    border-color: rgba(57, 255, 20, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(57, 255, 20, 0.3);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(57, 255, 20, 0.2);
  }
`;

// تعريف نوع الخصائص التي يستقبلها المكون
interface SimplifiedChatbotProps {
  botName?: string; // إمكانية تخصيص اسم الروبوت
  position?: 'bottom-right' | 'bottom-left'; // موقع فقاعة المحادثة
}

// نمط تصميم بتأثير الفضاء والتكنولوجيا
const spaceTheme = {
  background: 'rgba(0, 0, 0, 0.8)',
  fontFamily: 'Cairo, Arial, sans-serif',
  headerBgColor: '#111827',
  headerFontColor: '#39FF14',
  headerFontSize: '16px',
  botBubbleColor: '#1E293B',
  botFontColor: '#FFFFFF',
  userBubbleColor: '#39FF14',
  userFontColor: '#000000',
};

// تنسيق حاوية الشات
const ChatbotContainer = styled.div<{ $isOpen: boolean; $position: string }>`
  position: fixed;
  bottom: ${props => props.$isOpen ? '0' : '-600px'};
  ${props => props.$position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
  width: 350px;
  max-width: 90vw;
  z-index: 1000;
  transition: bottom 0.5s ease-in-out;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  box-shadow: 0 -5px 20px rgba(57, 255, 20, 0.3);
  direction: rtl;
`;

// زر فتح الشات
const ChatButton = styled(motion.button)<{ $position: string }>`
  position: fixed;
  bottom: 20px;
  ${props => props.$position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #39FF14;
  color: #39FF14;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.5);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  overflow: hidden;

  &:hover {
    box-shadow: 0 0 20px rgba(57, 255, 20, 0.8);
    transform: scale(1.05);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(57, 255, 20, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
    opacity: 0;
    animation: pulse 3s linear infinite;
    pointer-events: none;
  }
  
  @keyframes pulse {
    0% { transform: scale(0.5); opacity: 0; }
    50% { opacity: 0.3; }
    100% { transform: scale(1.2); opacity: 0; }
  }
`;

// رأس مخصص للشات
const CustomHeader = styled.div`
  background: linear-gradient(90deg, #111827 0%, #1a2035 100%);
  color: #39FF14;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(57, 255, 20, 0.3);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(57, 255, 20, 0.8), transparent);
    animation: scanline 3s linear infinite;
  }
  
  @keyframes scanline {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  
  & > svg {
    filter: drop-shadow(0 0 3px rgba(57, 255, 20, 0.7));
    animation: pulse-icon 2s ease-in-out infinite;
  }
  
  @keyframes pulse-icon {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 10px;
`;

const ControlButton = styled.button`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(57, 255, 20, 0.2);
  border-radius: 4px;
  color: #39FF14;
  cursor: pointer;
  transition: all 0.2s;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1);
    background: rgba(57, 255, 20, 0.15);
    border-color: rgba(57, 255, 20, 0.5);
    box-shadow: 0 0 5px rgba(57, 255, 20, 0.5);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const BotNameInput = styled.input`
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #39FF14;
  border-radius: 4px;
  color: white;
  padding: 8px 12px;
  width: calc(100% - 20px);
  margin: 10px;
  font-family: 'Cairo, Arial, sans-serif';
  
  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(57, 255, 20, 0.8);
  }
`;

const SettingsPanel = styled(motion.div)`
  background: rgba(0, 0, 0, 0.95);
  padding: 15px;
  border-top: 1px solid rgba(57, 255, 20, 0.3);
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(57, 255, 20, 0.5), transparent);
  }
`;

const SettingsTitle = styled.div`
  color: #39FF14;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ThinkingDots = styled.div`
  display: inline-flex;
  align-items: center;
  
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #39FF14;
    margin: 0 2px;
    animation: thinking 1.4s infinite ease-in-out both;
  }
  
  .dot:nth-child(1) { animation-delay: -0.32s; }
  .dot:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes thinking {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

const CircuitBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.1;
  overflow: hidden;
`;

// مكون فقاعة المحادثة الرئيسي
const SimplifiedChatbot: React.FC<SimplifiedChatbotProps> = ({ 
  botName: initialBotName = 'ستايكس',
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [botName, setBotName] = useState(initialBotName || geminiService.getBotName());
  const [steps, setSteps] = useState<any[]>([]);
  const [chatKey, setChatKey] = useState(Date.now());
  const chatbotRef = useRef<any>(null);
  
  // مكون لعرض رسالة التفكير مع النقاط المتحركة
  const ThinkingIndicator = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Bot size={18} color="#39FF14" />
      <span style={{ color: '#e0e0e0' }}>جاري التفكير</span>
      <ThinkingDots>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </ThinkingDots>
    </div>
  );

  // مكون لعرض حالة الخطأ في الاتصال
  const ConnectionErrorIndicator = ({ retry }: { retry: () => void }) => {
    const { status, error } = geminiService.getConnectionStatus();
    return (
      <div className="bg-black/60 p-3 rounded-lg border border-red-500/40 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-red-400">
          {status === 'offline' ? (
            <Zap size={16} className="animate-pulse" />
          ) : (
            <X size={16} className="animate-pulse" />
          )}
          <span className="text-sm font-medium">
            {status === 'offline' ? 'مشكلة في الاتصال' : 'خطأ في الخدمة'}
          </span>
        </div>
        <p className="text-xs text-gray-300 mt-1">
          {error || 'حدث خطأ أثناء الاتصال بالخدمة. يرجى المحاولة مرة أخرى.'}
        </p>
        <button 
          onClick={retry}
          className="mt-2 bg-[#39FF14]/10 hover:bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30 rounded px-3 py-1 text-xs flex items-center gap-1 w-fit"
        >
          <RefreshCw size={12} />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    );
  };
  
  // أزرار سريعة للوصول إلى خدمات التوصية العقارية
  const QuickAccessButtons = () => {
    const handleQuickQuestion = (question: string) => {
      if (chatbotRef.current && chatbotRef.current.triggerNextStep) {
        chatbotRef.current.triggerNextStep({ 
          value: question, 
          trigger: 'userInput' 
        });
      }
    };
    
    return (
      <div className="flex flex-wrap gap-2 mt-4 mb-2 justify-center">
        <QuickButton onClick={() => handleQuickQuestion('ابحث لي عن أفضل فيلا فاخرة في راس الحكمة')}>
          <Building size={14} className="ml-1" />
          <span>فيلا فاخرة</span>
        </QuickButton>
        
        <QuickButton onClick={() => handleQuickQuestion('اقترح لي شاليه رخيص قريب من الشاطئ')}>
          <Home size={14} className="ml-1" />
          <span>شاليه رخيص</span>
        </QuickButton>
        
        <QuickButton onClick={() => handleQuickQuestion('أي عقار مناسب لعائلة مكونة من 6 أشخاص؟')}>
          <User size={14} className="ml-1" />
          <span>لعائلة كبيرة</span>
        </QuickButton>
        
        <QuickButton onClick={() => handleQuickQuestion('ما هو أفضل عقار مميز للإيجار؟')}>
          <Star size={14} className="ml-1" />
          <span>الأكثر تميزاً</span>
        </QuickButton>
      </div>
    );
  };
  
  // تهيئة خطوات المحادثة - تصحيح البنية لتجنب الأخطاء
  useEffect(() => {
    const initialSteps = [
      {
        id: 'welcome',
        message: `مرحباً! أنا ${botName}، المساعد الرقمي الخاص بـ StayX. يمكنني مساعدتك في اختيار أفضل العقارات المناسبة لك وتقديم توصيات شخصية بناءً على احتياجاتك. ما الذي تبحث عنه اليوم؟`,
        trigger: 'userInput',
      },
      {
        id: 'userInput',
        user: true,
        trigger: 'thinking',
      },
      {
        id: 'thinking',
        message: 'جاري التفكير...',
        trigger: 'botResponse',
      },
      {
        id: 'botResponse',
        message: 'سأساعدك في إيجاد أفضل العقارات المناسبة لك.',
        trigger: 'userInput',
      },
    ];
    
    setSteps(initialSteps);
  }, [botName]);
  
  // معالجة رسائل المستخدم
  const handleUserMessage = async (message: string, nextStep: any) => {
    try {
      // طلب استجابة من خدمة Gemini
      let responseText = '';
      
      try {
        // Usando el método sendMessage que existe en GeminiService
        responseText = await geminiService.sendMessage(message);
      } catch (error) {
        console.error('خطأ في استجابة المساعد:', error);
        responseText = 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.';
      }
      
      // تحديث الخطوة التالية مع الاستجابة
      nextStep({
        value: responseText,
        trigger: 'userInput',
      });
    } catch (err) {
      console.error('خطأ في معالجة رسالة المستخدم:', err);
      nextStep({
        value: 'عذراً، حدث خطأ أثناء معالجة رسالتك. يرجى المحاولة مرة أخرى.',
        trigger: 'userInput',
      });
    }
  };
  
  // إعادة ضبط المحادثة
  const resetChat = () => {
    setChatKey(Date.now());
    // No es necesario resetear el estado de conexión, solo generamos una nueva clave de chat
  };
  
  // حفظ تغييرات الإعدادات
  const saveSettings = () => {
    geminiService.setBotName(botName);
    setIsSettingsOpen(false);
  };
  
  // التبديل بين فتح وإغلاق الشات
  const toggleChat = () => {
    if (!isOpen) {
      // إذا كان سيتم فتح الشات، أغلق لوحة الإعدادات
      setIsSettingsOpen(false);
    }
    setIsOpen(!isOpen);
  };
  
  // التبديل بين فتح وإغلاق لوحة الإعدادات
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };
  
  return (
    <>
      {/* زر فتح الشات */}
      <AnimatePresence>
        {!isOpen && (
          <ChatButton 
            $position={position}
            onClick={toggleChat}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare size={24} />
          </ChatButton>
        )}
      </AnimatePresence>
      
      {/* حاوية الشات */}
      <ChatbotContainer $isOpen={isOpen} $position={position}>
        {/* رأس مخصص للشات */}
        <CustomHeader>
          <HeaderTitle>
            <Bot size={20} />
            <span>{botName}</span>
          </HeaderTitle>
          <HeaderControls>
            <ControlButton onClick={toggleSettings} title="الإعدادات">
              <Settings size={16} />
            </ControlButton>
            <ControlButton onClick={resetChat} title="إعادة ضبط المحادثة">
              <RefreshCw size={16} />
            </ControlButton>
            <ControlButton onClick={toggleChat} title="إغلاق">
              <X size={16} />
            </ControlButton>
          </HeaderControls>
        </CustomHeader>
        
        {/* لوحة الإعدادات (تظهر وتختفي) */}
        <AnimatePresence>
          {isSettingsOpen && (
            <SettingsPanel
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsTitle>
                <Settings size={16} />
                <span>إعدادات المساعد</span>
              </SettingsTitle>
              <div>
                <label htmlFor="botName" style={{ color: '#e0e0e0', fontSize: '12px' }}>
                  اسم المساعد:
                </label>
                <BotNameInput
                  id="botName"
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="اسم المساعد الافتراضي"
                />
              </div>
              <div className="flex justify-end mt-3">
                <button
                  onClick={saveSettings}
                  className="bg-[#39FF14]/10 hover:bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/30 rounded px-3 py-1 text-xs"
                >
                  حفظ التغييرات
                </button>
              </div>
            </SettingsPanel>
          )}
        </AnimatePresence>
        
        {/* خلفية الدوائر الكهربائية */}
        <CircuitBackground>
          <div className="circuit-lines"></div>
        </CircuitBackground>
        
        {/* الشات بوت نفسه */}
        <div style={{ height: isSettingsOpen ? 'calc(500px - 80px)' : '500px' }}>
          <ThemeProvider theme={spaceTheme}>
            <div className="flex flex-col h-full">
              {/* عرض مؤشر الخطأ إذا كان هناك مشكلة في الاتصال */}
              {geminiService.getConnectionStatus().status !== 'connected' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[80%]">
                  <ConnectionErrorIndicator retry={resetChat} />
                </div>
              )}
              
              <StyleSheetManager shouldForwardProp={(prop) => !prop.startsWith('$')}>
                <ChatBot
                  key={chatKey}
                  steps={steps}
                  handleEnd={() => {}} 
                  headerTitle={botName}
                  placeholder="اكتب رسالتك هنا..."
                  botAvatar="/assets/bot-avatar.svg"
                  userAvatar="/assets/user-avatar.svg"
                  hideHeader={true}
                  hideSubmitButton={true}
                  enableMobileAutoFocus={true}
                  enableSmoothScroll={true}
                  recognitionEnable={false}
                  ref={chatbotRef}
                />
              </StyleSheetManager>
              
              {/* شريط أزرار التوصيات السريعة */}
              <div className="bg-gradient-to-t from-black to-transparent py-2 px-4">
                <div className="text-center text-[11px] text-[#39FF14] mb-1 flex items-center justify-center gap-1">
                  <Rocket size={10} className="animate-pulse" />
                  <span>توصيات سريعة</span>
                </div>
                <QuickAccessButtons />
              </div>
            </div>
          </ThemeProvider>
        </div>
      </ChatbotContainer>
    </>
  );
};

export default SimplifiedChatbot;