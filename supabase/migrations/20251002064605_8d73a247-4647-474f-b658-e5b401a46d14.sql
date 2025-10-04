-- Add CPF field to clientes table
ALTER TABLE public.clientes 
ADD COLUMN cpf VARCHAR(14) NULL;

-- Add comment to document the field
COMMENT ON COLUMN public.clientes.cpf IS 'CPF do cliente (opcional, formato: XXX.XXX.XXX-XX)';