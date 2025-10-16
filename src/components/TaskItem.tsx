import { useState } from 'react';
import { Task } from '@/hooks/useTasksData';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ContextMenu, 
  ContextMenuContent, 
  ContextMenuItem, 
  ContextMenuTrigger 
} from '@/components/ui/context-menu';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Edit, Trash2, Copy, Calendar, Flag, Tag, Undo2 } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { TaskForm } from '@/components/TaskForm';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onMarkIncomplete?: (task: Task) => void;
}

const priorityConfig = {
  low: { label: 'Baixa', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' },
  medium: { label: 'Média', color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20' },
  high: { label: 'Alta', color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' },
};

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20' },
  done: { label: 'Concluída', color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' },
  overdue: { label: 'Vencida', color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' },
};

export function TaskItem({ task, onToggleComplete, onEdit, onDelete, onDuplicate, onMarkIncomplete }: TaskItemProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getDueDateInfo = () => {
    if (!task.due_date) return null;

    const dueDate = new Date(task.due_date);
    const isOverdue = isPast(dueDate) && !isToday(dueDate) && task.status !== 'done';

    if (isToday(dueDate)) {
      return { text: 'Vence hoje', color: 'text-yellow-600 dark:text-yellow-500 font-semibold' };
    }
    if (isTomorrow(dueDate)) {
      return { text: 'Vence amanhã', color: 'text-yellow-600 dark:text-yellow-500' };
    }
    if (isOverdue) {
      return { text: 'Vencida', color: 'text-red-600 dark:text-red-500 font-semibold' };
    }

    return {
      text: format(dueDate, 'dd/MM/yyyy', { locale: ptBR }),
      color: 'text-text-muted',
    };
  };

  const dueDateInfo = getDueDateInfo();
  const isDone = task.status === 'done';

  // Handlers para diferentes tipos de clique
  const handleSingleClick = (e: React.MouseEvent) => {
    // Clique simples não faz nada - apenas previne propagação se necessário
    e.preventDefault();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setPopoverOpen(true);
  };


  const handleFormSubmit = (data: any) => {
    onEdit({ ...task, ...data });
    setPopoverOpen(false);
    setIsEditing(false);
  };

  const handlePopoverClose = () => {
    setPopoverOpen(false);
    setIsEditing(false);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={cn(
              'group relative overflow-hidden rounded-lg bg-surface border transition-all duration-200 hover:shadow-md hover:border-primary/20 p-4 cursor-pointer',
              isDone && 'opacity-60'
            )}
            onClick={handleSingleClick}
            onDoubleClick={handleDoubleClick}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

            <div className="flex items-start gap-2 sm:gap-3 relative z-10">
              <Checkbox
                checked={isDone}
                onCheckedChange={() => onToggleComplete(task)}
                className="mt-1 transition-all duration-200 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              />

              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={cn(
                      'font-semibold text-sm sm:text-base leading-snug truncate',
                      isDone && 'line-through text-text-muted'
                    )}
                  >
                    {task.title}
                  </h3>
                  <Badge variant="outline" className={cn('flex-shrink-0 text-xs', priorityConfig[task.priority].color)}>
                    <Flag className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">{priorityConfig[task.priority].label}</span>
                    <span className="sm:hidden">{priorityConfig[task.priority].label.charAt(0)}</span>
                  </Badge>
                </div>

                {task.description && (
                  <p className={cn('text-sm text-text-muted line-clamp-2', isDone && 'line-through')}>
                    {task.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs">
                  {dueDateInfo && (
                    <div className={cn('flex items-center gap-1', dueDateInfo.color)}>
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{dueDateInfo.text}</span>
                    </div>
                  )}

                  {task.category && (
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      <Tag className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">{task.category}</span>
                      <span className="sm:hidden truncate max-w-[60px]">{task.category}</span>
                    </Badge>
                  )}

                  <Badge variant="outline" className={cn('text-xs flex-shrink-0', statusConfig[task.status].color)}>
                    <span className="hidden sm:inline">{statusConfig[task.status].label}</span>
                    <span className="sm:hidden">{statusConfig[task.status].label.charAt(0)}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => onEdit(task)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onDuplicate(task)}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicar
          </ContextMenuItem>
          {isDone && onMarkIncomplete && (
            <ContextMenuItem onClick={() => onMarkIncomplete(task)}>
              <Undo2 className="mr-2 h-4 w-4" />
              Desmarcar Concluída
            </ContextMenuItem>
          )}
          <ContextMenuItem 
            onClick={() => onDelete(task)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverContent className="w-96 p-0" align="start">
          <TaskForm
            open={isEditing}
            onOpenChange={handlePopoverClose}
            onSubmit={handleFormSubmit}
            taskToEdit={task}
            isSubmitting={false}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}