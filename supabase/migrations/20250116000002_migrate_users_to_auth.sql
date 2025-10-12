-- FASE 2: Migração de Usuários para Supabase Auth
-- Migrar usuários existentes da tabela clientes para auth.users
-- Data: 2025-01-16
-- Status: FASE 2 - MIGRAÇÃO DE USUÁRIOS

-- Função para migrar usuários existentes para Supabase Auth
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
    SELECT c.phone, c.name, c.email, c.password, c.cpf, c.plan_id, c.subscription_active, c.is_active
    FROM public.clientes c
    WHERE c.is_active = true 
    AND c.auth_user_id IS NULL
    AND c.password IS NOT NULL  -- Só migrar usuários com senha
  LOOP
    BEGIN
      -- Gerar email sintético
      synthetic_email := public.phone_to_email(cliente_record.phone);
      
      -- Criar usuário no Supabase Auth usando admin API
      -- Nota: Esta função simula a criação - na prática seria feita via API
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        synthetic_email,
        cliente_record.password, -- Usar hash existente
        now(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object(
          'phone', cliente_record.phone,
          'name', cliente_record.name,
          'cpf', cliente_record.cpf,
          'plan_id', cliente_record.plan_id,
          'subscription_active', cliente_record.subscription_active
        ),
        now(),
        now(),
        '',
        '',
        '',
        ''
      ) RETURNING id INTO new_user_id;
      
      -- Atualizar tabela clientes com auth_user_id
      UPDATE public.clientes 
      SET auth_user_id = new_user_id,
          updated_at = now()
      WHERE phone = cliente_record.phone;
      
      -- Retornar sucesso
      phone := cliente_record.phone;
      email := synthetic_email;
      auth_user_id := new_user_id;
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

-- Função alternativa para migração via Service Role (mais segura)
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

-- Função para atualizar auth_user_id após criação via API
CREATE OR REPLACE FUNCTION public.link_client_to_auth_user(
  client_phone TEXT,
  auth_user_uuid UUID
)
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

-- Comentários
COMMENT ON FUNCTION public.migrate_users_to_supabase_auth() IS 'Migra usuários da tabela clientes para auth.users (uso interno)';
COMMENT ON FUNCTION public.prepare_user_migration_data() IS 'Prepara dados para migração via Service Role API';
COMMENT ON FUNCTION public.link_client_to_auth_user(TEXT, UUID) IS 'Vincula cliente ao usuário auth criado via API';