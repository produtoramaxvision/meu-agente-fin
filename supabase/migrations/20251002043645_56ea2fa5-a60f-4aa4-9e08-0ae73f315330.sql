-- Adicionar nova coluna password (TEXT) para armazenar o hash da senha
ALTER TABLE public.clientes ADD COLUMN password TEXT;

-- Migrar dados existentes: extrair password_hash de settings.password_hash
UPDATE public.clientes 
SET password = settings->>'password_hash' 
WHERE settings ? 'password_hash';

-- Remover a coluna settings antiga
ALTER TABLE public.clientes DROP COLUMN settings;