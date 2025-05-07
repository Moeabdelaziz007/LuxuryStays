import React, { useState, useEffect, useRef } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import geminiService from './GeminiService';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { MessageSquare, X, Settings, Zap } from 'lucide-react';

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

// تنسيق أوسع للعناصر في الواجهة
const ChatbotContainer = styled.div<{ isOpen: boolean }>\`
  position: fixed;
  bottom: ${props => props.isOpen ? '0' : '-600px'};
  right: 20px;
  width: 350px;
  max-width: 90vw;
  z-index: 1000;
  transition: bottom 0.5s ease-in-out;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  box-shadow: 0 -5px 20px rgba(57, 255, 20, 0.3);
  direction: rtl;
\`;

const ChatButton = styled(motion.button)\`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: black;
  border: 2px solid #39FF14;
  color: #39FF14;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.5);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px rgba(57, 255, 20, 0.8);
    transform: scale(1.05);
  }
\`;

const CustomHeader = styled.div\`
  background-color: #111827;
  color: #39FF14;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(57, 255, 20, 0.3);
\`;

const HeaderTitle = styled.div\`
  display: flex;
  align-items: center;
  gap: 10px;
\`;

const HeaderControls = styled.div\`
  display: flex;
  gap: 10px;
\`;

const ControlButton = styled.button\`
  background: none;
  border: none;
  color: #39FF14;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
\`;

const BotNameInput = styled.input\`
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #39FF14;
  border-radius: 4px;
  color: white;
  padding: 8px 12px;
  width: calc(100% - 20px);
  margin: 10px;
  font-family: 'Cairo', Arial, sans-serif;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(57, 255, 20, 0.8);
  }
\`;

const SettingsPanel = styled(motion.div)\`
  background: rgba(0, 0, 0, 0.95);
  padding: 15px;
  border-top: 1px solid rgba(57, 255, 20, 0.3);
\`;

const CircuitBackground = styled.div\`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.1;
  overflow: hidden;
\`;

// خطوات الروبوت المحدد كمصفوفة
const initialSteps = [
  {
    id: 'welcome',
    message: 'مرحباً! أنا المساعد الرقمي الخاص بـ StayX. كيف يمكنني مساعدتك اليوم؟',
    trigger: 'userInput',
  },
  {
    id: 'userInput',
    user: true,
    trigger: 'botResponse',
  },
  {
    id: 'botResponse',
    component: <div>جاري التفكير...</div>,
    asMessage: true,
    waitAction: true,
    trigger: 'userInput',
  },
];

// مكون الروبوت المحادث
const SpaceChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [botName, setBotName] = useState(geminiService.getBotName());
  const [steps, setSteps] = useState(initialSteps);
  const [chatKey, setChatKey] = useState(Date.now()); // مفتاح لإعادة تحميل الشات
  const chatbotRef = useRef<any>(null);
  
  // تحديث الخطوات عندما يتغير اسم الروبوت
  useEffect(() => {
    // تحديث رسالة الترحيب باسم الروبوت الجديد
    const updatedSteps = [...initialSteps];
    updatedSteps[0] = {
      ...updatedSteps[0],
      message: `مرحباً! أنا ${botName}، المساعد الرقمي الخاص بـ StayX. كيف يمكنني مساعدتك اليوم؟`,
    };
    setSteps(updatedSteps);
    
    // تحديث اسم الروبوت في الخدمة
    geminiService.setBotName(botName);
    
    // إعادة تحميل الشات
    setChatKey(Date.now());
  }, [botName]);

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
      console.error("Error in chat:", error);
      nextStep.value = "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.";
      nextStep.trigger();
    }
  };

  return (
    <>
      {/* زر فتح الشات */}
      <ChatButton
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
      <ChatbotContainer isOpen={isOpen}>
        {/* رأس مخصص */}
        <CustomHeader>
          <HeaderTitle>
            <Zap size={20} />
            <span>{botName}</span>
          </HeaderTitle>
          <HeaderControls>
            <ControlButton onClick={resetChat} title="إعادة ضبط المحادثة">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" />
                <path d="M9 9L15 15" />
                <path d="M15 9L9 15" />
              </svg>
            </ControlButton>
            <ControlButton onClick={toggleSettings} title="الإعدادات">
              <Settings size={16} />
            </ControlButton>
            <ControlButton onClick={toggleChat} title="إغلاق">
              <X size={16} />
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
              <div>
                <label htmlFor="botName" style={{ color: '#39FF14', display: 'block', marginBottom: '5px' }}>
                  اسم المساعد:
                </label>
                <BotNameInput
                  id="botName"
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="أدخل اسم المساعد"
                />
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
            <ChatBot
              key={chatKey}
              steps={steps}
              handleEnd={() => {}} // لا شيء عند الانتهاء
              headerTitle={botName}
              placeholder="اكتب رسالتك هنا..."
              botAvatar="/assets/bot-avatar.png"
              userAvatar="/assets/user-avatar.png"
              customDelay={10}
              hideHeader={true}
              hideSubmitButton={true}
              hideUserAvatar={false}
              botDelay={1000}
              customStyle={{
                boxShadow: 'none',
                borderRadius: '0',
                height: '100%',
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
          </ThemeProvider>
        </div>
      </ChatbotContainer>
    </>
  );
};

export default SpaceChatBot;