import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CATEGORIAS_DESPESAS, CATEGORIAS_RECEITAS } from '@/constants/categories';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CurrencyInput } from '@/components/ui/currency-input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  tipo: z.enum(['entrada', 'saida']),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  valor: z.string().min(1, 'Valor é obrigatório'),
  descricao: z.string().optional(),
  data: z.date(),
  agendar: z.boolean().default(false), // This field now means "isPaid"
  recorrente: z.boolean().default(false),
  recorrencia_fim: z.date().optional(),
}).refine(data => !data.recorrente || data.recorrencia_fim, {
  message: "Data final da recorrência é obrigatória.",
  path: ["recorrencia_fim"],
});

interface FinanceRecordFormProps {
  userPhone: string;
  onSuccess?: () => void;
  recordToEdit?: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FinanceRecordForm({ userPhone, onSuccess, recordToEdit, open: controlledOpen, onOpenChange }: FinanceRecordFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const open = isControlled ? controlledOpen! : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: 'saida',
      categoria: '',
      valor: '',
      descricao: '',
      data: new Date(),
      agendar: false,
      recorrente: false,
    },
  });

  useEffect(() => {
    if (recordToEdit) {
      form.reset({
        tipo: recordToEdit.tipo,
        categoria: recordToEdit.categoria,
        valor: recordToEdit.valor.toFixed(2).replace('.', ','),
        descricao: recordToEdit.descricao || '',
        data: new Date(recordToEdit.data_vencimento || recordToEdit.data_hora),
        agendar: recordToEdit.status === 'pago', // 'agendar' toggle is ON if status is 'pago'
        recorrente: recordToEdit.recorrente || false,
        recorrencia_fim: recordToEdit.recorrencia_fim ? new Date(recordToEdit.recorrencia_fim) : undefined,
      });
    } else if (open === false) {
      form.reset({
        tipo: 'saida',
        categoria: '',
        valor: '',
        descricao: '',
        data: new Date(),
        agendar: false,
        recorrente: false,
      });
    }
  }, [recordToEdit, open, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const valorNumerico = parseFloat(
        values.valor.replace(/\./g, '').replace(',', '.')
      );

      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        throw new Error('Valor inválido');
      }

      const isPaid = values.agendar;

      const payload = {
        phone: userPhone,
        tipo: values.tipo,
        categoria: values.categoria,
        valor: valorNumerico,
        descricao: values.descricao || null,
        recorrente: values.recorrente,
        recorrencia_fim: values.recorrente ? values.recorrencia_fim?.toISOString().split('T')[0] : null,
        
        // Corrected logic as per user request
        status: isPaid ? 'pago' : 'pendente',
        data_vencimento: isPaid ? null : values.data.toISOString(),
        data_hora: isPaid ? values.data.toISOString() : new Date().toISOString(),
      };

      let error;
      
      if (recordToEdit) {
        const { phone, ...updatePayload } = payload;
        ({ error } = await supabase
          .from('financeiro_registros')
          .update(updatePayload)
          .eq('id', recordToEdit.id));
      } else {
        ({ error } = await supabase
          .from('financeiro_registros')
          .insert(payload));
      }

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: recordToEdit 
          ? 'Registro atualizado com sucesso!' 
          : 'Registro financeiro adicionado com sucesso!',
      });

      form.reset();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Erro',
        description: `Erro ao ${recordToEdit ? 'atualizar' : 'adicionar'} o registro.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPaid = form.watch('agendar');
  const recorrente = form.watch('recorrente');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!recordToEdit && !isControlled && (
        <DialogTrigger asChild>
          <Button className="w-full group relative overflow-hidden">
            <span className="relative z-10">Adicionar Registro</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{recordToEdit ? 'Editar Registro' : 'Novo Registro'}</DialogTitle>
          <DialogDescription>
            {recordToEdit 
              ? 'Modifique os dados do registro.' 
              : 'Adicione uma transação ou agende uma conta.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2 rounded-lg border p-4">
              <FormField
                control={form.control}
                name="agendar"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <FormLabel>Marcar como pago/recebido?</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <p className="text-sm text-text-muted">
                {isPaid ? 'A transação será registrada como paga/recebida.' : 'A conta será criada como pendente (a pagar/receber).'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="saida">Saída</SelectItem>
                        <SelectItem value="entrada">Entrada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        placeholder="0,00"
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} key={form.watch('tipo')}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(form.watch('tipo') === 'entrada' ? CATEGORIAS_RECEITAS : CATEGORIAS_DESPESAS).map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{isPaid ? 'Data do Pagamento/Recebimento' : 'Data de Vencimento'}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn('pl-3 text-left font-normal', !field.value && 'text-text-muted')}>
                          {field.value ? format(field.value, 'PPP', { locale: ptBR }) : <span>Selecione</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detalhes adicionais..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2 rounded-lg border p-4">
              <FormField
                control={form.control}
                name="recorrente"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <FormLabel>É recorrente?</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {recorrente && (
                <FormField
                  control={form.control}
                  name="recorrencia_fim"
                  render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                      <FormLabel>Data final da recorrência</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className={cn('pl-3 text-left font-normal', !field.value && 'text-text-muted')}>
                              {field.value ? format(field.value, 'PPP', { locale: ptBR }) : <span>Selecione</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}