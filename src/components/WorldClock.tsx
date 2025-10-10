import { useEffect, useState } from 'react';
import { Clock, Sun, Moon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { cn } from '@/lib/utils';

interface TimeZoneInfo {
  name: string;
  timezone: string;
  offset: string;
}

const DEFAULT_TIMEZONES: TimeZoneInfo[] = [
  { name: 'São Paulo', timezone: 'America/Sao_Paulo', offset: '' },
  { name: 'Nova York', timezone: 'America/New_York', offset: '' },
  { name: 'Londres', timezone: 'Europe/London', offset: '' },
  { name: 'Tóquio', timezone: 'Asia/Tokyo', offset: '' },
  { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', offset: '' },
  { name: 'Barcelona', timezone: 'Europe/Madrid', offset: '' },
];

function isDaylight(current: Date, tz: string) {
  const hour = parseInt(formatInTimeZone(current, tz, 'H'), 10);
  return hour >= 6 && hour < 18;
}

export function WorldClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full overflow-hidden border-brand-700/20 bg-gradient-to-br from-brand-900/10 to-brand-700/5 dark:from-brand-900/20 dark:to-brand-700/10">
      {/* Faixa de destaque */}
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-700/60 via-brand-500/50 to-brand-300/60" />
      <CardContent className="p-4 min-h-[480px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-brand-700/15 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-brand-700/25">
              <Clock className="h-4 w-4 text-brand-700" />
            </div>
            <h3 className="text-sm font-semibold">Fusos Horários</h3>
          </div>
          <span className="text-xs text-text-muted tabular-nums transition-opacity duration-300">
            {format(currentTime, 'HH:mm:ss')}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 flex-1">
          {DEFAULT_TIMEZONES.map((tz, idx) => {
            const time = formatInTimeZone(currentTime, tz.timezone, 'HH:mm:ss');
            const offset = formatInTimeZone(currentTime, tz.timezone, 'XXX'); // ex.: -03:00
            const daylight = isDaylight(currentTime, tz.timezone);

            return (
              <div
                key={tz.timezone}
                className={cn(
                  'flex items-center justify-between rounded-md px-3 py-2.5 bg-surface/60 border',
                  'hover:bg-surface-hover hover:scale-[1.02] hover:-translate-y-0.5',
                  'transition-all duration-300 animate-fade-in',
                  'hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20',
                  'group cursor-default'
                )}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className={cn(
                      'h-2.5 w-2.5 rounded-full transition-all duration-500',
                      daylight ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]',
                      'group-hover:scale-125'
                    )}
                    aria-label={daylight ? 'Dia' : 'Noite'}
                    title={daylight ? 'Dia' : 'Noite'}
                  />
                  <span className="font-medium text-sm truncate">{tz.name}</span>
                  <span
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full border transition-all duration-300',
                      daylight
                        ? 'bg-amber-400/10 text-amber-600 border-amber-400/30 dark:text-amber-400'
                        : 'bg-blue-400/10 text-blue-500 border-blue-400/30 dark:text-blue-400',
                      'group-hover:scale-105'
                    )}
                    title="Deslocamento UTC"
                  >
                    {offset}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono font-semibold tabular-nums text-sm">
                  {!daylight ? (
                    <Moon className="h-4 w-4 text-blue-400 transition-transform duration-500 group-hover:rotate-12" />
                  ) : (
                    <Sun className="h-4 w-4 text-amber-400 transition-transform duration-500 group-hover:rotate-90" />
                  )}
                  <span className="transition-opacity duration-300">{time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}