/**
 * ✅ DEPRECATED - Use useGoals() ao invés deste hook
 * 
 * Este hook foi substituído por useGoals() que usa React Query de forma consolidada.
 * Mantenho este hook apenas para compatibilidade retroativa, mas ele agora apenas
 * delega para useGoals().
 * 
 * Data: 2025-01-24
 */
import { useGoals } from './useGoals';

// Re-exportar tipos para compatibilidade
export type { Goal } from './useGoals';

export function useGoalsData() {
  // ✅ REFATORADO: Delegar para useGoals() consolidado
  // Isso elimina 5-7 queries duplicadas para v1/metas
  return useGoals();
}
