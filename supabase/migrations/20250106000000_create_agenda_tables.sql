-- Criação das tabelas de agenda/eventos
-- BUG FIX - TestSprite TC009 - CORREÇÃO CRÍTICA DA AGENDA
-- Problema: Tabelas de eventos não existiam, causando erros 401 e botão desabilitado
-- Solução: Criar tabelas necessárias com políticas RLS adequadas
-- Data: 2025-01-06
-- Status: CORRIGIDO E VALIDADO

-- Tabela de calendários
CREATE TABLE IF NOT EXISTS public.calendars (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3b82f6',
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE,
    phone TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_ts TIMESTAMP WITH TIME ZONE NOT NULL,
    end_ts TIMESTAMP WITH TIME ZONE NOT NULL,
    all_day BOOLEAN DEFAULT false,
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    location TEXT,
    conference_url TEXT,
    category TEXT,
    priority TEXT DEFAULT 'medium',
    privacy TEXT DEFAULT 'default',
    status TEXT DEFAULT 'confirmed',
    color TEXT,
    rrule TEXT,
    rdates TEXT[],
    exdates TEXT[],
    series_master_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de participantes de eventos
CREATE TABLE IF NOT EXISTS public.event_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'attendee',
    response TEXT DEFAULT 'pending',
    comment TEXT,
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de lembretes de eventos
CREATE TABLE IF NOT EXISTS public.event_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    method TEXT NOT NULL,
    offset_minutes INTEGER NOT NULL,
    payload JSONB DEFAULT '{}'
);

-- Tabela de recursos
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    capacity INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de recursos de eventos
CREATE TABLE IF NOT EXISTS public.event_resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
    UNIQUE(event_id, resource_id)
);

-- Habilitar RLS
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_resources ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para calendars
CREATE POLICY "Users can view their own calendars"
ON public.calendars
FOR SELECT
USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

CREATE POLICY "Users can insert their own calendars"
ON public.calendars
FOR INSERT
WITH CHECK (phone = current_setting('request.jwt.claims', true)::json->>'phone');

CREATE POLICY "Users can update their own calendars"
ON public.calendars
FOR UPDATE
USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

CREATE POLICY "Users can delete their own calendars"
ON public.calendars
FOR DELETE
USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

-- Políticas RLS para events
CREATE POLICY "Users can view their own events"
ON public.events
FOR SELECT
USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

CREATE POLICY "Users can insert their own events"
ON public.events
FOR INSERT
WITH CHECK (phone = current_setting('request.jwt.claims', true)::json->>'phone');

CREATE POLICY "Users can update their own events"
ON public.events
FOR UPDATE
USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

CREATE POLICY "Users can delete their own events"
ON public.events
FOR DELETE
USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

-- Políticas RLS para event_participants
CREATE POLICY "Users can view participants of their events"
ON public.event_participants
FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_participants.event_id 
    AND events.phone = current_setting('request.jwt.claims', true)::json->>'phone'
));

CREATE POLICY "Users can insert participants to their events"
ON public.event_participants
FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_participants.event_id 
    AND events.phone = current_setting('request.jwt.claims', true)::json->>'phone'
));

CREATE POLICY "Users can update participants of their events"
ON public.event_participants
FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_participants.event_id 
    AND events.phone = current_setting('request.jwt.claims', true)::json->>'phone'
));

CREATE POLICY "Users can delete participants of their events"
ON public.event_participants
FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_participants.event_id 
    AND events.phone = current_setting('request.jwt.claims', true)::json->>'phone'
));

-- Políticas RLS para event_reminders
CREATE POLICY "Users can view reminders of their events"
ON public.event_reminders
FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_reminders.event_id 
    AND events.phone = current_setting('request.jwt.claims', true)::json->>'phone'
));

CREATE POLICY "Users can insert reminders to their events"
ON public.event_reminders
FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_reminders.event_id 
    AND events.phone = current_setting('request.jwt.claims', true)::json->>'phone'
));

CREATE POLICY "Users can update reminders of their events"
ON public.event_reminders
FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_reminders.event_id 
    AND events.phone = current_setting('request.jwt.claims', true)::json->>'phone'
));

CREATE POLICY "Users can delete reminders of their events"
ON public.event_reminders
FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_reminders.event_id 
    AND events.phone = current_setting('request.jwt.claims', true)::json->>'phone'
));

-- Políticas RLS para resources
CREATE POLICY "Users can view their own resources"
ON public.resources
FOR SELECT
USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

CREATE POLICY "Users can insert their own resources"
ON public.resources
FOR INSERT
WITH CHECK (phone = current_setting('request.jwt.claims', true)::json->>'phone');

CREATE POLICY "Users can update their own resources"
ON public.resources
FOR UPDATE
USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

CREATE POLICY "Users can delete their own resources"
ON public.resources
FOR DELETE
USING (phone = current_setting('request.jwt.claims', true)::json->>'phone');

-- Políticas RLS para event_resources
CREATE POLICY "Users can view resources of their events"
ON public.event_resources
FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_resources.event_id 
    AND events.phone = current_setting('request.jwt.claims', true)::json->>'phone'
));

CREATE POLICY "Users can insert resources to their events"
ON public.event_resources
FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_resources.event_id 
    AND events.phone = current_setting('request.jwt.claims', true)::json->>'phone'
));

CREATE POLICY "Users can update resources of their events"
ON public.event_resources
FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_resources.event_id 
    AND events.phone = current_setting('request.jwt.claims', true)::json->>'phone'
));

CREATE POLICY "Users can delete resources of their events"
ON public.event_resources
FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_resources.event_id 
    AND events.phone = current_setting('request.jwt.claims', true)::json->>'phone'
));

-- Criar calendário padrão para usuários existentes
INSERT INTO public.calendars (phone, name, color, is_primary)
SELECT DISTINCT phone, 'Agenda Principal', '#3b82f6', true
FROM public.clientes
WHERE phone NOT IN (SELECT phone FROM public.calendars);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_calendars_phone ON public.calendars(phone);
CREATE INDEX IF NOT EXISTS idx_events_phone ON public.events(phone);
CREATE INDEX IF NOT EXISTS idx_events_calendar_id ON public.events(calendar_id);
CREATE INDEX IF NOT EXISTS idx_events_start_ts ON public.events(start_ts);
CREATE INDEX IF NOT EXISTS idx_events_end_ts ON public.events(end_ts);
CREATE INDEX IF NOT EXISTS idx_resources_phone ON public.resources(phone);
