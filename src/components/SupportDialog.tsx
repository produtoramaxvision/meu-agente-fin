"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { SupportFormTab, SupportTicketsTab } from './SupportTabs';
import { SupportFAQ } from './SupportFAQ';
import { useSupportTickets, getSupportSLA } from '@/hooks/useSupportTickets';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { FileText, List, HelpCircle } from 'lucide-react';

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportDialog({ open, onOpenChange }: SupportDialogProps) {
  const [activeTab, setActiveTab] = useState('form');
  const { cliente } = useAuth();
  const { supportPlanInfo } = useSupportTickets();

  // Obter SLA do plano atual
  const currentSLA = cliente?.plan_id ? getSupportSLA(cliente.plan_id) : getSupportSLA('free');

  const handleFormSuccess = (ticketNumber: string) => {
    console.log('Ticket criado:', ticketNumber);
    // Mudar para a aba de tickets após criar um ticket
    setActiveTab('tickets');
  };

  const handleFAQSelect = (question: string) => {
    console.log('Pergunta selecionada:', question);
    // Mudar para a aba de formulário com a pergunta pré-preenchida
    setActiveTab('form');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] sm:h-[90vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header fixo */}
        <DialogHeader className="flex-shrink-0 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Suporte
          </DialogTitle>
          <DialogDescription>
            Precisa de ajuda? Crie um ticket ou acompanhe seus tickets existentes.
          </DialogDescription>
          
          {/* Informações de SLA */}
          <div className="bg-surface border rounded-lg p-3 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-medium text-text text-sm">Seu Plano de Suporte</h3>
                <p className="text-xs text-text-muted">{currentSLA.description}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-text-muted">Tempo de resposta:</p>
                <Badge 
                  variant={currentSLA.priority === 'critical' ? 'destructive' : 
                          currentSLA.priority === 'high' ? 'default' : 
                          currentSLA.priority === 'medium' ? 'secondary' : 'outline'}
                  className="text-xs"
                  data-testid="plan-badge"
                >
                  {currentSLA.responseTime}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Conteúdo principal */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tabs fixas */}
            <TabsList className="grid w-full grid-cols-3 mt-4" data-testid="support-tabs-list">
              <TabsTrigger 
                value="form" 
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" 
                data-testid="new-ticket-tab"
                onClick={(e) => e.stopPropagation()}
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Novo Ticket</span>
                <span className="sm:hidden">Novo</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tickets" 
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" 
                data-testid="my-tickets-tab"
                onClick={(e) => e.stopPropagation()}
              >
                <List className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Meus Tickets</span>
                <span className="sm:hidden">Tickets</span>
              </TabsTrigger>
              <TabsTrigger 
                value="faq" 
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" 
                data-testid="faq-tab"
                onClick={(e) => e.stopPropagation()}
              >
                <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                FAQ
              </TabsTrigger>
            </TabsList>
            
            {/* Conteúdo das tabs */}
            <TabsContent value="form" className="space-y-4 mt-6">
              <SupportFormTab onSuccess={handleFormSuccess} />
            </TabsContent>
            
            <TabsContent value="tickets" className="space-y-4 mt-6">
              <SupportTicketsTab />
            </TabsContent>
            
            <TabsContent value="faq" className="space-y-4 mt-6">
              <SupportFAQ onSelectQuestion={handleFAQSelect} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
