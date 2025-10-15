"use client";

import { useState } from 'react';
import { useSupportTickets, SupportTicket } from '@/hooks/useSupportTickets';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Bug, 
  Lightbulb, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { sanitizeText } from '@/lib/sanitize';

interface SupportTicketListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeConfig = {
  support: {
    label: 'Suporte Geral',
    icon: MessageSquare,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  bug: {
    label: 'Bug',
    icon: Bug,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  suggestion: {
    label: 'Sugestão',
    icon: Lightbulb,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
};

const statusConfig = {
  open: {
    label: 'Aberto',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  in_progress: {
    label: 'Em Andamento',
    icon: Loader2,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  resolved: {
    label: 'Resolvido',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  closed: {
    label: 'Fechado',
    icon: XCircle,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
};

const priorityConfig = {
  low: {
    label: 'Baixa',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  medium: {
    label: 'Média',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  high: {
    label: 'Alta',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
};

function TicketCard({ ticket }: { ticket: SupportTicket }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const typeInfo = typeConfig[ticket.type];
  const statusInfo = statusConfig[ticket.status];
  const priorityInfo = priorityConfig[ticket.priority];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', typeInfo.bgColor)}>
              <typeInfo.icon className={cn('h-4 w-4', typeInfo.color)} />
            </div>
            <div>
              <CardTitle className="text-base">{ticket.subject}</CardTitle>
              <CardDescription className="text-sm">
                #{ticket.ticket_number}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn('text-xs', statusInfo.color, statusInfo.bgColor)}
            >
              <statusInfo.icon className="h-3 w-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Meta informações */}
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(ticket.created_at)}
            </div>
            <div className="flex items-center gap-1">
              <Badge 
                variant="outline" 
                className={cn('text-xs', priorityInfo.color, priorityInfo.bgColor)}
              >
                {priorityInfo.label}
              </Badge>
            </div>
          </div>

          {/* Descrição (truncada) */}
          <p className="text-sm text-text-muted line-clamp-2">
            {sanitizeText(ticket.description)}
          </p>

          {/* Botão para ver detalhes */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              {showDetails ? 'Ocultar' : 'Ver Detalhes'}
            </Button>
          </div>

          {/* Detalhes expandidos */}
          {showDetails && (
            <div className="border-t pt-3 space-y-3">
              <div>
                <h4 className="text-sm font-medium text-text mb-1">Descrição Completa:</h4>
                <p className="text-sm text-text-muted whitespace-pre-wrap">
                  {sanitizeText(ticket.description)}
                </p>
              </div>
              
              {ticket.admin_notes && (
                <div>
                  <h4 className="text-sm font-medium text-text mb-1">Resposta da Equipe:</h4>
                  <div className="bg-surface border rounded-lg p-3">
                    <p className="text-sm text-text-muted whitespace-pre-wrap">
                      {sanitizeText(ticket.admin_notes)}
                    </p>
                  </div>
                </div>
              )}

              <div className="text-xs text-text-muted">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Última atualização: {formatDate(ticket.updated_at)}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function SupportTicketList({ open, onOpenChange }: SupportTicketListProps) {
  const { 
    tickets, 
    isLoadingTickets, 
    ticketsError,
    ticketLimit 
  } = useSupportTickets();

  if (isLoadingTickets) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Meus Tickets de Suporte</DialogTitle>
            <DialogDescription>
              Carregando seus tickets de suporte...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (ticketsError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Meus Tickets de Suporte</DialogTitle>
            <DialogDescription>
              Erro ao carregar tickets
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-text-muted">
                {ticketsError.message}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Meus Tickets de Suporte</DialogTitle>
          <DialogDescription>
            Acompanhe o status dos seus tickets de suporte
          </DialogDescription>
        </DialogHeader>

        {/* Resumo */}
        {ticketLimit && (
          <div className="bg-surface border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-text">Resumo do Suporte</h3>
                <p className="text-sm text-text-muted">
                  {tickets.length} ticket(s) criado(s)
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-muted">Tickets disponíveis:</p>
                <Badge 
                  variant={ticketLimit.isUnlimited ? "secondary" : "default"}
                  className={ticketLimit.isUnlimited ? "bg-green-100 text-green-700" : ""}
                >
                  {ticketLimit.isUnlimited ? 'Ilimitado' : `${ticketLimit.remaining} de ${ticketLimit.limit}`}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Tickets */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <h3 className="font-medium text-text mb-2">Nenhum ticket encontrado</h3>
              <p className="text-sm text-text-muted">
                Você ainda não criou nenhum ticket de suporte.
              </p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>

        {/* Botão de fechar */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
