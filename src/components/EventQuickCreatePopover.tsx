import { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Anchor as RadixPopoverAnchor } from '@radix-ui/react-popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, EventFormData } from '@/hooks/useAgendaData';

interface EventQuickCreatePopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchor: { top: number; left: number } | null;
  eventData: Partial<EventFormData>;
  calendars: Calendar[];
  onSubmit: (data: Partial<EventFormData>) => void;
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle('');
      setCalendarId(calendars.find(c => c.is_primary)?.id || calendars[0]?.id);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open, calendars]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      ...eventData,
      title,
      calendar_id: calendarId,
    });
    onOpenChange(false);
  };

  const { start_ts, end_ts } = eventData;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      {anchor && (
        <RadixPopoverAnchor
          style={{ position: 'absolute', top: anchor.top, left: anchor.left, width: 0, height: 0 }}
        />
      )}
      <PopoverContent className="w-80" onOpenAutoFocus={(e) => e.preventDefault()}>
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
            <Select value={calendarId} onValueChange={setCalendarId}>
              <SelectTrigger className="flex-1" aria-label="Selecionar agenda">
                <SelectValue placeholder="Selecionar agenda" />
              </SelectTrigger>
              <SelectContent>
                {calendars.map((cal) => (
                  <SelectItem key={cal.id} value={cal.id}>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cal.color }} />
                      {cal.name}
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
            <Button type="submit" size="sm" disabled={!title.trim()}>
              Salvar
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}