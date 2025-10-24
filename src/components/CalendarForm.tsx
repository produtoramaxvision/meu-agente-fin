import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar as CalendarIcon, Palette } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Calendar } from '@/hooks/useOptimizedAgendaData';

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  color: z.string().min(1, 'Cor é obrigatória'),
  timezone: z.string().min(1, 'Fuso horário é obrigatório'),
  is_primary: z.boolean(),
});

interface CalendarFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Calendar, 'id' | 'phone' | 'created_at' | 'updated_at'>) => void;
  isSubmitting?: boolean;
}

const COLOR_SWATCHES = [
  '#FF6B6B', '#FD7E14', '#FAB005', '#40C057', '#15AABF', 
  '#228BE6', '#4C6EF5', '#BE4BDB', '#F06595', '#868E96'
];

export function CalendarForm({ open, onOpenChange, onSubmit, isSubmitting = false }: CalendarFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      color: COLOR_SWATCHES[0],
      timezone: 'America/Sao_Paulo',
      is_primary: false,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      name: values.name,
      color: values.color,
      timezone: values.timezone,
      is_primary: values.is_primary,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Agenda</DialogTitle>
          <DialogDescription>
            Crie uma nova agenda para organizar seus eventos.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Agenda</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                      <Input placeholder="Ex: Trabalho" className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Palette className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                        <Input value={field.value} onChange={field.onChange} className="pl-9" />
                      </div>
                      <div
                        className="h-9 w-9 rounded-md border"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {COLOR_SWATCHES.map(color => (
                      <button
                        key={color}
                        type="button"
                        className={cn(
                          'h-6 w-6 rounded-full border transition-transform hover:scale-110',
                          field.value === color && 'ring-2 ring-offset-2 ring-primary'
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => field.onChange(color)}
                      />
                    ))}
                  </div>
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
                className="group relative overflow-hidden bg-gradient-to-br from-[hsl(var(--brand-900))] to-[hsl(var(--brand-700))] text-white"
              >
                <span className="relative z-10">{isSubmitting ? 'Criando...' : 'Criar Agenda'}</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}