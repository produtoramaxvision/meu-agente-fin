import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PeriodFilterProps {
  selectedPeriod: number;
  onPeriodChange: (days: number) => void;
  className?: string;
}

export function PeriodFilter({ selectedPeriod, onPeriodChange, className }: PeriodFilterProps) {
  const [date, setDate] = useState<DateRange | undefined>(() => {
    const to = new Date();
    const from = subDays(to, selectedPeriod > 0 ? selectedPeriod - 1 : 0);
    return { from, to };
  });
  const [preset, setPreset] = useState<string | undefined>('30d');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (date?.from && date?.to) {
      const diffTime = Math.abs(date.to.getTime() - date.from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      // Validação adicional de range
      if (diffDays > 365) {
        toast.error('Período muito longo. Selecione no máximo 365 dias.');
        return;
      }
      
      if (date.from > date.to) {
        toast.error('Data inicial não pode ser maior que a data final.');
        return;
      }
      
      onPeriodChange(diffDays);
    } else if (date?.from) {
      // Handle single day selection
      onPeriodChange(1);
    }
  }, [date, onPeriodChange]);

  const handlePresetClick = (presetLabel: string) => {
    const now = new Date();
    let fromDate: Date;
    let toDate: Date = now;

    switch (presetLabel) {
      case 'today':
        fromDate = now;
        break;
      case 'week':
        fromDate = startOfWeek(now, { locale: ptBR });
        toDate = endOfWeek(now, { locale: ptBR });
        break;
      case 'month':
        fromDate = startOfMonth(now);
        toDate = endOfMonth(now);
        break;
      case 'year':
        fromDate = startOfYear(now);
        toDate = endOfYear(now);
        break;
      default:
        return;
    }
    
    setDate({ from: fromDate, to: toDate });
    setPreset(presetLabel);
    // We don't close the popover to allow further custom selection
  };

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    setPreset(undefined); // Clear preset when custom date is selected
    
    // Validação de range de datas
    if (selectedDate?.from && selectedDate?.to) {
      const diffTime = Math.abs(selectedDate.to.getTime() - selectedDate.from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      // Limitar a 365 dias para evitar problemas de performance
      if (diffDays > 365) {
        toast.error('Selecione um período de no máximo 365 dias');
        return;
      }
      
      // Fechar popover apenas quando um range completo é selecionado
      setIsOpen(false);
    }
  };

  const formatDateDisplay = () => {
    if (!date?.from) {
      return <span>Selecione um período</span>;
    }
    if (preset === 'today') return "Hoje";
    if (preset === 'week') return "Esta Semana";
    if (preset === 'month') return "Este Mês";
    if (preset === 'year') return "Este Ano";

    if (date.to) {
      if (format(date.from, 'yyyy-MM-dd') === format(date.to, 'yyyy-MM-dd')) {
        return format(date.from, "d 'de' LLL, y", { locale: ptBR });
      }
      return `${format(date.from, "d/MM/y")} - ${format(date.to, "d/MM/y")}`;
    }
    return format(date.from, "d 'de' LLL, y", { locale: ptBR });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full sm:w-[260px] justify-start text-left font-normal group relative overflow-hidden transition-all duration-200 hover:scale-105",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateDisplay()}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 space-y-2" align="end">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button variant={preset === 'today' ? 'default' : 'ghost'} onClick={() => handlePresetClick('today')} size="sm">Hoje</Button>
            <Button variant={preset === 'week' ? 'default' : 'ghost'} onClick={() => handlePresetClick('week')} size="sm">Semana</Button>
            <Button variant={preset === 'month' ? 'default' : 'ghost'} onClick={() => handlePresetClick('month')} size="sm">Mês</Button>
            <Button variant={preset === 'year' ? 'default' : 'ghost'} onClick={() => handlePresetClick('year')} size="sm">Ano</Button>
          </div>
          <div className="rounded-md border">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={1}
              locale={ptBR}
              disabled={(date) => {
                const today = new Date();
                const oneYearAgo = subDays(today, 365);
                return date > today || date < oneYearAgo;
              }}
              modifiers={{
                today: new Date(),
                range_start: date?.from,
                range_end: date?.to,
              }}
              modifiersClassNames={{
                today: 'bg-primary text-primary-foreground',
                range_start: 'bg-primary text-primary-foreground',
                range_end: 'bg-primary text-primary-foreground',
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}