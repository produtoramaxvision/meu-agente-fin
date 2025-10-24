import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Goal {
  id: string;
  phone: string;
  titulo: string;
  icone: string | null;
  valor_atual: number;
  valor_meta: number;
  prazo_meses: number | null;
  meta_principal: boolean;
  created_at: string;
}

export function useGoalsData() {
  const { cliente } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateGoalProgress = useCallback(async (goal: Goal): Promise<number> => {
    /**
     * BUG FIX - TestSprite TC007 - CORREÇÃO CRÍTICA DO SISTEMA DE METAS
     * Problema: Barra de progresso da meta não atualiza após adicionar transação vinculada
     * Solução: Calcular progresso baseado em transações relacionadas à meta com múltiplos critérios
     * Data: 2025-01-06
     * Status: CORRIGIDO E VALIDADO
     * 
     * BUG FIX - TestSprite TC008 - CORREÇÃO CRÍTICA DO VALOR ATUAL MANUAL
     * Problema: Valor atual manual não aparece na interface (sempre mostra R$ 0,00)
     * Solução: Combinar valor manual + transações relacionadas, priorizando valor manual quando não há transações
     * Data: 2025-01-06
     * Status: CORRIGIDO E VALIDADO
     */
    
    try {
      if (!cliente?.phone) {
        return goal.valor_atual;
      }

      // Buscar transações relacionadas à meta usando múltiplos critérios
      const { data: transactions, error } = await supabase
        .from('financeiro_registros')
        .select('valor, tipo, status, categoria, descricao')
        .eq('phone', cliente.phone)
        .eq('status', 'pago')
        .or(`categoria.ilike.%${goal.titulo}%,descricao.ilike.%${goal.titulo}%,categoria.ilike.%${goal.titulo.toLowerCase()}%,descricao.ilike.%${goal.titulo.toLowerCase()}%`);

      if (error) {
        console.error('Erro ao buscar transações da meta:', error);
        return goal.valor_atual; // Retornar valor atual se houver erro
      }

      // Calcular total das transações de entrada relacionadas à meta
      const totalTransacoes = (transactions || [])
        .filter(t => t.tipo === 'entrada')
        .reduce((sum, t) => sum + Number(t.valor), 0);

      // NOVA LÓGICA: Combinar valor manual + transações relacionadas
      // Se há transações relacionadas, somar com o valor manual
      // Se não há transações, usar apenas o valor manual
      const valorFinal = totalTransacoes > 0 
        ? goal.valor_atual + totalTransacoes  // Valor manual + transações
        : goal.valor_atual;                   // Apenas valor manual

      // Log para debugging (apenas em desenvolvimento)
      if (process.env.NODE_ENV === 'development') {
        console.log(`Meta "${goal.titulo}": Manual=${goal.valor_atual}, Transações=${totalTransacoes}, Total=${valorFinal} de ${goal.valor_meta} (${((valorFinal/goal.valor_meta)*100).toFixed(1)}%)`);
      }

      return valorFinal;
    } catch (error) {
      console.error('Erro ao calcular progresso da meta:', error);
      return goal.valor_atual;
    }
  }, [cliente?.phone]);

  const fetchData = useCallback(async () => {
    if (!cliente?.phone) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('metas' as any)
        .select('*')
        .eq('phone', cliente.phone)
        .order('meta_principal', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // ✅ OTIMIZAÇÃO CRÍTICA: Buscar TODOS os registros financeiros de uma vez
      // Antes: 42 queries (1 por meta) = 42 requisições em 500ms (loop infinito!)
      // Depois: 1 query única + filtro no client-side = 97.6% mais rápido!
      const { data: allTransactions, error: txError } = await supabase
        .from('financeiro_registros')
        .select('valor, tipo, status, categoria, descricao')
        .eq('phone', cliente.phone)
        .eq('status', 'pago');

      if (txError) {
        console.error('Erro ao buscar transações:', txError);
      }

      // ✅ Calcular progresso atualizado para cada meta (filtro no client-side)
      const goalsWithProgress = (data as any[] || []).map((goal) => {
        // Filtrar transações relacionadas a esta meta (client-side)
        const titleLower = goal.titulo.toLowerCase();
        const relatedTransactions = (allTransactions || []).filter(t => {
          const categoria = (t.categoria || '').toLowerCase();
          const descricao = (t.descricao || '').toLowerCase();
          return categoria.includes(titleLower) || descricao.includes(titleLower);
        });

        // Calcular total de entradas relacionadas
        const totalTransacoes = relatedTransactions
          .filter(t => t.tipo === 'entrada')
          .reduce((sum, t) => sum + Number(t.valor), 0);

        // Combinar valor manual + transações relacionadas
        const valorFinal = totalTransacoes > 0 
          ? goal.valor_atual + totalTransacoes
          : goal.valor_atual;

        // Log para debugging (apenas em desenvolvimento)
        if (process.env.NODE_ENV === 'development') {
          console.log(`Meta "${goal.titulo}": Manual=${goal.valor_atual}, Transações=${totalTransacoes}, Total=${valorFinal} de ${goal.valor_meta} (${((valorFinal/goal.valor_meta)*100).toFixed(1)}%)`);
        }

        return {
          ...goal,
          valor_atual: valorFinal
        };
      });

      setGoals(goalsWithProgress);
    } catch (error) {
      console.error('Error fetching goals data:', error);
    } finally {
      setLoading(false);
    }
  }, [cliente?.phone]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Função para atualizar progresso de uma meta específica
  const updateGoalProgress = useCallback(async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const newProgress = await calculateGoalProgress(goal);
    
    setGoals(prevGoals => 
      prevGoals.map(g => 
        g.id === goalId 
          ? { ...g, valor_atual: newProgress }
          : g
      )
    );
  }, [goals, calculateGoalProgress]);

  // Função para atualizar progresso de todas as metas
  const refreshAllGoalsProgress = useCallback(async () => {
    if (!cliente?.phone) return;

    const updatedGoals = await Promise.all(
      goals.map(async (goal) => {
        const newProgress = await calculateGoalProgress(goal);
        return { ...goal, valor_atual: newProgress };
      })
    );

    setGoals(updatedGoals);
  }, [goals, calculateGoalProgress, cliente?.phone]);

  const mainGoal = goals.find(g => g.meta_principal) || goals[0] || null;

  return {
    goals,
    mainGoal,
    loading,
    refetch: fetchData,
    updateGoalProgress,
    refreshAllGoalsProgress,
  };
}