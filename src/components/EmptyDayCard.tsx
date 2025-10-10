import { CalendarDays, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyDayCardProps {
  date: Date;
  onCreateEvent?: () => void;
}

export function EmptyDayCard({ date, onCreateEvent }: EmptyDayCardProps) {
  return (
    <Card className="group relative overflow-hidden border-dashed border-2 border-border/40 bg-card/30 hover:bg-card/50 transition-all duration-200 hover:border-border/60 hover:scale-[1.02]">
      <div className="p-4 flex flex-col items-center justify-center min-h-[120px] text-center">
        {/* Ícone do calendário */}
        <div className="mb-3 p-3 rounded-full bg-muted/50 group-hover:bg-muted/70 transition-colors duration-200">
          <CalendarDays className="h-6 w-6 text-muted-foreground group-hover:text-foreground/70 transition-colors duration-200" />
        </div>
        
        {/* Texto principal */}
        <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground/80 transition-colors duration-200 mb-1">
          Sem eventos
        </h3>
        
        {/* Texto secundário */}
        <p className="text-xs text-muted-foreground/70 group-hover:text-muted-foreground/80 transition-colors duration-200 mb-3">
          Este dia está livre
        </p>
        
        {/* Botão de ação */}
        {onCreateEvent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCreateEvent}
            className="h-8 px-3 text-xs bg-transparent hover:bg-primary/10 hover:text-primary transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <Plus className="h-3 w-3 mr-1" />
            Adicionar evento
          </Button>
        )}
      </div>
      
      {/* Efeito de brilho sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
}
