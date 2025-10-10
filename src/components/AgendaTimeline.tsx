import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Event, Resource } from '@/hooks/useAgendaData';
import { format } from 'date-fns';

interface Props {
  startDate: Date;
  endDate: Date;
  events: Event[];
  resources: Resource[];
  isLoading?: boolean;
  onEventClick?: (evt: Event) => void;
}

export default function AgendaTimeline({ startDate, endDate, events, resources, isLoading, onEventClick }: Props) {
  // Nota: sem join de event_resources aqui; mostramos uma trilha “Geral” + trilhas vazias por recurso para visualização.
  const lanes = useMemo(() => {
    const base = [{ id: 'general', name: 'Geral', events }];
    const resourceLanes = resources.map(r => ({ id: r.id, name: r.name, events: [] as Event[] }));
    return [...base, ...resourceLanes];
  }, [events, resources]);

  return (
    <Card className="p-4 overflow-x-auto custom-scrollbar smooth-scrollbar">
      <div className="min-w-[900px] space-y-4">
        {lanes.map((lane) => (
          <div key={lane.id} className="border rounded-md p-3 bg-surface">
            <div className="text-sm font-semibold mb-2">{lane.name}</div>
            <div className="flex flex-wrap gap-2">
              {lane.events.length === 0 && (
                <div className="text-xs text-text-muted">Sem eventos</div>
              )}
              {lane.events.map(evt => (
                <div
                  key={evt.id}
                  className="rounded-md border px-3 py-2 text-xs cursor-pointer bg-surface hover:bg-surface-hover"
                  onClick={() => onEventClick?.(evt)}
                >
                  <div className="font-semibold truncate">{evt.title}</div>
                  <div className="text-[10px] text-text-muted truncate">
                    {format(new Date(evt.start_ts), 'dd/MM HH:mm')} - {format(new Date(evt.end_ts), 'dd/MM HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}