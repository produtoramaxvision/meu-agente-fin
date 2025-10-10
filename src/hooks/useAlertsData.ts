import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { endOfMonth, startOfMonth, subMonths, format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

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

export function useAlertsData() {
  const { cliente } = useAuth();
  const [loading, setLoading] = useState(true);
  const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>([]);
  const [overdueBills, setOverdueBills] = useState<OverdueBill[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary>({ income: 0, outcome: 0, balance: 0 });
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
  const [insights, setInsights] = useState<FinancialInsight[]>([]);

  const fetchAlertsData = useCallback(async () => {
    if (!cliente?.phone) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 14);
    const upcomingDateString = upcomingDate.toISOString().split('T')[0];

    // Buscar contas próximas do vencimento (apenas saídas pendentes)
    const { data: upcomingData, error: upcomingError } = await supabase
      .from('financeiro_registros')
      .select('*')
      .eq('phone', cliente.phone)
      .eq('status', 'pendente')
      .eq('tipo', 'saida')
      .not('data_vencimento', 'is', null)
      .gte('data_vencimento', today)
      .lte('data_vencimento', upcomingDateString)
      .order('data_vencimento', { ascending: true });

    if (upcomingError) {
      console.error('Error fetching upcoming bills:', upcomingError);
    } else {
      setUpcomingBills((upcomingData as UpcomingBill[]) || []);
    }

    // Buscar contas vencidas (apenas saídas pendentes)
    const { data: overdueData, error: overdueError } = await supabase
      .from('financeiro_registros')
      .select('*')
      .eq('phone', cliente.phone)
      .eq('status', 'pendente')
      .eq('tipo', 'saida')
      .not('data_vencimento', 'is', null)
      .lt('data_vencimento', today)
      .order('data_vencimento', { ascending: false });

    if (overdueError) {
      console.error('Error fetching overdue bills:', overdueError);
    } else {
      setOverdueBills((overdueData as OverdueBill[]) || []);
    }

    // Resumo Mensal
    const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    const currentMonthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');

    const { data: monthlyData, error: monthlyError } = await supabase
      .from('financeiro_registros')
      .select('valor, tipo')
      .eq('phone', cliente.phone)
      .gte('data_vencimento', currentMonthStart)
      .lte('data_vencimento', currentMonthEnd)
      .eq('status', 'pago');

    if (monthlyError) {
      console.error('Error fetching monthly summary:', monthlyError);
    } else {
      const typedData = monthlyData as { valor: number; tipo: string }[];
      const income = typedData.filter(c => c.tipo === 'entrada').reduce((acc, c) => acc + c.valor, 0);
      const outcome = typedData.filter(c => c.tipo === 'saida').reduce((acc, c) => acc + c.valor, 0);
      setMonthlySummary({ income, outcome, balance: income - outcome });
    }

    // Gastos por Categoria (últimos 3 meses)
    const threeMonthsAgo = format(startOfMonth(subMonths(new Date(), 2)), 'yyyy-MM-dd');
    const { data: categoryData, error: categoryError } = await supabase
      .from('financeiro_registros')
      .select('categoria, valor')
      .eq('phone', cliente.phone)
      .eq('tipo', 'saida')
      .eq('status', 'pago')
      .gte('data_vencimento', threeMonthsAgo);

    if (categoryError) {
      console.error('Error fetching category spending:', categoryError);
    } else {
      const typedCategoryData = categoryData as { categoria: string; valor: number }[];
      const spendingMap = typedCategoryData.reduce((acc, { categoria, valor }) => {
        acc[categoria] = (acc[categoria] || 0) + valor;
        return acc;
      }, {} as Record<string, number>);

      const formattedSpending = Object.entries(spendingMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
      setCategorySpending(formattedSpending);
    }

    // Calculate insights
    const previousMonthStart = format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');
    const previousMonthEnd = format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');

    const { data: prevMonthData } = await supabase
      .from('financeiro_registros')
      .select('valor, tipo, categoria')
      .eq('phone', cliente.phone)
      .gte('data_vencimento', previousMonthStart)
      .lte('data_vencimento', previousMonthEnd)
      .eq('status', 'pago');

    if (prevMonthData && monthlyData) {
      const typedPrevData = prevMonthData as { valor: number; tipo: string; categoria: string }[];
      const typedCurrentData = monthlyData as { valor: number; tipo: string }[];
      
      const prevIncome = typedPrevData.filter(c => c.tipo === 'entrada').reduce((acc, c) => acc + c.valor, 0);
      const prevOutcome = typedPrevData.filter(c => c.tipo === 'saida').reduce((acc, c) => acc + c.valor, 0);
      const currIncome = typedCurrentData.filter(c => c.tipo === 'entrada').reduce((acc, c) => acc + c.valor, 0);
      const currOutcome = typedCurrentData.filter(c => c.tipo === 'saida').reduce((acc, c) => acc + c.valor, 0);

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
  }, [cliente?.phone]);

  useEffect(() => {
    fetchAlertsData();
  }, [fetchAlertsData]);

  return { loading, upcomingBills, overdueBills, monthlySummary, categorySpending, insights, refetch: fetchAlertsData };
}