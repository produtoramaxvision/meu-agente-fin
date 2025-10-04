import { useMemo } from 'react';
import { isSameDay, eachDayOfInterval, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/card';
import { Event } from '@/hooks/useAgendaData';

interface Props {
  startDate: Date;
  endDate: Date;
  events: Event[];
  isLoading?: boolean;
  onEventClick?: (evt: Event) => void;
}

export default function AgendaList({ startDate, endDate, events, isLoading, onEventClick }: Props) {
  const days = useMemo(() => eachDayOfInterval({ start: startDate, end: endDate }), [startDate, endDate]);

  return (
    <Card className="p-4">
      <div className="space-y-6">
        {days.map((d) => {
          const items = events.filter(e => isSameDay(new Date(e.start_ts), d) || isSameDay(new Date(e.end_ts), d));
          return (
            <div key={d.toISOString()}>
              <div className="text-sm font-semibold mb-2">{format(d, "EEEE, dd 'de' MMMM", { locale: ptBR })}</div>
              <div className="space-y-2">
                {items.length === 0 && <div className="text-xs text-text-muted">Sem eventos</div>}
                {items.map((evt) => (
                  <div
                    key={evt.id}
                    className="rounded-md border px-3 py-2 text-sm cursor-pointer bg-surface hover:bg-surface-hover"
                    onClick={() => onEventClick?.(evt)}
                  >
                    <div className="font-semibold truncate">{evt.title}</div>
                    <div className="text-xs text-text-muted truncate">
                      {format(new Date(evt.start_ts), 'HH:mm')} - {format(new Date(evt.end_ts), 'HH:mm')}
                      {evt.location ? ` • ${evt.location}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}