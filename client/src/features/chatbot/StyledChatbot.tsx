import React from 'react';
// Al importar así, evitamos errores de tipado
import * as ReactSimpleChatbot from 'react-simple-chatbot';
import styled from 'styled-components';

// Importamos el componente ChatBot directamente
const ChatBot = ReactSimpleChatbot.default;

// Componente envoltorio para propiedades que necesitan el prefijo $
interface StyledChatbotContainerProps {
  $opened?: boolean;
  $invalid?: boolean;
  $hasButton?: boolean;
}

// Componente div estilizado que acepta propiedades con prefijo $
const StyledContainer = styled.div<StyledChatbotContainerProps>`
  /* Estilos base del contenedor */
  width: 100%;
  height: 100%;
`;

// Props del componente que extiende lo que ChatBot acepta
interface StyledChatbotProps {
  steps: any[];
  opened?: boolean;
  invalid?: boolean;
  hasButton?: boolean;
  className?: string;
  botAvatar?: string;
  botDelay?: number;
  bubbleOptionStyle?: object;
  bubbleStyle?: object;
  headerTitle?: string;
  footerStyle?: object;
  headerComponent?: React.ReactNode;
  placeholder?: string;
  userAvatar?: string;
  width?: string;
  height?: string;
  enableMobileAutoFocus?: boolean;
  enableSmoothScroll?: boolean;
  style?: object;
  customStyle?: object;
  floating?: boolean;
  inputStyle?: object;
  recognitionEnable?: boolean;
  hideHeader?: boolean;
  hideSubmitButton?: boolean;
  handleUserMessage?: (message: string, nextStep: any) => Promise<any>;
  ref?: React.RefObject<any>;
  cacheName?: string;
  cache?: boolean;
  [key: string]: any; // Para cualquier otra propiedad que pueda necesitar
}

/**
 * Componente envoltorio para el ChatBot que maneja correctamente las propiedades
 * con prefijo $ para evitar advertencias de styled-components
 */
const StyledChatbot: React.FC<StyledChatbotProps> = ({
  opened,
  invalid,
  hasButton,
  steps,
  ...otherProps
}) => {
  return (
    <StyledContainer
      $opened={opened}
      $invalid={invalid}
      $hasButton={hasButton}
      className="styled-chatbot-wrapper"
    >
      <ChatBot 
        {...otherProps} 
        steps={steps}
        opened={opened} 
      />
    </StyledContainer>
  );
};

export default StyledChatbot;