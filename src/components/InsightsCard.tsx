import { FinancialInsight } from '@/hooks/useAlertsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';

interface InsightsCardProps {
  insights: FinancialInsight[];
}

export function InsightsCard({ insights }: InsightsCardProps) {
  const insight = insights[0]; // Pegar o primeiro insight
  
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

  if (!insight) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Insights Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-center py-8">
            <p className="text-text-muted">Dados insuficientes para gerar insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Insights Financeiros
        </CardTitle>
        <p className="text-sm text-text-muted pt-1">Comparativo dos {insight.period || 'últimos 30 dias'} com o período anterior.</p>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex justify-between items-center p-3 bg-surface-2 rounded-lg">
          <span className="font-medium">Variação de Gastos</span>
          {renderInsight(insight.spendingChangePercent ?? null, false)}
        </div>
        <div className="flex justify-between items-center p-3 bg-surface-2 rounded-lg">
          <span className="font-medium">Variação de Receitas</span>
          {renderInsight(insight.incomeChangePercent ?? null, true)}
        </div>
        {insight.topSpendingIncrease && insight.topSpendingIncrease.change > 0 && (
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-800 rounded-lg text-center">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <span className="font-bold">Atenção:</span> Seus gastos com <span className="font-bold">{insight.topSpendingIncrease.category}</span> aumentaram <span className="font-bold">{insight.topSpendingIncrease.change.toFixed(1)}%</span>.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}