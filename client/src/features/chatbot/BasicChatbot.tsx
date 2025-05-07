import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { MessageSquare, X, Settings, RefreshCw, Bot, Send } from 'lucide-react';
import geminiService from './GeminiService';

// Estilizado básico del componente
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
  background-color: #111827;
`;

// Botón para abrir el chat
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
`;

// Cabecera del chat
const ChatHeader = styled.div`
  background: linear-gradient(90deg, #111827 0%, #1a2035 100%);
  color: #39FF14;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(57, 255, 20, 0.3);
`;

// Contenedor de mensajes
const MessagesContainer = styled.div`
  height: 350px;
  overflow-y: auto;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
`;

// Mensaje base
const Message = styled.div`
  margin-bottom: 10px;
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 12px;
  font-size: 14px;
`;

// Mensaje del usuario
const UserMessage = styled(Message)`
  align-self: flex-start;
  background-color: #39FF14;
  color: #000;
  border-radius: 18px 8px 18px 18px;
`;

// Mensaje del bot
const BotMessage = styled(Message)`
  align-self: flex-end;
  background-color: #1E293B;
  color: #fff;
  border-radius: 8px 18px 18px 18px;
`;

// Área de entrada
const InputArea = styled.div`
  display: flex;
  padding: 10px;
  background-color: #111827;
  border-top: 1px solid rgba(57, 255, 20, 0.3);
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid rgba(57, 255, 20, 0.5);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-family: 'Cairo, Arial, sans-serif';
  margin-left: 10px;
  
  &:focus {
    outline: none;
    border-color: #39FF14;
    box-shadow: 0 0 5px rgba(57, 255, 20, 0.5);
  }
`;

const SendButton = styled.button`
  background-color: rgba(57, 255, 20, 0.2);
  color: #39FF14;
  border: 1px solid rgba(57, 255, 20, 0.5);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(57, 255, 20, 0.3);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// Definición de tipos
interface BasicChatbotProps {
  botName?: string;
  position?: 'bottom-right' | 'bottom-left';
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Componente principal
const BasicChatbot: React.FC<BasicChatbotProps> = ({ 
  botName = 'ستايكس',
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: `مرحباً! أنا ${botName}، المساعد الرقمي الخاص بـ StayX. يمكنني مساعدتك في اختيار أفضل العقارات المناسبة لك وتقديم توصيات شخصية بناءً على احتياجاتك. ما الذي تبحث عنه اليوم؟`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Desplazar al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Manejar envío de mensaje
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Obtener respuesta de Gemini API
      const botResponse = await geminiService.sendMessage(inputValue);
      
      // Agregar respuesta del bot
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al obtener respuesta:', error);
      
      // Agregar mensaje de error
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Alternar apertura del chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Limpiar chat
  const resetChat = () => {
    setMessages([
      {
        id: 'welcome',
        text: `مرحباً! أنا ${botName}، المساعد الرقمي الخاص بـ StayX. كيف يمكنني مساعدتك اليوم؟`,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      {/* Botón flotante */}
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
      
      {/* Contenedor del chat */}
      <ChatbotContainer $isOpen={isOpen} $position={position}>
        {/* Cabecera */}
        <ChatHeader>
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-[#39FF14]" />
            <span>{botName}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={resetChat}
              className="bg-black/30 border border-[#39FF14]/20 rounded p-1 hover:bg-[#39FF14]/10"
            >
              <RefreshCw size={16} className="text-[#39FF14]" />
            </button>
            <button 
              onClick={toggleChat}
              className="bg-black/30 border border-[#39FF14]/20 rounded p-1 hover:bg-[#39FF14]/10"
            >
              <X size={16} className="text-[#39FF14]" />
            </button>
          </div>
        </ChatHeader>
        
        {/* Contenedor de mensajes */}
        <MessagesContainer>
          {messages.map(message => (
            message.sender === 'user' ? (
              <UserMessage key={message.id}>{message.text}</UserMessage>
            ) : (
              <BotMessage key={message.id}>{message.text}</BotMessage>
            )
          ))}
          
          {isLoading && (
            <BotMessage key="loading">جاري التفكير...</BotMessage>
          )}
          
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        {/* Área de entrada */}
        <InputArea>
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالتك هنا..."
            disabled={isLoading}
          />
          <SendButton onClick={handleSendMessage} disabled={isLoading}>
            <Send size={16} />
          </SendButton>
        </InputArea>
      </ChatbotContainer>
    </>
  );
};

export default BasicChatbot;