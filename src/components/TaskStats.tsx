import { Task } from '@/hooks/useTasksData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const overdue = tasks.filter((t) => t.status === 'overdue').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, overdue, completionRate };
  }, [tasks]);

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      <Card className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 py-3">
          <CardTitle className="text-xs sm:text-sm font-medium text-text-muted">Total de Tarefas</CardTitle>
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary transition-all duration-300 group-hover:scale-110" />
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-lg sm:text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 py-3">
          <CardTitle className="text-xs sm:text-sm font-medium text-text-muted">Concluídas</CardTitle>
          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 transition-all duration-300 group-hover:scale-110" />
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-lg sm:text-2xl font-bold text-green-500">{stats.completed}</div>
          <p className="text-xs text-text-muted mt-1">{stats.completionRate}% de conclusão</p>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 py-3">
          <CardTitle className="text-xs sm:text-sm font-medium text-text-muted">Pendentes</CardTitle>
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 transition-all duration-300 group-hover:scale-110" />
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2 px-3 py-3">
          <CardTitle className="text-xs sm:text-sm font-medium text-text-muted">Vencidas</CardTitle>
          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 transition-all duration-300 group-hover:scale-110" />
        </CardHeader>
        <CardContent className="px-3 pb-3">
          <div className="text-lg sm:text-2xl font-bold text-red-500">{stats.overdue}</div>
        </CardContent>
      </Card>
    </div>
  );
}