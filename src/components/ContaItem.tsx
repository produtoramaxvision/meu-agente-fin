import { FinancialRecord } from '@/hooks/useFinancialData';
import { differenceInDays, format, isPast, isToday } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, Calendar, Tag, Repeat, Check, Edit, Trash2, Copy } from 'lucide-react';
import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { EditRecordDialog } from './EditRecordDialog';
import { DeleteRecordDialog } from './DeleteRecordDialog';

interface ContaItemProps {
  conta: FinancialRecord;
  onStatusChange: () => void;
}

export function ContaItem({ conta, onStatusChange }: ContaItemProps) {
  const [isPaying, setIsPaying] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const dueDate = new Date(conta.data_vencimento || new Date());
  const daysRemaining = differenceInDays(dueDate, new Date());
  const isOverdue = isPast(dueDate) && !isToday(dueDate);
  const isDueToday = isToday(dueDate);

  const getStatusProps = () => {
    if (isOverdue) {
      return {
        text: `Venceu há ${-daysRemaining} dia(s)`,
        textColor: 'text-red-500',
        bgColor: 'bg-red-500',
      };
    }
    if (isDueToday) {
      return {
        text: 'Vence hoje',
        textColor: 'text-yellow-500 font-bold',
        bgColor: 'bg-yellow-500',
      };
    }
    if (daysRemaining <= 2) {
      return {
        text: `Vence em ${daysRemaining} dia(s)`,
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-500',
      };
    }
    return {
      text: `Vence em ${daysRemaining} dia(s)`,
      textColor: 'text-text-muted',
      bgColor: 'bg-gray-400 dark:bg-gray-600',
    };
  };

  const statusProps = getStatusProps();

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

      toast({
        title: 'Sucesso!',
        description: conta.tipo === 'entrada' 
          ? 'Conta marcada como recebida.' 
          : 'Conta marcada como paga.',
      });
      onStatusChange();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a conta.',
        variant: 'destructive',
      });
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

      toast({
        title: "Registro excluído",
        description: "A conta foi removida com sucesso.",
      });

      onStatusChange();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a conta. Tente novamente.",
        variant: "destructive",
      });
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

      toast({
        title: "Registro duplicado",
        description: "Uma cópia da conta pendente foi criada.",
      });

      onStatusChange();
    } catch (error) {
      console.error('Erro ao duplicar:', error);
      toast({
        title: "Erro ao duplicar",
        description: "Não foi possível duplicar a conta. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Determinar o texto do botão baseado no tipo da conta
  const getButtonText = () => {
    if (isPaying) {
      return 'Processando...';
    }
    return conta.tipo === 'entrada' ? 'Marcar como Recebido' : 'Marcar como Pago';
  };

  const getButtonTextShort = () => {
    if (isPaying) {
      return '...';
    }
    return conta.tipo === 'entrada' ? 'Recebido' : 'Pago';
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card className="group relative p-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] cursor-context-menu">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
            
            <div className="flex items-stretch">
              {/* Status Color Bar */}
              <div className={`w-1.5 flex-shrink-0 ${statusProps.bgColor} transition-all duration-300 group-hover:w-2`} />
              
              {/* Main Content */}
              <div className="flex-grow p-5 sm:p-6">
                <div className="space-y-4">
                  {/* Header: Title + Value */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-xl text-foreground leading-tight">
                        {conta.descricao || conta.categoria}
                      </h3>
                      
                      {conta.recorrente && (
                        <Badge variant="outline" className="inline-flex items-center gap-1.5 text-xs font-medium">
                          <Repeat className="h-3 w-3" />
                          Recorrente
                        </Badge>
                      )}
                    </div>
                    
                    <div className={`text-2xl font-bold tabular-nums ${conta.tipo === 'saida' ? 'text-destructive' : 'text-green-600 dark:text-green-500'}`}>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(conta.valor)}
                    </div>
                  </div>
                  
                  {/* Details Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">{format(dueDate, 'dd/MM/yyyy')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className={`font-semibold ${statusProps.textColor}`}>{statusProps.text}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Tag className="h-4 w-4" />
                      <span>{conta.categoria}</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="pt-2">
                    <Button 
                      onClick={handleMarkAsPaid} 
                      disabled={isPaying} 
                      className="w-full sm:w-auto group/btn relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Check className="h-4 w-4" />
                        <span>{getButtonText()}</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </ContextMenuTrigger>
        
        <ContextMenuContent className="w-48">
          <ContextMenuItem
            onClick={() => setEditDialogOpen(true)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Editar</span>
          </ContextMenuItem>
          <ContextMenuItem
            onClick={handleDuplicateRecord}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" />
            <span>Duplicar</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Excluir</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <EditRecordDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        record={conta}
        onSuccess={() => {
          onStatusChange();
          setEditDialogOpen(false);
        }}
      />

      <DeleteRecordDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        record={conta}
        onConfirm={handleDeleteRecord}
      />
    </>
  );
}