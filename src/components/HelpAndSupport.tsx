"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageSquare, Bug, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

type HelpAndSupportProps = {
  collapsed?: boolean;
  mode: 'sidebar' | 'floatingAuth';
};

const supportOptions = [
  {
    label: 'Enviar mensagem para o Suporte',
    description: 'Obtenha ajuda com dúvidas e problemas comuns.',
    icon: MessageSquare,
    href: `mailto:suporte@meuagente.api.br?subject=${encodeURIComponent('Suporte Meu Agente')}`,
  },
  {
    label: 'Reportar Bug/Erro',
    description: 'Encontrou um problema? Nos avise para que possamos corrigi-lo.',
    icon: Bug,
    href: `mailto:suporte@meuagente.api.br?subject=${encodeURIComponent('Report de Bug - Meu Agente')}`,
  },
  {
    label: 'Sugestões',
    description: 'Tem ideias para melhorar o Meu Agente? Adoraríamos ouvir!',
    icon: Lightbulb,
    href: `mailto:suporte@meuagente.api.br?subject=${encodeURIComponent('Sugestão - Meu Agente')}`,
  },
];

export function HelpAndSupport({ collapsed = false, mode }: HelpAndSupportProps) {
  const [open, setOpen] = useState(false);

  const triggerButton = (
    <Button
      variant="ghost"
      className={cn(
        'group relative overflow-hidden flex w-full items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200',
        mode === 'sidebar' && 'px-3 py-2.5 text-[hsl(var(--sidebar-text-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-text))] hover:scale-105 hover:shadow-lg',
        mode === 'sidebar' && collapsed && 'justify-center',
        mode === 'floatingAuth' && 'fixed bottom-6 left-6 h-12 w-12 rounded-full bg-surface shadow-lg border hover:scale-110 hover:bg-surface-hover z-50'
      )}
      size={mode === 'floatingAuth' ? 'icon' : 'default'}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
      <HelpCircle className={cn('h-5 w-5 flex-shrink-0 relative z-10 transition-transform group-hover:scale-110', mode === 'floatingAuth' && 'text-text-muted')} />
      {mode === 'sidebar' && !collapsed && <span className="relative z-10">Ajuda</span>}
    </Button>
  );

  const trigger =
    mode === 'sidebar' && collapsed ? (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>{triggerButton}</DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Ajuda</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Precisa de ajuda?</DialogTitle>
          <DialogDescription className="pt-2">
            Se precisar de ajuda ou quiser relatar um problema, aqui estão algumas opções:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {supportOptions.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg border bg-surface p-4 transition-all duration-200 hover:bg-surface-hover hover:shadow-md hover:border-primary/30"
              onClick={() => setOpen(false)}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <option.icon className="h-7 w-7 flex-shrink-0 text-primary transition-transform group-hover:scale-110" />
                <div>
                  <h3 className="font-semibold text-base text-text">{option.label}</h3>
                  <p className="text-sm text-text-muted mt-1 px-2">{option.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}