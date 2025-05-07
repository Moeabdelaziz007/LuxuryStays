import React from 'react';
// Al importar así, evitamos errores de tipado
import * as ReactSimpleChatbot from 'react-simple-chatbot';
import styled, { StyleSheetManager } from 'styled-components';

// Importamos el componente ChatBot directamente
const ChatBot = ReactSimpleChatbot.default;

// Función para filtrar propiedades no válidas y evitar advertencias
const shouldForwardProp = (prop: string): boolean => {
  // Lista de propiedades que generan advertencias y no deben pasarse al DOM
  const invalidProps = [
    'opened', 'invalid', 'hasButton', 'showAvatar', 
    'isFirst', 'isLast', 'delay', 'floating', 'floatingStyle'
  ];
  
  // Devolver true solo si la propiedad no está en la lista de inválidas
  return !invalidProps.includes(prop);
};

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
  floating,
  floatingStyle,
  showAvatar,
  isFirst,
  isLast,
  delay,
  ...otherProps
}) => {
  // Filtrar todas las propiedades que generan advertencias
  const filteredProps = { ...otherProps };
  
  // Propiedades que necesitamos pasar al ChatBot
  const chatbotProps = {
    opened,
    steps,
    floating,
    floatingStyle,
  };
  
  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <StyledContainer
        $opened={opened}
        $invalid={invalid}
        $hasButton={hasButton}
        className="styled-chatbot-wrapper"
      >
        <ChatBot 
          {...filteredProps} 
          {...chatbotProps}
        />
      </StyledContainer>
    </StyleSheetManager>
  );
};

export default StyledChatbot;