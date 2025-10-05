import { useEffect, useMemo, useState, useCallback } from 'react';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addWeeks, addMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, CalendarDays, RefreshCw, X } from 'lucide-react';
import { useAgendaData, Event, EventFormData } from '@/hooks/useAgendaData';
import { AgendaFilters } from '@/components/AgendaFilters';
import { WorldClock } from '@/components/WorldClock';
import { EventForm } from '@/components/EventForm';
import { UpcomingTasksCard } from '@/components/UpcomingTasksCard';
import { useSearch } from '@/contexts/SearchContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { DateRange } from 'react-day-picker';

import AgendaGridDay from '@/components/AgendaGridDay';
import AgendaGridWeek from '@/components/AgendaGridWeek';
import AgendaGridMonth from '@/components/AgendaGridMonth';
import AgendaList from '@/components/AgendaList';
import AgendaTimeline from '@/components/AgendaTimeline';
import AgendaYearHeatmap from '@/components/AgendaYearHeatmap';

type View = 'day' | 'week' | 'month' | 'agenda' | 'timeline' | 'year';

export default function Agenda() {
  const { cliente } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [view, setView] = useState<View>('week');
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [defaultEventData, setDefaultEventData] = useState<Partial<EventFormData> | null>(null);

  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [localSearch, setLocalSearch] = useState('');

  const { startDate, endDate } = useMemo(() => {
    // If range is selected, use it for filtering
    if (dateRange?.from && dateRange?.to) {
      return { startDate: startOfDay(dateRange.from), endDate: endOfDay(dateRange.to) };
    }
    
    switch (view) {
      case 'day':
        return { startDate: startOfDay(selectedDate), endDate: endOfDay(selectedDate) };
      case 'week':
        return { startDate: startOfWeek(selectedDate, { locale: ptBR }), endDate: endOfWeek(selectedDate, { locale: ptBR }) };
      case 'month':
      case 'year':
      case 'timeline':
      case 'agenda':
      default:
        return { startDate: startOfMonth(selectedDate), endDate: endOfMonth(selectedDate) };
    }
  }, [view, selectedDate, dateRange]);

  const { calendars, events, resources, isLoading, refetch, createEvent, updateEvent, createCalendar } = useAgendaData({
    view,
    startDate,
    endDate,
    calendarIds: selectedCalendars.length ? selectedCalendars : undefined,
    categories: selectedCategories.length ? selectedCategories : undefined,
    priorities: selectedPriorities.length ? selectedPriorities : undefined,
    statuses: selectedStatuses.length ? selectedStatuses : undefined,
    searchQuery: localSearch || searchQuery,
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>('input[type="search"]');
        input?.focus();
        return;
      }
      if (e.key.toLowerCase() === 'n') setEventFormOpen(true);
      if (e.key === '/') {
        const input = document.querySelector<HTMLInputElement>('input[type="search"]');
        e.preventDefault();
        input?.focus();
      }
      if (['w','d','m','a','t','y'].includes(e.key.toLowerCase())) {
        const map: Record<string, View> = { w: 'week', d: 'day', m: 'month', a: 'agenda', t: 'timeline', y: 'year' };
        setView(map[e.key.toLowerCase()]);
      }
      if (e.key === 'ArrowLeft') {
        setSelectedDate(prev => {
          switch (view) {
            case 'day': return addDays(prev, -1);
            case 'week': return addWeeks(prev, -1);
            default: return addMonths(prev, -1);
          }
        });
      }
      if (e.key === 'ArrowRight') {
        setSelectedDate(prev => {
          switch (view) {
            case 'day': return addDays(prev, 1);
            case 'week': return addWeeks(prev, 1);
            default: return addMonths(prev, 1);
          }
        });
      }
      if (e.key === 'Escape') setEventFormOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [view]);

  const onClearFilters = () => {
    setSelectedCalendars([]);
    setSelectedCategories([]);
    setSelectedPriorities([]);
    setSelectedStatuses([]);
    setLocalSearch('');
    setSearchQuery('');
    setDateRange(undefined);
  };

  const handleCreateEvent = useCallback((data: any) => {
    const mutation = eventToEdit ? updateEvent : createEvent;
    const mutationData = eventToEdit ? { id: eventToEdit.id, updates: data } : data;
    
    mutation.mutate(mutationData, {
      onSuccess: () => {
        setEventFormOpen(false);
        setEventToEdit(null);
        setDefaultEventData(null);
      },
    });
  }, [createEvent, updateEvent, eventToEdit]);

  const handleQuickCreate = useCallback((data: any) => {
    createEvent.mutate(data);
  }, [createEvent]);

  const handleEventDoubleClick = useCallback((data: any) => {
    setEventToEdit(null);
    setDefaultEventData(data);
    setEventFormOpen(true);
  }, []);

  const onEventClick = useCallback((evt: any) => {
    toast.info(evt.title, { description: `${format(new Date(evt.start_ts), "dd/MM/yyyy HH:mm")} • ${evt.location || 'Sem local'}` });
  }, []);

  return (
    <div className="py-4 sm:py-6 lg:py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-extrabold bg-gradient-to-br from-text via-brand-700 to-brand-500 bg-clip-text text-transparent drop-shadow-sm">
              Agenda
            </h1>
            <p className="text-text-muted mt-2">
              Seu calendário inteligente, com múltiplas vistas e atualização em tempo real.
            </p>
          </div>
          
          <div className="pt-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <Tabs value={view} onValueChange={(v) => setView(v as View)} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 h-auto">
                <TabsTrigger value="day" className="text-xs px-3 py-1.5">Dia</TabsTrigger>
                <TabsTrigger value="week" className="text-xs px-3 py-1.5">Semana</TabsTrigger>
                <TabsTrigger value="month" className="text-xs px-3 py-1.5">Mês</TabsTrigger>
                <TabsTrigger value="agenda" className="text-xs px-3 py-1.5">Agenda</TabsTrigger>
                <TabsTrigger value="timeline" className="text-xs px-3 py-1.5">Timeline</TabsTrigger>
                <TabsTrigger value="year" className="text-xs px-3 py-1.5">Ano</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Botão Novo Evento - Mobile/Tablet */}
        <div className="lg:hidden animate-fade-in" style={{ animationDelay: '150ms' }}>
          <button
            onClick={() => setEventFormOpen(true)}
            className="group relative overflow-hidden rounded-lg px-4 py-2.5 transition-all duration-200 bg-gradient-to-br from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 w-full"
          >
            <Plus className="h-4 w-4 text-white transition-transform group-hover:scale-110 group-hover:rotate-90" />
            <span className="text-sm font-semibold text-white">Novo Evento</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      </div>

      {/* Calendar & Actions Section */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-[minmax(320px,420px)_1fr_minmax(320px,420px)]">
        {/* Card Calendário */}
        <Card className="group relative overflow-hidden rounded-xl border-border/40 bg-card/50 shadow-sm hover:scale-[1.01] transition-all duration-200 animate-fade-in hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '0ms' }}>
          <CardContent className="p-4 sm:p-6 relative z-10">
            <div className="max-w-md mx-auto">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
                locale={ptBR}
                className="p-0"
                numberOfMonths={1}
              />
              {dateRange?.from && dateRange?.to && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium text-primary">Período selecionado:</span>
                      <div className="mt-1 text-text-muted">
                        {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDateRange(undefined)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between gap-2 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedDate(new Date());
                    setDateRange(undefined);
                  }}
                  className="flex-1 group/hoje relative overflow-hidden rounded-lg p-2 transition-all duration-200 hover:scale-105 hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-text))] hover:shadow-md"
                >
                  <span className="relative z-10 flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 transition-transform duration-300 group-hover/hoje:scale-110" /> Hoje
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/hoje:translate-x-full transition-transform duration-700" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetch()}
                  className="flex-1 group/atualizar relative overflow-hidden rounded-lg p-2 transition-all duration-200 hover:scale-105 hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-text))] hover:shadow-md"
                >
                  <span className="relative z-10 flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 transition-transform duration-300 group-hover/atualizar:rotate-180" /> Atualizar
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/atualizar:translate-x-full transition-transform duration-700" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Desktop: Coluna do meio com Botão e WorldClock */}
        <div className="hidden lg:flex lg:flex-col gap-6">
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <button
              onClick={() => setEventFormOpen(true)}
              className="group relative overflow-hidden rounded-lg px-4 py-2.5 transition-all duration-200 bg-gradient-to-br from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 w-full"
            >
              <Plus className="h-4 w-4 text-white transition-transform group-hover:scale-110 group-hover:rotate-90" />
              <span className="text-sm font-semibold text-white">Novo Evento</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
          
          <Card className="group relative overflow-hidden hover:scale-[1.01] transition-all duration-200 animate-fade-in hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '200ms' }}>
            <div className="relative z-10">
              <WorldClock />
            </div>
          </Card>
        </div>

        {/* Desktop: Coluna direita com Tarefas Urgentes */}
        <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '300ms' }}>
          <UpcomingTasksCard />
        </div>

        {/* Mobile/Tablet: WorldClock em card separado */}
        <Card className="lg:hidden group relative overflow-hidden hover:scale-[1.01] transition-all duration-200 animate-fade-in hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '100ms' }}>
          <div className="relative z-10">
            <WorldClock />
          </div>
        </Card>
      </div>

      <Card className="group relative overflow-hidden hover:scale-[1.01] transition-all duration-200 animate-fade-in hover:shadow-lg hover:shadow-primary/5 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '200ms' }}>
        <CardHeader className="flex flex-row items-center justify-between relative z-10">
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <AgendaFilters
            calendars={calendars}
            selectedCalendars={selectedCalendars}
            onCalendarsChange={setSelectedCalendars}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            selectedPriorities={selectedPriorities}
            onPrioritiesChange={setSelectedPriorities}
            selectedStatuses={selectedStatuses}
            onStatusesChange={setSelectedStatuses}
            searchQuery={localSearch}
            onSearchQueryChange={setLocalSearch}
            onClearFilters={onClearFilters}
          />
        </CardContent>
      </Card>

      <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
        {view === 'day' && (
          <AgendaGridDay
            date={selectedDate}
            events={events}
            calendars={calendars}
            isLoading={isLoading}
            onEventClick={onEventClick}
            onEventCreate={handleQuickCreate}
            onEventDoubleClick={handleEventDoubleClick}
          />
        )}
        {view === 'week' && (
          <AgendaGridWeek
            weekDate={selectedDate}
            events={events}
            isLoading={isLoading}
            onEventClick={onEventClick}
          />
        )}
        {view === 'month' && (
          <AgendaGridMonth
            monthDate={selectedDate}
            events={events}
            isLoading={isLoading}
            onEventClick={onEventClick}
          />
        )}
        {view === 'agenda' && (
          <AgendaList
            startDate={startDate}
            endDate={endDate}
            events={events}
            isLoading={isLoading}
            onEventClick={onEventClick}
          />
        )}
        {view === 'timeline' && (
          <AgendaTimeline
            startDate={startDate}
            endDate={endDate}
            events={events}
            resources={resources}
            isLoading={isLoading}
            onEventClick={onEventClick}
          />
        )}
        {view === 'year' && (
          <AgendaYearHeatmap
            yearDate={selectedDate}
            events={events}
            isLoading={isLoading}
          />
        )}
      </div>

      <EventForm
        open={eventFormOpen}
        onOpenChange={(isOpen) => {
          setEventFormOpen(isOpen);
          if (!isOpen) {
            setEventToEdit(null);
            setDefaultEventData(null);
          }
        }}
        onSubmit={handleCreateEvent}
        eventToEdit={eventToEdit}
        defaultEventData={defaultEventData}
        calendars={calendars}
        createCalendar={createCalendar.mutate}
        isSubmitting={createEvent.isPending || updateEvent.isPending}
      />
    </div>
  );
}