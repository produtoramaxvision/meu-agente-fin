-- ============================================================================
-- MIGRAÇÃO COMPLETA - MEU AGENTE FINANCEIRO
-- ============================================================================
-- Este script SQL contém TODA a estrutura do banco de dados:
-- - Extensões
-- - Tipos customizados (ENUMs)
-- - Sequences
-- - Tabelas com todas as colunas, constraints e comentários
-- - Índices
-- - Funções
-- - Triggers
-- - Políticas RLS (Row Level Security)
-- - Storage buckets e policies
--
-- Para usar: copie e cole este SQL no SQL Editor do novo projeto Supabase
-- ============================================================================

-- ============================================================================
-- 1. EXTENSÕES
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. TIPOS CUSTOMIZADOS (ENUMS)
-- ============================================================================

CREATE TYPE public.financeiro_tipo AS ENUM ('entrada', 'saida');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.task_status AS ENUM ('pending', 'done', 'overdue');
CREATE TYPE public.delivery_status AS ENUM ('pending', 'delivered', 'failed', 'discarded');
CREATE TYPE public.execution_status AS ENUM ('queued', 'running', 'succeeded', 'failed', 'canceled');
CREATE TYPE public.llm_provider AS ENUM ('openai', 'azure_openai', 'anthropic', 'google', 'other');
CREATE TYPE public.message_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE public.subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'paused');

-- ============================================================================
-- 3. SEQUENCES
-- ============================================================================

CREATE SEQUENCE IF NOT EXISTS public.bd_ativo_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.chat_meu_agente_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.chat_agente_sdr_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.financeiro_registros_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS public.chat_remarketing_id_seq START WITH 1 INCREMENT BY 1;

-- ============================================================================
-- 4. TABELAS
-- ============================================================================

-- ---------------------------------------------------------------------------
-- TABELA: clientes (usuários do sistema)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clientes (
    phone VARCHAR(15) PRIMARY KEY CHECK (phone ~ '^\d{10,15}$'),
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE,
    password TEXT,
    subscription_active BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    whatsapp_instance_url TEXT,
    plan_id TEXT,
    billing_provider TEXT,
    external_subscription_id TEXT,
    trial_ends_at TIMESTAMPTZ,
    last_seen_at TIMESTAMPTZ,
    avatar_url TEXT,
    cpf VARCHAR(14),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON COLUMN public.clientes.cpf IS 'CPF do cliente (opcional, formato: XXX.XXX.XXX-XX)';
COMMENT ON COLUMN public.clientes.auth_user_id IS 'Referência para auth.users - integração com Supabase Auth';

-- ---------------------------------------------------------------------------
-- TABELA: bd_ativo
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bd_ativo (
    id BIGINT PRIMARY KEY DEFAULT nextval('bd_ativo_id_seq'),
    created_at TIMESTAMPTZ DEFAULT now(),
    number TEXT
);

-- ---------------------------------------------------------------------------
-- TABELA: chat_meu_agente
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_meu_agente (
    id INTEGER PRIMARY KEY DEFAULT nextval('chat_meu_agente_id_seq'),
    session_id VARCHAR,
    message JSONB
);

-- ---------------------------------------------------------------------------
-- TABELA: chat_agente_sdr
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_agente_sdr (
    id INTEGER PRIMARY KEY DEFAULT nextval('chat_agente_sdr_id_seq'),
    session_id VARCHAR,
    message JSONB
);

-- ---------------------------------------------------------------------------
-- TABELA: chat_remarketing
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_remarketing (
    id INTEGER PRIMARY KEY DEFAULT nextval('chat_remarketing_id_seq'),
    session_id VARCHAR,
    message JSONB
);

-- ---------------------------------------------------------------------------
-- TABELA: financeiro_registros
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.financeiro_registros (
    id BIGINT PRIMARY KEY DEFAULT nextval('financeiro_registros_id_seq'),
    phone VARCHAR(15) NOT NULL REFERENCES public.clientes(phone) ON DELETE CASCADE CHECK (phone ~ '^\d{10,15}$'),
    data_hora TIMESTAMPTZ DEFAULT now(),
    categoria VARCHAR NOT NULL,
    tipo public.financeiro_tipo NOT NULL,
    valor NUMERIC NOT NULL CHECK (valor >= 0),
    descricao TEXT,
    status TEXT DEFAULT 'pago',
    data_vencimento TIMESTAMPTZ,
    recorrente BOOLEAN DEFAULT false,
    recorrencia_fim DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- TABELA: metas
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.metas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) NOT NULL REFERENCES public.clientes(phone) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    icone TEXT,
    valor_atual NUMERIC DEFAULT 0,
    valor_meta NUMERIC NOT NULL,
    prazo_meses INTEGER,
    meta_principal BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- TABELA: notifications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL REFERENCES public.clientes(phone) ON DELETE CASCADE,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT false,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- TABELA: tasks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    priority public.task_priority DEFAULT 'medium',
    status public.task_status DEFAULT 'pending',
    category TEXT,
    completed_at TIMESTAMPTZ,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.tasks IS 'Armazena as tarefas dos usuários.';
COMMENT ON COLUMN public.tasks.phone IS 'Número de telefone do usuário, usado para vincular a tarefa ao usuário.';

-- ---------------------------------------------------------------------------
-- TABELA: calendars
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.calendars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) NOT NULL REFERENCES public.clientes(phone) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- TABELA: events
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE,
    phone VARCHAR(15) NOT NULL REFERENCES public.clientes(phone) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_ts TIMESTAMPTZ NOT NULL,
    end_ts TIMESTAMPTZ NOT NULL,
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
    rdates TIMESTAMPTZ[],
    exdates TIMESTAMPTZ[],
    series_master_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- TABELA: event_participants
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'optional',
    response TEXT DEFAULT 'pending',
    comment TEXT,
    invited_at TIMESTAMPTZ DEFAULT now(),
    responded_at TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- TABELA: event_reminders
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    method TEXT DEFAULT 'push',
    offset_minutes INTEGER DEFAULT 15,
    payload JSONB DEFAULT '{}'
);

-- ---------------------------------------------------------------------------
-- TABELA: resources
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) NOT NULL REFERENCES public.clientes(phone) ON DELETE CASCADE,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    capacity INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- TABELA: event_resources
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_resources (
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, resource_id)
);

-- ---------------------------------------------------------------------------
-- TABELA: scheduling_links
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.scheduling_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) NOT NULL REFERENCES public.clientes(phone) ON DELETE CASCADE,
    calendar_id UUID REFERENCES public.calendars(id) ON DELETE SET NULL,
    mode TEXT DEFAULT 'round_robin',
    booking_rules JSONB DEFAULT '{}',
    public_slug TEXT UNIQUE NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- TABELA: focus_blocks
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.focus_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) NOT NULL REFERENCES public.clientes(phone) ON DELETE CASCADE,
    title TEXT NOT NULL,
    goal_minutes INTEGER NOT NULL,
    recurrence_rrule TEXT,
    priority TEXT DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- TABELA: sync_state
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sync_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) NOT NULL REFERENCES public.clientes(phone) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    external_calendar_id TEXT NOT NULL,
    sync_token TEXT,
    last_synced_at TIMESTAMPTZ,
    status TEXT DEFAULT 'active',
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(phone, provider, external_calendar_id)
);

-- ---------------------------------------------------------------------------
-- TABELA: ingestion_log
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ingestion_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL,
    external_id TEXT NOT NULL,
    received_at TIMESTAMPTZ DEFAULT now(),
    raw JSONB NOT NULL,
    upserted_event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    phone VARCHAR(15) REFERENCES public.clientes(phone) ON DELETE CASCADE,
    UNIQUE(source, external_id)
);

-- ---------------------------------------------------------------------------
-- TABELA: privacy_settings (LGPD)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.privacy_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    data_collection BOOLEAN DEFAULT true,
    data_processing BOOLEAN DEFAULT true,
    data_sharing BOOLEAN DEFAULT false,
    marketing_emails BOOLEAN DEFAULT false,
    analytics_tracking BOOLEAN DEFAULT true,
    cookie_consent BOOLEAN DEFAULT true,
    data_retention INTEGER DEFAULT 365,
    consent_date TIMESTAMPTZ DEFAULT now(),
    last_updated TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE public.privacy_settings IS 'Configurações de privacidade dos usuários para conformidade LGPD';
COMMENT ON COLUMN public.privacy_settings.phone IS 'Telefone do usuário (chave única)';
COMMENT ON COLUMN public.privacy_settings.data_collection IS 'Consentimento para coleta de dados';
COMMENT ON COLUMN public.privacy_settings.data_processing IS 'Consentimento para processamento de dados';
COMMENT ON COLUMN public.privacy_settings.data_sharing IS 'Consentimento para compartilhamento de dados';
COMMENT ON COLUMN public.privacy_settings.marketing_emails IS 'Consentimento para e-mails de marketing';
COMMENT ON COLUMN public.privacy_settings.analytics_tracking IS 'Consentimento para rastreamento analítico';
COMMENT ON COLUMN public.privacy_settings.cookie_consent IS 'Consentimento para uso de cookies';
COMMENT ON COLUMN public.privacy_settings.data_retention IS 'Período de retenção de dados em dias';
COMMENT ON COLUMN public.privacy_settings.consent_date IS 'Data do consentimento inicial';
COMMENT ON COLUMN public.privacy_settings.last_updated IS 'Data da última atualização das configurações';

-- ---------------------------------------------------------------------------
-- TABELA: support_tickets
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_phone TEXT REFERENCES public.clientes(phone) ON DELETE CASCADE,
    ticket_number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('support', 'bug', 'suggestion')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    attachments JSONB DEFAULT '[]',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- TABELA: plan_access_logs
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.plan_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_phone TEXT NOT NULL REFERENCES public.clientes(phone) ON DELETE CASCADE,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    plan_id TEXT,
    access_granted BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 5. ÍNDICES
-- ============================================================================

-- Clientes
CREATE INDEX IF NOT EXISTS idx_clientes_phone ON public.clientes(phone);
CREATE INDEX IF NOT EXISTS idx_clientes_auth_user_id ON public.clientes(auth_user_id);

-- Financeiro
CREATE INDEX IF NOT EXISTS idx_financeiro_phone ON public.financeiro_registros(phone);
CREATE INDEX IF NOT EXISTS idx_financeiro_registros_phone ON public.financeiro_registros(phone);
CREATE INDEX IF NOT EXISTS financeiro_registros_phone_data_idx ON public.financeiro_registros(phone, data_hora DESC);
CREATE INDEX IF NOT EXISTS financeiro_registros_phone_categoria_idx ON public.financeiro_registros(phone, categoria);
CREATE INDEX IF NOT EXISTS financeiro_registros_phone_tipo_idx ON public.financeiro_registros(phone, tipo);

-- Metas
CREATE INDEX IF NOT EXISTS idx_metas_phone ON public.metas(phone);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_phone ON public.notifications(phone);

-- Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_phone ON public.tasks(phone);

-- Calendars
CREATE INDEX IF NOT EXISTS idx_calendars_phone ON public.calendars(phone);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_phone ON public.events(phone);
CREATE INDEX IF NOT EXISTS idx_events_calendar ON public.events(calendar_id);
CREATE INDEX IF NOT EXISTS idx_events_phone_start ON public.events(phone, start_ts);

-- Event participants
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON public.event_participants(event_id);

-- Event reminders
CREATE INDEX IF NOT EXISTS idx_event_reminders_event_id ON public.event_reminders(event_id);

-- Event resources
CREATE INDEX IF NOT EXISTS idx_event_resources_event_id ON public.event_resources(event_id);

-- Resources
CREATE INDEX IF NOT EXISTS idx_resources_phone ON public.resources(phone);

-- Privacy settings
CREATE INDEX IF NOT EXISTS idx_privacy_settings_phone ON public.privacy_settings(phone);

-- Support tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_phone ON public.support_tickets(user_phone);
CREATE INDEX IF NOT EXISTS idx_support_tickets_ticket_number ON public.support_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_type ON public.support_tickets(type);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at);

-- Ingestion log
CREATE INDEX IF NOT EXISTS idx_ingestion_log_source_external ON public.ingestion_log(source, external_id);

-- ============================================================================
-- 6. FUNÇÕES
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Função: handle_updated_at (genérica para triggers de updated_at)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Função: set_updated_at (alternativa)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Função: update_updated_at_column
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Função: update_privacy_settings_updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_privacy_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Função: phone_to_email (converte telefone para email sintético)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.phone_to_email(phone_number TEXT)
RETURNS TEXT AS $$
BEGIN
  IF phone_number !~ '^\d{10,15}$' THEN
    RAISE EXCEPTION 'Formato de telefone inválido: %', phone_number;
  END IF;
  RETURN phone_number || '@meuagente.api.br';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ---------------------------------------------------------------------------
-- Função: email_to_phone (converte email sintético para telefone)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.email_to_phone(email_address TEXT)
RETURNS TEXT AS $$
BEGIN
  IF email_address !~ '^\d{10,15}@meuagente\.api\.br$' THEN
    RAISE EXCEPTION 'Email sintético inválido: %', email_address;
  END IF;
  RETURN split_part(email_address, '@', 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ---------------------------------------------------------------------------
-- Função: get_authenticated_user_phone
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_authenticated_user_phone()
RETURNS TEXT AS $$
DECLARE
  user_phone TEXT;
BEGIN
  SELECT phone INTO user_phone
  FROM clientes
  WHERE auth_user_id = auth.uid();
  
  RETURN user_phone;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- Função: get_user_phone_optimized (versão otimizada e STABLE)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_phone_optimized()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT c.phone 
    FROM public.clientes c 
    WHERE c.auth_user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- Função: sync_auth_user_metadata (sincroniza metadados com auth.users)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_auth_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.auth_user_id IS NOT NULL AND (OLD.auth_user_id IS NULL OR OLD.auth_user_id != NEW.auth_user_id) THEN
    UPDATE auth.users 
    SET raw_user_meta_data = jsonb_build_object(
      'phone', NEW.phone,
      'name', NEW.name,
      'cpf', NEW.cpf,
      'plan_id', NEW.plan_id,
      'subscription_active', NEW.subscription_active
    )
    WHERE id = NEW.auth_user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- Função: link_client_to_auth_user
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.link_client_to_auth_user(client_phone TEXT, auth_user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  UPDATE public.clientes 
  SET auth_user_id = auth_user_uuid,
      updated_at = now()
  WHERE phone = client_phone
  AND is_active = true;
  
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  
  RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- Função: prepare_user_migration_data
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prepare_user_migration_data()
RETURNS TABLE(
  phone TEXT,
  synthetic_email TEXT,
  name TEXT,
  password_hash TEXT,
  user_metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.phone,
    public.phone_to_email(c.phone) as synthetic_email,
    c.name,
    c.password as password_hash,
    jsonb_build_object(
      'phone', c.phone,
      'name', c.name,
      'cpf', c.cpf,
      'plan_id', c.plan_id,
      'subscription_active', c.subscription_active
    ) as user_metadata
  FROM public.clientes c
  WHERE c.is_active = true 
  AND c.auth_user_id IS NULL
  AND c.password IS NOT NULL
  ORDER BY c.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- Função: generate_ticket_number
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  ticket_num TEXT;
  counter INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 4) AS INTEGER)), 0) + 1
  INTO counter
  FROM support_tickets
  WHERE ticket_number LIKE 'TK-%';
  
  ticket_num := 'TK-' || LPAD(counter::TEXT, 6, '0');
  
  RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Função: set_ticket_number (trigger function)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Função: get_user_ticket_limit
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_ticket_limit(user_phone_param TEXT)
RETURNS INTEGER AS $$
DECLARE
  user_plan TEXT;
  ticket_count INTEGER;
  limit_count INTEGER;
BEGIN
  SELECT plan_id INTO user_plan
  FROM clientes
  WHERE phone = user_phone_param;
  
  SELECT COUNT(*)
  INTO ticket_count
  FROM support_tickets
  WHERE user_phone = user_phone_param
  AND created_at >= date_trunc('month', NOW());
  
  CASE user_plan
    WHEN 'free' THEN limit_count := 3;
    WHEN 'basic' THEN limit_count := 10;
    WHEN 'business', 'premium' THEN limit_count := -1;
    ELSE limit_count := 3;
  END CASE;
  
  IF limit_count = -1 THEN
    RETURN -1;
  ELSE
    RETURN GREATEST(0, limit_count - ticket_count);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- Função: validate_categoria (validação de categorias financeiras)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.validate_categoria()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tipo = 'entrada' AND NEW.categoria NOT IN (
    'Salário', 'Freelance', 'Vendas', 'Investimento', 
    'Rendimentos', 'Presentes', 'Reembolso', 'Outros'
  ) THEN
    RAISE EXCEPTION 'Categoria de entrada inválida: %. Use: Salário, Freelance, Vendas, Investimento, Rendimentos, Presentes, Reembolso, Outros', NEW.categoria;
  END IF;
  
  IF NEW.tipo = 'saida' AND NEW.categoria NOT IN (
    'Transporte', 'Alimentação', 'Viagem', 'Saúde', 'Educação',
    'Lazer', 'Moradia', 'Vestuário', 'Tecnologia', 'Pets', 
    'Beleza', 'Investimento', 'Outros'
  ) THEN
    RAISE EXCEPTION 'Categoria de despesa inválida: %. Use: Transporte, Alimentação, Viagem, Saúde, Educação, Lazer, Moradia, Vestuário, Tecnologia, Pets, Beleza, Investimento, Outros', NEW.categoria;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- Função: export_user_data (LGPD - exportar dados do usuário)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.export_user_data()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    user_data JSONB;
    authenticated_phone TEXT;
BEGIN
    SELECT phone INTO authenticated_phone
    FROM public.clientes
    WHERE auth_user_id = auth.uid();
    
    IF authenticated_phone IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Usuário não autenticado ou não encontrado'
        );
    END IF;

    SELECT jsonb_build_object(
        'user_info', (SELECT to_jsonb(c.*) FROM public.clientes c WHERE c.phone = authenticated_phone),
        'financial_records', (SELECT COALESCE(jsonb_agg(to_jsonb(fr.*)), '[]'::jsonb) FROM public.financeiro_registros fr WHERE fr.phone = authenticated_phone),
        'goals', (SELECT COALESCE(jsonb_agg(to_jsonb(m.*)), '[]'::jsonb) FROM public.metas m WHERE m.phone = authenticated_phone),
        'tasks', (SELECT COALESCE(jsonb_agg(to_jsonb(t.*)), '[]'::jsonb) FROM public.tasks t WHERE t.phone = authenticated_phone),
        'notifications', (SELECT COALESCE(jsonb_agg(to_jsonb(n.*)), '[]'::jsonb) FROM public.notifications n WHERE n.phone = authenticated_phone),
        'events', (SELECT COALESCE(jsonb_agg(to_jsonb(e.*)), '[]'::jsonb) FROM public.events e WHERE e.phone = authenticated_phone),
        'calendars', (SELECT COALESCE(jsonb_agg(to_jsonb(cal.*)), '[]'::jsonb) FROM public.calendars cal WHERE cal.phone = authenticated_phone),
        'privacy_settings', (SELECT COALESCE(jsonb_agg(to_jsonb(ps.*)), '[]'::jsonb) FROM public.privacy_settings ps WHERE ps.phone = authenticated_phone),
        'export_timestamp', NOW()
    ) INTO user_data;

    RETURN jsonb_build_object(
        'success', true,
        'data', user_data,
        'export_timestamp', NOW(),
        'message', 'Dados exportados com sucesso'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- Função: delete_user_data (LGPD - deletar dados do usuário)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.delete_user_data()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    deleted_tables TEXT[] := '{}';
    authenticated_phone TEXT;
    table_name TEXT;
    tables_to_delete TEXT[] := ARRAY[
        'privacy_settings', 'financeiro_registros', 'metas', 'tasks',
        'notifications', 'events', 'calendars', 'focus_blocks',
        'sync_state', 'scheduling_links', 'resources',
        'event_participants', 'event_reminders', 'event_resources'
    ];
BEGIN
    SELECT phone INTO authenticated_phone
    FROM public.clientes
    WHERE auth_user_id = auth.uid();
    
    IF authenticated_phone IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Usuário não autenticado ou não encontrado'
        );
    END IF;

    FOREACH table_name IN ARRAY tables_to_delete
    LOOP
        BEGIN
            EXECUTE format('DELETE FROM public.%I WHERE phone = %L', table_name, authenticated_phone);
            IF FOUND THEN
                deleted_tables := array_append(deleted_tables, table_name);
            END IF;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE WARNING 'Erro ao deletar da tabela %: %', table_name, SQLERRM;
        END;
    END LOOP;

    DELETE FROM public.clientes WHERE phone = authenticated_phone;
    
    RETURN jsonb_build_object(
        'success', true,
        'deleted_tables', deleted_tables,
        'deletion_timestamp', NOW(),
        'message', 'Dados excluídos com sucesso'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------------
-- Funções de permissão por plano
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.user_has_support_access(user_phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM clientes 
    WHERE phone = user_phone 
    AND is_active = true
    AND auth_user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_has_export_permission(user_phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.clientes 
    WHERE phone = user_phone 
    AND is_active = true
    AND (
      subscription_active = true 
      OR plan_id IN ('basic', 'business', 'premium')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_has_whatsapp_access(user_phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.clientes 
    WHERE phone = user_phone 
    AND is_active = true
    AND subscription_active = true
    AND plan_id IN ('business', 'premium')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.user_has_advanced_features(user_phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.clientes 
    WHERE phone = user_phone 
    AND is_active = true
    AND subscription_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.log_plan_access_attempt(
  p_user_phone TEXT, 
  p_action TEXT, 
  p_resource TEXT, 
  p_access_granted BOOLEAN
)
RETURNS VOID AS $$
DECLARE
  user_plan TEXT;
BEGIN
  SELECT plan_id INTO user_plan 
  FROM public.clientes 
  WHERE phone = p_user_phone;
  
  INSERT INTO public.plan_access_logs (
    user_phone, 
    action, 
    resource, 
    plan_id, 
    access_granted
  ) VALUES (
    p_user_phone, 
    p_action, 
    p_resource, 
    COALESCE(user_plan, 'free'), 
    p_access_granted
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_permission_with_log(
  p_user_phone TEXT, 
  p_permission_type TEXT, 
  p_resource TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  has_permission BOOLEAN := false;
BEGIN
  CASE p_permission_type
    WHEN 'export' THEN
      has_permission := user_has_export_permission(p_user_phone);
    WHEN 'whatsapp' THEN
      has_permission := user_has_whatsapp_access(p_user_phone);
    WHEN 'support' THEN
      has_permission := user_has_support_access(p_user_phone);
    WHEN 'advanced' THEN
      has_permission := user_has_advanced_features(p_user_phone);
    ELSE
      has_permission := false;
  END CASE;
  
  PERFORM log_plan_access_attempt(p_user_phone, p_permission_type, p_resource, has_permission);
  
  RETURN has_permission;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. TRIGGERS
-- ============================================================================

-- Clientes
DROP TRIGGER IF EXISTS clientes_touch_updated_at ON public.clientes;
CREATE TRIGGER clientes_touch_updated_at
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trigger_sync_auth_user_metadata ON public.clientes;
CREATE TRIGGER trigger_sync_auth_user_metadata
    AFTER UPDATE ON public.clientes
    FOR EACH ROW EXECUTE FUNCTION sync_auth_user_metadata();

-- Financeiro
DROP TRIGGER IF EXISTS financeiro_registros_touch_updated_at ON public.financeiro_registros;
CREATE TRIGGER financeiro_registros_touch_updated_at
    BEFORE UPDATE ON public.financeiro_registros
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS check_categoria_valida ON public.financeiro_registros;
CREATE TRIGGER check_categoria_valida
    BEFORE INSERT OR UPDATE ON public.financeiro_registros
    FOR EACH ROW EXECUTE FUNCTION validate_categoria();

-- Metas
DROP TRIGGER IF EXISTS metas_touch_updated_at ON public.metas;
CREATE TRIGGER metas_touch_updated_at
    BEFORE UPDATE ON public.metas
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Tasks
DROP TRIGGER IF EXISTS on_tasks_update ON public.tasks;
CREATE TRIGGER on_tasks_update
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Calendars
DROP TRIGGER IF EXISTS calendars_touch_updated_at ON public.calendars;
CREATE TRIGGER calendars_touch_updated_at
    BEFORE UPDATE ON public.calendars
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Events
DROP TRIGGER IF EXISTS events_touch_updated_at ON public.events;
CREATE TRIGGER events_touch_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Resources
DROP TRIGGER IF EXISTS resources_touch_updated_at ON public.resources;
CREATE TRIGGER resources_touch_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Scheduling links
DROP TRIGGER IF EXISTS scheduling_links_touch_updated_at ON public.scheduling_links;
CREATE TRIGGER scheduling_links_touch_updated_at
    BEFORE UPDATE ON public.scheduling_links
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Focus blocks
DROP TRIGGER IF EXISTS focus_blocks_touch_updated_at ON public.focus_blocks;
CREATE TRIGGER focus_blocks_touch_updated_at
    BEFORE UPDATE ON public.focus_blocks
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Sync state
DROP TRIGGER IF EXISTS sync_state_touch_updated_at ON public.sync_state;
CREATE TRIGGER sync_state_touch_updated_at
    BEFORE UPDATE ON public.sync_state
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Privacy settings
DROP TRIGGER IF EXISTS update_privacy_settings_updated_at ON public.privacy_settings;
CREATE TRIGGER update_privacy_settings_updated_at
    BEFORE UPDATE ON public.privacy_settings
    FOR EACH ROW EXECUTE FUNCTION update_privacy_settings_updated_at();

-- Support tickets
DROP TRIGGER IF EXISTS trigger_set_ticket_number ON public.support_tickets;
CREATE TRIGGER trigger_set_ticket_number
    BEFORE INSERT ON public.support_tickets
    FOR EACH ROW EXECUTE FUNCTION set_ticket_number();

DROP TRIGGER IF EXISTS trigger_update_support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER trigger_update_support_tickets_updated_at
    BEFORE UPDATE ON public.support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) - HABILITAR
-- ============================================================================

ALTER TABLE public.bd_ativo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_meu_agente ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_agente_sdr ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_remarketing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financeiro_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduling_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingestion_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_access_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 9. RLS POLICIES - CLIENTES
-- ============================================================================

CREATE POLICY "Allow phone lookup for login"
ON public.clientes FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow signup for all users"
ON public.clientes FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Users can view their own profile via auth_user_id"
ON public.clientes FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update their own profile via auth_user_id"
ON public.clientes FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- ============================================================================
-- 10. RLS POLICIES - FINANCEIRO
-- ============================================================================

CREATE POLICY "auth_financeiro_select"
ON public.financeiro_registros FOR SELECT
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_financeiro_insert"
ON public.financeiro_registros FOR INSERT
TO authenticated
WITH CHECK ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_financeiro_update"
ON public.financeiro_registros FOR UPDATE
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()))
WITH CHECK ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_financeiro_delete"
ON public.financeiro_registros FOR DELETE
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()));

-- ============================================================================
-- 11. RLS POLICIES - METAS
-- ============================================================================

CREATE POLICY "auth_metas_select"
ON public.metas FOR SELECT
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_metas_insert"
ON public.metas FOR INSERT
TO authenticated
WITH CHECK ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_metas_update"
ON public.metas FOR UPDATE
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()))
WITH CHECK ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_metas_delete"
ON public.metas FOR DELETE
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()));

-- ============================================================================
-- 12. RLS POLICIES - NOTIFICATIONS
-- ============================================================================

CREATE POLICY "auth_notifications_select"
ON public.notifications FOR SELECT
TO authenticated
USING (phone = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_notifications_insert"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (phone = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_notifications_update"
ON public.notifications FOR UPDATE
TO authenticated
USING (phone = (SELECT get_user_phone_optimized()))
WITH CHECK (phone = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_notifications_delete"
ON public.notifications FOR DELETE
TO authenticated
USING (phone = (SELECT get_user_phone_optimized()));

-- ============================================================================
-- 13. RLS POLICIES - TASKS
-- ============================================================================

CREATE POLICY "auth_tasks_select"
ON public.tasks FOR SELECT
TO authenticated
USING (phone = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_tasks_insert"
ON public.tasks FOR INSERT
TO authenticated
WITH CHECK (phone = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_tasks_update"
ON public.tasks FOR UPDATE
TO authenticated
USING (phone = (SELECT get_user_phone_optimized()))
WITH CHECK (phone = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_tasks_delete"
ON public.tasks FOR DELETE
TO authenticated
USING (phone = (SELECT get_user_phone_optimized()));

-- ============================================================================
-- 14. RLS POLICIES - CALENDARS
-- ============================================================================

CREATE POLICY "auth_calendars_select"
ON public.calendars FOR SELECT
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_calendars_insert"
ON public.calendars FOR INSERT
TO authenticated
WITH CHECK ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_calendars_update"
ON public.calendars FOR UPDATE
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()))
WITH CHECK ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_calendars_delete"
ON public.calendars FOR DELETE
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()));

-- ============================================================================
-- 15. RLS POLICIES - EVENTS
-- ============================================================================

CREATE POLICY "auth_events_select"
ON public.events FOR SELECT
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_events_insert"
ON public.events FOR INSERT
TO authenticated
WITH CHECK ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_events_update"
ON public.events FOR UPDATE
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()))
WITH CHECK ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_events_delete"
ON public.events FOR DELETE
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()));

-- ============================================================================
-- 16. RLS POLICIES - EVENT_PARTICIPANTS
-- ============================================================================

CREATE POLICY "auth_event_participants_select_v2"
ON public.event_participants FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_participants.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
));

CREATE POLICY "auth_event_participants_insert_v2"
ON public.event_participants FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_participants.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
));

CREATE POLICY "auth_event_participants_update_v2"
ON public.event_participants FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_participants.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_participants.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
));

CREATE POLICY "auth_event_participants_delete_v2"
ON public.event_participants FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_participants.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
));

-- ============================================================================
-- 17. RLS POLICIES - EVENT_REMINDERS
-- ============================================================================

CREATE POLICY "auth_event_reminders_select_v2"
ON public.event_reminders FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_reminders.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
));

CREATE POLICY "auth_event_reminders_insert_v2"
ON public.event_reminders FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_reminders.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
));

CREATE POLICY "auth_event_reminders_update_v2"
ON public.event_reminders FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_reminders.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_reminders.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
));

CREATE POLICY "auth_event_reminders_delete_v2"
ON public.event_reminders FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_reminders.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
));

-- ============================================================================
-- 18. RLS POLICIES - RESOURCES
-- ============================================================================

CREATE POLICY "auth_resources_select"
ON public.resources FOR SELECT
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_resources_insert"
ON public.resources FOR INSERT
TO authenticated
WITH CHECK ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_resources_update"
ON public.resources FOR UPDATE
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()))
WITH CHECK ((phone)::text = (SELECT get_user_phone_optimized()));

CREATE POLICY "auth_resources_delete"
ON public.resources FOR DELETE
TO authenticated
USING ((phone)::text = (SELECT get_user_phone_optimized()));

-- ============================================================================
-- 19. RLS POLICIES - EVENT_RESOURCES
-- ============================================================================

CREATE POLICY "auth_event_resources_select_v2"
ON public.event_resources FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_resources.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
));

CREATE POLICY "auth_event_resources_insert_v2"
ON public.event_resources FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_resources.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
));

CREATE POLICY "auth_event_resources_update_v2"
ON public.event_resources FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_resources.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_resources.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
));

CREATE POLICY "auth_event_resources_delete_v2"
ON public.event_resources FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM events
  WHERE events.id = event_resources.event_id 
  AND (events.phone)::text = get_authenticated_user_phone()
));

-- ============================================================================
-- 20. RLS POLICIES - PRIVACY_SETTINGS
-- ============================================================================

CREATE POLICY "Users can view their own privacy settings"
ON public.privacy_settings FOR SELECT
TO authenticated
USING (phone = ((current_setting('request.jwt.claims', true))::json->>'phone'));

CREATE POLICY "Users can insert their own privacy settings"
ON public.privacy_settings FOR INSERT
TO authenticated
WITH CHECK (phone = ((current_setting('request.jwt.claims', true))::json->>'phone'));

CREATE POLICY "Users can update their own privacy settings"
ON public.privacy_settings FOR UPDATE
TO authenticated
USING (phone = ((current_setting('request.jwt.claims', true))::json->>'phone'))
WITH CHECK (phone = ((current_setting('request.jwt.claims', true))::json->>'phone'));

CREATE POLICY "Users can delete their own privacy settings"
ON public.privacy_settings FOR DELETE
TO authenticated
USING (phone = ((current_setting('request.jwt.claims', true))::json->>'phone'));

-- Policies v2 usando helper function
CREATE POLICY "auth_privacy_settings_select_v2"
ON public.privacy_settings FOR SELECT
TO authenticated
USING (phone = get_authenticated_user_phone());

CREATE POLICY "auth_privacy_settings_insert_v2"
ON public.privacy_settings FOR INSERT
TO authenticated
WITH CHECK (phone = get_authenticated_user_phone());

CREATE POLICY "auth_privacy_settings_update_v2"
ON public.privacy_settings FOR UPDATE
TO authenticated
USING (phone = get_authenticated_user_phone())
WITH CHECK (phone = get_authenticated_user_phone());

CREATE POLICY "auth_privacy_settings_delete_v2"
ON public.privacy_settings FOR DELETE
TO authenticated
USING (phone = get_authenticated_user_phone());

-- ============================================================================
-- 21. RLS POLICIES - SUPPORT_TICKETS
-- ============================================================================

CREATE POLICY "Authenticated users can create support tickets"
ON public.support_tickets FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid() IS NOT NULL) 
  AND (user_phone = get_authenticated_user_phone()) 
  AND user_has_support_access(get_authenticated_user_phone())
);

CREATE POLICY "Users can view their own support tickets"
ON public.support_tickets FOR SELECT
TO authenticated
USING (
  (auth.uid() IS NOT NULL) 
  AND (user_phone = get_authenticated_user_phone())
);

CREATE POLICY "Users can update their own open tickets"
ON public.support_tickets FOR UPDATE
TO authenticated
USING (
  (auth.uid() IS NOT NULL) 
  AND (user_phone = get_authenticated_user_phone()) 
  AND (status = ANY (ARRAY['open', 'in_progress']))
)
WITH CHECK (
  (auth.uid() IS NOT NULL) 
  AND (user_phone = get_authenticated_user_phone()) 
  AND (status = ANY (ARRAY['open', 'in_progress']))
);

CREATE POLICY "Users can delete their own open tickets"
ON public.support_tickets FOR DELETE
TO authenticated
USING (
  (auth.uid() IS NOT NULL) 
  AND (user_phone = get_authenticated_user_phone()) 
  AND (status = ANY (ARRAY['open', 'in_progress']))
);

-- ============================================================================
-- 22. RLS POLICIES - PLAN_ACCESS_LOGS
-- ============================================================================

CREATE POLICY "Users can view their own plan access logs"
ON public.plan_access_logs FOR SELECT
TO authenticated
USING (user_phone = ((current_setting('request.jwt.claims', true))::json->>'phone'));

CREATE POLICY "Only system can insert plan access logs"
ON public.plan_access_logs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "auth_plan_access_logs_select_v2"
ON public.plan_access_logs FOR SELECT
TO authenticated
USING (user_phone = get_authenticated_user_phone());

-- ============================================================================
-- 23. STORAGE - BUCKETS E POLICIES (Avatars)
-- ============================================================================

-- Criar bucket de avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policies para storage.objects (avatars)
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] IN (SELECT phone FROM public.clientes)
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] IN (SELECT phone FROM public.clientes)
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] IN (SELECT phone FROM public.clientes)
);

-- ============================================================================
-- 24. GRANTS (Permissões)
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ============================================================================
-- FIM DA MIGRAÇÃO
-- ============================================================================

-- Verificar tabelas criadas
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verificar políticas RLS criadas
SELECT 
    schemaname, 
    tablename, 
    COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

