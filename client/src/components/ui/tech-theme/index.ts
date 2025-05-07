import { TechButton } from './TechButton';
import TechCard from './TechCard';
import TechBackground from './TechBackground';

export { TechButton, TechCard, TechBackground };

// Create a dummy TechInput for now
export const TechInput = (props: any) => null;

// Export tech effect classes
export const TECH_EFFECTS = {
  neonGlow: 'animate-neon-pulse',
  float: 'animate-float',
  pulse: 'animate-pulse-subtle',
  shimmer: 'shimmer-effect'
};