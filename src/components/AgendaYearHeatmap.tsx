import { useMemo } from 'react';
import { startOfYear, endOfYear, eachDayOfInterval, getMonth, format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Event } from '@/hooks/useAgendaData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  yearDate: Date;
  events: Event[];
  isLoading?: boolean;
}

export default function AgendaYearHeatmap({ yearDate, events }: Props) {
  const yearStart = startOfYear(yearDate);
  const yearEnd = endOfYear(yearDate);

  const days = useMemo(() => eachDayOfInterval({ start: yearStart, end: yearEnd }), [yearStart, yearEnd]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of days) {
      map.set(d.toISOString().slice(0,10), 0);
    }
    for (const e of events) {
      const key = new Date(e.start_ts).toISOString().slice(0,10);
      map.set(key, (map.get(key) || 0) + 1);
    }
    return map;
  }, [days, events]);

  const colorFor = (n: number) => {
    if (n === 0) return 'bg-muted';
    if (n <= 2) return 'bg-green-200 dark:bg-green-900';
    if (n <= 5) return 'bg-green-400 dark:bg-green-700';
    return 'bg-green-600 dark:bg-green-600/60';
  };

  return (
    <Card className="p-4 custom-scrollbar smooth-scrollbar overflow-y-auto max-h-[500px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-center">
          {format(yearDate, 'yyyy')} - Visão Anual
        </h3>
        <p className="text-sm text-text-muted text-center mt-1">
          Heatmap de eventos por dia do ano
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, m) => {
          const monthDays = days.filter(d => getMonth(d) === m);
          return (
            <div key={m} className="border rounded-lg p-3">
              <div className="text-sm font-semibold mb-2">
                {format(new Date(yearDate.getFullYear(), m, 1), 'MMMM')}
              </div>
              <div className="grid grid-cols-7 gap-1">
                <TooltipProvider>
                  {monthDays.map(d => {
                    const key = d.toISOString().slice(0,10);
                    const n = counts.get(key) || 0;
                    return (
                      <Tooltip key={key}>
                        <TooltipTrigger asChild>
                          <div className={`h-5 w-5 rounded-sm ${colorFor(n)}`} aria-label={`${n} evento(s) em ${format(d, 'dd/MM/yyyy')}`} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">{format(d, 'dd/MM/yyyy')} — {n} evento(s)</div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}