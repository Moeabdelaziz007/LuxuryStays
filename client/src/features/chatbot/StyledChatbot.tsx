import React from 'react';
// Importamos directamente el componente ChatBot
import ChatBot from 'react-simple-chatbot';
import { StyleSheetManager } from 'styled-components';

/**
 * Un componente simplificado que envuelve el ChatBot
 * Sin intentar pasar ref para evitar errores
 */
const StyledChatbot = (props: any) => {
  return (
    <StyleSheetManager shouldForwardProp={(prop) => !prop.startsWith('$')}>
      <div className="styled-chatbot-wrapper" style={{ width: '100%', height: '100%' }}>
        <ChatBot {...props} />
      </div>
    </StyleSheetManager>
  );
};

export default StyledChatbot;