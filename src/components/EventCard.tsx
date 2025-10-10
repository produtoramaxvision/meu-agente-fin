import * as React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Calendar, Users, Video, Flag, Eye, EyeOff, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/hooks/useAgendaData';

export interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact' | 'detailed';
  onClick?: () => void;
  onDoubleClick?: () => void;
  className?: string;
  showCalendarColor?: boolean;
  calendarColor?: string;
}

const EventCard = React.forwardRef<HTMLDivElement, EventCardProps>(
  ({ 
    event, 
    variant = 'default', 
    onClick, 
    onDoubleClick, 
    className,
    showCalendarColor = true,
    calendarColor
  }, ref) => {
    // Formatação de data e hora
    const startDate = new Date(event.start_ts);
    const endDate = new Date(event.end_ts);
    
    const formatTime = (date: Date) => format(date, 'HH:mm', { locale: ptBR });
    const formatDate = (date: Date) => format(date, 'dd/MM', { locale: ptBR });
    const formatDateTime = (date: Date) => format(date, 'dd/MM HH:mm', { locale: ptBR });

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

    // Cores para badges baseadas na prioridade
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

    // Variantes de layout
    if (variant === 'compact') {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            mass: 0.8 
          }}
          whileHover={{ 
            scale: 1.02, 
            y: -2,
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.98,
            transition: { duration: 0.1 }
          }}
          className={cn(
            "group relative overflow-hidden rounded-lg border bg-card/50 backdrop-blur-sm",
            "hover:bg-card hover:shadow-md hover:shadow-primary/5",
            "transition-all duration-200 cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          tabIndex={0}
          role="button"
          aria-label={`Evento: ${event.title}`}
        >
          {/* Indicador de cor do calendário */}
          {showCalendarColor && calendarColor && (
            <motion.div 
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: calendarColor }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                delay: 0.1 
              }}
            />
          )}

          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <motion.h3 
                  className="font-semibold text-sm truncate group-hover:text-primary transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {event.title}
                </motion.h3>
                <motion.div 
                  className="flex items-center gap-1 mt-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  </motion.div>
                  <span className="text-xs text-muted-foreground">
                    {event.all_day ? formatDate(startDate) : `${formatTime(startDate)} - ${formatTime(endDate)}`}
                  </span>
                </motion.div>
              </div>
              
              <motion.div 
                className="flex items-center gap-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {getPrivacyIcon(event.privacy)}
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge variant={getPriorityVariant(event.priority)} className="text-xs">
                    {priorityLabels[event.priority as keyof typeof priorityLabels]}
                  </Badge>
                </motion.div>
              </motion.div>
            </div>

            {event.location && (
              <motion.div 
                className="flex items-center gap-1 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                </motion.div>
                <span className="text-xs text-muted-foreground truncate">{event.location}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      );
    }

    if (variant === 'detailed') {
      return (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className={cn(
            "group relative overflow-hidden rounded-xl border bg-card/80 backdrop-blur-sm",
            "hover:bg-card hover:shadow-lg hover:shadow-primary/10",
            "transition-all duration-300 cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className
          )}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          tabIndex={0}
          role="button"
          aria-label={`Evento detalhado: ${event.title}`}
        >
          {/* Gradiente de fundo baseado na cor do calendário */}
          {showCalendarColor && calendarColor && (
            <div 
              className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
              style={{ background: `linear-gradient(135deg, ${calendarColor}20, transparent)` }}
            />
          )}

          <div className="relative p-4">
            {/* Header com título e badges */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {getPrivacyIcon(event.privacy)}
                <Badge variant={getPriorityVariant(event.priority)} className="text-xs">
                  {priorityLabels[event.priority as keyof typeof priorityLabels]}
                </Badge>
                <Badge variant={getStatusVariant(event.status)} className="text-xs">
                  {statusLabels[event.status as keyof typeof statusLabels]}
                </Badge>
              </div>
            </div>

            {/* Informações principais */}
            <div className="space-y-3">
              {/* Data e hora */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <div className="font-medium">
                    {event.all_day ? formatDate(startDate) : formatDateTime(startDate)}
                  </div>
                  {!event.all_day && (
                    <div className="text-xs text-muted-foreground">
                      até {formatDateTime(endDate)}
                    </div>
                  )}
                </div>
              </div>

              {/* Localização */}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{event.location}</span>
                </div>
              )}

              {/* Link de videoconferência */}
              {event.conference_url && (
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    Link da reunião
                  </span>
                </div>
              )}

              {/* Categoria */}
              {event.category && (
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {event.category}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    // Variante padrão
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative overflow-hidden rounded-lg border bg-card/60 backdrop-blur-sm",
          "hover:bg-card hover:shadow-md hover:shadow-primary/5",
          "transition-all duration-200 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        tabIndex={0}
        role="button"
        aria-label={`Evento: ${event.title}`}
      >
        {/* Indicador de cor do calendário */}
        {showCalendarColor && calendarColor && (
          <div 
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg group-hover:w-2 transition-all duration-200"
            style={{ backgroundColor: calendarColor }}
          />
        )}

        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                {event.title}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {event.all_day ? formatDate(startDate) : `${formatTime(startDate)} - ${formatTime(endDate)}`}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {getPrivacyIcon(event.privacy)}
              <Badge variant={getPriorityVariant(event.priority)} className="text-xs">
                {priorityLabels[event.priority as keyof typeof priorityLabels]}
              </Badge>
            </div>
          </div>

          {event.location && (
            <div className="flex items-center gap-1 mt-2">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground truncate">{event.location}</span>
            </div>
          )}

          {event.category && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {event.category}
              </Badge>
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

EventCard.displayName = "EventCard";

export { EventCard };
