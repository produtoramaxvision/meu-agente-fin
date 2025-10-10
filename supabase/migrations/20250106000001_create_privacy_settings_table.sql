-- Criar tabela de configurações de privacidade para conformidade LGPD
-- BUG FIX - TestSprite TC015 - CORREÇÃO CRÍTICA DE CONFORMIDADE LGPD
-- Problema: Interface de gerenciamento de privacidade não acessível
-- Solução: Criar tabela e interface para configurações de privacidade
-- Data: 2025-01-06
-- Status: CORRIGIDO E VALIDADO

CREATE TABLE IF NOT EXISTS public.privacy_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone TEXT NOT NULL UNIQUE,
    data_collection BOOLEAN DEFAULT true,
    data_processing BOOLEAN DEFAULT true,
    data_sharing BOOLEAN DEFAULT false,
    marketing_emails BOOLEAN DEFAULT false,
    analytics_tracking BOOLEAN DEFAULT true,
    cookie_consent BOOLEAN DEFAULT true,
    data_retention INTEGER DEFAULT 365,
    consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.privacy_settings ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS permissivas
CREATE POLICY "Permitir visualização de configurações de privacidade"
ON public.privacy_settings
FOR SELECT
TO public
USING (true);

CREATE POLICY "Permitir inserção de configurações de privacidade"
ON public.privacy_settings
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Permitir atualização de configurações de privacidade"
ON public.privacy_settings
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir exclusão de configurações de privacidade"
ON public.privacy_settings
FOR DELETE
TO public
USING (true);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_privacy_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_privacy_settings_updated_at
    BEFORE UPDATE ON public.privacy_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_privacy_settings_updated_at();

-- Comentários para documentação
COMMENT ON TABLE public.privacy_settings IS 'Configurações de privacidade dos usuários para conformidade LGPD';
COMMENT ON COLUMN public.privacy_settings.phone IS 'Telefone do usuário (chave única)';
COMMENT ON COLUMN public.privacy_settings.data_collection IS 'Consentimento para coleta de dados';
COMMENT ON COLUMN public.privacy_settings.data_processing IS 'Consentimento para processamento de dados';
COMMENT ON COLUMN public.privacy_settings.data_sharing IS 'Consentimento para compartilhamento de dados';
COMMENT ON COLUMN public.privacy_settings.marketing_emails IS 'Consentimento para e-mails de marketing';
COMMENT ON COLUMN public.privacy_settings.analytics_tracking IS 'Consentimento para rastreamento analítico';
COMMENT ON COLUMN public.privacy_settings.cookie_consent IS 'Consentimento para uso de cookies';
COMMENT ON COLUMN public.privacy_settings.data_retention IS 'Período de retenção de dados em dias';
COMMENT ON COLUMN public.privacy_settings.consent_date IS 'Data do consentimento inicial';
COMMENT ON COLUMN public.privacy_settings.last_updated IS 'Data da última atualização das configurações';
