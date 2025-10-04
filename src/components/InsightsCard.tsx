import { FinancialInsight } from '@/hooks/useAlertsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';

interface InsightsCardProps {
  insights: FinancialInsight | null;
}

export function InsightsCard({ insights }: InsightsCardProps) {
  const renderInsight = (value: number | null, positiveIsGood: boolean) => {
    if (value === null || !isFinite(value)) {
      return <span className="text-text-muted">Dados insuficientes</span>;
    }
    const isPositive = value > 0;
    const isGood = positiveIsGood ? isPositive : !isPositive;
    const color = isGood ? 'text-green-500' : 'text-red-500';
    const Icon = isPositive ? TrendingUp : TrendingDown;

    return (
      <div className={`flex items-center gap-2 font-bold ${color}`}>
        <Icon className="h-5 w-5" />
        <span>{Math.abs(value).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Insights Financeiros
        </CardTitle>
        <p className="text-sm text-text-muted pt-1">Comparativo dos {insights?.period || 'últimos 30 dias'} com o período anterior.</p>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex justify-between items-center p-3 bg-surface-2 rounded-lg">
          <span className="font-medium">Variação de Gastos</span>
          {renderInsight(insights?.spendingChangePercent ?? null, false)}
        </div>
        <div className="flex justify-between items-center p-3 bg-surface-2 rounded-lg">
          <span className="font-medium">Variação de Receitas</span>
          {renderInsight(insights?.incomeChangePercent ?? null, true)}
        </div>
        {insights?.topSpendingIncrease && insights.topSpendingIncrease.change > 0 && (
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-800 rounded-lg text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <span className="font-bold">Atenção:</span> Seus gastos com <span className="font-bold">{insights.topSpendingIncrease.category}</span> aumentaram <span className="font-bold">{insights.topSpendingIncrease.change.toFixed(1)}%</span>.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}