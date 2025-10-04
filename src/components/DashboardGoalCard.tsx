import { Goal } from '@/hooks/useGoalsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GoalIcon } from './GoalIcons';
import { Target } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardGoalCardProps {
  goal: Goal | null;
}

export function DashboardGoalCard({ goal }: DashboardGoalCardProps) {
  if (!goal) {
    return (
      <Card className="flex flex-col justify-center items-center h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-2">
        <CardHeader>
          <CardTitle>Meta Principal</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-text-muted">
          <Target className="h-8 w-8 mx-auto mb-2" />
          <p>Nenhuma meta principal definida.</p>
        </CardContent>
      </Card>
    );
  }

  const progress = Math.min((goal.valor_atual / goal.valor_meta) * 100, 100);
  const restante = Math.max(goal.valor_meta - goal.valor_atual, 0);

  return (
    <Link to="/metas" className="block h-full">
      <Card className="group relative overflow-hidden h-full hover:scale-105 transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none z-10" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-text-muted">Meta Principal</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center gap-2 pt-2">
            {goal.icone && <GoalIcon name={goal.icone} className="h-6 w-6 text-text" />}
            <p className="text-xl font-bold">{goal.titulo}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Progresso</span>
              <span className="text-sm font-bold">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex justify-between items-baseline">
            <div>
              <p className="text-xs text-text-muted">Atual</p>
              <p className="font-bold text-lg">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.valor_atual)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted">Meta</p>
              <p className="font-bold text-lg">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(goal.valor_meta)}</p>
            </div>
          </div>
          <div className="text-xs text-text-muted text-center border-t pt-2">
            Faltam {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(restante)}
            {goal.prazo_meses && ` • ${goal.prazo_meses} meses restantes`}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}