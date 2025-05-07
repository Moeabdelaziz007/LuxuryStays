import React, { useState, useEffect, useRef } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import geminiService from './GeminiService';
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
interface SpaceBubbleBotProps {
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
const ChatbotContainer = styled.div<{ isOpen: boolean; position: string }>`
  position: fixed;
  bottom: ${props => props.isOpen ? '0' : '-600px'};
  ${props => props.position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
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
const ChatButton = styled(motion.button)<{ position: string }>`
  position: fixed;
  bottom: 20px;
  ${props => props.position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
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
const SpaceBubbleBot: React.FC<SpaceBubbleBotProps> = ({ 
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
  
  // تهيئة خطوات المحادثة
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
        trigger: 'botResponse',
      },
      {
        id: 'botResponse',
        component: <ThinkingIndicator />,
        asMessage: true,
        waitAction: true,
        trigger: 'userInput',
      },
    ];
    
    setSteps(initialSteps);
    
    // تحديث اسم الروبوت في الخدمة إذا تم تمريره كخاصية
    if (initialBotName && initialBotName !== geminiService.getBotName()) {
      geminiService.setBotName(initialBotName);
    }
  }, [initialBotName]);
  
  // تحديث الخطوات عندما يتغير اسم الروبوت
  useEffect(() => {
    if (!steps.length) return;
    
    // تحديث رسالة الترحيب باسم الروبوت الجديد
    const updatedSteps = [...steps];
    if (updatedSteps[0]) {
      updatedSteps[0] = {
        ...updatedSteps[0],
        message: `مرحباً! أنا ${botName}، المساعد الرقمي الخاص بـ StayX. يمكنني مساعدتك في اختيار أفضل العقارات المناسبة لك وتقديم توصيات شخصية بناءً على احتياجاتك. ما الذي تبحث عنه اليوم؟`,
      };
      setSteps(updatedSteps);
    }
    
    // تحديث اسم الروبوت في الخدمة
    geminiService.setBotName(botName);
    
    // إعادة تحميل الشات
    setChatKey(Date.now());
  }, [botName, steps]);

  // فتح/إغلاق الشات
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isSettingsOpen) {
      setIsSettingsOpen(false);
    }
  };

  // فتح/إغلاق الإعدادات
  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  // إعادة ضبط المحادثة
  const resetChat = () => {
    geminiService.resetChat();
    setChatKey(Date.now());
  };

  // المعالج الذي يرسل رسالة المستخدم إلى Gemini ويعالج الرد
  const handleUserMessage = async (message: string, nextStep: any) => {
    try {
      // استدعاء خدمة Gemini للحصول على الرد
      const response = await geminiService.sendMessage(message);
      
      // إرسال الرد إلى الشات
      nextStep.value = response;
      nextStep.completed = true;
      nextStep.trigger();
    } catch (error) {
      console.error("خطأ في التواصل مع Gemini API:", error);
      nextStep.value = "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.";
      nextStep.trigger();
    }
  };

  if (!steps.length) {
    return null; // انتظر حتى تكتمل تهيئة الخطوات
  }

  return (
    <>
      {/* زر فتح الشات */}
      <ChatButton
        position={position}
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          boxShadow: isOpen 
            ? '0 0 10px rgba(57, 255, 20, 0.8)' 
            : ['0 0 10px rgba(57, 255, 20, 0.3)', '0 0 20px rgba(57, 255, 20, 0.6)', '0 0 10px rgba(57, 255, 20, 0.3)'] 
        }}
        transition={{ 
          boxShadow: { 
            repeat: isOpen ? 0 : Infinity, 
            duration: isOpen ? 0 : 2 
          } 
        }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </ChatButton>
      
      {/* حاوية الشات */}
      <ChatbotContainer isOpen={isOpen} position={position}>
        {/* رأس مخصص */}
        <CustomHeader>
          <HeaderTitle>
            <Bot size={20} className="text-[#39FF14]" />
            <span className="text-glow">{botName}</span>
            <motion.div 
              className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-green-500" 
              animate={{ 
                boxShadow: ['0 0 2px #39FF14', '0 0 6px #39FF14', '0 0 2px #39FF14'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </HeaderTitle>
          <HeaderControls>
            <ControlButton onClick={resetChat} title="إعادة ضبط المحادثة">
              <RefreshCw size={14} />
            </ControlButton>
            <ControlButton 
              onClick={toggleSettings} 
              title="الإعدادات"
              className={isSettingsOpen ? 'bg-[#39FF14]/20 border-[#39FF14]/40' : ''}
            >
              <Settings size={14} />
            </ControlButton>
            <ControlButton onClick={toggleChat} title="إغلاق">
              <X size={14} />
            </ControlButton>
          </HeaderControls>
        </CustomHeader>
        
        {/* لوحة الإعدادات */}
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
                <span>إعدادات المساعد الرقمي</span>
              </SettingsTitle>
              
              <div className="bg-black/40 p-3 rounded-md border border-[#39FF14]/20 mb-3">
                <label htmlFor="botName" style={{ color: '#39FF14', display: 'block', marginBottom: '5px', fontSize: '13px' }}>
                  اسم المساعد:
                </label>
                <div className="flex items-center gap-2">
                  <Bot size={16} className="text-[#39FF14]" />
                  <BotNameInput
                    id="botName"
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="أدخل اسم المساعد"
                  />
                </div>
                <small className="text-gray-400 mt-2 inline-block text-[11px]">
                  <Sparkles size={12} className="inline mr-1 text-yellow-400" />
                  اختر اسماً مناسباً للمساعد الرقمي الخاص بك
                </small>
              </div>
              
              <div className="flex justify-between items-center">
                <small className="text-gray-400 text-[11px]">Powered by Google Gemini AI</small>
                <button
                  onClick={resetChat}
                  className="flex items-center gap-1 text-xs bg-[#39FF14]/10 text-[#39FF14] px-3 py-1 rounded-md border border-[#39FF14]/30 hover:bg-[#39FF14]/20 transition-colors"
                >
                  <RefreshCw size={12} /> إعادة تعيين المحادثة
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
              <ChatBot
                key={chatKey}
                steps={steps}
                handleEnd={() => {}} // لا شيء عند الانتهاء
                headerTitle={botName}
                placeholder="اكتب رسالتك هنا..."
                botAvatar="/assets/bot-avatar.svg"
                userAvatar="/assets/user-avatar.svg"
                customDelay={10}
                hideHeader={true}
                hideSubmitButton={true}
                hideUserAvatar={false}
                botDelay={1000}
                customStyle={{
                  boxShadow: 'none',
                  borderRadius: '0',
                  height: 'calc(100% - 60px)', // تخصيص مساحة للتوصيات السريعة
                }}
                contentStyle={{
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                }}
                bubbleOptionStyle={{
                  background: '#39FF14',
                  color: 'black',
                }}
                bubbleStyle={{
                  maxWidth: '80%',
                  padding: '12px 15px',
                  borderRadius: '18px',
                  fontSize: '14px',
                }}
                footerStyle={{
                  background: '#111827',
                  borderTop: '1px solid rgba(57, 255, 20, 0.3)',
                }}
                inputStyle={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  border: '1px solid rgba(57, 255, 20, 0.5)',
                  borderRadius: '20px',
                  padding: '12px 15px',
                  fontFamily: 'Cairo, Arial, sans-serif',
                }}
                enableMobileAutoFocus={true}
                enableSmoothScroll={true}
                recognitionEnable={false}
                ref={chatbotRef}
                handleUserMessage={handleUserMessage}
              />
              
              {/* شريط أزرار التوصيات السريعة */}
              <div className="bg-gradient-to-t from-black to-transparent py-2 px-4">
                <div className="text-center text-[11px] text-[#39FF14] mb-1 flex items-center justify-center gap-1">
                  <Rocket size={10} className="animate-pulse" />
                  <span>توصيات عقارية سريعة</span>
                  <Rocket size={10} className="animate-pulse transform rotate-180" />
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

export default SpaceBubbleBot;