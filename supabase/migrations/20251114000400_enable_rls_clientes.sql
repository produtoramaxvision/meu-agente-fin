-- Habilitar Row Level Security (RLS) na tabela clientes
-- Data: 2025-11-14
-- Problema: Tabela tem políticas RLS mas RLS não está habilitado

-- Habilitar RLS na tabela clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Verificar se as políticas já existem (foram criadas na migration anterior)
-- Se não existirem, serão criadas abaixo

-- Policy: Allow phone lookup for login (SELECT público para verificação de telefone)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'public.clientes'::regclass 
    AND polname = 'Allow phone lookup for login'
  ) THEN
    CREATE POLICY "Allow phone lookup for login"
      ON public.clientes
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- Policy: Allow signup for all users (INSERT público para cadastro)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'public.clientes'::regclass 
    AND polname = 'Allow signup for all users'
  ) THEN
    CREATE POLICY "Allow signup for all users"
      ON public.clientes
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Policy: Users can view their own profile via auth_user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'public.clientes'::regclass 
    AND polname = 'Users can view their own profile via auth_user_id'
  ) THEN
    CREATE POLICY "Users can view their own profile via auth_user_id"
      ON public.clientes
      FOR SELECT
      TO authenticated
      USING (auth_user_id = auth.uid());
  END IF;
END $$;

-- Policy: Users can update their own profile via auth_user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy 
    WHERE polrelid = 'public.clientes'::regclass 
    AND polname = 'Users can update their own profile via auth_user_id'
  ) THEN
    CREATE POLICY "Users can update their own profile via auth_user_id"
      ON public.clientes
      FOR UPDATE
      TO authenticated
      USING (auth_user_id = auth.uid())
      WITH CHECK (auth_user_id = auth.uid());
  END IF;
END $$;

