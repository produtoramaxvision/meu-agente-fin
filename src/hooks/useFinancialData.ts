import { useCallback } from 'react';
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
  // New fields
  status: 'pago' | 'pendente';
  data_vencimento: string | null;
  recorrente: boolean;
  recorrencia_fim: string | null;
}

export interface DailyData {
  date: string;
  entradas: number;
  saidas: number;
}

export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  entradas: number;
  saidas: number;
}

export interface FinancialMetrics {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  totalTransacoes: number;
}

export function useFinancialData(
  periodDays?: number, 
  categoryFilter?: string, 
  typeFilter?: 'entrada' | 'saida' | 'all',
  statusFilter?: 'pago' | 'pendente' | 'all'
) {
  const { cliente } = useAuth();

  // ✅ OTIMIZAÇÃO: Usar React Query com cache inteligente
  const { data: records = [], isLoading: loading, refetch } = useQuery({
    queryKey: ['financial-records', cliente?.phone, periodDays, categoryFilter, typeFilter, statusFilter],
    queryFn: async () => {
      if (!cliente?.phone) return [];

      let query = supabase
        .from('financeiro_registros')
        .select('*')
        .eq('phone', cliente.phone)
        .order('data_hora', { ascending: false });

      // Filtrar por período (últimos N dias)
      if (periodDays) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - periodDays);
        query = query.gte('data_hora', startDate.toISOString());
      }

      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('categoria', categoryFilter);
      }
      if (typeFilter && typeFilter !== 'all') {
        query = query.eq('tipo', typeFilter);
      }
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar registros financeiros:', error);
        throw error;
      }

      console.log('fetchData - Dados recebidos:', data?.length, 'registros');
      return (data as FinancialRecord[]) || [];
    },
    enabled: !!cliente?.phone,
    // ✅ Usando configurações globais - não sobrescrever aqui
    // staleTime, refetchOnWindowFocus, refetchOnMount já configurados globalmente
    refetchInterval: false, // ❌ CRÍTICO: Removido refetch automático que causava loop
    placeholderData: (previousData) => previousData,
  });

  // ✅ OTIMIZAÇÃO: Calcular métricas usando useMemo para evitar recálculos desnecessários
  const metrics = useCallback((): FinancialMetrics => {
    // ✅ CORREÇÃO CRÍTICA: Incluir todos os registros, não apenas os pagos
    // O dashboard deve mostrar o total geral, não apenas os pagos
    const receitas = records
      .filter((r) => r.tipo === 'entrada')
      .reduce((sum, r) => sum + Number(r.valor), 0);
    
    const despesas = records
      .filter((r) => r.tipo === 'saida')
      .reduce((sum, r) => sum + Number(r.valor), 0);

    return {
      totalReceitas: receitas,
      totalDespesas: despesas,
      saldo: receitas - despesas,
      totalTransacoes: records.length,
    };
  }, [records]);

  // Get daily data for charts - memoized
  const getDailyData = useCallback((): DailyData[] => {
    const dailyMap = new Map<string, DailyData>();
    const daysToShow = periodDays || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysToShow);

    records
      .filter((r) => new Date(r.data_hora) >= startDate)
      .forEach((record) => {
        const date = new Date(record.data_hora).toLocaleDateString('pt-BR');
        const existing = dailyMap.get(date) || { date, entradas: 0, saidas: 0 };
        
        if (record.tipo === 'entrada') {
          existing.entradas += Number(record.valor);
        } else {
          existing.saidas += Number(record.valor);
        }
        
        dailyMap.set(date, existing);
      });

    return Array.from(dailyMap.values()).sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });
  }, [records, periodDays]);

  // Get category data for pie chart - memoized
  const getCategoryData = useCallback((tipo: 'entrada' | 'saida' = 'saida'): CategoryData[] => {
    const categoryMap = new Map<string, number>();
    const filteredRecords = records.filter((r) => r.tipo === tipo);
    
    filteredRecords.forEach((record) => {
      const current = categoryMap.get(record.categoria) || 0;
      categoryMap.set(record.categoria, current + Number(record.valor));
    });

    const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [records]);

  // Get monthly data for bar chart - memoized
  const getMonthlyData = useCallback((): MonthlyData[] => {
    const monthlyMap = new Map<string, MonthlyData>();
    
    // CORREÇÃO: Incluir todos os registros, não apenas os pagos
    records.forEach((record) => {
      const date = new Date(record.data_hora);
      const month = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      const existing = monthlyMap.get(month) || { month, entradas: 0, saidas: 0 };
      
      if (record.tipo === 'entrada') {
        existing.entradas += Number(record.valor);
      } else {
        existing.saidas += Number(record.valor);
      }
      
      monthlyMap.set(month, existing);
    });

    const result = Array.from(monthlyMap.values())
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-6); // Last 6 months
    
    console.log('getMonthlyData - Total records:', records.length, 'Monthly data:', result.length);
    return result;
  }, [records]);

  // Get latest transactions - memoized
  const getLatestTransactions = useCallback((limit = 5): FinancialRecord[] => {
    // CORREÇÃO: Mostrar todos os registros, não apenas os pagos
    // Ordenar por data_hora decrescente e pegar os mais recentes
    const latest = records
      .sort((a, b) => new Date(b.data_hora).getTime() - new Date(a.data_hora).getTime())
      .slice(0, limit);
    
    console.log('getLatestTransactions - Total records:', records.length, 'Latest:', latest.length);
    return latest;
  }, [records]);

  // Get insights - memoized
  const getInsights = useCallback((tipo: 'entrada' | 'saida' = 'saida') => {
    const despesas = records.filter((r) => r.tipo === 'saida');
    const receitas = records.filter((r) => r.tipo === 'entrada');

    const maxDespesa = despesas.length > 0
      ? despesas.reduce((max, r) => (Number(r.valor) > Number(max.valor) ? r : max))
      : null;

    const maxReceita = receitas.length > 0
      ? receitas.reduce((max, r) => (Number(r.valor) > Number(max.valor) ? r : max))
      : null;

    const categoryTotals = getCategoryData(tipo);
    const topCategory = categoryTotals[0] || null;

    return {
      maxDespesa,
      maxReceita,
      topCategory,
    };
  }, [records, getCategoryData]);

  // Get total pending bills (a pagar) - memoized
  const getTotalPendingBills = useCallback((): number => {
    return records
      .filter((r) => r.tipo === 'saida' && r.status === 'pendente')
      .reduce((sum, r) => sum + Number(r.valor), 0);
  }, [records]);

  // Get total pending income (a receber) - memoized
  const getTotalPendingIncome = useCallback((): number => {
    return records
      .filter((r) => r.tipo === 'entrada' && r.status === 'pendente')
      .reduce((sum, r) => sum + Number(r.valor), 0);
  }, [records]);

  // Get total paid bills (pagas) - memoized
  const getTotalPaidBills = useCallback((): number => {
    return records
      .filter((r) => r.tipo === 'saida' && r.status === 'pago')
      .reduce((sum, r) => sum + Number(r.valor), 0);
  }, [records]);

  // Get total received income (recebidas) - memoized
  const getTotalReceivedIncome = useCallback((): number => {
    return records
      .filter((r) => r.tipo === 'entrada' && r.status === 'pago')
      .reduce((sum, r) => sum + Number(r.valor), 0);
  }, [records]);

  return {
    records,
    loading,
    metrics: metrics(),
    getDailyData,
    getCategoryData,
    getMonthlyData,
    getLatestTransactions,
    getInsights,
    getTotalPendingBills,
    getTotalPendingIncome,
    getTotalPaidBills,
    getTotalReceivedIncome,
    refetch, // ✅ Usando refetch do React Query
  };
}