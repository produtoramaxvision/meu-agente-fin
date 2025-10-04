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

      setGoals((data as any) || []);
    } catch (error) {
      console.error('Error fetching goals data:', error);
    } finally {
      setLoading(false);
    }
  }, [cliente?.phone]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mainGoal = goals.find(g => g.meta_principal) || goals[0] || null;

  return {
    goals,
    mainGoal,
    loading,
    refetch: fetchData,
  };
}