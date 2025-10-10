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
        className="sm:max-w-4xl max-h-[85vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Suporte
          </DialogTitle>
          <DialogDescription>
            Precisa de ajuda? Crie um ticket ou acompanhe seus tickets existentes.
          </DialogDescription>
          
          {/* Informações de SLA */}
          <div className="bg-surface border rounded-lg p-3 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-text text-sm">Seu Plano de Suporte</h3>
                <p className="text-xs text-text-muted">{currentSLA.description}</p>
              </div>
              <div className="text-right">
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

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 flex-shrink-0" data-testid="support-tabs-list">
              <TabsTrigger 
                value="form" 
                className="flex items-center gap-2" 
                data-testid="new-ticket-tab"
                onClick={(e) => e.stopPropagation()}
              >
                <FileText className="h-4 w-4" />
                Novo Ticket
              </TabsTrigger>
              <TabsTrigger 
                value="tickets" 
                className="flex items-center gap-2" 
                data-testid="my-tickets-tab"
                onClick={(e) => e.stopPropagation()}
              >
                <List className="h-4 w-4" />
                Meus Tickets
              </TabsTrigger>
              <TabsTrigger 
                value="faq" 
                className="flex items-center gap-2" 
                data-testid="faq-tab"
                onClick={(e) => e.stopPropagation()}
              >
                <HelpCircle className="h-4 w-4" />
                FAQ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="form" className="flex-1 overflow-hidden mt-4">
              <div className="h-full overflow-y-auto pr-2">
                <SupportFormTab onSuccess={handleFormSuccess} />
              </div>
            </TabsContent>
            
            <TabsContent value="tickets" className="flex-1 overflow-hidden mt-4">
              <div className="h-full overflow-y-auto pr-2">
                <SupportTicketsTab />
              </div>
            </TabsContent>
            
            <TabsContent value="faq" className="flex-1 overflow-hidden mt-4">
              <div className="h-full overflow-y-auto pr-2">
                <SupportFAQ onSelectQuestion={handleFAQSelect} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
