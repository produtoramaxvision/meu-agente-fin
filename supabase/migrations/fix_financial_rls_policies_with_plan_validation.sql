-- Arquivo: supabase/migrations/fix_financial_rls_policies_with_plan_validation.sql
-- CORREÇÃO CRÍTICA: Políticas RLS para gestão financeira com controle de planos
-- Problema: Políticas muito permissivas permitem acesso sem validação de plano
-- Data: 2025-01-09
-- Status: CRÍTICO - Fase 1

-- Remover políticas permissivas atuais
DROP POLICY IF EXISTS "Permitir visualização de registros financeiros" ON public.financeiro_registros;
DROP POLICY IF EXISTS "Permitir inserção de registros financeiros" ON public.financeiro_registros;
DROP POLICY IF EXISTS "Permitir atualização de registros financeiros" ON public.financeiro_registros;
DROP POLICY IF EXISTS "Permitir exclusão de registros financeiros" ON public.financeiro_registros;

-- CORREÇÃO CRÍTICA: Criar políticas baseadas em plano de assinatura
-- Política para SELECT - Todos os usuários podem ver seus registros
CREATE POLICY "Visualizar registros financeiros por usuário"
ON public.financeiro_registros
FOR SELECT
TO public
USING (
  phone = current_setting('request.jwt.claims', true)::json->>'phone'
  AND EXISTS (
    SELECT 1 FROM public.clientes 
    WHERE phone = financeiro_registros.phone 
    AND is_active = true
  )
);

-- Política para INSERT - Apenas usuários com planos pagos podem criar registros
CREATE POLICY "Inserir registros financeiros por plano"
ON public.financeiro_registros
FOR INSERT
TO public
WITH CHECK (
  phone = current_setting('request.jwt.claims', true)::json->>'phone'
  AND EXISTS (
    SELECT 1 FROM public.clientes 
    WHERE phone = financeiro_registros.phone 
    AND is_active = true
    AND subscription_active IN ('business', 'premium', 'basic')
  )
);

-- Política para UPDATE - Usuários podem atualizar seus próprios registros
CREATE POLICY "Atualizar registros financeiros por usuário"
ON public.financeiro_registros
FOR UPDATE
TO public
USING (
  phone = current_setting('request.jwt.claims', true)::json->>'phone'
  AND EXISTS (
    SELECT 1 FROM public.clientes 
    WHERE phone = financeiro_registros.phone 
    AND is_active = true
  )
)
WITH CHECK (
  phone = current_setting('request.jwt.claims', true)::json->>'phone'
);

-- Política para DELETE - Usuários podem deletar seus próprios registros
CREATE POLICY "Deletar registros financeiros por usuário"
ON public.financeiro_registros
FOR DELETE
TO public
USING (
  phone = current_setting('request.jwt.claims', true)::json->>'phone'
  AND EXISTS (
    SELECT 1 FROM public.clientes 
    WHERE phone = financeiro_registros.phone 
    AND is_active = true
  )
);

-- CORREÇÃO CRÍTICA: Criar usuários de teste para validação
-- Usuário Business para testes
INSERT INTO public.clientes (
  phone, name, email, cpf, subscription_active, is_active, password
) VALUES (
  '5511999999999',
  'Usuário Business Teste',
  'business@teste.com',
  '12345678901',
  'business',
  true,
  '$2a$10$rQZ8K9vX8Y7W6E5D4C3B2A1Z0Y9X8W7V6U5T4S3R2Q1P0O9N8M7L6K5J4I3H2G1F0'
) ON CONFLICT (phone) DO UPDATE SET
  subscription_active = 'business',
  is_active = true;

-- Usuário Premium para testes
INSERT INTO public.clientes (
  phone, name, email, cpf, subscription_active, is_active, password
) VALUES (
  '5511888888888',
  'Usuário Premium Teste',
  'premium@teste.com',
  '12345678902',
  'premium',
  true,
  '$2a$10$rQZ8K9vX8Y7W6E5D4C3B2A1Z0Y9X8W7V6U5T4S3R2Q1P0O9N8M7L6K5J4I3H2G1F0'
) ON CONFLICT (phone) DO UPDATE SET
  subscription_active = 'premium',
  is_active = true;

-- Usuário Básico para testes
INSERT INTO public.clientes (
  phone, name, email, cpf, subscription_active, is_active, password
) VALUES (
  '5511777777777',
  'Usuário Básico Teste',
  'basic@teste.com',
  '12345678903',
  'basic',
  true,
  '$2a$10$rQZ8K9vX8Y7W6E5D4C3B2A1Z0Y9X8W7V6U5T4S3R2Q1P0O9N8M7L6K5J4I3H2G1F0'
) ON CONFLICT (phone) DO UPDATE SET
  subscription_active = 'basic',
  is_active = true;

-- CORREÇÃO CRÍTICA: Adicionar coluna plan_id se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'clientes' AND column_name = 'plan_id') THEN
        ALTER TABLE public.clientes ADD COLUMN plan_id TEXT;
    END IF;
END $$;

-- Atualizar plan_id baseado no subscription_active
UPDATE public.clientes SET plan_id = 'free' WHERE subscription_active = 'basic';
UPDATE public.clientes SET plan_id = 'business' WHERE subscription_active = 'business';
UPDATE public.clientes SET plan_id = 'premium' WHERE subscription_active = 'premium';
