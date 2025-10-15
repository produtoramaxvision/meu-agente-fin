import { useMemo } from 'react';
import { isSameDay, eachDayOfInterval, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Event, Calendar } from '@/hooks/useAgendaData';
import { EventCard } from './EventCard';
import { EmptyDayCard } from './EmptyDayCard';

interface Props {
  startDate: Date;
  endDate: Date;
  events: Event[];
  calendars: Calendar[];
  isLoading?: boolean;
  onEventClick?: (evt: Event) => void;
  onCreateEvent?: (date?: Date) => void;
}

export default function AgendaList({ startDate, endDate, events, calendars, isLoading, onEventClick, onCreateEvent }: Props) {
  const days = useMemo(() => eachDayOfInterval({ start: startDate, end: endDate }), [startDate, endDate]);

  return (
    <Card className="p-4 custom-scrollbar smooth-scrollbar overflow-y-auto max-h-[600px]">
      <div className="space-y-6">
        {days.map((d) => {
          const items = events
            .filter(e => isSameDay(new Date(e.start_ts), d) || isSameDay(new Date(e.end_ts), d))
            .sort((a, b) => new Date(a.start_ts).getTime() - new Date(b.start_ts).getTime());
          return (
            <div key={d.toISOString()}>
              <div className="text-sm font-semibold mb-3 text-foreground/90">{format(d, "EEEE, dd 'de' MMMM", { locale: ptBR })}</div>
              <div className="space-y-2">
                {items.length === 0 ? (
                  <EmptyDayCard 
                    date={d} 
                    onCreateEvent={() => onCreateEvent?.(d)} 
                  />
                ) : (
                  items.map((evt) => {
                    // Encontrar a cor do calendário
                    const calendar = calendars.find(cal => cal.id === evt.calendar_id);
                    const calendarColor = calendar?.color || '#3b82f6';
                    
                    return (
                      <EventCard
                        key={evt.id}
                        event={evt}
                        variant="default"
                        calendarColor={calendarColor}
                        onClick={() => onEventClick?.(evt)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}