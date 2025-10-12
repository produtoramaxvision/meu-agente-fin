-- FASE 4: Atualização Completa das Políticas RLS
-- Migrar todas as políticas para usar auth.uid() via mapeamento com clientes
-- Data: 2025-01-16
-- Status: FASE 4 - POLÍTICAS RLS BASEADAS EM AUTH.UID()

-- Função helper otimizada para obter phone do usuário autenticado
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Criar índices para performance das políticas RLS
CREATE INDEX IF NOT EXISTS idx_financeiro_registros_phone ON public.financeiro_registros(phone);
CREATE INDEX IF NOT EXISTS idx_metas_phone ON public.metas(phone);
CREATE INDEX IF NOT EXISTS idx_tasks_phone ON public.tasks(phone);
CREATE INDEX IF NOT EXISTS idx_events_phone ON public.events(phone);
CREATE INDEX IF NOT EXISTS idx_calendars_phone ON public.calendars(phone);
CREATE INDEX IF NOT EXISTS idx_resources_phone ON public.resources(phone);
CREATE INDEX IF NOT EXISTS idx_notifications_phone ON public.notifications(phone);

-- ========================================
-- FINANCEIRO_REGISTROS - Habilitar RLS e criar políticas
-- ========================================

-- Habilitar RLS
ALTER TABLE public.financeiro_registros ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas
DROP POLICY IF EXISTS "optimized_financeiro_select" ON public.financeiro_registros;
DROP POLICY IF EXISTS "optimized_financeiro_insert" ON public.financeiro_registros;
DROP POLICY IF EXISTS "optimized_financeiro_update" ON public.financeiro_registros;
DROP POLICY IF EXISTS "optimized_financeiro_delete" ON public.financeiro_registros;

-- Criar políticas baseadas em auth.uid()
CREATE POLICY "auth_financeiro_select"
ON public.financeiro_registros
FOR SELECT
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_financeiro_insert"
ON public.financeiro_registros
FOR INSERT
TO authenticated
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_financeiro_update"
ON public.financeiro_registros
FOR UPDATE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()))
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_financeiro_delete"
ON public.financeiro_registros
FOR DELETE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

-- ========================================
-- METAS - Atualizar políticas
-- ========================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "optimized_metas_select" ON public.metas;
DROP POLICY IF EXISTS "optimized_metas_insert" ON public.metas;
DROP POLICY IF EXISTS "optimized_metas_update" ON public.metas;
DROP POLICY IF EXISTS "optimized_metas_delete" ON public.metas;

-- Criar políticas baseadas em auth.uid()
CREATE POLICY "auth_metas_select"
ON public.metas
FOR SELECT
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_metas_insert"
ON public.metas
FOR INSERT
TO authenticated
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_metas_update"
ON public.metas
FOR UPDATE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()))
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_metas_delete"
ON public.metas
FOR DELETE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

-- ========================================
-- TASKS - Habilitar RLS e criar políticas
-- ========================================

-- Habilitar RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas
DROP POLICY IF EXISTS "optimized_tasks_select" ON public.tasks;
DROP POLICY IF EXISTS "optimized_tasks_insert" ON public.tasks;
DROP POLICY IF EXISTS "optimized_tasks_update" ON public.tasks;
DROP POLICY IF EXISTS "optimized_tasks_delete" ON public.tasks;

-- Criar políticas baseadas em auth.uid()
CREATE POLICY "auth_tasks_select"
ON public.tasks
FOR SELECT
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_tasks_insert"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_tasks_update"
ON public.tasks
FOR UPDATE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()))
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_tasks_delete"
ON public.tasks
FOR DELETE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

-- ========================================
-- EVENTS - Atualizar políticas
-- ========================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "optimized_events_select" ON public.events;
DROP POLICY IF EXISTS "optimized_events_insert" ON public.events;
DROP POLICY IF EXISTS "optimized_events_update" ON public.events;
DROP POLICY IF EXISTS "optimized_events_delete" ON public.events;

-- Criar políticas baseadas em auth.uid()
CREATE POLICY "auth_events_select"
ON public.events
FOR SELECT
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_events_insert"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_events_update"
ON public.events
FOR UPDATE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()))
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_events_delete"
ON public.events
FOR DELETE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

-- ========================================
-- CALENDARS - Atualizar políticas
-- ========================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "optimized_calendars_select" ON public.calendars;
DROP POLICY IF EXISTS "optimized_calendars_insert" ON public.calendars;
DROP POLICY IF EXISTS "optimized_calendars_update" ON public.calendars;
DROP POLICY IF EXISTS "optimized_calendars_delete" ON public.calendars;

-- Criar políticas baseadas em auth.uid()
CREATE POLICY "auth_calendars_select"
ON public.calendars
FOR SELECT
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_calendars_insert"
ON public.calendars
FOR INSERT
TO authenticated
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_calendars_update"
ON public.calendars
FOR UPDATE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()))
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_calendars_delete"
ON public.calendars
FOR DELETE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

-- ========================================
-- RESOURCES - Limpar políticas conflitantes e criar novas
-- ========================================

-- Remover todas as políticas antigas (há muitas conflitantes)
DROP POLICY IF EXISTS "Users can view own resources" ON public.resources;
DROP POLICY IF EXISTS "Users can insert own resources" ON public.resources;
DROP POLICY IF EXISTS "Users can update own resources" ON public.resources;
DROP POLICY IF EXISTS "Users can delete own resources" ON public.resources;
DROP POLICY IF EXISTS "optimized_resources_select" ON public.resources;
DROP POLICY IF EXISTS "optimized_resources_insert" ON public.resources;
DROP POLICY IF EXISTS "optimized_resources_update" ON public.resources;
DROP POLICY IF EXISTS "optimized_resources_delete" ON public.resources;
DROP POLICY IF EXISTS "resources_select_policy" ON public.resources;
DROP POLICY IF EXISTS "resources_insert_policy" ON public.resources;
DROP POLICY IF EXISTS "resources_update_policy" ON public.resources;
DROP POLICY IF EXISTS "resources_delete_policy" ON public.resources;

-- Criar políticas baseadas em auth.uid()
CREATE POLICY "auth_resources_select"
ON public.resources
FOR SELECT
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_resources_insert"
ON public.resources
FOR INSERT
TO authenticated
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_resources_update"
ON public.resources
FOR UPDATE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()))
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_resources_delete"
ON public.resources
FOR DELETE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

-- ========================================
-- NOTIFICATIONS - Atualizar políticas
-- ========================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

-- Criar políticas baseadas em auth.uid()
CREATE POLICY "auth_notifications_select"
ON public.notifications
FOR SELECT
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_notifications_insert"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_notifications_update"
ON public.notifications
FOR UPDATE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()))
WITH CHECK (phone = (SELECT public.get_user_phone_optimized()));

CREATE POLICY "auth_notifications_delete"
ON public.notifications
FOR DELETE
TO authenticated
USING (phone = (SELECT public.get_user_phone_optimized()));

-- ========================================
-- Comentários para documentação
-- ========================================

COMMENT ON FUNCTION public.get_user_phone_optimized() IS 'Função otimizada para obter telefone do usuário autenticado via auth.uid() - STABLE para performance';

-- Verificar políticas criadas
SELECT 
  'Políticas RLS Atualizadas' as status,
  COUNT(*) as total_policies
FROM pg_policies 
WHERE schemaname = 'public' 
AND policyname LIKE 'auth_%';