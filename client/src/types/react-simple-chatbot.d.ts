declare module 'react-simple-chatbot' {
  import React from 'react';
  
  export interface Step {
    id: string;
    message?: string;
    component?: React.ReactNode;
    trigger?: string | ((value: any) => string);
    user?: boolean;
    asMessage?: boolean;
    waitAction?: boolean;
    value?: any;
    metadata?: any;
    delay?: number;
    inputAttributes?: any;
    options?: any;
    hideInput?: boolean;
    [key: string]: any;
  }

  export interface ChatBotProps {
    steps: Step[];
    headerTitle?: string;
    botAvatar?: string;
    userAvatar?: string;
    customStyle?: Record<string, any>;
    contentStyle?: Record<string, any>;
    bubbleStyle?: Record<string, any>;
    bubbleOptionStyle?: Record<string, any>;
    footerStyle?: Record<string, any>;
    inputStyle?: Record<string, any>;
    placeholder?: string;
    botDelay?: number;
    userDelay?: number;
    customDelay?: number;
    width?: string | number;
    height?: string | number;
    floating?: boolean;
    floatingIcon?: React.ReactNode;
    floatingStyle?: Record<string, any>;
    hideHeader?: boolean;
    hideSubmitButton?: boolean;
    hideUserAvatar?: boolean;
    botBubbleColor?: string;
    botFontColor?: string;
    userBubbleColor?: string;
    userFontColor?: string;
    recognitionEnable?: boolean;
    enableMobileAutoFocus?: boolean;
    enableSmoothScroll?: boolean;
    handleEnd?: (steps: Step[]) => void;
    handleUserMessage?: (message: string, next: any) => void;
    [key: string]: any;
  }

  export interface ThemeProps {
    theme: Record<string, any>;
  }
  
  class ChatBot extends React.Component<ChatBotProps> {}
  
  export class ThemeProvider extends React.Component<ThemeProps> {}
  
  export default ChatBot;
}