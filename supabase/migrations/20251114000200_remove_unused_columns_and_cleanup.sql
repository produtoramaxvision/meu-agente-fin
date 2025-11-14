-- Remover colunas inativas e limpar funções SQL
-- Data: 2025-11-14
-- Objetivo: Remover password e whatsapp_instance_url de clientes, atualizar funções SQL

-- ========================================
-- PARTE 1: Remover e recriar funções SQL que referenciam password
-- ========================================

-- 1. Remover função antiga prepare_user_migration_data
DROP FUNCTION IF EXISTS public.prepare_user_migration_data();

-- 2. Recriar prepare_user_migration_data sem password
CREATE OR REPLACE FUNCTION public.prepare_user_migration_data()
RETURNS TABLE(
  phone TEXT,
  synthetic_email TEXT,
  name TEXT,
  user_metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.phone,
    public.phone_to_email(c.phone) as synthetic_email,
    c.name,
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
  ORDER BY c.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Atualizar handle_new_auth_user para remover password
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Extrair o telefone dos metadados do usuário
  IF NEW.raw_user_meta_data->>'phone' IS NOT NULL THEN
    -- Fazer UPSERT na tabela clientes
    INSERT INTO public.clientes (
      phone,
      name,
      email,
      cpf,
      auth_user_id,
      is_active,
      subscription_active,
      created_at,
      updated_at
    ) VALUES (
      NEW.raw_user_meta_data->>'phone',
      COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
      NEW.email,
      NEW.raw_user_meta_data->>'cpf',
      NEW.id,
      true,
      false,
      NOW(),
      NOW()
    )
    ON CONFLICT (phone) 
    DO UPDATE SET
      auth_user_id = NEW.id,
      email = NEW.email,
      name = COALESCE(EXCLUDED.name, clientes.name),
      cpf = COALESCE(EXCLUDED.cpf, clientes.cpf),
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Atualizar sync_cliente_auth_user_id para remover password
CREATE OR REPLACE FUNCTION public.sync_cliente_auth_user_id(
  p_phone TEXT,
  p_name TEXT,
  p_email TEXT,
  p_cpf TEXT,
  p_auth_user_id UUID
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.clientes (
    phone,
    name,
    email,
    cpf,
    auth_user_id,
    is_active,
    subscription_active,
    created_at,
    updated_at
  ) VALUES (
    p_phone,
    p_name,
    p_email,
    p_cpf,
    p_auth_user_id,
    true,
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (phone) 
  DO UPDATE SET
    auth_user_id = p_auth_user_id,
    email = p_email,
    name = p_name,
    cpf = p_cpf,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Atualizar migrate_users_to_supabase_auth para remover password
DROP FUNCTION IF EXISTS public.migrate_users_to_supabase_auth();

CREATE OR REPLACE FUNCTION public.migrate_users_to_supabase_auth()
RETURNS TABLE(
  phone TEXT,
  email TEXT,
  auth_user_id UUID,
  success BOOLEAN,
  error_message TEXT
) AS $$
DECLARE
  cliente_record RECORD;
  synthetic_email TEXT;
  new_user_id UUID;
  error_msg TEXT;
BEGIN
  -- Iterar sobre todos os clientes ativos que ainda não foram migrados
  FOR cliente_record IN 
    SELECT c.phone, c.name, c.email, c.cpf, c.plan_id, c.subscription_active, c.is_active
    FROM public.clientes c
    WHERE c.is_active = true 
    AND c.auth_user_id IS NULL
  LOOP
    BEGIN
      -- Gerar email sintético
      synthetic_email := public.phone_to_email(cliente_record.phone);
      
      -- Nota: Esta função não pode criar usuários diretamente em auth.users
      -- A criação deve ser feita via API do Supabase Auth
      -- Esta função apenas prepara os dados para migração
      
      -- Retornar dados para migração via API
      phone := cliente_record.phone;
      email := synthetic_email;
      auth_user_id := NULL; -- Será preenchido após criação via API
      success := true;
      error_message := NULL;
      RETURN NEXT;
      
    EXCEPTION WHEN OTHERS THEN
      -- Capturar erro e continuar com próximo usuário
      error_msg := SQLERRM;
      
      phone := cliente_record.phone;
      email := synthetic_email;
      auth_user_id := NULL;
      success := false;
      error_message := error_msg;
      RETURN NEXT;
    END;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- PARTE 2: Remover colunas da tabela clientes
-- ========================================

-- Remover coluna password (não é mais usada - autenticação via Supabase Auth)
ALTER TABLE public.clientes DROP COLUMN IF EXISTS password;

-- Remover coluna whatsapp_instance_url (não é usada)
ALTER TABLE public.clientes DROP COLUMN IF EXISTS whatsapp_instance_url;

-- ========================================
-- PARTE 3: Comentários de documentação
-- ========================================

COMMENT ON FUNCTION public.prepare_user_migration_data() IS 'Prepara dados para migração via Service Role API. Atualizado: removida referência a password (2025-11-14)';
COMMENT ON FUNCTION public.handle_new_auth_user() IS 'Trigger que sincroniza novos usuários do Supabase Auth para tabela clientes. Atualizado: removida referência a password (2025-11-14)';
COMMENT ON FUNCTION public.sync_cliente_auth_user_id(TEXT, TEXT, TEXT, TEXT, UUID) IS 'Sincroniza cliente com auth_user_id. Atualizado: removida referência a password (2025-11-14)';
COMMENT ON FUNCTION public.migrate_users_to_supabase_auth() IS 'Prepara dados para migração de usuários para Supabase Auth. Atualizado: removida referência a password (2025-11-14)';

