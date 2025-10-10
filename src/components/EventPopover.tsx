import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Copy, Trash2, Clock, MapPin, Calendar, Eye, EyeOff, Shield, ExternalLink, MoreHorizontal, Video, Flag } from 'lucide-react';
import { Event, EventFormData } from '@/hooks/useAgendaData';
import { useAgendaData } from '@/hooks/useAgendaData';
import { useAuth } from '@/contexts/AuthContext';
import { EventForm } from '@/components/EventForm';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Props {
  event: Event;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function EventPopover({ event, children, open: controlledOpen, onOpenChange }: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  
  // Usar estado controlado se fornecido, senão usar estado interno
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const { updateEvent, duplicateEvent, deleteEvent, refetch, calendars, createCalendar } = useAgendaData({
    view: 'day',
    startDate: new Date(event.start_ts),
    endDate: new Date(event.end_ts),
  });

  // Funções auxiliares para formatação
  const formatDateTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const formatTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "HH:mm", { locale: ptBR });
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  // Labels para prioridade, status e privacidade
  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };

  const statusLabels = {
    confirmed: 'Confirmado',
    tentative: 'Provisório',
    cancelled: 'Cancelado',
  };

  const privacyLabels = {
    default: 'Padrão',
    public: 'Público',
    private: 'Privado',
  };

  // Variantes para badges
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'tentative': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case 'public': return <Eye className="h-3 w-3" />;
      case 'private': return <EyeOff className="h-3 w-3" />;
      default: return <Shield className="h-3 w-3" />;
    }
  };

  const onEdit = (data: EventFormData) => {
    updateEvent.mutate(
      { id: event.id, updates: data },
      { onSuccess: () => setEditOpen(false) }
    );
  };

  const onDuplicate = () => {
    duplicateEvent.mutate(event, { 
      onSuccess: () => {
        setOpen(false);
        // Forçar fechamento do popover
        if (onOpenChange) {
          onOpenChange(false);
        }
      }
    });
  };

  const onDelete = () => {
    deleteEvent.mutate(event.id, { 
      onSuccess: () => {
        setOpen(false);
        // Forçar fechamento do popover
        if (onOpenChange) {
          onOpenChange(false);
        }
      }
    });
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-96 p-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            {/* Gradiente de fundo sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            
            <div className="relative space-y-6 p-6">
              {/* Cabeçalho com título e badges */}
              <motion.div 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl leading-tight text-foreground group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getPrivacyIcon(event.privacy)}
                  </div>
                </div>
                
                {/* Badges de prioridade e status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={getPriorityVariant(event.priority)} className="text-xs">
                    {priorityLabels[event.priority as keyof typeof priorityLabels]}
                  </Badge>
                  <Badge variant={getStatusVariant(event.status)} className="text-xs">
                    {statusLabels[event.status as keyof typeof statusLabels]}
                  </Badge>
                  {event.category && (
                    <Badge variant="outline" className="text-xs">
                      <Flag className="h-3 w-3 mr-1" />
                      {event.category}
                    </Badge>
                  )}
                </div>
              </motion.div>

              {/* Informações principais */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                {/* Data e hora */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    {event.all_day ? (
                      <div>
                        <div className="font-semibold text-sm">{formatDate(event.start_ts)}</div>
                        <div className="text-xs text-muted-foreground">Dia inteiro</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold text-sm">{formatDate(event.start_ts)}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(event.start_ts)} - {formatTime(event.end_ts)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Localização */}
                {event.location && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20">
                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Local</div>
                      <div className="text-xs text-muted-foreground">{event.location}</div>
                    </div>
                  </div>
                )}

                {/* Link de videoconferência */}
                {event.conference_url && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20">
                      <Video className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Videoconferência</div>
                      <a 
                        href={event.conference_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs break-all hover:underline transition-colors"
                      >
                        {event.conference_url}
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Ações */}
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50"
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { setEditOpen(true); setOpen(false); }}
                  className="text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all duration-200"
                >
                  <Pencil className="h-3 w-3 mr-1" /> Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onDuplicate}
                  className="text-xs hover:bg-secondary/10 hover:text-secondary-foreground hover:border-secondary/20 transition-all duration-200"
                >
                  <Copy className="h-3 w-3 mr-1" /> Duplicar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={onDelete}
                  className="text-xs hover:bg-destructive/90 transition-all duration-200"
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Excluir
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </PopoverContent>
      </Popover>

      {/* Modal de edição */}
      <AnimatePresence>
        {editOpen && (
          <EventForm
            open={editOpen}
            onOpenChange={setEditOpen}
            onSubmit={onEdit}
            eventToEdit={event}
            calendars={calendars}
            createCalendar={(data) => createCalendar.mutate(data)}
          />
        )}
      </AnimatePresence>
    </>
  );
}