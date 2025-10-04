import { useMemo } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Event } from '@/hooks/useAgendaData';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Props {
  monthDate: Date;
  events: Event[];
  isLoading?: boolean;
  onEventClick?: (evt: Event) => void;
}

export default function AgendaGridMonth({ monthDate, events, isLoading, onEventClick }: Props) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const gridStart = startOfWeek(monthStart, { locale: ptBR });
  const gridEnd = endOfWeek(monthEnd, { locale: ptBR });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const eventsByDay = useMemo(() => {
    return days.map((d) => ({
      date: d,
      items: events.filter(e => isSameDay(new Date(e.start_ts), d) || isSameDay(new Date(e.end_ts), d)),
    }));
  }, [days, events]);

  return (
    <Card className="p-2 sm:p-4">
      <div role="grid" aria-label="Grade mensal" className="grid grid-cols-7 gap-2 sm:gap-3">
        {eventsByDay.map(({ date, items }) => {
          const show = items.slice(0, 3);
          const restCount = items.length - show.length;

          return (
            <div
              key={date.toISOString()}
              className={`min-h-[110px] sm:min-h-[140px] border rounded-lg p-2 bg-surface ${!isSameMonth(date, monthDate) ? 'opacity-60' : ''}`}
            >
              <div className="text-[10px] sm:text-xs text-text-muted mb-1">{format(date, 'd MMM', { locale: ptBR })}</div>
              <div className="space-y-1">
                {show.map(evt => (
                  <div
                    key={evt.id}
                    className="rounded-md border px-2 py-1 text-[10px] sm:text-xs cursor-pointer bg-surface hover:bg-surface-hover"
                    onClick={() => onEventClick?.(evt)}
                  >
                    <span className="font-semibold">{evt.title}</span>
                  </div>
                ))}
                {restCount > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-[10px] sm:text-xs text-primary hover:underline">+{restCount} mais</button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-1">
                        {items.map(evt => (
                          <div
                            key={evt.id}
                            className="rounded-md border px-2 py-1 text-xs cursor-pointer bg-surface hover:bg-surface-hover"
                            onClick={() => onEventClick?.(evt)}
                          >
                            <div className="font-semibold truncate">{evt.title}</div>
                            <div className="text-[10px] text-text-muted truncate">
                              {format(new Date(evt.start_ts), 'dd/MM HH:mm')} - {format(new Date(evt.end_ts), 'dd/MM HH:mm')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
                {items.length === 0 && <div className="text-[10px] sm:text-xs text-text-muted">Sem eventos</div>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}