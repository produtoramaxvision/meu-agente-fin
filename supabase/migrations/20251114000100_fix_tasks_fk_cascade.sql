-- Garantir FK em tasks.phone -> clientes.phone com ON DELETE CASCADE
-- Objetivo: sempre apagar tasks junto com o cliente, mesmo se o delete
-- for feito diretamente na tabela clientes.

DO $$
BEGIN
  -- Remover constraint existente (se houver) para recriar com ON DELETE CASCADE
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.tasks'::regclass
      AND contype = 'f'
  ) THEN
    ALTER TABLE public.tasks
      DROP CONSTRAINT IF EXISTS tasks_phone_fkey;
  END IF;

  -- Criar FK com ON DELETE CASCADE se ainda não existir
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.tasks'::regclass
      AND contype = 'f'
  ) THEN
    ALTER TABLE public.tasks
      ADD CONSTRAINT tasks_phone_fkey
      FOREIGN KEY (phone)
      REFERENCES public.clientes(phone)
      ON DELETE CASCADE;
  END IF;
END
$$;


