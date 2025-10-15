import { FinancialRecord } from '@/hooks/useFinancialData';
import { differenceInDays, format, isPast, isToday } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Tag, Repeat, Check, Edit, Trash2, Copy, AlertCircle, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { ActionMenu } from '@/components/ui/ActionMenu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { EditRecordDialog } from './EditRecordDialog';
import { DeleteRecordDialog } from './DeleteRecordDialog';
import { cn } from '@/lib/utils';

interface ContaItemProps {
  conta: FinancialRecord;
  onStatusChange: () => void;
}

export function ContaItem({ conta, onStatusChange }: ContaItemProps) {
  const [isPaying, setIsPaying] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const dueDate = new Date(conta.data_vencimento || conta.data_hora);
  const daysRemaining = differenceInDays(dueDate, new Date());
  const isOverdue = isPast(dueDate) && !isToday(dueDate);
  const isDueToday = isToday(dueDate);

  const getStatusProps = () => {
    if (conta.status === 'pago') {
      return {
        text: conta.tipo === 'entrada' ? 'Recebido' : 'Pago',
        icon: Check,
        className: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
      };
    }
    if (isOverdue) {
      return {
        text: `Venceu há ${-daysRemaining}d`,
        icon: AlertCircle,
        className: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
      };
    }
    if (isDueToday) {
      return {
        text: 'Vence hoje',
        icon: Clock,
        className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
      };
    }
    return {
      text: `Vence em ${daysRemaining}d`,
      icon: Clock,
      className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
    };
  };

  const getBorderColorClass = () => {
    if (conta.status === 'pago') {
      return conta.tipo === 'entrada'
        ? 'border-green-500' // Verde Claro (Recebidas)
        : 'border-red-800';   // Vermelho Escuro (Pagas)
    }
    // status === 'pendente'
    return conta.tipo === 'entrada'
      ? 'border-green-800'  // Verde Escuro (A Receber)
      : 'border-red-500';    // Vermelho Claro (A Vencer)
  };

  const statusProps = getStatusProps();
  const borderColorClass = getBorderColorClass();

  const handleMarkAsPaid = async () => {
    setIsPaying(true);
    try {
      const { error } = await supabase
        .from('financeiro_registros')
        .update({
          status: 'pago',
          data_hora: new Date().toISOString(),
        })
        .eq('id', conta.id);

      if (error) throw error;

      toast.success(conta.tipo === 'entrada' 
        ? 'Conta marcada como recebida.' 
        : 'Conta marcada como paga.');
      onStatusChange();
    } catch (error) {
      toast.error('Não foi possível atualizar a conta.');
    } finally {
      setIsPaying(false);
    }
  };

  const handleDeleteRecord = async () => {
    try {
      const { error } = await supabase
        .from('financeiro_registros')
        .delete()
        .eq('id', conta.id);

      if (error) throw error;

      toast.success("Registro excluído", {
        description: "A conta foi removida com sucesso.",
      });

      onStatusChange();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error("Não foi possível excluir a conta. Tente novamente.");
    }
  };

  const handleDuplicateRecord = async () => {
    try {
      const { error } = await supabase
        .from('financeiro_registros')
        .insert({
          phone: conta.phone,
          tipo: conta.tipo,
          categoria: conta.categoria,
          valor: conta.valor,
          descricao: `Cópia de - ${conta.descricao || conta.categoria}`,
          data_vencimento: conta.data_vencimento,
          recorrente: conta.recorrente,
          recorrencia_fim: conta.recorrencia_fim,
          status: 'pendente',
        });

      if (error) throw error;

      toast.success("Uma cópia da conta pendente foi criada.");

      onStatusChange();
    } catch (error) {
      console.error('Erro ao duplicar:', error);
      toast.error("Não foi possível duplicar a conta. Tente novamente.");
    }
  };

  const getButtonText = () => {
    if (isPaying) return 'Processando...';
    return conta.tipo === 'entrada' ? 'Marcar como Recebido' : 'Marcar como Pago';
  };

  const getButtonShortText = () => {
    if (isPaying) return 'Processando...';
    return conta.tipo === 'entrada' ? 'Recebido' : 'Pago';
  };

  const actionMenuItems = [
    {
      label: 'Editar',
      icon: <Edit className="mr-2 h-4 w-4" />,
      onClick: () => setEditDialogOpen(true),
    },
    {
      label: 'Duplicar',
      icon: <Copy className="mr-2 h-4 w-4" />,
      onClick: handleDuplicateRecord,
    },
    {
      label: 'Excluir',
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      onClick: () => setDeleteDialogOpen(true),
      className: 'text-red-600 focus:text-red-600',
    },
  ];

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className={cn(
            'group relative overflow-hidden rounded-lg bg-surface border border-l-4 transition-all duration-200 hover:shadow-md hover:border-primary/20 p-4',
            borderColorClass,
            conta.status === 'pago' && 'opacity-70'
          )}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

              {/* Action Menu Button - Positioned absolutely in top right corner */}
              <div className="absolute top-4 right-4 z-30">
                <ActionMenu items={actionMenuItems}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-surface-hover">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </ActionMenu>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:gap-4">
                {/* Main Content */}
                <div className="flex-1 space-y-2 mb-4 md:mb-0 pr-12">
                  <div className="flex items-start justify-between">
                    <h3 className={cn("font-bold text-base leading-tight flex-1", conta.status === 'pago' && 'line-through text-text-muted')}>
                      {conta.descricao || conta.categoria}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
                    <Badge variant="outline" className={statusProps.className}>
                      <statusProps.icon className="h-3 w-3 mr-1.5" />
                      {statusProps.text}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      {format(dueDate, 'dd/MM/yyyy')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1.5" />
                      {conta.categoria}
                    </Badge>
                    {conta.recorrente && (
                      <Badge variant="outline" className="text-xs">
                        <Repeat className="h-3 w-3 mr-1.5" />
                        Recorrente
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Value and Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4">
                  <div className={`text-lg font-bold tabular-nums ${conta.tipo === 'saida' ? 'text-destructive' : 'text-green-600 dark:text-green-500'}`}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.valor)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {conta.status !== 'pago' && (
                      <Button 
                        onClick={handleMarkAsPaid} 
                        disabled={isPaying} 
                        size="sm" 
                        className="w-28 hidden md:flex group/btn relative overflow-hidden bg-gradient-to-r from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] text-white hover:from-[hsl(var(--brand-900))] hover:to-[hsl(var(--brand-700))] hover:scale-105 hover:shadow-lg transition-all duration-200"
                      >
                        <span className="relative z-10 flex items-center">
                          <Check className="mr-2 h-4 w-4" />
                          {getButtonShortText()}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Action Button */}
              {conta.status !== 'pago' && (
                <div className="md:hidden pt-4 mt-4 border-t border-border/50">
                  <Button 
                    onClick={handleMarkAsPaid} 
                    disabled={isPaying} 
                    className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] text-white hover:from-[hsl(var(--brand-900))] hover:to-[hsl(var(--brand-700))] hover:scale-105 hover:shadow-lg transition-all duration-200"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Check className="h-4 w-4" />
                      <span>{getButtonText()}</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                  </Button>
                </div>
              )}
            </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          {actionMenuItems.map((item, index) => {
            const isLast = index === actionMenuItems.length - 1;
            const isDestructive = item.className?.includes('text-red') || item.className?.includes('text-destructive');

            return (
              <div key={index}>
                <ContextMenuItem
                  onClick={item.onClick}
                  className={`cursor-pointer ${item.className || ''}`}
                  disabled={item.disabled}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </ContextMenuItem>
                {!isLast && isDestructive && <ContextMenuSeparator />}
              </div>
            );
          })}
        </ContextMenuContent>
      </ContextMenu>

      <EditRecordDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} record={conta} onSuccess={() => { onStatusChange(); setEditDialogOpen(false); }} />
      <DeleteRecordDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} record={conta} onConfirm={handleDeleteRecord} />
    </>
  );
}