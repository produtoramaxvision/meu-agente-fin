import { useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Hook para monitorar mudanças em tempo real nos registros financeiros
 * usando Supabase Realtime.
 * 
 * Monitora eventos UPDATE na tabela financeiro_registros para:
 * - Alertar quando uma conta vence
 * - Sincronizar dados entre múltiplas abas/dispositivos
 * - Invalidar queries do React Query automaticamente
 * 
 * @param userPhone - Telefone do usuário para filtrar os registros
 */
export const useRealtimeFinancialAlerts = (userPhone: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userPhone) {
      console.log('⚠️ useRealtimeFinancialAlerts: userPhone não fornecido');
      return;
    }

    console.log('💰 useRealtimeFinancialAlerts: Iniciando para:', userPhone);

    // Configurar canal de Realtime para alertas financeiros
    const channel: RealtimeChannel = supabase
      .channel(`financial-alerts:${userPhone}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'financeiro_registros',
          filter: `phone=eq.${userPhone}`
        },
        (payload) => {
          console.log('💰 Mudança financeira detectada:', payload);
          
          const oldRecord = payload.old as { status?: string; id?: number };
          const newRecord = payload.new as { 
            id: number;
            status: string;
            descricao: string;
            valor: number;
            tipo: 'entrada' | 'saida';
            data_vencimento?: string;
            categoria: string;
          };

          // Invalidar queries relacionadas para atualizar UI
          queryClient.invalidateQueries({ queryKey: ['financial-records'] });
          queryClient.invalidateQueries({ queryKey: ['alerts'] });
          queryClient.invalidateQueries({ queryKey: ['upcoming-bills'] });
          queryClient.invalidateQueries({ queryKey: ['financial-data'] });
          
          // Alerta crítico: Conta venceu
          if (oldRecord.status !== 'vencido' && newRecord.status === 'vencido') {
            console.log('🚨 ALERTA: Conta vencida!', newRecord);
            
            toast.error('Conta Vencida!', {
              description: `${newRecord.descricao} - R$ ${newRecord.valor.toFixed(2)}`,
              duration: 10000,
              action: {
                label: 'Ver Detalhes',
                onClick: () => {
                  window.location.href = '/contas';
                }
              }
            });
          }
          
          // Alerta positivo: Conta foi paga
          if (oldRecord.status === 'pendente' && newRecord.status === 'pago') {
            console.log('✅ Conta paga:', newRecord);
            
            if (newRecord.tipo === 'saida') {
              toast.success('Pagamento Registrado!', {
                description: `${newRecord.descricao} - R$ ${newRecord.valor.toFixed(2)}`,
                duration: 5000
              });
            }
          }
          
          // Alerta informativo: Conta recebida
          if (oldRecord.status === 'pendente' && newRecord.status === 'recebido') {
            console.log('💵 Receita recebida:', newRecord);
            
            toast.success('Receita Recebida!', {
              description: `${newRecord.descricao} - R$ ${newRecord.valor.toFixed(2)}`,
              duration: 5000
            });
          }
        }
      )
      .on('system', {}, (status) => {
        console.log('📡 Status Realtime (Financial):', status);
      })
      .subscribe((status) => {
        console.log('🔌 Canal de alertas financeiros:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Conectado ao canal de alertas financeiros em tempo real');
        } else if (status === 'CHANNEL_ERROR') {
          // ❌ NÃO mostrar toast de erro ao usuário (pode ser erro transitório)
          // Apenas logar para debug
          console.error('❌ Erro no canal de alertas financeiros (não crítico)');
        } else if (status === 'TIMED_OUT') {
          console.warn('⏰ Timeout no canal de alertas financeiros');
        } else if (status === 'CLOSED') {
          console.log('🔒 Canal de alertas financeiros fechado');
        }
      });

    // Cleanup ao desmontar
    return () => {
      console.log('🔌 Desconectando canal de alertas financeiros');
      supabase.removeChannel(channel);
    };
  }, [userPhone, queryClient]);
};

