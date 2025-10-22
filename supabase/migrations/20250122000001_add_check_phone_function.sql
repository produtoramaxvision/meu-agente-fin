-- Função segura para verificar se telefone existe
-- Retorna apenas boolean, sem expor dados sensíveis
-- Data: 2025-01-22
-- Objetivo: Permitir verificação de telefone durante fluxo de login multi-etapa

CREATE OR REPLACE FUNCTION public.check_phone_exists(phone_number TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  phone_exists BOOLEAN;
BEGIN
  -- Validar formato do telefone
  IF phone_number !~ '^\d{10,15}$' THEN
    RAISE EXCEPTION 'Formato de telefone inválido';
  END IF;
  
  -- Verificar na tabela clientes se existe usuário ativo com auth_user_id
  SELECT EXISTS(
    SELECT 1 
    FROM public.clientes c
    WHERE c.phone = phone_number 
    AND c.is_active = true
    AND c.auth_user_id IS NOT NULL
  ) INTO phone_exists;
  
  RETURN phone_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.check_phone_exists(TEXT) IS 
'Verifica se telefone existe e está vinculado a usuário ativo no Supabase Auth. Usado no fluxo de login multi-etapa.';

