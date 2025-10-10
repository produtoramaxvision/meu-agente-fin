-- Criar função de validação de categoria
CREATE OR REPLACE FUNCTION public.validate_categoria()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar categorias de entrada
  IF NEW.tipo = 'entrada' AND NEW.categoria NOT IN (
    'Salário', 'Freelance', 'Vendas', 'Investimento', 
    'Rendimentos', 'Presentes', 'Reembolso', 'Outros'
  ) THEN
    RAISE EXCEPTION 'Categoria de entrada inválida: %. Use uma das categorias: Salário, Freelance, Vendas, Investimento, Rendimentos, Presentes, Reembolso, Outros', NEW.categoria;
  END IF;
  
  -- Validar categorias de saída
  IF NEW.tipo = 'saida' AND NEW.categoria NOT IN (
    'Transporte', 'Alimentação', 'Viagem', 'Saúde', 'Educação',
    'Lazer', 'Moradia', 'Vestuário', 'Tecnologia', 'Pets', 
    'Beleza', 'Investimento', 'Outros'
  ) THEN
    RAISE EXCEPTION 'Categoria de despesa inválida: %. Use uma das categorias: Transporte, Alimentação, Viagem, Saúde, Educação, Lazer, Moradia, Vestuário, Tecnologia, Pets, Beleza, Investimento, Outros', NEW.categoria;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para validar categoria antes de inserir ou atualizar
CREATE TRIGGER check_categoria_valida
  BEFORE INSERT OR UPDATE ON public.financeiro_registros
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_categoria();