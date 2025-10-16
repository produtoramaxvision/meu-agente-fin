/**
 * Optimized Agenda Data Hook
 * Hook otimizado para dados da agenda com foco em performance
 * 
 * Melhorias implementadas:
 * - Agrupamento de queries relacionadas
 * - Cache inteligente com invalidação seletiva
 * - Debounce automático para filtros
 * - Prevenção de loops infinitos
 * - Batch loading de dados relacionados
 * - Otimização de realtime subscriptions
 */

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useQueryClient, useQuery, useMutation, useQueries } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';
import { RRule, RRuleSet, rrulestr } from 'rrule';
import { RealtimeChannel } from '@supabase/supabase-js';

// Interfaces (mantidas do hook original)
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

export interface Resource {
  id: string;
  phone: string;
  name: string;
  type: string;
  description: string | null;
  capacity: number | null;
  location: string | null;
  availability: any;
  created_at: string;
  updated_at: string;
}

export interface EventFormData {
  title: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  start_time: string;
  end_time: string;
  all_day: boolean;
  timezone: string;
  location?: string;
  conference_url?: string;
  category?: string;
  priority: string;
  privacy: string;
  status: string;
  calendar_id: string;
  color?: string;
}

export interface UseOptimizedAgendaDataOptions {
  view: string;
  startDate: Date;
  endDate: Date;
  calendarIds?: string[];
  categories?: string[];
  priorities?: string[];
  statuses?: string[];
  searchQuery?: string;
}

// Configurações de cache otimizadas
const CACHE_CONFIG = {
  CALENDARS: {
    staleTime: 10 * 60 * 1000, // 10 minutos - calendários mudam raramente
    gcTime: 30 * 60 * 1000, // 30 minutos
  },
  EVENTS: {
    staleTime: 2 * 60 * 1000, // 2 minutos - eventos podem mudar mais frequentemente
    gcTime: 10 * 60 * 1000, // 10 minutos
  },
  RESOURCES: {
    staleTime: 15 * 60 * 1000, // 15 minutos - recursos mudam raramente
    gcTime: 30 * 60 * 1000, // 30 minutos
  },
};

export function useOptimizedAgendaData(options: UseOptimizedAgendaDataOptions) {
  const { cliente } = useAuth();
  const queryClient = useQueryClient();
  
  // Debounce da busca para evitar requisições excessivas
  const debouncedSearchQuery = useDebounce(options.searchQuery || '', 300);
  
  // Refs para controle de loops infinitos
  const lastRequestTimeRef = useRef<number>(0);
  const requestCountRef = useRef<number>(0);
  const isBlockedRef = useRef<boolean>(false);
  const realtimeChannelRef = useRef<RealtimeChannel | null>(null);

  // ✅ OTIMIZAÇÃO 1: Query key estável usando valores primitivos
  const stableQueryKeys = useMemo(() => {
    const baseKey = ['agenda-data', cliente?.phone];
    
    return {
      calendars: [...baseKey, 'calendars'],
      events: [
        ...baseKey, 
        'events',
        options.view,
        options.startDate.getTime(),
        options.endDate.getTime(),
        options.calendarIds?.sort().join(',') || '',
        options.categories?.sort().join(',') || '',
        options.priorities?.sort().join(',') || '',
        options.statuses?.sort().join(',') || '',
        debouncedSearchQuery
      ],
      resources: [...baseKey, 'resources'],
    };
  }, [
    cliente?.phone,
    options.view,
    options.startDate.getTime(),
    options.endDate.getTime(),
    options.calendarIds?.sort().join(','),
    options.categories?.sort().join(','),
    options.priorities?.sort().join(','),
    options.statuses?.sort().join(','),
    debouncedSearchQuery
  ]);

  // ✅ OTIMIZAÇÃO 2: Usar useQueries para carregar dados relacionados em paralelo
  const queries = useQueries({
    queries: [
      // Query para calendários
      {
        queryKey: stableQueryKeys.calendars,
        queryFn: async (): Promise<Calendar[]> => {
          if (!cliente?.phone) return [];

          const { data, error } = await supabase
            .from('calendars')
            .select('*')
            .eq('phone', cliente.phone)
            .order('is_primary', { ascending: false })
            .order('name', { ascending: true });

          if (error) throw error;
          return (data as Calendar[]) || [];
        },
        enabled: !!cliente?.phone,
        staleTime: CACHE_CONFIG.CALENDARS.staleTime,
        gcTime: CACHE_CONFIG.CALENDARS.gcTime,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
      },
      
      // Query para eventos com proteção contra loops
      {
        queryKey: stableQueryKeys.events,
        queryFn: async (): Promise<Event[]> => {
          if (!cliente?.phone) return [];

          // ✅ PROTEÇÃO CONTRA LOOPS INFINITOS
          const now = Date.now();
          const timeSinceLastRequest = now - lastRequestTimeRef.current;
          
          if (isBlockedRef.current) {
            if (timeSinceLastRequest > 5000) {
              isBlockedRef.current = false;
              requestCountRef.current = 0;
            } else {
              console.warn('useOptimizedAgendaData: Requisição bloqueada temporariamente');
              return [];
            }
          }
          
          if (timeSinceLastRequest < 100) {
            requestCountRef.current++;
            if (requestCountRef.current > 10) {
              console.error('🚨 LOOP INFINITO DETECTADO! Bloqueando requisições por 5 segundos');
              isBlockedRef.current = true;
              return [];
            }
          } else {
            requestCountRef.current = 0;
          }
          
          lastRequestTimeRef.current = now;

          // Validar datas
          if (!options.startDate || !options.endDate || isNaN(options.startDate.getTime()) || isNaN(options.endDate.getTime())) {
            console.error('Invalid dates provided to useOptimizedAgendaData');
            return [];
          }

          // ✅ OTIMIZAÇÃO 3: Query otimizada com filtros no servidor
          let query = supabase
            .from('events')
            .select('*')
            .eq('phone', cliente.phone)
            .gte('start_ts', options.startDate.toISOString())
            .lte('end_ts', options.endDate.toISOString())
            .order('start_ts', { ascending: true });

          // Aplicar filtros opcionais
          if (options.calendarIds?.length) {
            query = query.in('calendar_id', options.calendarIds);
          }
          if (options.categories?.length) {
            query = query.in('category', options.categories);
          }
          if (options.priorities?.length) {
            query = query.in('priority', options.priorities);
          }
          if (options.statuses?.length) {
            query = query.in('status', options.statuses);
          }
          if (debouncedSearchQuery) {
            query = query.or(`title.ilike.%${debouncedSearchQuery}%,description.ilike.%${debouncedSearchQuery}%`);
          }

          const { data, error } = await query;
          if (error) throw error;

          let events = (data as Event[]) || [];

          // ✅ OTIMIZAÇÃO 4: Expandir eventos recorrentes de forma eficiente
          const expandedEvents: Event[] = [];
          
          for (const event of events) {
            if (event.rrule) {
              try {
                const rule = rrulestr(event.rrule);
                const occurrences = rule.between(options.startDate, options.endDate, true);
                
                for (const occurrence of occurrences) {
                  // Verificar se não está em exdates
                  if (event.exdates?.some(exdate => new Date(exdate).getTime() === occurrence.getTime())) {
                    continue;
                  }
                  
                  const eventStart = new Date(event.start_ts);
                  const eventEnd = new Date(event.end_ts);
                  const duration = eventEnd.getTime() - eventStart.getTime();
                  
                  expandedEvents.push({
                    ...event,
                    id: `${event.id}-${occurrence.getTime()}`,
                    start_ts: occurrence.toISOString(),
                    end_ts: new Date(occurrence.getTime() + duration).toISOString(),
                  });
                }
              } catch (error) {
                console.error('Error expanding recurring event:', error);
                expandedEvents.push(event);
              }
            } else {
              expandedEvents.push(event);
            }
          }

          // Adicionar rdates se existirem
          for (const event of events) {
            if (event.rdates?.length) {
              for (const rdate of event.rdates) {
                const rdateObj = new Date(rdate);
                if (rdateObj >= options.startDate && rdateObj <= options.endDate) {
                  const eventStart = new Date(event.start_ts);
                  const eventEnd = new Date(event.end_ts);
                  const duration = eventEnd.getTime() - eventStart.getTime();
                  
                  expandedEvents.push({
                    ...event,
                    id: `${event.id}-rdate-${rdateObj.getTime()}`,
                    start_ts: rdateObj.toISOString(),
                    end_ts: new Date(rdateObj.getTime() + duration).toISOString(),
                  });
                }
              }
            }
          }

          return expandedEvents.sort((a, b) => new Date(a.start_ts).getTime() - new Date(b.start_ts).getTime());
        },
        enabled: !!cliente?.phone && !!options.startDate && !!options.endDate,
        staleTime: CACHE_CONFIG.EVENTS.staleTime,
        gcTime: CACHE_CONFIG.EVENTS.gcTime,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
        placeholderData: (previousData) => previousData,
      },
      
      // Query para recursos
      {
        queryKey: stableQueryKeys.resources,
        queryFn: async (): Promise<Resource[]> => {
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
        staleTime: CACHE_CONFIG.RESOURCES.staleTime,
        gcTime: CACHE_CONFIG.RESOURCES.gcTime,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
        placeholderData: (previousData) => previousData,
      },
    ],
  });

  // Extrair resultados das queries
  const [calendarsQuery, eventsQuery, resourcesQuery] = queries;
  
  const calendars = calendarsQuery.data || [];
  const events = eventsQuery.data || [];
  const resources = resourcesQuery.data || [];
  
  const isLoading = calendarsQuery.isLoading || eventsQuery.isLoading || resourcesQuery.isLoading;
  const error = calendarsQuery.error || eventsQuery.error || resourcesQuery.error;

  // ✅ OTIMIZAÇÃO 5: Realtime subscription otimizada
  useEffect(() => {
    if (!cliente?.phone) return;

    // Limpar subscription anterior se existir
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
    }

    const channel = supabase
      .channel(`optimized-agenda:${cliente.phone}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `phone=eq.${cliente.phone}`,
        },
        (payload) => {
          console.log('Realtime event update:', payload);
          
          // ✅ INVALIDAÇÃO SELETIVA: Apenas invalidar queries relacionadas
          queryClient.invalidateQueries({ 
            queryKey: ['agenda-data', cliente.phone, 'events'],
            exact: false 
          });
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
        (payload) => {
          console.log('Realtime calendar update:', payload);
          
          // Invalidar tanto calendários quanto eventos (eventos dependem de calendários)
          queryClient.invalidateQueries({ 
            queryKey: ['agenda-data', cliente.phone, 'calendars'],
            exact: false 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['agenda-data', cliente.phone, 'events'],
            exact: false 
          });
        }
      )
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
    };
  }, [cliente?.phone, queryClient]);

  // ✅ OTIMIZAÇÃO 6: Função de refetch otimizada
  const refetch = useCallback(async () => {
    // Refetch apenas as queries que realmente precisam ser atualizadas
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: stableQueryKeys.events }),
      queryClient.invalidateQueries({ queryKey: stableQueryKeys.calendars }),
      queryClient.invalidateQueries({ queryKey: stableQueryKeys.resources }),
    ]);
  }, [queryClient, stableQueryKeys]);

  // Mutations otimizadas (mantidas do hook original mas com cache otimizado)
  const createEvent = useMutation({
    mutationFn: async (eventData: EventFormData) => {
      if (!cliente?.phone) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('events')
        .insert({
          phone: cliente.phone,
          calendar_id: eventData.calendar_id,
          title: eventData.title,
          description: eventData.description || null,
          start_ts: new Date(`${eventData.start_date.toDateString()} ${eventData.start_time}`).toISOString(),
          end_ts: new Date(`${eventData.end_date.toDateString()} ${eventData.end_time}`).toISOString(),
          all_day: eventData.all_day,
          timezone: eventData.timezone,
          location: eventData.location || null,
          conference_url: eventData.conference_url || null,
          category: eventData.category || null,
          priority: eventData.priority,
          privacy: eventData.privacy,
          status: eventData.status,
          color: eventData.color || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Event;
    },
    onSuccess: (newEvent) => {
      toast.success('Evento criado com sucesso!');
      
      // ✅ ATUALIZAÇÃO OTIMÍSTICA DO CACHE
      queryClient.setQueryData(stableQueryKeys.events, (oldData: Event[] | undefined) => {
        if (!oldData) return [newEvent];
        return [...oldData, newEvent].sort((a, b) => new Date(a.start_ts).getTime() - new Date(b.start_ts).getTime());
      });
    },
    onError: (error) => {
      console.error('Error creating event:', error);
      toast.error('Erro ao criar evento');
    },
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Event> }) => {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Event;
    },
    onSuccess: (updatedEvent) => {
      toast.success('Evento atualizado com sucesso!');
      
      // ✅ ATUALIZAÇÃO OTIMÍSTICA DO CACHE
      queryClient.setQueryData(stableQueryKeys.events, (oldData: Event[] | undefined) => {
        if (!oldData) return [updatedEvent];
        return oldData.map(event => event.id === updatedEvent.id ? updatedEvent : event);
      });
    },
    onError: (error) => {
      console.error('Error updating event:', error);
      toast.error('Erro ao atualizar evento');
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, deletedId) => {
      toast.success('Evento excluído com sucesso!');
      
      // ✅ ATUALIZAÇÃO OTIMÍSTICA DO CACHE
      queryClient.setQueryData(stableQueryKeys.events, (oldData: Event[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter(event => event.id !== deletedId);
      });
    },
    onError: (error) => {
      console.error('Error deleting event:', error);
      toast.error('Erro ao excluir evento');
    },
  });

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
    onSuccess: (newCalendar) => {
      toast.success('Agenda criada com sucesso!');
      
      // ✅ ATUALIZAÇÃO OTIMÍSTICA DO CACHE
      queryClient.setQueryData(stableQueryKeys.calendars, (oldData: Calendar[] | undefined) => {
        if (!oldData) return [newCalendar];
        return [...oldData, newCalendar].sort((a, b) => {
          if (a.is_primary !== b.is_primary) return b.is_primary ? 1 : -1;
          return a.name.localeCompare(b.name);
        });
      });
    },
    onError: (error) => {
      console.error('Error creating calendar:', error);
      toast.error('Erro ao criar agenda');
    },
  });

  return {
    // Dados
    calendars,
    events,
    resources,
    
    // Estados
    isLoading,
    error,
    
    // Ações
    refetch,
    createEvent,
    updateEvent,
    deleteEvent,
    createCalendar,
  };
}