import React, { useState, useEffect } from 'react';
import BasicChatbot from '@/features/chatbot/BasicChatbot';

/**
 * Componente de carga diferida para el chatbot
 * 
 * Este componente:
 * 1. Retrasa la carga del chatbot para mejorar el rendimiento inicial de la página
 * 2. Solo carga el chatbot cuando la página principal ya está visible
 * 3. Proporciona una forma de controlar cuándo se muestra el chatbot
 */
const ChatLoader: React.FC = () => {
  const [showChat, setShowChat] = useState<boolean>(false);
  
  useEffect(() => {
    // Retrasar la carga del chatbot para priorizar el renderizado de la página principal
    const timer = setTimeout(() => {
      setShowChat(true);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!showChat) return null;
  
  return <BasicChatbot botName="ستايكس" position="bottom-right" />;
};

export default ChatLoader;