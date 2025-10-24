import { useState, useEffect, useCallback, useMemo } from 'react';
import { endOfMonth, startOfMonth, subMonths, format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialRecords } from './useFinancialRecords';

export interface UpcomingBill {
  id: number;
  phone: string;
  tipo: 'entrada' | 'saida';
  descricao: string;
  valor: number;
  data_vencimento: string;
  categoria: string;
  status: string;
  data_hora: string;
  created_at: string;
  recorrente: boolean;
  recorrencia_fim: string | null;
  updated_at: string;
}

export interface OverdueBill {
  id: number;
  descricao: string;
  valor: number;
  data_vencimento: string;
  categoria: string;
}

export interface MonthlySummary {
  income: number;
  outcome: number;
  balance: number;
}

export interface CategorySpending {
  name: string;
  value: number;
}

export interface FinancialInsight {
  period: string;
  spendingChangePercent: number | null;
  incomeChangePercent: number | null;
  topSpendingIncrease: { category: string; change: number } | null;
}

/**
 * ✅ REFATORADO - Usa hook consolidado useFinancialRecords
 * 
 * MUDANÇA:
 * - Antes: Fazia 5-6 queries separadas para financeiro_registros
 * - Depois: Usa useFinancialRecords + filtra no client-side
 * 
 * BENEFÍCIO: Elimina 5-6 queries duplicadas (maior fonte de loops!)
 * 
 * Data: 2025-01-24
 */
export function useAlertsData() {
  const { cliente } = useAuth();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<FinancialInsight[]>([]);

  // ✅ Usar hook consolidado (cache compartilhado)
  const { data: allRecords = [], isLoading: recordsLoading } = useFinancialRecords();

  // ✅ Calcular todos os dados usando useMemo (filtros no client-side)
  const upcomingBills = useMemo((): UpcomingBill[] => {
    const today = new Date().toISOString().split('T')[0];
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 14);
    const upcomingDateString = upcomingDate.toISOString().split('T')[0];

    return allRecords
      .filter(r => 
        r.status === 'pendente' &&
        r.tipo === 'saida' &&
        r.data_vencimento !== null &&
        r.data_vencimento >= today &&
        r.data_vencimento <= upcomingDateString
      )
      .sort((a, b) => (a.data_vencimento || '').localeCompare(b.data_vencimento || '')) as UpcomingBill[];
  }, [allRecords]);

  const overdueBills = useMemo((): OverdueBill[] => {
    const today = new Date().toISOString().split('T')[0];

    return allRecords
      .filter(r => 
        r.status === 'pendente' &&
        r.tipo === 'saida' &&
        r.data_vencimento !== null &&
        r.data_vencimento < today
      )
      .sort((a, b) => (b.data_vencimento || '').localeCompare(a.data_vencimento || ''))
      .map(r => ({
        id: r.id,
        descricao: r.descricao || '',
        valor: r.valor,
        data_vencimento: r.data_vencimento || '',
        categoria: r.categoria,
      }));
  }, [allRecords]);

  const monthlySummary = useMemo((): MonthlySummary => {
    const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    const currentMonthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');

    const monthlyRecords = allRecords.filter(r => 
      r.status === 'pago' &&
      r.data_vencimento !== null &&
      r.data_vencimento >= currentMonthStart &&
      r.data_vencimento <= currentMonthEnd
    );

    const income = monthlyRecords.filter(r => r.tipo === 'entrada').reduce((acc, r) => acc + r.valor, 0);
    const outcome = monthlyRecords.filter(r => r.tipo === 'saida').reduce((acc, r) => acc + r.valor, 0);

    return { income, outcome, balance: income - outcome };
  }, [allRecords]);

  const categorySpending = useMemo((): CategorySpending[] => {
    const threeMonthsAgo = format(startOfMonth(subMonths(new Date(), 2)), 'yyyy-MM-dd');

    const relevantRecords = allRecords.filter(r => 
      r.tipo === 'saida' &&
      r.status === 'pago' &&
      r.data_vencimento !== null &&
      r.data_vencimento >= threeMonthsAgo
    );

    const spendingMap = relevantRecords.reduce((acc, r) => {
      acc[r.categoria] = (acc[r.categoria] || 0) + r.valor;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(spendingMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [allRecords]);

  const fetchAlertsData = useCallback(async () => {
    if (!cliente?.phone) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // ✅ Calcular insights (única lógica que ainda precisa de dados calculados)
    const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    const currentMonthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');
    const previousMonthStart = format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');
    const previousMonthEnd = format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');

    const currentMonthRecords = allRecords.filter(r => 
      r.status === 'pago' &&
      r.data_vencimento !== null &&
      r.data_vencimento >= currentMonthStart &&
      r.data_vencimento <= currentMonthEnd
    );

    const prevMonthRecords = allRecords.filter(r => 
      r.status === 'pago' &&
      r.data_vencimento !== null &&
      r.data_vencimento >= previousMonthStart &&
      r.data_vencimento <= previousMonthEnd
    );

    if (prevMonthRecords.length > 0 && currentMonthRecords.length > 0) {
      const prevIncome = prevMonthRecords.filter(r => r.tipo === 'entrada').reduce((acc, r) => acc + r.valor, 0);
      const prevOutcome = prevMonthRecords.filter(r => r.tipo === 'saida').reduce((acc, r) => acc + r.valor, 0);
      const currIncome = currentMonthRecords.filter(r => r.tipo === 'entrada').reduce((acc, r) => acc + r.valor, 0);
      const currOutcome = currentMonthRecords.filter(r => r.tipo === 'saida').reduce((acc, r) => acc + r.valor, 0);

      const spendingChange = prevOutcome > 0 ? ((currOutcome - prevOutcome) / prevOutcome) * 100 : null;
      const incomeChange = prevIncome > 0 ? ((currIncome - prevIncome) / prevIncome) * 100 : null;

      setInsights([{
        period: 'últimos 30 dias',
        spendingChangePercent: spendingChange,
        incomeChangePercent: incomeChange,
        topSpendingIncrease: categorySpending.length > 0 
          ? { category: categorySpending[0].name, change: 0 } 
          : null,
      }]);
    }

    setLoading(false);
  }, [cliente?.phone, allRecords, categorySpending]);

  useEffect(() => {
    fetchAlertsData();
  }, [fetchAlertsData]);

  return { 
    loading: loading || recordsLoading, 
    upcomingBills, 
    overdueBills, 
    monthlySummary, 
    categorySpending, 
    insights, 
    refetch: fetchAlertsData 
  };
}