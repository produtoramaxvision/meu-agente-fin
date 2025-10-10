import { useMemo, useState, useRef, useEffect, useCallback, memo } from 'react';
import { startOfDay, isSameDay, differenceInMinutes, addMinutes } from 'date-fns';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Event, Calendar } from '@/hooks/useAgendaData';
import EventPopover from './EventPopover';
import { EventQuickCreatePopover } from './EventQuickCreatePopover';
import { EventCard } from './EventCard';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  Active,
  Over,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  date: Date;
  events: Event[];
  calendars: Calendar[];
  isLoading?: boolean;
  onEventClick?: (evt: Event) => void;
  onEventCreate: (data: any) => void;
  onEventDoubleClick: (data: any) => void;
  onEventMove?: (eventId: string, newStartTime: Date, newEndTime: Date) => void;
}

const HOURS = Array.from({ length: 24 }).map((_, i) => i);
const SNAP_MINUTES = 15;
const HOUR_HEIGHT_PX = 64; // h-16 in tailwind
const PX_PER_MINUTE = HOUR_HEIGHT_PX / 60;

// Função para detectar prefers-reduced-motion
const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

// Função de debounce para otimizar performance
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

// Componente para eventos arrastáveis
interface DraggableEventProps {
  event: Event;
  calendarColor: string;
  allEvents: Event[];
  onEventClick?: (evt: Event) => void;
  onEventDoubleClick?: (data: any) => void;
  openEventPopover: string | null;
  setOpenEventPopover: (id: string | null) => void;
  setPopoverState: (state: any) => void;
  lastClickedEvent: string | null;
  setLastClickedEvent: (id: string | null) => void;
}

function DraggableEvent({
  event,
  calendarColor,
  allEvents,
  onEventClick,
  onEventDoubleClick,
  openEventPopover,
  setOpenEventPopover,
  setPopoverState,
  lastClickedEvent,
  setLastClickedEvent,
}: DraggableEventProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `event-${event.id}` });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
  }), [transform, transition]);

  const position = useMemo(() => {
    const start = new Date(event.start_ts);
    const end = new Date(event.end_ts);
    const dayStart = startOfDay(new Date());
    const top = Math.max(0, differenceInMinutes(start, dayStart) * PX_PER_MINUTE);
    const height = Math.max(60, differenceInMinutes(end, start) * PX_PER_MINUTE);
    
    // Calcular empilhamento para eventos sobrepostos
    const overlappingEvents = allEvents.filter(e => {
      if (e.id === event.id) return false;
      const eStart = new Date(e.start_ts);
      const eEnd = new Date(e.end_ts);
      return (start < eEnd && end > eStart);
    });
    
    // Calcular posição lateral baseada no índice de sobreposição
    const overlapIndex = overlappingEvents.length;
    const leftOffset = overlapIndex * 20; // 20px por evento sobreposto
    const width = `calc(100% - ${leftOffset}px)`;
    
    return { 
      top: `${top}px`, 
      height: `${height}px`,
      left: `${leftOffset}px`,
      width: width
    };
  }, [event.start_ts, event.end_ts, event.id, allEvents]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
    setLastClickedEvent(event.id);
    if (lastClickedEvent === event.id && openEventPopover !== event.id) {
      setOpenEventPopover(event.id);
    }
  }, [event, onEventClick, lastClickedEvent, openEventPopover, setLastClickedEvent, setOpenEventPopover]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEventDoubleClick?.(event);
  }, [event, onEventDoubleClick]);

  const handlePopoverChange = useCallback((open: boolean) => {
    if (open) {
      setOpenEventPopover(event.id);
      setPopoverState(s => ({ ...s, open: false }));
    } else {
      setOpenEventPopover(null);
      if (lastClickedEvent === event.id) {
        setLastClickedEvent(null);
      }
    }
  }, [event.id, lastClickedEvent, setLastClickedEvent, setOpenEventPopover, setPopoverState]);

  return (
    <EventPopover 
      event={event}
      open={openEventPopover === event.id}
      onOpenChange={handlePopoverChange}
    >
      <motion.div
        ref={setNodeRef}
        style={{ ...style, ...position }}
        className="absolute left-2 right-4 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        initial={prefersReducedMotion() ? {} : { opacity: 0, scale: 0.8, y: -20 }}
        animate={prefersReducedMotion() ? {} : { 
          opacity: isDragging ? 0.3 : 1, 
          scale: isDragging ? 1.05 : 1,
          y: 0,
          rotate: isDragging ? 2 : 0,
          boxShadow: isDragging 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
        whileHover={prefersReducedMotion() ? {} : { 
          scale: 1.02,
          y: -2,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transition: { duration: 0.2 }
        }}
        whileTap={prefersReducedMotion() ? {} : { 
          scale: 0.98,
          transition: { duration: 0.1 }
        }}
        transition={prefersReducedMotion() ? { duration: 0 } : {
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8
        }}
        layout
      >
        <motion.div
          className="h-full w-full"
          animate={prefersReducedMotion() ? {} : {
            backgroundColor: isDragging ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0)',
            borderColor: isDragging ? calendarColor : 'rgba(0, 0, 0, 0)',
            borderWidth: isDragging ? '2px' : '0px',
            borderRadius: isDragging ? '8px' : '0px',
          }}
          transition={prefersReducedMotion() ? { duration: 0 } : { duration: 0.2 }}
        >
          <EventCard
            event={event}
            variant="compact"
            calendarColor={calendarColor}
            className="h-full"
          />
        </motion.div>
      </motion.div>
    </EventPopover>
  );
}

// Memoizar o componente para evitar re-renders desnecessários
const MemoizedDraggableEvent = memo(DraggableEvent);

export default function AgendaGridDay({ date, events, calendars, isLoading, onEventClick, onEventCreate, onEventDoubleClick, onEventMove }: Props) {
  const dayEvents = useMemo(
    () => events.filter(e => {
      const startDate = new Date(e.start_ts);
      const endDate = new Date(e.end_ts);
      return isSameDay(startDate, date) || isSameDay(endDate, date);
    }),
    [events, date]
  );

  // Memoizar cores dos calendários para evitar recálculos
  const calendarColorMap = useMemo(() => {
    const map = new Map<string, string>();
    calendars.forEach(cal => {
      map.set(cal.id, cal.color || '#3b82f6');
    });
    return map;
  }, [calendars]);

  const gridRef = useRef<HTMLDivElement>(null);
  const [nowIndicatorTop, setNowIndicatorTop] = useState<number | null>(null);
  const [hoverIndicator, setHoverIndicator] = useState<{ top: number; time: string } | null>(null);
  const [selection, setSelection] = useState<{ start: number; end: number | null; startTime: Date } | null>(null);
  
  const [popoverState, setPopoverState] = useState<{
    open: boolean;
    anchor: { top: number; left: number } | null;
    eventData: Partial<any>;
  }>({ open: false, anchor: null, eventData: {} });

  const [openEventPopover, setOpenEventPopover] = useState<string | null>(null);
  const [lastClickedEvent, setLastClickedEvent] = useState<string | null>(null);

  // Estados para drag and drop
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);

  // Configuração dos sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Aumentar distância para evitar interferência com cliques
      },
    }),
    useSensor(KeyboardSensor)
  );

  const mapYToTime = useCallback((y: number): Date => {
    const minutesFromStart = Math.max(0, y) / PX_PER_MINUTE;
    const snappedMinutes = Math.round(minutesFromStart / SNAP_MINUTES) * SNAP_MINUTES;
    return addMinutes(startOfDay(date), snappedMinutes);
  }, [date]);

  const mapTimeToY = useCallback((time: Date): number => {
    const dayStart = startOfDay(date);
    return differenceInMinutes(time, dayStart) * PX_PER_MINUTE;
  }, [date]);

  // Handlers para drag and drop
  const handleDragStart = useCallback((dragEvent: DragStartEvent) => {
    const eventId = dragEvent.active.id as string;
    const eventData = dayEvents.find(e => e.id === eventId);
    
    // Só iniciar drag se for um evento válido
    if (eventData && eventId.startsWith('event-')) {
      setActiveEvent(eventData);
      setDraggedEventId(eventId);
    }
  }, [dayEvents]);

  const handleDragOver = useCallback((dragEvent: DragOverEvent) => {
    const { active, over } = dragEvent;
    
    if (!over || !gridRef.current) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const y = dragEvent.over?.rect?.top ? dragEvent.over.rect.top - gridRect.top : 0;
    const newTime = mapYToTime(y);
    
    if (activeEvent && onEventMove) {
      const startTime = new Date(activeEvent.start_ts);
      const endTime = new Date(activeEvent.end_ts);
      const duration = differenceInMinutes(endTime, startTime);
      const newEndTime = addMinutes(newTime, duration);
      
      // Atualizar visualmente o evento durante o drag
      setActiveEvent({
        ...activeEvent,
        start_ts: newTime.toISOString(),
        end_ts: newEndTime.toISOString(),
      });
    }
  }, [activeEvent, mapYToTime, onEventMove]);

  const handleDragEnd = useCallback((dragEvent: DragEndEvent) => {
    const { active, over } = dragEvent;
    
    if (!over || !gridRef.current || !activeEvent || !onEventMove) {
      setActiveEvent(null);
      setDraggedEventId(null);
      return;
    }

    const gridRect = gridRef.current.getBoundingClientRect();
    const y = dragEvent.over?.rect?.top ? dragEvent.over.rect.top - gridRect.top : 0;
    const newTime = mapYToTime(y);
    
    const startTime = new Date(activeEvent.start_ts);
    const endTime = new Date(activeEvent.end_ts);
    const duration = differenceInMinutes(endTime, startTime);
    const newEndTime = addMinutes(newTime, duration);

    // Chamar callback para mover o evento
    onEventMove(activeEvent.id, newTime, newEndTime);
    
    setActiveEvent(null);
    setDraggedEventId(null);
  }, [activeEvent, mapYToTime, onEventMove]);

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

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - gridRect.top;
    
    const time = mapYToTime(y);
    setHoverIndicator({ top: y, time: format(time, 'HH:mm') });

    if (selection && selection.end !== null) {
      setSelection(s => s ? { ...s, end: y } : null);
    }
  }, [mapYToTime, selection]);

  // Debounced version para melhor performance
  const debouncedHandlePointerMove = useMemo(
    () => debounce(handlePointerMove, 16), // ~60fps
    [handlePointerMove]
  );

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!gridRef.current || e.button !== 0) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - gridRect.top;
    const startTime = mapYToTime(y);
    setSelection({ start: y, end: y, startTime });
  }, [mapYToTime]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
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
    // Fechar qualquer EventPopover aberto quando abrir EventQuickCreatePopover
    // Mas preservar o último evento clicado para permitir reabertura
    setOpenEventPopover(null);
  }, [mapYToTime, selection, setOpenEventPopover]);

  const handleGridClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const gridRect = gridRef.current?.getBoundingClientRect();
    if (!gridRect) return;
    
    const y = e.clientY - gridRect.top;
    const startTime = mapYToTime(y);
    const endTime = addMinutes(startTime, 30);

    setPopoverState({
      open: true,
      anchor: { top: y, left: e.clientX - gridRect.left },
      eventData: { start_ts: startTime, end_ts: endTime },
    });
    // Fechar qualquer EventPopover aberto quando abrir EventQuickCreatePopover
    // Mas preservar o último evento clicado para permitir reabertura
    setOpenEventPopover(null);
  }, [mapYToTime, setOpenEventPopover]);

  const handleDoubleClick = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const y = e.clientY - gridRect.top;
    const startTime = mapYToTime(y);
    const endTime = addMinutes(startTime, 60);
    onEventDoubleClick({ start_ts: startTime, end_ts: endTime });
  }, [mapYToTime, onEventDoubleClick]);

  const handlePointerLeave = useCallback(() => {
    setHoverIndicator(null);
    if (selection) {
      setSelection(null);
    }
  }, [selection]);

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
    <>
      <Card className="p-4 overflow-hidden custom-scrollbar smooth-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
        <div
          role="application"
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
            onPointerMove={debouncedHandlePointerMove}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onDoubleClick={handleDoubleClick}
            onClick={handleGridClick}
          >
            {HOURS.map(h => (
              <div key={h} className="h-16 border-b border-border/60" />
            ))}

            <AnimatePresence>
              {nowIndicatorTop !== null && (
                <motion.div 
                  className="absolute left-0 right-0 pointer-events-none z-20" 
                  style={{ top: `${nowIndicatorTop}px` }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="relative h-px bg-gradient-to-r from-red-400 to-red-600 shadow-lg">
                    <motion.div 
                      className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-red-500 shadow-lg"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(239, 68, 68, 0.7)',
                          '0 0 0 8px rgba(239, 68, 68, 0)',
                          '0 0 0 0 rgba(239, 68, 68, 0)'
                        ]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {hoverIndicator && !selection && (
                <motion.div 
                  className="absolute left-0 right-0 pointer-events-none" 
                  style={{ top: `${hoverIndicator.top}px` }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 0.7, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="relative h-px bg-gradient-to-r from-primary/50 to-primary border-t border-dashed border-primary/60">
                    <motion.span 
                      className="absolute -left-14 -top-2 text-xs bg-surface px-2 py-1 rounded shadow-md border"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {hoverIndicator.time}
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {selection && (
                <motion.div
                  className="absolute left-2 right-4 bg-gradient-to-r from-primary/10 to-primary/20 border border-primary/60 rounded-md pointer-events-none z-10 shadow-lg"
                  style={selectionStyle}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            <SortableContext items={dayEvents.map(e => `event-${e.id}`)} strategy={verticalListSortingStrategy}>
              <motion.div 
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, staggerChildren: 0.05 }}
              >
                <AnimatePresence mode="popLayout">
                  {dayEvents.map((evt, index) => {
                    // Usar mapa memoizado para melhor performance
                    const calendarColor = calendarColorMap.get(evt.calendar_id) || '#3b82f6';

                    return (
                      <motion.div
                        key={evt.id}
                        layout
                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.05,
                          type: "spring",
                          stiffness: 300,
                          damping: 30
                        }}
                      >
                        <MemoizedDraggableEvent
                          event={evt}
                          calendarColor={calendarColor}
                          allEvents={dayEvents}
                          onEventClick={onEventClick}
                          onEventDoubleClick={onEventDoubleClick}
                          openEventPopover={openEventPopover}
                          setOpenEventPopover={setOpenEventPopover}
                          setPopoverState={setPopoverState}
                          lastClickedEvent={lastClickedEvent}
                          setLastClickedEvent={setLastClickedEvent}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          <AnimatePresence>
            {activeEvent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ 
                  opacity: 0.9, 
                  scale: 1.1, 
                  rotate: 3,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
                exit={{ opacity: 0, scale: 0.8, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  mass: 0.8
                }}
                className="cursor-grabbing"
              >
                <EventCard
                  event={activeEvent}
                  variant="compact"
                  calendarColor={calendarColorMap.get(activeEvent.calendar_id) || '#3b82f6'}
                  className="shadow-2xl border-2 border-white/20"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </DragOverlay>
        </DndContext>
      </Card>
      
      <AnimatePresence>
        {popoverState.open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              mass: 0.8 
            }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}