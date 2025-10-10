-- Correção das políticas RLS para privacy_settings
-- BUG FIX - TestSprite TC005 - CORREÇÃO CRÍTICA LGPD
-- Problema: Políticas RLS incorretas causando erro 404 na tabela privacy_settings
-- Solução: Corrigir políticas para usar campo 'phone' correto
-- Data: 2025-01-07
-- Status: CORRIGINDO

-- Remover políticas existentes incorretas
DROP POLICY IF EXISTS "Users can view their own privacy settings" ON public.privacy_settings;
DROP POLICY IF EXISTS "Users can insert their own privacy settings" ON public.privacy_settings;
DROP POLICY IF EXISTS "Users can update their own privacy settings" ON public.privacy_settings;
DROP POLICY IF EXISTS "Users can delete their own privacy settings" ON public.privacy_settings;

-- Remover políticas genéricas se existirem
DROP POLICY IF EXISTS "Permitir visualização de configurações de privacidade" ON public.privacy_settings;
DROP POLICY IF EXISTS "Permitir inserção de configurações de privacidade" ON public.privacy_settings;
DROP POLICY IF EXISTS "Permitir atualização de configurações de privacidade" ON public.privacy_settings;
DROP POLICY IF EXISTS "Permitir exclusão de configurações de privacidade" ON public.privacy_settings;

-- Criar políticas RLS corretas para privacy_settings
CREATE POLICY "Users can view their own privacy settings"
ON public.privacy_settings
FOR SELECT
USING (auth.uid()::text = phone);

CREATE POLICY "Users can insert their own privacy settings"
ON public.privacy_settings
FOR INSERT
WITH CHECK (auth.uid()::text = phone);

CREATE POLICY "Users can update their own privacy settings"
ON public.privacy_settings
FOR UPDATE
USING (auth.uid()::text = phone)
WITH CHECK (auth.uid()::text = phone);

CREATE POLICY "Users can delete their own privacy settings"
ON public.privacy_settings
FOR DELETE
USING (auth.uid()::text = phone);

-- Comentário para documentação
COMMENT ON POLICY "Users can view their own privacy settings" ON public.privacy_settings IS 'Permite usuários visualizarem apenas suas próprias configurações de privacidade';
COMMENT ON POLICY "Users can insert their own privacy settings" ON public.privacy_settings IS 'Permite usuários inserirem configurações de privacidade apenas para si mesmos';
COMMENT ON POLICY "Users can update their own privacy settings" ON public.privacy_settings IS 'Permite usuários atualizarem apenas suas próprias configurações de privacidade';
COMMENT ON POLICY "Users can delete their own privacy settings" ON public.privacy_settings IS 'Permite usuários deletarem apenas suas próprias configurações de privacidade';
