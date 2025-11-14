-- Corrigir função handle_new_auth_user para incluir plan_id: 'free' ao criar novo usuário
-- Data: 2025-11-14
-- Problema: Trigger não estava definindo plan_id ao criar registro em clientes

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Extrair o telefone dos metadados do usuário
  IF NEW.raw_user_meta_data->>'phone' IS NOT NULL THEN
    -- Fazer UPSERT na tabela clientes
    -- IMPORTANTE: Incluir plan_id: 'free' para novos usuários
    INSERT INTO public.clientes (
      phone,
      name,
      email,
      cpf,
      auth_user_id,
      is_active,
      subscription_active,
      plan_id,
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
      'free',  -- NOVO: Definir plan_id como 'free' para novos usuários
      NOW(),
      NOW()
    )
    ON CONFLICT (phone) 
    DO UPDATE SET
      auth_user_id = NEW.id,
      email = NEW.email,
      name = COALESCE(EXCLUDED.name, clientes.name),
      cpf = COALESCE(EXCLUDED.cpf, clientes.cpf),
      -- NOVO: Atualizar plan_id apenas se ainda não estiver definido (NULL)
      -- Isso preserva plan_id se já existir, mas define como 'free' se for NULL
      plan_id = COALESCE(clientes.plan_id, 'free'),
      subscription_active = COALESCE(clientes.subscription_active, false),
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário de documentação
COMMENT ON FUNCTION public.handle_new_auth_user() IS 'Trigger que sincroniza novos usuários do Supabase Auth para tabela clientes. Atualizado: inclui plan_id: free para novos usuários (2025-11-14)';

