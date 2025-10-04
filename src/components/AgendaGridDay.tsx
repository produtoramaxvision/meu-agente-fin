import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { startOfDay, isSameDay, differenceInMinutes, addMinutes } from 'date-fns';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Event, Calendar } from '@/hooks/useAgendaData';
import EventPopover from './EventPopover';
import { EventQuickCreatePopover } from './EventQuickCreatePopover';
import { cn } from '@/lib/utils';

interface Props {
  date: Date;
  events: Event[];
  calendars: Calendar[];
  isLoading?: boolean;
  onEventClick?: (evt: Event) => void;
  onEventCreate: (data: any) => void;
  onEventDoubleClick: (data: any) => void;
}

const HOURS = Array.from({ length: 24 }).map((_, i) => i);
const SNAP_MINUTES = 15;
const HOUR_HEIGHT_PX = 64; // h-16 in tailwind
const PX_PER_MINUTE = HOUR_HEIGHT_PX / 60;

export default function AgendaGridDay({ date, events, calendars, isLoading, onEventClick, onEventCreate, onEventDoubleClick }: Props) {
  const dayEvents = useMemo(
    () => events.filter(e => isSameDay(new Date(e.start_ts), date) || isSameDay(new Date(e.end_ts), date)),
    [events, date]
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const [nowIndicatorTop, setNowIndicatorTop] = useState<number | null>(null);
  const [hoverIndicator, setHoverIndicator] = useState<{ top: number; time: string } | null>(null);
  const [selection, setSelection] = useState<{ start: number; end: number | null; startTime: Date } | null>(null);
  
  const [popoverState, setPopoverState] = useState<{
    open: boolean;
    anchor: { top: number; left: number } | null;
    eventData: Partial<any>;
  }>({ open: false, anchor: null, eventData: {} });

  const mapYToTime = useCallback((y: number): Date => {
    const minutesFromStart = Math.max(0, y) / PX_PER_MINUTE;
    const snappedMinutes = Math.round(minutesFromStart / SNAP_MINUTES) * SNAP_MINUTES;
    return addMinutes(startOfDay(date), snappedMinutes);
  }, [date]);

  useEffect(() => {
    const updateNowIndicator = () => {
      const now = new Date();
      if (isSameDay(now, date)) {
        const minutes = differenceInMinutes(now, startOfDay(date));
        setNowIndicatorTop(minutes * PX_PER_MINUTE);
      } else {
        setNowIndicatorTop(null);
      }
    };
    updateNowIndicator();
    const interval = setInterval(updateNowIndicator, 60000);
    return () => clearInterval(interval);
  }, [date]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - gridRect.top;
    
    const time = mapYToTime(y);
    setHoverIndicator({ top: y, time: format(time, 'HH:mm') });

    if (selection && selection.end !== null) {
      setSelection(s => s ? { ...s, end: y } : null);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gridRef.current || e.button !== 0) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - gridRect.top;
    const startTime = mapYToTime(y);
    setSelection({ start: y, end: y, startTime });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gridRef.current || !selection) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - gridRect.top;

    const startY = Math.min(selection.start, y);
    const endY = Math.max(selection.start, y);

    const startTime = mapYToTime(startY);
    let endTime = mapYToTime(endY);

    if (Math.abs(y - selection.start) < 5) {
      endTime = addMinutes(startTime, 30);
    }

    if (endTime <= startTime) {
      endTime = addMinutes(startTime, SNAP_MINUTES);
    }

    setPopoverState({
      open: true,
      anchor: { top: startY, left: e.clientX - gridRect.left },
      eventData: { start_ts: startTime, end_ts: endTime },
    });
    setSelection(null);
  };

  const handleDoubleClick = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - gridRect.top;
    const startTime = mapYToTime(y);
    const endTime = addMinutes(startTime, 60);
    onEventDoubleClick({ start_ts: startTime, end_ts: endTime });
  };

  const handlePointerLeave = () => {
    setHoverIndicator(null);
    if (selection) {
      setSelection(null);
    }
  };

  const selectionStyle = useMemo(() => {
    if (!selection) return { display: 'none' };
    const start = Math.min(selection.start, selection.end ?? selection.start);
    const end = Math.max(selection.start, selection.end ?? selection.start);
    return {
      top: `${start}px`,
      height: `${end - start}px`,
    };
  }, [selection]);

  return (
    <Card className="p-4 overflow-hidden">
      <div
        role="grid"
        aria-label="Grade de horários do dia"
        className="relative grid grid-cols-[60px_1fr] gap-2 min-h-[700px]"
      >
        <div className="flex flex-col">
          {HOURS.map(h => (
            <div key={h} className="h-16 text-xs text-text-muted pt-[-8px]">{String(h).padStart(2, '0')}:00</div>
          ))}
        </div>

        <div
          ref={gridRef}
          className="relative border-l cursor-crosshair"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          onDoubleClick={handleDoubleClick}
        >
          {HOURS.map(h => (
            <div key={h} className="h-16 border-b border-border/60" />
          ))}

          {nowIndicatorTop !== null && (
            <div className="absolute left-0 right-0 pointer-events-none z-20" style={{ top: `${nowIndicatorTop}px` }}>
              <div className="relative h-px bg-red-500">
                <div className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-red-500" />
              </div>
            </div>
          )}

          {hoverIndicator && !selection && (
            <div className="absolute left-0 right-0 pointer-events-none opacity-50" style={{ top: `${hoverIndicator.top}px` }}>
              <div className="relative h-px bg-primary border-t border-dashed border-primary">
                <span className="absolute -left-14 -top-2 text-xs bg-surface px-1 rounded">{hoverIndicator.time}</span>
              </div>
            </div>
          )}

          {selection && (
            <div
              className="absolute left-2 right-4 bg-primary/20 border border-primary rounded-md pointer-events-none z-10"
              style={selectionStyle}
            />
          )}

          <div className="absolute inset-0">
            {dayEvents.map((evt) => {
              const start = new Date(evt.start_ts);
              const end = new Date(evt.end_ts);
              const dayStart = startOfDay(date);
              const top = Math.max(0, differenceInMinutes(start, dayStart) * PX_PER_MINUTE);
              const height = Math.max(30, differenceInMinutes(end, start) * PX_PER_MINUTE);

              return (
                <EventPopover key={evt.id} event={evt}>
                  <div
                    tabIndex={0}
                    className="absolute left-2 right-4 rounded-md px-3 py-2 text-xs cursor-pointer
                               bg-[hsl(var(--brand-50))] dark:bg-[hsl(var(--brand-200))]/20 border border-border
                               hover:shadow-md focus:ring-2"
                    style={{ top: `${top}px`, height: `${height}px` }}
                    onClick={(e) => { e.stopPropagation(); onEventClick?.(evt); }}
                  >
                    <div className="font-semibold truncate">{evt.title}</div>
                    <div className="text-[10px] text-text-muted truncate">{evt.location || '—'}</div>
                  </div>
                </EventPopover>
              );
            })}
          </div>
        </div>
      </div>
      <EventQuickCreatePopover
        open={popoverState.open}
        onOpenChange={(open) => setPopoverState(s => ({ ...s, open }))}
        anchor={popoverState.anchor}
        eventData={popoverState.eventData}
        calendars={calendars}
        onSubmit={onEventCreate}
        onMoreOptions={() => {
          setPopoverState(s => ({ ...s, open: false }));
          onEventDoubleClick(popoverState.eventData);
        }}
      />
    </Card>
  );
}