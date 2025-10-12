-- FASE 1: Integração com Supabase Auth
-- Adicionar campo auth_user_id na tabela clientes e criar funções de conversão
-- Data: 2025-01-16
-- Status: FASE 1 - PREPARAÇÃO DA INTEGRAÇÃO

-- 1. Adicionar campo auth_user_id na tabela clientes
ALTER TABLE public.clientes 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_clientes_auth_user_id ON public.clientes(auth_user_id);

-- 3. Função para converter phone para email sintético
CREATE OR REPLACE FUNCTION public.phone_to_email(phone_number TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Validar formato do telefone
  IF phone_number !~ '^\d{10,15}$' THEN
    RAISE EXCEPTION 'Formato de telefone inválido: %', phone_number;
  END IF;
  
  RETURN phone_number || '@meuagente.api.br';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Função para converter email sintético para phone
CREATE OR REPLACE FUNCTION public.email_to_phone(email_address TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Verificar se é um email sintético válido
  IF email_address !~ '^\d{10,15}@meuagente\.api\.br$' THEN
    RAISE EXCEPTION 'Email sintético inválido: %', email_address;
  END IF;
  
  RETURN split_part(email_address, '@', 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 5. Função helper para obter phone do usuário autenticado
CREATE OR REPLACE FUNCTION public.get_authenticated_user_phone()
RETURNS TEXT AS $$
DECLARE
  user_phone TEXT;
BEGIN
  -- Tentar obter phone via auth_user_id
  SELECT c.phone INTO user_phone
  FROM public.clientes c
  WHERE c.auth_user_id = auth.uid();
  
  RETURN user_phone;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger para sincronização automática quando auth_user_id é atualizado
CREATE OR REPLACE FUNCTION public.sync_auth_user_metadata()
RETURNS TRIGGER AS $$
BEGIN
  -- Se auth_user_id foi definido, atualizar metadados do usuário Supabase
  IF NEW.auth_user_id IS NOT NULL AND (OLD.auth_user_id IS NULL OR OLD.auth_user_id != NEW.auth_user_id) THEN
    -- Atualizar raw_user_meta_data com informações do cliente
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

-- 7. Criar trigger
DROP TRIGGER IF EXISTS trigger_sync_auth_user_metadata ON public.clientes;
CREATE TRIGGER trigger_sync_auth_user_metadata
  AFTER UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_auth_user_metadata();

-- 8. Comentários para documentação
COMMENT ON COLUMN public.clientes.auth_user_id IS 'Referência para auth.users - integração com Supabase Auth';
COMMENT ON FUNCTION public.phone_to_email(TEXT) IS 'Converte telefone para email sintético (@meuagente.api.br)';
COMMENT ON FUNCTION public.email_to_phone(TEXT) IS 'Converte email sintético para telefone';
COMMENT ON FUNCTION public.get_authenticated_user_phone() IS 'Retorna telefone do usuário autenticado via auth.uid()';
COMMENT ON FUNCTION public.sync_auth_user_metadata() IS 'Sincroniza metadados entre clientes e auth.users';