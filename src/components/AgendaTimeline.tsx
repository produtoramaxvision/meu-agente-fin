import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Event, Resource } from '@/hooks/useAgendaData';
import { format, isSameDay, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Circle,
  Zap,
  Star,
  Flame
} from 'lucide-react';

interface Props {
  startDate: Date;
  endDate: Date;
  events: Event[];
  resources: Resource[];
  isLoading?: boolean;
  onEventClick?: (evt: Event) => void;
}

// Configurações de prioridade com cores e ícones
const priorityConfig = {
  high: {
    color: 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300',
    icon: Flame,
    glow: 'shadow-red-500/20',
    accent: 'before:bg-red-500'
  },
  medium: {
    color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-300',
    icon: Star,
    glow: 'shadow-yellow-500/20',
    accent: 'before:bg-yellow-500'
  },
  low: {
    color: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300',
    icon: Circle,
    glow: 'shadow-blue-500/20',
    accent: 'before:bg-blue-500'
  }
};

// Configurações de status
const statusConfig = {
  confirmed: {
    color: 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300',
    icon: CheckCircle,
    glow: 'shadow-green-500/20'
  },
  tentative: {
    color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-300',
    icon: AlertCircle,
    glow: 'shadow-yellow-500/20'
  },
  cancelled: {
    color: 'bg-gray-500/10 border-gray-500/30 text-gray-700 dark:text-gray-300',
    icon: Circle,
    glow: 'shadow-gray-500/20'
  }
};

export default function AgendaTimeline({ startDate, endDate, events, resources, isLoading, onEventClick }: Props) {
  // Agrupar eventos por dia com ordenação cronológica
  const eventsByDay = useMemo(() => {
    const sortedEvents = events.sort((a, b) => new Date(a.start_ts).getTime() - new Date(b.start_ts).getTime());
    
    const grouped = sortedEvents.reduce((acc, event) => {
      const eventDate = new Date(event.start_ts);
      const dayKey = format(eventDate, 'yyyy-MM-dd');
      
      if (!acc[dayKey]) {
        acc[dayKey] = {
          date: eventDate,
          events: []
        };
      }
      
      acc[dayKey].events.push(event);
      return acc;
    }, {} as Record<string, { date: Date; events: Event[] }>);

    return Object.values(grouped).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [events]);

  // Calcular diferença de dias para efeitos visuais
  const getDayVariant = (date: Date) => {
    const today = new Date();
    const diffDays = differenceInDays(date, today);
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays === -1) return 'yesterday';
    if (diffDays > 0) return 'future';
    return 'past';
  };

  const getDayStyles = (variant: string) => {
    switch (variant) {
      case 'today':
        return {
          container: 'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20',
          header: 'text-primary font-bold',
          accent: 'bg-primary'
        };
      case 'tomorrow':
        return {
          container: 'bg-gradient-to-r from-blue-500/5 to-blue-500/10 border-blue-500/20',
          header: 'text-blue-600 dark:text-blue-400 font-semibold',
          accent: 'bg-blue-500'
        };
      case 'yesterday':
        return {
          container: 'bg-gradient-to-r from-gray-500/5 to-gray-500/10 border-gray-500/20',
          header: 'text-gray-600 dark:text-gray-400',
          accent: 'bg-gray-500'
        };
      case 'future':
        return {
          container: 'bg-gradient-to-r from-green-500/5 to-green-500/10 border-green-500/20',
          header: 'text-green-600 dark:text-green-400',
          accent: 'bg-green-500'
        };
      default:
        return {
          container: 'bg-gradient-to-r from-gray-500/5 to-gray-500/10 border-gray-500/20',
          header: 'text-gray-600 dark:text-gray-400',
          accent: 'bg-gray-500'
        };
    }
  };

  return (
    <Card className="p-2 sm:p-4 overflow-x-auto custom-scrollbar smooth-scrollbar">
      <div className="w-full space-y-4 sm:space-y-6">
        {eventsByDay.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Nenhum evento encontrado neste período</p>
          </motion.div>
        ) : (
          eventsByDay.map((dayGroup, dayIndex) => {
            const dayVariant = getDayVariant(dayGroup.date);
            const dayStyles = getDayStyles(dayVariant);
            
            return (
              <motion.div
                key={dayGroup.date.toISOString()}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: dayIndex * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className={cn(
                  "relative rounded-xl border-2 p-2 sm:p-4 transition-all duration-300 hover:shadow-lg",
                  dayStyles.container
                )}
              >
                {/* Linha de acento no topo */}
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-1 rounded-t-xl",
                  dayStyles.accent
                )} />
                
                {/* Header do dia */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: dayIndex * 0.1 + 0.2 }}
                  className="flex items-center justify-between mb-2 sm:mb-4"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className={cn(
                      "w-2 h-2 rounded-full flex-shrink-0",
                      dayStyles.accent
                    )} />
                    <h3 className={cn(
                      "text-sm sm:text-lg font-semibold truncate",
                      dayStyles.header
                    )}>
                      {format(dayGroup.date, 'EEEE, dd \'de\' MMMM')}
                    </h3>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {dayGroup.events.length} evento{dayGroup.events.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  {dayVariant === 'today' && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center gap-1 text-primary flex-shrink-0"
                    >
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs font-medium hidden sm:inline">Hoje</span>
                    </motion.div>
                  )}
                </motion.div>

                {/* Grid de eventos */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3">
                  <AnimatePresence>
                    {dayGroup.events.map((event, eventIndex) => {
                      const priority = priorityConfig[event.priority as keyof typeof priorityConfig] || priorityConfig.medium;
                      const status = statusConfig[event.status as keyof typeof statusConfig] || statusConfig.confirmed;
                      const PriorityIcon = priority.icon;
                      const StatusIcon = status.icon;
                      
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          transition={{
                            duration: 0.3,
                            delay: eventIndex * 0.05,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                          whileHover={{ 
                            y: -2, 
                            scale: 1.02,
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "group relative rounded-lg border p-2 sm:p-3 cursor-pointer transition-all duration-300",
                            "hover:shadow-md backdrop-blur-sm",
                            priority.color,
                            priority.glow,
                            "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                          )}
                          onClick={() => onEventClick?.(event)}
                        >
                          {/* Indicador de prioridade */}
                          <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                            <PriorityIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </div>
                          
                          {/* Indicador de status */}
                          <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
                            <StatusIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </div>

                          {/* Conteúdo do evento */}
                          <div className="pr-4 pl-4 sm:pr-6 sm:pl-6">
                            <h4 className="font-semibold text-xs sm:text-sm mb-1 truncate group-hover:text-primary transition-colors">
                              {event.title}
                            </h4>
                            
                            <div className="space-y-0.5 sm:space-y-1 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                <span className="truncate">
                                  {format(new Date(event.start_ts), 'HH:mm')} - {format(new Date(event.end_ts), 'HH:mm')}
                                </span>
                              </div>
                              
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              )}
                              
                              {event.category && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                  <span className="truncate">{event.category}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Efeito de brilho no hover */}
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </Card>
  );
}