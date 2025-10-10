import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, CheckCircle, TrendingUp, AlertTriangle, Calendar, DollarSign } from 'lucide-react';
import { useAlertsData } from '@/hooks/useAlertsData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function AlertsSection() {
  const { loading, upcomingBills, overdueBills, monthlySummary, categorySpending, insights } = useAlertsData();

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '0ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-text-muted">Contas Vencendo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:drop-shadow-lg" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">{upcomingBills.length}</div>
            <p className="text-xs text-text-muted">
              Próximos 14 dias
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-text-muted">Contas Vencidas</CardTitle>
            <Bell className="h-4 w-4 text-red-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:drop-shadow-lg" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-red-600">{overdueBills.length}</div>
            <p className="text-xs text-text-muted">
              Requer atenção
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-text-muted">Saldo Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:drop-shadow-lg" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-2xl font-bold ${monthlySummary.balance >= 0 ? 'text-[#39a85b]' : 'text-[#a93838]'}`}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlySummary.balance)}
            </div>
            <p className="text-xs text-text-muted">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '300ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-text-muted">Status Geral</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:drop-shadow-lg" />
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold">
              {upcomingBills.length === 0 && overdueBills.length === 0 ? 'Em Dia' : 'Atenção'}
            </div>
            <p className="text-xs text-text-muted">
              {upcomingBills.length === 0 && overdueBills.length === 0 ? 'Tudo controlado' : 'Requer atenção'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contas Próximas do Vencimento */}
      <Card className="group relative overflow-hidden hover:scale-[1.01] transition-all duration-200 animate-fade-in hover:shadow-lg hover:shadow-primary/5 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '0ms' }}>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            Contas Próximas do Vencimento
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : upcomingBills.length > 0 ? (
            <div className="space-y-4">
              {upcomingBills.map((bill, index) => (
                <div 
                  key={bill.id} 
                  className="animate-fade-in group/item relative overflow-hidden hover:scale-[1.02] transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full group-hover/item:translate-x-full before:transition-transform before:duration-700 pointer-events-none" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="p-4 relative z-10">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{bill.descricao || 'Conta'}</h4>
                        <p className="text-sm text-text-muted">
                          Vencimento: {bill.data_vencimento ? format(new Date(bill.data_vencimento), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}
                        </p>
                        <p className="text-xs text-text-muted">{bill.categoria || 'Categoria'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#a93838]">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bill.valor)}
                        </p>
                        <p className="text-sm text-text-muted">{bill.status || 'Aberta'}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Tudo em dia!</h3>
              <p className="text-text-muted">
                Você não tem contas vencendo nos próximos 14 dias.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contas Vencidas */}
      {overdueBills.length > 0 && (
        <Card className="group relative overflow-hidden hover:scale-[1.01] transition-all duration-200 animate-fade-in hover:shadow-lg hover:shadow-red-500/5 before:absolute before:inset-0 before:bg-gradient-to-br before:from-red-500/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '100ms' }}>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Contas Vencidas
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              {overdueBills.map((bill, index) => (
                <div 
                  key={bill.id} 
                  className="animate-fade-in group/item relative overflow-hidden hover:scale-[1.02] transition-all duration-200 hover:shadow-lg hover:shadow-red-500/5 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-red-500/10 before:to-transparent before:-translate-x-full group-hover/item:translate-x-full before:transition-transform before:duration-700 pointer-events-none" 
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950/50 dark:border-red-800 relative z-10">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-red-900 dark:text-red-100">{bill.descricao || 'Conta'}</h4>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          Vencimento: {bill.data_vencimento ? format(new Date(bill.data_vencimento), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400">{bill.categoria || 'Categoria'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600 dark:text-red-400">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bill.valor)}
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">Vencida</p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights e Dicas */}
      <Card className="group relative overflow-hidden hover:scale-[1.01] transition-all duration-200 animate-fade-in hover:shadow-lg hover:shadow-primary/5 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '200ms' }}>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Insights e Dicas Financeiras
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : insights.length > 0 ? (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="p-3 bg-surface-2 rounded-lg animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <h4 className="font-medium mb-2">Análise {insight.period}</h4>
                  <div className="space-y-2 text-sm text-text-muted">
                    {insight.spendingChangePercent !== null && (
                      <p>
                        <span className="font-medium">Gastos:</span> 
                        <span className={insight.spendingChangePercent > 0 ? 'text-[#a93838]' : 'text-[#39a85b]'}>
                          {insight.spendingChangePercent > 0 ? '+' : ''}{insight.spendingChangePercent.toFixed(1)}%
                        </span>
                      </p>
                    )}
                    {insight.incomeChangePercent !== null && (
                      <p>
                        <span className="font-medium">Receitas:</span> 
                        <span className={insight.incomeChangePercent > 0 ? 'text-[#39a85b]' : 'text-[#a93838]'}>
                          {insight.incomeChangePercent > 0 ? '+' : ''}{insight.incomeChangePercent.toFixed(1)}%
                        </span>
                      </p>
                    )}
                    {insight.topSpendingIncrease && (
                      <p>
                        <span className="font-medium">Maior gasto:</span> {insight.topSpendingIncrease.category}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Sem insights disponíveis</h3>
              <p className="text-text-muted">
                Adicione mais dados financeiros para receber insights personalizados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gastos por Categoria */}
      {categorySpending.length > 0 && (
        <Card className="group relative overflow-hidden hover:scale-[1.01] transition-all duration-200 animate-fade-in hover:shadow-lg hover:shadow-primary/5 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '300ms' }}>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Gastos por Categoria (Últimos 3 meses)
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-3">
              {categorySpending.slice(0, 5).map((category, index) => (
                <div key={category.name} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex justify-between items-center p-3 bg-surface-elevated rounded-lg hover:bg-surface-hover transition-colors duration-200">
                    <div>
                      <p className="font-medium">{category.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#a93838]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(category.value)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações Recomendadas */}
      <Card className="group relative overflow-hidden hover:scale-[1.01] transition-all duration-200 animate-fade-in hover:shadow-lg hover:shadow-primary/5 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100" style={{ animationDelay: '400ms' }}>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Ações Recomendadas
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-4">
            {upcomingBills.length > 0 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg animate-fade-in">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900">
                      Atenção às Contas Vencendo
                    </h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Você tem {upcomingBills.length} conta(s) vencendo em breve. 
                      Considere pagar antecipadamente para evitar juros.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {overdueBills.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900">
                      Contas Vencidas - Ação Urgente
                    </h4>
                    <p className="text-sm text-red-700 mt-1">
                      Você tem {overdueBills.length} conta(s) vencida(s). 
                      Pague o quanto antes para evitar multas e juros.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {insights.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">
                      Oportunidades de Economia
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Temos {insights.length} insight(s) personalizado(s) para ajudar 
                      você a economizar e otimizar suas finanças.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {upcomingBills.length === 0 && overdueBills.length === 0 && insights.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Parabéns!</h3>
                <p className="text-text-muted">
                  Suas finanças estão em excelente estado. Continue assim!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
