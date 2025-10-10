import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Task, TaskFormData } from '@/hooks/useTasksData';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const formSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  description: z.string().max(1000, 'Descrição muito longa').optional(),
  due_date: z.date().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.string().max(50, 'Categoria muito longa').optional(),
});

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskFormData) => void;
  taskToEdit?: Task | null;
  isSubmitting?: boolean;
}

export function TaskForm({ open, onOpenChange, onSubmit, taskToEdit, isSubmitting = false }: TaskFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      due_date: null,
      priority: 'medium',
      category: '',
    },
  });

  useEffect(() => {
    if (taskToEdit) {
      form.reset({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        due_date: taskToEdit.due_date ? new Date(taskToEdit.due_date) : null,
        priority: taskToEdit.priority,
        category: taskToEdit.category || '',
      });
    } else if (!open) {
      /**
       * BUG FIX - TestSprite TC008
       * Problema: Formulário não era resetado corretamente após criação de tarefa
       * Solução: Reset completo do formulário ao fechar modal
       * Data: 2025-01-06
       * Validado: sim
       */
      form.reset({
        title: '',
        description: '',
        due_date: null,
        priority: 'medium',
        category: '',
      });
    }
  }, [taskToEdit, open, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    /**
     * BUG FIX - TestSprite TC008
     * Problema: Formulário não era resetado após submit bem-sucedido
     * Solução: Reset do formulário após envio dos dados
     * Data: 2025-01-06
     * Validado: sim
     */
    onSubmit({
      title: values.title,
      description: values.description,
      due_date: values.due_date || null,
      priority: values.priority,
      category: values.category,
    });
    
    // Reset do formulário após envio
    form.reset({
      title: '',
      description: '',
      due_date: null,
      priority: 'medium',
      category: '',
    });
  };

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
          <DialogDescription>
            {taskToEdit ? 'Modifique os dados da tarefa.' : 'Adicione uma nova tarefa à sua lista.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Reunião com cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detalhes adicionais..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-50">
                        <SelectItem value="low">{priorityLabels.low}</SelectItem>
                        <SelectItem value="medium">{priorityLabels.medium}</SelectItem>
                        <SelectItem value="high">{priorityLabels.high}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Trabalho" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Vencimento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value && 'text-text-muted'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="group relative overflow-hidden bg-gradient-to-br from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <span className="relative z-10">{isSubmitting ? 'Salvando...' : 'Salvar'}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}