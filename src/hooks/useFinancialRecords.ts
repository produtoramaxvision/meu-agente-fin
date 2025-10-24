import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface FinancialRecord {
  id: number;
  phone: string;
  tipo: 'entrada' | 'saida';
  categoria: string;
  valor: number;
  descricao: string | null;
  data_hora: string;
  created_at: string;
  status: 'pago' | 'pendente';
  data_vencimento: string | null;
  recorrente: boolean;
  recorrencia_fim: string | null;
}

/**
 * ✅ HOOK CONSOLIDADO - Solução para Loop Infinito
 * 
 * PROBLEMA IDENTIFICADO:
 * - useFinancialData, useGoalsData e useAlertsData faziam 8-9 queries simultâneas
 * - Cada hook fazia sua própria requisição com filtros diferentes
 * - Isso causava loop infinito detectado pelos testes Playwright
 * 
 * SOLUÇÃO (Baseada em Context7-MCP - TanStack Query Best Practices):
 * - Fazer UMA única query para buscar TODOS os registros financeiros
 * - Usar React Query cache para compartilhar dados entre componentes
 * - Deixar filtros e transformações para o client-side com `select`
 * - staleTime: 5min garantido pelo main.tsx (linha 11)
 * - gcTime: 10min garantido pelo main.tsx (linha 12)
 * 
 * REFERÊNCIA:
 * - Context7 TanStack Query: "Sharing queries between components"
 * - Context7 TanStack Query: "Query data selector for client-side filtering"
 * 
 * Data: 2025-01-24
 * Status: ✅ IMPLEMENTADO
 */
export function useFinancialRecords() {
  const { cliente } = useAuth();

  return useQuery({
    queryKey: ['financial-records-all', cliente?.phone],
    queryFn: async () => {
      if (!cliente?.phone) return [];

      // ✅ Query única e completa - sem filtros
      // Filtros serão aplicados no client-side usando `select`
      const { data, error } = await supabase
        .from('financeiro_registros')
        .select('*')
        .eq('phone', cliente.phone)
        .order('data_hora', { ascending: false });

      if (error) {
        console.error('Erro ao buscar registros financeiros:', error);
        throw error;
      }

      console.log('✅ useFinancialRecords - Query consolidada:', data?.length, 'registros');
      return (data as FinancialRecord[]) || [];
    },
    enabled: !!cliente?.phone,
    // ✅ Configurações herdadas do QueryClient global (main.tsx):
    // - staleTime: 5 * 60 * 1000 (5 minutos)
    // - gcTime: 10 * 60 * 1000 (10 minutos)
    // - refetchOnWindowFocus: false
    // - refetchOnMount: false
    placeholderData: (previousData) => previousData,
  });
}

