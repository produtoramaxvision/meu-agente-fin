import { useMemo } from 'react';
import { startOfWeek, addDays, isSameDay, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Event } from '@/hooks/useAgendaData';
import EventPopover from './EventPopover';

interface Props {
  weekDate: Date;
  events: Event[];
  isLoading?: boolean;
  onEventClick?: (evt: Event) => void;
}

export default function AgendaGridWeek({ weekDate, events, isLoading, onEventClick }: Props) {
  const weekStart = startOfWeek(weekDate, { locale: ptBR });
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  const eventsByDay = useMemo(() => {
    return days.map((d) => ({
      date: d,
      items: events.filter(e => isSameDay(new Date(e.start_ts), d) || isSameDay(new Date(e.end_ts), d)),
    }));
  }, [days, events]);

  return (
    <Card className="p-4 overflow-x-auto">
      <div role="grid" aria-label="Grade semanal" className="min-w-[900px] grid grid-cols-7 gap-3">
        {eventsByDay.map(({ date, items }) => (
          <div key={date.toISOString()} className="border rounded-md p-2">
            <div className="text-xs text-text-muted mb-2">{format(date, "EEE, dd 'de' MMM", { locale: ptBR })}</div>
            <div className="space-y-2">
              {items.length === 0 && <div className="text-xs text-text-muted">Sem eventos</div>}
              {items.map(evt => (
                <EventPopover key={evt.id} event={evt}>
                  <div
                    className="rounded-md border px-2 py-1 text-xs cursor-pointer bg-surface hover:bg-surface-hover"
                    onClick={() => onEventClick?.(evt)}
                  >
                    <div className="font-semibold truncate">{evt.title}</div>
                    <div className="text-[10px] text-text-muted truncate">
                      {format(new Date(evt.start_ts), 'HH:mm')} - {format(new Date(evt.end_ts), 'HH:mm')}
                    </div>
                  </div>
                </EventPopover>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}