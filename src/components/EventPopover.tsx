import { ReactNode, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Pencil, Copy, Trash2 } from 'lucide-react';
import { Event, EventFormData } from '@/hooks/useAgendaData';
import { useAgendaData } from '@/hooks/useAgendaData';
import { useAuth } from '@/contexts/AuthContext';
import { EventForm } from '@/components/EventForm';

interface Props {
  event: Event;
  children: ReactNode;
}

export default function EventPopover({ event, children }: Props) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const { updateEvent, duplicateEvent, deleteEvent, refetch, calendars, createCalendar } = useAgendaData({
    view: 'day',
    startDate: new Date(event.start_ts),
    endDate: new Date(event.end_ts),
  });

  const onEdit = (data: EventFormData) => {
    updateEvent.mutate(
      { id: event.id, updates: data },
      { onSuccess: () => setEditOpen(false) }
    );
  };

  const onDuplicate = () => {
    duplicateEvent.mutate(event, { onSuccess: () => setOpen(false) });
  };

  const onDelete = () => {
    deleteEvent.mutate(event.id, { onSuccess: () => setOpen(false) });
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-2">
            <div className="font-semibold truncate">{event.title}</div>
            <div className="text-xs text-text-muted truncate">{event.location || '—'}</div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => { setEditOpen(true); setOpen(false); }}>
                <Pencil className="h-4 w-4 mr-1" /> Editar
              </Button>
              <Button variant="outline" size="sm" onClick={onDuplicate}>
                <Copy className="h-4 w-4 mr-1" /> Duplicar
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-1" /> Excluir
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Modal de edição */}
      <EventForm
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={onEdit}
        eventToEdit={event}
        calendars={calendars}
        createCalendar={(data) => createCalendar.mutate(data)}
      />
    </>
  );
}