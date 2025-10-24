import { useState } from 'react';
import { Plus, Receipt, Target, CheckSquare, CalendarPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FinanceRecordForm } from '@/components/FinanceRecordForm';
import { GoalForm } from '@/components/GoalForm';
import { TaskForm } from '@/components/TaskForm';
import { EventForm } from '@/components/EventForm';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimizedAgendaData, EventFormData } from '@/hooks/useOptimizedAgendaData';
import { useTasksData, TaskFormData } from '@/hooks/useTasksData';
import { useGoalsData } from '@/hooks/useGoalsData';
import { useFinancialData } from '@/hooks/useFinancialData';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  collapsed?: boolean;
}

export function QuickActions({ collapsed = false }: QuickActionsProps) {
  const { cliente } = useAuth();

  // States for all dialogs
  const [isActionHubOpen, setIsActionHubOpen] = useState(false);
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);

  // Hooks for data and mutations
  const { refetch: refetchFinancialData } = useFinancialData();
  const { refetch: refetchGoals } = useGoalsData();
  const { createTask } = useTasksData();
  const { calendars, createEvent, createCalendar } = useOptimizedAgendaData({
    view: 'month',
    startDate: new Date(),
    endDate: new Date(),
  });

  // Callback handlers
  const handleTransactionSuccess = () => {
    refetchFinancialData();
    setIsTransactionFormOpen(false);
  };

  const handleGoalSuccess = () => {
    refetchGoals();
    setIsGoalFormOpen(false);
  };

  const handleTaskSubmit = (data: TaskFormData) => {
    createTask.mutate(data, {
      onSuccess: () => setIsTaskFormOpen(false),
    });
  };

  const handleEventSubmit = (data: EventFormData) => {
    createEvent.mutate(data, {
      onSuccess: () => setIsEventFormOpen(false),
    });
  };

  const openActionDialog = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setIsActionHubOpen(false);
    setter(true);
  };

  const mainAction = {
    id: 'new-action',
    label: 'Nova Ação',
    icon: Plus,
    onClick: () => setIsActionHubOpen(true),
  };

  const hubActions = [
    {
      label: 'Nova Transação',
      icon: Receipt,
      onClick: () => openActionDialog(setIsTransactionFormOpen),
    },
    {
      label: 'Nova Meta',
      icon: Target,
      onClick: () => openActionDialog(setIsGoalFormOpen),
    },
    {
      label: 'Novo Evento',
      icon: CalendarPlus,
      onClick: () => openActionDialog(setIsEventFormOpen),
    },
    {
      label: 'Nova Tarefa',
      icon: CheckSquare,
      onClick: () => openActionDialog(setIsTaskFormOpen),
    },
  ];

  return (
    <>
      <div className={cn("space-y-2", collapsed ? "px-2" : "px-4")}>
        {!collapsed && (
          <h3 className="text-xs font-semibold text-[hsl(var(--sidebar-text-muted))] uppercase tracking-wider mb-3">
            Ações Rápidas
          </h3>
        )}
        
        <div className="grid grid-cols-1 gap-2">
          <button
            key={mainAction.id}
            onClick={(e) => {
              e.stopPropagation();
              mainAction.onClick();
            }}
            className={cn(
              'group relative overflow-hidden flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              'text-[hsl(var(--sidebar-text-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-text))] hover:scale-105 hover:shadow-lg',
              collapsed && 'justify-center'
            )}
            title={collapsed ? mainAction.label : undefined}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <mainAction.icon className={cn(
              "h-5 w-5 flex-shrink-0 relative z-10 transition-transform group-hover:scale-110"
            )} />
            {!collapsed && (
              <span className="relative z-10">
                {mainAction.label}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Action Hub Dialog */}
      <Dialog open={isActionHubOpen} onOpenChange={setIsActionHubOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Nova Ação</DialogTitle>
            <DialogDescription>Selecione o tipo de registro que você deseja criar.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {hubActions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="group relative overflow-hidden flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 text-[hsl(var(--sidebar-text-muted))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-[hsl(var(--sidebar-text))] hover:scale-105 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                <action.icon className="h-5 w-5 flex-shrink-0 relative z-10 transition-transform group-hover:scale-110" />
                <span className="relative z-10">{action.label}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction Form Dialog */}
      {cliente && (
        <FinanceRecordForm 
          userPhone={cliente.phone}
          open={isTransactionFormOpen}
          onOpenChange={setIsTransactionFormOpen}
          onSuccess={handleTransactionSuccess}
        />
      )}

      {/* Goal Form Dialog */}
      <GoalForm
        open={isGoalFormOpen}
        onOpenChange={setIsGoalFormOpen}
        onSuccess={handleGoalSuccess}
      />

      {/* Task Form Dialog */}
      <TaskForm
        open={isTaskFormOpen}
        onOpenChange={setIsTaskFormOpen}
        onSubmit={handleTaskSubmit}
        isSubmitting={createTask.isPending}
      />

      {/* Event Form Dialog */}
      <EventForm
        open={isEventFormOpen}
        onOpenChange={setIsEventFormOpen}
        onSubmit={handleEventSubmit}
        calendars={calendars}
        createCalendar={createCalendar.mutate}
        isSubmitting={createEvent.isPending}
      />
    </>
  );
}