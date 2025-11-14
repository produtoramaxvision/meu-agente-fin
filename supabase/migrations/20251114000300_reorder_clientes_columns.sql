-- Reorganizar colunas da tabela clientes na ordem especificada
-- Data: 2025-11-14
-- Ordem desejada: phone, auth_user_id, name, email, cpf, subscription_active, is_active, plan_id, billing_provider, external_subscription_id, trial_ends_at, last_seen_at, avatar_url, created_at, updated_at

BEGIN;

-- ========================================
-- PARTE 1: Criar nova tabela com ordem desejada
-- ========================================

CREATE TABLE public.clientes_new (
  phone VARCHAR NOT NULL,
  auth_user_id UUID,
  name VARCHAR NOT NULL,
  email VARCHAR,
  cpf VARCHAR,
  subscription_active BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  plan_id TEXT,
  billing_provider TEXT,
  external_subscription_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- PARTE 2: Copiar dados da tabela antiga para a nova
-- ========================================

INSERT INTO public.clientes_new (
  phone, auth_user_id, name, email, cpf, subscription_active, is_active, 
  plan_id, billing_provider, external_subscription_id, trial_ends_at, 
  last_seen_at, avatar_url, created_at, updated_at
)
SELECT 
  phone, auth_user_id, name, email, cpf, subscription_active, is_active, 
  plan_id, billing_provider, external_subscription_id, trial_ends_at, 
  last_seen_at, avatar_url, created_at, updated_at
FROM public.clientes;

-- ========================================
-- PARTE 3: Dropar triggers da tabela antiga
-- ========================================

DROP TRIGGER IF EXISTS clientes_touch_updated_at ON public.clientes;
DROP TRIGGER IF EXISTS trigger_sync_auth_user_metadata ON public.clientes;

-- ========================================
-- PARTE 4: Dropar constraints da tabela antiga (exceto PK que será recriada)
-- ========================================

ALTER TABLE public.clientes DROP CONSTRAINT IF EXISTS clientes_auth_user_id_fkey;
ALTER TABLE public.clientes DROP CONSTRAINT IF EXISTS clientes_email_key;

-- ========================================
-- PARTE 5: Dropar FKs que referenciam clientes (serão recriadas depois)
-- ========================================

ALTER TABLE public.financeiro_registros DROP CONSTRAINT IF EXISTS financeiro_registros_phone_fkey;
ALTER TABLE public.metas DROP CONSTRAINT IF EXISTS metas_phone_fkey;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_phone_fkey;
ALTER TABLE public.calendars DROP CONSTRAINT IF EXISTS calendars_phone_fkey;
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_phone_fkey;
ALTER TABLE public.resources DROP CONSTRAINT IF EXISTS resources_phone_fkey;
ALTER TABLE public.scheduling_links DROP CONSTRAINT IF EXISTS scheduling_links_phone_fkey;
ALTER TABLE public.focus_blocks DROP CONSTRAINT IF EXISTS focus_blocks_phone_fkey;
ALTER TABLE public.sync_state DROP CONSTRAINT IF EXISTS sync_state_phone_fkey;
ALTER TABLE public.ingestion_log DROP CONSTRAINT IF EXISTS ingestion_log_phone_fkey;
ALTER TABLE public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_user_phone_fkey;
ALTER TABLE public.plan_access_logs DROP CONSTRAINT IF EXISTS plan_access_logs_user_phone_fkey;
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_phone_fkey;

-- ========================================
-- PARTE 6: Dropar tabela antiga e renomear nova
-- ========================================

DROP TABLE public.clientes CASCADE;

ALTER TABLE public.clientes_new RENAME TO clientes;

-- ========================================
-- PARTE 7: Recriar constraints na nova tabela
-- ========================================

-- Primary Key
ALTER TABLE public.clientes ADD CONSTRAINT clientes_pkey PRIMARY KEY (phone);

-- Unique constraint em email
ALTER TABLE public.clientes ADD CONSTRAINT clientes_email_key UNIQUE (email);

-- Foreign Key para auth.users
ALTER TABLE public.clientes 
  ADD CONSTRAINT clientes_auth_user_id_fkey 
  FOREIGN KEY (auth_user_id) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;

-- ========================================
-- PARTE 8: Recriar FKs que referenciam clientes
-- ========================================

ALTER TABLE public.financeiro_registros 
  ADD CONSTRAINT financeiro_registros_phone_fkey 
  FOREIGN KEY (phone) REFERENCES public.clientes(phone) ON DELETE CASCADE;

ALTER TABLE public.metas 
  ADD CONSTRAINT metas_phone_fkey 
  FOREIGN KEY (phone) REFERENCES public.clientes(phone) ON DELETE CASCADE;

ALTER TABLE public.notifications 
  ADD CONSTRAINT notifications_phone_fkey 
  FOREIGN KEY (phone) REFERENCES public.clientes(phone) ON DELETE CASCADE;

ALTER TABLE public.calendars 
  ADD CONSTRAINT calendars_phone_fkey 
  FOREIGN KEY (phone) REFERENCES public.clientes(phone) ON DELETE CASCADE;

ALTER TABLE public.events 
  ADD CONSTRAINT events_phone_fkey 
  FOREIGN KEY (phone) REFERENCES public.clientes(phone) ON DELETE CASCADE;

ALTER TABLE public.resources 
  ADD CONSTRAINT resources_phone_fkey 
  FOREIGN KEY (phone) REFERENCES public.clientes(phone) ON DELETE CASCADE;

ALTER TABLE public.scheduling_links 
  ADD CONSTRAINT scheduling_links_phone_fkey 
  FOREIGN KEY (phone) REFERENCES public.clientes(phone) ON DELETE CASCADE;

ALTER TABLE public.focus_blocks 
  ADD CONSTRAINT focus_blocks_phone_fkey 
  FOREIGN KEY (phone) REFERENCES public.clientes(phone) ON DELETE CASCADE;

ALTER TABLE public.sync_state 
  ADD CONSTRAINT sync_state_phone_fkey 
  FOREIGN KEY (phone) REFERENCES public.clientes(phone) ON DELETE CASCADE;

ALTER TABLE public.ingestion_log 
  ADD CONSTRAINT ingestion_log_phone_fkey 
  FOREIGN KEY (phone) REFERENCES public.clientes(phone) ON DELETE CASCADE;

ALTER TABLE public.support_tickets 
  ADD CONSTRAINT support_tickets_user_phone_fkey 
  FOREIGN KEY (user_phone) REFERENCES public.clientes(phone) ON DELETE CASCADE;

ALTER TABLE public.plan_access_logs 
  ADD CONSTRAINT plan_access_logs_user_phone_fkey 
  FOREIGN KEY (user_phone) REFERENCES public.clientes(phone) ON DELETE CASCADE;

ALTER TABLE public.tasks 
  ADD CONSTRAINT tasks_phone_fkey 
  FOREIGN KEY (phone) REFERENCES public.clientes(phone) ON DELETE CASCADE;

-- ========================================
-- PARTE 9: Recriar índices
-- ========================================

CREATE INDEX IF NOT EXISTS idx_clientes_phone ON public.clientes(phone);
CREATE INDEX IF NOT EXISTS idx_clientes_auth_user_id ON public.clientes(auth_user_id);

-- ========================================
-- PARTE 10: Recriar triggers
-- ========================================

CREATE TRIGGER clientes_touch_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trigger_sync_auth_user_metadata
  AFTER UPDATE ON public.clientes
  FOR EACH ROW
  WHEN (OLD.auth_user_id IS DISTINCT FROM NEW.auth_user_id OR OLD.name IS DISTINCT FROM NEW.name)
  EXECUTE FUNCTION sync_auth_user_metadata();

-- ========================================
-- PARTE 11: Recriar RLS Policies
-- ========================================

CREATE POLICY "Allow phone lookup for login"
  ON public.clientes
  FOR SELECT
  USING (true);

CREATE POLICY "Allow signup for all users"
  ON public.clientes
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own profile via auth_user_id"
  ON public.clientes
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update their own profile via auth_user_id"
  ON public.clientes
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

COMMIT;

