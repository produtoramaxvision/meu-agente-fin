import { useNavigate } from 'react-router-dom';
import { useTasksData, Task } from '@/hooks/useTasksData';
import { differenceInDays, format, isToday, parseISO } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export function UpcomingTasksCard() {
  const navigate = useNavigate();
  const { tasks, isLoading } = useTasksData('all');

  // Filter and sort upcoming tasks
  const upcomingTasks = tasks
    .filter((task) => task.status !== 'done' && task.due_date)
    .sort((a, b) => {
      const dateA = new Date(a.due_date!);
      const dateB = new Date(b.due_date!);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 10);

  const getDueDateInfo = (dueDate: string) => {
    const date = parseISO(dueDate);
    const daysRemaining = differenceInDays(date, new Date());

    if (daysRemaining < 0) {
      return { text: `Atrasada ${-daysRemaining}d`, color: 'text-red-500', bgColor: 'bg-red-500/10' };
    }
    if (isToday(date)) {
      return { text: 'Hoje', color: 'text-yellow-600', bgColor: 'bg-yellow-500/10' };
    }
    if (daysRemaining === 1) {
      return { text: 'Amanhã', color: 'text-yellow-600', bgColor: 'bg-yellow-500/10' };
    }
    if (daysRemaining <= 3) {
      return { text: `${daysRemaining}d`, color: 'text-orange-500', bgColor: 'bg-orange-500/10' };
    }
    return { text: `${daysRemaining}d`, color: 'text-text-muted', bgColor: 'bg-muted/50' };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default:
        return 'bg-muted text-text-muted border-border';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return priority;
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 leading-normal">
            <Clock className="h-5 w-5" />
            Tarefas Urgentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in hover:shadow-lg transition-all duration-300 border-border/40 min-h-[480px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between leading-normal">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-700" />
            <span className="bg-gradient-to-br from-text via-brand-700 to-brand-500 bg-clip-text text-transparent">
              Tarefas Urgentes
            </span>
          </div>
          {upcomingTasks.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {upcomingTasks.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 flex flex-col custom-scrollbar smooth-scrollbar overflow-y-auto max-h-[400px]">
        {upcomingTasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500/70 mb-3" />
            <p className="text-sm text-text-muted">Nenhuma tarefa urgente!</p>
            <p className="text-xs text-text-muted mt-1">Continue assim 🎉</p>
          </div>
        ) : (
          <>
            {upcomingTasks.map((task, index) => {
              const dueDateInfo = getDueDateInfo(task.due_date!);
              return (
                <div
                  key={task.id}
                  className="group p-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-accent/5 transition-all cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => navigate('/tarefas')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {task.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getPriorityColor(task.priority)}`}
                        >
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        {task.category && (
                          <span className="text-xs text-text-muted">{task.category}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${dueDateInfo.bgColor} ${dueDateInfo.color}`}
                      >
                        {dueDateInfo.text.includes('Atrasada') && (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        {dueDateInfo.text}
                      </div>
                      <span className="text-[10px] text-text-muted">
                        {format(parseISO(task.due_date!), 'dd/MM')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            <Button
              variant="ghost"
              className="w-full mt-2 group hover:bg-primary/5"
              onClick={() => navigate('/tarefas')}
            >
              <span className="flex items-center gap-2 text-sm">
                Ver todas as tarefas
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}