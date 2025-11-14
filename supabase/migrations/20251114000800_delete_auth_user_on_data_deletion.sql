-- Garantir que a função delete_user_data também remova o usuário do Supabase Auth (auth.users)
-- Data: 2025-11-14

CREATE OR REPLACE FUNCTION public.delete_user_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB := '{}';
    deleted_tables TEXT[] := '{}';
    table_name TEXT;
    user_phone_var TEXT;
    tables_to_delete TEXT[] := ARRAY[
        'privacy_settings',
        'financeiro_registros',
        'metas',
        'tasks',
        'notifications',
        'events',
        'calendars',
        'focus_blocks',
        'sync_state',
        'scheduling_links',
        'resources',
        'event_participants',
        'event_reminders',
        'event_resources',
        'ingestion_log'
    ];
BEGIN
    -- Usar auth.uid() como única fonte de verdade
    SELECT phone INTO user_phone_var
    FROM public.clientes
    WHERE auth_user_id = auth.uid();
    
    -- Verificar se o usuário está autenticado e existe
    IF user_phone_var IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Usuário não autenticado ou não encontrado'
        );
    END IF;

    -- Deletar dados de cada tabela ligada ao telefone
    FOREACH table_name IN ARRAY tables_to_delete
    LOOP
        BEGIN
            EXECUTE format('DELETE FROM public.%I WHERE phone = %L', table_name, user_phone_var);
            
            IF FOUND THEN
                deleted_tables := array_append(deleted_tables, table_name);
            END IF;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE WARNING 'Erro ao deletar da tabela %: %', table_name, SQLERRM;
        END;
    END LOOP;

    -- Deletar o usuário da tabela clientes
    DELETE FROM public.clientes WHERE auth_user_id = auth.uid();
    IF FOUND THEN
      deleted_tables := array_append(deleted_tables, 'clientes');
    END IF;

    -- Deletar também o usuário do Supabase Auth (auth.users)
    BEGIN
      DELETE FROM auth.users WHERE id = auth.uid();
      IF FOUND THEN
        deleted_tables := array_append(deleted_tables, 'auth.users');
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Erro ao deletar usuário em auth.users: %', SQLERRM;
    END;

    result := jsonb_build_object(
        'success', true,
        'deleted_tables', deleted_tables,
        'deletion_timestamp', NOW(),
        'message', 'Dados do usuário e conta de autenticação excluídos com sucesso'
    );

    RETURN result;
END;
$$;

COMMENT ON FUNCTION public.delete_user_data() IS 'Deleta dados do usuário autenticado em todas as tabelas relacionadas e remove o usuário de auth.users. Usa auth.uid() como fonte de verdade.';


