import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = '', onValueChange, ...props }, ref) => {
    const formatCurrency = (rawValue: string): string => {
      // Remove tudo exceto números
      const numbers = rawValue.replace(/\D/g, '');
      
      if (!numbers) return '';
      
      // Converte para centavos
      const cents = parseInt(numbers, 10);
      
      // Formata para moeda brasileira
      const formatted = (cents / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      
      return formatted;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCurrency(e.target.value);
      onValueChange?.(formatted);
    };

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          R$
        </span>
        <Input
          type="text"
          inputMode="numeric"
          className={cn('pl-10', className)}
          value={value}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
