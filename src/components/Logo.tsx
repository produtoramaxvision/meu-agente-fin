import logoImage from '@/assets/meuagente_logo.webp';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-20 w-20',
  '2xl': 'h-40 w-40',
};

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img 
        src={logoImage} 
        alt="Meu Agente" 
        className={cn(sizeClasses[size], 'rounded-full object-cover border-2 border-border/50')}
      />
      {showText && (
        <span className="text-xl font-bold text-text">
          Meu Agente<sup className="ml-0.5 text-xs font-normal">®</sup>
        </span>
      )}
    </div>
  );
}