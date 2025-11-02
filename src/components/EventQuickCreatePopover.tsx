import { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, EventFormData } from '@/hooks/useOptimizedAgendaData';

// Hook para controlar o estado do popover (substitui variável global)
// Usado pela página Agenda para verificar se o popover está aberto
export const useEventPopoverOpen = () => {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, setIsOpen };
};

// Função helper para verificar se o popover está aberto (mantida para compatibilidade)
// Nota: Esta é uma verificação limitada, considere usar o hook useEventPopoverOpen
let _isPopoverOpen = false;
export const isEventPopoverOpen = () => _isPopoverOpen;

interface EventQuickCreatePopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchor: { top: number; left: number } | null;
  eventData: Partial<EventFormData> | { start_ts?: Date; end_ts?: Date };
  calendars: Calendar[];
  onSubmit: (data: Partial<EventFormData> | { start_ts?: Date; end_ts?: Date; title: string; calendar_id: string }) => void;
  onMoreOptions: () => void;
}

export function EventQuickCreatePopover({
  open,
  onOpenChange,
  anchor,
  eventData,
  calendars,
  onSubmit,
  onMoreOptions,
}: EventQuickCreatePopoverProps) {
  const [title, setTitle] = useState('');
  const [calendarId, setCalendarId] = useState<string | undefined>(undefined);
  const [isValid, setIsValid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Validação em tempo real
  useEffect(() => {
    setIsValid(title.trim().length > 0 && !!calendarId);
  }, [title, calendarId]);

  useEffect(() => {
    if (open) {
      setTitle('');
      // Selecionar agenda primária ou primeira disponível
      const primaryCalendar = calendars.find(c => c.is_primary);
      const firstCalendar = calendars[0];
      const selectedCalendarId = primaryCalendar?.id || firstCalendar?.id;
      
      setCalendarId(selectedCalendarId);
      _isPopoverOpen = true; // Marcar popover como aberto (para compatibilidade)
      // Usar requestAnimationFrame para garantir que o DOM está pronto, mas sem delay perceptível
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      });
    } else {
      _isPopoverOpen = false; // Marcar popover como fechado (para compatibilidade)
    }
  }, [open, calendars]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !isValid || !calendarId) return;
    
    onSubmit({
      ...eventData,
      title,
      calendar_id: calendarId,
    });
    onOpenChange(false);
  };

  // Extrair start_ts e end_ts de forma type-safe
  const start_ts = 'start_ts' in eventData ? eventData.start_ts : undefined;
  const end_ts = 'end_ts' in eventData ? eventData.end_ts : undefined;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      {anchor && (
        <PopoverAnchor
          style={{ position: 'absolute', top: anchor.top, left: anchor.left, width: 0, height: 0 }}
        />
      )}
      <PopoverContent 
        className="w-80" 
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            ref={inputRef}
            placeholder="Adicionar título do evento"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold border-0 shadow-none focus-visible:ring-0 px-2 -mx-2"
            aria-label="Título do evento"
          />

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-text-muted">
              <CalendarIcon className="h-4 w-4" />
              <span>{start_ts ? format(start_ts, "EEEE, d 'de' MMMM", { locale: ptBR }) : '...'}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <Clock className="h-4 w-4" />
              <span>
                {start_ts ? format(start_ts, 'HH:mm') : '...'} – {end_ts ? format(end_ts, 'HH:mm') : '...'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={calendarId || undefined} onValueChange={setCalendarId}>
              <SelectTrigger className="flex-1" aria-label="Selecionar agenda">
                <SelectValue placeholder="Selecionar agenda" />
              </SelectTrigger>
              <SelectContent>
                {calendars.map((cal) => (
                  <SelectItem key={cal.id} value={cal.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: cal.color }} 
                      />
                      <span>{cal.name}</span>
                      {cal.is_primary && (
                        <span className="text-xs text-text-muted">(Principal)</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={onMoreOptions}>
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Mais opções
            </Button>
            <Button type="submit" size="sm" disabled={!isValid}>
              Salvar
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}