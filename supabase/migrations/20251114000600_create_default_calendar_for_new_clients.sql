-- Criar agenda padrão "pessoal" para toda nova conta
-- Data: 2025-11-14

-- 1) Função de trigger para criar calendário padrão
CREATE OR REPLACE FUNCTION public.create_default_calendar_for_cliente()
RETURNS TRIGGER AS $$
BEGIN
  -- Somente para clientes ativos
  IF NEW.is_active THEN
    -- Criar calendário "pessoal" se ainda não existir nenhum calendário para esse phone
    INSERT INTO public.calendars (phone, name, is_primary)
    SELECT NEW.phone, 'pessoal', true
    WHERE NOT EXISTS (
      SELECT 1 FROM public.calendars c
      WHERE c.phone = NEW.phone
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2) Trigger na tabela clientes
DROP TRIGGER IF EXISTS create_default_calendar_for_cliente ON public.clientes;

CREATE TRIGGER create_default_calendar_for_cliente
  AFTER INSERT ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_calendar_for_cliente();

-- Comentário
COMMENT ON FUNCTION public.create_default_calendar_for_cliente() IS 'Cria automaticamente um calendário "pessoal" para cada novo cliente ativo.';

