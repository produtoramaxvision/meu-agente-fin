import { useAlertsData } from '@/hooks/useAlertsData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UpcomingBillCard } from '@/components/UpcomingBillCard';
import { InsightsCard } from '@/components/InsightsCard';
import { Bell, CheckCircle } from 'lucide-react';

export default function Alerts() {
  const { upcomingBills, insights, loading, refetch } = useAlertsData();

  return (
    <div className="py-4 sm:py-6 lg:py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-br from-text via-brand-700 to-brand-500 bg-clip-text text-transparent drop-shadow-sm">
          Alertas e Insights
        </h1>
        <p className="text-text-muted mt-2">
          Fique por dentro das suas finanças e receba dicas para economizar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Contas Próximas do Vencimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : upcomingBills.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBills.map((bill) => (
                    <UpcomingBillCard key={bill.id} bill={bill} onStatusChange={refetch} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium">Tudo em dia!</h3>
                  <p className="mt-1 text-sm text-text-muted">
                    Você não tem contas vencendo nos próximos 14 dias.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <InsightsCard insights={insights} />
          )}
        </div>
      </div>
    </div>
  );
}