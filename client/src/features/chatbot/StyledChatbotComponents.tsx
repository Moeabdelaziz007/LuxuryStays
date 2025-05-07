import React from 'react';
import styled from 'styled-components';

// Componente de burbuja de mensaje
interface BubbleComponentProps {
  $showAvatar?: boolean;
  $isFirst?: boolean;
  $isLast?: boolean;
  $delay?: number;
}

// Crea un contenedor para las burbujas que usa las propiedades con $
export const StyledBubbleContainer = styled.div<BubbleComponentProps>`
  display: flex;
  flex-direction: column;
  margin: ${props => props.$isFirst ? '8px 0 0' : '4px 0'};
  padding-bottom: ${props => props.$isLast ? '8px' : '0'};
`;

// Componente para el icono flotante
interface FloatingIconProps {
  $opened?: boolean;
  $floatingStyle?: React.CSSProperties;
}

export const StyledFloatingIcon = styled.div<FloatingIconProps>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  display: ${props => props.$opened ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
  transform: ${props => props.$opened ? 'scale(0)' : 'scale(1)'};
  transition: transform 0.3s ease;
`;

// Componente de avatar
interface StyledAvatarProps {
  $showAvatar?: boolean;
}

export const StyledAvatar = styled.div<StyledAvatarProps>`
  display: ${props => props.$showAvatar ? 'block' : 'none'};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 8px;
`;