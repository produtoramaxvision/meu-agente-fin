import { useAlertsData } from '@/hooks/useAlertsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { differenceInDays, isToday } from 'date-fns';
import { Button } from './ui/button';
import { sanitizeText } from '@/lib/sanitize';

export function DashboardUpcomingBills() {
  const { upcomingBills, loading } = useAlertsData();

  const billsToShow = upcomingBills.slice(0, 3);

  const getDueDateInfo = (dueDate: Date) => {
    const daysRemaining = differenceInDays(dueDate, new Date());
    if (daysRemaining < 0) return { text: `Venceu há ${-daysRemaining} d`, color: 'text-red-500' };
    if (isToday(dueDate)) return { text: 'Vence hoje', color: 'text-yellow-500 font-bold' };
    if (daysRemaining === 1) return { text: 'Vence amanhã', color: 'text-yellow-600' };
    return { text: `Vence em ${daysRemaining} d`, color: 'text-text-muted' };
  };

  return (
    <Card className="group relative overflow-hidden h-full flex flex-col hover:scale-105 transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-2">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none z-10" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-text-muted">Contas a Vencer</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow flex flex-col">
        <div className="flex-grow space-y-2">
          {loading ? (
            <>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </>
          ) : billsToShow.length > 0 ? (
            billsToShow.map(bill => {
              const dueDate = new Date(bill.data_vencimento || new Date());
              const { text, color } = getDueDateInfo(dueDate);
              return (
                <div key={bill.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold truncate max-w-[120px]">
                      {sanitizeText(bill.descricao) || sanitizeText(bill.categoria)}
                    </p>
                    <p className={`text-xs ${color}`}>{text}</p>
                  </div>
                  <p className="font-bold text-red-500">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bill.valor)}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-text-muted text-center py-4">Nenhuma conta próxima do vencimento.</p>
            </div>
          )}
        </div>
        <Button asChild variant="ghost" size="sm" className="w-full mt-auto">
          <Link to="/alertas">
            Ver todos os alertas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}