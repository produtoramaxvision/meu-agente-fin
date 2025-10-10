import { useEffect, useState, useCallback, useMemo } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { RRule, RRuleSet, rrulestr } from 'rrule';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Calendar {
  id: string;
  phone: string;
  name: string;
  color: string;
  timezone: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  calendar_id: string;
  phone: string;
  title: string;
  description: string | null;
  start_ts: string;
  end_ts: string;
  all_day: boolean;
  timezone: string;
  location: string | null;
  conference_url: string | null;
  category: string | null;
  priority: string;
  privacy: string;
  status: string;
  color: string | null;
  rrule: string | null;
  rdates: string[] | null;
  exdates: string[] | null;
  series_master_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventParticipant {
  id: string;
  event_id: string;
  name: string;
  email: string;
  role: string;
  response: string;
  comment: string | null;
  invited_at: string;
  responded_at: string | null;
}

export interface EventReminder {
  id: string;
  event_id: string;
  method: string;
  offset_minutes: number;
  payload: Record<string, any>;
}

export interface Resource {
  id: string;
  phone: string;
  type: string;
  name: string;
  capacity: number | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EventFormData {
  title: string;
  description?: string;
  start_ts: Date;
  end_ts: Date;
  all_day?: boolean;
  timezone?: string;
  location?: string;
  conference_url?: string;
  category?: string;
  priority?: string;
  privacy?: string;
  status?: string;
  color?: string;
  calendar_id?: string;
  rrule?: string;
  rdates?: Date[];
  exdates?: Date[];
  participants?: Omit<EventParticipant, 'id' | 'event_id' | 'invited_at' | 'responded_at'>[];
  reminders?: Omit<EventReminder, 'id' | 'event_id'>[];
  resource_ids?: string[];
}

interface UseAgendaDataOptions {
  view: 'day' | 'week' | 'month' | 'agenda' | 'timeline' | 'year';
  startDate: Date;
  endDate: Date;
  calendarIds?: string[];
  categories?: string[];
  priorities?: string[];
  statuses?: string[];
  searchQuery?: string;
}

export function useAgendaData(options: UseAgendaDataOptions) {
  const { cliente } = useAuth();
  const queryClient = useQueryClient();
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Fetch calendars com cache otimizado
  const { data: calendars = [], isLoading: calendarsLoading } = useQuery({
    queryKey: ['calendars', cliente?.phone],
    queryFn: async () => {
      if (!cliente?.phone) {
        return [];
      }

      const { data, error } = await supabase
        .from('calendars')
        .select('*')
        .eq('phone', cliente.phone)
        .order('is_primary', { ascending: false })
        .order('name', { ascending: true });

      if (error) {
        console.error('useAgendaData: Error fetching calendars:', error);
        throw error;
      }
      
      return (data as Calendar[]) || [];
    },
    enabled: !!cliente?.phone,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
    refetchOnWindowFocus: false, // Reduzir refetch desnecessário
    refetchOnMount: false, // Usar cache quando possível
    refetchInterval: 1000 * 60 * 10, // Refetch a cada 10 minutos
  });

  // Fetch events with expansion of recurring events e cache otimizado
  const { data: events = [], isLoading: eventsLoading, refetch } = useQuery({
    queryKey: ['events', cliente?.phone, options.view, options.startDate.toISOString(), options.endDate.toISOString(), options.calendarIds, options.categories, options.priorities, options.statuses, options.searchQuery],
    queryFn: async () => {
      if (!cliente?.phone) return [];

      let query = supabase
        .from('events')
        .select('*')
        .eq('phone', cliente.phone)
        .or(`and(start_ts.gte.${options.startDate.toISOString()},start_ts.lte.${options.endDate.toISOString()}),and(end_ts.gte.${options.startDate.toISOString()},end_ts.lte.${options.endDate.toISOString()}),rrule.not.is.null`);

      if (options.calendarIds && options.calendarIds.length > 0) {
        query = query.in('calendar_id', options.calendarIds);
      }

      if (options.categories && options.categories.length > 0) {
        query = query.in('category', options.categories);
      }

      if (options.priorities && options.priorities.length > 0) {
        query = query.in('priority', options.priorities);
      }

      if (options.statuses && options.statuses.length > 0) {
        query = query.in('status', options.statuses);
      }

      if (options.searchQuery && options.searchQuery.trim()) {
        query = query.or(`title.ilike.%${options.searchQuery}%,description.ilike.%${options.searchQuery}%,location.ilike.%${options.searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const rawEvents = (data as Event[]) || [];
      
      // Expand recurring events com otimização
      const expandedEvents: Event[] = [];
      
      for (const event of rawEvents) {
        if (event.rrule) {
          try {
            const rrule = rrulestr(event.rrule, {
              dtstart: new Date(event.start_ts),
            });

            const occurrences = rrule.between(options.startDate, options.endDate, true);
            
            // Apply exdates - usar Set para performance
            const exdatesSet = new Set(
              (event.exdates || []).map(d => new Date(d).toISOString())
            );

            for (const occurrence of occurrences) {
              if (!exdatesSet.has(occurrence.toISOString())) {
                const duration = new Date(event.end_ts).getTime() - new Date(event.start_ts).getTime();
                expandedEvents.push({
                  ...event,
                  id: `${event.id}_${occurrence.toISOString()}`,
                  start_ts: occurrence.toISOString(),
                  end_ts: new Date(occurrence.getTime() + duration).toISOString(),
                  series_master_id: event.id,
                });
              }
            }

            // Add rdates
            if (event.rdates && event.rdates.length > 0) {
              for (const rdate of event.rdates) {
                const rdateObj = new Date(rdate);
                if (rdateObj >= options.startDate && rdateObj <= options.endDate) {
                  const duration = new Date(event.end_ts).getTime() - new Date(event.start_ts).getTime();
                  expandedEvents.push({
                    ...event,
                    id: `${event.id}_${rdateObj.toISOString()}`,
                    start_ts: rdateObj.toISOString(),
                    end_ts: new Date(rdateObj.getTime() + duration).toISOString(),
                    series_master_id: event.id,
                  });
                }
              }
            }
          } catch (error) {
            console.error('Error expanding recurring event:', error);
            // Include the master event if expansion fails
            expandedEvents.push(event);
          }
        } else {
          // Non-recurring event
          expandedEvents.push(event);
        }
      }

      return expandedEvents;
    },
    enabled: !!cliente?.phone,
    staleTime: 1000 * 60 * 2, // 2 minutos de cache para eventos
    refetchOnWindowFocus: false, // Reduzir refetch desnecessário
    refetchOnMount: false, // Usar cache quando possível
    refetchInterval: 1000 * 60 * 5, // Refetch a cada 5 minutos
    // Usar placeholderData para melhor UX
    placeholderData: (previousData) => previousData,
  });

  // Fetch resources com cache otimizado
  const { data: resources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ['resources', cliente?.phone],
    queryFn: async () => {
      if (!cliente?.phone) return [];

      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('phone', cliente.phone)
        .order('type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return (data as Resource[]) || [];
    },
    enabled: !!cliente?.phone,
    staleTime: 1000 * 60 * 10, // 10 minutos de cache para recursos
    refetchOnWindowFocus: false, // Reduzir refetch desnecessário
    refetchOnMount: false, // Usar cache quando possível
    refetchInterval: 1000 * 60 * 15, // Refetch a cada 15 minutos
    placeholderData: (previousData) => previousData,
  });

  // Setup Realtime subscription
  useEffect(() => {
    if (!cliente?.phone) return;

    const realtimeChannel = supabase
      .channel(`agenda:${cliente.phone}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `phone=eq.${cliente.phone}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['events', cliente.phone] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendars',
          filter: `phone=eq.${cliente.phone}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['calendars', cliente.phone] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resources',
          filter: `phone=eq.${cliente.phone}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['resources', cliente.phone] });
        }
      )
      .subscribe();

    setChannel(realtimeChannel);

    return () => {
      realtimeChannel.unsubscribe();
    };
  }, [cliente?.phone, queryClient]);

  // Create event mutation
  const createEvent = useMutation({
    mutationFn: async (eventData: EventFormData) => {
      if (!cliente?.phone) throw new Error('User not authenticated');

      const { participants, reminders, resource_ids, ...eventFields } = eventData;

      // Validação de horários melhorada conforme Context7
      if (!eventFields.all_day) {
        if (eventFields.start_ts >= eventFields.end_ts) {
          throw new Error('O horário de início deve ser anterior ao horário de término');
        }
        
        // Validar se as datas são válidas
        if (isNaN(eventFields.start_ts.getTime()) || isNaN(eventFields.end_ts.getTime())) {
          throw new Error('Datas inválidas fornecidas');
        }
        
        // Validar se não está muito no passado (opcional)
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        if (eventFields.start_ts < oneYearAgo) {
          throw new Error('Não é possível criar eventos com mais de um ano de antecedência');
        }
      }

      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          phone: cliente.phone,
          calendar_id: eventFields.calendar_id || calendars.find(c => c.is_primary)?.id,
          title: eventFields.title,
          description: eventFields.description || null,
          start_ts: eventFields.start_ts.toISOString(),
          end_ts: eventFields.end_ts.toISOString(),
          all_day: eventFields.all_day || false,
          timezone: eventFields.timezone || 'America/Sao_Paulo',
          location: eventFields.location || null,
          conference_url: eventFields.conference_url || null,
          category: eventFields.category || null,
          priority: eventFields.priority || 'medium',
          privacy: eventFields.privacy || 'default',
          status: eventFields.status || 'confirmed',
          color: eventFields.color || null,
          rrule: eventFields.rrule || null,
          rdates: eventFields.rdates?.map(d => d.toISOString()) || null,
          exdates: eventFields.exdates?.map(d => d.toISOString()) || null,
        })
        .select()
        .single();

      if (eventError) throw eventError;

      // Add participants
      if (participants && participants.length > 0) {
        const { error: participantsError } = await supabase
          .from('event_participants')
          .insert(
            participants.map(p => ({
              event_id: event.id,
              ...p,
            }))
          );

        if (participantsError) throw participantsError;
      }

      // Add reminders
      if (reminders && reminders.length > 0) {
        const { error: remindersError } = await supabase
          .from('event_reminders')
          .insert(
            reminders.map(r => ({
              event_id: event.id,
              ...r,
            }))
          );

        if (remindersError) throw remindersError;
      }

      // Add resources
      if (resource_ids && resource_ids.length > 0) {
        const { error: resourcesError } = await supabase
          .from('event_resources')
          .insert(
            resource_ids.map(rid => ({
              event_id: event.id,
              resource_id: rid,
            }))
          );

        if (resourcesError) throw resourcesError;
      }

      return event as Event;
    },
    onSuccess: () => {
      toast.success('Evento criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['events', cliente?.phone] });
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar evento';
      toast.error(errorMessage);
    },
  });

  // Update event mutation
  const updateEvent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<EventFormData> }) => {
      const { participants, reminders, resource_ids, ...eventFields } = updates;

      // Validação de horários melhorada conforme Context7
      if (eventFields.start_ts && eventFields.end_ts && !eventFields.all_day) {
        if (eventFields.start_ts >= eventFields.end_ts) {
          throw new Error('O horário de início deve ser anterior ao horário de término');
        }
        
        // Validar se as datas são válidas
        if (isNaN(eventFields.start_ts.getTime()) || isNaN(eventFields.end_ts.getTime())) {
          throw new Error('Datas inválidas fornecidas');
        }
        
        // Validar se não está muito no passado (opcional)
        const now = new Date();
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        if (eventFields.start_ts < oneYearAgo) {
          throw new Error('Não é possível criar eventos com mais de um ano de antecedência');
        }
      }

      const updateData: any = {};
      if (eventFields.title !== undefined) updateData.title = eventFields.title;
      if (eventFields.description !== undefined) updateData.description = eventFields.description;
      if (eventFields.start_ts !== undefined) updateData.start_ts = eventFields.start_ts.toISOString();
      if (eventFields.end_ts !== undefined) updateData.end_ts = eventFields.end_ts.toISOString();
      if (eventFields.all_day !== undefined) updateData.all_day = eventFields.all_day;
      if (eventFields.timezone !== undefined) updateData.timezone = eventFields.timezone;
      if (eventFields.location !== undefined) updateData.location = eventFields.location;
      if (eventFields.conference_url !== undefined) updateData.conference_url = eventFields.conference_url;
      if (eventFields.category !== undefined) updateData.category = eventFields.category;
      if (eventFields.priority !== undefined) updateData.priority = eventFields.priority;
      if (eventFields.privacy !== undefined) updateData.privacy = eventFields.privacy;
      if (eventFields.status !== undefined) updateData.status = eventFields.status;
      if (eventFields.color !== undefined) updateData.color = eventFields.color;
      if (eventFields.calendar_id !== undefined) updateData.calendar_id = eventFields.calendar_id;
      if (eventFields.rrule !== undefined) updateData.rrule = eventFields.rrule;
      if (eventFields.rdates !== undefined) updateData.rdates = eventFields.rdates?.map(d => d.toISOString());
      if (eventFields.exdates !== undefined) updateData.exdates = eventFields.exdates?.map(d => d.toISOString());

      const { data: event, error: eventError } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (eventError) throw eventError;

      return event as Event;
    },
    onSuccess: () => {
      toast.success('Evento atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['events', cliente?.phone] });
    },
    onError: (error) => {
      console.error('Error updating event:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar evento';
      toast.error(errorMessage);
    },
  });

  // Delete event mutation
  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Evento excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['events', cliente?.phone] });
    },
    onError: (error) => {
      console.error('Error deleting event:', error);
      toast.error('Erro ao excluir evento');
    },
  });

  // Duplicate event mutation
  const duplicateEvent = useMutation({
    mutationFn: async (event: Event) => {
      if (!cliente?.phone) throw new Error('User not authenticated');

      const { data: newEvent, error: eventError } = await supabase
        .from('events')
        .insert({
          phone: cliente.phone,
          calendar_id: event.calendar_id,
          title: `${event.title} (cópia)`,
          description: event.description,
          start_ts: event.start_ts,
          end_ts: event.end_ts,
          all_day: event.all_day,
          timezone: event.timezone,
          location: event.location,
          conference_url: event.conference_url,
          category: event.category,
          priority: event.priority,
          privacy: event.privacy,
          status: event.status,
          color: event.color,
        })
        .select()
        .single();

      if (eventError) throw eventError;
      return newEvent as Event;
    },
    onSuccess: () => {
      toast.success('Evento duplicado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['events', cliente?.phone] });
    },
    onError: (error) => {
      console.error('Error duplicating event:', error);
      toast.error('Erro ao duplicar evento');
    },
  });

  // Create calendar mutation
  const createCalendar = useMutation({
    mutationFn: async (calendarData: Omit<Calendar, 'id' | 'phone' | 'created_at' | 'updated_at'>) => {
      if (!cliente?.phone) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('calendars')
        .insert({
          phone: cliente.phone,
          ...calendarData,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Calendar;
    },
    onSuccess: () => {
      toast.success('Agenda criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['calendars', cliente?.phone] });
    },
    onError: (error) => {
      console.error('Error creating calendar:', error);
      toast.error('Erro ao criar agenda');
    },
  });

  return {
    calendars,
    events,
    resources,
    isLoading: calendarsLoading || eventsLoading || resourcesLoading,
    refetch,
    createEvent,
    updateEvent,
    deleteEvent,
    duplicateEvent,
    createCalendar,
  };
}